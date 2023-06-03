import { createContext } from "react";
import { HandHistory } from "../../shared/models";


export interface HandContextState {
  currentHands: Array<HandHistory>,
  setCurrentHands: (hands: Array<HandHistory>) => void,
  maxDate: number,
  setMaxDate: (date: number) => void,
  minDate: number,
  setMinDate: (date: number) => void,
  minNetGain: number,
  setMinNetGain: (netGain: number) => void,
  maxNetGain: number,
  setMaxNetGain: (netGain: number) => void,
}

export function BuildHandContextInitialState(): HandContextState {
  return {
    currentHands: [],
    setCurrentHands: () => {},
    maxDate: 0,
    setMaxDate: () => {},
    minDate: 0,
    setMinDate: () => {},
    minNetGain: 0,
    setMinNetGain: () => {},
    maxNetGain: 0,
    setMaxNetGain: () => {},
  }
}

export const HandContext = createContext<HandContextState>(BuildHandContextInitialState());