import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import avatar1 from "../assets/user/avatar-1.png";

import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  SearchOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  FormControl,
  Grid,
  InputAdornment,
  OutlinedInput,
  useMediaQuery,
} from "@mui/material";
import { Outlet } from "react-router-dom";
import { getItem } from "../../utils/storageService";
import { serverUrl } from "../../constant";

const drawerWidth = 260;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  backgroundColor: "#fafafb",
  height: "100vh",
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function AdminDashboardLayout() {
  const [open, setOpen] = React.useState(true);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const user = getItem("user", {});

  const handleListItemClick = (
    _event: React.MouseEvent<HTMLDivElement>,
    index: number
  ) => {
    setSelectedIndex(index);
  };

  const handleDrawerOpen = () => {
    setOpen(!open);
    setMobileOpen(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box>
      <DrawerHeader>A D M I N </DrawerHeader>
      <List
        component="nav"
        sx={{ p: 0, "& .MuiListItemIcon-root": { minWidth: 32 } }}
      >
        {[
          {
            text: "Dashboard",
            icon: DashboardOutlined,
          },
          { text: "Dashboard", icon: DashboardOutlined },
          { text: "Dashboard", icon: DashboardOutlined },
        ].map((x, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              selected={selectedIndex === index}
              sx={{
                ...(selectedIndex === index && {
                  borderRight: "1px solid #1677ff",
                  color: "#1677ff",
                }),
              }}
              onClick={(event) => handleListItemClick(event, index)}
            >
              <ListItemIcon>
                {
                  <x.icon
                    style={{
                      ...(selectedIndex === index && {
                        color: "#1677ff",
                      }),
                    }}
                  />
                }
              </ListItemIcon>
              <ListItemText primary={x.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      sx={{
        position: "absolute",
        zIndex: 99999,
        top: 0,
        height: "100%",
        width: "100%",
        background: "white",
        display: "flex",
        "& .MuiDrawer-paper": {
          borderRight: "1px solid #f0f0f0",
        },
      }}
    >
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#ffffff",
          boxShadow: 0,
          borderBottom: "1px solid #f0f0f0",
          color: "black",
          ...(open && {
            width: {
              xs: `100%`,
              md: `calc(100% - ${drawerWidth}px)`,
            },
            marginLeft: drawerWidth,
          }),
        }}
        open={open}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Grid
            container
            sx={{ justifyContent: "space-between", width: "100%" }}
          >
            <Grid item xs={7} md={8} sx={{ display: "flex" }}>
              <IconButton
                color="default"
                aria-label="open drawer"
                edge="start"
                onClick={isMobile ? handleDrawerToggle : handleDrawerOpen}
                sx={{
                  mr: 2,
                  backgroundColor: "#f0f0f0",
                  borderRadius: 2,
                }}
              >
                {isMobile ? (
                  mobileOpen ? (
                    <MenuFoldOutlined />
                  ) : (
                    <MenuUnfoldOutlined />
                  )
                ) : open ? (
                  <MenuFoldOutlined />
                ) : (
                  <MenuUnfoldOutlined />
                )}
              </IconButton>
              <FormControl sx={{ width: { xs: "100%", md: 224 } }}>
                <OutlinedInput
                  size="small"
                  id="header-search"
                  startAdornment={
                    <InputAdornment position="start" sx={{ mr: 1 }}>
                      <SearchOutlined />
                    </InputAdornment>
                  }
                  aria-describedby="header-search-text"
                  inputProps={{
                    "aria-label": "weight",
                  }}
                  placeholder="Ctrl + K"
                />
              </FormControl>
            </Grid>
            <Grid item xs={4} md={2}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  justifyContent: "end",
                }}
              >
                <Avatar
                  alt="profile user"
                  src={serverUrl + user.avatar}
                  sx={{ width: 35, height: 35 }}
                />
                <Typography sx={{ fontSize: "1rem" }} variant="h6">
                  {user.firstName + " " + user.lastName}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          display: { xs: "block", md: "none" },
          width: drawerWidth,
          // borderRight: "1px solid #f0f0f0",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
      >
        {drawer}
      </Drawer>
      <Drawer
        sx={{
          display: { xs: "none", md: "block" },
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        {drawer}
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Outlet />
      </Main>
    </Box>
  );
}
