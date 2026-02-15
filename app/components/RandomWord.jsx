"use client";
import React, { useState, useEffect } from 'react';

const DIRECTIONS = {
  '↑': { dx: 0, dy: 1 },
  '↓': { dx: 0, dy: -1 },
  '↗︎': { dx: 1, dy: 1 },
  '↖︎': { dx: -1, dy: 1 },
  'stay': { dx: 0, dy: 0 }
};

const RandomWord = ({ countLimit, onFinish }) => {
  // 初期値を '' ではなく、一瞬だけ表示されても違和感のない文字、
  // あるいは「Go!」の残像を維持するために空文字にします。
  const [currentWord, setCurrentWord] = useState(''); 
  const [count, setCount] = useState(0);
  const [pos, setPos] = useState({ x: 0, y: 1 });

  useEffect(() => {
    if (count >= countLimit) {
      onFinish();
      return;
    }

    // ここが肝：初回（count 0）の処理を極限まで速くする
    const delay = count === 0 ? 0 : 1000;

    const timer = setTimeout(() => {
      const keys = Object.keys(DIRECTIONS);
      const validDirections = keys.filter(key => {
        const move = DIRECTIONS[key];
        const nextX = pos.x + move.dx;
        const nextY = pos.y + move.dy;
        const isWithinBounds = nextX >= -3 && nextX <= 3 && nextY >= 0 && nextY <= 3;
        const isNotFirstStay = !(count === 0 && key === 'stay');
        const isNotConsecutive = key !== currentWord;
        return isWithinBounds && isNotFirstStay && isNotConsecutive;
      });

      const nextDir = validDirections.length > 0 
        ? validDirections[Math.floor(Math.random() * validDirections.length)]
        : 'stay';

      setCurrentWord(nextDir);
      setPos(prev => ({
        x: prev.x + DIRECTIONS[nextDir].dx,
        y: prev.y + DIRECTIONS[nextDir].dy
      }));
      setCount(prev => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [count, countLimit, onFinish, pos, currentWord]);

  // 【重要】 return null; をやめる
  // 何も出さない瞬間を作らず、常にコンテナを維持する
  return (
    <div className="fullscreen-text">
      {currentWord}
    </div>
  );
};

export default RandomWord;