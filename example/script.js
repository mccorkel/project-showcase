// DOM Elements
const connectButton = document.querySelector('.connect-button');
const modal = document.getElementById('connectModal');
const closeButton = document.querySelector('.close');
const projectCards = document.querySelectorAll('.project-card');
const sections = document.querySelectorAll('section');
const header = document.querySelector('header');
const introSection = document.querySelector('.intro');
const intro = document.querySelector('.intro');
const videoThumbnails = document.querySelectorAll('.video-thumbnail');
const interestHeaders = document.querySelectorAll('.interest-header');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');

// Theme toggle functionality
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  
  // Update icon
  if (theme === 'dark') {
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
  } else {
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
  }
}

// Check for saved theme preference or respect OS preference
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme) {
  setTheme(savedTheme);
} else if (prefersDark) {
  setTheme('dark');
}

// Toggle theme when button is clicked
themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
});

// Add animation classes to project cards
projectCards.forEach((card, index) => {
  card.classList.add('fade-in');
  card.style.animationDelay = `${0.1 * (index + 1)}s`;
});

// Handle header visibility on scroll
function handleHeaderVisibility() {
  const introBottom = introSection.getBoundingClientRect().bottom;
  const scrollPosition = window.scrollY;
  
  if (introBottom <= 0 || scrollPosition > 100) {
    header.classList.add('visible');
  } else {
    header.classList.remove('visible');
  }
}

// Initial check for header visibility
handleHeaderVisibility();

// Listen for scroll events to update header visibility
window.addEventListener('scroll', handleHeaderVisibility);

// Interest items expand/collapse functionality
interestHeaders.forEach(header => {
  header.addEventListener('click', () => {
    const interestItem = header.parentElement;
    
    // Close all other interest items
    document.querySelectorAll('.interest-item.active').forEach(item => {
      if (item !== interestItem) {
        item.classList.remove('active');
      }
    });
    
    // Toggle the clicked interest item
    interestItem.classList.toggle('active');
  });
});

// Video Gallery Functionality
videoThumbnails.forEach(thumbnail => {
  thumbnail.addEventListener('click', () => {
    const videoId = thumbnail.getAttribute('data-video-id');
    const videoPlayer = thumbnail.closest('.video-gallery').querySelector('.video-player');
    
    // Clear any existing video
    videoPlayer.innerHTML = '';
    
    // Create iframe for YouTube embed
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    iframe.title = "YouTube video player";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    
    // Create close button
    const closeButton = document.createElement('div');
    closeButton.className = 'close-video';
    closeButton.innerHTML = '<i class="fas fa-times"></i>';
    closeButton.addEventListener('click', (e) => {
      e.stopPropagation();
      videoPlayer.innerHTML = '';
      videoPlayer.classList.remove('active');
    });
    
    // Add iframe and close button to player
    videoPlayer.appendChild(iframe);
    videoPlayer.appendChild(closeButton);
    videoPlayer.classList.add('active');
    
    // Scroll to video player
    setTimeout(() => {
      videoPlayer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  });
});

// Modal functionality
connectButton.addEventListener('click', (e) => {
  e.preventDefault();
  modal.style.display = 'block';
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
});

closeButton.addEventListener('click', () => {
  modal.classList.remove('show');
  setTimeout(() => {
    modal.style.display = 'none';
  }, 300);
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300);
  }
});

// Escape key to close modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.style.display === 'block') {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300);
  }
  
  // Also close any active video players with Escape key
  if (e.key === 'Escape') {
    const activePlayers = document.querySelectorAll('.video-player.active');
    activePlayers.forEach(player => {
      player.innerHTML = '';
      player.classList.remove('active');
    });
  }
});

// Scroll reveal animation
function revealOnScroll() {
  sections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    
    if (sectionTop < windowHeight - 100) {
      section.classList.add('reveal', 'active');
    }
  });
}

// Add reveal class to all sections
sections.forEach(section => {
  section.classList.add('reveal');
});

// Initial check for elements in view
revealOnScroll();

// Listen for scroll events
window.addEventListener('scroll', revealOnScroll);

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Add hover effect to experience items
const experienceItems = document.querySelectorAll('.experience-item');
experienceItems.forEach(item => {
  item.addEventListener('mouseenter', () => {
    item.style.transform = 'translateY(-10px)';
  });
  
  item.addEventListener('mouseleave', () => {
    item.style.transform = 'translateY(0)';
  });
});

// Add a subtle parallax effect to the intro section
window.addEventListener('scroll', () => {
  const scrollPosition = window.scrollY;
  if (scrollPosition < 600) {
    intro.style.backgroundPosition = `center ${scrollPosition * 0.4}px`;
  }
});

// Add a typing animation to the intro title
function typeWriter(element, text, speed = 50, delay = 500) {
  setTimeout(() => {
    let i = 0;
    const originalText = text;
    element.textContent = '';
    
    function type() {
      if (i < originalText.length) {
        element.textContent += originalText.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }
    
    type();
  }, delay);
}

// Apply typing effect to the intro title if it exists
const introTitle = document.querySelector('.intro h1');
if (introTitle) {
  const originalText = introTitle.textContent;
  typeWriter(introTitle, originalText);
}