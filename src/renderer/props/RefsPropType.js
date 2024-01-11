import PropTypes from 'prop-types';

import EventStatusPropType from './EventStatusPropType';
import EventStatePropType from './EventStatePropType';
import EventTypePropType from './EventTypePropType';
import EventTypeCategoryPropType from './EventTypeCategoryPropType';

export default PropTypes.shape({
  statuses: PropTypes.arrayOf(EventStatusPropType),
  states: PropTypes.arrayOf(EventStatePropType),
  types: PropTypes.arrayOf(EventTypePropType),
  typeCategories: PropTypes.arrayOf(EventTypeCategoryPropType),
});
