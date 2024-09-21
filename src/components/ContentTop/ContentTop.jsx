/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import "./ContentTop.css";
import { SidebarContext } from "../../Context/sidebarContext";
import { Menu, MenuItem, IconButton, Divider } from "@mui/material";
import { iconsImgs } from "../../utils/images";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import SettingsIcon from "@mui/icons-material/Settings"; // Icono para Configurar
import ExitToAppIcon from "@mui/icons-material/ExitToApp"; // Icono para Cerrar sesión

const ContentTop = () => {
  const { toggleSidebar } = useContext(SidebarContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  };

  return (
    <div className="main-content-top">
      <div className="content-top-left">
        <button type="button" className="sidebar-toggle" onClick={() => toggleSidebar()}>
          <img src={iconsImgs.menu} alt="menu-icon" />
        </button>
        <h3 className="content-top-title">Inicio</h3>
      </div>

      <div className="content-top-btns">
        <IconButton className="content-top-btn">
          <NotificationsIcon fontSize="large" />
          <span className="notification-btn-dot"></span>
        </IconButton>

        <IconButton onClick={toggleDarkMode} style={{ marginLeft: "10px" }}>
          {darkMode ? <Brightness7Icon fontSize="large" /> : <Brightness4Icon fontSize="large" />}
        </IconButton>

        <IconButton onClick={handleMenuOpen} style={{ marginLeft: "10px" }}>
          <AccountCircleIcon fontSize="large" />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          PaperProps={{
            style: {
              borderRadius: "10px",
              padding: "8px",
              minWidth: "150px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          <MenuItem
            onClick={handleMenuClose}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              margin: "4px 0",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#f0f0f0")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
          >
            <SettingsIcon style={{ marginRight: "10px" }} />
            Configurar
          </MenuItem>

          <Divider />

          <MenuItem
            onClick={handleMenuClose}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              margin: "4px 0",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#f0f0f0")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
          >
            <ExitToAppIcon style={{ marginRight: "10px" }} />
            Cerrar sesión
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default ContentTop;