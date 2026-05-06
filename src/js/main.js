"use strict";

const loginForm = document.querySelector("#loginform");
const registerForm = document.querySelector("#registerform");
const menu = document.querySelector("#menu");

window.onload = init;

function init() {
  changeMenu(); //Det första som kontrolleras är vilken meny som ska visas för användaren med denna funktion.

  //Beroende på vad som visas på skärmen, alltså vilket formulär som existerar, körs olika funktioner längre ner.
  if (loginForm) {
    loginForm.addEventListener("submit", loginUser);
  }
  if (registerForm) {
    registerForm.addEventListener("submit", createUser);
  }
}

function changeMenu() {
  //Om det finns en token att hämta kommer denna meny att visas.
  if (localStorage.getItem("lab4_token")) {
    menu.innerHTML = `
  <li class="firstmenuchoice"><a href="home.html">Hem</a></li>
  <li class="secondmenuchoice"><button id="logoutbutton">Logga ut</button></li>
  `;
  } else {
    //Om ingen token finns visas denna meny istället.
    menu.innerHTML = `
  <li class="firstmenuchoice"><a href="index.html">Logga in</a></li>
  <li class="secondmenuchoice"><a href="register.html">Registrera konto</a></li>
  `;
  }

  const logoutButton = document.querySelector("#logoutbutton");

  //Om en logga-ut-knapp finns, alltså när användaren är inloggad, skapas en eventlyssnare på knappen som tar bort användarens token och omdirigerar till startsidan.
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("lab4_token");
      window.location.href = "index.html";
    });
  }
}

async function loginUser(e) {
  e.preventDefault(); //Så att formulär inte laddas om.

  let usernameInput = document.querySelector("#username").value;
  let passwordInput = document.querySelector("#password").value;

  //Nedan skapas felmeddelande om input-fält är tomma.
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
    //Om fälten har text görs ett anrop till API:et där input-värden skickas med.
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
      //Om allt gått bra sparas token i localStorage och användaren skickas vidare till en skyddad route.
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("lab4_token", data.response.token);
        window.location.href = "home.html";
      } else {
        //Om svaret inte är en 200-kod kastas felet till catchen där ett nytt felmeddelande skapas. Eftersom API:et svarar med en felkod om ett användarnamn inte finns hamnar vi i catch.
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
  e.preventDefault(); //Så att formulär inte laddas om.

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
    ); //Likt tidigare kod skapas ett felmeddelande vid tomma input-fält.
    errorEl.appendChild(errorText);
    errorContainer.appendChild(errorEl);
  } else {
    let user = {
      username: usernameInput,
      password: passwordInput,
    };

    try {
      //Vid ifylla fält görs ett anrop till API:et för att lägga till ett konto.
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (response.status >= 400) {
        //Om vi får en fel-kod, mer specifikt 409 då en konflikt uppstår över redan existerande konto, kastas felet till catch.
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
      //Här nere skapas ett anpassat felmeddelande om upptagna användarnamn.
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
