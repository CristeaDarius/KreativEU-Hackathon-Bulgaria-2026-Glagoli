import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import placesRouter from './routes.js';
import ttsRouter from './tts.js';

const app = express();
const PORT = process.env.SERVER_PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/api', placesRouter);
app.use('/api', ttsRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
