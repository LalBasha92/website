/* ==========================================
   EDITPRO / EDITLOBBY - SHORT FORM AGENCY
   Interactive JavaScript Logic & Smooth Video Engine
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Dark / Light Theme Toggle Engine ---
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
  
  // Check system preference or saved local theme
  const savedTheme = localStorage.getItem('editpro_theme') || 'dark';
  setTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  }

  function setTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      if (themeIcon) themeIcon.className = 'fas fa-moon';
      localStorage.setItem('editpro_theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (themeIcon) themeIcon.className = 'fas fa-sun';
      localStorage.setItem('editpro_theme', 'dark');
    }
  }

  // --- 2. Smooth Multi-Format Video Player Logic (4 Containers) ---
  const reelCards = document.querySelectorAll('.reel-card');

  reelCards.forEach((card) => {
    const video = card.querySelector('.reel-video');
    const playOverlay = card.querySelector('.reel-play-overlay');
    const soundBtn = card.querySelector('.sound-toggle-btn');
    const soundIcon = soundBtn ? soundBtn.querySelector('i') : null;
    const progressFill = card.querySelector('.reel-progress-fill');

    if (!video) return;

    // Toggle Play / Pause smoothly on click
    function togglePlay() {
      if (!video.src || video.src === window.location.href) return;

      // Pause other playing videos to prevent audio overlap
      reelCards.forEach(c => {
        if (c !== card) {
          const v = c.querySelector('.reel-video');
          if (v && !v.paused) {
            v.pause();
            c.classList.remove('playing');
          }
        }
      });

      if (video.paused) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              card.classList.add('playing');
            })
            .catch(err => {
              console.warn("Autoplay / playback interaction warning:", err);
            });
        }
      } else {
        video.pause();
        card.classList.remove('playing');
      }
    }

    if (playOverlay) playOverlay.addEventListener('click', togglePlay);
    video.addEventListener('click', togglePlay);

    // Toggle Mute/Unmute
    if (soundBtn) {
      soundBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        video.muted = !video.muted;
        if (soundIcon) {
          soundIcon.className = video.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
        }
      });
    }

    // Update real-time progress bar without lag
    video.addEventListener('timeupdate', () => {
      if (video.duration && progressFill) {
        const percent = (video.currentTime / video.duration) * 100;
        progressFill.style.width = `${percent}%`;
      }
    });

    // Reset UI when video ends
    video.addEventListener('ended', () => {
      card.classList.remove('playing');
      if (progressFill) progressFill.style.width = '0%';
    });
  });

  // --- 3. Interactive Contact Form & Toast Feedback ---
  const contactForm = document.getElementById('contactForm');
  const toastNotice = document.getElementById('toastNotice');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Send Message';
      
      if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.innerHTML = '<i class="fas fa-check"></i> Request Sent!';
        }

        showToast('✨ Thank you! We received your request and will reply within 2 hours.');
        contactForm.reset();

        setTimeout(() => {
          if (submitBtn) {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
          }
        }, 3000);
      }, 1200);
    });
  }

  function showToast(msg) {
    if (!toastNotice) return;
    toastNotice.textContent = msg;
    toastNotice.classList.add('show');
    setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 4500);
  }

  // --- 4. Smooth Navigation Scroll Highlight ---
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navAnchors.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === `#${current}`) {
        a.classList.add('active');
      }
    });
  });
});
