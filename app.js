// ============================================
// Main Application Logic
// ============================================

// State management
const appState = {
     selectedAlgorithm: null,
     mode: 'encrypt'
};

// DOM Elements
const algorithmCards = document.querySelectorAll('.algorithm-card');
const modeSection = document.getElementById('modeSection');
const modeButtons = document.querySelectorAll('.mode-btn');
const workspaceSection = document.getElementById('workspaceSection');
const resultsSection = document.getElementById('resultsSection');
const textInput = document.getElementById('textInput');
const keyInput = document.getElementById('keyInput');
const keyLabel = document.getElementById('keyLabel');
const keyHint = document.getElementById('keyHint');
const generateKeyBtn = document.getElementById('generateKeyBtn');
const executeBtn = document.getElementById('executeBtn');
const errorMessage = document.getElementById('errorMessage');
const resultText = document.getElementById('resultText');
const copyBtn = document.getElementById('copyBtn');

// ============================================
// Event Listeners
// ============================================

// Algorithm selection
algorithmCards.forEach(card => {
     card.addEventListener('click', () => {
          // Remove active class from all cards
          algorithmCards.forEach(c => c.classList.remove('active'));

          // Add active class to clicked card
          card.classList.add('active');

          // Update state
          appState.selectedAlgorithm = card.dataset.algorithm;

          // Show mode selection
          modeSection.classList.remove('hidden');

          // Display explanation
          displayExplanation(appState.selectedAlgorithm);

          // Show workspace
          workspaceSection.classList.remove('hidden');

          // Update key input based on algorithm
          updateKeyInput();

          // Clear previous results
          resultsSection.classList.add('hidden');
          errorMessage.classList.add('hidden');
          textInput.value = '';
          keyInput.value = '';

          // Scroll to mode section
          setTimeout(() => {
               modeSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 300);
     });
});

// Mode selection
modeButtons.forEach(btn => {
     btn.addEventListener('click', () => {
          // Remove active class from all buttons
          modeButtons.forEach(b => b.classList.remove('active'));

          // Add active class to clicked button
          btn.classList.add('active');

          // Update state
          appState.mode = btn.dataset.mode;

          // Update execute button text
          executeBtn.textContent = appState.mode === 'encrypt' ? '🔒 Encrypt' : '🔓 Decrypt';

          // Clear results
          resultsSection.classList.add('hidden');
          errorMessage.classList.add('hidden');
     });
});

// Generate key button (for OTP)
generateKeyBtn.addEventListener('click', () => {
     const textLength = textInput.value.length;

     if (textLength === 0) {
          showError('Please enter text first before generating a key');
          return;
     }

     const key = otpGenerateKey(textLength);
     keyInput.value = key;

     // Clear error if any
     errorMessage.classList.add('hidden');
});

// Execute button
executeBtn.addEventListener('click', () => {
     executeOperation();
});

// Copy button
copyBtn.addEventListener('click', () => {
     const text = resultText.textContent;
     navigator.clipboard.writeText(text).then(() => {
          copyBtn.textContent = '✅ Copied!';
          setTimeout(() => {
               copyBtn.textContent = '📋 Copy';
          }, 2000);
     });
});

// Enter key support
textInput.addEventListener('keypress', (e) => {
     if (e.key === 'Enter' && e.ctrlKey) {
          executeOperation();
     }
});

keyInput.addEventListener('keypress', (e) => {
     if (e.key === 'Enter') {
          executeOperation();
     }
});

// ============================================
// Helper Functions
// ============================================

function updateKeyInput() {
     const algorithm = appState.selectedAlgorithm;

     // Reset
     generateKeyBtn.classList.add('hidden');
     keyHint.textContent = '';

     switch (algorithm) {
          case 'caesar':
               keyLabel.textContent = 'Shift Value (1-25)';
               keyInput.placeholder = 'Enter a number between 1 and 25';
               keyInput.type = 'number';
               keyInput.min = '1';
               keyInput.max = '25';
               keyHint.textContent = 'The number of positions to shift each letter';
               break;

          case 'otp':
               keyLabel.textContent = 'Encryption Key';
               keyInput.placeholder = 'Enter key or generate one';
               keyInput.type = 'text';
               keyInput.removeAttribute('min');
               keyInput.removeAttribute('max');
               generateKeyBtn.classList.remove('hidden');
               keyHint.textContent = 'Key must be exactly the same length as your text';
               break;

          case 'playfair':
               keyLabel.textContent = 'Key Phrase';
               keyInput.placeholder = 'Enter a keyword or phrase';
               keyInput.type = 'text';
               keyInput.removeAttribute('min');
               keyInput.removeAttribute('max');
               keyHint.textContent = 'A word or phrase used to generate the 5×5 encryption table';
               break;
     }
}

function showError(message) {
     errorMessage.textContent = message;
     errorMessage.classList.remove('hidden');

     // Scroll to error
     setTimeout(() => {
          errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
     }, 100);
}

function validateInput() {
     const text = textInput.value.trim();
     const key = keyInput.value.trim();
     const algorithm = appState.selectedAlgorithm;

     if (!text) {
          showError('Please enter some text to ' + appState.mode);
          return false;
     }

     if (!key) {
          showError('Please enter a key');
          return false;
     }

     // Algorithm-specific validation
     switch (algorithm) {
          case 'caesar':
               const shift = parseInt(key);
               if (isNaN(shift) || shift < 1 || shift > 25) {
                    showError('Shift value must be a number between 1 and 25');
                    return false;
               }
               break;

          case 'otp':
               if (key.length !== text.length) {
                    showError(`Key length (${key.length}) must match text length (${text.length})`);
                    return false;
               }
               break;

          case 'playfair':
               if (key.length < 1) {
                    showError('Please enter a key phrase');
                    return false;
               }
               break;
     }

     return true;
}

function executeOperation() {
     // Clear previous error
     errorMessage.classList.add('hidden');

     // Validate input
     if (!validateInput()) {
          return;
     }

     const text = textInput.value;
     const key = keyInput.value;
     const algorithm = appState.selectedAlgorithm;
     const mode = appState.mode;

     let result = '';
     let additionalInfo = '';

     try {
          switch (algorithm) {
               case 'caesar':
                    result = mode === 'encrypt'
                         ? caesarEncrypt(text, key)
                         : caesarDecrypt(text, key);
                    break;

               case 'otp':
                    result = mode === 'encrypt'
                         ? otpEncrypt(text, key)
                         : otpDecrypt(text, key);

                    // Convert to readable format (hex)
                    result = Array.from(result)
                         .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
                         .join(' ');
                    additionalInfo = '<br><small style="color: var(--text-muted);">Result shown in hexadecimal format</small>';
                    break;

               case 'playfair':
                    if (mode === 'encrypt') {
                         result = playfairEncrypt(text, key);
                         additionalInfo = displayPlayfairTable(key);
                    } else {
                         result = playfairDecrypt(text, key);
                         additionalInfo = displayPlayfairTable(key);
                    }
                    break;
          }

          // Display result
          resultText.innerHTML = result + additionalInfo;
          resultsSection.classList.remove('hidden');

          // Scroll to results
          setTimeout(() => {
               resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 100);

     } catch (error) {
          showError('Error: ' + error.message);
     }
}

// ============================================
// Header Scroll Animation
// ============================================

let lastScrollTop = 0;
const header = document.querySelector('.header');
const scrollThreshold = 100; // Minimum scroll distance before hiding header

window.addEventListener('scroll', () => {
     const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

     // Scrolling down and past threshold
     if (currentScroll > lastScrollTop && currentScroll > scrollThreshold) {
          header.classList.add('header-hidden');
     }
     // Scrolling up
     else if (currentScroll < lastScrollTop) {
          header.classList.remove('header-hidden');
     }

     // At the very top, always show header
     if (currentScroll <= 0) {
          header.classList.remove('header-hidden');
     }

     lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
}, false);

// ============================================
// Initialize
// ============================================

// Set initial execute button text
executeBtn.textContent = '🔒 Encrypt';
