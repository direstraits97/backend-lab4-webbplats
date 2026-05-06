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
}

function changeMenu() {
  if (localStorage.getItem("lab4_token")) {
    menu.innerHTML = `
  <li><a href="home.html">Hem</a></li>
  <li><button id="logoutbutton">Logga ut</button></li>
  `;
  } else {
    menu.innerHTML = `
  <li><a href="index.html">Logga in</a></li>
  <li><a href="register.html">Registrera konto</a></li>
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

  if (!usernameInput || !passwordInput) {
    console.log("Fyll i alla fält!"); //Skriv ut till dom senare
    return;
  }

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
    console.log("Felaktigt användarnamn eller lösenord!"); //Skriv ut till dom senare
  }
}
