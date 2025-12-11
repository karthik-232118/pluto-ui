import  { useEffect, useState } from 'react';

const SampleOne = () => {
  const [formattedKey, setFormattedKey] = useState('');
  const [encryptedMessage, setEncryptedMessage] = useState('');
  const [decryptedMessage, setDecryptedMessage] = useState('');
  

  useEffect(() => {
    // Array to store previously generated keys
    const generatedKeys = new Set();

    // Function to generate a unique key like 27X2X-6SAEF-KTCCK-BW7TQ-XMNZF
    function generateUniqueFormattedKey(blocks = 5, blockSize = 5) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let uniqueKey = '';
      let isUnique = false;

      while (!isUnique) {
        let key = '';
        for (let i = 0; i < blocks; i++) {
          let block = '';
          for (let j = 0; j < blockSize; j++) {
            block += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          key += block + (i < blocks - 1 ? '-' : '');
        }

        // Check if key is unique
        if (!generatedKeys.has(key)) {
          uniqueKey = key;
          generatedKeys.add(key); // Store the generated key
          isUnique = true;
        }
      }

      return uniqueKey;
    }

    // Function to encrypt a message using Web Crypto API (AES-GCM)
    async function encryptMessage(message) {
      const encoder = new TextEncoder();
      const key = await window.crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );

      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encodedMessage = encoder.encode(message);
      const encrypted = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        encodedMessage
      );

      return { encryptedData: encrypted, key, iv };
    }

    // Function to decrypt a message using Web Crypto API (AES-GCM)
    async function decryptMessage(encryptedData, key, iv) {
      const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        encryptedData
      );

      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    }

    // Generate the unique formatted key
    const uniqueKey = generateUniqueFormattedKey();
    setFormattedKey(uniqueKey);
    console.log('Unique Formatted Key:', uniqueKey);

    // Encrypt and decrypt a sample message
    const message = 'Hello, this is a secret message!';
    encryptMessage(message).then(({ encryptedData, key, iv }) => {
      const encryptedMessageStr = new Uint8Array(encryptedData).toString();
      setEncryptedMessage(encryptedMessageStr);
      console.log('Encrypted Message:', encryptedMessageStr);

      // Decrypt the message
      decryptMessage(encryptedData, key, iv).then((decrypted) => {
        setDecryptedMessage(decrypted);
        console.log('Decrypted Message:', decrypted);
      });
    });
  }, []);

  return (
    <div>
      <h1>Generated Key: {formattedKey}</h1>
      <h2>Encrypted Message: {encryptedMessage}</h2>
      <h2>Decrypted Message: {decryptedMessage}</h2>
    </div>
  );
};

export default SampleOne;
