import React, { useState } from "react";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import * as Yup from "yup";
import { Formik, FormikHelpers } from "formik";
import EyeOutlined from "@ant-design/icons/EyeOutlined";
import EyeInvisibleOutlined from "@ant-design/icons/EyeInvisibleOutlined";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { adminLogin } from "../../api/adminApi";
import { messageSnakebar } from "../../../utils/messageSnakebar";
import { setItem } from "../../../utils/storageService";
import { useNavigate } from "react-router-dom";
import { componentPaths } from "../../../api/Path";

interface AuthLoginProps {
  isDemo?: boolean;
}

interface FormValues {
  email: string;
  password: string;
}

const AdminLogin: React.FC<AuthLoginProps> = ({}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleAdminLogin = async (data: FormValues) => {
    try {
      const result = await adminLogin(data);
      if (result.status) {
        setItem("accessToken", result.data.accessToken);
        setItem("refreshToken", result.data.refreshToken);
        setItem("user", result.data.result);
        navigate(componentPaths.adminDashborad);
      }
    } catch (error: any) {
      console.log(error);
      messageSnakebar(
        error?.response?.data?.message || "Login failed",
        "error"
      );
    }
  };

  return (
    <>
      <Grid container className="Grid_background">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            p: 2,
          }}
        >
          <Card
            sx={{
              width: 400,
              boxShadow: 5,
              borderRadius: 2.5,
              fontSize: "0.75rem",
              p: 2,
              "& pre": {
                m: 0,
                p: "16px !important",
              },
            }}
          >
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h5"
                  width={"100%"}
                  fontWeight={"bold"}
                  p={2}
                >
                  Login
                </Typography>
              </Box>
            </Grid>
            <CardContent>
              <Grid item xs={12}>
                <Formik
                  initialValues={{
                    email: "",
                    password: "",
                  }}
                  validationSchema={Yup.object().shape({
                    email: Yup.string()
                      .email("Must be a valid email")
                      .max(255)
                      .required("Email is required"),
                    password: Yup.string()
                      .max(255)
                      .required("Password is required"),
                  })}
                  // @ts-ignore
                  onSubmit={(
                    values: FormValues,
                    { setSubmitting }: FormikHelpers<FormValues>
                  ) => {
                    // Handle form submission
                    setSubmitting(false);
                    handleAdminLogin({
                      email: values.email,
                      password: values.password,
                    });
                  }}
                >
                  {({
                    errors,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    touched,
                    values,
                  }) => (
                    <form noValidate onSubmit={handleSubmit}>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <Stack spacing={1}>
                            <InputLabel
                              htmlFor="email-login"
                              sx={{ color: "black", fontWeight: 400 }}
                            >
                              Email Address
                            </InputLabel>
                            <OutlinedInput
                              id="email-login"
                              type="email"
                              value={values.email}
                              name="email"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              placeholder="Enter email address"
                              fullWidth
                              size="small"
                              error={Boolean(touched.email && errors.email)}
                            />
                          </Stack>
                          {touched.email && errors.email && (
                            <FormHelperText
                              error
                              id="standard-weight-helper-text-email-login"
                            >
                              {errors.email}
                            </FormHelperText>
                          )}
                        </Grid>
                        <Grid item xs={12}>
                          <Stack spacing={1}>
                            <InputLabel
                              htmlFor="password-login"
                              sx={{ color: "black", fontWeight: 400 }}
                            >
                              Password
                            </InputLabel>
                            <OutlinedInput
                              fullWidth
                              error={Boolean(
                                touched.password && errors.password
                              )}
                              id="password-login"
                              type={showPassword ? "text" : "password"}
                              value={values.password}
                              name="password"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              placeholder="Enter Password"
                              size="small"
                              endAdornment={
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                  >
                                    {showPassword ? (
                                      <EyeInvisibleOutlined />
                                    ) : (
                                      <EyeOutlined />
                                    )}
                                  </IconButton>
                                </InputAdornment>
                              }
                            />
                          </Stack>
                          {touched.password && errors.password && (
                            <FormHelperText
                              error
                              id="standard-weight-helper-text-password-login"
                            >
                              {errors.password}
                            </FormHelperText>
                          )}
                        </Grid>
                        <Grid item xs={12}>
                          <Stack spacing={1}>
                            <Button
                              disableElevation
                              onBlur={handleBlur}
                              disabled={isSubmitting}
                              variant="contained"
                              type="submit"
                              sx={{
                                transition: ".2s ease",
                                p: 1,
                                backgroundColor: "#1677ff",
                                "&:hover": {
                                  backgroundColor: "#1677ff",
                                  transform: "scale(1.03)",
                                },
                              }}
                            >
                              Login
                            </Button>
                          </Stack>
                        </Grid>
                      </Grid>
                    </form>
                  )}
                </Formik>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Grid>
    </>
  );
};

export default AdminLogin;
