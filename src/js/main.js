"use strict";

const loginForm = document.querySelector("#loginform");
const registerForm = document.querySelector("#registerform");
const menu = document.querySelector("#menu");

window.onload = init;

function init() {
  changeMenu();

  if (loginForm) {
    loginForm.addEventListener("submit", loginUser);
  }
  if (registerForm) {
    registerForm.addEventListener("submit", createUser);
  }
}

function changeMenu() {
  if (localStorage.getItem("lab4_token")) {
    menu.innerHTML = `
  <li class="firstmenuchoice"><a href="home.html">Hem</a></li>
  <li class="secondmenuchoice"><button id="logoutbutton">Logga ut</button></li>
  `;
  } else {
    menu.innerHTML = `
  <li class="firstmenuchoice"><a href="index.html">Logga in</a></li>
  <li class="secondmenuchoice"><a href="register.html">Registrera konto</a></li>
  `;
  }

  const logoutButton = document.querySelector("#logoutbutton");

  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("lab4_token");
      window.location.href = "index.html";
    });
  }
}

async function loginUser(e) {
  e.preventDefault();

  let usernameInput = document.querySelector("#username").value;
  let passwordInput = document.querySelector("#password").value;

  if (usernameInput === "" || passwordInput === "") {
    const errorContainer = document.querySelector(".errorcontainer");
    errorContainer.innerHTML = "";
    const errorEl = document.createElement("p");
    const errorText = document.createTextNode(
      "Fyll i både användarnamn och lösenord!",
    );
    errorEl.appendChild(errorText);
    errorContainer.appendChild(errorEl);
  } else {
    let user = {
      username: usernameInput,
      password: passwordInput,
    };

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("lab4_token", data.response.token);
        window.location.href = "home.html";
      } else {
        throw error;
      }
    } catch (error) {
      const errorContainer = document.querySelector(".errorcontainer");
      errorContainer.innerHTML = "";
      const errorEl = document.createElement("p");
      const errorText = document.createTextNode(
        "Felaktigt användarnamn eller lösenord!",
      );
      errorEl.appendChild(errorText);
      errorContainer.appendChild(errorEl);
    }
  }
}

async function createUser(e) {
  e.preventDefault();

  let usernameInput = document.querySelector("#username").value;
  let passwordInput = document.querySelector("#password").value;

  if (!usernameInput || !passwordInput) {
    const errorContainer = document.querySelector(".errorcontainer");
    const confirmContainer = document.querySelector(".confirmcontainer");
    errorContainer.innerHTML = "";
    confirmContainer.innerHTML = "";
    const errorEl = document.createElement("p");
    const errorText = document.createTextNode(
      "Fyll i både användarnamn och lösenord!",
    );
    errorEl.appendChild(errorText);
    errorContainer.appendChild(errorEl);
  } else {
    let user = {
      username: usernameInput,
      password: passwordInput,
    };

    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (response.status >= 400) {
        throw response.status;
      }
      const errorContainer = document.querySelector(".errorcontainer");
      errorContainer.innerHTML = "";
      const confirmContainer = document.querySelector(".confirmcontainer");
      confirmContainer.innerHTML = "";
      const confirmEl = document.createElement("p");
      const confirmText = document.createTextNode("Nytt konto skapat!");
      confirmEl.appendChild(confirmText);
      confirmContainer.appendChild(confirmEl);
    } catch (error) {
      const errorContainer = document.querySelector(".errorcontainer");
      errorContainer.innerHTML = "";
      const confirmContainer = document.querySelector(".confirmcontainer");
      confirmContainer.innerHTML = "";
      const errorEl = document.createElement("p");
      const errorText = document.createTextNode("Användarnamnet är upptaget!");
      errorEl.appendChild(errorText);
      errorContainer.appendChild(errorEl);
    }
  }
}
