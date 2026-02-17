"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';

const DIRECTIONS = {
  '↑': { dx: 0, dy: 1 },
  'Go': { dx: 0, dy: -1 },
  '↗︎': { dx: 1, dy: 1 },
  '↖︎': { dx: -1, dy: 1 },
  'stay': { dx: 0, dy: 0 }
};

const RandomWord = ({ countLimit, onFinish }) => {
  // 1. 初期値を "Go!" に固定し、最初から描画対象を作る（チラつき防止）
  const [currentWord, setCurrentWord] = useState('Go!'); 
  const [step, setStep] = useState(0);

  // 2. 4reaction版を参考に useRef で位置を管理（再レンダリングに依存しない正確な計算）
  const pos = useRef({ x: 0, y: 1 });
  const lastDirKey = useRef("");

  // 3. 次の方向を計算するロジックを useCallback でメモ化
  const getNextDirection = useCallback(() => {
    const keys = Object.keys(DIRECTIONS);
    const validOptions = keys.filter(key => {
      const move = DIRECTIONS[key];
      const nextX = pos.current.x + move.dx;
      const nextY = pos.current.y + move.dy;

      // 境界判定（アサイメントの範囲内か）
      const isWithinBounds = nextX >= -3 && nextX <= 3 && nextY >= 0 && nextY <= 3;
      // 1回目にstayを出さない（リアクションの遅れを排除）
      const isNotFirstStay = !(step === 0 && key === 'stay');
      // 連続で同じ方向に行かない（切り返しを強制）
      const isNotConsecutive = key !== lastDirKey.current;

      return isWithinBounds && isNotFirstStay && isNotConsecutive;
    });

    return validOptions.length > 0 
      ? validOptions[Math.floor(Math.random() * validOptions.length)]
      : 'stay';
  }, [step]);

  useEffect(() => {
    // 【ドリル終了フェーズ】4reaction版の「1.2秒の余韻」を再現
    if (step >= countLimit) {
      setCurrentWord('Over!'); 
      const finalTimer = setTimeout(onFinish, 1200); // 1.2秒待ってからFinish画面へ
      return () => clearTimeout(finalTimer);
    }

    // 【ドリル進行フェーズ】
    // 初回（Go!）は0.5秒、それ以降は1.0s〜1.4sのランダムな遅延
    const delay = step === 0 
      ? 500 
      : Math.floor(Math.random() * (1400 - 1000 + 1)) + 1000;

    const timer = setTimeout(() => {
      const nextDir = getNextDirection();

      setCurrentWord(nextDir);
      // useRef の値を更新
      pos.current = {
        x: pos.current.x + DIRECTIONS[nextDir].dx,
        y: pos.current.y + DIRECTIONS[nextDir].dy
      };
      lastDirKey.current = nextDir;
      
      setStep(prev => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [step, countLimit, onFinish, getNextDirection]);

  return (
    <div className="fullscreen-text">
      {currentWord}
    </div>
  );
};

export default RandomWord;