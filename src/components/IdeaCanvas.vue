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
      <h3>📌 Pinnate</h3>
      <div class="pinned-list">
        <div v-for="(pinned, i) in pinnedIdeas" :key="i" class="pinned-card">
          <strong>{{ pinned.idea.prodotto }}</strong>
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
const showHearts = ref(false);
const toastMessage = ref<string>('');
const pinnedIds = ref<Set<string>>(new Set());
const pinnedIdeas = ref<Array<{ idea: Idea; setId: string; index: number }>>([]);

const domini = DOMINI;

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
// KEY HANDLER
// ============================================
function handleKeyPress(e: CustomEvent) {
  const action = e.detail.action;
  switch (action) {
    case 'comboIdea':
      generateNew();
      break;
    case 'nextIdea':
      generateNext();
      break;
    case 'topic':
      showTopicSelector.value = true;
      break;
    case 'remix':
      doRemix();
      break;
    case 'send':
      shareCurrentSet();
      break;
    case 'save':
      saveCurrentSet();
      break;
    case 'heart':
      pinAllCurrent();
      break;
    case 'aiMode':
      aiModeRandom();
      break;
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

// ============================================
// PERSISTENCE
// ============================================
function persistPinned() {
  localStorage.setItem('dividui-pinned', JSON.stringify({
    ids: Array.from(pinnedIds.value),
    ideas: pinnedIdeas.value
  }));
}

// ============================================
// UI HELPERS
// ============================================
function delay(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

function showToast(msg: string) {
  toastMessage.value = msg;
  setTimeout(() => { toastMessage.value = ''; }, 2500);
}

function triggerHeartsAnimation() {
  showHearts.value = true;
  setTimeout(() => { showHearts.value = false; }, 2000);
}

function getHeartStyle(_n: number) {
  const left = Math.random() * 100;
  const delay = Math.random() * 0.5;
  const duration = 1.5 + Math.random() * 0.8;
  const size = 1 + Math.random() * 1.5;
  return {
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    fontSize: `${size}rem`
  };
}
</script>

<style scoped>
.idea-canvas {
  position: relative;
  width: 100%;
  padding: 3rem 2rem;
  min-height: 60vh;
  font-family: 'Host Grotesk', system-ui, sans-serif;
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
  font-family: 'Host Grotesk', system-ui, sans-serif;
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
  font-family: 'Host Grotesk', system-ui, sans-serif;
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
  background: var(--bg, #FAFAF7);
  border-radius: 16px;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.topic-modal h3 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.75rem;
  margin: 0 0 0.25rem;
}

.topic-sub {
  opacity: 0.6;
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
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 1rem 0.5rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  font-family: inherit;
}

.topic-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  border-color: rgba(0, 0, 0, 0.2);
}

.topic-emoji {
  font-size: 1.75rem;
}

.topic-label {
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: lowercase;
}

.topic-close {
  width: 100%;
  padding: 0.75rem;
  background: transparent;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.875rem;
  transition: background 0.2s;
}

.topic-close:hover {
  background: rgba(0, 0, 0, 0.05);
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
  font-family: 'Cormorant Garamond', serif;
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

.pinned-card strong {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.pinned-card p {
  margin: 0;
  opacity: 0.85;
  line-height: 1.5;
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
