export { EventType } from './Event';

export type GateType = {
  id: number;
  number: number;
  gateName: string;
};

export type FacilityType = {
  id: number;
  code: string;
  name: string;
};

export type MaterialType = {
  id: number;
  code: string;
  name: string;
};

export type EventStatusType = {
  id: number;
  code: string;
};

export type EventStateType = {
  id: number;
  code: string;
};

export type EventTypeType = {
  id: number;
  categoryId: number;
  defaultCost: number;
  defaultDuration: number;
  defaultRepeatInterval: number;
  descCode: string;
  nameCode: string;
};

export type EventTypeCategoryType = {
  id: number;
  parent: number;
  code: string;
  color: string;
};

export type EventFormDataType = {
  [key: string]: number | string | boolean;
};

export type RefsType = {
  statuses: EventStatusType[];
  states: EventStateType[];
  types: EventTypeType[];
  typeCategories: EventTypeCategoryType[];
};
