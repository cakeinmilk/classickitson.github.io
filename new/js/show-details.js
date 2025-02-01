// /js/show-details.js

// At the start of the file, declare a function to destroy existing swipers
function destroyExistingSwipers() {
  if (blurbsSwiperInstance) {
    blurbsSwiperInstance.destroy(true, true);
    blurbsSwiperInstance = null;
  }
  if (gallerySwiperInstance) {
    gallerySwiperInstance.destroy(true, true);
    gallerySwiperInstance = null;
  }
}

// Declare Swiper instances
let blurbsSwiperInstance;
let gallerySwiperInstance;

// Define the placeholder image source
const placeholderImageSrc = '/images/posters/poster-placeholder.png'; // Update the path as needed



// Function to get URL parameters
function getQueryParams() {
  const params = {};
  window.location.search
    .substring(1)
    .split("&")
    .forEach(pair => {
      const [key, value] = pair.split("=");
      if (key) {
        params[decodeURIComponent(key)] = decodeURIComponent(value || "");
      }
    });
  return params;
}

// Function to find show by title
function findShowByTitle(title) {
  const decodedTitle = decodeURIComponent(title).replace(/-/g, ' ');
  const foundShow = showsData.find(show => show.title.toLowerCase() === decodedTitle.toLowerCase());
  console.log(`Searching for show title: "${decodedTitle}"`);
  console.log(`Found show:`, foundShow);
  return foundShow;
}

// Function to find show index by title
function findShowIndexByTitle(title) {
  const decodedTitle = decodeURIComponent(title).replace(/-/g, ' ');
  return showsData.findIndex(show => show.title.toLowerCase() === decodedTitle.toLowerCase());
}

// Function to render tour dates
function renderTourDates(tourDates) {
  return tourDates.map(dateObj => {
    const { date, location, country } = dateObj;
    let dateDisplay = "";
    if (date.includes("to")) {
      const [start, end] = date.split("to").map(d => d.trim());
      dateDisplay = `${start} - ${end}`;
    } else {
      dateDisplay = date;
    }

    let locationCountry = "";
    if (location && country) {
      locationCountry = `${location}, ${country}`;
    } else if (location) {
      locationCountry = location;
    } else if (country) {
      locationCountry = country;
    }

    return `
      <li class="mdc-list-item">
        <span class="mdc-list-item__text">
          <span class="date">${dateDisplay}</span><br>
          <span class="location-country">${locationCountry}</span>
        </span>
      </li>
    `;
  }).join("");
}

// Function to truncate text
function truncateText(text, limit) {
  if (text.length <= limit) return { truncated: text, full: text };
  const truncated = text.substring(0, limit) + '...';
  return { truncated, full: text };
}

// Function to render a single blurb
function renderBlurb(blurb, limit = 200) {
  // Create temporary element to measure text height
  const tempDiv = document.createElement('div');
  tempDiv.style.visibility = 'hidden';
  tempDiv.style.position = 'absolute';
  tempDiv.style.width = 'calc(100% - 60px)'; // Account for quotation mark width
  tempDiv.style.maxHeight = '120px';
  tempDiv.style.fontSize = '1rem';
  tempDiv.style.lineHeight = '1.6';
  tempDiv.innerHTML = blurb.text;
  document.body.appendChild(tempDiv);
  
  // Check if content would overflow
  const hasLongText = tempDiv.scrollHeight > 120;
  document.body.removeChild(tempDiv);
  
  // Truncate text if necessary
  const displayText = hasLongText ? truncateText(blurb.text, limit).truncated : blurb.text;
  
  return `
    <div class="swiper-slide">
      <div class="blurb-content">
        <div class="blurb-text-container">
          <span class="quotation-mark">“</span>
          <p class="blurb-text">
            ${displayText}
          </p>
        </div>
        ${hasLongText ? `
          <button class="read-more-btn" aria-label="Read More" aria-expanded="false">
            <span class="material-icons">expand_more</span>
          </button>
        ` : ''}
        ${blurb.date ? `<p class="blurb-date">${blurb.date}</p>` : ''}
      </div>
    </div>
  `;
}

// Function to add event listeners to "Read More" buttons
function addReadMoreListeners() {
  const readMoreButtons = document.querySelectorAll('.read-more-btn');
  
  readMoreButtons.forEach(button => {
    button.addEventListener('click', () => {
      const blurbContent = button.closest('.blurb-content');
      if (!blurbContent) return; // Safety check

      const blurbText = blurbContent.querySelector('.blurb-text');
      if (!blurbText) return; // Safety check

      // Toggle the 'expanded' class on blurb-text
      const isExpanded = blurbText.classList.toggle('expanded');
      
      // Update aria-expanded attribute for accessibility
      button.setAttribute('aria-expanded', isExpanded);
      
      // Change the icon based on expansion state
      const icon = button.querySelector('.material-icons');
      if (isExpanded) {
        icon.textContent = 'expand_less'; // Collapse icon
      } else {
        icon.textContent = 'expand_more'; // Expand icon
      }
    });
  });
}

// Function to render the show details
function renderShowDetails(show) {
  if (!show) {
    document.getElementById('show-details-container').innerHTML = `
      <div class="mdc-card mdc-card--outlined">
        <h2 class="mdc-typography--headline4">Show Not Found</h2>
        <p class="mdc-typography--body1">The show you are looking for does not exist.</p>
      </div>
    `;
    console.warn("Show not found.");
    return;
  }

  // Find current show index
  const currentIndex = findShowIndexByTitle(show.title);
  console.log(`Current show index: ${currentIndex}`);

  // Determine if navigation arrows should be displayed for blurbs
  const showArrows = show.blurbs.length > 1;

  // Determine the poster image with overlay
  let posterHTML = '';
  if (show.poster) {
    // If poster exists, use it
    posterHTML = `<img src="${show.poster}" alt="${show.title} Mini Poster" class="show-mini-poster" loading="lazy">`;
  } else if (show.imageSrc) {
    // If poster doesn't exist but imageSrc is provided, overlay imageSrc on the placeholder
    posterHTML = `
      <div class="poster-container">
        <img src="${placeholderImageSrc}" alt="Placeholder Image for ${show.title}" class="show-mini-poster placeholder-image" loading="lazy">
        <img src="${show.imageSrc}" alt="Overlay Image for ${show.title}" class="overlay-image" loading="lazy">
      </div>
    `;
  } else {
    // If neither poster nor imageSrc exists, show the placeholder only
    posterHTML = `<img src="${placeholderImageSrc}" alt="Placeholder Image for ${show.title}" class="show-mini-poster" loading="lazy">`;
  }

  // Determine the Gallery Section
  const gallerySection = (show.gallery && show.gallery.length > 0) ? `
    <section class="show-gallery" data-aos="fade-up">
      <h2 class="mdc-typography--headline5">Gallery</h2>
      <div class="swiper gallery-swiper">
        <div class="swiper-wrapper">
          ${show.gallery.map(image => `
            <div class="swiper-slide">
              <img src="${image}" alt="Gallery Image for ${show.title}" class="gallery-image" loading="lazy">
            </div>
          `).join('')}
        </div>
        <!-- Add Pagination -->
        <div class="swiper-pagination"></div>
        <!-- Add Navigation -->
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
      </div>
    </section>
  ` : '';

  // Construct the Final HTML
  const showDetailsHTML = `
    <div class="mdc-card show-details-card">
      <div class="show-content">
        <div class="show-left-column">
          <h1 class="mdc-typography--headline4">${show.title}</h1>
          ${posterHTML}
          
          <section class="show-tour-dates">
            <h2 class="mdc-typography--headline5">Tour Dates</h2>
            <ul class="mdc-list">
              ${renderTourDates(show.tourDates)}
            </ul>
          </section>
        </div>
        
        <div class="show-right-column">
          <div class="swiper blurbs-swiper" data-aos="fade-up">
            <div class="swiper-wrapper">
              ${show.blurbs.map(blurb => renderBlurb(blurb)).join('')}
            </div>
            <!-- Add Pagination -->
            <div class="swiper-pagination"></div>
            ${showArrows ? `
              <!-- Add Navigation -->
              <div class="swiper-button-prev"></div>
              <div class="swiper-button-next"></div>
            ` : ''}
          </div>

          ${show.notes ? `
            <section class="show-notes" data-aos="fade-up">
              <h2 class="mdc-typography--headline5">Notes</h2>
              <p class="mdc-typography--body1">${show.notes}</p>
            </section>
          ` : ''}

          ${gallerySection} <!-- Conditionally Rendered Gallery Section -->
        </div>
      </div>
    </div>
  `;

  // Inject the HTML into the DOM
  document.getElementById('show-details-container').innerHTML = showDetailsHTML;

  // Initialize Swiper carousels
  initializeSwipers(show);

  // Initialize Navigation Arrows
  initializeNavigationArrows(currentIndex);

  // Add Event Listeners for "Read More" buttons
  addReadMoreListeners();
}



// Update the initializeSwipers function
function initializeSwipers(show) {
  // First destroy any existing swipers
  destroyExistingSwipers();

  // Initialize Blurbs Swiper if there are blurbs
  if (show.blurbs && show.blurbs.length > 0) {
    const blurbsElement = document.querySelector('.blurbs-swiper');
    if (blurbsElement) {
      blurbsSwiperInstance = new Swiper('.blurbs-swiper', {
        loop: show.blurbs.length > 1,
        effect: 'fade',
        fadeEffect: {
          crossFade: true
        },
        autoHeight: true, // Add this to handle varying content heights
        pagination: {
          el: '.blurbs-swiper .swiper-pagination',
          clickable: true,
        },
        navigation: show.blurbs.length > 1 ? {
          nextEl: '.blurbs-swiper .swiper-button-next',
          prevEl: '.blurbs-swiper .swiper-button-prev',
        } : false,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        }
      });
    }
  }

  // Initialize Gallery Swiper if there are gallery images
  if (show.gallery && show.gallery.length > 0) {
    const galleryElement = document.querySelector('.gallery-swiper');
    if (galleryElement) {
      gallerySwiperInstance = new Swiper('.gallery-swiper', {
        loop: show.gallery.length > 3,
        slidesPerView: 1,
        spaceBetween: 10,
        pagination: {
          el: '.gallery-swiper .swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.gallery-swiper .swiper-button-next',
          prevEl: '.gallery-swiper .swiper-button-prev',
        },
        autoplay: {
          delay: 7000,
          disableOnInteraction: false,
        },
        breakpoints: {
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          }
        }
      });
    }
  }
}

// Update the cleanup when navigating away
function navigateToShow(index) {
  if (index < 0 || index >= showsData.length) {
    console.warn("Navigation index out of bounds.");
    return;
  }
  
  // Destroy existing swipers before navigation
  destroyExistingSwipers();
  
  const show = showsData[index];
  window.location.href = `show-details.html?title=${encodeURIComponent(show.title)}`;
}

// Function to initialize navigation arrows
function initializeNavigationArrows(currentIndex) {
  const prevButton = document.getElementById('prev-show-button');
  const nextButton = document.getElementById('next-show-button');

  if (!prevButton || !nextButton) {
    console.error("Navigation buttons with IDs 'prev-show-button' and 'next-show-button' not found!");
    return;
  }

  // Disable prev button if on the first show
  if (currentIndex <= 0) {
    prevButton.disabled = true;
    prevButton.style.opacity = 0.5;
    prevButton.style.cursor = 'not-allowed';
  } else {
    prevButton.disabled = false;
    prevButton.style.opacity = 1;
    prevButton.style.cursor = 'pointer';
  }

  // Disable next button if on the last show
  if (currentIndex >= showsData.length - 1) {
    nextButton.disabled = true;
    nextButton.style.opacity = 0.5;
    nextButton.style.cursor = 'not-allowed';
  } else {
    nextButton.disabled = false;
    nextButton.style.opacity = 1;
    nextButton.style.cursor = 'pointer';
  }

  // Remove existing event listeners by cloning buttons
  const newPrevButton = prevButton.cloneNode(true);
  const newNextButton = nextButton.cloneNode(true);
  prevButton.parentNode.replaceChild(newPrevButton, prevButton);
  nextButton.parentNode.replaceChild(newNextButton, nextButton);

  // Event listeners for navigation
  newPrevButton.addEventListener('click', () => {
    if (currentIndex > 0) {
      navigateToShow(currentIndex - 1);
    }
  });

  newNextButton.addEventListener('click', () => {
    if (currentIndex < showsData.length - 1) {
      navigateToShow(currentIndex + 1);
    }
  });

  console.log("Initialized Navigation Arrows.");
}

// Function to initialize the show details page
function initializeShowDetails() {
  const params = getQueryParams();
  const title = params.title;
  console.log("URL Parameters:", params);

  if (!title) {
    document.getElementById('show-details-container').innerHTML = `
      <div class="mdc-card mdc-card--outlined">
        <h2 class="mdc-typography--headline4">No Show Specified</h2>
        <p class="mdc-typography--body1">Please specify a show title in the URL parameters.</p>
      </div>
    `;
    console.warn("No show title specified in URL parameters.");
    return;
  }

  const show = findShowByTitle(title);
  if (!show) {
    document.getElementById('show-details-container').innerHTML = `
      <div class="mdc-card mdc-card--outlined">
        <h2 class="mdc-typography--headline4">Show Not Found</h2>
        <p class="mdc-typography--body1">The show you are looking for does not exist.</p>
      </div>
    `;
    console.warn(`Show with title "${title}" not found.`);
    return;
  }

  renderShowDetails(show);

  // Initialize AOS after rendering content
  AOS.init({
    duration: 800,
    easing: 'slide',
    once: true
  });
}

// Add cleanup on page unload
window.addEventListener('beforeunload', () => {
  destroyExistingSwipers();
});

// Run on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  initializeShowDetails();
});
