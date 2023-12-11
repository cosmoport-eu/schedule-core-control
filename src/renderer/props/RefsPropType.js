import PropTypes from 'prop-types';

import EventDestinationPropType from './EventDestinationPropType';
import EventStatusPropType from './EventStatusPropType';
import EventStatePropType from './EventStatePropType';
import EventTypePropType from './EventTypePropType';
import EventTypeCategoryPropType from './EventTypeCategoryPropType';

export default PropTypes.shape({
  destinations: PropTypes.arrayOf(EventDestinationPropType),
  statuses: PropTypes.arrayOf(EventStatusPropType),
  states: PropTypes.arrayOf(EventStatePropType),
  types: PropTypes.arrayOf(EventTypePropType),
  type_categories: PropTypes.arrayOf(EventTypeCategoryPropType),
});
