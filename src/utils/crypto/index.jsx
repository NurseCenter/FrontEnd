import CryptoJS from 'crypto-js';
import createTransform from 'redux-persist/es/createTransform';

const CRYPTO_JS_KEY = import.meta.env.VITE_CRYPTO_JS_KEY;

const generateSalt = () => {
  return CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
};

export const encryptData = (data) => {
  try {
    const salt = generateSalt();
    const iv = generateSalt();

    const iterations = 10000;

    const key512Bits10000Iterations = CryptoJS.PBKDF2(
      CRYPTO_JS_KEY,
      CryptoJS.enc.Hex.parse(salt),
      {
        keySize: 512 / 32,
        iterations,
      }
    );

    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      key512Bits10000Iterations,
      {
        iv: CryptoJS.enc.Hex.parse(iv),
      }
    );
    const combinedData = `${salt}:${iv}:${encrypted.toString()}`;

    return combinedData;
  } catch (error) {
    throw new Error('알 수 없는 에러가 발생하였습니다.');
  }
};

export const decryptData = (combinedData) => {
  try {
    const [salt, iv, encryptedData] = combinedData.split(':');

    const key512Bits10000Iterations = CryptoJS.PBKDF2(
      CRYPTO_JS_KEY,
      CryptoJS.enc.Hex.parse(salt),
      {
        keySize: 512 / 32,
        iterations: 10000,
      }
    );

    const bytes = CryptoJS.AES.decrypt(
      encryptedData,
      key512Bits10000Iterations,
      {
        iv: CryptoJS.enc.Hex.parse(iv),
      }
    );

    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (!decrypted) {
      throw new Error('알 수 없는 에러가 발생하였습니다.');
    }

    return JSON.parse(decrypted);
  } catch (error) {
    throw new Error('알 수 없는 에러가 발생하였습니다.');
  }
};

export const encryptTransform = createTransform(
  (inboundState) => {
    return encryptData(inboundState);
  },
  (outboundState) => {
    return decryptData(outboundState);
  }
);
