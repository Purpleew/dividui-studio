// src/lib/semantic-axes.ts
// I tre assi semantici del deviatore creativo (Improbability Engine)

export const DOMINI = [
  { id: 'archeologia', label: 'Archeologia', emoji: '🏛️' },
  { id: 'infanzia', label: 'Infanzia', emoji: '🧸' },
  { id: 'burocrazia', label: 'Burocrazia', emoji: '📋' },
  { id: 'mitologia', label: 'Mitologia', emoji: '⚡' },
  { id: 'cucina', label: 'Cucina', emoji: '🍳' },
  { id: 'anatomia', label: 'Anatomia', emoji: '🫀' },
  { id: 'meteorologia', label: 'Meteorologia', emoji: '🌦️' },
  { id: 'artigianato', label: 'Artigianato', emoji: '✂️' }
] as const;

export const OPERAZIONI = [
  { id: 'inversione', label: 'Inversione' },
  { id: 'esagerazione', label: 'Esagerazione' },
  { id: 'miniaturizzazione', label: 'Miniaturizzazione' },
  { id: 'personificazione', label: 'Personificazione' },
  { id: 'sottrazione', label: 'Sottrazione' },
  { id: 'contraddizione', label: 'Contraddizione' },
  { id: 'ripetizione ossessiva', label: 'Ripetizione ossessiva' },
  { id: 'traduzione errata', label: 'Traduzione errata' }
] as const;

export const VINCOLI = [
  { id: 'referto medico', label: 'Referto medico' },
  { id: 'istruzioni IKEA', label: 'Istruzioni IKEA' },
  { id: 'preghiera', label: 'Preghiera' },
  { id: 'necrologio', label: 'Necrologio' },
  { id: 'ricetta', label: 'Ricetta' },
  { id: 'verbale di polizia', label: 'Verbale di polizia' },
  { id: 'lettera di reclamo', label: 'Lettera di reclamo' },
  { id: 'oroscopo', label: 'Oroscopo' }
] as const;

export type Dominio = typeof DOMINI[number]['id'];
export type Operazione = typeof OPERAZIONI[number]['id'];
export type Vincolo = typeof VINCOLI[number]['id'];
