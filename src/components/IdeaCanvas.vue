<!-- src/components/IdeaCanvas.vue -->
<template>
  <div class="idea-canvas">
    <!-- Header: stato corrente / combinazione parametri -->
    <div class="canvas-header" v-if="currentSet">
      <div class="params">
        <span class="param">
          <span class="param-label">Dominio</span>
          <span class="param-value">{{ currentSet.dominio }}</span>
        </span>
        <span class="param-sep">×</span>
        <span class="param">
          <span class="param-label">Operazione</span>
          <span class="param-value">{{ currentSet.operazione }}</span>
        </span>
        <span class="param-sep">×</span>
        <span class="param">
          <span class="param-label">Vincolo</span>
          <span class="param-value">{{ currentSet.vincolo }}</span>
        </span>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="!currentSet && !isGenerating" class="empty-state">
      <p class="empty-title">Premi un tasto.</p>
      <p class="empty-sub">Generate the unexpected.</p>
    </div>

    <!-- Loading state -->
    <div v-if="isGenerating" class="loading-state">
      <div class="loading-dots">
        <span></span><span></span><span></span>
      </div>
      <p>Generando deviazioni…</p>
    </div>

    <!-- Idee generate -->
    <transition-group name="idea" tag="div" class="ideas-grid" v-if="currentSet && !isGenerating">
      <IdeaCard
        v-for="(idea, i) in currentSet.ideas"
        :key="currentSet.id + '-' + i"
        :idea="idea"
        :index="i"
        :is-pinned="pinnedIds.has(currentSet.id + '-' + i)"
        @save="saveIdea(idea, i)"
        @pin="pinIdea(i)"
        @share="shareIdea(idea, i)"
      />
    </transition-group>

    <!-- Write Prompt overlay -->
    <div v-if="showPromptInput" class="topic-overlay" @click.self="showPromptInput = false">
      <div class="topic-modal prompt-modal">
        <h3>Scrivi un prompt</h3>
        <p class="topic-sub">Descrivi un caso specifico: il sistema genera un'idea su misura.</p>
        <textarea
          ref="promptTextareaRef"
          v-model="promptText"
          class="prompt-textarea"
          placeholder="es. sneakers per adolescenti ribelli, app di meditazione per manager stressati…"
          rows="3"
          @keydown.enter.prevent="submitPrompt"
        ></textarea>
        <div class="prompt-actions">
          <button class="prompt-submit" @click="submitPrompt" :disabled="!promptText.trim()">
            Genera idea →
          </button>
          <button class="topic-close" @click="showPromptInput = false">Annulla</button>
        </div>
      </div>
    </div>

    <!-- Topic selector overlay -->
    <div v-if="showTopicSelector" class="topic-overlay" @click.self="showTopicSelector = false">
      <div class="topic-modal">
        <h3>Scegli un dominio</h3>
        <p class="topic-sub">Da quale universo semantico vuoi partire?</p>
        <div class="topic-grid">
          <button
            v-for="d in domini"
            :key="d.id"
            class="topic-btn"
            @click="selectTopic(d.id)"
          >
            <span class="topic-emoji">{{ d.emoji }}</span>
            <span class="topic-label">{{ d.label }}</span>
          </button>
        </div>
        <button class="topic-close" @click="showTopicSelector = false">Annulla</button>
      </div>
    </div>

    <!-- Hearts animation overlay -->
    <div v-if="showHearts" class="hearts-overlay">
      <span v-for="n in 12" :key="n" class="heart" :style="getHeartStyle(n)">♥</span>
    </div>

    <!-- Pinned section -->
    <div v-if="pinnedIdeas.length > 0" class="pinned-section">
      <h3>Salvate</h3>
      <div class="pinned-list">
        <div v-for="(pinned, i) in pinnedIdeas" :key="i" class="pinned-card">
          <div class="pinned-card-header">
            <strong>{{ pinned.idea.prodotto }}</strong>
            <button class="pinned-unpin-btn" @click="unpinFromList(i)" aria-label="Rimuovi pin">♥</button>
          </div>
          <p>{{ pinned.idea.concept }}</p>
        </div>
      </div>
    </div>

    <!-- Share toast -->
    <div v-if="toastMessage" class="toast">{{ toastMessage }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import IdeaCard from './IdeaCard.vue';
import {
  getRandomConceptSet,
  getNextConceptSet,
  getConceptByDomain,
  remixConcept,
  CONCEPT_SETS,
  type ConceptSet,
  type Idea
} from '../lib/concepts-data';
import { DOMINI } from '../lib/semantic-axes';

// ============================================
// STATE
// ============================================
const currentSet = ref<ConceptSet | null>(null);
const isGenerating = ref(false);
const showTopicSelector = ref(false);
const showPromptInput = ref(false);
const promptText = ref('');
const promptTextareaRef = ref<HTMLTextAreaElement | null>(null);
const showHearts = ref(false);
const toastMessage = ref<string>('');
const pinnedIds = ref<Set<string>>(new Set());
const pinnedIdeas = ref<Array<{ idea: Idea; setId: string; index: number }>>([]);

const domini = DOMINI;

// ============================================
// UI HELPERS & PERSISTENCE  (defined first — used by all action fns)
// ============================================
function delay(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

function showToast(msg: string) {
  toastMessage.value = msg;
  setTimeout(() => { toastMessage.value = ''; }, 2500);
}

function persistPinned() {
  localStorage.setItem('dividui-pinned', JSON.stringify({
    ids: Array.from(pinnedIds.value),
    ideas: pinnedIdeas.value
  }));
}

function triggerHeartsAnimation() {
  showHearts.value = true;
  setTimeout(() => { showHearts.value = false; }, 2000);
}

function getHeartStyle(_n: number) {
  const left = Math.random() * 100;
  const d = Math.random() * 0.5;
  const duration = 1.5 + Math.random() * 0.8;
  const size = 1 + Math.random() * 1.5;
  return {
    left: `${left}%`,
    animationDelay: `${d}s`,
    animationDuration: `${duration}s`,
    fontSize: `${size}rem`
  };
}

// ============================================
// UNPIN FROM LIST
// ============================================
function unpinFromList(listIndex: number) {
  const pinned = pinnedIdeas.value[listIndex];
  if (!pinned) return;
  const ideaId = pinned.setId + '-' + pinned.index;
  pinnedIds.value.delete(ideaId);
  pinnedIdeas.value.splice(listIndex, 1);
  persistPinned();
  showToast('Rimossa dai salvati');
}

// ============================================
// LOAD SAVED FROM LOCALSTORAGE
// ============================================
onMounted(() => {
  const saved = localStorage.getItem('dividui-pinned');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      pinnedIdeas.value = parsed.ideas || [];
      pinnedIds.value = new Set(parsed.ids || []);
    } catch (e) {
      console.warn('Failed to load pinned:', e);
    }
  }

  window.addEventListener('dividui:keypress', handleKeyPress as EventListener);
});

onUnmounted(() => {
  window.removeEventListener('dividui:keypress', handleKeyPress as EventListener);
});

// ============================================
// WRITE PROMPT
// ============================================
function openWritePrompt() {
  promptText.value = '';
  showPromptInput.value = true;
  setTimeout(() => { promptTextareaRef.value?.focus(); }, 80);
}

async function submitPrompt() {
  const query = promptText.value.trim();
  if (!query) return;
  showPromptInput.value = false;
  isGenerating.value = true;
  await delay(700);
  const lower = query.toLowerCase();
  const words = lower.split(/\s+/).filter(w => w.length > 2);
  const scored = CONCEPT_SETS.map(set => {
    const haystack = [
      set.dominio, set.operazione, set.vincolo,
      ...set.ideas.flatMap(i => [i.prodotto, i.concept])
    ].join(' ').toLowerCase();
    const score = words.reduce((acc, w) => acc + (haystack.includes(w) ? 1 : 0), 0);
    return { set, score };
  }).sort((a, b) => b.score - a.score);
  currentSet.value = scored[0].score > 0 ? scored[0].set : getRandomConceptSet();
  isGenerating.value = false;
  showToast(`Idea da: "${query.slice(0, 40)}${query.length > 40 ? '…' : ''}"`);
}

function resetIdea() {
  currentSet.value = null;
  isGenerating.value = false;
  showToast('Reset');
}

// ============================================
// KEY HANDLER
// ============================================
function handleKeyPress(e: CustomEvent) {
  const action = e.detail.action;
  switch (action) {
    case 'writePrompt':    openWritePrompt(); break;
    case 'nextIdea':       generateNext(); break;
    case 'topic':          showTopicSelector.value = true; break;
    case 'remix':          doRemix(); break;
    case 'send':           shareCurrentSet(); break;
    case 'save':           saveCurrentSet(); break;
    case 'heart':          pinAllCurrent(); break;
    case 'reset':          resetIdea(); break;
    case 'aiMode':         aiModeRandom(); break;
  }
}

// ============================================
// GENERATION LOGIC
// ============================================
async function generateNew() {
  isGenerating.value = true;
  await delay(700);
  currentSet.value = getRandomConceptSet();
  isGenerating.value = false;
}

async function generateNext() {
  if (!currentSet.value) return generateNew();
  isGenerating.value = true;
  await delay(500);
  currentSet.value = getNextConceptSet(currentSet.value.id);
  isGenerating.value = false;
}

async function selectTopic(dominio: string) {
  showTopicSelector.value = false;
  isGenerating.value = true;
  await delay(600);
  const result = getConceptByDomain(dominio);
  if (result) {
    currentSet.value = result;
  } else {
    showToast('Nessun concept disponibile per questo dominio');
  }
  isGenerating.value = false;
}

async function doRemix() {
  if (!currentSet.value) {
    showToast('Genera prima un\'idea con Combo Idea');
    return;
  }
  isGenerating.value = true;
  await delay(600);
  currentSet.value = remixConcept(currentSet.value);
  isGenerating.value = false;
}

async function aiModeRandom() {
  isGenerating.value = true;
  // Animazione un po' più lunga per dare la sensazione di "magia"
  await delay(1200);
  currentSet.value = getRandomConceptSet();
  isGenerating.value = false;
  showToast('✨ AI Mode: l\'imprevedibilità calibrata.');
}

// ============================================
// PIN / SAVE / SHARE
// ============================================
function pinIdea(index: number) {
  if (!currentSet.value) return;
  const ideaId = currentSet.value.id + '-' + index;

  if (pinnedIds.value.has(ideaId)) {
    // Unpin
    pinnedIds.value.delete(ideaId);
    pinnedIdeas.value = pinnedIdeas.value.filter(
      p => !(p.setId === currentSet.value!.id && p.index === index)
    );
    showToast('Idea spinnata');
  } else {
    // Pin
    pinnedIds.value.add(ideaId);
    pinnedIdeas.value.push({
      idea: currentSet.value.ideas[index],
      setId: currentSet.value.id,
      index
    });
    triggerHeartsAnimation();
    showToast('💛 Idea pinnata');
  }

  persistPinned();
}

function pinAllCurrent() {
  if (!currentSet.value) {
    showToast('Genera prima un\'idea');
    return;
  }
  currentSet.value.ideas.forEach((_, i) => {
    const id = currentSet.value!.id + '-' + i;
    if (!pinnedIds.value.has(id)) {
      pinnedIds.value.add(id);
      pinnedIdeas.value.push({
        idea: currentSet.value!.ideas[i],
        setId: currentSet.value!.id,
        index: i
      });
    }
  });
  triggerHeartsAnimation();
  showToast('❤️ Love it! Pinnate tutte e tre');
  persistPinned();
}

function saveIdea(_idea: Idea, index: number) {
  pinIdea(index);
}

function saveCurrentSet() {
  if (!currentSet.value) return;
  // Salva il set intero in localStorage in una collection separata "saved sets"
  const saved = JSON.parse(localStorage.getItem('dividui-saved-sets') || '[]');
  saved.unshift({
    id: currentSet.value.id,
    date: new Date().toISOString(),
    set: currentSet.value
  });
  localStorage.setItem('dividui-saved-sets', JSON.stringify(saved.slice(0, 50)));
  showToast('💾 Salvato');
}

async function shareIdea(idea: Idea, _index: number) {
  const text = `${idea.prodotto}\n\n${idea.concept}\n\nVia Dividui Studio — improbability engine`;
  await doShare(text);
}

async function shareCurrentSet() {
  if (!currentSet.value) {
    showToast('Niente da condividere');
    return;
  }
  const text = currentSet.value.ideas
    .map((i, idx) => `${idx + 1}. ${i.prodotto}\n${i.concept}`)
    .join('\n\n');
  const full = `Combo: ${currentSet.value.dominio} × ${currentSet.value.operazione} × ${currentSet.value.vincolo}\n\n${text}\n\nVia Dividui Studio`;
  await doShare(full);
}

async function doShare(text: string) {
  // @ts-ignore - navigator.share è opzionale
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Dividui — Improbability Engine',
        text
      });
      return;
    } catch (e) {
      // user cancelled
    }
  }
  // Fallback: copy to clipboard
  try {
    await navigator.clipboard.writeText(text);
    showToast('📋 Copiato negli appunti');
  } catch (e) {
    showToast('Impossibile copiare');
  }
}

</script>

<style scoped>
.idea-canvas {
  position: relative;
  width: 100%;
  padding: 3rem 2rem;
  min-height: 60vh;
  font-family: var(--font-family-sans);
  color: #fff;
}

/* ============== HEADER ============== */
.canvas-header {
  margin-bottom: 2rem;
}

.params {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: baseline;
  font-size: 0.875rem;
}

.param {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.param-label {
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  opacity: 0.35;
  font-weight: 500;
}

.param-value {
  font-family: var(--font-family-sans);
  font-style: italic;
  font-size: 1.1rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.85);
}

.param-sep {
  opacity: 0.2;
  font-size: 1rem;
}

/* ============== EMPTY STATE ============== */
.empty-state {
  text-align: center;
  padding: 4rem 1rem;
}

.empty-title {
  font-family: var(--font-family-sans);
  font-size: 1.5rem;
  font-weight: 300;
  margin: 0 0 0.5rem;
  opacity: 0.5;
}

.empty-sub {
  font-style: italic;
  font-weight: 300;
  margin: 0;
  opacity: 0.3;
  font-size: 0.875rem;
}

/* ============== LOADING STATE ============== */
.loading-state {
  text-align: center;
  padding: 4rem 1rem;
}

.loading-dots {
  display: inline-flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.loading-dots span {
  width: 6px;
  height: 6px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  animation: dotPulse 1.4s infinite ease-in-out both;
}

.loading-dots span:nth-child(1) { animation-delay: -0.32s; }
.loading-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes dotPulse {
  0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
  40% { transform: scale(1); opacity: 1; }
}

/* ============== IDEAS GRID ============== */
.ideas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

/* ============== TRANSITIONS ============== */
.idea-enter-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.idea-leave-active {
  transition: all 0.3s ease;
  position: absolute;
}

.idea-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.idea-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ============== TOPIC OVERLAY ============== */
.topic-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 2rem;
}

.topic-modal {
  background: #111;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.7);
  color: #fff;
}

.topic-modal h3 {
  font-family: var(--font-family-sans);
  font-size: 1.75rem;
  margin: 0 0 0.25rem;
  color: #fff;
}

.topic-sub {
  color: rgba(255,255,255,0.45);
  font-size: 0.875rem;
  margin: 0 0 1.5rem;
}

.topic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.topic-btn {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 1rem 0.5rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  font-family: inherit;
  color: #fff;
}

.topic-btn:hover {
  background: rgba(255,255,255,0.1);
  border-color: rgba(255,255,255,0.25);
  transform: translateY(-3px);
}

.topic-emoji {
  font-size: 1.75rem;
}

.topic-label {
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: lowercase;
  color: rgba(255,255,255,0.75);
}

.topic-close {
  width: 100%;
  padding: 0.75rem;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.875rem;
  color: rgba(255,255,255,0.5);
  transition: all 0.2s;
}

.topic-close:hover {
  background: rgba(255,255,255,0.05);
  color: #fff;
}

/* ============== HEARTS ANIMATION ============== */
.hearts-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 50;
  overflow: hidden;
}

.heart {
  position: absolute;
  bottom: 0;
  color: #FF4D4D;
  animation: floatUp linear forwards;
  user-select: none;
}

@keyframes floatUp {
  0% {
    transform: translateY(0) rotate(0deg) scale(0.5);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) rotate(360deg) scale(1.2);
    opacity: 0;
  }
}

/* ============== PINNED SECTION ============== */
.pinned-section {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

.pinned-section h3 {
  font-family: var(--font-family-sans);
  font-size: 1.5rem;
  margin: 0 0 1rem;
}

.pinned-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.pinned-card {
  background: rgba(255, 214, 107, 0.12);
  border: 1px solid rgba(255, 214, 107, 0.3);
  border-radius: 12px;
  padding: 1rem;
  font-size: 0.875rem;
}

.pinned-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.pinned-card-header strong {
  font-size: 0.95rem;
  line-height: 1.3;
}

.pinned-unpin-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: #FF4D4D;
  padding: 0;
  line-height: 1;
  flex-shrink: 0;
  transition: transform 0.2s, opacity 0.2s;
  opacity: 0.7;
}

.pinned-unpin-btn:hover {
  opacity: 1;
  transform: scale(1.2);
}

.pinned-card p {
  margin: 0;
  opacity: 0.85;
  line-height: 1.5;
}

/* ============== PROMPT MODAL ============== */
.prompt-modal {
  max-width: 480px;
}

.prompt-textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 0.875rem 1rem;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 10px;
  font-family: inherit;
  font-size: 0.9rem;
  line-height: 1.5;
  resize: none;
  background: rgba(255,255,255,0.06);
  color: #fff;
  margin-bottom: 1rem;
  transition: border-color 0.2s;
}

.prompt-textarea:focus {
  outline: none;
  border-color: #6B5BFF;
  box-shadow: 0 0 0 3px rgba(107, 91, 255, 0.15);
}

.prompt-textarea::placeholder {
  color: rgba(255,255,255,0.25);
  font-style: italic;
}

.prompt-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.prompt-submit {
  flex: 1;
  padding: 0.75rem 1.25rem;
  background: #6B5BFF;
  color: white;
  border: none;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.prompt-submit:hover:not(:disabled) {
  background: #5a4ae0;
  transform: translateY(-1px);
}

.prompt-submit:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ============== TOAST ============== */
.toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: #1a1a1a;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 100px;
  font-size: 0.875rem;
  z-index: 200;
  animation: toastIn 0.3s ease, toastOut 0.3s ease 2.2s forwards;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

@keyframes toastIn {
  from { opacity: 0; transform: translate(-50%, 20px); }
  to { opacity: 1; transform: translate(-50%, 0); }
}

@keyframes toastOut {
  to { opacity: 0; transform: translate(-50%, -10px); }
}

/* ============== RESPONSIVE ============== */
@media (max-width: 768px) {
  .idea-canvas {
    padding: 1rem;
  }
  .params {
    font-size: 0.75rem;
  }
  .param-value {
    font-size: 1rem;
  }
  .ideas-grid {
    grid-template-columns: 1fr;
  }
}
</style>
