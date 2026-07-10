# Iusful: Document Upload Wizard

Flusso guidato di caricamento documenti per l'avvio di una pratica legale, progettato attorno a un utente ansioso e poco familiare con il linguaggio giuridico.

**Demo live:** https://iusful-demo-0907.vercel.app

**Repository:** https://github.com/aicezhe/iusfulDemo

Ho scelto di seguire lo stile visivo esistente di Iusful: colori, tipografia, tono invece di inventarne uno nuovo, per dimostrare che il componente si integrerebbe naturalmente nel prodotto reale. Le decisioni di prodotto e UX sono mie, elaborate a partire da un'analisi diretta del prodotto esistente.

---

## Il problema

Nella raccolta documenti di uno studio legale digitale, i clienti sono spesso ansiosi, non comprendono il gergo legale e caricano file errati o illeggibili rallentando la propria stessa pratica. Il flusso guida l'utente nel caricamento di due documenti: **documento d'identità** (fronte/retro) e **procura alle liti** (modulo da scaricare, firmare offline e ricaricare). Nessun backend reale: stato in memoria e `localStorage`, chiamate API simulate.

---

## "- Quali scelte UX ho fatto per ridurre l'ansia dell'utente e prevenire errori prima che avvengano?"

**Linguaggio concreto, non rassicurazioni generiche.** *"Due documenti, senza complicazioni"*, *"Bastano 3 passaggi veloci"* sapere esattamente quanto manca rassicura più di una promessa vaga: l'incertezza genera ansia, non la difficoltà in sé. Il messaggio emotivo viene sempre prima di quello funzionale.

**Prevenzione strutturale, non correzione a posteriori.** I pulsanti "Avanti"/"Continua" restano disabilitati finché l'azione richiesta non è completata. Il pulsante "Carica" della Procura resta disabilitato finché il modulo non è confermato firmato non con un avviso ("assicurati che...") ma con una checkbox esplicita, perché la firma avviene fuori dall'app e nulla può dedurla da sola. Formati e dimensione massima sono indicati dentro l'area di caricamento, prima del tentativo.

**Errori: mai rossi, sempre con un'uscita.** Tutti gli stati di errore usano l'arancione del brand percettivamente più morbido, coerente con la palette. Icona di "riprova" invece del triangolo di allarme. I messaggi dicono cosa è successo *e* cosa fare, in linguaggio quotidiano (*"Hai caricato un file .png"*, non un codice errore), con schemi visivi per chi è troppo in ansia per interpretare solo testo.

**Spiegare i termini legali, non solo i formati.** Avevo promesso *"non serve sapere nulla di legale"* ma "Procura alle liti" resta un termine tecnico. Spiegazione in linguaggio quotidiano, visibile subito, non in un accordion: non è un dettaglio opzionale nel punto in cui l'utente è più vulnerabile.

**Quattro stati UI, sempre distinguibili.** Vuoto, caricamento, successo, errore: ogni stato comunica attivamente cosa succede, mai un'assenza di segnale da interpretare.

**Onestà nella verifica simulata.** Dopo il caricamento mostro *"I documenti vengono elaborati dall'IA…"*, poi *"Documento ricevuto"* mai *"verificato come firmato"*, perché quel controllo non esiste nella demo.

**Calma anche nel successo.** La conferma finale usa una dissolvenza lenta, non un'animazione vistosa: un utente ansioso cerca sollievo, non sorpresa. Il checkpoint intermedio (dopo il documento d'identità) è volutamente più sobrio della conferma finale, per comunicare la differenza di "peso" tra i due momenti.

**Una gerarchia di colore col proprio ruolo.** Verde = base/normale, arancione = azione/attenzione (mai più di uno o due elementi per schermata), grigio = non richiede ancora attenzione. Le linee decorative con punto, ispirate al punto tra "ius" e "ful" del logo, danno un contenimento visivo alle sezioni più articolate.

**Permesso di soggiorno tra i documenti accettati.** Non richiesto esplicitamente dal task. Da straniera in Italia, so che molti utenti non hanno un documento italiano "standard": escluderli al primo passo è un problema di prodotto.

**I file caricati sopravvivono alla navigazione.** Tornare indietro e poi avanti nel wizard non fa perdere il file già scelto (stato sollevato al componente wizard, che resta montato). Non sopravvive invece a un refresh della pagina — un `File` in memoria non è serializzabile, per lo stesso motivo per cui non può stare in `localStorage`.

---

## "- Se avessi più tempo, quali metriche traccheresti per capire dove i clienti si bloccano in questa schermata e come miglioreresti il prodotto?"

**Metriche.** Drop-off per step (dove si abbandona di più) · tentativi falliti prima del successo, per tipo di errore (se molti sbagliano formato, il problema è la comunicazione, non l'utente) · tempo medio per step (uno step anomalo indica confusione) · percentuale di apertura degli accordion informativi (se quasi tutti li aprono, quell'info dovrebbe essere visibile di default) · tasso di abbandono dopo un errore (misura quanto un messaggio è davvero "non frustrante"). Insieme dicono non solo *dove* ci si blocca ma *perché*: drop-off senza errori significa che l'utente non ha capito cosa fare, drop-off dopo errori che il messaggio non lo ha aiutato a uscirne.

**Assistenza allo scatto, prima non dopo.** Oggi la foto si valida dopo il caricamento: correzione, non prevenzione, l'opposto del principio seguito nel resto del flusso. Porterei la fotocamera dentro il flusso (`getUserMedia`) e analizzerei bordi/inquadratura, messa a fuoco (varianza del laplaciano) e luce in tempo reale, con feedback tipo *«Avvicinati»*, *«Troppo buio»* prima dello scatto. Controlli geometrici via canvas nel browser (i frame non lasciano il dispositivo); riconoscimento del tipo di documento e leggibilità dei campi via modello lato server, dopo lo scatto - non durante, dove la latenza renderebbe il feedback inutile. Prima di costruirlo misurerei se il problema reale è l'inquadratura o la messa a fuoco: la fotocamera nativa ha HDR e autofocus migliori di `getUserMedia`, non è uno scambio scontato.

**PDF pesanti e HEIC.** La compressione via Canvas copre le immagini, non i PDF (un canvas non apre un PDF); le foto HEIC dell'iPhone non sono decodificabili ovunque. Risolverei restando nel browser: pdf.js per rasterizzare e ricomprimere i PDF, libheif in WebAssembly per l'HEIC - stessa scelta di sicurezza già fatta per le immagini, estesa ai formati scoperti.

**Più sperimentazione nel design.** Con più tempo avrei esplorato ulteriori soluzioni visive e micro-interazioni - restando nella stessa filosofia di calma, mai vistosità fine a sé stessa. Il design in questo prototipo è deliberatamente sobrio perché era la scelta giusta per l'utente target; con più margine, mi sarebbe piaciuto testare varianti diverse e vedere quali riducono davvero l'ansia meglio delle altre, non solo per intuizione.

**Altro:** esperienza desktop più ricca (layout affiancati, anteprima accanto all'upload) · più micro-interazioni, stessa filosofia di calma · sostituire il modulo di compressione fisso con uno adattivo che misura prima la % di documenti rifiutati per illeggibilità.

---

## Stack e avvio

Next.js (App Router) · TypeScript · Tailwind CSS

```bash
npm install
npm run dev     # http://localhost:3002
npm test        # unit test sulla validazione file
```

## Struttura del flusso

1. **Intro**: benvenuto, rassicurazione sulla privacy
2. **Spiegazione**: cosa serve e perché
3. **Documento d'identità**: fronte/retro · "Documento 1 di 2"
4. **Procura alle liti**: spiegazione, poi 3 sotto-passaggi · "Documento 2 di 2"
5. **Successo**: conferma finale con riepilogo

Wizard su un'unica pagina, senza cambio di URL tra gli step: senza backend e persistenza cross-dispositivo, separare gli step su URL diversi avrebbe aggiunto solo complessità di navigazione senza benefici reali.

## Gestione errori

| Errore | Gestione |
|---|---|
| Formato non valido | Messaggio con l'estensione reale caricata; solo PDF o JPEG |
| File > 5MB | Compressione lato client per le immagini; alternativa suggerita per i PDF |
| File danneggiato/vuoto | Messaggio chiaro, invito a riprovare |
| Errore di rete (simulato) | ~10% casuale; deterministico se il nome file contiene "test-error" |
| Procedere senza aver caricato | Impedito strutturalmente (pulsante disabilitato) |

Test manuale in `test-files/`: `documento-formato-errato.txt`, `documento-troppo-grande.pdf`, `documento-vuoto.pdf`, `test-error.pdf` (errore di rete deterministico), `documento-valido.pdf`.

## Decisioni tecniche

**Stato.** Un oggetto per documento con la stessa struttura (`{file, status, errorMessage}`) un'unica struttura evita duplicazione e permette di riusare `FileUploadSlot` per tutti e tre.

**Persistenza - due livelli.** `localStorage` per l'avanzamento tra sessioni (solo metadati, mai i file non serializzabili). I file selezionati durante la sessione vivono in memoria, sollevati al componente wizard, così sopravvivono alla navigazione avanti/indietro ma non a un refresh della pagina.

**Test.** Unit test sulla validazione file (`lib/fileValidation.ts`): logica pura, la parte più critica. Non ho coperto l'intero progetto: ho preferito concentrare il tempo sull'esperienza utente.

## Sicurezza

Avevo considerato link a servizi esterni per comprimere i file - scorciatoia comoda ma in contraddizione con i principi di protezione dati che Iusful comunica (GDPR). Ho risolto con **compressione lato client via Canvas API**: il file non lascia mai il dispositivo.

## Cosa NON ho implementato, e perché

- **Link esterni per compressione**: sostituiti con compressione lato client
- **Verifica AI reale del contenuto**: richiede un backend, fuori scope; simulata con disclaimer onesto
- **Backend reale**: esplicitamente escluso dal task
- **Cookie banner**: nessun tracciamento reale nella demo

## Processo di lavoro

Ho iniziato disegnando gli schermi a mano su iPad: struttura, gerarchia delle informazioni, punti di attrito da anticipare - prima di aprire l'editor. Per l'implementazione ho usato Claude Code come assistente di sviluppo, per accelerare la scrittura del codice. Le decisioni di prodotto, il flusso, i testi, la gestione degli errori e le scelte di sicurezza restano mie: ogni componente generato è stato letto, capito e corretto quando necessario.
