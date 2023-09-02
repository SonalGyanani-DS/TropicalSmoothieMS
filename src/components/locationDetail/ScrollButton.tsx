import * as React from "react";
import { useState, useEffect } from 'react';
import { FaArrowCircleUp } from 'react-icons/fa';

const ScrollButton = () => {
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    setVisible(scrolled > 300);
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisible);
    return () => {
      window.removeEventListener('scroll', toggleVisible);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div>
      {visible && (
        <button className="scrollToTopButton" onClick={scrollToTop}>
          <FaArrowCircleUp />
        </button>
      )}
      {/* Your other content goes here */}
    </div>
  );
};

export default ScrollButton;