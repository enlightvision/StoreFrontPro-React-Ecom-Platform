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
import { loginUserAPI } from "../../api/ApiHelper";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import { componentPaths } from "../../api/Path";
import { serverUrl } from "../../constant";
import { setItem } from "../../utils/storageService";
import useAuth from "../../hooks/useAuth";
import { messageSnakebar } from "../../utils/messageSnakebar";

const defaultTheme = createTheme();

export default function Login() {
  const [inputValue, setInputValue] = React.useState<Record<string, string>>(
    {}
  );
  const [error, setError] = React.useState<any[]>([]);
  const [isSubmitted, setIsSubmitted] = React.useState<boolean>(false);
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
    const validation = Validation(inputValue, "login");
    if (validation.length > 0) {
      setError(validation);
      return;
    }
    try {
      const result: any = await loginUserAPI(inputValue);

      if (result && result.status) {
        setItem("user", result.data.result);
        setItem("accessToken", result.data.accessToken);
        setItem("refreshToken", result.data.refreshToken);
        setIsAuthenticated(true);
        navigate(componentPaths.home);
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      messageSnakebar(
        error?.response?.data?.message || "Login failed",
        "error"
      );
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({ ...prev, [name]: value }));
    if (isSubmitted) {
      const validation = Validation({ ...inputValue, [name]: value }, "login");
      setError(validation.length > 0 ? validation : []);
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
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              error={error.some((e) => e.key === "email")}
              helperText={error.find((e) => e.key === "email")?.message}
              onChange={handleChange}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              error={error.some((e) => e.key === "password")}
              helperText={error.find((e) => e.key === "password")?.message}
              onChange={handleChange}
            />
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
                href={`${serverUrl}/user/auth/google`}
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
                href={`${serverUrl}/user/auth/facebook`}
              >
                <Avatar
                  sx={{ p: 0.5, mr: 1 }}
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWmwYccpGN_2SFl5JJMSaCdmCGmLyaKEwEVw&s"
                />{" "}
                facebook
              </IconButton>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2"></Link>
              </Grid>
              <Grid item>
                <Link href={componentPaths.register} variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
