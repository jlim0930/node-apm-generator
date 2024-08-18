const apm = require('elastic-apm-node').start({
  serviceName: 'nodejs-web-app',
  serverUrl: process.env.ELASTIC_APM_SERVER_URL,
  secretToken: process.env.ELASTIC_APM_SECRET_TOKEN,
  verifyServerCert: process.env.ELASTIC_APM_VERIFY_SERVER_CERT === 'false',
  transactionSampleRate: 1,
});

const express = require('express');
const winston = require('winston');
const ecsFormat = require('@elastic/ecs-winston-format');

const app = express();

// Configure Winston logger with ECS format and APM context
const logger = winston.createLogger({
  level: 'info',
  format: ecsFormat({ apm }),
  transports: [
    new winston.transports.Console()
  ]
});

// Middleware to log each request
app.use((req, res, next) => {
  const { method, url, headers } = req;
  logger.info(`Incoming request: ${method} ${url}`, {
    method,
    url,
    headers,
    userAgent: headers['user-agent'],
    clientIp: req.ip,
  });
  next();
});

app.get('/data', (req, res) => {
  const transaction = apm.startTransaction('/data', 'request');

  const fetchDataSpan = apm.startSpan('Fetching Data');
  setTimeout(() => {
    if (fetchDataSpan) fetchDataSpan.end();

    const processDataSpan = apm.startSpan('Processing Data');
    setTimeout(() => {
      if (processDataSpan) processDataSpan.end();

      const prepareResponseSpan = apm.startSpan('Preparing Response');
      if (prepareResponseSpan) prepareResponseSpan.end();

      logger.info('request to /data')
      res.send({ message: 'Data processed and response prepared successfully!' });

      if (transaction) transaction.end();
    }, 200);
  }, 100);
});

app.get('/', (req, res) => {
  logger.info('request to /'),
  res.send({ message: 'Welcome to the Node.js web app!' });
});

app.get("/error", (req, res) => {
  logger.error('This is a test error log');
  res.send({ message: 'This is test error' });
});

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function cpuIntensiveTaskWithRandomness() {
  let sum = 0;
  for (let i = 0; i < 1e8; i++) {
    let randomValue = generateRandomNumber(1, 100);
    sum += randomValue;
  }
  return sum;
}

app.get("/cpu", (req, res) => {
  const result = cpuIntensiveTaskWithRandomness();
  logger.info(`CPU-intensive task completed with result: ${result}`);
  res.send(`Result of CPU-intensive task: ${result}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
