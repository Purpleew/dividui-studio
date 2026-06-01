// netlify/functions/generate-idea.js
//
// ⚠️ DISABILITATA — pronta per quando attivi l'AI vera
//
// Quando vorrai attivare Claude:
//   1. Crea un account su https://console.anthropic.com
//   2. Genera una API key
//   3. Su Netlify → Site settings → Environment variables → aggiungi:
//        ANTHROPIC_API_KEY = sk-ant-...
//   4. Decommenta il codice sotto
//   5. Su IdeaCanvas.vue, sostituisci la logica getRandomConceptSet()
//      con: fetch('/.netlify/functions/generate-idea', { method: 'POST', body: JSON.stringify({ dominio, operazione, vincolo }) })

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  // 🚧 DEMO MODE — restituisce un placeholder
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'AI mode disabilitato. Attiva ANTHROPIC_API_KEY su Netlify per usare Claude.',
      ideas: []
    })
  };

  /*
  // ============================================
  // ⬇️ DECOMMENTA QUANDO HAI L'API KEY ⬇️
  // ============================================

  const { dominio, operazione, vincolo } = JSON.parse(event.body);

  const SYSTEM_PROMPT = `Sei un generatore di concept pubblicitari improbabili.

Non hai brief, non hai cliente, non hai vincoli di mercato.
Il tuo compito è inventare concept pubblicitari completi partendo solo
da tre parametri di deviazione: un dominio semantico, un'operazione
cognitiva, un vincolo formale.

Ogni concept che produci deve contenere:
- Un prodotto o servizio inventato (anche assurdo, purché abbia coerenza interna)
- Un'idea creativa applicata a quel prodotto
- Una manifestazione concreta

Regole non negoziabili:
- Non produrre concept ragionevoli o vendibili
- Non spiegare la logica, lascia parlare l'idea
- Non usare lessico pubblicitario standard (innovativo, rivoluzionario, esperienza unica)
- Resta fedele ai tre parametri anche quando il risultato sembra assurdo
- Ogni concept deve poter essere descritto in 30 secondi

Produci tre concept distinti, non variazioni dello stesso.
Rispondi SOLO con un JSON valido nella forma:
{
  "ideas": [
    { "prodotto": "...", "concept": "...", "manifestazione": "..." },
    { "prodotto": "...", "concept": "...", "manifestazione": "..." },
    { "prodotto": "...", "concept": "...", "manifestazione": "..." }
  ]
}`;

  const userPrompt = `PARAMETRI DI DEVIAZIONE
Dominio di collisione: ${dominio}
Operazione cognitiva: ${operazione}
Vincolo formale: ${vincolo}

Genera tre concept pubblicitari completi applicando rigorosamente i tre parametri.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 2000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }]
      })
    });

    const data = await response.json();
    const textContent = data.content?.[0]?.text || '{}';

    // Extract JSON from response
    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dominio, operazione, vincolo,
        ideas: parsed.ideas
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
  */
};
