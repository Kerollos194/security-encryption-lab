// ============================================
// Algorithm Explanations Data with YouTube Videos
// ============================================

const algorithmExplanations = {
    playfair: {
        name: "Playfair Cipher",
        videoUrl: "https://www.youtube.com/embed/quKhvu2tPy8",
        description: "The Playfair Cipher is a digraph substitution cipher that encrypts pairs of letters instead of single letters. It uses a 5×5 matrix of letters based on a keyword.",

        howItWorks: [
            "Create a 5×5 matrix using a keyword (I and J share a cell)",
            "Remove duplicate letters from the keyword",
            "Fill remaining cells with unused alphabet letters",
            "Split plaintext into pairs (digraphs)",
            "If a pair has identical letters, insert 'X' between them",
            "Apply encryption rules based on pair positions in the matrix",
            "Same row: shift right; Same column: shift down; Rectangle: swap corners"
        ],

        example: {
            title: "Example with keyword 'MONARCHY'",
            matrix: "M O N A R\\nC H Y B D\\nE F G I/J K\\nL P Q S T\\nU V W X Z",
            plaintext: "HE LX LO",
            process: "HE→YD, LX→RW, LO→QS",
            ciphertext: "YDRWQS"
        },

        strengths: [
            "More secure than simple substitution ciphers",
            "Resistant to frequency analysis of single letters",
            "Encrypts digraphs, hiding letter patterns",
            "Historically used in military communications"
        ],

        weaknesses: [
            "Still vulnerable to frequency analysis of digraphs",
            "Can be broken with enough ciphertext",
            "Rules for handling edge cases can be complex",
            "Not secure by modern cryptographic standards"
        ]
    },

    railfence: {
        name: "Rail Fence Cipher",
        videoUrl: "https://www.youtube.com/embed/srlpq49LhYo",
        description: "The Rail Fence Cipher is a transposition cipher that rearranges the plaintext by writing it in a zigzag pattern across multiple 'rails' (rows), then reading off each rail sequentially.",

        howItWorks: [
            "Choose the number of rails (rows)",
            "Write the plaintext in a zigzag pattern across the rails",
            "Start at the top rail and move diagonally down",
            "When you reach the bottom rail, move diagonally up",
            "Continue this zigzag pattern until all letters are placed",
            "Read off each rail from top to bottom to get the ciphertext",
            "To decrypt, reverse the process"
        ],

        example: {
            title: "Example with 3 rails",
            plaintext: "HELLO WORLD",
            process: "H...O...R...\n.E.L.W.L...\n..L...O...D",
            ciphertext: "HOREL OLLWD"
        },

        strengths: [
            "Simple to understand and implement",
            "Fast encryption and decryption",
            "No key distribution needed (just the rail count)",
            "Good for teaching transposition concepts"
        ],

        weaknesses: [
            "Weak security - easily broken",
            "Limited keyspace (only number of rails)",
            "Vulnerable to pattern analysis",
            "Not suitable for real-world security"
        ]
    },

    monoalphabetic: {
        name: "Monoalphabetic Cipher",
        videoUrl: "https://www.youtube.com/embed/2WRIVxOJYhM",
        description: "A Monoalphabetic Cipher is a substitution cipher where each letter in the plaintext is replaced with exactly one corresponding letter from a shuffled alphabet.",

        howItWorks: [
            "Create a random mapping of the alphabet (26! possibilities)",
            "Each letter maps to exactly one other letter",
            "Replace each plaintext letter with its mapped letter",
            "The mapping remains constant throughout the message",
            "To decrypt, use the reverse mapping",
            "The key is the entire 26-letter substitution alphabet"
        ],

        example: {
            title: "Example with random key",
            plaintext: "HELLO",
            key: "QWERTYUIOPASDFGHJKLZXCVBNM",
            process: "H→I, E→T, L→S, O→K",
            ciphertext: "ITSSK"
        },

        strengths: [
            "Large keyspace (26! ≈ 4×10²⁶ possibilities)",
            "Simple to implement",
            "Fast encryption and decryption",
            "One-to-one letter mapping"
        ],

        weaknesses: [
            "Vulnerable to frequency analysis",
            "Letter patterns are preserved",
            "Can be broken with sufficient ciphertext",
            "Not secure by modern standards"
        ]
    },

    polyalphabetic: {
        name: "Polyalphabetic Cipher (Vigenère)",
        videoUrl: "https://www.youtube.com/embed/LaWp_Kq0cKs",
        description: "The Vigenère Cipher uses multiple Caesar ciphers based on a repeating keyword. Each letter of the keyword determines a different shift value, making it more secure than simple substitution.",

        howItWorks: [
            "Choose a keyword (e.g., 'KEY')",
            "Repeat the keyword to match the plaintext length",
            "For each letter, use the keyword letter to determine shift",
            "K=10, E=4, Y=24 (A=0, B=1, ... Z=25)",
            "Shift each plaintext letter by the corresponding keyword value",
            "Wrap around the alphabet if necessary",
            "To decrypt, shift backwards by the keyword values"
        ],

        example: {
            title: "Example with keyword 'KEY'",
            plaintext: "HELLO",
            key: "KEYKE",
            process: "H+K=R, E+E=I, L+Y=J, L+K=V, O+E=S",
            ciphertext: "RIJVS"
        },

        strengths: [
            "More secure than monoalphabetic ciphers",
            "Resistant to simple frequency analysis",
            "Multiple shift values hide patterns",
            "Historically considered unbreakable ('le chiffre indéchiffrable')"
        ],

        weaknesses: [
            "Vulnerable to Kasiski examination",
            "Can be broken if keyword length is known",
            "Repeating keyword creates patterns",
            "Not secure against modern cryptanalysis"
        ]
    },

    hill: {
        name: "Hill Cipher",
        videoUrl: "https://www.youtube.com/embed/kfmNeskzs2o",
        description: "The Hill Cipher uses linear algebra and matrix multiplication to encrypt blocks of letters. It's based on matrix transformations in modular arithmetic (mod 26).",

        howItWorks: [
            "Choose a 2×2 invertible matrix as the key",
            "Convert plaintext letters to numbers (A=0, B=1, ... Z=25)",
            "Group letters into pairs (blocks of 2)",
            "Represent each pair as a column vector",
            "Multiply the key matrix by the plaintext vector",
            "Take the result modulo 26",
            "Convert numbers back to letters for ciphertext",
            "To decrypt, multiply by the inverse matrix (mod 26)"
        ],

        example: {
            title: "Example with 2×2 matrix [[3,3],[2,5]]",
            plaintext: "HELP",
            matrix: "[[3,3],[2,5]]",
            process: "Matrix multiplication mod 26",
            ciphertext: "ZEBT"
        },

        strengths: [
            "Based on mathematical principles (linear algebra)",
            "Encrypts blocks of letters, hiding patterns",
            "Resistant to frequency analysis",
            "Diffusion - each ciphertext letter depends on multiple plaintext letters"
        ],

        weaknesses: [
            "Vulnerable to known-plaintext attacks",
            "Key matrix must be invertible (mod 26)",
            "Complex to implement correctly",
            "Not secure by modern standards"
        ]
    },

    otp: {
        name: "One-Time Pad (OTP)",
        videoUrl: "https://www.youtube.com/embed/FlIG3TvQCBQ",
        description: "The One-Time Pad is the only theoretically unbreakable encryption method when used correctly. It uses a random key that is as long as the message and is never reused.",

        howItWorks: [
            "Generate a truly random key of the same length as the message",
            "Convert each character to its numeric value (ASCII code)",
            "XOR (exclusive OR) each message character with the corresponding key character",
            "The result is the encrypted text",
            "To decrypt, XOR the ciphertext with the same key",
            "CRITICAL: The key must never be reused"
        ],

        example: {
            title: "Example with XOR operation",
            plaintext: "HI (72, 73 in ASCII)",
            key: "XY (88, 89 in ASCII)",
            process: "72⊕88=24, 73⊕89=16",
            ciphertext: "Characters with codes 24, 16"
        },

        strengths: [
            "Theoretically unbreakable if used correctly",
            "Provides perfect secrecy",
            "No mathematical weakness",
            "Immune to frequency analysis"
        ],

        weaknesses: [
            "Key must be truly random (hard to generate)",
            "Key must be as long as the message",
            "Key must never be reused (hence 'one-time')",
            "Key distribution is extremely difficult",
            "Impractical for most real-world applications"
        ]
    },

    caesar: {
        name: "Caesar Cipher",
        videoUrl: "https://www.youtube.com/embed/sMOZf4GN3oc",
        description: "The Caesar Cipher is one of the simplest and oldest encryption techniques. It's a type of substitution cipher where each letter in the plaintext is shifted a certain number of positions down or up the alphabet.",

        howItWorks: [
            "Choose a shift value (key) between 1-25",
            "For each letter in the text, shift it forward by the key positions",
            "Wrap around if you reach the end of the alphabet (Z → A)",
            "Non-alphabetic characters remain unchanged",
            "To decrypt, shift backwards by the same amount"
        ],

        example: {
            title: "Example with shift key = 3",
            plaintext: "HELLO",
            process: "H→K, E→H, L→O, L→O, O→R",
            ciphertext: "KHOOR"
        },

        strengths: [
            "Very simple to understand and implement",
            "Fast encryption and decryption",
            "Good for learning basic cryptography concepts"
        ],

        weaknesses: [
            "Extremely weak - only 25 possible keys",
            "Vulnerable to brute force attacks",
            "Easily broken with frequency analysis",
            "Not suitable for real-world security"
        ]
    },

    rowcolumn: {
        name: "Row Column Transposition",
        videoUrl: "https://www.youtube.com/embed/srlpq49LhYo",
        description: "Row Column Transposition is a cipher that rearranges the plaintext by writing it into a grid row by row, then reading it out column by column in a specific order determined by a keyword.",

        howItWorks: [
            "Choose a keyword (e.g., 'ZEBRA')",
            "Write the plaintext in rows under the keyword",
            "Number the columns based on alphabetical order of keyword letters",
            "Read out the columns in numerical order",
            "The rearranged text is the ciphertext",
            "To decrypt, reverse the process using the same keyword"
        ],

        example: {
            title: "Example with keyword 'ZEBRA'",
            plaintext: "HELLO WORLD",
            key: "ZEBRA → 52314",
            process: "Write in rows, read columns in order 1,2,3,4,5",
            ciphertext: "LOEHLWRDLO"
        },

        strengths: [
            "Simple transposition technique",
            "Rearranges letter positions effectively",
            "Can be combined with other ciphers",
            "Variable key length provides flexibility"
        ],

        weaknesses: [
            "Vulnerable to anagramming attacks",
            "Letter frequencies remain unchanged",
            "Can be broken with pattern analysis",
            "Not secure by modern standards"
        ]
    }
};

// Function to display explanation
function displayExplanation(algorithm) {
    const explanation = algorithmExplanations[algorithm];
    const section = document.getElementById('explanationSection');

    section.innerHTML = `
        <h2>📘 ${explanation.name}</h2>
        <p>${explanation.description}</p>
        
        <h3>How It Works</h3>
        <ul>
            ${explanation.howItWorks.map(step => `<li>${step}</li>`).join('')}
        </ul>
        
        <h3>Visual Example</h3>
        <div class="example-box">
            <strong>${explanation.example.title}</strong><br><br>
            ${explanation.example.matrix ? `<strong>Matrix:</strong><br>${explanation.example.matrix.replace(/\\n/g, '<br>')}<br><br>` : ''}
            ${explanation.example.key ? `<strong>Key:</strong> ${explanation.example.key}<br>` : ''}
            <strong>Plaintext:</strong> ${explanation.example.plaintext}<br>
            <strong>Process:</strong> ${explanation.example.process}<br>
            <strong>Ciphertext:</strong> ${explanation.example.ciphertext}
        </div>
        
        <h3>Strengths & Weaknesses</h3>
        <div class="strengths-weaknesses">
            <div>
                <h4 style="color: var(--success); margin-bottom: 0.5rem;">✅ Strengths</h4>
                ${explanation.strengths.map(s => `<div class="strength-item">${s}</div>`).join('')}
            </div>
            <div>
                <h4 style="color: var(--error); margin-bottom: 0.5rem;">⚠️ Weaknesses</h4>
                ${explanation.weaknesses.map(w => `<div class="weakness-item">${w}</div>`).join('')}
            </div>
        </div>
    `;

    section.classList.remove('hidden');
}
