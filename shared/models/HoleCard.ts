export interface HoleCard {
  id: number,
  hand_history_id: number,
  position: number,
  card_value: string,
  is_me: number,
}

export interface HoleCardRequest {
  hand_history_id: number,
  position: number,
  card_value: string,
  is_me: number,
}

export enum TablePosition {
  Dealer = 'Dealer',
  SmallBlind = 'SmallBlind',
  BigBlind = 'BigBlind',
  UTG = 'UTG',
  UTG1 = 'UTG1',
  UTG2 = 'UTG2'
}

export const ConvertTablePositionToString = (position: TablePosition): string => {
  switch(position) {
    case TablePosition.BigBlind:
      return 'BigBlind'
    case TablePosition.SmallBlind:
      return 'SmallBlind'
    case TablePosition.Dealer:
      return 'Dealer'
    case TablePosition.UTG:
      return 'UTG'
    case TablePosition.UTG1:
      return 'UTG1'
    case TablePosition.UTG2:
      return 'UTG2'
    default:
      return 'Dealer';
  }
}

export const ConvertStringToTablePosition = (position: string): TablePosition => {
  switch(position.toLowerCase()) {
    case `bigblind`:
      return TablePosition.BigBlind
    case 'smallblind':
      return TablePosition.SmallBlind
    case 'dealer':
      return TablePosition.Dealer
    case 'utg':
      return TablePosition.UTG
    case 'utg+1':
      return TablePosition.UTG1
    case 'utg+2':
      return TablePosition.UTG2
    default:
      return TablePosition.Dealer;
  }
}

export const ConvertTablePositionToIndex = (position: TablePosition): number => {
  switch(position) {
    case TablePosition.BigBlind:
      return 1;
    case TablePosition.SmallBlind:
      return 2;
    case TablePosition.Dealer:
      return 3;
    case TablePosition.UTG:
      return 4;
    case TablePosition.UTG1:
      return 5;
    case TablePosition.UTG2:
      return 6;
    default:
      return 1;
  }
}