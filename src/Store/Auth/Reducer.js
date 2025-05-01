import {
  LOGIN_USER_REQUEST,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAILURE,
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAILURE,
  GET_USER_PROFILE_REQUEST,
  GET_USER_PROFILE_SUCCESS,
  GET_USER_PROFILE_FAILURE,
  LOGOUT,
  SOCIAL_AUTH_REQUEST,
  SOCIAL_AUTH_SUCCESS,
  SOCIAL_AUTH_FAILURE,
  FIND_USER_BY_ID_SUCCESS,
  FETCH_ALL_USERS_SUCCESS,
} from "./ActionType";

const initialState = {
  user: null,
  loading: false,
  error: null,
  jwt: null,
  users: [], // To store all users
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SOCIAL_AUTH_REQUEST:
    case LOGIN_USER_REQUEST:
    case REGISTER_USER_REQUEST:
    case GET_USER_PROFILE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case SOCIAL_AUTH_SUCCESS:
    case LOGIN_USER_SUCCESS:
    case REGISTER_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        jwt: action.payload.jwt,
        user: action.payload.user,
        error: null,
      };

      case FIND_USER_BY_ID_SUCCESS:
        return{
          ...state,
          loading:false,
          error:null,
          findUser:action.payload
        }

    case GET_USER_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,
        jwt: state.jwt || localStorage.getItem("jwt"),
        error: null,
      };

    case LOGOUT:
      return {
        ...initialState,
      };

    case SOCIAL_AUTH_FAILURE:
    case LOGIN_USER_FAILURE:
    case REGISTER_USER_FAILURE:
    case GET_USER_PROFILE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

      case FETCH_ALL_USERS_SUCCESS:
        return {
          ...state,
          loading: false,
          users: action.payload,  // Store fetched users in state
          error: null,
        };

    default:
      return state;
  }
};
