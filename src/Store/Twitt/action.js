import axios from "axios";
import {
  FIND_TWEET_BY_ID_FAILURE,
  FIND_TWEET_BY_ID_REQUEST,
  FIND_TWEET_BY_ID_SUCCESS,
  TWEET_CREATE_FAILURE,
  TWEET_CREATE_REQUEST,
  TWEET_CREATE_SUCCESS,
  TWEET_DELETE_FAILURE,
  TWEET_DELETE_REQUEST,
  TWEET_DELETE_SUCCESS,
  TWEET_EDIT_FAILURE,
  TWEET_EDIT_REQUEST,
  TWEET_EDIT_SUCCESS,
  TWEET_GET_ALL_FAILURE,
  TWEET_GET_ALL_REQUEST,
  TWEET_GET_ALL_SUCCESS,
  TWEET_GET_USER_FAILURE,
  TWEET_GET_USER_REQUEST,
  TWEET_GET_USER_SUCCESS,
  TWEET_LIKE_FAILURE,
  TWEET_LIKE_REQUEST,
  TWEET_LIKE_SUCCESS,
} from "./actionType";
import { API_BASE_URL } from "../../Config/api";

// Create tweet
export const createTweet = (postData) => async (dispatch) => {
  dispatch({ type: TWEET_CREATE_REQUEST });
  try {
    const { data } = await axios.post("/api/posts", postData);
    dispatch({ type: TWEET_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: TWEET_CREATE_FAILURE, payload: error.message });
  }
};

// Edit tweet
export const editTweet = (postId, updatedData) => async (dispatch) => {
  dispatch({ type: TWEET_EDIT_REQUEST });
  try {
    const { data } = await axios.put(`/api/posts/${postId}`, updatedData);
    dispatch({ type: TWEET_EDIT_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: TWEET_EDIT_FAILURE, payload: error.message });
  }
};

// Delete tweet
export const deleteTweet = (postId) => async (dispatch) => {
  dispatch({ type: TWEET_DELETE_REQUEST });
  try {
    await axios.delete(`/api/posts/${postId}`);
    dispatch({ type: TWEET_DELETE_SUCCESS, payload: postId });
  } catch (error) {
    dispatch({ type: TWEET_DELETE_FAILURE, payload: error.message });
  }
};

// Get all tweets
export const getAllTweets = () => async (dispatch) => {
  dispatch({ type: TWEET_GET_ALL_REQUEST });
  try {
    const { data } = await axios.get("http://localhost:8080/api/posts");
    dispatch({ type: TWEET_GET_ALL_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: TWEET_GET_ALL_FAILURE, payload: error.message });
  }
};

// Get user tweets
export const getUserTweets = (userId) => async (dispatch) => {
  dispatch({ type: TWEET_GET_USER_REQUEST });
  try {
    const { data } = await axios.get(`/api/posts/user/${userId}`);
    dispatch({ type: TWEET_GET_USER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: TWEET_GET_USER_FAILURE, payload: error.message });
  }
};

// Like tweet
export const likeTweet = (postId, token) => async (dispatch) => {
  dispatch({ type: TWEET_LIKE_REQUEST });
  try {
    const { data } = await axios.post(
      `http:localhost:8080/api/posts/${postId}/like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch({ type: TWEET_LIKE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: TWEET_LIKE_FAILURE, payload: error.message });
  }
};

// Find tweet by ID
export const findTweetById = (postId) => async (dispatch) => {
  dispatch({ type: FIND_TWEET_BY_ID_REQUEST });
  try {
    const { data } = await axios.get(`/api/posts/${postId}`);
    dispatch({ type: FIND_TWEET_BY_ID_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FIND_TWEET_BY_ID_FAILURE, payload: error.message });
  }
};

// Action to get like count for a post
export const getLikeCount = (postId) => async (dispatch) => {
    try {
      const { data } = await axios.get(`/api/posts/${postId}/like-count`);
      dispatch({
        type: "TWEET_LIKE_COUNT_SUCCESS", // Custom action type for like count success
        payload: { postId, likeCount: data },
      });
    } catch (error) {
      dispatch({
        type: "TWEET_LIKE_COUNT_FAILURE", // Custom action type for like count failure
        payload: error.message,
      });
    }
  };
  
