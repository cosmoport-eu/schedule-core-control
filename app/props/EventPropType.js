import PropTypes from 'prop-types';

export default PropTypes.shape({
  id: PropTypes.number,
  contestants: PropTypes.number,
  cost: PropTypes.number,
  dateAdded: PropTypes.string,
  durationTime: PropTypes.number,
  eventDate: PropTypes.string,
  eventDestinationId: PropTypes.number,
  eventStatusId: PropTypes.number,
  eventTypeId: PropTypes.number,
  gateId: PropTypes.number,
  gate2Id: PropTypes.number,
  peopleLimit: PropTypes.number,
  repeatInterval: PropTypes.number,
  startTime: PropTypes.number
});
