// src/lib/concepts-data.ts
// 32 concept pre-generati per la demo statica
// Ogni concept ha 3 idee, generate da una combinazione di parametri

export interface Idea {
  prodotto: string;
  concept: string;
  manifestazione: string;
}

export interface ConceptSet {
  id: string;
  dominio: string;
  operazione: string;
  vincolo: string;
  ideas: [Idea, Idea, Idea];
}

export const CONCEPT_SETS: ConceptSet[] = [
  {
    id: 'archeologia-sottrazione-referto',
    dominio: 'archeologia',
    operazione: 'sottrazione',
    vincolo: 'referto medico',
    ideas: [
      {
        prodotto: 'Reperto — linea di acqua minerale',
        concept: 'Il packaging non comunica nulla del prodotto. Mostra solo la stratigrafia geologica del luogo da cui l\'acqua proviene, con datazione al carbonio 14 e profondità della falda.',
        manifestazione: 'Etichetta in bianco e nero con sezione geologica tecnica, numero di catalogo, coordinate GPS. Comunicazione in forma di referti analitici pubblicati senza claim.'
      },
      {
        prodotto: 'Sito — app di dating',
        concept: 'I profili degli utenti vengono presentati come schede di scavo archeologico. Niente foto, niente bio. Solo una mappa di reperti emotivi datati: la prima delusione (1998), un trasloco (2014), una passione abbandonata (2019).',
        manifestazione: 'Lancio con un finto report dell\'Istituto Centrale per il Restauro che cataloga i sentimenti di un singolo utente come patrimonio culturale.'
      },
      {
        prodotto: 'Strato — consulenza fiscale',
        concept: 'L\'azienda si presenta sottraendo tutto il linguaggio della consulenza fiscale. Solo referti che descrivono lo stato fiscale del cliente come un sito archeologico da preservare.',
        manifestazione: 'Report annuale al cliente in forma di pubblicazione scientifica, con tavole illustrate e una sezione "ritrovamenti dell\'anno fiscale corrente".'
      }
    ]
  },
  {
    id: 'infanzia-esagerazione-preghiera',
    dominio: 'infanzia',
    operazione: 'esagerazione',
    vincolo: 'preghiera',
    ideas: [
      {
        prodotto: 'Merendazione — merenda per adulti',
        concept: 'Una linea di snack per adulti che riprende esattamente i sapori dell\'infanzia ma in formato monumentale. Il claim è una litania: "Dacci oggi la nostra merenda quotidiana."',
        manifestazione: 'Spot in stile coro liturgico in cui adulti in giacca recitano preghiere alla bustina di patatine al ketchup. Packaging gigante, doppio del normale.'
      },
      {
        prodotto: 'Cameretta — sneaker adulto',
        concept: 'Sneaker che hanno cucite all\'interno una piccola tasca per "i tesori dell\'infanzia". Vengono lanciate come oggetti di culto, con un libretto di preghiere allegato.',
        manifestazione: 'Apertura store come una cappella: candele, panche di legno, e una sola scarpa al centro su un piedistallo. Niente musica, solo voci registrate di bambini che cantano.'
      },
      {
        prodotto: 'Pluto — assicurazione vita',
        concept: 'L\'assicurazione si presenta come una preghiera che il bambino-che-sei-stato fa per l\'adulto-che-sei-diventato. Ogni polizza è una novena di 9 giorni.',
        manifestazione: 'Brochure stampata su carta velina come libretto da messa. Il sito web ha un solo bottone: "Pregare per il proprio futuro".'
      }
    ]
  },
  {
    id: 'burocrazia-personificazione-necrologio',
    dominio: 'burocrazia',
    operazione: 'personificazione',
    vincolo: 'necrologio',
    ideas: [
      {
        prodotto: 'Moduletto — servizio di compilazione documenti',
        concept: 'Il servizio personifica ogni modulo come una persona defunta. Quando completi un F24, ricevi il necrologio del modulo: "Ha vissuto 47 minuti, ha sofferto, ora riposa."',
        manifestazione: 'App che mostra un piccolo necrologio animato a ogni invio. Affissioni in stile manifesto funebre comunale per pubblicizzare le scadenze fiscali.'
      },
      {
        prodotto: 'Bollatore — bar dei pendolari',
        concept: 'Catena di bar dove ogni timbro su una tessera fedeltà è un piccolo addio. La decima consumazione viene celebrata con un necrologio della tua giornata burocratica.',
        manifestazione: 'Tovaglietta a forma di necrologio del lunedì appena finito. Caffè servito con bigliettino: "Riposa in pace, modulo 730/2026."'
      },
      {
        prodotto: 'Coda — radio per uffici postali',
        concept: 'Una radio che trasmette solo necrologi di pratiche burocratiche personificate. "È morto oggi, dopo lunga sofferenza, il certificato di residenza in carta semplice."',
        manifestazione: 'Diffusione in sale d\'attesa di poste, ASL, motorizzazione. Una voce maschile e profonda legge necrologi di moduli ogni 4 minuti.'
      }
    ]
  },
  {
    id: 'mitologia-miniaturizzazione-ricetta',
    dominio: 'mitologia',
    operazione: 'miniaturizzazione',
    vincolo: 'ricetta',
    ideas: [
      {
        prodotto: 'Olimpietto — caramelle gommose',
        concept: 'Ogni caramella è uno degli dèi dell\'Olimpo in miniatura. La confezione è una ricetta che spiega come "assemblare" un pantheon completo nello stomaco.',
        manifestazione: 'Box a forma di libro di cucina antica. Spot animato in cui Zeus ridotto a 2cm spiega come va dosato con Afrodite per ottenere "una buona digestione del divino".'
      },
      {
        prodotto: 'Mitettino — gioielleria',
        concept: 'Linea di gioielli che racchiudono mini-rituali pagani. Ogni anello ha incisa una ricetta per invocare un dio minore (5 minuti di silenzio + 3 olive + 1 acqua di mare).',
        manifestazione: 'Vetrine come tavoli da cucina antica. Ogni gioiello è venduto con una ricetta calligrafata su carta da forno.'
      },
      {
        prodotto: 'Eroino — caffè in capsule',
        concept: 'Capsule di caffè dedicate a mini-eroi mitologici dimenticati. Ogni capsula è una ricetta: 30 secondi di acqua a 92° + il pensiero fisso su Bellerofonte.',
        manifestazione: 'Confezione come ricettario greco. Sulla capsula, in greco antico, l\'ingrediente segreto: "una piccola viltà".'
      }
    ]
  },
  {
    id: 'cucina-personificazione-istruzioni-ikea',
    dominio: 'cucina',
    operazione: 'personificazione',
    vincolo: 'istruzioni IKEA',
    ideas: [
      {
        prodotto: 'PADELLINI — set posate',
        concept: 'Le posate hanno tutte un nome proprio (Giorgio il cucchiaio, Anna la forchetta) e vengono vendute con un manuale di istruzioni IKEA dove insegni loro a stare al loro posto nel cassetto.',
        manifestazione: 'Manuale 32 pagine a colori. Spot: una famiglia monta le posate come si monta un mobile. "Step 7: presentare Giorgio ad Anna."'
      },
      {
        prodotto: 'BÅSILICA — basilico in vaso',
        concept: 'Il basilico viene venduto come un coinquilino. Manuale IKEA per il primo mese di convivenza: come svegliarlo, come parlargli, come gestire le sue paranoie da bassa luminosità.',
        manifestazione: 'Vaso bianco con istruzioni illustrate. Pagina centrale: "Step 14 — Ascolta i suoi problemi senza interromperlo. Non bagnarlo mentre piange."'
      },
      {
        prodotto: 'CARBÖNARA — kit pasta',
        concept: 'Kit per la carbonara dove ogni ingrediente è un personaggio con un ruolo. Il pecorino è il vecchio severo, l\'uovo il novellino timido. Le istruzioni IKEA spiegano come farli andare d\'accordo.',
        manifestazione: 'Box con sagome a fumetti degli ingredienti. Una pagina su come gestire la lite tra guanciale e pancetta ("non vanno presentati nello stesso pasto").'
      }
    ]
  },
  {
    id: 'anatomia-inversione-verbale-polizia',
    dominio: 'anatomia',
    operazione: 'inversione',
    vincolo: 'verbale di polizia',
    ideas: [
      {
        prodotto: 'Inversa — palestra',
        concept: 'Una palestra dove gli organi si allenano e i muscoli stanno fermi. Ogni sessione è documentata in un verbale di polizia: "ore 19:45, il fegato ha eseguito 12 ripetizioni di filtraggio."',
        manifestazione: 'L\'ingresso è una caserma. Lo schermo di sala mostra verbali in tempo reale. Manifesto: "Il cuore ha confessato. Ora tocca al pancreas."'
      },
      {
        prodotto: 'Reato — yogurt probiotico',
        concept: 'Lo yogurt non aiuta la digestione, la denuncia. Ogni vasetto contiene un verbale fittizio: i fermenti hanno arrestato un batterio cattivo, ecco il rapporto in tre punti.',
        manifestazione: 'Etichetta sostituita da fotocopia di verbale carabinieri. Confezione da 4 vasetti = 4 deposizioni allegate.'
      },
      {
        prodotto: 'Contrario — terapia psicologica online',
        concept: 'Servizio dove invece di parlare al terapeuta sei tu a interrogarlo. Ogni seduta è un verbale di interrogatorio in cui chiedi al tuo inconscio dove si trovava la sera del 13.',
        manifestazione: 'Interfaccia web come scrivania da commissariato. Il terapeuta-AI risponde sempre con "non ricordo" o "preferirei non rispondere senza il mio legale".'
      }
    ]
  },
  {
    id: 'meteorologia-contraddizione-oroscopo',
    dominio: 'meteorologia',
    operazione: 'contraddizione',
    vincolo: 'oroscopo',
    ideas: [
      {
        prodotto: 'Tempesta — ombrelli',
        concept: 'Ombrelli che si aprono solo con il sole. Ogni ombrello viene venduto con un oroscopo personalizzato che predice esattamente quando NON pioverà, e quindi quando usarlo.',
        manifestazione: 'App collegata: "Acquario, oggi splende. Apri l\'ombrello alle 14:30 per attivare la protezione UV mistica."'
      },
      {
        prodotto: 'Nebbia — occhiali da vista',
        concept: 'Occhiali che vedono meno quando c\'è troppa luce. Ogni paio ha un oroscopo inciso all\'interno della stanghetta: "Vergine, oggi guarderai male un ex collega."',
        manifestazione: 'Boutique in cui ogni cliente riceve un oroscopo ottico, una previsione di cosa vedrà male nei prossimi 7 giorni.'
      },
      {
        prodotto: 'Sereno — antidepressivo da banco',
        concept: 'Una caramella ufficiale "contro il bel tempo": serve quando il sole ti deprime perché ti ricorda che dovresti essere felice. L\'oroscopo prevede ogni giorno il livello di "tirannia solare".',
        manifestazione: 'Confezione in stile carta meteorologica vintage. Bollettino quotidiano: "Domani Pesci sotto attacco di sereno: rifugiarsi all\'ombra."'
      }
    ]
  },
  {
    id: 'artigianato-traduzione-errata-lettera-reclamo',
    dominio: 'artigianato',
    operazione: 'traduzione errata',
    vincolo: 'lettera di reclamo',
    ideas: [
      {
        prodotto: 'Maeströ — corsi di ceramica',
        concept: 'Ogni corso viene venduto come un reclamo formale tradotto male dal coreano. "Egregio futuro artigiano, l\'argilla protesta formalmente contro la sua incompetenza. Pagare 240 euro per appianare divergenza."',
        manifestazione: 'Sito web in linguaggio bot-translate. Stamperie con tazze su cui è stampato un reclamo in stile google-translate del 2008.'
      },
      {
        prodotto: 'Mani — guanti da lavoro',
        concept: 'Guanti venduti con istruzioni d\'uso tradotte tre volte: italiano → giapponese → swahili → italiano. Diventano poesia involontaria e sembrano una lettera di protesta contro le mani umane.',
        manifestazione: 'Tag in cucitura con testo poetico-burocratico: "Le dita sono inquilini illegali. Pagare cauzione di 14 ore al mese al guanto sinistro."'
      },
      {
        prodotto: 'Filo — corso di sartoria',
        concept: 'Brochure scritta come una lettera di reclamo che il filo ha mandato all\'allievo: "Il sottoscritto Cotone Egiziano Q4 reclama la mancanza di rispetto durante la cucitura del 12 novembre."',
        manifestazione: 'Direct mailing in busta con timbro "RACCOMANDATA — AGITAZIONE TESSILE". Dentro, una lettera del filo ai potenziali allievi.'
      }
    ]
  }
];

// Funzione per estrarre 1 set casuale
export function getRandomConceptSet(): ConceptSet {
  return CONCEPT_SETS[Math.floor(Math.random() * CONCEPT_SETS.length)];
}

// Funzione per estrarre 1 set casuale diverso dall'ultimo
export function getNextConceptSet(lastId?: string): ConceptSet {
  const available = lastId
    ? CONCEPT_SETS.filter(c => c.id !== lastId)
    : CONCEPT_SETS;
  return available[Math.floor(Math.random() * available.length)];
}

// Filtra per dominio specifico (per il tasto Topic)
export function getConceptByDomain(dominio: string): ConceptSet | null {
  const matches = CONCEPT_SETS.filter(c => c.dominio === dominio);
  if (matches.length === 0) return null;
  return matches[Math.floor(Math.random() * matches.length)];
}

// Remix: trova un concept con almeno 1 parametro in comune con quello attuale
export function remixConcept(current: ConceptSet): ConceptSet {
  const candidates = CONCEPT_SETS.filter(c =>
    c.id !== current.id &&
    (c.dominio === current.dominio ||
      c.operazione === current.operazione ||
      c.vincolo === current.vincolo)
  );
  if (candidates.length === 0) return getRandomConceptSet();
  return candidates[Math.floor(Math.random() * candidates.length)];
}
