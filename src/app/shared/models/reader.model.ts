export interface ReaderStatus {
  id: number;
  status: string;
}

export interface Reader {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  dni: string;
  readerStatusId: number;
  readerStatus: ReaderStatus;
  lastLoanAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReaderCreate {
  firstName: string;
  lastName: string;
  email: string;
  dni: string;
}

export type ReaderUpdate = Partial<ReaderCreate>;