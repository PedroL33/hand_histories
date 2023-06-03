import { ActionRequest, ActionType, ConvertActionTypeToIndex, ConvertStreetValueToIndex, ConvertStreetValueToString, ConvertStringToStreetValue, ConvertStringToTablePosition, ConvertTablePositionToIndex, StreetValue } from "../models";

export const getSmallBlind = (fileText: string): number => {
  const small_blind_match: Array<string> | null = fileText.match(/Small Blind [\[\]A-Z ]*: Small Blind \$[0-9.]*/);
  if(small_blind_match == null) {
    throw Error('Small blind not found');
  }
  return Math.round(parseFloat(small_blind_match[0].split('$')[1]) * 100);
}

export const getBigBlind = (fileText: string): number => {
  const small_blind_match: Array<string> | null = fileText.match(/Big Blind [\[\]A-Z ]*: Big [bB]lind \$[0-9.]*/);
  if(small_blind_match == null) {
    throw Error('Small blind not found');
  }
  return Math.round(parseFloat(small_blind_match[0].split('$')[1]) * 100);
}

export const GetActions = (fileText: string, hand_history_id: number): Array<ActionRequest> => {
  try {
    const actionText: string = fileText.split('*** HOLE CARDS ***')[1].split('*** SUMMARY ***')[0];
    const lines: Array<string> = actionText.split('\n');
    const actions: Array<ActionRequest> = [];
    let street: StreetValue = StreetValue.PreFlop;
    let potSize: number = getSmallBlind(fileText) + getBigBlind(fileText);
    let actionNumber: number = 1;

    lines.forEach((line: string) => {
      if(line.includes('***')) {
        street = ConvertStringToStreetValue(line.split(' ')[1])
        actionNumber = 1;
      }

      if(line.includes(':') && 
        !line.includes('Return uncalled portion') &&
        !line.includes('Table deposit') &&
        !line.includes('Seat sit out') &&
        !line.includes('Hand result') &&
        !line.includes('Card dealt to a spot') &&
        !line.includes('Does not show') &&
        !line.includes('Showdown') &&
        !line.includes('Mucks') &&
        !line.includes('Return uncalled portion') &&
        !line.includes('Seat stand') &&
        !line.includes('Table leave') &&
        !line.includes('Table enter')
      ) {
        let actionType: ActionType | null = null;
        if(line.includes('Raises') || line.includes('Bets') || line.includes('All-in')) {
          actionType = ActionType.Raise
        }else if(line.includes('Folds')) {
          actionType = ActionType.Fold
        }else if(line.includes('Calls')) {
          actionType = ActionType.Call
        }else if(line.includes('Check')) {
          actionType = ActionType.Check
        }

        if(actionType == null) {
          throw Error(`Action type not found in ${ConvertStreetValueToString(street)} action #${actionNumber} in "${line}"`)
        }

        const position = ConvertStringToTablePosition(line.split(':')[0].replaceAll(/\[ME\]| /g, ''));
        let amount: number | null = null;
        if(actionType !== ActionType.Fold && actionType !== ActionType.Check) {
          if(!line.includes('$')) {
            throw Error(`Amount not found in ${ConvertStreetValueToString(street)} action #${actionNumber}`)
          }
          amount = Math.round(parseFloat(line.split('$')[1].split(' ')[0]) * 100);
        }

        const action: ActionRequest = {
          hand_history_id,
          street: ConvertStreetValueToIndex(street),
          position: ConvertTablePositionToIndex(position),
          action: ConvertActionTypeToIndex(actionType),
          value: amount,
          pot_size: potSize,
          is_me: line.includes('[ME]') ? 1: 0,
          action_number: actionNumber,
        }

        actionNumber += 1;
        if(amount != null) {
          potSize += amount
        }
        actions.push(action)
      }
    })
    return actions;
  }catch(err) {
    throw err;
  }
}