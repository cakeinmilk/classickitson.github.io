document.addEventListener('DOMContentLoaded', function() {
document.querySelectorAll('[data-modal]').forEach(function (link) {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    var modalId = this.getAttribute('data-modal');
    document.getElementById(modalId).style.display = 'block';
  });
});

document.querySelectorAll('.close-button').forEach(function (closeButton) {
  closeButton.addEventListener('click', function () {
    this.parentElement.parentElement.style.display = 'none';
  });
});

});
