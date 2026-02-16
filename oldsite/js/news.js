// Check if the latest update should be shown
function checkLatestUpdate() {
  const latestDiv = document.querySelector(".latest");
  const currentVersion = latestDiv.getAttribute("data-version");
  const closedVersion = localStorage.getItem("closedVersion");

  if (closedVersion !== currentVersion) {
    latestDiv.style.display = "block";
  } else {
    latestDiv.style.display = "none";
  }
}

// Close the latest update and store the closed version in the browser storage
function closeLatest() {
  const latestDiv = document.querySelector(".latest");
  const currentVersion = latestDiv.getAttribute("data-version");
  localStorage.setItem("closedVersion", currentVersion);
  latestDiv.style.display = "none";
}

// Call the checkLatestUpdate function when the page loads
document.addEventListener("DOMContentLoaded", checkLatestUpdate);