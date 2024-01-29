import React from 'react';
import PropTypes from 'prop-types';

import styles from './Page.module.css';

const Caption = (params) => (
  <p className={styles.caption}>{params.text}</p>
);

Caption.propTypes = { text: PropTypes.string };
Caption.defaultProps = { text: '' };

export default Caption;