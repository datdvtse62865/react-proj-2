import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the parkingNfcPage state domain
 */

const selectParkingNfcPageDomain = state =>
  state.parkingNfcPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ParkingNfcPage
 */

const makeSelectParkingNfcPage = () =>
  createSelector(
    selectParkingNfcPageDomain,
    substate => substate,
  );

export default makeSelectParkingNfcPage;
export { selectParkingNfcPageDomain };
