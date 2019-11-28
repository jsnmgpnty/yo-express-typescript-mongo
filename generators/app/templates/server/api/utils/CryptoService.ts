import * as crypto from 'crypto';

class CryptoService {
  public static instance: CryptoService;
  public static init(secret: string): CryptoService {
    if (!this.instance) {
      this.instance = new CryptoService(secret);
    }

    return this.instance;
  }

  private secret: string;
  private algorithm = 'aes-256-cbc';
  private IV_LENGTH = 16;

  constructor(secret: string) {
    this.secret = secret;
  }

  public encrypt(text: string): string {
    const iv = crypto.randomBytes(this.IV_LENGTH);
    const cipher = crypto.createCipheriv(
      this.algorithm,
      Buffer.from(this.secret),
      iv
    );
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  public decrypt(text: string): string {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift() || '', 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      Buffer.from(this.secret),
      iv
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
}

export { CryptoService };
