export interface UploadHandHistoryResponse {
  status: UploadHandHistoryStatus,
  message: string,
  fileName: string,
}

export enum UploadHandHistoryStatus {
  Success = "Success",
  Error = "Error",
}