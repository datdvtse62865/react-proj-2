/**
 *
 * StatisticPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectStatisticPage from './selectors';
import reducer from './reducer';
import saga from './saga';

export function StatisticPage() {
  useInjectReducer({ key: 'statisticPage', reducer });
  useInjectSaga({ key: 'statisticPage', saga });

  return <div />;
}

StatisticPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  statisticPage: makeSelectStatisticPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(StatisticPage);
