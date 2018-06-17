import {
  requestStatuses,
  AUTH_USER,
  UNAUTH_USER,
  CHANGE_PASS,
  EDIT_ACCOUNT
} from '../actions/types';

const { SUCCESS, PENDING, SUBMITTED, IDLE, ERROR } = requestStatuses;

const INITIAL_STATE = {
  authenticated: { content: null, requestStatus: IDLE, message: '' },
  changePassword: { content: null, requestStatus: IDLE, message: '' },
  editAccount: {content: null, requestStatus: IDLE, message: '' }
};

export default function (state = INITIAL_STATE, { type, payload }) {
  switch(type) {
    case CHANGE_PASS:
      return { ...state, changePassword: payload };
    case EDIT_ACCOUNT:
      return { ...state, editAccount: payload };
    case AUTH_USER:
    case UNAUTH_USER:
      return { ...state, authenticated: payload };
    default:
      return state;
  }
}
