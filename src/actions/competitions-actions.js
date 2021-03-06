import fetch from 'isomorphic-fetch';
import $ from 'jquery';

import {
  requestPayloads,
  COMP_REQ,
  COMP_RES,
  COMP_GET,
  COMP_FETCH_ONE,
  COMP_FETCH_MINE,
  COMP_FETCH_DIR,
  COMP_REQ_JOIN,
  COMP_INV_JOIN,
  requestStatuses
} from './types';
import { requestTypes } from '../../constants';
import auth from '../auth';
import { authAPIAction, authenticate, serverError } from './utilities';

const { SUCCESS, PENDING, SUBMITTED, IDLE, ERROR } = requestStatuses;
const {
  successPayload,
  pendingPayload,
  errorPayload,
  idlePayload,
  submittedPayload
} = requestPayloads;

/*******************************************************************************
 * Async thunk actions.
 ******************************************************************************/

export function requestCompetition({ name, shortName, website }) {
  let action = { type: COMP_REQ };
  return dispatch => {
    authenticate(action, dispatch, userId => {
      dispatch(Object.assign(action, pendingPayload()));
      fetch('/api/competitions', {
        method: 'post',
        body: JSON.stringify({
          type: requestTypes.REQUEST,
          action_type: COMP_REQ,
          competition: { name, shortName, website }
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(
        res => res.json().then(({ success, message }) => {
          if (!success) dispatch(Object.assign(action, errorPayload(message)));
          else dispatch(Object.assign(action, submittedPayload()));
        }),
        serverError(action, dispatch)
      );
    });
  }
}

export function memberCompetitions(options = { info: false }) {
  let action = { type: COMP_FETCH_MINE };
  const { info } = options;
  return dispatch => {
    authenticate(action, dispatch, userId => {
      dispatch(Object.assign(action, pendingPayload()));
      const url = `/api/users/competitions?${$.param({info})}`;
      fetch(url, {
        method: 'get',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }).then(
        res => res.json().then(({ success, message, competitions }) => {
          if (!success) dispatch(Object.assign(action, errorPayload(message)));
          else dispatch(Object.assign(action, successPayload({
            content: competitions
          })));
        }),
        serverError(action, dispatch)
      );
    });
  }
}

export function fetchCompetition(id) {
  let action = { type: COMP_FETCH_ONE };
  return dispatch => {
    authenticate(action, dispatch, userId => {
      dispatch(Object.assign(action, pendingPayload()));
      const url = `/api/competitions/lookup/${id}`;
      fetch(url, {
        method: 'get',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }).then(
        res => res.json().then(({ success, message, competition }) => {
          if (!success) dispatch(Object.assign(action, errorPayload(message)));
          else dispatch(Object.assign(action, successPayload({
            content: competition
          })));
        }),
        serverError(action, dispatch)
      );
    });
  }
}

export function allCompetitions() {
  let action = { type: COMP_GET };
  return dispatch => {
    dispatch(Object.assign(action, pendingPayload()));
    fetch('/api/competitions', { method: 'get' })
    .then(
      res => res.json().then(({ success, message, competitions }) => {
        if (!success) dispatch(Object.assign(action, errorPayload(message)));
        else dispatch(Object.assign(action, successPayload({
          content: competitions
        })));
      }),
      serverError(action, dispatch)
    );
  }
}

export function directorCompetitions() {
  let action = { type: COMP_FETCH_DIR };
  return dispatch => {
    authenticate(action, dispatch, userId => {
      dispatch(Object.assign(action, pendingPayload()));
      fetch('/api/users/director', {
        method: 'get',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }).then(
        res => res.json().then(({ success, message, competitions }) => {
          if (!success) dispatch(Object.assign(action, errorPayload(message)));
          else dispatch(Object.assign(action, successPayload({
            content: competitions
          })));
        }),
        serverError(action, dispatch)
      );
    });
  }
}

export function joinCompetition(competition_id) {
  let action = { type: COMP_REQ_JOIN };
  return dispatch => {
    authenticate(action, dispatch, userId => {
      dispatch(Object.assign(action, pendingPayload()));
      fetch('/api/competitions/join', {
        method: 'post',
        body: JSON.stringify({
          type: requestTypes.REQUEST,
          action_type: COMP_REQ_JOIN,
          competition_id
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }).then(
        response => response.json().then(({ success, message }) => {
          if (!success) dispatch(Object.assign(action, errorPayload(message)));
          else dispatch(Object.assign(action, successPayload()));
        }),
        serverError(action, dispatch)
      );
    });
  }
}

export function inviteUser({ competition_id, user_id }) {
  return authAPIAction({
    type:  COMP_INV_JOIN,
    url: '/api/competitions/invite',
    opts: {
      method: 'post',
      body: JSON.stringify({
        type: requestTypes.REQUEST,
        action_type: COMP_INV_JOIN,
        competition_id,
        user_id
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    },
    formatData: ({ success, message }) => ({ success, message })
  });
}

