import { box, counter, stroke, whistle } from "../assets/sounds";
import { Howl } from "howler";
import { Sounds, TESounds } from "../interfaces";

const SOUNDS: Sounds = {
  COUNTER: new Howl({
    src: [counter],
  }),
  WHISTLE: new Howl({
    src: [whistle],
  }),
  STROKE: new Howl({
    src: [stroke],
  }),
  BOX: new Howl({
    src: [box],
  }),
};

export const playSound = (type: TESounds) => {
  SOUNDS[type].play();
};
