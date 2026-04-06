const navLinks = document.querySelectorAll(".site-nav a");
const normalizePath = (path) => {
  if (!path || path === "/" || path === "/index.html" || path === "index.html") {
    return "/";
  }

  return path.startsWith("/") ? path : `/${path}`;
};

const currentPath = normalizePath(window.location.pathname);
const currentHash = window.location.hash;

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
  if (!window.location.hash) {
    window.scrollTo(0, 0);
  }
});

navLinks.forEach((link) => {
  const href = link.getAttribute("href") || "";
  const hrefPath = normalizePath(href.split("#")[0]);
  const hrefHash = href.includes("#") ? `#${href.split("#")[1]}` : "";

  if (
    hrefPath === currentPath &&
    (!currentHash || hrefHash === currentHash || (hrefPath === "/" && hrefHash === ""))
  ) {
    navLinks.forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
  }

  link.addEventListener("click", () => {
    if (href.startsWith("#") || href.includes("#")) {
      navLinks.forEach((item) => item.classList.remove("active"));
      link.classList.add("active");
    }
  });
});

const consultationForm = document.querySelector("[data-consultation-form]");

if (consultationForm) {
  const successMessage = document.querySelector("[data-consultation-success]");
  const endpoint = consultationForm.dataset.sheetEndpoint || "";

  consultationForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!endpoint || endpoint === "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE") {
      if (successMessage) {
        successMessage.hidden = false;
        successMessage.textContent = "Google Sheets is not connected yet. Add your Google Apps Script web app URL in consultation.html to store submissions.";
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const formData = new FormData(consultationForm);
    const payload = {};

    for (const [key, value] of formData.entries()) {
      if (payload[key]) {
        payload[key] = `${payload[key]}, ${value}`;
      } else {
        payload[key] = value;
      }
    }

    try {
      await fetch(endpoint, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
      });

      if (successMessage) {
        successMessage.hidden = false;
        successMessage.textContent = "Thank you. Your consultation request was sent successfully and can now be stored in Google Sheets.";
      }

      consultationForm.reset();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      if (successMessage) {
        successMessage.hidden = false;
        successMessage.textContent = "We could not send the form right now. Please verify the Google Apps Script web app URL and deployment settings.";
      }
    }
  });
}
