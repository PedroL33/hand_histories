import { ipcMain } from "electron";
import { ActionRequest, HandHistoryRequest, HoleCardRequest, UploadHandHistoryStatus } from '../../shared/models';
import { GetActions, GetHandHistory, GetHoleCards } from "../../shared/utils";
import { UploadHandHistoryResponse } from "../../shared/models";
import {promises as fs} from 'fs';
import path from "path";
import { db } from "../db";

export const registerUploadHandler = async () => {
  ipcMain.handle('upload', async (event, filePaths: Array<string>) => {
    return new Promise(async (res, rej) => {

      const fileStats = await fs.stat(filePaths[0]);
      if(filePaths.length === 1 && fileStats.isDirectory()) {
        const response = await uploadHandsFromDirectoryPath(filePaths[0], []);
        res(response);
      }else {
        const responses: Array<UploadHandHistoryResponse> = [];
        for(let i=0; i<filePaths.length; i++) {
          const response = await uploadHandsFromFilePath(filePaths[i])
          responses.push(response);
        }
        res(responses)
      }
    })
  })
}

const uploadHandsFromFilePath = async (filePath: string): Promise<UploadHandHistoryResponse> => {
  const text = await fs.readFile(filePath, {encoding: 'utf-8'}); 
  const hands = text.split(/\r\n\r\n\r\n/)
  const insertHandsTxn = db.transaction(() => {
    hands.forEach((hand: string) => {
      uploadHand(hand)
    })
  })

  try {
    insertHandsTxn();
    return {
      status: UploadHandHistoryStatus.Error,
      message: `Successfully uploaded file.`,
      fileName: filePath,
    }
  }catch(err) {
    return {
      status: UploadHandHistoryStatus.Error,
      message: err.message,
      fileName: filePath,
    }
  }
}

const uploadHandsFromDirectoryPath = async (dirPath: string, errors: Array<UploadHandHistoryResponse>): Promise<Array<UploadHandHistoryResponse>> => {
  const filePaths: Array<string> = await fs.readdir(dirPath);
  for(let i=0; i<filePaths.length; i++) {
    const fileStats = await fs.stat(path.resolve(dirPath, filePaths[i]));
    if(fileStats.isDirectory()) {
      const response = await uploadHandsFromDirectoryPath(path.resolve(dirPath, filePaths[i]), errors);
    }else {
      const response = await uploadHandsFromFilePath(path.resolve(dirPath, filePaths[i]))
      errors.push(response);
    }
  }
  return errors;
}

const uploadHand = (hand: string) => {
  const insertHandQuery = db.prepare(`INSERT INTO hand_histories 
    (date, hand_number, starting_stack, position, raise_first_in, voluntarily_put_into_pot, net_gain, player_count, flop, turn, river)
    VALUES (@date, @hand_number, @starting_stack, @position, @raise_first_in, @voluntarily_put_into_pot, @net_gain, @player_count, @flop, @turn, @river)
    RETURNING *
  `);

  const insertHoleCardQuery = db.prepare(`INSERT INTO hole_cards 
    (hand_history_id, position, card_value, is_me)
    VALUES (@hand_history_id, @position, @card_value, @is_me)
  `);
    
  const insertActionQuery = db.prepare(`
    INSERT INTO actions (hand_history_id, street, action, value, pot_size, is_me)
    VALUES (@hand_history_id, @street, @action, @value, @pot_size, @is_me)
  `);

  const insertHandTxn = db.transaction(() => {
    const handHistoryData: HandHistoryRequest = GetHandHistory(hand);
    const res = insertHandQuery.run(handHistoryData)
    const handId = res.lastInsertRowid
    const holeCardData: Array<HoleCardRequest> = GetHoleCards(hand, handId);
    holeCardData.forEach((holeCard: HoleCardRequest) => {
      insertHoleCardQuery.run(holeCard)
    })
    const actionData: Array<ActionRequest> = GetActions(hand, handId);
    actionData.forEach((action: ActionRequest) => {
      insertActionQuery.run(action);
    })
  })
  insertHandTxn();
}