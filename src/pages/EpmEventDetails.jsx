import React from 'react';

const EpmEventDetails = ({ onNavigate, eventId }) => {
  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Event Details</h1>
      <p>Details for event ID: {eventId}</p>
      <button onClick={() => onNavigate('epm-details')}>Back to Directory</button>
    </div>
  );
};

export default EpmEventDetails;
