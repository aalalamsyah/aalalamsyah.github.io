// file: main.js
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize Animate On Scroll
    AOS.init({
        duration: 800,
        once: true,
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

    // Auto-isi nama di form RSVP + read-only
    const namaInput = document.querySelector('#rsvp-form input[name="nama"]');
    if (guestName && namaInput) {
        namaInput.value = decodeURIComponent(guestName.replace(/\+/g, ' '));
        namaInput.readOnly = true;
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
    
    // RSVP Form Submission
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxMyfyhQAJpfbCC2qDIexN56XcZP6Qmk6_eCub2xK0fID5K2SKpdaDYR7UJO26XgiA5bA/exec';
    const form = document.getElementById('rsvp-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    const ucapanList = document.getElementById('ucapan-list'); // daftar ucapan

    form.addEventListener('submit', e => {
        e.preventDefault();

        const nama = form.querySelector('input[name="nama"]').value.trim();
        const kehadiran = form.querySelector('select[name="kehadiran"]').value.trim();
        const ucapan = form.querySelector('textarea[name="ucapan"]').value.trim();

        if (!nama || !kehadiran || !ucapan) {
            Swal.fire({
                icon: 'warning',
                title: 'Form Belum Lengkap',
                text: 'Mohon isi semua kolom sebelum mengirim.',
                confirmButtonColor: '#f0ad4e'
            });
            return;
        }

        // Disable tombol + loading
        submitBtn.disabled = true;
        Swal.fire({
            title: 'Mengirim Ucapan...',
            text: 'Mohon tunggu sebentar',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        fetch(scriptURL, { method: 'POST', body: new FormData(form) })
            .then(response => {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Terima kasih! Ucapan Anda telah terkirim.',
                    confirmButtonColor: '#3085d6',
                    timer: 2000,
                    showConfirmButton: false,
                    didClose: () => {
                        // Tambahkan ucapan baru di halaman
                        // if (ucapanList) {
                        //     const newItem = document.createElement('div');
                        //     newItem.classList.add('ucapan-item');
                        //     newItem.innerHTML = `<strong>${nama}</strong>: ${ucapan}`;
                        //     ucapanList.prepend(newItem);
                        // }

                        // Confetti
                        const duration = 1.5 * 1000;
                        const end = Date.now() + duration;
                        (function frame() {
                            confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
                            confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
                            if (Date.now() < end) requestAnimationFrame(frame);
                        })();
                    }
                });

                // Reset hanya kolom ucapan
                form.querySelector('textarea[name="ucapan"]').value = "";
                form.querySelector('select[name="kehadiran"]').value = "";

                submitBtn.disabled = false;
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal!',
                    text: 'Maaf, terjadi kesalahan. Coba lagi nanti.',
                    confirmButtonColor: '#d33'
                });
                submitBtn.disabled = false;
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
