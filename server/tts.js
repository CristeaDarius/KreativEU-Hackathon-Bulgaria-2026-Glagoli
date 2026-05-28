import { Router } from 'express';
import { createHash } from 'crypto';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

const router = Router();
const CACHE_DIR = join(process.cwd(), 'tts', 'cache');
if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true });

const DEFAULT_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL';

router.post('/tts', async (req, res) => {
  const { text, voiceId } = req.body;
  if (!text) return res.status(400).json({ error: 'text is required' });

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'ELEVENLABS_API_KEY not set' });

  const selectedVoice = voiceId || DEFAULT_VOICE_ID;
  const hash = createHash('md5').update(`${selectedVoice}:${text}`).digest('hex');
  const cachePath = join(CACHE_DIR, `${hash}.mp3`);

  if (existsSync(cachePath)) {
    res.set('Content-Type', 'audio/mpeg');
    res.set('X-Cache', 'HIT');
    return res.send(readFileSync(cachePath));
  }

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${selectedVoice}`, {
      method: 'POST',
      headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: err });
    }

    const buf = Buffer.from(await response.arrayBuffer());
    writeFileSync(cachePath, buf);
    res.set('Content-Type', 'audio/mpeg');
    res.set('X-Cache', 'MISS');
    return res.send(buf);
  } catch (err) {
    console.error('TTS error:', err);
    res.status(500).json({ error: 'TTS request failed' });
  }
});

export default router;
