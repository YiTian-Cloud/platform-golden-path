const express = require('express');

const app = express();
app.use(express.json());

const SERVICE_NAME = process.env.SERVICE_NAME || '{{SERVICE_NAME}}';

// health endpoint (golden path requirement)
app.get('/healthz', (req, res) => {
  res.json({ status: 'ok', service: SERVICE_NAME });
});

// sample domain endpoint
app.get('/{{SERVICE_NAME}}/example', (req, res) => {
  res.json({
    service: SERVICE_NAME,
    message: 'Hello from the golden-path scaffolded service!',
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`${SERVICE_NAME} listening on port ${port}`);
});
