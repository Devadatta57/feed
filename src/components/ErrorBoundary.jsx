import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Unhandled render error:', error, info);
  }

  handleReload = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          fontFamily: 'sans-serif',
          padding: '24px',
          textAlign: 'center'
        }}>
          <h2>Something went wrong.</h2>
          <p style={{ color: '#6b7280' }}>Please try returning to the home page.</p>
          <button
            onClick={this.handleReload}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: '#3e6b36',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Back to Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
