import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.status(200).send({ message: 'hello from accquisitons' });
});

export default app;
