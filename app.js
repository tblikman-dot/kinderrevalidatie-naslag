// ===== STANDAARDINDELING (aanpasbaar/uitbreidbaar) =====
// Dit zijn alleen categorienamen/onderwerpen, geen medische inhoud.
const DEFAULT_CATS = [
  { id: 'cp', label: 'Cerebrale parese & spasticiteit', scope: 'Classificatie (GMFCS/MACS), spasticiteitsmanagement, hulpmiddelen' },
  { id: 'nma', label: 'Neuromusculaire aandoeningen', scope: 'O.a. SMA, spierdystrofieën' },
  { id: 'sb', label: 'Spina bifida / neurale buisdefecten', scope: '' },
  { id: 'ontw', label: 'Ontwikkelingsstoornissen', scope: 'O.a. DCD, motorische ontwikkeling' },
  { id: 'amp', label: 'Aangeboren afwijkingen, amputatie & prothesiologie', scope: '' },
  { id: 'nah', label: 'Niet-aangeboren hersenletsel (NAH)', scope: '' },
  { id: 'voeding', label: 'Voeding & slikproblemen', scope: 'Dysfagie' },
  { id: 'comm', label: 'Communicatie & AAC', scope: 'Ondersteunde communicatie' },
  { id: 'hulp', label: 'Hulpmiddelen & voorzieningen', scope: 'Rolstoelen, orthesen, WMO' },
  { id: 'pijn', label: 'Pijn bij kinderen', scope: '' },
  { id: 'ortho', label: 'Orthopedische aspecten', scope: 'Heupen, wervelkolom' },
  { id: 'transitie', label: 'Transitie naar volwassenenzorg', scope: '' },
  { id: 'mdo', label: 'Multidisciplinaire samenwerking', scope: 'ICF-model' },
];

const STORAGE_CATS = 'krnCategories';
const STORAGE_NOTES = 'krnNotes';

let categories = [];
let notes = {};
let activeId = null;
let saveTimer = null;

function loadState() {
  try {
    const c = localStorage.getItem(STORAGE_CATS);
    categories = c ? JSON.parse(c) : DEFAULT_CATS.slice();
  } catch (e) { categories = DEFAULT_CATS.slice(); }

  try {
    const n = localStorage.getItem(STORAGE_NOTES);
    notes = n ? JSON.parse(n) : {};
  } catch (e) { notes = {}; }
}

function saveCategories() {
  localStorage.setItem(STORAGE_CATS, JSON.stringify(categories));
}
function saveNotes() {
  localStorage.setItem(STORAGE_NOTES, JSON.stringify(notes));
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function zoekLink(label, extra) {
  const q = encodeURIComponent(label + (extra ? ' ' + extra : ''));
  return q;
}

// ===== RENDER =====
function renderList(filter) {
  const el = document.getElementById('catList');
  const f = (filter || '').toLowerCase().trim();

  const items = categories.filter(c => {
    if (!f) return true;
    const n = (notes[c.id] || '').toLowerCase();
    return c.label.toLowerCase().includes(f) || (c.scope || '').toLowerCase().includes(f) || n.includes(f);
  });

  if (!items.length) {
    el.innerHTML = '<div class="cat-empty">Niets gevonden.</div>';
    return;
  }

  el.innerHTML = items.map(c => `
    <button class="cat-item${c.id === activeId ? ' active' : ''}" data-id="${c.id}">
      ${esc(c.label)}
      ${c.scope ? `<span class="scope">${esc(c.scope)}</span>` : ''}
    </button>
  `).join('');

  el.querySelectorAll('.cat-item').forEach(btn => {
    btn.addEventListener('click', () => openCategory(btn.dataset.id));
  });
}

function openCategory(id) {
  const cat = categories.find(c => c.id === id);
  if (!cat) return;
  activeId = id;

  document.getElementById('detailEmpty').hidden = true;
  document.getElementById('detailContent').hidden = false;
  document.getElementById('detailTitle').textContent = cat.label;
  document.getElementById('detailScope').textContent = cat.scope || '';

  const rdQuery = zoekLink(cat.label, cat.scope);
  document.getElementById('detailLinks').innerHTML = `
    <a href="https://www.google.com/search?q=${rdQuery}+site:richtlijnendatabase.nl" target="_blank" rel="noopener">🔎 Zoek in Richtlijnendatabase</a>
    <a href="https://www.google.com/search?q=${rdQuery}+richtlijn+kinderrevalidatie" target="_blank" rel="noopener">🔎 Breder zoeken</a>
  `;

  const area = document.getElementById('notesArea');
  area.value = notes[id] || '';

  renderList(document.getElementById('zoek').value);
  document.getElementById('layout').classList.add('detail-active');
  document.getElementById('detail').scrollTop = 0;
}

function closeDetail() {
  activeId = null;
  document.getElementById('detailEmpty').hidden = false;
  document.getElementById('detailContent').hidden = true;
  document.getElementById('layout').classList.remove('detail-active');
}

// ===== NOTITIES AUTOSAVE =====
function scheduleSave() {
  const status = document.getElementById('saveStatus');
  status.textContent = 'Bezig met typen…';
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    if (!activeId) return;
    notes[activeId] = document.getElementById('notesArea').value;
    saveNotes();
    status.textContent = '✓ Opgeslagen';
    renderList(document.getElementById('zoek').value);
    setTimeout(() => { if (status.textContent === '✓ Opgeslagen') status.textContent = ''; }, 2000);
  }, 500);
}

// ===== CATEGORIE TOEVOEGEN / VERWIJDEREN =====
function addCategory() {
  const label = prompt('Naam van het nieuwe aandachtsgebied:');
  if (!label || !label.trim()) return;
  const id = 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  categories.push({ id, label: label.trim(), scope: '' });
  saveCategories();
  renderList(document.getElementById('zoek').value);
  openCategory(id);
  toast('✅ Toegevoegd');
}

function deleteCategory() {
  if (!activeId) return;
  const cat = categories.find(c => c.id === activeId);
  if (!cat) return;
  if (!confirm(`"${cat.label}" en de bijbehorende aantekeningen verwijderen?`)) return;
  categories = categories.filter(c => c.id !== activeId);
  delete notes[activeId];
  saveCategories();
  saveNotes();
  closeDetail();
  renderList(document.getElementById('zoek').value);
  toast('🗑️ Verwijderd');
}

function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2000);
}

// ===== INIT =====
loadState();
renderList('');

document.getElementById('zoek').addEventListener('input', e => renderList(e.target.value));
document.getElementById('notesArea').addEventListener('input', scheduleSave);
document.getElementById('addCatBtn').addEventListener('click', addCategory);
document.getElementById('delCatBtn').addEventListener('click', deleteCategory);
document.getElementById('backBtn').addEventListener('click', closeDetail);
