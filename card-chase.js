// ============================================
// Advanced Playful Card Chase Game - Full Screen
// ============================================

let cardStates = [];
let animationFrameId = null;
let isGameActive = false;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
     const homePage = document.getElementById('homePage');
     const backBtn = document.getElementById('backBtn');

     // Start game when on home page
     if (homePage && !homePage.classList.contains('hidden')) {
          setTimeout(initializeGame, 500);
     }

     // Reset game when back button is clicked
     if (backBtn) {
          backBtn.addEventListener('click', function () {
               setTimeout(function () {
                    stopGame();
                    initializeGame();
               }, 100);
          });
     }
});

function initializeGame() {
     const cards = document.querySelectorAll('.algorithm-card');

     if (!cards.length) {
          console.error('No cards found');
          return;
     }

     isGameActive = true;
     cardStates = [];

     // Use full viewport dimensions
     const containerWidth = window.innerWidth;
     const containerHeight = window.innerHeight;
     const cardSize = 120;

     cards.forEach((card, index) => {
          // Random starting position within full screen
          const x = Math.random() * (containerWidth - cardSize);
          const y = 100 + Math.random() * (containerHeight - cardSize - 100); // Leave space for title

          cardStates[index] = {
               x: x,
               y: y,
               vx: (Math.random() - 0.5) * 4, // velocity x
               vy: (Math.random() - 0.5) * 4, // velocity y
               speed: 1.5, // initial speed
               escapeAttempts: 0,
               caught: false,
               element: card
          };

          // Set initial position
          card.style.position = 'absolute';
          card.style.left = x + 'px';
          card.style.top = y + 'px';
          card.style.transition = 'transform 0.2s ease';

          // Add event listeners
          setupCardEvents(card, index);
     });

     startAnimation();
}

function setupCardEvents(card, index) {
     // Mouse enter - card escapes!
     card.addEventListener('mouseenter', function (e) {
          if (!isGameActive || cardStates[index].caught) return;

          const state = cardStates[index];
          state.escapeAttempts++;

          // Calculate escape direction
          const rect = card.getBoundingClientRect();
          const cardCenterX = rect.left + rect.width / 2;
          const cardCenterY = rect.top + rect.height / 2;

          const deltaX = cardCenterX - e.clientX;
          const deltaY = cardCenterY - e.clientY;
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

          if (distance > 0) {
               // Escape speed decreases with attempts
               const escapeSpeed = Math.max(3, 12 - state.escapeAttempts * 1.5);

               state.vx = (deltaX / distance) * escapeSpeed;
               state.vy = (deltaY / distance) * escapeSpeed;

               // Overall speed decreases
               state.speed = Math.max(0.3, 1.5 - (state.escapeAttempts * 0.2));
          }

          // Visual feedback
          card.style.transform = 'scale(0.85) rotate(' + (Math.random() * 30 - 15) + 'deg)';
          setTimeout(function () {
               if (!cardStates[index].caught) {
                    card.style.transform = 'scale(1) rotate(0deg)';
               }
          }, 300);
     });

     // Click - try to catch!
     card.addEventListener('click', function (e) {
          e.stopPropagation();

          const state = cardStates[index];

          // Need at least 2 escape attempts to catch (easier game)
          if (state.escapeAttempts >= 2) {
               catchCard(card, index);
          } else {
               showMessage('🏃 Try again (' + (2 - state.escapeAttempts) + ' attempts remaining)');
          }
     });
}

function catchCard(card, index) {
     const state = cardStates[index];
     state.caught = true;
     state.speed = 0;
     state.vx = 0;
     state.vy = 0;

     // Visual feedback
     card.style.transform = 'scale(1.15)';
     card.style.border = '3px solid var(--cyan-bright)';
     card.style.boxShadow = '0 0 40px var(--cyan-bright)';
     card.style.zIndex = '1000';

     showMessage('✅ You have chosen ' + card.dataset.algorithm + '!');

     // Navigate to algorithm page after short delay
     setTimeout(function () {
          isGameActive = false;
          const algorithm = card.dataset.algorithm;

          // Trigger algorithm selection
          const homePage = document.getElementById('homePage');
          const algorithmPage = document.getElementById('algorithmPage');

          if (homePage && algorithmPage) {
               homePage.classList.add('hidden');
               algorithmPage.classList.remove('hidden');

               // Update app state
               if (window.appState) {
                    window.appState.selectedAlgorithm = algorithm;
               }

               // Trigger the algorithm display logic
               const event = new CustomEvent('algorithmSelected', { detail: { algorithm: algorithm } });
               document.dispatchEvent(event);
          }
     }, 800);
}

function showMessage(text) {
     const message = document.createElement('div');
     message.textContent = text;
     message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 212, 255, 0.95);
        color: #000;
        padding: 20px 40px;
        border-radius: 15px;
        font-size: 1.3rem;
        font-weight: bold;
        z-index: 10000;
        box-shadow: 0 10px 40px rgba(0, 212, 255, 0.5);
        animation: popIn 0.3s ease;
    `;

     document.body.appendChild(message);

     setTimeout(function () {
          message.style.animation = 'popOut 0.3s ease';
          setTimeout(function () {
               message.remove();
          }, 300);
     }, 1500);
}

function startAnimation() {
     if (!isGameActive) return;

     function animate() {
          if (!isGameActive) return;

          // Use full viewport dimensions
          const containerWidth = window.innerWidth;
          const containerHeight = window.innerHeight;
          const cardSize = 120;

          cardStates.forEach(function (state, index) {
               if (state.caught) return;

               // Update position
               state.x += state.vx * state.speed;
               state.y += state.vy * state.speed;

               // Bounce off walls (full screen)
               if (state.x <= 0) {
                    state.x = 0;
                    state.vx = Math.abs(state.vx);
               }
               if (state.x >= containerWidth - cardSize) {
                    state.x = containerWidth - cardSize;
                    state.vx = -Math.abs(state.vx);
               }
               if (state.y <= 80) { // Leave space for title
                    state.y = 80;
                    state.vy = Math.abs(state.vy);
               }
               if (state.y >= containerHeight - cardSize) {
                    state.y = containerHeight - cardSize;
                    state.vy = -Math.abs(state.vy);
               }

               // Apply position
               if (state.element) {
                    state.element.style.left = state.x + 'px';
                    state.element.style.top = state.y + 'px';
               }
          });

          animationFrameId = requestAnimationFrame(animate);
     }

     animate();
}

function stopGame() {
     isGameActive = false;
     if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
     }
}

// Add CSS animation for message
const style = document.createElement('style');
style.textContent = `
    @keyframes popIn {
        from {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
        }
        to {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
    }
    @keyframes popOut {
        from {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        to {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
