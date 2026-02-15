"use client";
import React, { useState, useEffect } from "react";

const Countdown = ({ onFinish }) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count > 0) {
      // 3, 2, 1 のカウントダウン
      const timer = setTimeout(() => {
        setCount((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (count === 0) {
      // "Go!" と表示されている状態で1秒待機してから交代
      const timer = setTimeout(() => {
        onFinish(); // ここで親の stage を切り替える
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [count, onFinish]);

  return (
    <div className="fullscreen-text">
      {/* 0になったら "Go!" を出し、それ以外は数字を出す。-1にはさせない */}
      {count === 0 ? "Go!" : count}
    </div>
  );
};

export default Countdown;