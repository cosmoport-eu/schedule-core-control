export { EventType } from './Event';

export type GateType = {
  id: number;
  number: number;
  gateName: string;
};

type i18nKeys = 'id' | 'i18nStatus' | 'i18nState';
export type EventI18nRecordType = {
  [K in i18nKeys]?: number;
};

export type EventStatusType = {
  id: number;
  i18nStatus: number;
};

export type EventStateType = {
  id: number;
  i18nState: number;
};

export type EventTypeType = {
  id: number;
  categoryId: number;
  defaultCost: number;
  defaultDuration: number;
  defaultRepeatInterval: number;
  i18nEventTypeDescription: number;
  i18nEventTypeName: number;
};

export type EventTypeCategoryType = {
  id: number;
  parent: number;
  i18nEventTypeCategoryName: number;
};

export type EventFormDataType = {
  [key: string]: number | string | boolean;
};

export type LocaleType = {
  [index: number | string]: {
    id: number;
    values: string[];
  };
};

export type RefsType = {
  statuses: EventStatusType[];
  states: EventStateType[];
  types: EventTypeType[];
  typeCategories: EventTypeCategoryType[];
};
