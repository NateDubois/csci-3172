const express = require('express');
const logger = require('./middleware/logger');
const itemsRouter = require('./routes/items');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(logger);          // before express.json() so malformed requests get logged too
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Marine Mammal Rescue API is running', resource: '/api/items' });
});

app.use('/api/items', itemsRouter);

// route to prove the 500 handler works
app.get('/api/crash', () => {
  throw new Error('Deliberate test crash');
});

app.use(notFound);        // after all routes
app.use(errorHandler);    // always last

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});