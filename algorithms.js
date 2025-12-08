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

     for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
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

          // If both letters are the same, insert X
          if (first === second) {
               second = 'X';
               i++;
          } else {
               i += 2;
          }

          digraphs.push(first + second);
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

     return digraphs.map(digraph => playfairDecryptDigraph(table, digraph)).join('');
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
