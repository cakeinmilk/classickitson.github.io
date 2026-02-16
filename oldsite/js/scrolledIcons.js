  document.addEventListener('DOMContentLoaded', function () {
    const aboutIcon = document.querySelector('.scrolled-icons .about-icon');
	const missingIcon = document.querySelector('.scrolled-icons .missing-icon');
    const contactIcon = document.querySelector('.scrolled-icons .contact-icon');
    const aboutButton = document.querySelector('[data-modal="about-modal"]');
	const missingButton = document.querySelector('[data-modal="missing-modal"]');
    const contactButton = document.querySelector('[data-modal="contact-modal"]');

    aboutIcon.addEventListener('click', () => {
      aboutButton.click();
    });
	
	missingIcon.addEventListener('click', () => {
      missingButton.click();
    });

    contactIcon.addEventListener('click', () => {
      contactButton.click();
    });
  });