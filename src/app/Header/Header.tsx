import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import SearchIcon from "@mui/icons-material/Search";
import Person2RoundedIcon from "@mui/icons-material/Person2Rounded";
import LocalMallRoundedIcon from "@mui/icons-material/LocalMallRounded";
import {
  Badge,
  Divider,
  List,
  SwipeableDrawer,
  TextField,
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import { updateUserProfile } from "../../api/ApiHelper";
import EditIcon from "@mui/icons-material/Edit";
import LoginIcon from "@mui/icons-material/Login";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../../constant";
import { componentPaths } from "../../api/Path";
import { getItem, setItem } from "../../utils/storageService";
import Logo from "../../assets/eco-e.png";
import useAuth from "../../hooks/useAuth";
import useCart from "../../hooks/userCart";
import { messageSnakebar } from "../../utils/messageSnakebar";

const pages = ["Products", "Pricing", "Blog"];

type UserDetails = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  avatar: object | any;
};

function Header({ setSearch }: any): any {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const [IsScroll, setIsScroll] = React.useState<Boolean>(false);
  const [drawerOpen, setDrawerOpen] = React.useState<Boolean | any>(false);
  const [openSearch, setopenSearch] = React.useState<null | HTMLElement>(null);
  const [isUpdatedClick, setisUpdatedClick] = React.useState<Boolean>(false);
  const [InputValue, setInputValue] = React.useState<UserDetails>(
    getItem("user", {})
  );
  // const [Error, setError] = React.useState<any>([])
  // const [IsSubmited, setIsSubmited] = React.useState<Boolean>(false)
  const [user, setUser] = React.useState<UserDetails>(getItem("user", {}));
  const { setIsAuthenticated, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { cart }: any = useCart();

  React.useEffect(() => {
    setUser(getItem("user", {}));
  }, [isAuthenticated]);

  React.useEffect(() => {
    const HeaderEffect = () => {
      if (window.scrollY) {
        setIsScroll(true);
      } else {
        setIsScroll(false);
      }
    };
    window.addEventListener("scroll", HeaderEffect);
    return () => window.removeEventListener("scroll", HeaderEffect);
  }, []);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setAnchorElUser(event.currentTarget);
  };

  const handleOpenSearch = (event: React.MouseEvent<HTMLElement>) => {
    setopenSearch(event.currentTarget);
  };

  const handleCloseSearch = () => {
    setSearch((pre: any) => ({ ...pre, search: true }));
    setopenSearch(null);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handelLogOut = () => {
    setAnchorElUser(null);
    setIsAuthenticated(false);
    localStorage.clear();
    navigate("/login");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();

      const Data = new FormData(event.currentTarget);

      if (InputValue.avatar && InputValue.avatar?.type) {
        Data.append("avatar", InputValue.avatar as any);
      }

      Data.append("_id", user._id as any);

      const result = await updateUserProfile(Data);

      if (result && result.status) {
        messageSnakebar("Profile Updated Successfully", "success");
        setItem("user", result.data);
        setUser(getItem("user", {}));
      }
    } catch (error: any) {
      if (error && error?.response.data.message) {
        return messageSnakebar(error?.response?.data?.message, "error");
      }
    }
  };

  const handleChange = (e: any) => {
    const value = e.target.value;
    setInputValue({ ...InputValue, [e.target.name]: value });
  };

  return (
    <AppBar
      position="sticky"
      color="transparent"
      sx={{
        visibility:
          window.location.pathname == componentPaths.login ||
          window.location.pathname.includes("admin") ||
          window.location.pathname == componentPaths.register
            ? "hidden"
            : "visible",
        backgroundColor: "white",
        p: 1.5,
        transition: ".5s",
        width: IsScroll ? "98%" : "100%",
        top: IsScroll ? "1%" : "0%",
        left: IsScroll ? "1%" : "0%",
        borderRadius: IsScroll ? "5px" : "0%",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <img src={Logo} style={{ height: "5vh" }} alt="Error" />
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none', }, mr: 1 }} /> */}
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <img src={Logo} style={{ height: "5vh" }} alt="Error" />
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button sx={{ my: 2, color: "black", display: "block" }}>
              {/* Home */}
            </Button>
            <Button sx={{ my: 2, color: "black", display: "block" }}>
              {/* About */}
            </Button>
            <Button sx={{ my: 2, color: "black", display: "block" }}>
              {/* Contact */}
            </Button>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Box sx={{ display: "flex" }}>
              {isAuthenticated ? (
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu}>
                    <Person2RoundedIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title="Log In">
                  <IconButton color="inherit" onClick={handelLogOut}>
                    <LoginIcon />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Open search">
                <IconButton onClick={handleOpenSearch}>
                  <SearchIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Shopping Cart">
                <IconButton onClick={() => navigate(componentPaths.cart)}>
                  <Badge color="secondary" badgeContent={cart?.length || 0}>
                    <LocalMallRoundedIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            </Box>
            <SwipeableDrawer
              anchor="right"
              open={drawerOpen}
              disableSwipeToOpen={false}
              onClose={() => {
                setDrawerOpen(false);
                setisUpdatedClick(false);
                setInputValue({
                  ...getItem("user", {}),
                });
              }}
              transitionDuration={550}
              onOpen={() => {
                setDrawerOpen(true);
              }}
              sx={{
                ".MuiDrawer-paper": {
                  height: isUpdatedClick ? "93vh" : "50vh",
                  borderRadius: "5px",
                  m: 2,
                },
                ".MuiModal-backdrop": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <Box
                role="presentation"
                sx={{
                  width: 300,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                <h5 style={{ padding: "10px" }}>User Profile</h5>
                <List>
                  <img
                    className="img-fluid"
                    style={{
                      borderRadius: "50%",
                      height: "15vh",
                      width: "15vh",
                    }}
                    src={
                      InputValue?.avatar?.type?.includes("image")
                        ? URL.createObjectURL(InputValue.avatar)
                        : user?.avatar?.includes("uploads")
                        ? `${serverUrl}${user.avatar}`
                        : user?.avatar || "./Userprofile/userprofile.jpg"
                    }
                    alt="user picture"
                  />
                  <br />
                  {isUpdatedClick && (
                    <label>
                      <EditIcon color="info" sx={{ m: 1 }} />
                      <input
                        type="file"
                        accept="image/*"
                        name="avatar"
                        onChange={(e) =>
                          setInputValue({
                            ...InputValue,
                            // @ts-ignore
                            avatar: e.target.files[0],
                          })
                        }
                      />
                    </label>
                  )}
                </List>
                <Divider />
                <List>
                  <Box textAlign={"center"} p={2}>
                    <Typography>{`${user?.firstName} ${user?.lastName}`}</Typography>
                    <Typography>{user?.email}</Typography>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setInputValue(getItem("user", {}));
                        setisUpdatedClick((prev) => !prev);
                      }}
                      color="info"
                      sx={{ m: 1 }}
                    >
                      Edit Profile
                    </Button>
                  </Box>
                </List>
                {isUpdatedClick && (
                  <List>
                    <Box component="form" onSubmit={handleSubmit}>
                      <TextField
                        required
                        autoFocus
                        margin="dense"
                        id="firstName"
                        name="firstName"
                        label="First Name"
                        type="text"
                        color="info"
                        variant="filled"
                        value={InputValue?.firstName}
                        onChange={handleChange}
                      />
                      <TextField
                        required
                        autoFocus
                        margin="dense"
                        id="lastName"
                        name="lastName"
                        label="Last Name"
                        type="text"
                        value={InputValue?.lastName}
                        color="info"
                        variant="filled"
                        onChange={handleChange}
                      />
                      <TextField
                        required
                        autoFocus
                        margin="dense"
                        id="address"
                        name="address"
                        label="Address"
                        type="text"
                        color="info"
                        variant="filled"
                        value={InputValue?.address}
                        onChange={handleChange}
                      />
                      <br />
                      <Button
                        variant="contained"
                        sx={{ m: 2 }}
                        type="submit"
                        color="info"
                      >
                        Save
                      </Button>
                    </Box>
                  </List>
                )}
              </Box>
            </SwipeableDrawer>

            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem
                onClick={() => {
                  setDrawerOpen(true);
                  setAnchorElUser(null);
                }}
              >
                <Typography textAlign="center">Profile</Typography>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigate(componentPaths.wishList);
                  handleCloseNavMenu();
                  handleCloseUserMenu();
                }}
              >
                <Typography textAlign="center">Wishlist</Typography>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigate(componentPaths.orderHistory);
                  handleCloseNavMenu();
                  handleCloseUserMenu();
                }}
              >
                <Typography textAlign="center">Order History</Typography>
              </MenuItem>
              <MenuItem onClick={handelLogOut}>
                <Typography textAlign="center">Log Out</Typography>
              </MenuItem>
            </Menu>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-search"
              anchorEl={openSearch}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(openSearch)}
              onClose={handleCloseSearch}
            >
              <Box sx={{ p: 1, display: "flex", alignItems: "center" }}>
                <TextField
                  type="search"
                  onChange={(e) => setSearch({ text: e.target.value })}
                  variant="outlined"
                  placeholder="search..."
                />
                <IconButton
                  sx={{ m: 1 }}
                  color="inherit"
                  onClick={handleCloseSearch}
                >
                  <DoneIcon />
                </IconButton>
              </Box>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;
