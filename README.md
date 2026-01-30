# ByteLock

ByteLock is a small, browser‑based file locker that lets you encrypt and decrypt any file using a password.  
Everything happens locally in your browser – no uploads, no backend, no tracking.
A College Project.

## Features

- 🔐 AES‑256‑GCM encryption (via the Web Crypto API)
- 📁 Works with any file type (documents, images, videos, archives, etc.)
- 🖱️ Simple drag‑and‑drop or click‑to‑select flow
- 🔁 Encrypt / decrypt modes in a single page
- 🧠 Password‑based key derivation (PBKDF2 with salt)
- 🌐 100% client‑side, can be used offline once loaded

## Demo

Open `main.html` in a modern browser (Chrome, Edge, Firefox, etc.) and you’re good to go.

You can also host it on any static hosting (GitHub Pages, Netlify, Vercel, etc.) by serving the three files:

- `main.html`
- `style.css`
- `script.js`

## How it works

1. You choose a file (or drop it on the upload area).
2. You enter a password.
3. ByteLock derives an encryption key from the password using PBKDF2 and a random salt.
4. The file bytes are encrypted/decrypted with AES‑GCM in the browser.
5. You download the resulting file:
   - Encryption: original name + `.enc`
   - Decryption: original name without `.enc` (or `.decrypted` fallback)

At no point is the file or password sent to a server.

## Usage

1. Open the app in your browser.
2. Pick **Encrypt** or **Decrypt**.
3. Drop a file or click the box to select one.
4. Enter a password (and remember it).
5. Click the main button:
   - In **Encrypt** mode: you get a `.enc` file.
   - In **Decrypt** mode: you get the original file back (if the password is correct).

## Requirements

- Modern browser with support for:
  - Web Crypto API (`window.crypto.subtle`)
  - `Uint8Array` / `ArrayBuffer`
- No external dependencies or build steps

## Security notes

- If you forget the password, there is no recovery.
- For serious use, pick a strong, unique password.
- This is a client‑side tool; it does **not** replace professional key management or audited security systems.

## Development

The project is intentionally lightweight:

- Plain HTML/CSS/JavaScript
- No frameworks
- Easy to fork and modify

You can tweak:

- UI styles in `style.css`
- Text and layout in `main.html`
- Crypto and behavior in `script.js`
