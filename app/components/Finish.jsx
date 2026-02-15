"use client";

import React, { useEffect } from "react";
import "./Page.css";

const Finish = ({ onRestart }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRestart();
    }, 2000); // 2秒表示したら戻る

    return () => clearTimeout(timer);
  }, [onRestart]);

  return <div className="fullscreen-text">Over!</div>;
};

export default Finish;
