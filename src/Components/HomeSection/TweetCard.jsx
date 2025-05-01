import React, { useState, useEffect, useRef } from "react";
import {
  Avatar,
  Button,

  MenuItem,
  Modal,
  TextField,
  Box,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import BarChartIcon from "@mui/icons-material/BarChart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import RepeatIcon from "@mui/icons-material/Repeat";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Correct import
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../../Store/Auth/action"; 

const TweetCard = ({ item, replies }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [openReplyModal, setOpenReplyModal] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [post, setPost] = useState(item); // Local state for the post item
  const [allReplies, setAllReplies] = useState(item?.replies || []); // Store all replies
  const [showReplies, setShowReplies] = useState(false);

  // State for editing a reply
  const [openEditModal, setOpenEditModal] = useState(false);
  const [replyToEdit, setReplyToEdit] = useState(item?.replies?._id || []);
  const [editContent, setEditContent] = useState("");

  // Decode the JWT to get the userId
  const token = localStorage.getItem("jwt");
  const decodedToken = token ? jwtDecode(token) : null;
  const userId = decodedToken ? decodedToken.sub : null; // Extract userId from decoded token

  const [openEditTweetModal, setOpenEditTweetModal] = useState(false); // New state for Edit Tweet Modal
  const [editedContent, setEditedContent] = useState(post?.content || "");

  const [liked, setLiked] = useState(item?.likedBy?.includes(userId) || false); // Like state

  const [newMediaUrl, setNewMediaUrl] = useState("");
  const [currentMedia, setCurrentMedia] = useState("");

  const dispatch = useDispatch();

  // Accessing the Redux state
  const { auth } = useSelector(store => store);
  const { users, user} = auth;  // Accessing users and other state from auth

  // Fetch all users when the component mounts (if users are not already fetched)
  useEffect(() => {
    if (!users.length) {
      dispatch(fetchAllUsers());  // Fetch users if not already in state
    }
  }, [dispatch, users.length]);

  console.log("users",users)
  console.log("use",user)

  useEffect(() => {
    setLiked(post?.likedBy?.includes(userId) || false); // Sync liked state on post update
  }, [post, userId]);

  // Menu functions for the post options
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Dummy functions for delete/edit of the post itself
  const handleDeleteTweet = async (postId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/posts/${item.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        console.log("Tweet deleted");
        getPosts(); // Refetch posts
      } else {
        console.error("Error deleting tweet");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getPosts = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/posts");
      const posts = await response.json();
      setPost(posts); // Assuming `setPosts` is your state setter for posts
    } catch (err) {
      console.error("Error fetching posts", err);
    }
  };

  const handleOpenEditTweetModal = () => {
    setEditedContent(post?.content); // Set initial content in the modal
    setEditContent(post?.mediaUrl);
    setOpenEditTweetModal(true);
  };

  const handleCloseEditTweetModal = () => {
    setOpenEditTweetModal(false);
    setEditedContent(post?.content); // Reset to the original content
  };

  const [uploadedFile, setUploadedFile] = useState(null);

  const handleEditTweetSubmit = async () => {
    try {
      let mediaUrlToUpdate = newMediaUrl;

      // Upload new media if selected
      if (uploadedFile) {
        const formData = new FormData();
        formData.append("file", uploadedFile);
        formData.append("upload_preset", "mern_product");

        const uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dwviccr1k/upload",
          formData
        );
        mediaUrlToUpdate = uploadRes.data.secure_url;
      }

      // Update the tweet
      const response = await axios.put(
        `http://localhost:8080/api/posts/${post.id}`,
        {
          content: editedContent,
          mediaUrl: mediaUrlToUpdate,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );

      // Check if the response is successful (status code 200-299)
      if (response.status >= 200 && response.status < 300) {
        // Update local post state
        setPost((prevPost) => ({
          ...prevPost,
          content: editedContent,
          mediaUrl: mediaUrlToUpdate,
        }));

        // Close modal
        setOpenEditTweetModal(false);

        // Clear uploaded file state
        setUploadedFile(null);

        // Refetch the post if necessary (could be optimized by not reloading the entire page)
        window.location.reload(); // This can be replaced with a more targeted refetch
      } else {
        console.error(
          "Error: Response status indicates failure",
          response.status
        );
      }
    } catch (error) {
      console.error("Error editing tweet:", error);
    }
  };

  const handleLiketweet = async () => {
    try {
      if (!liked) {
        const response = await axios.post(
          `http://localhost:8080/api/posts/${post.id}/like`,
          null,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
          }
        );
        if (response.data.success) {
          setLiked(true);
          setPost((prevPost) => ({
            ...prevPost,
            likes: prevPost.likes + 1,
            likedBy: [...prevPost.likedBy, userId],
          }));
        }
      } else {
        const response = await axios.post(
          `http://localhost:8080/api/posts/${post.id}/unlike`,
          null,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
          }
        );
        if (response.data.success) {
          setLiked(false);
          setPost((prevPost) => ({
            ...prevPost,
            likes: prevPost.likes - 1,
            likedBy: prevPost.likedBy.filter((id) => id !== userId),
          }));
        }
      }
    } catch (error) {
      console.error(
        "Error liking/unliking the post:",
        error.response || error.message
      );
    }
  };

  const totalRepliesCount = Array.isArray(post?.replies)
    ? post.replies.length
    : 0;

  // Handle reply submission (creation)
  const handleReplySubmit = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/replies/${post.id}/replies`,
        {
          content: replyContent,
          userId: userId,
          userName: decodedToken?.name || decodedToken?.userName, // Assuming userName is available
          image: decodedToken?.image,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        }
      );

      const updatedPost = response.data;
      setPost(updatedPost);
      setAllReplies(updatedPost.replies); // <- Now replies should include correct userId
      setReplyContent("");
      setOpenReplyModal(false);
    } catch (error) {
      console.error("Error creating reply:", error);
    }
  };

  // Fetch all replies for the post from backend
  const handleShowAllReplies = async () => {
    if (!showReplies) {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/replies/post/${post.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response && response.data) {
          setAllReplies(response.data);
        }
      } catch (error) {
        console.error("Error fetching replies:", error);
      }
    }
    setShowReplies(!showReplies); // Toggle visibility
  };

  // EDIT REPLY FUNCTIONS

  const handleOpenEditModal = (reply) => {
    setReplyToEdit(reply);
    setEditContent(reply.content);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setReplyToEdit(null);
    setEditContent("");
  };

  const handleEditSubmit = async () => {
    try {
      // Prepare the updated reply object
      const updatedReply = {
        content: editContent,
        updatedAt: new Date().toISOString(), // Ensure you are sending the updated timestamp
      };

      // Send PUT request to the backend to update the reply
      const response = await axios.put(
        `http://localhost:8080/api/replies/${replyToEdit.id}`,
        updatedReply, // Send the updated content and timestamp
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        }
      );

      // Update the reply in allReplies state
      setAllReplies((prevReplies) =>
        prevReplies.map((r) =>
          r.id === replyToEdit.id ? { ...r, content: updatedReply.content } : r
        )
      );

      handleCloseEditModal(); // Close the edit modal
    } catch (error) {
      console.error("Error editing reply:", error);
    }
  };

  // DELETE REPLY FUNCTION
  const handleDeleteReply = async (replyId) => {
    console.log("Deleting reply with ID:", replyId); // Log the replyId
    try {
      await axios.delete(`http://localhost:8080/api/replies/${replyId}`);
      // Remove the deleted reply from state
      setAllReplies((prevReplies) =>
        prevReplies.filter((r) => r.id !== replyId)
      );
    } catch (error) {
      console.error("Error deleting reply:", error);
    }
  };

  const handleTweetClick = (id) => {
    // Ensure it only navigates to the tweet detail if not already on that page
    if (window.location.pathname !== `/twit/${id}`) {
      navigate(`/twit/${id}`);
    }
  };

  return (
    <React.Fragment>
      {/* Post Header */}
      <div className="flex space-x-5">
        <Avatar
          onClick={() => {
             navigate(`/profile/${post.userId}`)
          }}
          src="https://media.istockphoto.com/id/1996253989/photo/aerial-view-of-car-parked-with-camper-and-young-man-overlooking-the-great-australian-bight.jpg?s=1024x1024&w=is&k=20&c=dQaXY4QCJJz0oO4K64CwmgwYh1dQxw99YR9AcIRlMYc="
          alt="username"
          className="cursor-pointer"
        />
        <div className="flex flex-col justify-center w-full">
          <div className="flex items-center space-x-2">
            <span className="font-semibold">{post?.userName}</span>
            <span className="text-gray-600">
              @{post?.userName?.split(" ").join("_").toLowerCase()} . 2m
            </span>
         
          <img
            src="https://abs.twimg.com/responsive-web/client-web/verification-card-v2@3x.8ebee01a.png"
            alt="verified"
            className="ml-2 w-5 h-5"
          />
    

            <Button
              id="basic-button"
              aria-controls={openMenu ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openMenu ? "true" : undefined}
              onClick={handleClick}
              className="ml-auto"
            >
              <MoreHorizIcon />
            </Button>
          </div>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleClose}
            MenuListProps={{ "aria-labelledby": "basic-button" }}
          >
            <MenuItem onClick={handleDeleteTweet}>Delete</MenuItem>
            <MenuItem onClick={handleOpenEditTweetModal}>Edit</MenuItem>
          </Menu>
        </div>
      </div>

      {/* Post Content */}
      <div className="mt-2">
        <div
          onClick={() => handleTweetClick(post.id)}
          className="cursor-pointer"
        >
          <p className="mb-2 p-0">{post?.content}</p>
          {post?.mediaUrl && (
            <>
              {post.mediaUrl.includes(".mp4") ? (
                // For video files
                <video
                  controls
                  style={{
                    width: "28rem",
                    height: "27rem",
                    objectFit: "cover",
                    border: "1px solid #e5e5e5",
                    borderRadius: "8px",
                    padding: "4px",
                  }}
                >
                  <source src={post.mediaUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                // For image files
                <img
                  src={post.mediaUrl}
                  alt="tweet-media"
                  style={{
                    width: "28rem",
                    height: "27rem",
                    objectFit: "cover",
                    border: "1px solid #e5e5e5",
                    borderRadius: "8px",
                    padding: "4px",
                  }}
                />
              )}
            </>
          )}
        </div>

        {/* Post Actions */}
        <div className="py-4 flex flex-wrap justify-between items-center">
          <div className="space-x-3 flex items-center text-gray-600">
            <ChatBubbleOutlineIcon
              className="cursor-pointer"
              onClick={() => setOpenReplyModal(true)}
            />
            <p className="ml-1">{totalRepliesCount}</p>

            <RepeatIcon className="cursor-pointer" />
            <p className="ml-1">{totalRepliesCount}</p>

            <div className="space-x-3 flex items-center">
              {liked ? (
                <FavoriteIcon
                  className="cursor-pointer"
                  onClick={handleLiketweet}
                  style={{ color: "#E91E63" }}
                />
              ) : (
                <FavoriteBorderIcon
                  className="cursor-pointer"
                  onClick={handleLiketweet}
                  style={{ color: "#999" }}
                />
              )}
              <p className="ml-1">{post?.likes}</p>
              <BarChartIcon
                className="cursor-pointer"
                onClick={() => setOpenReplyModal(true)}
              />
              <p className="ml-1">430</p>
              <FileUploadIcon
                className="cursor-pointer"
                onClick={() => setOpenReplyModal(true)}
              />
              <VisibilityIcon
                className="cursor-pointer"
                onClick={handleShowAllReplies}
                style={{ color: showReplies ? "#1976D2" : "#999" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Create Reply Modal */}
      <Modal
        open={openReplyModal}
        onClose={() => setOpenReplyModal(false)}
        closeAfterTransition
        aria-labelledby="reply-modal-title"
        aria-describedby="reply-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: 4,
            borderRadius: 2,
            maxWidth: 400,
            width: "90%",
            boxShadow: 24,
          }}
        >
          <h2 id="reply-modal-title">Write a Reply</h2>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="What's your reply?"
            margin="normal"
          />
          <Button variant="contained" onClick={handleReplySubmit}>
            Reply
          </Button>
        </Box>
      </Modal>

      {/* Edit Reply Modal */}
      <Modal
        open={openEditModal}
        onClose={handleCloseEditModal}
        closeAfterTransition
        aria-labelledby="edit-reply-modal-title"
        aria-describedby="edit-reply-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: 4,
            borderRadius: 2,
            maxWidth: 400,
            width: "90%",
            boxShadow: 24,
          }}
        >
          <h2 id="edit-reply-modal-title">Edit Reply</h2>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Edit your reply"
            margin="normal"
          />

          <Button variant="contained" onClick={handleEditSubmit}>
            Save Changes
          </Button>
        </Box>
      </Modal>

      {/* List of All Replies */}
      {showReplies && allReplies?.length > 0 && (
        <div className="ml-12 mt-4 space-y-3">
          {allReplies.map((reply) => (
            <div key={reply?.id} className="border p-2 rounded-md bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Avatar
                    src="https://res.cloudinary.com/dwviccr1k/image/upload/v1742509569/crop_images/aeudds4jgbq255rvg2al.jpg"
                    alt={reply?.userName}
                    sx={{ width: 30, height: 30 }}
                  />
                  <span className="font-medium">{reply?.userId}</span>
                </div>
                {reply?.userId === userId && (
                  <div>
                    <IconButton onClick={() => handleOpenEditModal(reply)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteReply(reply?.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </div>
                )}
              </div>
              <p className="mt-2 ml-8">{reply?.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Edit Tweet Modal */}
      <Modal
        open={openEditTweetModal}
        onClose={handleCloseEditTweetModal}
        closeAfterTransition
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: 4,
            borderRadius: 2,
            maxWidth: 500,
            width: "90%",
            boxShadow: 24,
          }}
        >
          <h2>Edit Tweet</h2>

          <TextField
            fullWidth
            multiline
            rows={3}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            label="Edit Content"
            margin="normal"
          />

          {/* Optional URL Input if needed */}
          <TextField
            fullWidth
            value={newMediaUrl}
            onChange={(e) => setNewMediaUrl(e.target.value)}
            label="Media URL (optional)"
            placeholder="Or paste image/video URL"
            margin="normal"
          />

          {/* File Input for media */}
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ marginBottom: 2 }}
          >
            Upload Media File
            <input
              type="file"
              hidden
              accept="image/*,video/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const previewURL = URL.createObjectURL(file);
                  setCurrentMedia(previewURL); // Preview
                  setNewMediaUrl(""); // Clear manual URL
                  setUploadedFile(file); // 💡 Store the actual file
                }
              }}
            />
          </Button>

          {/* Media Preview */}
          {item?.mediaUrl &&
            (item?.mediaUrl.includes("video") ? (
              <video
                controls
                src={item.mediaUrl}
                style={{
                  width: "100%",
                  maxHeight: "200px", // Reduced height for video
                  objectFit: "contain", // Ensure the full video fits without cropping
                  borderRadius: 8,
                  marginTop: 8,
                }}
              />
            ) : (
              <img
                src={item?.mediaUrl}
                alt="preview"
                style={{
                  width: "100%",
                  maxHeight: "200px", // Reduced height for image
                  objectFit: "contain", // Ensure the full image fits without cropping
                  borderRadius: 8,
                  marginTop: 8,
                }}
              />
            ))}

          <Button
            variant="contained"
            onClick={handleEditTweetSubmit}
            sx={{ marginTop: 2 }}
          >
            Save Changes
          </Button>
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export default TweetCard;
