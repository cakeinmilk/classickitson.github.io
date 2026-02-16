window.addEventListener('load', function() {
const header = document.querySelector('header');
const quoteContainer = document.querySelector('.quote-container');
const headerTop = document.querySelector('.header-top');
const scrolledIcons = document.querySelector('.scrolled-icons');

window.addEventListener('scroll', () => {
  if (window.scrollY > 0) {
    header.classList.add('scrolled');
    quoteContainer.classList.add('scrolled');
    headerTop.classList.add('scrolled');
    scrolledIcons.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
    quoteContainer.classList.remove('scrolled');
    headerTop.classList.remove('scrolled');
    scrolledIcons.classList.remove('scrolled');
  }
});
});