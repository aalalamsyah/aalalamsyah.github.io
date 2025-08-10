document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize Animate On Scroll
    AOS.init({
        duration: 800,
        once: true, // Animation happens only once
    });

    // Handle opening the invitation
    const openButton = document.getElementById('open-invitation');
    const cover = document.getElementById('cover');
    const mainContent = document.getElementById('main-content');
    const audio = document.getElementById('background-music');
    const musicControl = document.getElementById('music-control');

    openButton.addEventListener('click', function() {
        cover.style.transition = 'transform 1s ease-out, opacity 1s ease-out';
        cover.style.transform = 'translateY(-100%)';
        cover.style.opacity = '0';
        
        mainContent.style.display = 'block';
        musicControl.style.display = 'block';
        
        audio.play().catch(error => {
            console.log("Autoplay was prevented. User must interact with the page first.");
        });

        // Set cover to display none after transition to allow scrolling
        setTimeout(() => {
            cover.style.display = 'none';
        }, 1000);
    });

    // Music play/pause control
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playPauseIcon = document.getElementById('play-pause-icon');

    playPauseBtn.addEventListener('click', function() {
        if (audio.paused) {
            audio.play();
            playPauseIcon.classList.remove('bi-play-fill');
            playPauseIcon.classList.add('bi-pause-fill');
        } else {
            audio.pause();
            playPauseIcon.classList.remove('bi-pause-fill');
            playPauseIcon.classList.add('bi-play-fill');
        }
    });

    // Get guest name from URL
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to');
    const guestNameElement = document.getElementById('guest-name');
    
    if (guestName) {
        guestNameElement.textContent = decodeURIComponent(guestName.replace(/\+/g, ' '));
    } else {
        guestNameElement.textContent = 'Tamu Undangan';
    }

    // Countdown Timer
    const countdownDate = new Date("May 06, 2028 09:00:00").getTime();
    
    const countdownFunction = setInterval(function() {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = String(days).padStart(2, '0');
        document.getElementById('hours').innerText = String(hours).padStart(2, '0');
        document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
        document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');

        if (distance < 0) {
            clearInterval(countdownFunction);
            document.getElementById('countdown').innerHTML = "<h2>Acara Telah Selesai</h2>";
        }
    }, 1000);
    
    // RSVP Form Submission using Google Apps Script
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxMyfyhQAJpfbCC2qDIexN56XcZP6Qmk6_eCub2xK0fID5K2SKpdaDYR7UJO26XgiA5bA/exec';
    const form = document.getElementById('rsvp-form');
    const formResponse = document.getElementById('form-response');

    form.addEventListener('submit', e => {
        e.preventDefault();
        fetch(scriptURL, { method: 'POST', body: new FormData(form)})
            .then(response => {
                formResponse.innerHTML = '<div class="alert alert-success">Terima kasih! Ucapan Anda telah terkirim.</div>';
                form.reset();
                console.log('Success!', response);
            })
            .catch(error => {
                formResponse.innerHTML = '<div class="alert alert-danger">Maaf, terjadi kesalahan. Coba lagi nanti.</div>';
                console.error('Error!', error.message);
            });
    });

});

// Function to copy bank account number
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        Swal.fire({
            icon: 'success',
            title: 'Berhasil Disalin!',
            text: 'Nomor rekening berhasil disalin ke clipboard.',
            showConfirmButton: false,
            timer: 2000
        });
    }, function(err) {
        Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: 'Gagal menyalin nomor rekening. Mohon coba lagi.',
            showConfirmButton: false,
            timer: 2000
        });
    });
}
