"use client";

import React, { useState } from "react";
import Countdown from "./components/Countdown";
import RandomWord from "./components/RandomWord";
import Finish from "./components/Finish";
import "./components/Page.css";

const Page = () => {
  const [stage, setStage] = useState("start");

  // 将来的に「回数」や「範囲」をここから調整できるようにしておくと、
  // フリーランスとしての「保守性の高いコード」になります。
  const CONFIG = {
    totalCounts: 7,//表示回数
    interval: 1000 // 1秒間隔
  };

  return (
    <div className="app-container">
      {stage === "start" && (
        <div className="start-container">
          <button
            className="start-button"
            onClick={() => setStage("countdown")}
          >
            Pass reaction
          </button>
        </div>
      )}

      {stage === "countdown" && (
        <Countdown
          onFinish={() => setStage("random")} // ルールの受け渡しを廃止
        />
      )}

      {stage === "random" && (
        <RandomWord
          countLimit={CONFIG.totalCounts}
          onFinish={() => setStage("finish")}
        />
      )}

      {stage === "finish" && <Finish onRestart={() => setStage("start")} />}
    </div>
  );
};

export default Page;