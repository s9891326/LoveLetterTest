import { GameContext } from "@/providers";
import {GameStatus, Seen} from "@/types";
import { Button } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { MdOutlineContentCopy } from "react-icons/md";
import {startGame} from "@/apis";

function PlayerItem(props: { index: number; name: string }) {
  if (props.name === "-") {
    return (
      <div className="m-4 p-2 min-h-[3rem] h-[54px] rounded-[7px] border-2 border-[#939393] grid items-center text-center"
           style={{background: "linear-gradient(0deg, #939393, #939393), linear-gradient(0deg, #D9D9D9, #D9D9D9)"}}>
        <span className="text-[#9BAFC5] text-[20px]">玩家{props.index}：-</span>
      </div>
    );
  }

  return (
    <div className="m-4 p-2 min-h-[3rem] h-[54px] rounded-[7px] border-2 border-[#939393] grid items-center text-center"
         style={{background: "linear-gradient(180deg, #FFF0CA -7.5%, #FFC738 106.25%), linear-gradient(0deg, #DEA617, #DEA617)"}}>
      <p className="text-[#5A2B00] text-[20px]">玩家{props.index}：{props.name}</p>
    </div>
  );
}

export function SeenItem(props: { seen: Seen }) {
  const { seen } = props;
  return (
    <>
      看到 {seen.opponent_name} 持有 {seen.card.name}
    </>
  );
}

function StartGameFunc(props: { gameStatus: GameStatus | null }) {
  const { gameStatus } = props;
  if (gameStatus == null) {
    return <></>;
  }
  if (gameStatus.players.length >= 2 && gameStatus.rounds.length === 0) {
    return (
      <>
        <div className="flex items-center">
          <button className="m-4 p-2 min-h-[3rem] h-[54px] rounded-[7px] w-full text-white"
                  style={{background: "radial-gradient(51.46% 1471.36% at 51.57% 49.61%, #94A0DD 0%, #6A7196 53.13%, #18347B 100%)"}}
                  onClick={() => {
                    startGame(gameStatus?.game_id).then((result) =>
                      console.log(`${gameStatus?.game_id} started? => ${result}`)
                    );
                  }}>
            開始遊戲
          </button>
        </div>
      </>
    )
  }
  return <></>;
}

export function GameStatusBoard() {
  const [copied, setCopied] = useState(false);
  const context = useContext(GameContext);
  if (!context.isReady()) {
    return <></>;
  }

  const gameStatus = context.getGameStatus();
  let gameProgress = "...(未知)...";

  const data = [
    { name: "-", index: 1 },
    { name: "-", index: 2 },
    { name: "-", index: 3 },
    { name: "-", index: 4 },
  ];

  if (gameStatus != null) {
    gameStatus.players.forEach((p, idx) => {
      data[idx] = { name: p.name, index: idx + 1 };
    });
  }

  // game has not stared, use the top player list
  if (gameStatus != null && gameStatus.rounds.length === 0) {
    gameProgress = "等待玩家加入中...";
    if (gameStatus.players.length >= 2) {
      gameProgress = "等待遊戲開始...";
    }
  }

  let seens: Array<Seen> = [];

  // the game has started
  if (gameStatus != null && gameStatus.rounds.length > 0) {
    const current_round = gameStatus.rounds[gameStatus.rounds.length - 1];
    gameProgress = `等待 ${current_round.turn_player.name} 出牌...`;

    current_round.players.forEach((p) => {
      if (p.name === context.getUsername()) {
        seens = p.seen_cards;
      }
    });
  }

  if (context.isGameOver()) {
    gameProgress = "遊戲結束";
  }

  return (
    <>
      <div className="mb-10">
        <StartGameFunc gameStatus={gameStatus}/>
        <div className="m-4 p-2 min-h-[3rem] h-[54px] rounded-[7px] border border-[#939393] flex items-center text-[#BEC4CA]"
             style={{background: "linear-gradient(0deg, #939393, #939393), linear-gradient(180deg, rgba(217, 217, 217, 0.09) 0%, rgba(217, 217, 217, 0.3) 100%)"}}>
          {gameProgress}
        </div>
        <h1 className="text-center text-[20px] leading-[24px] text-white">玩家列表</h1>
        {data.map((x) => (
          <PlayerItem
            index={x.index}
            name={x.name}
            key={`PlayerItem_${x.index}`}
          ></PlayerItem>
        ))}
      </div>
      <div className="absolute top-2 left-2 p-4 text-[10pt] rounded-[7px] text-[15px] leading-[18px] text-white"
           style={{background: "linear-gradient(180deg, rgba(217, 217, 217, 0.09) 0%, rgba(217, 217, 217, 0.3) 100%)"}}
      >
        <div className="">玩家資訊</div>
        <div className="pt-4">
          <table className="border-separate border-spacing-y-2">
            <thead/>
            <tbody>
            <tr>
              <td>GameID:</td>
              <td className="bg-[#FFFFFF26] rounded-[5px] px-[20px] py-[4px] text-center">
                {gameStatus?.game_id}
                <CopyToClipboard
                  text={gameStatus?.game_id}
                  onCopy={() => {
                    setCopied(true);
                  }}
                >
                  <MdOutlineContentCopy className="inline-flex ml-2"/>
                </CopyToClipboard>
                {copied ? <span style={{ color: "red" }}>Copied.</span> : null}
              </td>
            </tr>
            <tr>
              <td className="pr-2">看到的牌:</td>
              <td className="bg-[#FFFFFF26] rounded-[5px] px-[20px] py-[4px] text-center">
                {seens.map((x, index) => (
                  <SeenItem seen={x} key={`SeenItem_${x.card}`} />
                ))}
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
