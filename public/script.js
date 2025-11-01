const titleEl = document.getElementById('title');
const contentEl = document.getElementById('content');
const saveBtn = document.getElementById('saveBtn');
const clearBtn = document.getElementById('clearBtn');
const statusEl = document.getElementById('status');
const notesList = document.getElementById('notesList');

let notes = [];

async function fetchJSON(url, opts) {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...opts });
  if (!res.ok) {
    let msg = 'Request failed';
    try { msg = (await res.json()).error || msg; } catch {}
    throw new Error(msg);
  }
  if (res.status === 204) return null;
  return res.json();
}

function fmt(ts) { return new Date(ts).toLocaleString(); }

async function loadNotes() {
  notes = await fetchJSON('/api/notes');
  renderNotes();
}

function renderNotes() {
  notesList.innerHTML = '';
  for (const n of notes) notesList.appendChild(renderNoteView(n));
}

function renderNoteView(n) {
  const li = document.createElement('li');
  li.className = 'note-card';
  li.dataset.id = n.id;

  const title = document.createElement('div');
  title.className = 'note-title';
  title.textContent = n.title && n.title.trim() ? n.title : '(Untitled)';

  const content = document.createElement('div');
  content.className = 'note-content';
  const body = n.content || '';
  content.textContent = body.length > 280 ? body.slice(0, 280) + '…' : body;

  const meta = document.createElement('div');
  meta.className = 'note-meta';
  meta.textContent = 'Updated: ' + fmt(n.updatedAt);

  const actions = document.createElement('div');
  actions.className = 'note-actions';

  const editBtn = document.createElement('button');
  editBtn.type = 'button';
  editBtn.className = 'small';
  editBtn.textContent = 'Edit';
  editBtn.dataset.action = 'edit';

  const delBtn = document.createElement('button');
  delBtn.type = 'button';
  delBtn.className = 'small secondary';
  delBtn.textContent = 'Delete';
  delBtn.dataset.action = 'delete';

  actions.appendChild(editBtn);
  actions.appendChild(delBtn);

  li.appendChild(title);
  li.appendChild(content);
  li.appendChild(meta);
  li.appendChild(actions);

  return li;
}

function renderNoteEdit(n) {
  const li = document.createElement('li');
  li.className = 'note-card note-card--editing';
  li.dataset.id = n.id;

  const titleInput = document.createElement('input');
  titleInput.value = n.title || '';
  titleInput.placeholder = 'Title';

  const contentInput = document.createElement('textarea');
  contentInput.value = n.content || '';
  contentInput.placeholder = 'Write your note...';
  contentInput.rows = 6;

  const meta = document.createElement('div');
  meta.className = 'note-meta';
  meta.textContent = 'Editing • Last updated: ' + fmt(n.updatedAt);

  const actions = document.createElement('div');
  actions.className = 'note-actions';

  const saveBtn = document.createElement('button');
  saveBtn.type = 'button';
  saveBtn.textContent = 'Save';
  saveBtn.dataset.action = 'save';

  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'secondary';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.dataset.action = 'cancel';

  actions.appendChild(saveBtn);
  actions.appendChild(cancelBtn);

  li.appendChild(titleInput);
  li.appendChild(contentInput);
  li.appendChild(meta);
  li.appendChild(actions);

  return li;
}

notesList.addEventListener('click', async (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  e.preventDefault();
  const action = btn.dataset.action;
  const li = btn.closest('li.note-card');
  if (!action || !li) return;
  const id = li.dataset.id;
  const idx = notes.findIndex(n => n.id === id);
  if (idx === -1) return;
  try {
    if (action === 'edit') {
      const editLi = renderNoteEdit(notes[idx]);
      notesList.replaceChild(editLi, li);
      editLi.querySelector('input')?.focus();
      return;
    }
    if (action === 'cancel') {
      const viewLi = renderNoteView(notes[idx]);
      notesList.replaceChild(viewLi, li);
      return;
    }
    if (action === 'save') {
      const title = li.querySelector('input')?.value || '';
      const content = li.querySelector('textarea')?.value || '';
      const updated = await fetchJSON('/api/notes/' + id, {
        method: 'PUT',
        body: JSON.stringify({ title, content })
      });
      notes[idx] = updated;
      const viewLi = renderNoteView(updated);
      notesList.replaceChild(viewLi, li);
      return;
    }
    if (action === 'delete') {
      if (!confirm('Delete this note?')) return;
      await fetchJSON('/api/notes/' + id, { method: 'DELETE' });
      notes.splice(idx, 1);
      li.remove();
      return;
    }
  } catch (err) {
    alert(err.message || String(err));
  }
});

saveBtn.addEventListener('click', async () => {
  try {
    const payload = { title: titleEl.value, content: contentEl.value };
    const created = await fetchJSON('/api/notes', { method: 'POST', body: JSON.stringify(payload) });
    notes.unshift(created);
    notesList.prepend(renderNoteView(created));
    titleEl.value = '';
    contentEl.value = '';
    statusEl.textContent = 'Created';
    setTimeout(() => (statusEl.textContent = ''), 1000);
  } catch (e) {
    alert(e.message || String(e));
  }
});

clearBtn.addEventListener('click', () => {
  titleEl.value = '';
  contentEl.value = '';
  statusEl.textContent = '';
});

loadNotes().catch(console.error);
