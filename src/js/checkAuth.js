"use strict";

document.addEventListener("DOMContentLoaded", async () => {
  //Ett get-anrop till en skyddad route försöker göras med lagrad token från localStorage.
  try {
    const response = await fetch("http://localhost:3000/api/protected", {
      method: "GET",
      headers: {
        authorization: "Bearer " + localStorage.getItem("lab4_token"),
      },
    });
    //Om vi får felkoder från API:et kastas felet till catch.
    if (response.status >= 400) {
      throw response.status;
    }
    const data = await response.json();
    const accountEl = document.querySelector("#accountinfo");
    const usernameEl = document.createElement("h2");
    const createdEl = document.createElement("p");
    //Anpassade meddelanden skrivs ut till inloggade användare.
    const usernameContent = document.createTextNode(
      "Välkommen " + data.data.username + "!",
    );
    const createdContent = document.createTextNode(
      "Ditt konto skapades " + data.data.created.slice(0, 16),
    );
    const breakEl = document.createElement("br");
    usernameEl.appendChild(usernameContent);
    createdEl.appendChild(createdContent);
    accountEl.appendChild(usernameEl);
    accountEl.appendChild(breakEl);
    accountEl.appendChild(createdEl);
  } catch (error) {
    //Tar bort token och skickar användaren till startsidan.
    localStorage.removeItem("lab4_token");
    window.location.href = "index.html";
  }
});
//Om ingen token finns skickas användaren till startsidan.
if (!localStorage.getItem("lab4_token")) {
  window.location.href = "index.html";
}
