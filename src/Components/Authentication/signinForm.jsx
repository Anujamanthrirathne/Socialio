import { Button, Grid, TextField } from "@mui/material";
import { blue } from "@mui/material/colors";
import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { loginUser } from "../../Store/Auth/action";



const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is Required"),
  password: Yup.string().required("Password is Required"),
});

const SigninForm = () => {
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(loginUser(values))
      console.log("form value", values);
    },
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          {/* Email Input */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              variant="outlined"
              size="large"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Grid>

          {/* Password Input */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              variant="outlined"
              size="large"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button
              sx={{
                borderRadius: "29px",
                py: "15px",
                bgcolor: blue[500],
                "&:hover": {
                  bgcolor: blue[700],
                },
              }}
              type="submit"
              fullWidth
              variant="contained"
              size="large"
            >
              Sign In
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default SigninForm;
