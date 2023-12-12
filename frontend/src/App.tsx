import React, { useState } from "react";
import "./App.css";

import { CreateOrJoinGame, GameRoom } from "@/components";
import { ViewState } from "@/types";
import { GameDataProvider } from "@/providers";
import bg from "./img/bg.png";

function GameUI() {
  const [flow, setFlow] = useState<ViewState>("pick-name");

  return (
    <>
      {flow === "pick-name" && <CreateOrJoinGame visitFunc={setFlow} />}
      {flow === "game-room" && (
        <GameDataProvider>
          <GameRoom visitFunc={setFlow} />
        </GameDataProvider>
      )}
    </>
  );
}

function App() {
  return (
    // 為了解決背景圖片會有白色十字問題，增加background-color來遮住
    <div style={{backgroundImage: `url(${bg})`, backgroundColor: "#5A0000"}}>
      <GameUI />
    </div>
  );
}

export default App;
