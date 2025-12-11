import forge from "node-forge";

export async function encryptLoginDataWithSecret(payload, secretKey) {
  // Generate a random AES key (secret key)
  // const secretKey = forge.random.getBytesSync(16); // 128-bit AES key

  // Prepare the login data
  const data = JSON.stringify(payload);
  console.log("data", data);
  const encSecretKey = forge.util
    .createBuffer(secretKey.padEnd(16, " ").slice(0, 16))
    .getBytes();

  const iv = forge.random.getBytesSync(16);
  // Encrypt the login data with AES
  const cipher = forge.cipher.createCipher("AES-CBC", encSecretKey);
  cipher.start({ iv: iv }); // Random IV for AES encryption
  cipher.update(forge.util.createBuffer(data));
  cipher.finish();
  const encryptedPayload = cipher.output.getBytes();

  // Properly format the public RSA key with PEM headers and footers

  const publicKeyPem = `
  -----BEGIN PUBLIC KEY-----
  MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoijSkeGUZrR25kgwr8t5
  6QzecrtKg6dSyL3vWoF4ztmwQegrw8HPv2y0X3kTplAFUtaC2HuUch21ggC4E0Az
  Tkzmyju6hzpEv0rZHM/K8zdzSpglzKS/MhNxtwmx7zVwPPRWhIJJ3GWiJGVz2h27
  Ayl+Tg2d9tgod6ZKcFpbdpU/T4S+NZQ7lLHi9Jg9lplF3a9Wf7N03wrITB/EKhke
  n9KGhqCobfqVcpLMSol4kCwjBCiOzndVFf6JHnsWdtBZG9VCdWp8SppFSxm4cDSK
  6D0Fwzh4uB/kBsjzD5YQM68q2Jb0klguqf9KEJlJlgDOqKKBingM7M8Ie8O3GKRN
  NwIDAQAB
  -----END PUBLIC KEY-----
    `.trim();

  // Parse the public key
  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);

  // Encrypt the AES secret key with RSA
  const encryptedSecretKey = publicKey.encrypt(secretKey, "RSA-OAEP");

  // Encode the encrypted payload and secret key as base64 for safe transmission
  return {
    encryptedPayload: forge.util.encode64(encryptedPayload),
    encryptedSecretKey: forge.util.encode64(encryptedSecretKey),
    iv: iv,
  };
}
