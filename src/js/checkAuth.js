"use strict";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("http://localhost:3000/api/protected", {
      method: "GET",
      headers: {
        authorization: "Bearer " + localStorage.getItem("lab4_token"),
      },
    });

    if (response.status >= 400) {
      throw response.status;
    }
    const data = await response.json();
    console.log(data);
    const accountEl = document.querySelector("#accountinfo");
    const usernameEl = document.createElement("h2");
    const createdEl = document.createElement("p");
    const usernameContent = document.createTextNode(
      "Välkommen " + data.data.username + "!",
    );
    const createdContent = document.createTextNode(
      "Ditt konto skapades " + data.data.created.slice(0, 16),
    );
    usernameEl.appendChild(usernameContent);
    createdEl.appendChild(createdContent);
    accountEl.appendChild(usernameEl);
    accountEl.appendChild(createdEl);
  } catch (error) {
    localStorage.removeItem("lab4_token");
    window.location.href = "index.html";
    console.log(error);
  }
});

if (!localStorage.getItem("lab4_token")) {
  window.location.href = "index.html";
}
