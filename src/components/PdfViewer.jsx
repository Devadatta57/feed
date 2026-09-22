import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import pdfWorkerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import {
  Menu, Minus, Plus, Maximize, RotateCw,
  Download, Printer
} from 'lucide-react';
import './PdfViewer.css';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;

// Left to itself pdf.js probes the file with a plain GET and then re-fetches it in byte
// ranges, so a single "View Publication" click shows up as two hits on /{id}/file (and leaves
// an aborted request behind on the server). One streamed request per publication is what this
// viewer actually needs. Module-level so the object identity stays stable across renders -
// a fresh object here would make react-pdf reload the document on every render.
const PDF_OPTIONS = { disableRange: true };

const MIN_SCALE = 0.5;
const MAX_SCALE = 2.5;
const SCALE_STEP = 0.1;

/**
 * Renders a PDF entirely in the browser via pdf.js (react-pdf). The backend only ever streams
 * the raw PDF bytes (see publicationsApi.getPublicationFileUrl) - every page image and thumbnail
 * seen here is rasterized client-side from that stream, so the server never has to pre-render or
 * store an image per page.
 */
const PdfViewer = ({ fileUrl, downloadUrl, initialPageCount, onPageChange }) => {
  const [numPages, setNumPages] = useState(initialPageCount || null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [loadError, setLoadError] = useState(null);
  const canvasAreaRef = useRef(null);
  const pageRefs = useRef({});
  const currentPageRef = useRef(1);

  // A different issue was opened - reset the viewer back to page 1 / default zoom.
  useEffect(() => {
    currentPageRef.current = 1;
    setPageNumber(1);
    setScale(1);
    setRotation(0);
    setNumPages(initialPageCount || null);
    setLoadError(null);
    if (canvasAreaRef.current) {
      canvasAreaRef.current.scrollTop = 0;
      canvasAreaRef.current.scrollLeft = 0;
    }
  }, [fileUrl, initialPageCount]);

  useEffect(() => {
    if (onPageChange) onPageChange(pageNumber);
    currentPageRef.current = pageNumber;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber]);

  useEffect(() => {
    const root = canvasAreaRef.current;
    if (!root || !numPages || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visiblePage = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visiblePage) {
          const nextPage = Number(visiblePage.target.dataset.pageNumber);
          if (nextPage && nextPage !== currentPageRef.current) {
            setPageNumber(nextPage);
          }
        }
      },
      {
        root,
        threshold: [0.25, 0.5, 0.75],
      }
    );

    Object.values(pageRefs.current).forEach((pageEl) => {
      if (pageEl) observer.observe(pageEl);
    });

    return () => observer.disconnect();
  }, [numPages, scale, rotation]);

  const onDocumentLoadSuccess = useCallback(({ numPages: loadedPages }) => {
    setNumPages(loadedPages);
    setLoadError(null);
    if (canvasAreaRef.current) {
      canvasAreaRef.current.scrollTop = 0;
      canvasAreaRef.current.scrollLeft = 0;
    }
  }, []);

  // Keep the actual pdf.js failure (HTTP status, CORS rejection, worker mismatch, corrupt
  // file...) instead of swallowing it behind a generic panel - a bare "could not be loaded"
  // with nothing behind it is what made this impossible to diagnose.
  const onDocumentLoadError = useCallback((error) => {
    console.error('[PdfViewer] pdf.js could not load the document:', error);
    setLoadError(error);
  }, []);

  const goToPage = (target) => {
    const clamped = Math.min(Math.max(target, 1), numPages || target);
    currentPageRef.current = clamped;
    setPageNumber(clamped);
    pageRefs.current[clamped]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const zoomIn = () => setScale((s) => Math.min(MAX_SCALE, +(s + SCALE_STEP).toFixed(2)));
  const zoomOut = () => setScale((s) => Math.max(MIN_SCALE, +(s - SCALE_STEP).toFixed(2)));
  const resetZoom = () => setScale(1);
  const rotate = () => setRotation((r) => (r + 90) % 360);

  const handlePrint = () => {
    const printWindow = window.open(fileUrl, '_blank');
    if (printWindow) {
      printWindow.addEventListener('load', () => printWindow.print());
    }
  };

  return (
    <div className="pdf-viewer">
      <div className="pdf-toolbar">
        <div className="pdf-toolbar-group">
          <button
            type="button"
            className="pdf-tool-btn"
            title="Pages"
            aria-label="Pages"
          >
            <Menu size={18} />
          </button>
          <span className="pdf-page-indicator">
            <input
              type="number"
              min={1}
              max={numPages || 1}
              value={pageNumber}
              onChange={(e) => goToPage(Number(e.target.value) || 1)}
            />
            <span className="pdf-page-total">/ {numPages || '-'}</span>
          </span>
        </div>

        <div className="pdf-toolbar-group">
          <button type="button" className="pdf-tool-btn" title="Zoom out" onClick={zoomOut}>
            <Minus size={16} />
          </button>
          <button type="button" className="pdf-zoom-value" title="Reset zoom" onClick={resetZoom}>
            {Math.round(scale * 100)}%
          </button>
          <button type="button" className="pdf-tool-btn" title="Zoom in" onClick={zoomIn}>
            <Plus size={16} />
          </button>
          <button type="button" className="pdf-tool-btn" title="Fit to page" onClick={resetZoom}>
            <Maximize size={16} />
          </button>
          <button type="button" className="pdf-tool-btn" title="Rotate" onClick={rotate}>
            <RotateCw size={16} />
          </button>
        </div>

        <div className="pdf-toolbar-group">
          <a className="pdf-tool-btn" href={downloadUrl} title="Download">
            <Download size={16} />
          </a>
          <button type="button" className="pdf-tool-btn" title="Print" onClick={handlePrint}>
            <Printer size={16} />
          </button>
        </div>
      </div>

      <Document
        file={fileUrl}
        options={PDF_OPTIONS}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={<div className="pdf-status">Loading publication…</div>}
        error={
          <div className="pdf-status pdf-status-error">
            This PDF could not be loaded.
            {loadError && loadError.message && (
              <div className="pdf-status-detail">{loadError.message}</div>
            )}
          </div>
        }
      >
        <div className="pdf-canvas-area" ref={canvasAreaRef}>
          {numPages > 0 &&
            Array.from({ length: numPages }, (_, i) => i + 1).map((n) => (
              <div
                key={n}
                ref={(el) => {
                  pageRefs.current[n] = el;
                }}
                className="pdf-page-frame"
                data-page-number={n}
              >
                <Page
                  pageNumber={n}
                  scale={scale}
                  rotate={rotation}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  loading={<div className="pdf-page-loading">Loading page {n}…</div>}
                />
              </div>
            ))}
        </div>
      </Document>
    </div>
  );
};

export default PdfViewer;
