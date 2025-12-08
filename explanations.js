// ============================================
// Algorithm Explanations Data
// ============================================

const algorithmExplanations = {
    caesar: {
        name: "Caesar Cipher",
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
    
    otp: {
        name: "One-Time Pad (OTP)",
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
    
    playfair: {
        name: "Playfair Cipher",
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
            matrix: "M O N A R\nC H Y B D\nE F G I/J K\nL P Q S T\nU V W X Z",
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
            ${explanation.example.matrix ? `<strong>Matrix:</strong><br>${explanation.example.matrix.replace(/\n/g, '<br>')}<br><br>` : ''}
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
