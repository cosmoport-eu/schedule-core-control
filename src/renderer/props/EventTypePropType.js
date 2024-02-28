import PropTypes from 'prop-types';

export default PropTypes.shape({
  categoryId: PropTypes.number,
  defaultCost: PropTypes.number,
  defaultDuration: PropTypes.number,
  defaultRepeatInterval: PropTypes.number,
  descCode: PropTypes.string,
  id: PropTypes.number,
  nameCode: PropTypes.string,
  parent: PropTypes.number,
  isDisabled: PropTypes.bool,
});
