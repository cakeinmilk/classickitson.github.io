document.addEventListener('DOMContentLoaded', function () {

let originalTitle = document.title;
  let currentButton = null;
  let audioElement = null;

document.querySelectorAll(".divTableCell a").forEach((link) => {
  link.addEventListener("click", (event) => {
    const linkHref = link.getAttribute('href'); // Get the href attribute value
    if (linkHref.endsWith('.mp3')) {
      event.preventDefault();
      const filename = linkHref.match(/[^/]+$/)[0]; // Extract the filename from the href
      const formattedFilename = filename.replace(/%20|_/g, ' ').replace(/\.mp3$/, ''); // Replace %20 or underscores with spaces and remove the .mp3 extension
      playAudio(linkHref, formattedFilename, null); // Add 'null' as the third argument
    }
  });
});

  document.querySelectorAll(".play-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      if (currentButton === button) {
        if (audioElement.paused) {
          audioElement.play();
          setButtonToPause(button);
        } else {
          audioElement.pause();
          setButtonToPlay(button);
        }
      } else {
        if (currentButton) setButtonToPlay(currentButton);
        const src = button.getAttribute('data-src');
        const filename = src.match(/[^/]+$/)[0];
        const formattedFilename = filename.replace(/%20|_/g, ' ').replace(/\.mp3$/, '');
        playAudio(src, formattedFilename, button);
      }
    });
  })

function playAudio(src, filename, button) {
  expandHeader();

  if (currentButton && currentButton !== button) {
    setButtonToPlay(currentButton);
  }
  currentButton = button;

  const audioPlayerDiv = document.getElementById("audioPlayer");

audioPlayerDiv.innerHTML = `
  <div style="display: flex; align-items: center; justify-content: center; border: 2px solid black; border-radius: 10px; padding: 5px;">
    <div id="audioContainer" style="flex-grow: 1; display: flex; align-items: center;"></div>
    <div style="display: flex; align-items: center; margin-left: 10px; margin-right: 12px;">
      <img id="stopAndHideBtn" class="stopandhidebtn" src="./img/close.svg" width="25" height="25" style="cursor: pointer;" />
    </div>
  </div>
`;

  if (!audioElement) {
    audioElement = document.createElement('audio');
  }
  audioElement.src = src;
  audioElement.title = filename;
  audioElement.controls = true;
  audioElement.autoplay = true;

  const audioContainer = document.getElementById('audioContainer');
  audioContainer.appendChild(audioElement);

  audioElement.addEventListener('ended', () => {
    setButtonToPlay(button);
  });

  audioElement.onplay = function() {
    setButtonToPause(button);
  };

  audioElement.onpause = function() {
    setButtonToPlay(button);
  };

  setButtonToPause(button);

  const stopAndHideBtn = document.getElementById('stopAndHideBtn');
  if (document.body.classList.contains('dark-mode')) {
  stopAndHideBtn.classList.add('dark-mode');
}
  stopAndHideBtn.addEventListener('click', stopAndHideAudio);

  // Set the document title to "Now Playing: <Track Title>"
  document.title = `Now playing: ${filename}`;
}


function setButtonToPlay(button) {
  const svg = button.querySelector("svg");
  svg.outerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
      <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
    </svg>
  `;
}

function setButtonToPause(button) {
  const svg = button.querySelector("svg");
  svg.outerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-fill" viewBox="0 0 16 16">
      <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-1.5 1.5h-1A1.5 1.5 0 0 1 3 11V5a1.5 1.5 0 0 1 1.5-1.5h1zm6 0A1.5 1.5 0 0 1 13 5v6a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5V5a1.5 1.5 0 0 1 1.5-1.5h1z"/>
    </svg>
  `;
}


  function expandHeader() {
    updateHeaderHeight(true);
    window.addEventListener('scroll', updateHeaderHeightWrapper);
  }

  function stopAndHideAudio() {
    const audioPlayerDiv = document.getElementById("audioPlayer");
    audioPlayerDiv.innerHTML = '';
    updateHeaderHeight(false);
    window.removeEventListener('scroll', updateHeaderHeightWrapper);
    window.addEventListener('scroll', updateHeaderHeightNoPlayer);
    
    document.title = originalTitle;
  }

  function updateHeaderHeightWrapper() {
    updateHeaderHeight(true);
  }

  function updateHeaderHeight(expanded) {
    const header = document.querySelector('.header');
    if (expanded) {
      if (window.scrollY > 0) {
        header.style.height = '95px';
      } else {
        header.style.height = '160px';
      }
    } else {
      if (window.scrollY > 0) {
        header.style.height = '40px';
      } else {
        header.style.height = '125px';
      }
    }
  }

  function updateHeaderHeightNoPlayer() {
    const header = document.querySelector('.header');
    if (window.scrollY > 0) {
      header.style.height = '40px';
    } else {
      header.style.height = '125px';
    }
  }

  window.addEventListener('scroll', updateHeaderHeightNoPlayer);
});
