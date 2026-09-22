import React from 'react';
import { Laptop, Smartphone, LogOut, ShieldCheck } from 'lucide-react';

const brandGreen = '#3e6b36';

export function timeAgo(isoString) {
  if (!isoString) return '';
  const diffMs = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// One row in a device list, shared by the logged-in "manage devices" modal and the
// login-time "too many devices" screen - keeps both surfaces visually consistent.
const DeviceRow = ({ session, onLogout, busy }) => {
  const isMobile = session.os === 'Android' || session.os === 'iOS';
  const Icon = isMobile ? Smartphone : Laptop;
  const isCurrent = session.status === 'current' || session.current;

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: '12px', padding: '12px',
        border: `1px solid ${isCurrent ? brandGreen : '#e5e7eb'}`,
        borderRadius: '10px', background: isCurrent ? '#f1f4ed' : '#fff',
      }}
    >
      <Icon size={20} color={isCurrent ? brandGreen : '#6b7280'} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>
          {session.deviceName || 'Unknown device'}
          {isCurrent && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, color: brandGreen }}>
              <ShieldCheck size={12} /> This device
            </span>
          )}
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          {session.browser && session.os ? `${session.browser} · ${session.os}` : ''}
          {session.ipAddress ? ` · ${session.ipAddress}` : ''}
          {' · '}Last active {timeAgo(session.lastActiveAt)}
        </div>
      </div>
      {onLogout && !isCurrent && (
        <button
          onClick={() => onLogout(session.id)}
          disabled={busy}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px',
            background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '8px',
            fontSize: '12px', fontWeight: 600, cursor: busy ? 'not-allowed' : 'pointer',
            opacity: busy ? 0.6 : 1,
          }}
        >
          <LogOut size={14} />
          {busy ? 'Logging out…' : 'Log out'}
        </button>
      )}
    </div>
  );
};

export default DeviceRow;
