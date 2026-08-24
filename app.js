// yt-to-audio/app.js

document.addEventListener('DOMContentLoaded', () => {
  const urlInput = document.getElementById('yt-url');
  const btnConvert = document.getElementById('btn-convert');
  const statusCard = document.getElementById('status-card');
  const statusText = document.getElementById('status-text');
  const loader = document.getElementById('status-loader');

  // TODO: Update this URL once the backend is deployed to Render.com
  const BACKEND_URL = 'https://sweet-wolves-kneel.loca.lt'; 

  btnConvert.addEventListener('click', async () => {
    const videoUrl = urlInput.value.trim();
    if (!videoUrl || !videoUrl.includes('youtu')) {
      alert('Please enter a valid YouTube URL.');
      return;
    }

    // Update UI State
    statusCard.classList.remove('hidden');
    statusText.textContent = 'Connecting to Server...';
    loader.style.display = 'inline-block';
    
    btnConvert.disabled = true;
    btnConvert.style.opacity = '0.5';
    btnConvert.innerHTML = '<span class="btn-icon">⏳</span> Please Wait';

    try {
      // Enhanced Tech: Ping server first to make sure it's alive
      // so the user doesn't get an ugly "Site can't be reached" page.
      const healthCheck = await fetch(`${BACKEND_URL}/`, { method: 'GET' }).catch(() => null);
      
      if (!healthCheck || !healthCheck.ok) {
         throw new Error('Backend server is currently offline or unreachable.');
      }

      statusText.textContent = 'Streaming Audio directly to your device...';

      // Create the download URL pointing to our streaming API
      const downloadUrl = `${BACKEND_URL}/api/convert?url=${encodeURIComponent(videoUrl)}`;
      
      // Native browser downloading stream
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Reset UI
      setTimeout(() => {
        statusText.textContent = 'Audio stream started! Check your browser downloads.';
        loader.style.display = 'none';
        
        btnConvert.disabled = false;
        btnConvert.style.opacity = '1';
        btnConvert.innerHTML = '<span class="btn-icon">⚡</span> Fetch Audio';
      }, 4500);

    } catch (error) {
       statusText.textContent = `Error: ${error.message}`;
       loader.style.display = 'none';
       btnConvert.disabled = false;
       btnConvert.style.opacity = '1';
       btnConvert.innerHTML = '<span class="btn-icon">⚡</span> Try Again';
    }
  });
});
