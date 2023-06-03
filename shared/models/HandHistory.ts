import { Action } from "./Action"
import { HoleCard } from "./HoleCard"

export interface HandHistory {
  id: number,
  date: string,
  hand_number: string,
  starting_stack: number,
  position: number,
  raise_first_in: boolean,
  voluntarily_put_into_pot: boolean,
  net_gain: number,
  player_count: number,
  flop: string | null,
  turn: string | null,
  river: string | null,
  hole_cards: Array<HoleCard>,
  actions: Array<Action>,
}

export interface HandHistoryRequest {
  date: string,
  hand_number: string,
  starting_stack: number,
  position: number,
  raise_first_in: number,
  voluntarily_put_into_pot: number,
  net_gain: number,
  player_count: number,
  flop: string | null,
  turn: string | null,
  river: string | null
}