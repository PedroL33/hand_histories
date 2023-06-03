import { ConvertStringToTablePosition, ConvertTablePositionToIndex, HoleCardRequest, TablePosition } from "../models"

export const GetHoleCards = (fileText: string, hand_history_id: number): Array<HoleCardRequest> => {
  try {
    const holeCards: Array<HoleCardRequest> = [];

    const hole_card_match: Array<string> | null = [...fileText.matchAll(/[\[\]0-9a-zA-Z +]* : Card dealt to a spot [\[\]0-9a-zA-Z ]*/g)].map((match) => match[0])
    if(hole_card_match == null || hole_card_match.length == 0) {
      throw Error('Hole cards could not be found');
    };

    hole_card_match.forEach((match: string) => {
      const tablePosition: TablePosition = ConvertStringToTablePosition(match.split(':')[0].replaceAll(/\[ME\]| /g, ''))

      const holeCard: HoleCardRequest = {
        hand_history_id,
        position: ConvertTablePositionToIndex(tablePosition),
        card_value: match.split('Card dealt to a spot')[1].replaceAll(/[\[\]]/g, ''),
        is_me: match.includes('[ME]') ? 1: 0,
      }
      holeCards.push(holeCard)
    });

    return holeCards;
  }catch(err) {
    throw err
  }
}