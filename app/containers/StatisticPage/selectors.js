import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the statisticPage state domain
 */

const selectStatisticPageDomain = state => state.statisticPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by StatisticPage
 */

const makeSelectStatisticPage = () =>
  createSelector(
    selectStatisticPageDomain,
    substate => substate,
  );

export default makeSelectStatisticPage;
export { selectStatisticPageDomain };
