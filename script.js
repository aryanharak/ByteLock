 let selectedFile = null;
        let currentMode = 'encrypt';

      
        function switchTab(mode) {
            currentMode = mode;
            document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
            event.target.classList.add('active');
            
            const btnText = document.getElementById('btnText');
            btnText.textContent = mode === 'encrypt' ? ' Encrypt File' : ' Decrypt File';
            
            hideAlert();
        }

     
        function togglePassword() {
            const passwordInput = document.getElementById('password');
            passwordInput.type = document.getElementById('showPassword').checked ? 'text' : 'password';
        }


        document.getElementById('fileInput').addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                handleFile(e.target.files[0]);
            }
        });

        
        const uploadArea = document.getElementById('uploadArea');
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            if (e.dataTransfer.files.length > 0) {
                handleFile(e.dataTransfer.files[0]);
            }
        });

        function handleFile(file) {
            selectedFile = file;
            
            document.getElementById('fileName').textContent = '📄 ' + file.name;
            document.getElementById('fileSize').textContent = formatFileSize(file.size);
            document.getElementById('fileInfo').classList.add('show');
            document.getElementById('actionBtn').disabled = false;
            
            hideAlert();
        }

        function formatFileSize(bytes) {
            if (bytes < 1024) return bytes + ' B';
            if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
            return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
        }


        function generateKey(password) {
            const key = new Uint8Array(256);
            const passLen = password.length;
            for (let i = 0; i < 256; i++) {
                key[i] = password.charCodeAt(i % passLen) ^ (i * 7 + 13);
                key[i] = (key[i] * 31 + 17) % 256;
            }
            return key;
        }

        function xorCrypt(data, key) {
            const result = new Uint8Array(data.length);
            const keyLen = key.length;
            for (let i = 0; i < data.length; i++) {
                result[i] = data[i] ^ key[i % keyLen];
            }
            return result;
        }

        async function processFile() {
            const password = document.getElementById('password').value;
            
            if (!password) {
                showAlert('Please enter a password!', 'error');
                return;
            }

            if (password.length < 6) {
                showAlert('Password should be at least 6 characters!', 'error');
                return;
            }

            if (!selectedFile) {
                showAlert('Please select a file first!', 'error');
                return;
            }

            try {
                const key = generateKey(password);
                const fileData = await selectedFile.arrayBuffer();
                const data = new Uint8Array(fileData);

                let result;
                let filename;

                if (currentMode === 'encrypt') {

                    const salt = new Uint8Array(16);
                    crypto.getRandomValues(salt);
                    
    
                    const mixedKey = new Uint8Array(key);
                    for (let i = 0; i < mixedKey.length; i++) {
                        mixedKey[i] ^= salt[i % 16];
                    }
                    
         
                    const encrypted = xorCrypt(data, mixedKey);
                    
                
                    result = new Uint8Array(16 + encrypted.length);
                    result.set(salt, 0);
                    result.set(encrypted, 16);
                    
                    filename = selectedFile.name + '.encrypted';
                } else {
                   
                    if (data.length < 16) {
                        showAlert('Invalid encrypted file!', 'error');
                        return;
                    }

                    const salt = data.slice(0, 16);
                    const encryptedData = data.slice(16);
                    

                    const mixedKey = new Uint8Array(key);
                    for (let i = 0; i < mixedKey.length; i++) {
                        mixedKey[i] ^= salt[i % 16];
                    }
                    
                
                    result = xorCrypt(encryptedData, mixedKey);
                    
                    filename = selectedFile.name.replace('.encrypted', '');
                    if (filename === selectedFile.name) {
                        filename = selectedFile.name + '.decrypted';
                    }
                }

      
                const blob = new Blob([result]);
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
                URL.revokeObjectURL(url);

                const action = currentMode === 'encrypt' ? 'encrypted' : 'decrypted';
                showAlert(`✅ File ${action} successfully! Downloading as: ${filename}`, 'success');
                
            } catch (error) {
                showAlert('Error processing file: ' + error.message, 'error');
            }
        }

        function showAlert(message, type) {
            const alert = document.getElementById('alert');
            alert.textContent = message;
            alert.className = 'alert show ' + type;
        }

        function hideAlert() {
            document.getElementById('alert').classList.remove('show');

        }
