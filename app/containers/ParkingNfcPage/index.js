/**
 *
 * ParkingNfcPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectParkingNfcPage from './selectors';
import reducer from './reducer';
import saga from './saga';

export function ParkingNfcPage() {
  useInjectReducer({ key: 'parkingNfcPage', reducer });
  useInjectSaga({ key: 'parkingNfcPage', saga });

  return <div />;
}

ParkingNfcPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  parkingNfcPage: makeSelectParkingNfcPage(),
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

export default compose(withConnect)(ParkingNfcPage);
