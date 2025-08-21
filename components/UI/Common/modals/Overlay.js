import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const Overlay = ({ onClick, children }) => {
  const [isMounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return createPortal(
    <>
      {/* overlay */}
      <div
        className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-10 z-30"
        onClick={onClick}
      ></div>
      {/* object  */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bas z-40">
        {children}
      </div>
    </>,
    document.getElementById('overlay')
  );
};

export default Overlay;
