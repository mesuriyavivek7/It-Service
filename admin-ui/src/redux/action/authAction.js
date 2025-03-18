import { LOGIN_FETCH_START, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from '../types';


// Login Action
export const loginStart = () => ({
   type: LOGIN_FETCH_START,
})

// Login Success Action
export const loginSuccess = (userData) => ({
  type: LOGIN_SUCCESS,
  payload: userData,
});

// Login Failure Action
export const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  payload: error,
});

// Logout Action
export const logout = () => ({
  type: LOGOUT,
});