import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Avatar, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FmGoodIcon from "@mui/icons-material/FmdGood";
import FaceIcon from "@mui/icons-material/Face";
import ImageIcon from "@mui/icons-material/Image";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import { useState } from "react";

const style = {
  
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "600px",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  outline: "none",
  borderRadius: "8px",
};

export default function ReplyModal({handleClose,open}) {
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      content: "",
      image: "",
    },
    onSubmit: (values) => {
      console.log("Form Submitted:", values);
      handleClose();
    },
  });

  const handleSelectImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue("image", file);
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style} className="w-full max-w-md p-4">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2">
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
         
          <div></div>
        </div>

        {/* User Info */}
        <div className="flex items-center space-x-3 mt-4">
          <Avatar src="https://res.cloudinary.com/dwviccr1k/image/upload/v1742509569/crop_images/aeudds4jgbq255rvg2al.jpg" />
          <div>
            <p className="font-semibold">Amandhi</p>
            <p className="text-gray-500 text-sm">@Amandhibuduwewa · 2m</p>
          </div>
        </div>

        {/* Reply Form */}
        <form onSubmit={formik.handleSubmit} className="mt-4">
          <textarea
            className="w-full border-none outline-none text-lg p-2 resize-none bg-transparent"
            rows="3"
            placeholder="What's happening?"
            {...formik.getFieldProps("content")}
          ></textarea>
          {formik.errors.content && formik.touched.content && (
            <p className="text-red-500 text-sm">{formik.errors.content}</p>
          )}

          {/* Image Preview */}
          {selectedImage && (
            <div className="mt-3">
              <img
                src={selectedImage}
                alt="Selected"
                className="w-full rounded-md"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex space-x-4">
              <label className="cursor-pointer flex items-center">
                <ImageIcon className="text-blue-500" />
                <input
                  type="file"
                  name="image"
                  className="hidden"
                  onChange={handleSelectImage}
                />
              </label>
              <FmGoodIcon className="text-blue-500" />
              <FaceIcon className="text-blue-500" />
            </div>

            <Button
              variant="contained"
              type="submit"
              className="bg-blue-500 rounded-full px-6 py-2"
            >
              Tweet
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
}
