document.addEventListener("DOMContentLoaded", function () {
    // 1. Initialize AOS Animation Library
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }

    // 2. Parse URL Parameters for Dynamic Guest Name
    // Example: index.html?to=Sri%20Mega%20Yunita%20K
    const urlParams = new URLSearchParams(window.location.search);
    const guestParam = urlParams.get('to');
    const guestNameElement = document.getElementById('guest-name');

    if (guestParam) {
        guestNameElement.textContent = decodeURIComponent(guestParam);
    } else {
        guestNameElement.textContent = "Tamu Undangan";
    }

    // 3. Open Invitation Action
    const openBtn = document.getElementById('open-invitation');
    const coverSec = document.getElementById('cover');
    const mainContent = document.getElementById('main-content');
    const bgMusic = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-toggle');
    let isPlaying = false;

    openBtn.addEventListener('click', function () {
        // Fade out cover screen
        coverSec.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        coverSec.style.opacity = '0';
        coverSec.style.transform = 'translateY(-100%)';

        setTimeout(() => {
            coverSec.classList.add('hidden');
            mainContent.classList.remove('hidden');
            
            // Re-trigger AOS animations for main content
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        }, 800);

        // Play Background Music
        bgMusic.play().then(() => {
            isPlaying = true;
            musicBtn.innerHTML = '<i class="fas fa-compact-disc fa-spin"></i>';
        }).catch(err => {
            console.log("Autoplay prevented:", err);
        });
    });

    // 4. Music Play / Pause Toggle
    musicBtn.addEventListener('click', function () {
        if (isPlaying) {
            bgMusic.pause();
            musicBtn.innerHTML = '<i class="fas fa-music"></i>';
            isPlaying = false;
        } else {
            bgMusic.play();
            musicBtn.innerHTML = '<i class="fas fa-compact-disc fa-spin"></i>';
            isPlaying = true;
        }
    });

    // 5. Countdown Timer
    // Set target wedding date: 24 October 2026 08:00:00 WITA (UTC+8)
    const targetDate = new Date("October 24, 2026 08:00:00 GMT+0800").getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            document.getElementById('days').innerText = days < 10 ? '0' + days : days;
            document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
            document.getElementById('minutes').innerText = minutes < 10 ? '0' + minutes : minutes;
            document.getElementById('seconds').innerText = seconds < 10 ? '0' + seconds : seconds;
        } else {
            document.getElementById('countdown').innerHTML = "<h3 style='color:var(--text-gold);'>Hari Bahagia telah Tiba!</h3>";
        }
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

    // 6. Form RSVP & Wishes Submission
    const rsvpForm = document.getElementById('rsvp-form');
    const wishesList = document.getElementById('wishes-list');
    const countTotal = document.getElementById('count-total');
    let currentCount = 2;

    rsvpForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const attendance = document.getElementById('attendance').value;
        const message = document.getElementById('message').value.trim();

        if (name && attendance && message) {
            // Create new wish item
            const newWish = document.createElement('div');
            newWish.className = 'wish-item';
            
            const badgeClass = attendance === 'Hadir' ? 'badge-present' : 'badge-absent';
            
            newWish.innerHTML = `
                <div class="wish-header">
                    <strong>${escapeHTML(name)}</strong>
                    <span class="${badgeClass}"><i class="fas fa-check-circle"></i> ${escapeHTML(attendance)}</span>
                </div>
                <p class="wish-text">${escapeHTML(message)}</p>
                <span class="wish-time">Baru saja</span>
            `;

            // Prepend to wishes list
            wishesList.insertBefore(newWish, wishesList.firstChild);

            // Update count
            currentCount++;
            countTotal.textContent = currentCount;

            // Reset form
            rsvpForm.reset();
            showToast("Ucapan & doa Anda berhasil dikirim!");
        }
    });

    // Helper to sanitize HTML input
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
});

// 7. Copy Account Number Function
function copyText(elementId) {
    const textToCopy = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(textToCopy).then(() => {
        showToast("Nomor rekening berhasil disalin!");
    }).catch(err => {
        console.error("Gagal menyalin text: ", err);
    });
}

// 8. Toast Helper
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.remove('hidden');

    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}
