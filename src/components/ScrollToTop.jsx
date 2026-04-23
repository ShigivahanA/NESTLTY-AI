import { useEffect } from "react";

export default function ScrollToTop() {
  useEffect(() => {
    // We remove the live 'useLocation' listener to prevent 
    // premature scrolling before the transition mask is full.
    // Instead, we rely on the parent component triggering 
    // a re-mount via 'key' synchronicity.
    window.scrollTo(0, 0);
  }, []);

  return null;
}
