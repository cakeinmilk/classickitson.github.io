document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll(".play-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      const src = button.getAttribute('data-src');
      playAudio(src);
    });
  });
});
