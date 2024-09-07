const Pino = require('pino');
const logger = Pino();

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
    payload: req.payload, // Data sent with the request (if any)
  };
  log(['INFO', 'Request Info'], { requestInfo });

  log(['INFO', 'Response Info'], { responseHeaders: h.response().headers, status, statusMessage, timeTaken});

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

module.exports = {
  log,
  responseSuccess,
  errorResponse,
  getDefaultHeaders
};
