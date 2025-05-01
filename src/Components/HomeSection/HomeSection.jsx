import { Avatar, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ImageIcon from '@mui/icons-material/Image';
import FmGoodIcon from "@mui/icons-material/FmdGood";
import FaceIcon from '@mui/icons-material/Face';
import TweetCard from "./TweetCard";
import { getAllTweets } from "../../Store/Twitt/action";
import { useDispatch, useSelector } from 'react-redux';
import { uploadToCloudinary } from "../../Utils/uploadToCloudinary";
import axios from 'axios';  // For making API requests

const HomeSection = () => {
  const [uploadingImage, setUploadImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const dispatch = useDispatch();
  const { twit } = useSelector(store => store);
  
  const validationSchema = Yup.object().shape({
    content: Yup.string().required("Tweet text is required"),
  });

  const handleSubmit = async (values) => {
    const { content, image } = values;
    const tweetData = {
      content,
      mediaUrl: image, // Send the media URL (image URL) from Cloudinary
    };

    try {
      const response = await axios.post("http://localhost:8080/api/posts", tweetData, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("jwt")}`, // JWT token from localStorage
        }
      });

      if (response.status === 201) {
        // Optionally dispatch to update your Redux store with new tweet
        dispatch(getAllTweets());
        formik.resetForm(); // Clear the form after submission
      }
    } catch (error) {
      console.error("Error creating tweet:", error);
    }
  };

  useEffect(() => {
    dispatch(getAllTweets());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      content: "",
      image: "",
    },
    onSubmit: handleSubmit, // Formik will call handleSubmit on form submit
    validationSchema,
  });

  const handleSelectImage = async (event) => {
    setUploadImage(true);
    const imageUrl = await uploadToCloudinary(event.target.files[0]);
    formik.setFieldValue("image", imageUrl); // Set image field in Formik
    setSelectedImage(imageUrl);
    setUploadImage(false);
  };

  return (
    <div className="space-y-5">
      <section>
        <h1 className="py-5 text-xl font-bold opacity-90">Home</h1>
      </section>
      <section className="pb-10">
        <div className="flex space-x-5">
          <Avatar
            alt="username"
            src="https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_960_720.png"
          />
          <div className="w-full">
            <form onSubmit={formik.handleSubmit}>
              <div>
                <input
                  type="text"
                  name="content"
                  placeholder="What's happening?"
                  className="border-none outline-none text-xl bg-transparent"
                  {...formik.getFieldProps("content")}
                />
                {formik.errors.content && formik.touched.content && (
                  <span className="text-red-500">{formik.errors.content}</span>
                )}
              </div>

              <div className="flex justify-between items-center mt-5">
                <div className="flex space-x-5 items-center">
                  <label className="flex items-center space-x-2 rounded-md cursor-pointer">
                    <ImageIcon style={{ color: "#1d9bf0" }} />
                    <input
                      type="file"
                      name="imageFile"
                      className="hidden"
                      onChange={handleSelectImage}
                    />
                  </label>
                  <FmGoodIcon className="text-[#1d9bf0]" />
                  <FaceIcon className="text-[#1d9bf0]" />
                </div>
                <div>
                  <Button
                    sx={{
                      width: "100%",
                      borderRadius: "29px",
                      paddingY: "8px",
                      paddingX: "20px",
                      bgcolor: "#1d9bf0",
                    }}
                    variant="contained"
                    type="submit"
                  >
                    Tweet
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
      <section>
        {twit.tweets?.map((item) => (
          <TweetCard key={item.id} item={item} />
        ))}
      </section>
    </div>
  );
};

export default HomeSection;
