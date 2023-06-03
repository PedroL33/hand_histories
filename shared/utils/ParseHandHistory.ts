import { ConvertTablePositionToIndex, StreetValue, HandHistoryRequest, TablePosition, ConvertStringToTablePosition } from "../models"

export const getHandNumber = (fileText: string): string => {
  const hand_number_match: string[] | null = fileText.match(/Ignition Hand #\d*/);
  if(hand_number_match == null || hand_number_match.length > 1) {
    throw Error('Hand number not found')
  }
  return hand_number_match[0].split(' Hand ')[1];
}

export const getDate = (fileText: string) => {
  const date_match: string[] | null = fileText.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/);
  if(date_match == null || date_match.length > 1) {
    console.log(fileText)
    throw new Error('Date not found');
  }
  return date_match[0]
}

export const getStartingStack = (fileText: string): number => {
  const starting_stack_match: string[] | null = fileText.match(/\[ME\] \(\$\d*.\d* in chips\)/)
  if(starting_stack_match == null || starting_stack_match.length > 1) {
    throw Error('Hand number not found');
  }
  return Math.round(parseFloat(starting_stack_match[0].split('$')[1].split(' ')[0], ) * 100);
}

export const getPosition = (fileText: string): number => {
  const position_match: string[] | null = fileText.match(/[A-Za-z 0-9+]*\[ME\][A-Za-z :0-9()\[\]$.]*/);
  if(position_match == null) {
    throw Error('Position not found');
  }

  const tablePosition: TablePosition = ConvertStringToTablePosition(position_match[0].split(' [ME] ')[0].trim().split(' ').join(''))
  return ConvertTablePositionToIndex(tablePosition)
}

export const getRfi = (fileText: string): number => {
  const rfi_match: string[] | null = fileText.match(/[A-Za-z :0-9()\[\]$.+]*Raises[A-Za-z :0-9()\[\]$.+]*/);
  if(rfi_match == null) {
    return 0;
  }
  return rfi_match.length > 0 && rfi_match[0].includes('[ME]') ? 1: 0;
}

export const getVpip = (fileText: string): number => {
  const vpip_match: string[] | null = [...fileText.matchAll(/[A-Za-z :0-9()\[\]$.+]*\[ME\][A-Za-z :0-9()\[\]$.+]*/g)].map(match => match[0]);
  if(vpip_match == null) {
    throw Error('VPIP cannot found')
  }
  for(let i=0; i<vpip_match.length; i++) {
    if(vpip_match[i].includes('Raises') || vpip_match[i].includes('Calls')) {
      return 1;
    }
  }

  return 0;
}

export const getNetGain = (fileText: string): number => {
  const my_actions_match: string[] | null = [...fileText.matchAll(/[A-Za-z :0-9]*\[ME\][A-Za-z :0-9()\[\]$.-]*/g)].map((match) => match[0]);
  if(my_actions_match == null) {
    throw Error('My actions not found')
  }
  let total: number = 0;

  for(let i=0; i<my_actions_match.length; i++) {
    const action: string | undefined = my_actions_match[i].split(' : ')[1];
    if(action) {
      if(action.includes('$')) {
        if(action.includes('Return') || action.includes('Hand result')) {
          total += Math.round(parseFloat(action.split('$')[1].split(' ')[0]) * 100)
        }else {
          total -= Math.round(parseFloat(action.split('$')[1].split(' ')[0]) * 100)
        }
      }
    }
  }
  return total
}

export const getStreetCards = (fileText: string, street: StreetValue): string | null => {
  let street_card_match: Array<string> | null = null;
  if(street === StreetValue.Flop) {
    street_card_match = fileText.match(/\** FLOP \** [\[\]a-zA-Z0-9 ]*/);
  }else if(street === StreetValue.Turn) {
    street_card_match = fileText.match(/\** TURN \** [\[\]a-zA-Z0-9 ]*/);
  }else if(street === StreetValue.River) {
    street_card_match = fileText.match(/\** RIVER \** [\[\]a-zA-Z0-9 ]*/);
  }else {
    throw Error('Invalid street value.')
  }
  return street_card_match == null ? null: street_card_match[0].split(' *** ')[1].replaceAll(/[\[\]]/g, '');
} 

export const getPlayerCount = (fileText: string): number => {
  const player_count_match: string[] | null = [...fileText.matchAll(/Seat [0-9]: [a-zA-z +0-9()$.]*/g)].map((match) => match[0]);

  if(player_count_match == null || player_count_match.length === 0) {
    throw Error('Players not found')
  }

  return player_count_match.length;
}

export const isValidHandHistoryFile = (text: string): boolean => {
  return text.includes('HOLDEM No Limit') &&
  text.includes('Ignition Hand')
}

export const GetHandHistory = (fileText: string): HandHistoryRequest => {
  try {
    if(!isValidHandHistoryFile(fileText)) {
      throw new Error('Invalid file format.')
    }
    return {
      date: getDate(fileText),
      hand_number: getHandNumber(fileText),
      starting_stack: getStartingStack(fileText),
      position: getPosition(fileText),
      raise_first_in: getRfi(fileText),
      voluntarily_put_into_pot: getVpip(fileText),
      net_gain: getNetGain(fileText),
      player_count: getPlayerCount(fileText),
      flop: getStreetCards(fileText, StreetValue.Flop),
      turn: getStreetCards(fileText, StreetValue.Turn),
      river: getStreetCards(fileText, StreetValue.River),
    }
  }catch(err) {
    throw err;
  }
}