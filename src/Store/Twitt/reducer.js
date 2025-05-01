import {
    TWEET_CREATE_REQUEST,
    TWEET_CREATE_SUCCESS,
    TWEET_CREATE_FAILURE,
    TWEET_EDIT_REQUEST,
    TWEET_EDIT_SUCCESS,
    TWEET_EDIT_FAILURE,
    TWEET_DELETE_REQUEST,
    TWEET_DELETE_SUCCESS,
    TWEET_DELETE_FAILURE,
    TWEET_GET_ALL_REQUEST,
    TWEET_GET_ALL_SUCCESS,
    TWEET_GET_ALL_FAILURE,
    TWEET_GET_USER_REQUEST,
    TWEET_GET_USER_SUCCESS,
    TWEET_GET_USER_FAILURE,
    TWEET_LIKE_REQUEST,
    TWEET_LIKE_SUCCESS,
    TWEET_LIKE_FAILURE,
    FIND_TWEET_BY_ID_REQUEST,
    FIND_TWEET_BY_ID_SUCCESS,
    FIND_TWEET_BY_ID_FAILURE,
  } from "./actionType";
  
  const initialState = {
    loading: false,
    tweets: [],
    tweetById: null,
    userTweets: [],
    error: null,
    likeCounts: {}, // e.g. { postId1: 5, postId2: 3 }
  };
  
  export const twitReducer = (state = initialState, action) => {
    switch (action.type) {
      // Create tweet
      case TWEET_CREATE_REQUEST:
        return { ...state, loading: true };
      case TWEET_CREATE_SUCCESS:
        return {
          ...state,
          loading: false,
          tweets: [action.payload, ...state.tweets],
        };
      case TWEET_CREATE_FAILURE:
        return { ...state, loading: false, error: action.payload };
  
      // Edit tweet
      case TWEET_EDIT_REQUEST:
        return { ...state, loading: true };
      case TWEET_EDIT_SUCCESS:
        return {
          ...state,
          loading: false,
          tweets: state.tweets.map((tweet) =>
            tweet._id === action.payload._id ? action.payload : tweet
          ),
        };
      case TWEET_EDIT_FAILURE:
        return { ...state, loading: false, error: action.payload };
  
      // Delete tweet
      case TWEET_DELETE_REQUEST:
        return { ...state, loading: true };
      case TWEET_DELETE_SUCCESS:
        return {
          ...state,
          loading: false,
          tweets: state.tweets.filter((tweet) => tweet._id !== action.payload),
        };
      case TWEET_DELETE_FAILURE:
        return { ...state, loading: false, error: action.payload };
  
      // Get all tweets
      case TWEET_GET_ALL_REQUEST:
        return { ...state, loading: true };
      case TWEET_GET_ALL_SUCCESS:
        return { ...state, loading: false, tweets: action.payload };
      case TWEET_GET_ALL_FAILURE:
        return { ...state, loading: false, error: action.payload };
  
      // Get user tweets
      case TWEET_GET_USER_REQUEST:
        return { ...state, loading: true };
      case TWEET_GET_USER_SUCCESS:
        return { ...state, loading: false, userTweets: action.payload };
      case TWEET_GET_USER_FAILURE:
        return { ...state, loading: false, error: action.payload };
  
      // Like tweet
      case TWEET_LIKE_REQUEST:
        return { ...state, loading: true };
      case TWEET_LIKE_SUCCESS:
        return {
          ...state,
          loading: false,
          tweets: state.tweets.map((tweet) =>
            tweet._id === action.payload._id ? action.payload : tweet
          ),
        };
      case TWEET_LIKE_FAILURE:
        return { ...state, loading: false, error: action.payload };
  
      // Find tweet by ID
      case FIND_TWEET_BY_ID_REQUEST:
        return { ...state, loading: true };
      case FIND_TWEET_BY_ID_SUCCESS:
        return { ...state, loading: false, tweetById: action.payload };
      case FIND_TWEET_BY_ID_FAILURE:
        return { ...state, loading: false, error: action.payload };
  
      // Like count
      case "TWEET_LIKE_COUNT_SUCCESS":
        return {
          ...state,
          likeCounts: {
            ...state.likeCounts,
            [action.payload.postId]: action.payload.likeCount,
          },
        };
      case "TWEET_LIKE_COUNT_FAILURE":
        return { ...state, error: action.payload };
  
      default:
        return state;
    }
  };
  