import { Button, Grid } from '@mui/material';
import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import AuthModal from './AuthModal';
import { useDispatch } from 'react-redux';
import { googleLogin, loginUser } from '../../Store/Auth/action';


const Authentication = () => {
  const [openAuthModel, setOpenAuthModel] = useState(false);
  const dispatch = useDispatch();

  const handleOpenAuthModel = () => setOpenAuthModel(true);
  const handleCloseAuthModel = () => setOpenAuthModel(false);

  const handleGoogleLogin = async (response) => {
    if (response.credential) {
      try {
        const token = response.credential; // Token from Google OAuth
        // Dispatch the action to log in via Google
        dispatch(googleLogin(token));
      } catch (error) {
        console.error('Error during Google login:', error);
      }
    }
  };
  
  return (
    <div className="h-screen">
      <Grid container className="h-full">
        {/* Left image section */}
        <Grid item lg={7} className="hidden lg:block h-full">
          <div className="relative w-full h-full">
            <img
              className="w-full h-full object-cover"
              src="https://abs.twimg.com/sticky/illustrations/lohp_en_1302x955.png"
              alt="Background"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                className="w-[100px] h-[100px]"
                src="https://th.bing.com/th/id/OIP.dhMTD102krLdbAvJxdKDBwHaHa?rs=1&pid=ImgDetMain"
                alt="Logo"
              />
            </div>
          </div>
        </Grid>

        {/* Right text + Google login */}
        <Grid item lg={5} xs={12} className="h-full flex flex-col justify-start px-10 pt-28">
          <h1 className="font-bold text-5xl">Happening Now</h1>
          <h1 className="font-bold text-3xl py-16">Join Twilio Today</h1>
          <div className="w-[60%]">
            <GoogleLogin 
              onSuccess={handleGoogleLogin}
              onError={(error) => console.log(error)}
              useOneTap 
            />
            <p className="py-5 text-center">OR</p>
            <Button onClick={handleOpenAuthModel} fullWidth variant="contained" size="large" sx={{ borderRadius: "29px", py: "7px" }}>
              Create Account
            </Button>
            <p className="text-sm mt-2">By signing up, you agree to the Terms of services</p>
          </div>
          <div className="mt-10">
            <h1 className="font-bold text-xl mb-5">Already Have Account</h1>
            <Button onClick={handleOpenAuthModel} fullWidth variant="outlined" size="large" sx={{ borderRadius: "29px", py: "7px" }}>
              Login
            </Button>
          </div>
        </Grid>
      </Grid>
      <AuthModal open={openAuthModel} handleClose={handleCloseAuthModel} />
    </div>
  );
};

export default Authentication;
