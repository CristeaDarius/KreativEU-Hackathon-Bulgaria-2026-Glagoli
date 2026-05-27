import { Router } from 'express';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { readAll, writeAll } from './csv.js';

const router = Router();

const DESCRIPTIONS_DIR = join(process.cwd(), 'descriptions');
if (!existsSync(DESCRIPTIONS_DIR)) mkdirSync(DESCRIPTIONS_DIR);

const readDescription = (id) => {
  const filePath = join(DESCRIPTIONS_DIR, `${id.toLowerCase()}.txt`);
  return existsSync(filePath) ? readFileSync(filePath, 'utf-8') : '';
};

const writeDescription = (id, text) => {
  writeFileSync(join(DESCRIPTIONS_DIR, `${id.toLowerCase()}.txt`), text, 'utf-8');
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

export default router;
