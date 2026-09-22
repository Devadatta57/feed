import React, { useRef, useState } from 'react';
import {
  Building2, Globe, FileBadge2, CreditCard, QrCode, Camera,
  UploadCloud, CheckCircle2, X, FileText, Landmark, Save, Sparkles
} from 'lucide-react';
import './MyDetailsForm.css';

const initialDetails = {
  name: 'Green Valley Farmers Producer Company',
  website: '',
  gstNo: '',
  pan: '',
  regCertificate: null,
  accountHolder: '',
  accountNumber: '',
  ifsc: '',
  bankName: '',
  logo: null,
  qrCode: null,
};

const FIELD_KEYS = ['name', 'website', 'gstNo', 'pan', 'regCertificate', 'accountHolder', 'accountNumber', 'ifsc', 'bankName', 'logo', 'qrCode'];

const MyDetailsForm = () => {
  const [details, setDetails] = useState(initialDetails);
  const [savedToast, setSavedToast] = useState(false);
  const logoInputRef = useRef(null);
  const qrInputRef = useRef(null);
  const certInputRef = useRef(null);

  const filledCount = FIELD_KEYS.filter(key => {
    const v = details[key];
    return v !== null && v !== undefined && v !== '';
  }).length;
  const completeness = Math.round((filledCount / FIELD_KEYS.length) * 100);

  const setField = (key, value) => setDetails(prev => ({ ...prev, [key]: value }));

  const handleImageSelect = (key, file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setDetails(prev => {
      if (prev[key]?.url) URL.revokeObjectURL(prev[key].url);
      return { ...prev, [key]: { name: file.name, url } };
    });
  };

  const handleCertSelect = (file) => {
    if (!file) return;
    setField('regCertificate', { name: file.name, size: (file.size / 1024).toFixed(0) + ' KB' });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2600);
  };

  return (
    <form className="mdf-wrapper" onSubmit={handleSave}>
      <div className="mdf-header">
        <div>
          <h2 className="mdf-title">My Details</h2>
          <p className="mdf-subtitle">Keep your organization's identity, statutory and banking information up to date.</p>
        </div>
        <div className="mdf-completeness">
          <div className="mdf-ring" style={{ '--pct': completeness }}>
            <span>{completeness}%</span>
          </div>
          <div className="mdf-completeness-text">
            <strong>Profile strength</strong>
            <span>{completeness < 100 ? 'A few details are missing' : 'All set — looking great!'}</span>
          </div>
        </div>
      </div>

      <div className="mdf-grid">
        {/* Organization Identity */}
        <section className="mdf-card mdf-card-wide">
          <div className="mdf-card-head">
            <span className="mdf-card-icon indigo"><Building2 size={18} /></span>
            <div>
              <h3>Organization Identity</h3>
              <p>Your public-facing name, logo and website</p>
            </div>
          </div>

          <div className="mdf-identity-row">
            <div className="mdf-logo-upload" onClick={() => logoInputRef.current?.click()}>
              {details.logo ? (
                <img src={details.logo.url} alt="Logo" />
              ) : (
                <>
                  <Camera size={22} />
                  <span>Upload Logo</span>
                </>
              )}
              <div className="mdf-logo-edit-badge"><Camera size={13} /></div>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleImageSelect('logo', e.target.files?.[0])}
              />
            </div>

            <div className="mdf-identity-fields">
              <label className="mdf-field">
                <span>Organization Name</span>
                <input
                  type="text"
                  value={details.name}
                  onChange={(e) => setField('name', e.target.value)}
                  placeholder="Enter your organization name"
                />
              </label>
              <label className="mdf-field">
                <span>Website</span>
                <div className="mdf-input-icon">
                  <Globe size={16} />
                  <input
                    type="url"
                    value={details.website}
                    onChange={(e) => setField('website', e.target.value)}
                    placeholder="https://yourcooperative.com"
                  />
                </div>
              </label>
            </div>
          </div>
        </section>

        {/* Statutory Details */}
        <section className="mdf-card">
          <div className="mdf-card-head">
            <span className="mdf-card-icon violet"><FileBadge2 size={18} /></span>
            <div>
              <h3>Statutory Details</h3>
              <p>GST, PAN & registration certificate</p>
            </div>
          </div>

          <label className="mdf-field">
            <span>GST No.</span>
            <input
              type="text"
              value={details.gstNo}
              onChange={(e) => setField('gstNo', e.target.value.toUpperCase())}
              placeholder="22AAAAA0000A1Z5"
              maxLength={15}
            />
          </label>

          <label className="mdf-field">
            <span>PAN</span>
            <input
              type="text"
              value={details.pan}
              onChange={(e) => setField('pan', e.target.value.toUpperCase())}
              placeholder="AAAAA0000A"
              maxLength={10}
            />
          </label>

          <div className="mdf-field">
            <span>Registration Certificate</span>
            {details.regCertificate ? (
              <div className="mdf-file-chip">
                <FileText size={15} />
                <span className="mdf-file-chip-name">{details.regCertificate.name}</span>
                <span className="mdf-file-chip-size">{details.regCertificate.size}</span>
                <CheckCircle2 size={15} className="mdf-file-chip-check" />
                <button type="button" className="mdf-file-chip-remove" onClick={() => setField('regCertificate', null)}>
                  <X size={13} />
                </button>
              </div>
            ) : (
              <div className="mdf-dropzone" onClick={() => certInputRef.current?.click()}>
                <UploadCloud size={18} />
                <span>Click to upload PDF or image</span>
              </div>
            )}
            <input
              ref={certInputRef}
              type="file"
              accept=".pdf,image/*"
              hidden
              onChange={(e) => handleCertSelect(e.target.files?.[0])}
            />
          </div>
        </section>

        {/* Bank Details */}
        <section className="mdf-card">
          <div className="mdf-card-head">
            <span className="mdf-card-icon emerald"><Landmark size={18} /></span>
            <div>
              <h3>Bank Details</h3>
              <p>For settlements and payouts</p>
            </div>
          </div>

          <label className="mdf-field">
            <span>Account Holder Name</span>
            <input
              type="text"
              value={details.accountHolder}
              onChange={(e) => setField('accountHolder', e.target.value)}
              placeholder="As per bank records"
            />
          </label>
          <div className="mdf-field-row">
            <label className="mdf-field">
              <span>Account Number</span>
              <input
                type="text"
                value={details.accountNumber}
                onChange={(e) => setField('accountNumber', e.target.value.replace(/\D/g, ''))}
                placeholder="XXXXXXXXXXXX"
              />
            </label>
            <label className="mdf-field">
              <span>IFSC Code</span>
              <input
                type="text"
                value={details.ifsc}
                onChange={(e) => setField('ifsc', e.target.value.toUpperCase())}
                placeholder="SBIN0001234"
                maxLength={11}
              />
            </label>
          </div>
          <label className="mdf-field">
            <span>Bank Name</span>
            <div className="mdf-input-icon">
              <CreditCard size={16} />
              <input
                type="text"
                value={details.bankName}
                onChange={(e) => setField('bankName', e.target.value)}
                placeholder="e.g. State Bank of India"
              />
            </div>
          </label>
        </section>

        {/* QR Code */}
        <section className="mdf-card">
          <div className="mdf-card-head">
            <span className="mdf-card-icon rose"><QrCode size={18} /></span>
            <div>
              <h3>Payment QR Code</h3>
              <p>Shown to members & buyers for quick payments</p>
            </div>
          </div>

          <div className="mdf-qr-upload" onClick={() => qrInputRef.current?.click()}>
            {details.qrCode ? (
              <img src={details.qrCode.url} alt="QR Code" />
            ) : (
              <>
                <QrCode size={30} />
                <span>Upload QR Code</span>
                <small>PNG or JPG, up to 2MB</small>
              </>
            )}
          </div>
          <input
            ref={qrInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => handleImageSelect('qrCode', e.target.files?.[0])}
          />
        </section>
      </div>

      <div className="mdf-action-bar">
        <span className="mdf-action-hint"><Sparkles size={14} /> Changes are saved to your organization profile</span>
        <div className="mdf-action-buttons">
          <button type="button" className="mdf-btn-ghost" onClick={() => setDetails(initialDetails)}>Discard</button>
          <button type="submit" className="mdf-btn-primary"><Save size={16} /> Save Changes</button>
        </div>
      </div>

      <div className={`mdf-toast ${savedToast ? 'show' : ''}`}>
        <CheckCircle2 size={16} /> Profile updated successfully
      </div>
    </form>
  );
};

export default MyDetailsForm;
