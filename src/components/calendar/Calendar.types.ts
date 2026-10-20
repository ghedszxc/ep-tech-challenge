export interface TEvent {
  events?: TData[];
}

export interface TData {
  id: string;
  type: string;
  name: string;
  startDate: string;
  endDate: string;
  date?: string;
}