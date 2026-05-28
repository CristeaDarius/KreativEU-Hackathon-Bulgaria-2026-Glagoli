import { Router } from 'express';
import { readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { readAll } from './csv.js';

const router = Router();

const DESCRIPTIONS_DIR = join(process.cwd(), 'descriptions');
if (!existsSync(DESCRIPTIONS_DIR)) mkdirSync(DESCRIPTIONS_DIR);

const readDescription = (id) => {
  const filePath = join(DESCRIPTIONS_DIR, `${id.toLowerCase()}.json`);
  if (!existsSync(filePath)) return {};
  try {
    return JSON.parse(readFileSync(filePath, 'utf-8'));
  } catch {
    return {};
  }
};

const serialize = (place) => ({
  ...place,
  latitude: place.latitude !== '' ? parseFloat(place.latitude) : null,
  longitude: place.longitude !== '' ? parseFloat(place.longitude) : null,
});

// Get all places
router.get('/places', (req, res) => {
  const places = readAll();
  res.json(places.map(p => ({ id: p.id, name: p.name })));
});

// Get one place
router.get('/places/:id', (req, res) => {
  const place = readAll().find(p => p.id.toLowerCase() === req.params.id.toLowerCase());
  if (!place) return res.status(404).json({ error: 'Not found' });
  res.json(serialize({ ...place, description: readDescription(place.id) }));
});

// Hidden Svishtov
router.get('/hidden-svishtov', (req, res) => {
  const hiddenSvishtov = JSON.parse(
    readFileSync(join(DESCRIPTIONS_DIR, 'hidden_svishtov.json'), 'utf-8')
  );

  if (!Array.isArray(hiddenSvishtov) || hiddenSvishtov.length === 0) {
    return res.json({ text: '' });
  }

  const randomIndex = Math.floor(Math.random() * hiddenSvishtov.length);

  res.json({
    text: hiddenSvishtov[randomIndex],
  });
});

export default router;
