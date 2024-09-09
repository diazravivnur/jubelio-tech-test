const Pino = require('pino');
const logger = Pino();
const CryptoJS = require('crypto-js');
const Crypto = require('crypto');
const cryptoSecret = process.env.CRYPTO_SECRET || '0e6d6ef5732acbb254a7126914edd05e0238f3e1d4450f70361be41';
const algorithm = 'aes-256-cbc';
const key = Crypto.createHash('sha256').update(cryptoSecret).digest('base64').substr(0, 32); // Fixed key

const log = (tags, data) => {
  const logs = { tags };
  if (data) {
    Object.assign(logs, { data });
  }

  logger.info(logs);
};

const responseSuccess = (h, req, status, statusMessage, timeStart, data) => {
  const timeDiff = process.hrtime(timeStart);
  const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);
  const requestInfo = {
    method: req.method.toUpperCase(),
    url: req.url.href,
    headers: req.headers,
    payload: req.payload // Data sent with the request (if any)
  };
  log(['INFO', 'Request Info'], { requestInfo });

  log(['INFO', 'Response Info'], { responseHeaders: h.response().headers, status, statusMessage, timeTaken });

  return h
    .response({
      status: statusMessage,
      data
    })
    .code(status);
};

const errorResponse = (h, status = 500, statusMessage = 'Internal Server Error', message = 'Something Went Wrong') => {
  return h
    .response({
      status,
      message,
      statusMessage
    })
    .code(status);
};

const getDefaultHeaders = (dataObject) => ({
  Authorization:
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NGQzYzI1ZDE4MDEyMTZjNTE3YTcxNSIsInVzZXJOYW1lIjoiQWxlbmVfRnJpZXNlbjE0IiwiaWF0IjoxNzE2MzM3NzAxLCJleHAiOjE3MTYzNDEzMDF9.m18XgVpl_0P9eE6IAHFmWyQsqH-EU8_PyrvVcCbRBpU'
});

const encryptId = (data) => {
  try {
    const iv = Crypto.randomBytes(16);
    const cipher = Crypto.createCipheriv(algorithm, key, iv);
    const idString = data.toString();
    let encrypted = cipher.update(idString, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  } catch (error) {
    Promise.reject(error);
  }
};

const decryptObjectPayload = (token) => {
  try {
    const bytes = CryptoJS.AES.decrypt(token, cryptoSecret);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    return null;
  }
};

const decryptId = (encryptedData) => {
  try {
    // Split the encrypted data to extract IV and encrypted part
    const [ivHex, encryptedHex] = encryptedData.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encrypted = Buffer.from(encryptedHex, 'hex');

    // Create decipher using the same algorithm and key
    const decipher = Crypto.createDecipheriv(algorithm, key, iv);

    // Decrypt the data
    let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');

    // Convert the decrypted string back to an integer
    return parseInt(decrypted, 10);
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = {
  log,
  responseSuccess,
  errorResponse,
  getDefaultHeaders,
  decryptObjectPayload,
  decryptId,
  encryptId
};
