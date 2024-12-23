import { box, randomBytes } from 'tweetnacl';
import { encodeBase64, decodeBase64 } from 'tweetnacl-util';

export class CryptoService {
  static generateKeyPair() {
    const keyPair = box.keyPair();
    return {
      publicKey: encodeBase64(keyPair.publicKey),
      privateKey: encodeBase64(keyPair.secretKey)
    };
  }

  static async encryptMessage(message: string, recipientPublicKey: string, senderPrivateKey: string) {
    const ephemeralKeyPair = box.keyPair();
    const nonce = randomBytes(box.nonceLength);
    
    const encryptedMessage = box(
      new TextEncoder().encode(message),
      nonce,
      decodeBase64(recipientPublicKey),
      decodeBase64(senderPrivateKey)
    );

    return {
      encrypted: encodeBase64(encryptedMessage),
      nonce: encodeBase64(nonce)
    };
  }

  static async decryptMessage(
    encryptedMessage: string,
    nonce: string,
    senderPublicKey: string,
    recipientPrivateKey: string
  ) {
    const decrypted = box.open(
      decodeBase64(encryptedMessage),
      decodeBase64(nonce),
      decodeBase64(senderPublicKey),
      decodeBase64(recipientPrivateKey)
    );

    if (!decrypted) {
      throw new Error('Failed to decrypt message');
    }

    return new TextDecoder().decode(decrypted);
  }
}