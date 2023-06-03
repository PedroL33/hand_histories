import { ipcMain } from "electron";
import { GetHandHistoriesRequest, SortDirection } from '../../shared/models';
import { db } from "../db";

export const registerGetHandsHandler = async () => {

  ipcMain.handle('getHandHistories', async (event, getHandsRequest: GetHandHistoriesRequest) => {
    return new Promise((res, rej) => {
      const getHandsQuery = db.prepare(`
        SELECT hand_histories.*, table_position.table_position_value as position
        FROM hand_histories
        JOIN table_position ON hand_histories.position = table_position.id
        WHERE (? = '' OR table_position.table_position_value = ?)
        AND (? = '' OR hand_histories.raise_first_in = ?)
        AND (? = '' OR hand_histories.voluntarily_put_into_pot = ?)
        AND (? = '' OR hand_histories.hand_number LIKE '%' || ? || '%')
        AND (? = '' OR hand_histories.net_gain >= ? AND hand_histories.net_gain <= ?)
        AND (? = '' OR hand_histories.date >= ? AND hand_histories.date <= ?)
        ORDER BY CASE WHEN ? = 'net_gain' THEN net_gain
        ELSE date
        END DESC
        `)
      try {
        const result = getHandsQuery.all(
          getHandsRequest.position || '', 
          getHandsRequest.position || '',
          getHandsRequest.rfi || '',
          getHandsRequest.rfi || '',
          getHandsRequest.vpip || '',
          getHandsRequest.vpip || '',
          getHandsRequest.hand_number || '',
          getHandsRequest.hand_number || '',
          getHandsRequest.net_gain_min || '',
          getHandsRequest.net_gain_min || '',
          getHandsRequest.net_gain_max || '',
          getHandsRequest.date_min || '',
          getHandsRequest.date_min || '',
          getHandsRequest.date_max || '',
          getHandsRequest.sort_column || '',
        );
        if(getHandsRequest.sort_direction === SortDirection.DESC) {
          res(result);
        }else {
          res(result.reverse())
        }
      }catch(err) {
        rej(err);
      }
    })
  });

  ipcMain.handle('getFullHandDetailsById', async (event, id: number) => {
    return new Promise((res, rej) => {
      const getHandByIdQuery = db.prepare(`
      select hh.id, min(hh.hole_cards) as hole_cards, min(hh.actions) as actions, date, hand_number, starting_stack, table_position_value, raise_first_in, voluntarily_put_into_pot, net_gain, player_count, flop, turn, river
      FROM (
        SELECT hand_histories.id, hand_histories.date, hand_histories.hand_number, hand_histories.starting_stack, table_position.table_position_value, hand_histories.raise_first_in, hand_histories.voluntarily_put_into_pot, hand_histories.net_gain, hand_histories.player_count, hand_histories.flop, hand_histories.turn, hand_histories.river, null as hole_cards, json_group_array(json_object(
          'action', action_type.action_type_value,
          'id', actions.id,
          'hand_history_id', hand_histories.id,
          'street', street.street_value
          )
        ) as actions 
        FROM hand_histories
        JOIN table_position ON hand_histories.position = table_position.id
        JOIN actions ON hand_histories.id = actions.hand_history_id
        JOIN action_type ON action_type.id = actions.action 
        JOIN street ON actions.street = street.id
        GROUP BY hand_histories.id
        HAVING hand_histories.id = ?
        UNION ALL
        SELECT hand_histories.id, hand_histories.date, hand_histories.hand_number, hand_histories.starting_stack, table_position.table_position_value, hand_histories.raise_first_in, hand_histories.voluntarily_put_into_pot, hand_histories.net_gain, hand_histories.player_count, hand_histories.flop, hand_histories.turn, hand_histories.river, json_group_array(json_object(
          'cards', hole_cards.card_value,
          'id', hole_cards.id,
          'hand_history_id', hand_histories.id
          )
        ) as hole_cards, null as actions
        FROM hand_histories
        JOIN hole_cards ON hand_histories.id = hole_cards.hand_history_id 
        JOIN table_position ON hand_histories.position = table_position.id
        GROUP BY hand_histories.id
        HAVING hand_histories.id = ?
      ) as hh
      group by hh.id
      `)

      try {
        const result = getHandByIdQuery.all(id, id);
        if(result.length !== 1) {
          throw new Error('Something went wrong.')
        }
        res(result[0]);
      }catch(err) {
        rej(err);
      }
    })
  })
};