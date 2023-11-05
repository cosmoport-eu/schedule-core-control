import PropTypes from 'prop-types';

export default PropTypes.objectOf(PropTypes.shape({
  id: PropTypes.number,
  values: PropTypes.arrayOf(PropTypes.string)
}));
