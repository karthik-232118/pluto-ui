export const SET_DASHBOARD_DATA = 'SET_DASHBOARD_DATA';
export const SET_SELECTED_TITLE = 'SET_SELECTED_TITLE';

export const setDashboardData = (elementStatus, pendingAcknowledge) => ({
  type: SET_DASHBOARD_DATA,
  payload: {
    elementStatus,
    pendingAcknowledge
  }
});

export const setSelectedTitle = (title) => ({
  type: SET_SELECTED_TITLE,
  payload: title
});