// ============================
// CONFIGURATION
// ============================

const CONFIG = {
    correctName: 'janagama veda priya',
    hearts: ['❤️', '💕', '💖', '💗', '💘'],
    sparkles: ['✨', '⭐', '💫', '🌟']
};

// ============================
// DOM ELEMENTS
// ============================

const loadingScreen = document.getElementById('loadingScreen');
const coverPage = document.getElementById('coverPage');
const letterSection = document.getElementById('letterSection');
const celebrationPage = document.getElementById('celebrationPage');
const nameInput = document.getElementById('nameInput');
const enterBtn = document.getElementById('enterBtn');
const errorMessage = document.getElementById('errorMessage');
const heartsContainer = document.getElementById('heartsContainer');
const sparklesContainer = document.getElementById('sparklesContainer');
const confettiContainer = document.getElementById('confettiContainer');
const musicToggle = document.getElementById('musicToggle');
const musicIcon = document.getElementById('musicIcon');
const bgMusic = document.getElementById('bgMusic');
const heartBurstArea = document.querySelector('.heart-burst-area');
const scrollToTopBtn = document.getElementById('scrollToTopBtn');

// ============================
// INITIALIZATION
// ============================

document.addEventListener('DOMContentLoaded', () => {
    // Hide loading screen after 2.5 seconds
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.visibility = 'hidden';
    }, 2500);

    // Initialize floating hearts
    initFloatingHearts();

    // Event listeners
    enterBtn.addEventListener('click', handleAuthentication);
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleAuthentication();
        }
    });

    musicToggle.addEventListener('click', toggleMusic);
    // heartBurstArea.addEventListener('click', createHeartBurst); // Disabled: Letter card display
    scrollToTopBtn.addEventListener('click', scrollToTop);

    // Hidden celebration page initially
    celebrationPage.classList.add('hidden');

    // Show/hide scroll to top button
    window.addEventListener('scroll', updateScrollToTopButton);
});

// ============================
// AUTHENTICATION LOGIC
// ============================

function handleAuthentication() {
    const inputValue = nameInput.value.trim().toLowerCase();

    if (inputValue === CONFIG.correctName) {
        // Correct name - allowing access
        errorMessage.innerHTML = '<span class="success-message">Welcome my love! ❤️</span>';
        nameInput.disabled = true;
        enterBtn.disabled = true;

        // Transition to next section
        setTimeout(() => {
            transitionToLetterSection();
        }, 1000);
    } else {
        // Wrong name
        errorMessage.innerHTML = "You're not my girl ❤️";
        nameInput.value = '';
        nameInput.classList.add('shake');
        setTimeout(() => {
            nameInput.classList.remove('shake');
        }, 500);
    }
}

// Add shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    .shake {
        animation: shake 0.5s ease-in-out;
    }
`;
document.head.appendChild(style);

// ============================
// PAGE TRANSITIONS
// ============================

function transitionToLetterSection() {
    // Fade and zoom the cover page
    coverPage.style.animation = 'fadeOutZoom 0.8s ease-out forwards';

    setTimeout(() => {
        coverPage.classList.add('hidden');
        letterSection.classList.remove('hidden');
        letterSection.style.animation = 'fadeInZoom 0.8s ease-out';

        // Create sparkles on letter appearance
        createSparkles(15);

        // Auto-play music
        playMusic();
    }, 800);
}

function transitionToCelebrationPage() {
    // Fade out letter section
    letterSection.style.animation = 'fadeOutZoom 0.8s ease-out forwards';

    setTimeout(() => {
        letterSection.classList.add('hidden');
        celebrationPage.classList.remove('hidden');
        celebrationPage.style.animation = 'fadeInZoom 0.8s ease-out';

        // Create confetti
        createConfetti(30);
    }, 800);
}

// Add transition animations to CSS
const transitionStyles = document.createElement('style');
transitionStyles.textContent = `
    @keyframes fadeOutZoom {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(0.95);
        }
    }
    @keyframes fadeInZoom {
        0% {
            opacity: 0;
            transform: scale(1.05);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }
`;
document.head.appendChild(transitionStyles);

// ============================
// FLOATING HEARTS BACKGROUND
// ============================

function initFloatingHearts() {
    const interval = setInterval(() => {
        if (!coverPage.classList.contains('hidden')) {
            createFloatingHeart();
        } else {
            clearInterval(interval);
        }
    }, 500);
}

function createFloatingHeart() {
    if (coverPage.classList.contains('hidden')) return;

    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = CONFIG.hearts[Math.floor(Math.random() * CONFIG.hearts.length)];

    const leftPosition = Math.random() * 100;
    const duration = 8 + Math.random() * 4;
    const delay = Math.random() * 2;

    heart.style.left = leftPosition + '%';
    heart.style.animationDuration = duration + 's';
    heart.style.animationDelay = delay + 's';

    heartsContainer.appendChild(heart);

    // Remove element after animation
    setTimeout(() => {
        heart.remove();
    }, (duration + delay) * 1000);
}

// ============================
// SPARKLES ANIMATION
// ============================

function createSparkles(count) {
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.textContent = CONFIG.sparkles[Math.floor(Math.random() * CONFIG.sparkles.length)];

            const x = Math.random() * 100;
            const y = Math.random() * 100;

            sparkle.style.left = x + '%';
            sparkle.style.top = y + '%';
            sparkle.style.animationDuration = (1.5 + Math.random() * 1) + 's';

            sparklesContainer.appendChild(sparkle);

            // Remove after animation
            setTimeout(() => {
                sparkle.remove();
            }, 2500);
        }, i * 100);
    }
}

// Create sparkles on scroll to celebration page
letterSection.addEventListener('click', (e) => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        setTimeout(() => {
            transitionToCelebrationPage();
        }, 500);
    }
});

// Listen for scroll to bottom of letter section
window.addEventListener('scroll', () => {
    const letterSectionBottom = letterSection.getBoundingClientRect().bottom;
    if (letterSectionBottom < 0 && !celebrationPage.classList.contains('hidden') === false) {
        // Transition will be triggered by scroll
    }
});

// Better approach: Use scroll listener for smooth transition
let letterSectionTransitioned = false;

window.addEventListener('scroll', () => {
    if (!letterSectionTransitioned && !letterSection.classList.contains('hidden')) {
        const letterBottom = letterSection.offsetTop + letterSection.offsetHeight;
        const scrollPosition = window.scrollY + window.innerHeight;

        if (scrollPosition >= letterBottom - 100) {
            letterSectionTransitioned = true;
            transitionToCelebrationPage();
        }
    }
});

// ============================
// CONFETTI ANIMATION
// ============================

function createConfetti(count) {
    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';

        const colors = ['#ff1493', '#ff69b4', '#ffc0cb', '#ffb3d9', '#ff0080'];
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];

        const x = Math.random() * window.innerWidth;
        confetti.style.left = x + 'px';

        const leftOffset = (Math.random() - 0.5) * 200;
        confetti.style.setProperty('--tx', leftOffset + 'px');
        confetti.style.setProperty('--ty', window.innerHeight + 100 + 'px');

        confettiContainer.appendChild(confetti);

        // Remove after animation
        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
}

// ============================
// HEART BURST ON CLICK
// ============================

// function createHeartBurst(e) {
//     const rect = heartBurstArea.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     for (let i = 0; i < 12; i++) {
//         const heart = document.createElement('div');
//         heart.className = 'burst-heart';
//         heart.textContent = '💕';

//         const angle = (i / 12) * Math.PI * 2;
//         const distance = 150;
//         const tx = Math.cos(angle) * distance;
//         const ty = Math.sin(angle) * distance;

//         heart.style.left = x + 'px';
//         heart.style.top = y + 'px';
//         heart.style.setProperty('--tx', tx + 'px');
//         heart.style.setProperty('--ty', ty + 'px');

//         heartBurstArea.appendChild(heart);

//         // Remove after animation
//         setTimeout(() => {
//             heart.remove();
//         }, 1000);
//     }

//     // Visual feedback
//     heartBurstArea.style.transform = 'scale(1.05)';
//     setTimeout(() => {
//         heartBurstArea.style.transform = 'scale(1)';
//     }, 150);
// }

// ============================
// MUSIC CONTROL
// ============================

let isMusicPlaying = false;

function toggleMusic() {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicIcon.textContent = '🔇';
        isMusicPlaying = false;
    } else {
        playMusic();
    }
}

function playMusic() {
    bgMusic.play().catch(error => {
        // Autoplay prevented, wait for user interaction
        console.log('Autoplay prevented, user interaction required');
    });
    musicIcon.textContent = '🔊';
    isMusicPlaying = true;
}

// ============================
// SCROLL TO TOP FUNCTIONALITY
// ============================

function updateScrollToTopButton() {
    if (window.scrollY > 300) {
        scrollToTopBtn.style.opacity = '1';
        scrollToTopBtn.style.pointerEvents = 'auto';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.pointerEvents = 'none';
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Initial state
scrollToTopBtn.style.opacity = '0';
scrollToTopBtn.style.pointerEvents = 'none';
scrollToTopBtn.style.transition = 'opacity 0.3s ease';

// ============================
// FOCUS ON INPUT ON LOAD
// ============================

window.addEventListener('load', () => {
    nameInput.focus();
});

// ============================
// KEYBOARD SHORTCUTS
// ============================

document.addEventListener('keydown', (e) => {
    // M for music toggle
    if (e.key === 'm' || e.key === 'M') {
        toggleMusic();
    }

    // ESC to go back (optional)
    // if (e.key === 'Escape') {
    //     location.reload();
    // }
});

// ============================
// RESPONSIVE ADJUSTMENTS
// ============================

window.addEventListener('resize', () => {
    // Adjust animations if needed
    if (window.innerWidth < 768) {
        // Reduce confetti on mobile
        if (!celebrationPage.classList.contains('hidden')) {
            // Already rendered, no need to adjust
        }
    }
});

// ============================
// PRELOAD IMAGES
// ============================

window.addEventListener('load', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.loading = 'lazy';
    });
});

// ============================
// SMOOTH SCROLL BEHAVIOR
// ============================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ============================
// ADD VISUAL FEEDBACK TO BUTTONS
// ============================

const buttons = document.querySelectorAll('button');
buttons.forEach(btn => {
    btn.addEventListener('mousedown', function() {
        this.style.transform = 'scale(0.98)';
    });

    btn.addEventListener('mouseup', function() {
        this.style.transform = '';
    });

    btn.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
});

// ============================
// ERROR HANDLING
// ============================

window.addEventListener('error', (event) => {
    console.error('Error:', event.error);
    // Graceful degradation
});

// Handle missing images
document.addEventListener('error', (event) => {
    if (event.target.tagName === 'IMG') {
        event.target.style.display = 'none';
        const placeholder = event.target.parentElement;
        if (placeholder) {
            placeholder.innerHTML = '<p style="color: #ff69b4; padding: 1rem;">Image not found</p>';
        }
    }
}, true);

console.log('%c🎊 Happy Birthday Janagama Veda Priya! 🎊', 'color: #ff1493; font-size: 20px; font-weight: bold;');
