import React, { useContext } from "react";
import { CardAction } from "@/components/Cards";
import { GameContext } from "@/providers";
import { Flex } from "@chakra-ui/react";

export function Deck() {
  const context = useContext(GameContext);
  const width = 300;

  const empty = <Flex width={width}></Flex>;
  if (!context.isReady()) {
    return empty;
  }

  if (context.isGameOver()) {
    return empty;
  }

  if (!context.isMyTurn()) {
    return empty;
  }

  const cards = context.getTurnPlayer().cards;

  return (
    <>
      <Flex
        bg="#0000004D"
        width={width}
        justifyContent="center"
        alignItems="center"
        px="26px"
        pt="18px"
        pb="14px"
        rounded={3}
      >
        <div className="text-white flex text-center h-full">
          <div className="w-[115px] relative">
            <div className="text-xs rounded-[3px] py-[7px] bg-[#300000] mb-0.5">{cards[0].name}</div>
            <CardAction handCard={cards[0]} />
          </div>
          <div className="min-w-[15px]"></div>
          <div className="w-[115px] relative">
            <div className="text-xs rounded-[3px] py-[7px] bg-[#300000] mb-0.5">{cards[1].name}</div>
            <CardAction handCard={cards[1]} />
          </div>
        </div>
      </Flex>
    </>
  );
}
