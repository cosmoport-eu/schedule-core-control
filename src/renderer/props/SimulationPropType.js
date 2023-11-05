import PropTypes from 'prop-types';

import EventPropType from './EventPropType';

export default PropTypes.shape({
  active: PropTypes.bool,
  ticks: PropTypes.number,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      event: EventPropType,
      time: PropTypes.number,
      do: PropTypes.string
    })
  )
});

