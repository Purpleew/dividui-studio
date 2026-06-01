<!-- src/components/IdeaCard.vue -->
<template>
  <article class="idea-card" :class="{ 'is-pinned': isPinned }">
    <header class="card-header">
      <span class="card-number">0{{ index + 1 }}</span>
      <button
        class="pin-btn"
        :class="{ active: isPinned }"
        @click="$emit('pin')"
        :aria-label="isPinned ? 'Spinna idea' : 'Pinna idea'"
      >
        {{ isPinned ? '★' : '☆' }}
      </button>
    </header>

    <h3 class="card-title">{{ idea.prodotto }}</h3>

    <p class="card-concept">{{ idea.concept }}</p>

    <div class="card-manifestazione">
      <span class="manifest-label">Manifestazione</span>
      <p>{{ idea.manifestazione }}</p>
    </div>

    <footer class="card-footer">
      <button class="action-btn" @click="$emit('save')" aria-label="Salva">
        <span>💾</span> Save
      </button>
      <button class="action-btn" @click="$emit('share')" aria-label="Condividi">
        <span>↗</span> Send
      </button>
    </footer>
  </article>
</template>

<script setup lang="ts">
import type { Idea } from '../lib/concepts-data';

defineProps<{
  idea: Idea;
  index: number;
  isPinned: boolean;
}>();

defineEmits<{
  pin: [];
  save: [];
  share: [];
}>();
</script>

<style scoped>
.idea-card {
  font-family: 'Host Grotesk', system-ui, sans-serif;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  color: #fff;
}

.idea-card:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.09);
  border-color: rgba(255, 255, 255, 0.18);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}

.idea-card.is-pinned {
  background: rgba(107, 91, 255, 0.18);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-color: rgba(107, 91, 255, 0.45);
  box-shadow: 0 0 32px rgba(107, 91, 255, 0.15);
}

/* Header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-number {
  font-size: 0.625rem;
  letter-spacing: 0.15em;
  opacity: 0.3;
  font-variant-numeric: tabular-nums;
  font-weight: 500;
}

.pin-btn {
  background: transparent;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  color: white;
  opacity: 0.3;
  transition: all 0.2s;
  padding: 0;
  line-height: 1;
}

.pin-btn:hover {
  opacity: 1;
  transform: scale(1.15);
  color: rgba(107, 91, 255, 0.8);
}

.pin-btn.active {
  opacity: 1;
  transform: scale(1.15);
  color: #6B5BFF;
}

/* Title */
.card-title {
  font-family: 'Host Grotesk', system-ui, sans-serif;
  font-size: 1.2rem;
  font-weight: 500;
  line-height: 1.25;
  margin: 0;
  color: #fff;
  letter-spacing: -0.01em;
}

/* Concept */
.card-concept {
  font-size: 0.875rem;
  line-height: 1.6;
  margin: 0;
  color: rgba(255, 255, 255, 0.65);
  font-weight: 300;
}

/* Manifestazione */
.card-manifestazione {
  padding-top: 0.75rem;
  border-top: 1px dashed rgba(255, 255, 255, 0.08);
}

.manifest-label {
  display: block;
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.35;
  margin-bottom: 0.375rem;
  font-weight: 500;
}

.card-manifestazione p {
  font-size: 0.8125rem;
  line-height: 1.55;
  margin: 0;
  opacity: 0.5;
  font-style: italic;
  font-weight: 300;
}

/* Footer */
.card-footer {
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
  padding-top: 0.5rem;
}

.action-btn {
  flex: 1;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  transition: all 0.2s;
  font-family: 'Host Grotesk', system-ui, sans-serif;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 400;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.2);
  color: white;
}
</style>
