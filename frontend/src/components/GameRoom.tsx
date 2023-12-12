import React, { useContext } from "react";
import { Box, Button } from "@chakra-ui/react";
import { GameStatus, ViewState } from "@/types";
import { startGame } from "@/apis";
import { GameStatusBoard } from "@/components/GameStatusBoard";
import { GameEvents } from "@/components/GameEvents";
import { PlayerHand } from "@/components/PlayerHand";
import { Deck } from "@/components/Deck";
import { GameContext } from "@/providers";

function StartGameFunc(props: { gameStatus: GameStatus | null }) {
  const { gameStatus } = props;
  if (gameStatus == null) {
    return <></>;
  }
  if (gameStatus.players.length >= 2 && gameStatus.rounds.length === 0) {
    return (
      <Button
        colorScheme="twitter"
        onClick={() => {
          startGame(gameStatus?.game_id).then((result) =>
            console.log(`${gameStatus?.game_id} started? => ${result}`)
          );
        }}
      >
        開始遊戲
      </Button>
    );
  }
  return <></>;
}

export function GameRoom(props: { visitFunc: (view: ViewState) => void }) {
  const context = useContext(GameContext);
  if (!context.isReady()) {
    return <></>;
  }

  const gameStatus = context.getGameStatus();

  return (
    <>
      <div className="flex h-screen">
        <div className="w-[75vw] p-4 flex flex-col mx-auto bg-[#5A0000C5]">
          <div className="flex flex-grow items-center justify-center">
            <div className="flex h-[20vh]">
              <PlayerHand index={0} />
            </div>
          </div>
          <div className="flex min-h-[38vh] items-center justify-center">
            <div className="flex h-[20vh] m-4">
              <PlayerHand index={3} />
            </div>

            <div className="flex h-[20vh] mx-16 my-4 flex-row">
              <Deck />
            </div>
            <div className="flex h-[20vh] m-4">
              <PlayerHand index={1} />
            </div>
          </div>
          <div className="flex flex-grow items-center justify-center">
            <div className="flex h-[20vh]">
              <PlayerHand index={2} />
            </div>
          </div>
          <Box position="absolute" top={5} right="28vw">
            <StartGameFunc gameStatus={gameStatus} />
          </Box>
        </div>
        {/*<!-- Game Status-->*/}
        <div className="w-[25vw] max-h-[100vh] bg-[#080027C5]">
          <GameStatusBoard />
          {/* <!-- Game events --> */}
          <GameEvents />
        </div>
      </div>
    </>
  );
}
