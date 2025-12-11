// ============================================
// Encryption Algorithms Implementation
// ============================================

// ============================================
// CAESAR CIPHER
// ============================================

function caesarEncrypt(text, shift) {
     shift = parseInt(shift);
     if (isNaN(shift)) return text;

     // Normalize shift to 0-25 range
     shift = ((shift % 26) + 26) % 26;

     return text.split('').map(char => {
          if (char.match(/[a-z]/i)) {
               const code = char.charCodeAt(0);
               const isUpperCase = char === char.toUpperCase();
               const base = isUpperCase ? 65 : 97;

               return String.fromCharCode(((code - base + shift) % 26) + base);
          }
          return char;
     }).join('');
}

function caesarDecrypt(text, shift) {
     // Decryption is just encryption with negative shift
     return caesarEncrypt(text, -shift);
}

// ============================================
// ONE-TIME PAD (OTP)
// ============================================

function otpGenerateKey(length) {
     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
     let key = '';

     // Array to store real random values
     const randomValues = new Uint32Array(length);

     // Generate secure random numbers from the system
     window.crypto.getRandomValues(randomValues);

     for (let i = 0; i < length; i++) {
          // Use the real random values
          const randomIndex = randomValues[i] % characters.length;
          key += characters[randomIndex];
     }

     return key;
}

function otpEncrypt(text, key) {
     if (text.length !== key.length) {
          throw new Error('Key length must match text length');
     }

     let result = '';
     for (let i = 0; i < text.length; i++) {
          const textCode = text.charCodeAt(i);
          const keyCode = key.charCodeAt(i);
          const encryptedCode = textCode ^ keyCode;
          result += String.fromCharCode(encryptedCode);
     }

     return result;
}

function otpDecrypt(text, key) {
     // OTP decryption is the same as encryption (XOR property)
     return otpEncrypt(text, key);
}

// ============================================
// PLAYFAIR CIPHER
// ============================================

function playfairGenerateTable(keyPhrase) {
     // Remove spaces and convert to uppercase
     keyPhrase = keyPhrase.replace(/\s/g, '').toUpperCase();

     // Replace J with I
     keyPhrase = keyPhrase.replace(/J/g, 'I');

     // Create alphabet without J
     const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ';

     // Build the matrix
     let matrix = '';
     const used = new Set();

     // Add key phrase letters first
     for (let char of keyPhrase) {
          if (alphabet.includes(char) && !used.has(char)) {
               matrix += char;
               used.add(char);
          }
     }

     // Add remaining alphabet letters
     for (let char of alphabet) {
          if (!used.has(char)) {
               matrix += char;
          }
     }

     // Convert to 5x5 array
     const table = [];
     for (let i = 0; i < 5; i++) {
          table.push(matrix.slice(i * 5, (i + 1) * 5).split(''));
     }

     return table;
}

function playfairFindPosition(table, char) {
     for (let row = 0; row < 5; row++) {
          for (let col = 0; col < 5; col++) {
               if (table[row][col] === char) {
                    return { row, col };
               }
          }
     }
     return null;
}

function playfairPreparePlaintext(text) {
     // Remove spaces and convert to uppercase
     text = text.replace(/\s/g, '').toUpperCase();

     // Replace J with I
     text = text.replace(/J/g, 'I');

     // Remove non-alphabetic characters
     text = text.replace(/[^A-Z]/g, '');

     // Split into digraphs
     const digraphs = [];
     let i = 0;

     while (i < text.length) {
          let first = text[i];
          let second = i + 1 < text.length ? text[i + 1] : 'X';

          // If both letters are the same, insert X between them
          if (first === second) {
               digraphs.push(first + 'X');
               i++; // Move to the repeated letter (it will be processed in next iteration)
          } else {
               digraphs.push(first + second);
               i += 2; // Move past both letters
          }
     }

     return digraphs;
}

function playfairEncryptDigraph(table, digraph) {
     const pos1 = playfairFindPosition(table, digraph[0]);
     const pos2 = playfairFindPosition(table, digraph[1]);

     if (!pos1 || !pos2) return digraph;

     // Same row: shift right
     if (pos1.row === pos2.row) {
          return table[pos1.row][(pos1.col + 1) % 5] +
               table[pos2.row][(pos2.col + 1) % 5];
     }

     // Same column: shift down
     if (pos1.col === pos2.col) {
          return table[(pos1.row + 1) % 5][pos1.col] +
               table[(pos2.row + 1) % 5][pos2.col];
     }

     // Rectangle: swap corners
     return table[pos1.row][pos2.col] + table[pos2.row][pos1.col];
}

function playfairDecryptDigraph(table, digraph) {
     const pos1 = playfairFindPosition(table, digraph[0]);
     const pos2 = playfairFindPosition(table, digraph[1]);

     if (!pos1 || !pos2) return digraph;

     // Same row: shift left
     if (pos1.row === pos2.row) {
          return table[pos1.row][(pos1.col + 4) % 5] +
               table[pos2.row][(pos2.col + 4) % 5];
     }

     // Same column: shift up
     if (pos1.col === pos2.col) {
          return table[(pos1.row + 4) % 5][pos1.col] +
               table[(pos2.row + 4) % 5][pos2.col];
     }

     // Rectangle: swap corners (same as encryption)
     return table[pos1.row][pos2.col] + table[pos2.row][pos1.col];
}

function playfairEncrypt(text, keyPhrase) {
     const table = playfairGenerateTable(keyPhrase);
     const digraphs = playfairPreparePlaintext(text);

     return digraphs.map(digraph => playfairEncryptDigraph(table, digraph)).join('');
}

function playfairDecrypt(text, keyPhrase) {
     const table = playfairGenerateTable(keyPhrase);

     // Prepare ciphertext (should already be in digraphs)
     text = text.replace(/\s/g, '').toUpperCase().replace(/J/g, 'I');

     const digraphs = [];
     for (let i = 0; i < text.length; i += 2) {
          if (i + 1 < text.length) {
               digraphs.push(text[i] + text[i + 1]);
          }
     }

     let result = digraphs.map(digraph => playfairDecryptDigraph(table, digraph)).join('');

     // Remove padding X characters that were inserted between repeated letters
     // This is a heuristic approach - remove X when it appears between identical letters
     result = result.replace(/(.)X\1/g, '$1$1');

     // Remove trailing X if the original text had odd length
     if (result.endsWith('X') && result.length > 1) {
          // Only remove if it's likely padding (last character)
          const withoutLastX = result.slice(0, -1);
          // Check if removing it makes sense (you might want to keep it if it's part of the original text)
          result = withoutLastX;
     }

     return result;
}

// ============================================
// Utility: Display Playfair Table
// ============================================

function displayPlayfairTable(keyPhrase) {
     const table = playfairGenerateTable(keyPhrase);
     let html = '<div style="font-family: monospace; margin: 1rem 0;">';
     html += '<strong>Generated 5×5 Playfair Table:</strong><br><br>';
     html += '<table style="border-collapse: collapse;">';

     for (let row of table) {
          html += '<tr>';
          for (let cell of row) {
               html += `<td style="border: 1px solid var(--tertiary-dark); padding: 0.5rem; text-align: center; background: rgba(0, 212, 255, 0.1);">${cell}</td>`;
          }
          html += '</tr>';
     }

     html += '</table></div>';
     return html;
}

// ============================================
// RAIL FENCE CIPHER
// ============================================

function railFenceEncrypt(text, rails) {
     rails = parseInt(rails);
     if (isNaN(rails) || rails < 2) return text;

     text = text.replace(/\s/g, ''); // Remove spaces
     if (text.length === 0) return text;

     // Create the fence
     const fence = Array(rails).fill(null).map(() => []);
     let rail = 0;
     let direction = 1; // 1 for down, -1 for up

     // Place characters in zigzag pattern
     for (let char of text) {
          fence[rail].push(char);
          rail += direction;

          // Change direction at top or bottom
          if (rail === 0 || rail === rails - 1) {
               direction *= -1;
          }
     }

     // Read off the rails
     return fence.map(row => row.join('')).join('');
}

function railFenceDecrypt(text, rails) {
     rails = parseInt(rails);
     if (isNaN(rails) || rails < 2) return text;
     if (text.length === 0) return text;

     // Create the fence pattern to know positions
     const fence = Array(rails).fill(null).map(() => Array(text.length).fill(null));
     let rail = 0;
     let direction = 1;

     // Mark positions in zigzag pattern
     for (let i = 0; i < text.length; i++) {
          fence[rail][i] = '*';
          rail += direction;

          if (rail === 0 || rail === rails - 1) {
               direction *= -1;
          }
     }

     // Fill in the characters
     let index = 0;
     for (let r = 0; r < rails; r++) {
          for (let c = 0; c < text.length; c++) {
               if (fence[r][c] === '*') {
                    fence[r][c] = text[index++];
               }
          }
     }

     // Read off in zigzag pattern
     let result = '';
     rail = 0;
     direction = 1;
     for (let i = 0; i < text.length; i++) {
          result += fence[rail][i];
          rail += direction;

          if (rail === 0 || rail === rails - 1) {
               direction *= -1;
          }
     }

     return result;
}

// ============================================
// MONOALPHABETIC CIPHER
// ============================================

function monoalphabeticGenerateKey() {
     const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
     const shuffled = alphabet.split('').sort(() => Math.random() - 0.5).join('');
     return shuffled;
}

function monoalphabeticEncrypt(text, key) {
     const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
     if (key.length !== 26) {
          throw new Error('Key must be 26 characters long');
     }

     return text.split('').map(char => {
          if (char.match(/[a-z]/i)) {
               const isUpperCase = char === char.toUpperCase();
               const index = alphabet.indexOf(char.toUpperCase());
               const encrypted = key[index];
               return isUpperCase ? encrypted : encrypted.toLowerCase();
          }
          return char;
     }).join('');
}

function monoalphabeticDecrypt(text, key) {
     const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
     if (key.length !== 26) {
          throw new Error('Key must be 26 characters long');
     }

     return text.split('').map(char => {
          if (char.match(/[a-z]/i)) {
               const isUpperCase = char === char.toUpperCase();
               const index = key.indexOf(char.toUpperCase());
               const decrypted = alphabet[index];
               return isUpperCase ? decrypted : decrypted.toLowerCase();
          }
          return char;
     }).join('');
}

// ============================================
// POLYALPHABETIC CIPHER (Vigenère)
// ============================================

function vigenereEncrypt(text, keyword) {
     keyword = keyword.toUpperCase().replace(/[^A-Z]/g, '');
     if (keyword.length === 0) {
          throw new Error('Keyword must contain at least one letter');
     }

     let result = '';
     let keyIndex = 0;

     for (let char of text) {
          if (char.match(/[a-z]/i)) {
               const isUpperCase = char === char.toUpperCase();
               const base = isUpperCase ? 65 : 97;
               const charCode = char.charCodeAt(0) - base;
               const keyShift = keyword.charCodeAt(keyIndex % keyword.length) - 65;
               const encrypted = String.fromCharCode(((charCode + keyShift) % 26) + base);
               result += encrypted;
               keyIndex++;
          } else {
               result += char;
          }
     }

     return result;
}

function vigenereDecrypt(text, keyword) {
     keyword = keyword.toUpperCase().replace(/[^A-Z]/g, '');
     if (keyword.length === 0) {
          throw new Error('Keyword must contain at least one letter');
     }

     let result = '';
     let keyIndex = 0;

     for (let char of text) {
          if (char.match(/[a-z]/i)) {
               const isUpperCase = char === char.toUpperCase();
               const base = isUpperCase ? 65 : 97;
               const charCode = char.charCodeAt(0) - base;
               const keyShift = keyword.charCodeAt(keyIndex % keyword.length) - 65;
               const decrypted = String.fromCharCode(((charCode - keyShift + 26) % 26) + base);
               result += decrypted;
               keyIndex++;
          } else {
               result += char;
          }
     }

     return result;
}

// ============================================
// HILL CIPHER (2x2 Matrix Only)
// ============================================

function hillModInverse(a, m = 26) {
     a = ((a % m) + m) % m;
     for (let x = 1; x < m; x++) {
          if ((a * x) % m === 1) return x;
     }
     return null;
}

function hillDeterminant2x2(matrix) {
     return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
}

function hillInverseMatrix2x2(matrix) {
     const det = hillDeterminant2x2(matrix);
     const detInv = hillModInverse(((det % 26) + 26) % 26, 26);

     if (detInv === null) {
          throw new Error('Matrix is not invertible (determinant has no modular inverse)');
     }

     // Inverse matrix formula for 2x2
     return [
          [(detInv * matrix[1][1]) % 26, (detInv * -matrix[0][1]) % 26],
          [(detInv * -matrix[1][0]) % 26, (detInv * matrix[0][0]) % 26]
     ].map(row => row.map(val => ((val % 26) + 26) % 26));
}

function hillEncrypt(text, keyMatrix) {
     // Remove non-alphabetic characters and convert to uppercase
     text = text.toUpperCase().replace(/[^A-Z]/g, '');

     // Pad text if odd length
     if (text.length % 2 !== 0) text += 'X';

     let result = '';

     for (let i = 0; i < text.length; i += 2) {
          const v1 = text.charCodeAt(i) - 65;
          const v2 = text.charCodeAt(i + 1) - 65;

          const c1 = (keyMatrix[0][0] * v1 + keyMatrix[0][1] * v2) % 26;
          const c2 = (keyMatrix[1][0] * v1 + keyMatrix[1][1] * v2) % 26;

          result += String.fromCharCode(c1 + 65) + String.fromCharCode(c2 + 65);
     }

     return result;
}

function hillDecrypt(text, keyMatrix) {
     text = text.toUpperCase().replace(/[^A-Z]/g, '');

     const invMatrix = hillInverseMatrix2x2(keyMatrix);
     let result = '';

     for (let i = 0; i < text.length; i += 2) {
          const c1 = text.charCodeAt(i) - 65;
          const c2 = text.charCodeAt(i + 1) - 65;

          const v1 = (invMatrix[0][0] * c1 + invMatrix[0][1] * c2) % 26;
          const v2 = (invMatrix[1][0] * c1 + invMatrix[1][1] * c2) % 26;

          result += String.fromCharCode(v1 + 65) + String.fromCharCode(v2 + 65);
     }

     return result;
}

// ============================================
// ROW COLUMN TRANSPOSITION CIPHER
// ============================================

function rowColumnEncrypt(text, key) {
     // Remove spaces
     text = text.replace(/\s/g, '');

     // Convert key to column order
     const keyOrder = key.split('').map((char, index) => ({ char, index }))
          .sort((a, b) => a.char.localeCompare(b.char))
          .map((item, newIndex) => ({ oldIndex: item.index, newIndex }));

     const numCols = key.length;
     const numRows = Math.ceil(text.length / numCols);

     // Create grid
     const grid = Array(numRows).fill(null).map(() => Array(numCols).fill('X'));

     // Fill grid row by row
     let index = 0;
     for (let r = 0; r < numRows; r++) {
          for (let c = 0; c < numCols; c++) {
               if (index < text.length) {
                    grid[r][c] = text[index++];
               }
          }
     }

     // Read columns in key order
     let result = '';
     keyOrder.sort((a, b) => a.newIndex - b.newIndex);
     for (let item of keyOrder) {
          for (let r = 0; r < numRows; r++) {
               result += grid[r][item.oldIndex];
          }
     }

     return result;
}

function rowColumnDecrypt(text, key) {
     const numCols = key.length;
     const numRows = Math.ceil(text.length / numCols);

     // Convert key to column order
     const keyOrder = key.split('').map((char, index) => ({ char, index }))
          .sort((a, b) => a.char.localeCompare(b.char))
          .map((item, newIndex) => ({ oldIndex: item.index, newIndex }));

     // Create grid
     const grid = Array(numRows).fill(null).map(() => Array(numCols).fill(''));

     // Fill columns in key order
     let index = 0;
     keyOrder.sort((a, b) => a.newIndex - b.newIndex);
     for (let item of keyOrder) {
          for (let r = 0; r < numRows; r++) {
               if (index < text.length) {
                    grid[r][item.oldIndex] = text[index++];
               }
          }
     }

     // Read row by row
     let result = '';
     for (let r = 0; r < numRows; r++) {
          for (let c = 0; c < numCols; c++) {
               if (grid[r][c] !== 'X' || r < numRows - 1 || c < text.length % numCols) {
                    result += grid[r][c];
               }
          }
     }

     return result.replace(/X+$/, ''); // Remove trailing padding
}
