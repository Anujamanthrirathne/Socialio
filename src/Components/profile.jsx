import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Avatar, Button } from "@mui/material";
import TweetCard from "../HomeSection/TweetCard";
import ProfileModal from "./ProfileModal";
import { useDispatch, useSelector } from "react-redux";
import { findUserById } from "../../Store/Auth/action";
import axios from "axios";
import { API_BASE_URL } from "../../Config/api";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);  // Track following status
  const { auth } = useSelector(store => store);

  const user = auth.findUser;  // The user being viewed
  const currentUser = auth.user;  // The logged-in user

  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState("1");

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        await dispatch(findUserById(id)); // Fetch the user by id
      }
      setLoading(false);
    };
    fetchData();
  }, [id, dispatch]);

  useEffect(() => {
    if (currentUser && user) {
      // Check if the current user is following the profile user
      setIsFollowing(currentUser.following?.includes(user.id));  // Adjust according to your data structure
    }
  }, [currentUser, user]);

  if (loading || !user || !currentUser) return <div className="text-center py-10">Loading profile...</div>;

  const handleBack = () => {
    navigate(-1);
  };

  const handleOpenProfileModel = () => setOpenProfileModal(true);
  const handleClose = () => setOpenProfileModal(false);

  const handleFollowUser = async () => {
    try {
      if (isFollowing) {
        // Send unfollow request to backend
        await axios.post(`${API_BASE_URL}/api/users/${currentUser.id}/unfollow/${user.id}`);
        setIsFollowing(false);  // Update state to unfollow
      } else {
        // Send follow request to backend
        await axios.post(`${API_BASE_URL}/api/users/${currentUser.id}/follow/${user.id}`);
        setIsFollowing(true);  // Update state to follow
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      {/* Top Navigation */}
      <section className="bg-white z-50 flex items-center sticky top-0 bg-white shadow-sm py-3 px-4">
        <KeyboardBackspaceIcon className="cursor-pointer" onClick={handleBack} />
        <h1 className="ml-4 text-xl font-bold opacity-90">{user?.name}</h1>
      </section>

      {/* Cover Image */}
      <section>
        <img
          className="w-full h-60 object-cover rounded-t-lg"
          src={user?.backgroundImage}
          alt="Profile Cover"
        />
      </section>

      {/* Profile Info */}
      <section className="px-6 relative">
        <div className="flex justify-between items-start -mt-12">
          <Avatar
            className="border-5 border-white shadow-md"
            alt={user?.name}
            src={user?.profilePicture}
            sx={{ width: "8rem", height: "8rem" }}
          />

          {/* Show Edit if it's your profile, else Follow */}
          {currentUser && user && currentUser.id === user.id ? (
            <Button
              onClick={handleOpenProfileModel}
              variant="outlined"
              sx={{
                borderRadius: "20px",
                borderColor: "#1DA1F2",
                color: "#1DA1F2",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#1DA1F2",
                  color: "white",
                },
              }}
            >
              Edit Profile
            </Button>
          ) : (
            <Button
              onClick={handleFollowUser}  // Toggle follow/unfollow
              variant="contained"
              sx={{
                borderRadius: "20px",
                backgroundColor: isFollowing ? "#e0245e" : "#1DA1F2",
                color: "white",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: isFollowing ? "#c21d4b" : "#1A91DA",
                },
              }}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          )}
        </div>

        {/* User Info */}
        <div className="mt-4">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold">{user?.name}</h1>
            {user?.verified && (
              <img
                src="https://abs.twimg.com/responsive-web/client-web/verification-card-v2@3x.8ebee01a.png"
                alt="Verified"
                className="w-5 h-5"
              />
            )}
          </div>
          <h2 className="text-gray-500 text-lg">@{user?.name?.split(" ").join("_").toLowerCase()}</h2>
        </div>

        {/* Bio & Details */}
        <div className="mt-3 space-y-3">
          <p className="text-gray-700">{user?.bio}</p>

          <div className="py-1 flex flex-wrap space-x-5 text-gray-500">
            <div className="flex items-center space-x-2">
              <BusinessCenterIcon />
              <p>code with chama academy</p>
            </div>
            <div className="flex items-center space-x-2">
              <LocationOnIcon />
              <p>{user?.location}</p>
            </div>
            <div className="flex items-center space-x-2">
              <CalendarMonthIcon />
              <p>Wish Me 😎 {user?.birthDate}</p>
            </div>
          </div>

          <div className="flex items-center space-x-5 font-semibold">
            <div className="flex items-center space-x-1">
              <span>{user?.following?.length || 0}</span>
              <span className="text-gray-500">Following</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>{user?.followers?.length || 0}</span>
              <span className="text-gray-500">Followers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-5">
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList onChange={handleChange} aria-label="profile tabs">
                <Tab label="Tweets" value="1" />
                <Tab label="Replies" value="2" />
                <Tab label="Media" value="3" />
                <Tab label="Likes" value="4" />
              </TabList>
            </Box>
            <TabPanel value="1">
              {[1, 1, 1, 1].map((item, i) => (
                <TweetCard key={i} />
              ))}
            </TabPanel>
            <TabPanel value="2">User's Replies</TabPanel>
            <TabPanel value="3">Media</TabPanel>
            <TabPanel value="4">Likes</TabPanel>
          </TabContext>
        </Box>
      </section>

      <ProfileModal handleClose={handleClose} open={openProfileModal} />
    </div>
  );
};

export default Profile;