import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify({ notes: [] }, null, 2));
  }
}

async function readData() {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

async function writeData(data) {
  const tmp = DATA_FILE + '.tmp';
  await fs.writeFile(tmp, JSON.stringify(data, null, 2));
  await fs.rename(tmp, DATA_FILE);
}

app.get('/api/notes', async (_req, res) => {
  try {
    const data = await readData();
    res.json(data.notes);
  } catch {
    res.status(500).json({ error: 'Failed to read notes' });
  }
});

app.get('/api/notes/:id', async (req, res) => {
  try {
    const data = await readData();
    const note = data.notes.find(n => n.id === req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch {
    res.status(500).json({ error: 'Failed to read note' });
  }
});

app.post('/api/notes', async (req, res) => {
  try {
    const title = (req.body?.title ?? '').trim();
    const content = (req.body?.content ?? '').trim();
    if (!title && !content) {
      return res.status(400).json({ error: 'Title or content required' });
    }
    const data = await readData();
    const now = new Date().toISOString();
    const note = { id: crypto.randomUUID(), title, content, createdAt: now, updatedAt: now };
    data.notes.unshift(note);
    await writeData(data);
    res.status(201).json(note);
  } catch {
    res.status(500).json({ error: 'Failed to create note' });
  }
});

app.put('/api/notes/:id', async (req, res) => {
  try {
    const data = await readData();
    const idx = data.notes.findIndex(n => n.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Note not found' });
    const note = data.notes[idx];
    const title = (req.body?.title ?? note.title).trim();
    const content = (req.body?.content ?? note.content).trim();
    const updated = { ...note, title, content, updatedAt: new Date().toISOString() };
    data.notes[idx] = updated;
    await writeData(data);
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Failed to update note' });
  }
});

app.delete('/api/notes/:id', async (req, res) => {
  try {
    const data = await readData();
    const before = data.notes.length;
    data.notes = data.notes.filter(n => n.id !== req.params.id);
    if (data.notes.length === before) {
      return res.status(404).json({ error: 'Note not found' });
    }
    await writeData(data);
    res.status(204).end();
  } catch {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Notes app listening on http://localhost:${PORT}`);
});
