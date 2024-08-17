// app.js

const apm = require('elastic-apm-node').start({
    serviceName: 'nodejs-web-app',
    serverUrl: process.env.ELASTIC_APM_SERVER_URL,
    secretToken: process.env.ELASTIC_APM_SECRET_TOKEN,
    verifyServerCert: process.env.ELASTIC_APM_VERIFY_SERVER_CERT === 'false',
    transactionSampleRate: 1,
  });
    
const express = require('express');
const app = express();

app.get('/data', (req, res) => {
    // Start a parent span for the entire /data processing
    const transaction = apm.startTransaction('Data Endpoint Transaction', 'request');
  
    // Span for data fetching
    const fetchDataSpan = apm.startSpan('Fetching Data');
    setTimeout(() => {
      if (fetchDataSpan) fetchDataSpan.end(); // End the fetch data span
  
      // Span for data processing
      const processDataSpan = apm.startSpan('Processing Data');
      setTimeout(() => {
        if (processDataSpan) processDataSpan.end(); // End the process data span
  
        // Span for preparing the response
        const prepareResponseSpan = apm.startSpan('Preparing Response');
        if (prepareResponseSpan) prepareResponseSpan.end(); // End the prepare response span
  
        // Send the response
        res.send({ message: 'Data processed and response prepared successfully!' });
  
        // End the transaction when the entire process is done
        if (transaction) transaction.end();
      }, 200); // Simulate data processing time
  
    }, 100); // Simulate data fetching time
  });

app.get('/', (req, res) => {
  res.send({ message: 'Welcome to the Node.js web app!' });
});

app.get("/error", (req, res) => {
  res.send({ message: 'This is test error' });
});
  
function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  function cpuIntensiveTaskWithRandomness() {
    let sum = 0;
    for (let i = 0; i < 1e8; i++) {
      // Generate a random number between 1 and 100
      let randomValue = generateRandomNumber(1, 100);
      sum += randomValue;
    }
    return sum;
  }

app.get("/cpu", (req, res) => {
  const result = cpuIntensiveTaskWithRandomness();
  res.send(`Result of CPU-intensive task: ${result}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
