import card_back from "../img/card_back.png";
import guard from "../img/guard.png";
import priest from "../img/priest.png";
import baron from "../img/baron.png";
import handmaid from "../img/handmaid.png";
import prince from "../img/prince.png";
import king from "../img/king.png";
import countess from "../img/countess.png";
import princes from "../img/princes.png";

import { Button, Select } from "@chakra-ui/react";
import { useRef } from "react";

import { playCard } from "@/apis";
import { useGameId, useUsername } from "@/hooks";
import { HandCard } from "@/types";

export function CardBack(props: { enabled: boolean }) {
  let cssConfig = {};
  if (!props.enabled) {
    cssConfig = { filter: "grayscale(1)", opacity: 0.7 };
  }
  return (
    <div className="w-[118px] h-[172px] shadow-[6px_10px_9px_0px_rgba(46,0,0,1)] container relative">
      <img
        alt=""
        src={card_back}
        className="rounded-xl"
        style={cssConfig}
      />
    </div>
  );
}

export function CardAction(props: { handCard: HandCard }) {
  const [gameId] = useGameId();
  const [username] = useUsername();
  const { handCard } = props;
  const ref_chosen_player = useRef(null);
  const ref_guessed_card = useRef(null);

  if (!handCard.usage.can_discard) {
    return null;
  }

  const has_player_options = handCard.usage.choose_players.length > 0;
  const has_guess_card_options = handCard.usage.can_guess_cards.length > 0;

  return (
    <>
      {has_player_options && (
        <Select
          border="0"
          bg="#683C3C99"
          size="xs"
          marginY="2px"
          defaultValue={handCard.usage.choose_players[0]}
          ref={ref_chosen_player}
          onChange={(e) => {
            console.log(e.target.value);
          }}
        >
          {handCard.usage.choose_players.map((x) => (
            <option value={x} key={x}>
              {x}
            </option>
          ))}
        </Select>
      )}
      {has_guess_card_options && (
        <Select
          border="0"
          bg="#683C3C99"
          size="xs"
          marginY="2px"
          defaultValue={handCard.usage.can_guess_cards[0]}
          ref={ref_guessed_card}
          onChange={(e) => {
            console.log(e.target.value);
          }}
        >
          {handCard.usage.can_guess_cards.map((x) => (
            <option value={x} key={x}>
              {x}
            </option>
          ))}
        </Select>
      )}
      <Button
        size="sm"
        bgGradient="radial(#DCA4A4 0%, #D86E6E 52.18%, #571440 100%)"
        width="100%"
        position="absolute"
        left="0"
        bottom="0"
        onClick={() => {
          const payload: { [prop: string]: string } = {};
          if (ref_chosen_player.current) {
            payload.chosen_player = (
              ref_chosen_player.current as HTMLSelectElement
            ).value;
          }
          if (ref_guessed_card.current) {
            payload.guess_card = (
              ref_guessed_card.current as HTMLSelectElement
            ).value;
          }

          playCard(gameId, username, handCard.name, payload);
        }}
      >
        出牌
      </Button>
    </>
  );
}

export function CardFront(props: { handCard: HandCard }) {
  const { handCard } = props;

  if (handCard === undefined) {
    return <CardBack enabled={true} />;
  }

  let card_src = card_back;

  if (handCard.name === "衛兵") {
    card_src = guard;
  } else if (handCard.name === "神父") {
    card_src = priest;
  } else if (handCard.name === "男爵") {
    card_src = baron;
  } else if (handCard.name === "侍女") {
    card_src = handmaid;
  } else if (handCard.name === "王子") {
    card_src = prince;
  } else if (handCard.name === "國王") {
    card_src = king;
  } else if (handCard.name === "伯爵夫人") {
    card_src = countess;
  } else if (handCard.name === "公主") {
    card_src = princes;
  }

  return (
    <div className="w-[118px] h-[172px] shadow-[6px_10px_9px_0px_rgba(46,0,0,1)] container relative">
      <img
        alt={handCard.name}
        src={card_src}
        className="rounded-xl"
      />
      <div className="flex flex-col absolute top-[15px] p-2 text-white items-center">
        <div className="text-xs mb-1">{handCard.value}</div>
        <div className="text-2xl">{handCard.name}</div>
        <div className="text-[8pt] mt-2 p-1">{handCard.description}</div>
      </div>
      <div>{/*<CardAction handCard={handCard} />*/}</div>
    </div>
  );
}
