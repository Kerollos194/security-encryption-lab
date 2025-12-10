// ============================================
// Main Application Logic
// ============================================

// State management
const appState = {
     selectedAlgorithm: null,
     mode: 'encrypt'
};

// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
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
const videoIframe = document.getElementById('videoIframe');
const videoContainer = document.getElementById('videoContainer');

// ============================================
// Event Listeners
// ============================================

// Listen for algorithm selection from chase game
document.addEventListener('algorithmSelected', function (e) {
     const algorithm = e.detail.algorithm;
     if (!algorithm) return;

     // Update state
     appState.selectedAlgorithm = algorithm;

     // Update YouTube video
     const explanation = algorithmExplanations[appState.selectedAlgorithm];
     const videoUrl = explanation.videoUrl;
     const videoId = videoUrl.split('/embed/')[1]?.split('?')[0];

     if (videoId) {
          const thumbnail = document.getElementById('videoThumbnail');
          const playButton = document.getElementById('playButton');
          const iframe = document.getElementById('videoIframe');

          if (thumbnail && playButton && iframe) {
               // Set thumbnail image with fallback for different qualities
               // Try maxresdefault first, then sddefault, then hqdefault
               const tryLoadThumbnail = (quality, fallbackQualities) => {
                    thumbnail.src = `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;

                    // If image fails to load, try next quality
                    thumbnail.onerror = () => {
                         if (fallbackQualities.length > 0) {
                              const nextQuality = fallbackQualities[0];
                              const remainingQualities = fallbackQualities.slice(1);
                              tryLoadThumbnail(nextQuality, remainingQualities);
                         }
                    };
               };

               // Try in order: maxresdefault -> sddefault -> hqdefault -> default
               tryLoadThumbnail('maxresdefault', ['sddefault', 'hqdefault', 'default']);

               thumbnail.style.display = 'block';
               playButton.style.display = 'flex';
               iframe.style.display = 'none';

               // Open YouTube video in new tab when clicked
               const openYouTube = function () {
                    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
                    window.open(youtubeUrl, '_blank');
               };

               thumbnail.onclick = openYouTube;
               playButton.onclick = openYouTube;
               if (videoContainer) {
                    videoContainer.onclick = openYouTube;
                    videoContainer.style.cursor = 'pointer';
               }
          }
     }

     // Display explanation
     displayExplanation(appState.selectedAlgorithm);

     // Show cipher info section
     const cipherInfoSection = document.getElementById('cipherInfoSection');
     if (cipherInfoSection) {
          cipherInfoSection.classList.remove('hidden');
     }

     // Show mode selection
     modeSection.classList.remove('hidden');

     // Show workspace
     workspaceSection.classList.remove('hidden');

     // Update key input
     updateKeyInput();

     // Clear previous results
     resultsSection.classList.add('hidden');
     errorMessage.classList.add('hidden');
     textInput.value = '';
     keyInput.value = '';

     // Scroll to top
     window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Algorithm card clicks (original functionality kept for compatibility)
const algorithmCards = document.querySelectorAll('.algorithm-card');
const homePage = document.getElementById('homePage');
const algorithmPage = document.getElementById('algorithmPage');
const backBtn = document.getElementById('backBtn');

algorithmCards.forEach(card => {
     card.addEventListener('click', () => {
          // Update state
          appState.selectedAlgorithm = card.dataset.algorithm;

          // Hide home page, show algorithm page
          homePage.classList.add('hidden');
          algorithmPage.classList.remove('hidden');

          // Update YouTube video
          const explanation = algorithmExplanations[appState.selectedAlgorithm];

          // Extract video ID from YouTube URL
          const videoUrl = explanation.videoUrl;
          const videoId = videoUrl.split('/embed/')[1]?.split('?')[0];

          if (videoId) {
               // Show thumbnail
               const thumbnail = document.getElementById('videoThumbnail');
               const playButton = document.getElementById('playButton');
               const iframe = document.getElementById('videoIframe');

               // Set thumbnail image with fallback for different qualities
               // Try maxresdefault first, then sddefault, then hqdefault
               const tryLoadThumbnail = (quality, fallbackQualities) => {
                    thumbnail.src = `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;

                    // If image fails to load, try next quality
                    thumbnail.onerror = () => {
                         if (fallbackQualities.length > 0) {
                              const nextQuality = fallbackQualities[0];
                              const remainingQualities = fallbackQualities.slice(1);
                              tryLoadThumbnail(nextQuality, remainingQualities);
                         }
                    };
               };

               // Try in order: maxresdefault -> sddefault -> hqdefault -> default
               tryLoadThumbnail('maxresdefault', ['sddefault', 'hqdefault', 'default']);

               thumbnail.style.display = 'block';
               playButton.style.display = 'flex';
               iframe.style.display = 'none';

               // Open YouTube video in new tab when clicked
               const openYouTube = () => {
                    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
                    window.open(youtubeUrl, '_blank');
               };

               thumbnail.onclick = openYouTube;
               playButton.onclick = openYouTube;
               videoContainer.onclick = openYouTube;
               videoContainer.style.cursor = 'pointer';
          }

          // Display explanation
          displayExplanation(appState.selectedAlgorithm);

          // Show cipher info section
          const cipherInfoSection = document.getElementById('cipherInfoSection');
          if (cipherInfoSection) {
               cipherInfoSection.classList.remove('hidden');
          }

          // Show mode selection
          modeSection.classList.remove('hidden');

          // Show workspace
          workspaceSection.classList.remove('hidden');

          // Update key input based on algorithm
          updateKeyInput();

          // Clear previous results
          resultsSection.classList.add('hidden');
          errorMessage.classList.add('hidden');
          textInput.value = '';
          keyInput.value = '';

          // Scroll to top
          window.scrollTo({ top: 0, behavior: 'smooth' });
     });
});

// Back button
backBtn.addEventListener('click', () => {
     // Hide algorithm page, show home page
     algorithmPage.classList.add('hidden');
     homePage.classList.remove('hidden');

     // Reset state
     appState.selectedAlgorithm = null;

     // Hide all sections
     const cipherInfoSection = document.getElementById('cipherInfoSection');
     if (cipherInfoSection) {
          cipherInfoSection.classList.add('hidden');
     }
     modeSection.classList.add('hidden');
     workspaceSection.classList.add('hidden');
     resultsSection.classList.add('hidden');

     // Scroll to top
     window.scrollTo({ top: 0, behavior: 'smooth' });
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

          // Update execute button text and style
          if (appState.mode === 'encrypt') {
               executeBtn.textContent = '🔒 Encrypt';
               executeBtn.classList.remove('decrypt-btn');
               executeBtn.classList.add('encrypt-btn');
          } else {
               executeBtn.textContent = '🔓 Decrypt';
               executeBtn.classList.remove('encrypt-btn');
               executeBtn.classList.add('decrypt-btn');
          }

          // Update workspace background
          const workspace = document.querySelector('.workspace');
          if (appState.mode === 'encrypt') {
               workspace.classList.remove('decrypt-mode');
               workspace.classList.add('encrypt-mode');
          } else {
               workspace.classList.remove('encrypt-mode');
               workspace.classList.add('decrypt-mode');
          }

          // Update body background
          const body = document.body;
          if (appState.mode === 'encrypt') {
               body.classList.remove('decrypt-mode');
               body.classList.add('encrypt-mode');
          } else {
               body.classList.remove('encrypt-mode');
               body.classList.add('decrypt-mode');
          }

          // Clear results
          resultsSection.classList.add('hidden');
          errorMessage.classList.add('hidden');
     });
});

// Generate key button
generateKeyBtn.addEventListener('click', () => {
     const textLength = textInput.value.length;
     const algorithm = appState.selectedAlgorithm;

     if (textLength === 0) {
          showError('Please enter text first before generating a key');
          return;
     }

     let key = '';

     if (algorithm === 'otp') {
          key = otpGenerateKey(textLength);
     } else if (algorithm === 'monoalphabetic') {
          key = monoalphabeticGenerateKey();
     }

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
     keyInput.type = 'text';
     keyInput.removeAttribute('min');
     keyInput.removeAttribute('max');

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
               generateKeyBtn.classList.remove('hidden');
               keyHint.textContent = 'Key must be exactly the same length as your text';
               break;

          case 'playfair':
               keyLabel.textContent = 'Key Phrase';
               keyInput.placeholder = 'Enter a keyword or phrase';
               keyHint.textContent = 'A word or phrase used to generate the 5×5 encryption table';
               break;

          case 'railfence':
               keyLabel.textContent = 'Number of Rails';
               keyInput.placeholder = 'Enter number of rails (e.g., 3)';
               keyInput.type = 'number';
               keyInput.min = '2';
               keyInput.max = '10';
               keyHint.textContent = 'The number of rows in the zigzag pattern';
               break;

          case 'monoalphabetic':
               keyLabel.textContent = 'Substitution Key (26 letters)';
               keyInput.placeholder = 'Enter 26-letter key or generate one';
               generateKeyBtn.classList.remove('hidden');
               keyHint.textContent = 'A shuffled 26-letter alphabet for substitution';
               break;

          case 'polyalphabetic':
               keyLabel.textContent = 'Keyword';
               keyInput.placeholder = 'Enter a keyword (e.g., KEY)';
               keyHint.textContent = 'A word that determines the shift pattern';
               break;

          case 'hill':
               keyLabel.textContent = 'Key Matrix (2x2)';
               keyInput.placeholder = 'Enter 4 numbers separated by commas (e.g., 3,3,2,5)';
               keyHint.textContent = 'Four numbers for a 2×2 matrix: a,b,c,d → [[a,b],[c,d]]';
               break;

          case 'rowcolumn':
               keyLabel.textContent = 'Keyword';
               keyInput.placeholder = 'Enter a keyword (e.g., ZEBRA)';
               keyHint.textContent = 'A word that determines the column order';
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
               let actualTextLength = text.length;
               if (appState.mode === 'decrypt' && text.includes(' ') && /^[0-9a-fA-F\s]+$/.test(text)) {
                    actualTextLength = text.split(' ').filter(h => h.length > 0).length;
               }

               if (key.length !== actualTextLength) {
                    showError(`Key length (${key.length}) must match text length (${actualTextLength})`);
                    return false;
               }
               break;

          case 'playfair':
               if (key.length < 1) {
                    showError('Please enter a key phrase');
                    return false;
               }
               break;

          case 'railfence':
               const rails = parseInt(key);
               if (isNaN(rails) || rails < 2 || rails > 10) {
                    showError('Number of rails must be between 2 and 10');
                    return false;
               }
               break;

          case 'monoalphabetic':
               if (key.length !== 26) {
                    showError('Key must be exactly 26 letters');
                    return false;
               }
               if (!/^[A-Za-z]{26}$/.test(key)) {
                    showError('Key must contain only letters');
                    return false;
               }
               break;

          case 'polyalphabetic':
               if (key.length < 1) {
                    showError('Please enter a keyword');
                    return false;
               }
               if (!/^[A-Za-z]+$/.test(key)) {
                    showError('Keyword must contain only letters');
                    return false;
               }
               break;

          case 'hill':
               const parts = key.split(',').map(n => parseInt(n.trim()));
               if (parts.length !== 4 || parts.some(isNaN)) {
                    showError('Key must be 4 numbers separated by commas');
                    return false;
               }
               break;

          case 'rowcolumn':
               if (key.length < 2) {
                    showError('Keyword must be at least 2 characters');
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
                    if (mode === 'encrypt') {
                         result = otpEncrypt(text, key);
                         result = Array.from(result)
                              .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
                              .join(' ');
                    } else {
                         let ciphertext = text;
                         if (text.includes(' ') && /^[0-9a-fA-F\s]+$/.test(text)) {
                              ciphertext = text.split(' ')
                                   .map(hex => String.fromCharCode(parseInt(hex, 16)))
                                   .join('');
                         }
                         result = otpDecrypt(ciphertext, key);
                    }
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

               case 'railfence':
                    result = mode === 'encrypt'
                         ? railFenceEncrypt(text, key)
                         : railFenceDecrypt(text, key);
                    break;

               case 'monoalphabetic':
                    result = mode === 'encrypt'
                         ? monoalphabeticEncrypt(text, key)
                         : monoalphabeticDecrypt(text, key);
                    break;

               case 'polyalphabetic':
                    result = mode === 'encrypt'
                         ? vigenereEncrypt(text, key)
                         : vigenereDecrypt(text, key);
                    break;

               case 'hill':
                    const parts = key.split(',').map(n => parseInt(n.trim()));
                    const keyMatrix = [[parts[0], parts[1]], [parts[2], parts[3]]];

                    result = mode === 'encrypt'
                         ? hillEncrypt(text, keyMatrix)
                         : hillDecrypt(text, keyMatrix);

                    additionalInfo = `<br><small style="color: var(--text-muted);">Key Matrix: [[${parts[0]},${parts[1]}],[${parts[2]},${parts[3]}]]</small>`;
                    break;

               case 'rowcolumn':
                    result = mode === 'encrypt'
                         ? rowColumnEncrypt(text, key)
                         : rowColumnDecrypt(text, key);
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
// Initialize
// ============================================

// Set initial execute button text and style
executeBtn.textContent = '🔒 Encrypt';
executeBtn.classList.add('encrypt-btn');

// Set initial workspace mode
const workspace = document.querySelector('.workspace');
if (workspace) {
     workspace.classList.add('encrypt-mode');
}

// Set initial body mode
document.body.classList.add('encrypt-mode');
