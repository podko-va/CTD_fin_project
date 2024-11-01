import { inputEnabled, setDiv } from "./index.js";
import { showLogin } from "./login.js";
import { showRegister } from "./register.js";

let loginRegisterDiv = null;
let loginRegisterIni = null;

export const handleLoginRegisterIni = () => {
  loginRegisterIni = document.getElementById("about");
  const letsTry = document.getElementById("letsTry");
  letsTry.addEventListener("click", (e) => {
    if (inputEnabled)  {
        showLoginRegister();
      }
    });
};

export const handleLoginRegister = () => {
  loginRegisterDiv = document.getElementById("logon-register");
  const login = document.getElementById("logon");
  const register = document.getElementById("register");
  // const register_p = document.getElementById("register_psychologist");
  loginRegisterDiv.addEventListener("click", (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === login) {
        showLogin();
      } else if (e.target === register) {
        showRegister();
      } else if (e.target === register_p) {
        showRegister(1);
      }
       else if (e.target === return_about) {
        showLoginIni();
      }
    }
  });
};

export const showLoginRegister = () => {
  setDiv(loginRegisterDiv);
};

export const showLoginIni = () => {
  setDiv(loginRegisterIni);
};