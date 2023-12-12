import { GameContext } from "@/providers";
import { Seen } from "@/types";
import { Button } from "@chakra-ui/react";
import { useContext, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { MdOutlineContentCopy } from "react-icons/md";

function PlayerItem(props: { index: number; name: string }) {
  if (props.name === "-") {
    return (
      <div className="bg-[#D9D9D9] m-4 p-2 min-h-[3rem] h-[54px] rounded-[7px] border-2 border-[#939393] grid items-center text-center">
        <span className="text-[#7D789D] text-[20px]">玩家{props.index}：-</span>
      </div>
    );
  }

  return (
    <div className="bg-amber-200 m-4 p-2 min-h-[3rem] h-[54px] rounded-[7px] border-2 border-[#939393] grid items-center text-center">
      <span className="text-[#7D789D] text-[20px]">玩家{props.index}：{props.name}</span>
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
        <h1>遊戲狀態</h1>
        <div className="bg-gray-100 m-4 p-2 min-h-[3rem] h-[54px] rounded-[7px] border border-[#939393] flex items-center">
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
