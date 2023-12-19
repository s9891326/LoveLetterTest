import React, { useContext } from "react";
import { ViewState } from "@/types";
import { GameStatusBoard } from "@/components/GameStatusBoard";
import { GameEvents } from "@/components/GameEvents";
import { PlayerHand } from "@/components/PlayerHand";
import { Deck } from "@/components/Deck";
import { GameContext } from "@/providers";


export function GameRoom(props: { visitFunc: (view: ViewState) => void }) {
  const context = useContext(GameContext);
  if (!context.isReady()) {
    return <></>;
  }

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
