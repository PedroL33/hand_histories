import { TablePosition } from "./HoleCard";

export interface GetHandHistoriesRequest {
  position?: TablePosition,
  hand_number?: string,
  rfi?: number,
  vpip?: number, 
  net_gain_min?: number,
  net_gain_max?: number,
  date_min?: string,
  date_max?: string,
  sort_column?: SortableHandHistoryColumn,
  sort_direction?: SortDirection,
}

export enum SortDirection {
  ASC = "ASC",
  DESC = "DESC"
}

export enum SortableHandHistoryColumn {
  date = "date",
  net_gain = "net_gain"
}