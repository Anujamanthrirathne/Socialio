import { Grid } from '@mui/material';
import React from 'react';
import Navigation from '../Navigation/Navigation';
import HomeSection from '../HomeSection/HomeSection';
import RightPart from '../RightPart/RightPart';
import { Route, Routes } from 'react-router-dom';
import Profile from '../Profile/Profile';
import TweetDetail from '../TweetDetails/TweetDetail';
import Notification from "../Notification/Notification";
import Resource from "../Resource/create/Resource";
import ResourceCard from "../Resource/ResourceCard/ResourceCard"
import Quiz from "../Quiz/create/Quiz"
import QuizCard from "../Quiz/QuizCard/QuizCard"
const HomePage = () => {
  return (
    <Grid container spacing={3} className="px-4 lg:px-32 min-h-screen">
      {/* Left Part (Navigation) */}
      <Grid item xs={12} lg={3} className="hidden lg:block pr-4">
        <Navigation />
      </Grid>

      {/* Middle Part (Main Content) */}
      <Grid item xs={12} lg={6} sx={{ paddingRight: '32px', flex: 1 }}>
        <div className="w-full">
          <Routes>
            <Route path="/" element={  <HomeSection />}></Route>
            <Route path="/home" element={  <HomeSection />}></Route>
            <Route path="/profile/:id" element={  <Profile />}></Route>
            <Route path="/twit/:tweetId" element={<TweetDetail />} /> 
            <Route path="/notification" element={<Notification/>}></Route>
            <Route path="/create-learning" element={<Resource/>}></Route>
            <Route path="/learning" element={<ResourceCard/>}></Route>
            <Route path="/create-quiz" element={<Quiz/>}></Route>
            <Route path="/quizzy" element={<QuizCard/>}></Route>
          </Routes>
        
        </div>
      </Grid>

      {/* Right Part (Extra Content) */}
      <Grid item xs={12} lg={3} className="hidden lg:flex justify-start pl-2">
       <RightPart/>
      </Grid>
    </Grid>
  );
};

export default HomePage;
