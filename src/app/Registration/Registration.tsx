import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Validation from "../Validation/Validation";
import { registerUserAPI } from "../../api/ApiHelper";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import { componentPaths } from "../../api/Path";
import { messageSnakebar } from "../../utils/messageSnakebar";

const defaultTheme = createTheme();

export default function Register() {
  const [InputValue, setInputValue] = React.useState<object>({});
  const [Error, setError] = React.useState<any>([]);
  const [IsSubmited, setIsSubmited] = React.useState<Boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      setIsSubmited(true);
      const validation = Validation(InputValue, "register");
      if (validation.length > 0) {
        setError(validation);
        return;
      }
      const user = {
        firstName: data.get("firstName"),
        lastName: data.get("lastName"),
        email: data.get("email"),
        password: data.get("password"),
      };
      const result = await registerUserAPI(user);
      if (result && result.status) {
        navigate(componentPaths.login);
        return;
      }
    } catch (error: any) {
      console.log(error);
      messageSnakebar(
        error?.response?.data?.message || "Register failed",
        "error"
      );
    }
  };

  const handleChange = (e: any) => {
    const value = e.target.value;
    setInputValue({ ...InputValue, [e.target.name]: value });
    if (IsSubmited) {
      const validation = Validation(
        { ...InputValue, [e.target.name]: value },
        "register"
      );
      if (validation.length > 0) {
        setError(validation);
      } else {
        setError([]);
      }
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  error={
                    Error.some((x: any) => x.key == "firstName") ? true : false
                  }
                  onChange={(e) => handleChange(e)}
                  helperText={
                    Error.find((x: any) => x.key === "firstName")?.message
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  error={
                    Error.some((x: any) => x.key == "lastName") ? true : false
                  }
                  onChange={(e) => handleChange(e)}
                  helperText={
                    Error.find((x: any) => x.key === "lastName")?.message
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  error={
                    Error.some((x: any) => x.key == "email") ? true : false
                  }
                  onChange={(e) => handleChange(e)}
                  helperText={
                    Error.find((x: any) => x.key === "email")?.message
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  error={
                    Error.some((x: any) => x.key == "password") ? true : false
                  }
                  onChange={(e) => handleChange(e)}
                  helperText={
                    Error.find((x: any) => x.key === "password")?.message
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="ConfirmPassword"
                  label="Confirm-Password"
                  type="password"
                  id="Confirmpassword"
                  autoComplete="new-password"
                  error={
                    Error.some((x: any) => x.key == "ConfirmPassword")
                      ? true
                      : false
                  }
                  onChange={(e) => handleChange(e)}
                  helperText={
                    Error.find((x: any) => x.key === "ConfirmPassword")?.message
                  }
                />
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", gap: 1, flexDirection: "" }}
              >
                <IconButton
                  sx={{
                    border: "1px solid #80808026",
                    borderRadius: "3px",
                    width: "50%",
                  }}
                  href="http://localhost:5000/api/v1/user/auth/google"
                >
                  <Avatar src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" />{" "}
                  google
                </IconButton>
                <IconButton
                  sx={{
                    border: "1px solid #80808026",
                    borderRadius: "3px",
                    width: "50%",
                  }}
                >
                  <Avatar
                    sx={{ p: 0.5, mr: 1 }}
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWmwYccpGN_2SFl5JJMSaCdmCGmLyaKEwEVw&s"
                  />{" "}
                  facebook
                </IconButton>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href={componentPaths.login} variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
