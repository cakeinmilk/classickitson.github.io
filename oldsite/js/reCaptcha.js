document.addEventListener('DOMContentLoaded', function() {
document.getElementById("contact-form").addEventListener("submit", function (event) {
    event.preventDefault();

    // Check if the reCAPTCHA is valid
    const recaptcha = grecaptcha.getResponse();
    if (recaptcha === "") {
        alert("Please verify that you are not a robot.");
        return false;
    }

    // If valid, send the form data to the form handling service
    const formData = new FormData(event.target);
    fetch(event.target.action, {
        method: "POST",
        body: formData,
        headers: {
            "Accept": "application/json"
        }
});
