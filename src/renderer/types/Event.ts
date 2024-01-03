export type EventType = {
  id: number;
  contestants: number;
  cost: number;
  dateAdded: string;
  durationTime: number;
  eventDate: string;
  eventStateId: number;
  eventStatusId: number;
  eventTypeId: number;
  /** @param gateId - id number for the gate of departure */
  gateId: number;
  /** @param gate2Id - id number for the gate of return */
  gate2Id: number;
  peopleLimit: number;
  repeatInterval: number;
  startTime: number;
};
