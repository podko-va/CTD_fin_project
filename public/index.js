let activeDiv = null;
export const setDiv = (newDiv) => {
  if (newDiv != activeDiv) {
    if (activeDiv && activeDiv.style) {
      activeDiv.style.display = "none";
    }
    if (newDiv && newDiv.style) {
      newDiv.style.display = "block";
    }
    activeDiv = newDiv;
  }
};

export let inputEnabled = true;
export const enableInput = (state) => {
  inputEnabled = state;
};

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

export let token = null;
export let isPsychologist = false;
export const setToken = (value) => {
  token = value;
  if (value) {
    localStorage.setItem("token", value);
    const decoded = parseJwt(token);
    isPsychologist = decoded.isPsychologist
    localStorage.setItem("isPsychologist",decoded.isPsychologist);
  } else {
    localStorage.removeItem("token");
    localStorage.removeItem("isPsychologist");
  }
};

export let message = null;

// import { showJobs, handleJobs } from "./jobs.js";
// import { showLoginRegister, handleLoginRegister } from "./loginRegister.js";
// import { handleLogin } from "./login.js";
// import { handleAddEdit } from "./addEdit.js";
// import { handleRegister } from "./register.js";
import { showAppointments, handleAppointments } from "./appointments.js";
import { showLoginRegister, handleLoginRegister, showLoginIni, handleLoginRegisterIni } from "./loginRegister.js";
import { handleLogin } from "./login.js";
import { handleAddEditAppointment } from "./addEditAppointment.js";
import { handleRegister } from "./register.js";


document.addEventListener("DOMContentLoaded", () => {
  token = localStorage.getItem("token");
  isPsychologist = localStorage.getItem("isPsychologist");
  message = document.getElementById("message");
  handleLoginRegisterIni();
  handleLoginRegister();
  handleLogin();
  handleAppointments();
  handleRegister();
  handleAddEditAppointment();
  if (token) {
    showAppointments();
  } else {
    showLoginIni();
  }
});