document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('radioLink').addEventListener('click', function(e) {
    e.preventDefault(); // Prevent the default link behavior

    const radioButton = document.getElementById('tabmisc');
    radioButton.checked = true; // Set the radio button to checked
  });
});
