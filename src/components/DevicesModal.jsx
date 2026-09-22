import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import DeviceRow from './DeviceRow';

// Minimum gap kept between the popover and every viewport edge.
const EDGE_MARGIN = 12;
const MAX_WIDTH = 440;
const MIN_HEIGHT = 160;

// DevicesModal is an anchored popover (not a full-screen modal) - it has no page-dimming
// backdrop, so it must position and clamp itself against the viewport directly, and close
// itself on an outside click the same way the other Navbar dropdowns do.
const DevicesModal = ({ onClose, anchorRef }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [revokingId, setRevokingId] = useState(null);
  const [pos, setPos] = useState(null);
  const popRef = useRef(null);

  const computePosition = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const rect = anchorRef?.current?.getBoundingClientRect();
    const anchorBottom = rect ? rect.bottom : EDGE_MARGIN + 44;
    const anchorRight = rect ? rect.right : vw - EDGE_MARGIN;

    const width = Math.min(MAX_WIDTH, vw - EDGE_MARGIN * 2);

    // Align the popover's right edge with the trigger's right edge, but never let its
    // left edge cross the viewport's left margin (matters most on narrow/mobile widths).
    let right = Math.max(EDGE_MARGIN, vw - anchorRight);
    const maxRight = vw - width - EDGE_MARGIN;
    if (right > maxRight) right = Math.max(EDGE_MARGIN, maxRight);

    // Sit just below the trigger; if that would leave no room above the bottom edge,
    // pin it higher instead of letting it run off-screen.
    let top = anchorBottom + 10;
    if (top + MIN_HEIGHT + EDGE_MARGIN > vh) {
      top = Math.max(EDGE_MARGIN, vh - MIN_HEIGHT - EDGE_MARGIN);
    }
    const maxHeight = Math.max(MIN_HEIGHT, vh - top - EDGE_MARGIN);

    setPos({ top, right, width, maxHeight });
  };

  useLayoutEffect(() => {
    computePosition();
    window.addEventListener('resize', computePosition);
    return () => window.removeEventListener('resize', computePosition);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popRef.current && !popRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const fetchSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('jwt');
      const res = await fetch(`http://${window.location.hostname}:8080/api/auth/sessions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        setSessions(data?.sessions || []);
      } else {
        setError(data?.error || 'Could not load devices.');
      }
    } catch (e) {
      setError('Network error. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleRevoke = async (id) => {
    setRevokingId(id);
    try {
      const token = localStorage.getItem('jwt');
      const res = await fetch(`http://${window.location.hostname}:8080/api/auth/sessions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setSessions((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (e) {
      // Leave the list as-is; the user can retry.
    } finally {
      setRevokingId(null);
    }
  };

  // Skip the first paint until we know where the trigger actually is, so the popover
  // never flashes at (0,0) before snapping into its real position.
  if (!pos) return null;

  // Portal straight to <body>: the trigger lives inside the navbar's `position: fixed`
  // wrapper, which carries a `transform` for its scroll-hide animation. Any transform
  // turns that ancestor into the containing block for fixed-position descendants, which
  // silently clips/mispositions this popover if it's rendered in place instead.
  return createPortal(
    <div
      ref={popRef}
      style={{
        position: 'fixed',
        top: `${pos.top}px`,
        right: `${pos.right}px`,
        width: `${pos.width}px`,
        maxHeight: `${pos.maxHeight}px`,
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 2100,
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: '20px 24px 12px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#1a1a1a' }}>Logged-in devices</h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>
        <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
          You can be logged in on up to 3 devices at once. Log out of one below to free up a slot.
        </p>
      </div>

      <div style={{ padding: '0 24px 20px', overflowY: 'auto', minHeight: 0 }}>
        {loading && <div style={{ padding: '24px 0', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>Loading…</div>}
        {error && <div style={{ padding: '12px', background: '#fef2f2', color: '#991b1b', borderRadius: '8px', fontSize: '13px' }}>{error}</div>}

        {!loading && !error && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {sessions.map((s) => (
              <DeviceRow key={s.id} session={s} onLogout={handleRevoke} busy={revokingId === s.id} />
            ))}
            {sessions.length === 0 && (
              <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '13px', padding: '16px 0' }}>
                No active devices found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default DevicesModal;
