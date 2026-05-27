import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const CSV_PATH = join(process.cwd(), 'places.csv');
const HEADERS = ['name', 'why_and_how_it_will_work', 'id', 'additional_info', 'latitude', 'longitude'];

const escape = (val) => {
  if (val === undefined || val === null) return '';
  const str = String(val);
  return str.includes(',') || str.includes('"') || str.includes('\n')
    ? `"${str.replace(/"/g, '""')}"`
    : str;
};

const parseLine = (line) => {
  const values = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  values.push(current);
  return values;
};

export const readAll = () => {
  const raw = readFileSync(CSV_PATH, 'utf-8');
  const rows = [];
  let current = '';
  let inQuotes = false;

  // Split into logical rows respecting quoted newlines
  const lines = [];
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (ch === '"') {
      if (inQuotes && raw[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
      current += ch;
    } else if (ch === '\n' && !inQuotes) {
      if (current.trim()) lines.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim()) lines.push(current);

  return lines.slice(1).map(line => {
    const vals = parseLine(line);
    return Object.fromEntries(HEADERS.map((h, i) => [h, vals[i] ?? '']));
  });
};

export const writeAll = (rows) => {
  const lines = [HEADERS.join(','), ...rows.map(r => HEADERS.map(h => escape(r[h])).join(','))];
  writeFileSync(CSV_PATH, lines.join('\n') + '\n', 'utf-8');
};
