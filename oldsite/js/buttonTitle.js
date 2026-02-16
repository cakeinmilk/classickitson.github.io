async function setFileSizeToButtonTitle(button, url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentLength = response.headers.get('Content-Length');
    const fileSizeMB = (contentLength / (1024 * 1024)).toFixed(1);
    button.title = `${fileSizeMB}MB`;
  } catch (error) {
    console.error('Failed to fetch file size:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.play-button');
  
  buttons.forEach(button => {
    button.addEventListener('mouseover', async (event) => {
      const targetButton = event.target;
      const url = targetButton.dataset.src;

      // If the button doesn't have a title yet, fetch the file size and set it.
      if (!targetButton.title) {
        await setFileSizeToButtonTitle(targetButton, url);
      }
    });
  });
});