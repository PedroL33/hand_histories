import { TablePosition } from "./HoleCard";

export enum StreetValue {
  PreFlop = 'PreFlop',
  Flop = 'Flop',
  Turn = 'Turn',
  River = 'River',
}

export enum ActionType {
  Fold = 'Fold',
  Raise = 'Raise',
  Call = 'Call',
  Check = 'Check',
  None = 'None',
}

export interface Action {
  id: number,
  hand_history_id: number,
  street: number,
  position: number,
  action: number,
  value: Number | null,
  pot_size: Number,
  is_me?: number,
  action_number: number,
}

export interface ActionRequest {
  hand_history_id: number,
  street: number,
  position: number,
  action: number,
  value: number | null,
  pot_size: number,
  is_me?: number,
  action_number: number,
}

export const ConvertActionTypeToString = (action: ActionType): string => {
  switch(action) {
    case ActionType.Call:
      return 'Call'
    case ActionType.Fold:
      return 'Fold'
    case ActionType.Raise:
      return 'Raise'
    case ActionType.Check:
      return 'Check'
    default:
      return 'None'
  }
}

export const ConvertStringToActionType = (action: string): ActionType => {
  switch(action.toLowerCase()) {
    case 'call':
      return ActionType.Call
    case 'fold':
      return ActionType.Fold
    case 'raise':
      return ActionType.Raise
    case 'check': 
      return ActionType.Check
    default:
      return ActionType.None
  }
}

export const ConvertStreetValueToString = (street: StreetValue): string => {
  switch(street) {
    case StreetValue.PreFlop:
      return 'PreFlop';
    case StreetValue.Flop:
      return `Flop`;
    case StreetValue.Turn:
      return 'Turn';
    case StreetValue.River:
      return 'River';
    default:
      return 'PreFlop';
  }
}

export const ConvertStringToStreetValue = (street: string): StreetValue => {
  switch(street.toLowerCase()) {
    case 'preflop':
      return StreetValue.PreFlop;
    case 'flop':
      return StreetValue.Flop;
    case 'turn':
      return StreetValue.Turn;
    case 'river':
      return StreetValue.River;
    default:
      return StreetValue.PreFlop;
  }
}

export const ConvertActionTypeToIndex = (actionType: ActionType): number => {
  switch(actionType) {
    case ActionType.Fold:
      return 1;
    case ActionType.Raise:
      return 2;
    case ActionType.Call:
      return 3;
    case ActionType.Check:
      return 4;
    case ActionType.None:
      return 5;
    default:
      return 1;
  }
}

export const ConvertStreetValueToIndex = (streetValue: StreetValue): number => {
  switch(streetValue) {
    case StreetValue.PreFlop:
      return 1;
    case StreetValue.Flop:
      return 2;
    case StreetValue.Turn:
      return 3;
    case StreetValue.River:
      return 4;
    default:
      return 1;
  }
}