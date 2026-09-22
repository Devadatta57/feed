import { useEffect } from 'react';

// This app has no react-router-dom - navigation is a `currentPage` string in App.jsx plus
// several pages/panels that swap their own main content via local state (a tab, a step, a
// selected item). Call this with whatever value identifies "which screen is showing" for a
// given component, and the window scroll position resets to the top every time it changes -
// the same behavior a router-level ScrollToTop would give, applied at each real navigation root.
export default function useScrollToTop(key) {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [key]);
}
