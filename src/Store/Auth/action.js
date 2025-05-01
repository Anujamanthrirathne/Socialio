import { API_BASE_URL } from "../../Config/api";
import { FETCH_ALL_USERS_FAILURE, FETCH_ALL_USERS_REQUEST, FETCH_ALL_USERS_SUCCESS, FIND_USER_BY_ID_FAILURE, FIND_USER_BY_ID_REQUEST, FIND_USER_BY_ID_SUCCESS, GET_USER_PROFILE_FAILURE, GET_USER_PROFILE_SUCCESS, LOGIN_USER_FAILURE, LOGIN_USER_SUCCESS, LOGOUT, REGISTER_USER_FAILURE, REGISTER_USER_SUCCESS, SOCIAL_AUTH_FAILURE, SOCIAL_AUTH_REQUEST, SOCIAL_AUTH_SUCCESS, UPDATE_USER_FAILURE, UPDATE_USER_REQUEST, UPDATE_USER_SUCCESS } from "./ActionType";
import axios from "axios";

export const loginUser = (loginData) => async (dispatch) => {
  try {
    console.log("Logging in with data:", loginData);
    const { data } = await axios.post(`${API_BASE_URL}/api/users/signin`, loginData);
    console.log("Logged in User:", data);
    if (data.jwt) {
      localStorage.setItem("jwt", data.jwt);
      console.log("JWT stored in localStorage:", data.jwt);
    }
    dispatch({
      type: LOGIN_USER_SUCCESS,
      payload: { jwt: data.jwt, user: data.user }, // Ensure both jwt and user are dispatched
    });
  } catch (error) {
    console.log("Login error:", error);
    dispatch({ type: LOGIN_USER_FAILURE, payload: error.message });
  }
};


export const googleLogin = (token) => async (dispatch) => {
  dispatch({ type: SOCIAL_AUTH_REQUEST });
  try {
    const response = await axios.post(`${API_BASE_URL}/api/users/google`, {
      provider: 'google',
      token: token,
    });

    const data = response.data;
    if (data.jwt) {
      localStorage.setItem("jwt", data.jwt);
      dispatch({
        type: SOCIAL_AUTH_SUCCESS,
        payload: { jwt: data.jwt, user: data.user },
      });
    }
  } catch (error) {
    dispatch({
      type: SOCIAL_AUTH_FAILURE,
      payload: error.message,
    });
  }
};




export const registerUser = (registerData) => async (dispatch) => {
  try {
    console.log("Registering with data:", registerData);
    const { data } = await axios.post(`${API_BASE_URL}/api/users/signup`, registerData);
    console.log("Signup response data:", data);
    if (data.jwt) {
      localStorage.setItem("jwt", data.jwt);
      console.log("JWT stored in localStorage:", data.jwt);
    }
    dispatch({ type: REGISTER_USER_SUCCESS, payload: data });
  } catch (error) {
    console.log("Registration error:", error);
    dispatch({ type: REGISTER_USER_FAILURE, payload: error.message });
  }
};

export const getUserProfile = (jwt) => async (dispatch) => {
  try {
    console.log("Fetching user profile with JWT:", jwt);
    
    // ✅ Fix: Strip 'Bearer ' if already included
    const token = jwt.startsWith("Bearer ") ? jwt.slice(7) : jwt;

    const { data } = await axios.get(`${API_BASE_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`, // only one 'Bearer'
      },
    });

    console.log("Fetched user profile:", data);
    dispatch({ type: GET_USER_PROFILE_SUCCESS, payload: data });
  } catch (error) {
    console.log("Get user profile error:", error);
    dispatch({ type: GET_USER_PROFILE_FAILURE, payload: error.message });
  }
};


export const findUserById = (userId) => async (dispatch) => {
  try {
    dispatch({ type: FIND_USER_BY_ID_REQUEST });

    // Assuming you have an API endpoint for fetching a user by ID
    const response = await axios.get(`${API_BASE_URL}/api/users/${userId}`);

    dispatch({
      type: FIND_USER_BY_ID_SUCCESS,
      payload: response.data,  // Assuming the user data is in response.data
    });
  } catch (error) {
    dispatch({
      type: FIND_USER_BY_ID_FAILURE,
      payload: error.message || 'Something went wrong',
    });

  }
}

// actions.js
export const fetchAllUsers = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_ALL_USERS_REQUEST });
    const response = await axios.get(`${API_BASE_URL}/api/users/user`);  // Your API endpoint for fetching all users
    dispatch({
      type: FETCH_ALL_USERS_SUCCESS,
      payload: response.data,  // Assuming all users data is in response.data
    });
  } catch (error) {
    dispatch({
      type: FETCH_ALL_USERS_FAILURE,
      payload: error.message,
    });
  }
};


export const updateUser = (userId, updatedUserData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_USER_REQUEST });

    // Assuming you have an API endpoint for updating a user by ID
    const response = await axios.put(`${API_BASE_URL}/api/users/update/${userId}`, updatedUserData);

    dispatch({
      type: UPDATE_USER_SUCCESS,
      payload: response.data,  // Assuming the updated user data is in response.data
    });
  } catch (error) {
    dispatch({
      type: UPDATE_USER_FAILURE,
      payload: error.message || 'Something went wrong',
    });
  }
};



export const logout = () => async (dispatch) => {
  localStorage.removeItem("jwt");  // Remove the JWT token from localStorage
  dispatch({ type: LOGOUT });  // Dispatch the LOGOUT action
};



