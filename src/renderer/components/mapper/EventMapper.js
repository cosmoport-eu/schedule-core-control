export default class EventMapper {
  static fromForm = (object) => ({
    id: object.id || 0,
    contestants: object.bought,
    cost: object.cost,
    eventDate: object.date,
    durationTime: object.duration,
    description: object.description,
    gateId: object.gate,
    gate2Id: object.gate2,
    peopleLimit: object.limit,
    repeatInterval: object.repeat_interval,
    eventStatusId: object.status,
    eventStateId: object.state,
    startTime: object.time,
    eventTypeId: object.type,
    facilityIds: object.facilityIds,
    materialIds: object.materialIds,
  });

  static unmap = (object) => ({
    id: object.id || 0,
    eventDate: object.eventDate,
    eventTypeId: object.eventTypeId,
    eventStatusId: object.eventStatusId,
    eventStateId: object.eventStateId,
    gateId: object.gateId,
    gate2Id: object.gate2Id,
    startTime: object.startTime,
    durationTime: object.durationTime,
    description: object.description,
    repeatInterval: object.repeatInterval,
    cost: object.cost,
    peopleLimit: object.peopleLimit,
    contestants: object.contestants,
    facilityIds: object.facilityIds,
    materialIds: object.materialIds,
  });
}
