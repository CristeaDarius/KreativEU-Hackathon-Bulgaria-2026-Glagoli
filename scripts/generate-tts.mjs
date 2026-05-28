import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

config({ path: join(ROOT, '.env') });

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = 'cgSgspJ2msm6clMCkdW9'; // Jessica
const LOCALES = ['en', 'ro', 'bg', 'sk', 'pl', 'cs'];
const OUTPUT_DIR = join(ROOT, 'public', 'audio', 'ui');

const KEYS = [
  // nav
  'nav.explore', 'nav.routes', 'nav.compendium', 'nav.concierge',
  // splash
  'splash.subtitle',
  // login
  'login.tagline', 'login.start', 'login.guest', 'login.terms',
  // build
  'build.label', 'build.title', 'build.description', 'build.back', 'build.next', 'build.generate',
  // route_map
  'route_map.title', 'route_map.current_stop', 'route_map.heritage_site',
  'route_map.audio_story', 'route_map.accessible_mode', 'route_map.next_stop',
  'route_map.prev_stop', 'route_map.open_stop', 'route_map.heritage_explorer',
  'route_map.mark_visited', 'route_map.visited', 'route_map.go_there',
  'route_map.end_route', 'route_map.route_ended', 'route_map.trip_summary',
  'route_map.in_route_ai', 'route_map.ask_stop', 'route_map.fallback_desc',
  // compendium
  'compendium.title', 'compendium.subtitle', 'compendium.route_memory',
  'compendium.level', 'compendium.saved', 'compendium.badges', 'compendium.audio',
  'compendium.heritage_site', 'compendium.open_story', 'compendium.empty',
  'compendium.discover_more', 'compendium.discover_more_desc',
  // concierge
  'concierge.welcome', 'concierge.no_places', 'concierge.current_story',
  // home
  'home.route_ready', 'home.no_route', 'home.plan_day', 'home.plan_another',
  'home.continue_route', 'home.city', 'home.time', 'home.visited',
  'home.not_set', 'home.choose', 'home.active_route', 'home.completed_route',
  'home.no_route_yet', 'home.your_stops', 'home.ready', 'home.map',
  'home.empty', 'home.heritage_stop',
  // settings
  'settings.label', 'settings.title', 'settings.description',
  'settings.accessible_title', 'settings.accessible_desc',
  'settings.audio_title', 'settings.audio_desc',
  'settings.language_title', 'settings.language_desc',
  // questionnaire
  'questionnaire.label', 'questionnaire.title', 'questionnaire.description',
  'questionnaire.skip', 'questionnaire.continue',
  // visit
  'visit.arrived', 'visit.heritage_desc', 'visit.non_heritage_desc',
  'visit.mark_visited', 'visit.marked_visited', 'visit.mark_no_save',
  'visit.back_route', 'visit.demo_camera', 'visit.take_picture',
  'visit.unlocked', 'visit.fallback_desc', 'visit.cancel', 'visit.save',
  'visit.saved', 'visit.non_heritage_visit',
  // not_found
  'not_found.title', 'not_found.description', 'not_found.back',
  // dashboard
  'dashboard.label', 'dashboard.title', 'dashboard.description',
  'dashboard.stops', 'dashboard.badges', 'dashboard.audio', 'dashboard.route', 'dashboard.open_map',
  // topbar
  'topbar.today', 'topbar.build', 'topbar.route_map', 'topbar.collection',
  'topbar.ai_guide', 'topbar.dashboard', 'topbar.settings',
  'topbar.questionnaire', 'topbar.setup', 'topbar.visit', 'topbar.default',
  // bottom_nav
  'bottom_nav.explore', 'bottom_nav.routes', 'bottom_nav.compendium', 'bottom_nav.concierge',
];

const resolve = (obj, key) => key.split('.').reduce((o, k) => o?.[k], obj);
const keyToFilename = (key) => key.replace(/\./g, '_');

const generateAudio = async (text, outputPath) => {
  if (existsSync(outputPath)) {
    console.log(`  SKIP: ${outputPath}`);
    return;
  }

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: 'POST',
    headers: { 'xi-api-key': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
  });

  if (!res.ok) {
    console.error(`  ERROR: ${await res.text()}`);
    return;
  }

  writeFileSync(outputPath, Buffer.from(await res.arrayBuffer()));
  console.log(`  OK: ${outputPath}`);
};

const run = async () => {
  if (!API_KEY) {
    console.error('ELEVENLABS_API_KEY not set in .env');
    process.exit(1);
  }

  for (const locale of LOCALES) {
    const translations = JSON.parse(readFileSync(join(ROOT, 'src', 'locales', `${locale}.json`), 'utf-8'));
    const localeDir = join(OUTPUT_DIR, locale);
    mkdirSync(localeDir, { recursive: true });
    console.log(`\n[${locale.toUpperCase()}]`);

    for (const key of KEYS) {
      const text = resolve(translations, key);
      if (!text) { console.log(`  MISSING: ${key}`); continue; }
      if (text.includes('{{')) { console.log(`  SKIP (interpolation): ${key}`); continue; }
      await generateAudio(text, join(localeDir, `${keyToFilename(key)}.mp3`));
      await new Promise(r => setTimeout(r, 300));
    }
  }

  console.log('\nDone!');
};

run();
