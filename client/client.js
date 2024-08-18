const apm = require('elastic-apm-node').start({
  serviceName: 'nodejs-client',
  serverUrl: process.env.ELASTIC_APM_SERVER_URL,
  secretToken: process.env.ELASTIC_APM_SECRET_TOKEN,
  verifyServerCert: process.env.ELASTIC_APM_VERIFY_SERVER_CERT === 'false',
  transactionSampleRate: 1,
});

const axios = require('axios');
const winston = require('winston');
const ecsFormat = require('@elastic/ecs-winston-format');

// Configure Winston logger with ECS format and APM context
const logger = winston.createLogger({
  level: 'info',
  format: ecsFormat({ apm }),
  transports: [
    new winston.transports.Console()
  ]
});

// Define only valid endpoints
const endpoints = [
  'http://web-app:3000/data',
  'http://web-app:3000/',
  'http://web-app:3000/cpu',
  'http://web-app:3000/error',
  'http://web-app:3000/doesntexist',
];

// Function to select a random endpoint
function getRandomEndpoint() {
  const randomIndex = Math.floor(Math.random() * endpoints.length);
  return endpoints[randomIndex];
}

function getRandomInterval() {
  return Math.floor(Math.random() * 5000) + 1000;
}

async function makeRequest() {
  // Start a transaction for this request
  const transaction = apm.startTransaction('HTTP Request to Web App', 'request');

  const endpoint = getRandomEndpoint();
  const url = `${endpoint}`;

  logger.info(`Making request to: ${url}`); // Log the URL being requested

  try {
    // Start a span for sending the request
    const sendRequestSpan = apm.startSpan('Sending HTTP Request');
    const response = await axios.get(url);
    if (sendRequestSpan) sendRequestSpan.end(); // End the span once the request is sent

    // Start a span for processing the response
    const processResponseSpan = apm.startSpan('Processing Response');
    logger.info(`Response from ${url}:`, response.data);
    if (processResponseSpan) processResponseSpan.end(); // End the span once the response is processed

  } catch (error) {
    apm.captureError(error); // Capture any errors in the transaction
    logger.error(`Error with request to ${url}:`, error.message);
  } finally {
    // End the transaction once everything is done
    if (transaction) transaction.end();
  }

  // Schedule the next request
  setTimeout(makeRequest, getRandomInterval());
}

// Start the request loop
makeRequest();
