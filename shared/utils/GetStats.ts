import { HandHistory } from "../models";

export function getVpipFromHands(hands: Array<HandHistory>) {
  return hands.length === 0 ? 0: (hands.reduce((prev: number, curr: HandHistory) => {
    return curr.voluntarily_put_into_pot ? prev + 1: prev;
  }, 0) / hands.length) * 100;
}

export const getRfiFromHands = (hands: Array<HandHistory>) => {
  return hands.length === 0 ? 0: (hands.reduce((prev: number, curr: HandHistory) => {
    return curr.raise_first_in ? prev + 1: prev;
  }, 0) / hands.length) * 100;
}

export const getNetGainFromHands = (hands: Array<HandHistory>) => {
  return hands.length === 0 ? 0: (hands.reduce((prev: number, curr: HandHistory) => {
    return prev + curr.net_gain;
  }, 0) / 100);
}