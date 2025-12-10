// ============================================
// Navigation Bar Scroll Hide Functionality
// ============================================

let lastScrollTop = 0;
let hasSelectedAlgorithm = false;
const topNav = document.getElementById('topNav');

window.addEventListener('scroll', () => {
     // Only hide nav after an algorithm has been selected
     if (!hasSelectedAlgorithm) return;

     const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

     if (scrollTop > lastScrollTop && scrollTop > 100) {
          // Scrolling down & past 100px
          topNav.classList.add('hidden-nav');
     } else {
          // Scrolling up
          topNav.classList.remove('hidden-nav');
     }

     lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});
