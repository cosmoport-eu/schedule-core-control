export default class EventMapper {
  static fromForm = (object) => ({
    id: object.id || 0,
    contestants: object.bought,
    cost: object.cost,
    event_date: object.date,
    duration_time: object.duration,
    gate_id: object.gate,
    gate2_id: object.gate2,
    people_limit: object.limit,
    repeat_interval: object.repeat_interval,
    event_status_id: object.status,
    event_state_id: object.state,
    start_time: object.time,
    event_type_id: object.type,
  });

  static unmap = (object) => ({
    id: object.id || 0,
    event_date: object.eventDate,
    event_type_id: object.eventTypeId,
    event_status_id: object.eventStatusId,
    event_state_id: object.eventStateId,
    gate_id: object.gateId,
    gate2_id: object.gate2Id,
    start_time: object.startTime,
    duration_time: object.durationTime,
    repeat_interval: object.repeatInterval,
    cost: object.cost,
    people_limit: object.peopleLimit,
    contestants: object.contestants,
  });
}
