# Iusful — Document Upload Wizard

Flusso guidato di caricamento documenti per l'avvio di una pratica legale, progettato attorno a un utente ansioso e poco familiare con il linguaggio giuridico.

**Demo live:** https://iusful-demo-0907.vercel.app
**Repository:** https://github.com/aicezhe/iusfulDemo

Ho scelto di seguire lo stile visivo esistente di Iusful — colori, tipografia, tono — invece di inventarne uno nuovo, per dimostrare che il componente si integrerebbe naturalmente nel prodotto reale, non come esercizio isolato. Le decisioni di prodotto e UX (struttura del flusso, testi, gestione degli errori, architettura dello stato, scelte di sicurezza) sono mie, elaborate a partire da un'analisi diretta del prodotto esistente.

---

## Il problema

Nella raccolta documenti di uno studio legale digitale, i clienti sono spesso ansiosi, non comprendono il gergo legale e caricano file errati o illeggibili — rallentando la propria stessa pratica.

Questo componente guida l'utente nel caricamento di due documenti fondamentali:

1. **Documento d'identità** (fronte/retro)
2. **Procura alle liti** (modulo da scaricare, firmare offline e ricaricare)

Nessun backend reale: lo stato è gestito in memoria e con `localStorage`, le chiamate API sono simulate con timeout.

---

## Stack e avvio

Next.js (App Router) · TypeScript · Tailwind CSS

```bash
npm install
npm run dev     # http://localhost:3002
npm test        # unit test sulla validazione file
```

---

## Struttura del flusso

1. **Intro** — benvenuto, rassicurazione sulla privacy
2. **Spiegazione** — cosa serve e perché, con tono rassicurante
3. **Documento d'identità** — caricamento fronte/retro · "Documento 1 di 2"
4. **Procura alle liti** — spiegazione, poi 3 sotto-passaggi in un unico step · "Documento 2 di 2"
5. **Successo** — conferma finale con riepilogo e tempistiche

Wizard multi-step su un'unica pagina, senza cambio di URL tra gli step: senza backend e senza persistenza cross-dispositivo, separare gli step su URL diversi non avrebbe portato benefici reali (non si potrebbe "riprendere da un link"), solo complessità di navigazione in più. Il progresso è comunicato tramite indicatore testuale, non tramite la barra degli indirizzi.

---

## Quali scelte UX ho fatto per ridurre l'ansia e prevenire gli errori

### Linguaggio: concretezza, non rassicurazioni generiche

Ho evitato affermazioni vaghe ("è facile", "niente stress") a favore di informazioni concrete e misurabili — *"Due documenti, senza complicazioni"*, *"Bastano 3 passaggi veloci"*, *"Riceverai una risposta entro poche ore"*. Per chi è in ansia, sapere **esattamente** quanto manca rassicura più di qualsiasi promessa astratta: l'incertezza è ciò che genera ansia, non la difficoltà in sé.

Nella gerarchia dei testi ho messo per primo il messaggio emotivo (*"Ti guidiamo passo dopo passo — non serve sapere nulla di legale"*) e solo dopo l'informazione funzionale ("ci servono 2 documenti"): prima si rassicura, poi si chiede.

### Prevenzione strutturale, non correzione a posteriori

Il modo migliore di gestire un errore è impedire che accada.

- I pulsanti "Avanti"/"Continua" sono **disabilitati** finché l'azione richiesta non è completata — invece di lasciare cliccare e poi mostrare un errore
- Il pulsante "Carica" della Procura resta disabilitato finché il modulo non è stato scaricato — l'unico percorso possibile è quello corretto, non esiste una "strada sbagliata" da imboccare
- Formati ammessi e dimensione massima sono indicati **dentro l'area di caricamento**, prima del tentativo, non solo nel messaggio di errore

### Errori: tono, colore, contenuto

**Colore.** Tutti gli stati di errore usano l'**arancione** del brand, mai il rosso. L'arancione è già parte della palette Iusful, è percettivamente più morbido, e in contrasto con il verde di base crea una segnalazione chiara ma non allarmante. Il rosso, per convenzione culturale, comunica "pericolo" — sproporzionato rispetto a un file di formato sbagliato.

**Iconografia.** Ho scelto un'icona di ricarica/riprova invece del classico triangolo di avvertimento: il triangolo con punto esclamativo, anche in arancione, richiama i segnali di pericolo. Un'icona che suggerisce "riprova" comunica che il problema è risolvibile, non che qualcosa si è rotto.

**Formulazione.** I messaggi dicono cosa è successo **e cosa fare**, in linguaggio quotidiano: mostro l'estensione reale del file caricato (*"Hai caricato un file .png"*), non un codice errore. Ogni errore ha un'uscita.

**Spiegazioni con schema visivo.** Per chi è in stato di nervosismo, ho aggiunto spiegazioni accompagnate da un piccolo schema grafico — come controllare il formato o il peso di un file — così che non debba cercare altrove mentre è già bloccato.

### Spiegare i termini legali, non solo i formati dei file

Avevo promesso *"non serve sapere nulla di legale"* nella schermata introduttiva — ma "Procura alle liti" resta un termine tecnico, e mostrarlo senza spiegazione avrebbe tradito quella promessa proprio nel punto in cui l'utente è più vulnerabile.

Ho aggiunto una spiegazione in linguaggio quotidiano, visibile subito, non nascosta in un accordion: *"In pratica, ci dai il permesso di parlare per te in tribunale — così non devi andarci di persona."* Nessun accordion qui, perché non è un dettaglio opzionale: è la comprensione minima necessaria per procedere con fiducia, non un extra per chi vuole approfondire.

### Stati UI — quattro stati, sempre distinguibili

Ogni punto di caricamento (documento d'identità fronte/retro, Procura) gestisce esplicitamente i 4 stati richiesti, ciascuno con una differenza visiva netta, non solo testuale:

- **Vuoto / in attesa** — bordo tratteggiato neutro, icona di upload, testo su formati e dimensione ammessi già visibile
- **Caricamento** — spinner attivo, elementi interattivi disabilitati (previene doppi invii)
- **Successo** — bordo e conferma di colore pieno, nome del file visibile, opzione "Cambia file"
- **Errore** — bordo arancione (mai rosso), messaggio con causa specifica e azione suggerita

La differenza non è solo cromatica ma strutturale: in nessuno dei quattro stati l'utente deve interpretare un'assenza di segnale come informazione — ogni stato comunica attivamente cosa sta succedendo.

### Verifica AI simulata

Dopo il caricamento di ciascun documento mostro *"I documenti vengono elaborati dall'IA…"*, poi *"Documento ricevuto"*. Non affermo mai che il documento sia *"verificato come firmato"*: nella demo quel controllo non esiste.

La simulazione non è un placeholder lasciato a metà — serve a rendere leggibile l'intero flusso del wizard, dal caricamento alla conferma, così che chi valuta il prototipo veda il percorso completo che l'utente vivrebbe. Non promette una funzionalità che non c'è.

### Progressive disclosure

Le spiegazioni opzionali (*"Come controllo il formato del file?"*) vivono in accordion chiusi di default, sullo stile della sezione FAQ del sito Iusful. Disponibili per chi ne ha bisogno, invisibili per chi non ne ha: un eccesso di informazione, come un eccesso di premure, può generare ansia invece di ridurla.

### Il momento del successo: calma, non euforia

Avevo esplorato transizioni più espressive per la conferma finale. Ho scelto invece una sequenza **lenta e morbida** (schiarimento e oscuramento progressivi, comparsa in dissolvenza) — perché un utente ansioso cerca **sollievo**, non sorpresa. Un'animazione improvvisa o vistosa, anche positiva, produce attivazione; una lenta produce distensione. Le animazioni rispettano `prefers-reduced-motion`.

Il successo intermedio (dopo il documento d'identità) è volutamente più sobrio del successo finale: la differenza di "peso" visivo comunica che uno è un checkpoint, l'altro la conclusione.

### Design: una gerarchia di colore, non una scelta estetica

Prima di scegliere i colori, ho deciso la loro **funzione**: ogni colore doveva avere un unico ruolo, mai sovrapposto ad un altro, così che l'occhio dell'utente potesse leggerlo come segnale, non come decorazione.

- **Verde** → base, struttura, ciò che è normale/completato. È il colore di "riposo" della pagina.
- **Arancione** → azione e attenzione — un CTA attivo, un passaggio in corso, un errore da correggere. Mai più di uno o due elementi arancioni per schermata: un accento che è ovunque smette di essere un accento.
- **Grigio/muted** → ciò che non richiede ancora attenzione (uno step futuro, un'etichetta strutturale come "Fronte"/"Retro").

Con questa gerarchia decisa a monte, i colori specifici sono venuti dal sito Iusful, per coerenza tematica: il **verde** come base — naturale, calmo, non affaticante — e l'**arancione** come accento, in corsivo nei titoli, ispirato all'uso che ne fa il sito originale. Le **linee decorative con punto**, in alto e in basso, sono ispirate al punto tra "ius" e "ful" del logo: servono a "posare" la pagina, a darle un contenimento visivo — un ulteriore, silenzioso elemento di calma.

Le stesse linee con punto, oltre che nelle schermate di benvenuto, separano i **3 blocchi** della sezione Procura alle liti, dando struttura leggibile a uno step più articolato.

### Elementi specifici

**La ruota dei documenti.** Nella schermata del documento d'identità, i tipi accettati scorrono in una ruota verticale — un rimando allo stile del sito originale, e un modo per mostrare quattro opzioni senza occupare quattro righe di testo.

**Stato colore progressivo nella Procura.** Nei 3 sotto-passaggi, lo step attivo è arancione, quelli già completati tornano al colore normale, quelli futuri restano attenuati. L'utente vede sempre dove si trova, senza doverlo dedurre.

**Permesso di soggiorno tra i documenti accettati.** Non era esplicitamente richiesto dal task. Da straniera in Italia, so che molti utenti potenziali non hanno un documento italiano "standard": escluderli al primo passo è un problema di prodotto, non un dettaglio.

**Indicatore di progresso.** "Documento X di 2", sempre visibile durante il caricamento, mai nelle schermate di intro o successo — sapere quanto manca è metà della calma.

---

## Gestione errori

| Errore | Gestione |
|---|---|
| Formato non valido | Messaggio con l'estensione reale caricata; PDF, JPEG o PNG |
| File > 5MB | Compressione lato client per le immagini (pulsante "Comprimi"); alternativa suggerita per i PDF |
| File danneggiato/vuoto | Messaggio chiaro, invito a riprovare |
| Errore di rete (simulato) | ~10% casuale; deterministico se il nome file contiene "test-error" |
| Procedere senza aver caricato | Impedito strutturalmente (pulsante disabilitato) |
| Doppio click durante il caricamento | Elementi disabilitati durante lo stato di loading |

Il brief indicava i formati `es. PDF/JPEG`: ho letto `es.` come *esemplificativo*, non esaustivo, e ho incluso anche il **PNG** — è il formato prodotto da screenshot su Android e da molti scanner, quindi rifiutarlo punirebbe l'utente che segue la spec alla lettera.

### Come testare i diversi stati

Nella cartella `test-files/`:

| File | Stato attivato |
|---|---|
| `documento-formato-errato.txt` | Formato non valido |
| `documento-troppo-grande.pdf` (~6MB) | Dimensione eccessiva |
| `documento-vuoto.pdf` (0 byte) | File danneggiato |
| `test-error.pdf` | Errore di rete (deterministico) |
| `documento-valido.pdf` | Caricamento riuscito |

L'errore di rete è normalmente casuale (~10%), per simulare realisticamente una connessione instabile. Il trigger sul nome file lo rende verificabile senza affidarsi al caso.

---

## Decisioni tecniche

**Stato.** Un unico oggetto `documents`, con chiave per tipo (idFront/idBack/procura) e la stessa struttura per ciascuno (`{file, status, errorMessage}`). I tre documenti condividono forma dei dati e logica di gestione: un'unica struttura evita duplicazione e permette di riutilizzare lo stesso componente `FileUploadSlot` per tutti e tre.

**Persistenza.** `localStorage` per lo stato di avanzamento (solo i metadati, non i file — non serializzabili). In produzione, con un backend reale, salverei lo stato sul server ad ogni step completato, permettendo il ripristino da qualsiasi dispositivo.

**Stati UI.** Ogni punto di caricamento gestisce esplicitamente i 4 stati richiesti — vuoto/in attesa, caricamento, successo, errore — con differenze visive nette, così che l'utente non sia mai in una situazione ambigua.

**Verifica AI simulata.** Dopo il caricamento di ciascun documento mostro "I documenti vengono elaborati dall'IA…", poi "Documento ricevuto". Non affermo mai che il documento sia stato *"verificato come firmato"*: nella demo quel controllo non avviene. La simulazione serve a rendere leggibile il flusso completo del wizard, non a promettere una funzionalità inesistente.

**Test.** Unit test sulla logica di validazione file (`lib/fileValidation.ts`) — pura logica, senza side-effect, la parte più critica e più facilmente testabile. Non ho coperto l'intero progetto: ho preferito concentrare il tempo sull'esperienza utente, che era il focus richiesto.

---

## Sicurezza: una scelta consapevole

Avevo considerato di inserire link a servizi esterni per comprimere o convertire i file (es. iLovePDF): dal punto di vista dell'usabilità pura, sarebbe stata una scorciatoia comoda.

L'ho **deliberatamente esclusa**. Inviare un documento d'identità a un servizio di terze parti non verificato contraddice i principi di protezione dei dati che Iusful comunica esplicitamente (GDPR, "massima protezione dei dati"). Ho risolto lo stesso problema in modo più sicuro: **compressione lato client tramite Canvas API**, eseguita interamente nel browser dell'utente — il file non lascia mai il dispositivo.

---

## Cosa NON ho implementato, e perché

- **Link esterni per compressione/conversione** — sostituiti con compressione lato client (vedi sopra)
- **Verifica AI reale del contenuto** — richiede un backend, fuori dallo scope del task; simulata con disclaimer onesto
- **Backend reale** — esplicitamente escluso dal task
- **Cookie banner** — nessun tracciamento reale nella demo

---

## Se avessi avuto più tempo

**Assistenza allo scatto: correggere la foto prima che venga scattata, non dopo.**

Oggi la validazione avviene dopo il caricamento: l'utente scatta, carica, e solo allora scopre che la foto è sfocata, scura o tagliata. È correzione, non prevenzione — l'opposto del principio che ho seguito in tutto il resto del flusso.

Con più tempo porterei la fotocamera dentro il flusso (`getUserMedia`) invece di delegarla all'app di sistema, e analizzerei i fotogrammi in tempo reale, prima dello scatto:

- **Bordi e inquadratura** — riconoscimento del rettangolo del documento: rientra tutto nell'inquadratura, nessun angolo tagliato, distanza corretta
- **Messa a fuoco** — varianza del laplaciano sul fotogramma, per intercettare la sfocatura prima che diventi un file illeggibile
- **Luce e riflessi** — istogramma di luminanza: zone bruciate dal flash sulla banda plastificata, foto troppo scura

Il feedback compare sopra l'immagine mentre l'utente inquadra — *«Avvicinati»*, *«Troppo buio»*, *«Un angolo esce dall'inquadratura»* — e l'otturatore si attiva solo quando l'inquadratura è corretta. L'utente non riceve un errore: riceve una conferma, mentre sta ancora facendo la cosa. È lo stesso principio dei pulsanti disabilitati, applicato al gesto invece che al form.

**Dove sta il confine col backend.** I controlli geometrici e di qualità — bordi, sfocatura, luce — sono euristiche leggere, eseguibili interamente nel browser su canvas: nessun fotogramma lascia il dispositivo, coerentemente con la scelta fatta per la compressione. Il riconoscimento del *tipo* di documento e la verifica che i campi attesi siano effettivamente leggibili richiedono invece un modello di visione lato server. Lo terrei come secondo livello, dopo lo scatto e prima dell'invio all'avvocato — non durante l'inquadratura, dove la latenza di rete renderebbe il feedback inutile.

**Cosa misurerei prima di costruirlo.** La fotocamera nativa del telefono ha HDR, stabilizzazione e autofocus migliori di quelli accessibili via `getUserMedia`: sostituirla significa scambiare qualità dell'immagine con qualità della guida. Non darei per scontato che il baratto convenga. Misurerei prima la percentuale di documenti rifiutati per illeggibilità con lo scatto nativo; se il problema è l'inquadratura, la guida in tempo reale vince. Se è la messa a fuoco, la soluzione giusta resta lo scatto nativo, seguito da un controllo immediato sulla stessa schermata — con la possibilità di riscattare senza uscire dal flusso.

**Metriche da tracciare per capire dove i clienti si bloccano:**
- **Drop-off per step** — su quale schermata si abbandona di più (identifica il punto di attrito)
- **Tentativi falliti prima del successo**, per tipo di errore — se molti sbagliano formato, il problema è la comunicazione, non l'utente
- **Tempo medio per step e complessivo** — uno step molto più lento degli altri indica confusione
- **Percentuale di apertura degli accordion informativi** — se quasi tutti li aprono, quell'informazione dovrebbe essere visibile di default; se quasi nessuno, è ben nascosta
- **Tasso di abbandono dopo un errore** — misura quanto un messaggio di errore è davvero "non frustrante"

Queste metriche insieme dicono non solo *dove* ci si blocca, ma *perché*: un drop-off alto senza errori significa che l'utente non ha capito cosa fare; un drop-off alto dopo errori significa che il messaggio non lo ha aiutato a uscirne.

**Esperienza desktop arricchita.** Il flusso è responsive e funziona su desktop, ma è stato progettato mobile-first come richiesto. Con più tempo sfrutterei meglio lo spazio orizzontale disponibile su schermi grandi: layout affiancati, stati hover più ricchi, anteprima del documento caricato accanto all'area di upload.

**Più animazioni e micro-interazioni**, mantenendo la stessa filosofia: mai vistose, sempre al servizio della calma e della comprensione di ciò che sta accadendo.

**PDF pesanti e foto HEIC: le due lacune che restano.**
La compressione lato client via Canvas copre le immagini, non i PDF — un canvas non sa aprire un PDF. Oggi un PDF oltre i 5MB resta un vicolo cieco, mitigato solo da un suggerimento ("fotografa il documento invece di allegarlo"). Allo stesso modo, le foto HEIC dell'iPhone sono decodificabili da Safari ma non da tutti i browser.

Con più tempo coprirei entrambi i casi restando nel browser: rasterizzazione delle pagine con pdf.js e ricomposizione a risoluzione controllata per i PDF, libheif compilata in WebAssembly per l'HEIC. Non sarebbe una funzionalità in più: è la stessa scelta di sicurezza già fatta per le immagini, estesa ai due formati che oggi restano scoperti — il file continua a non lasciare mai il dispositivo dell'utente.

**Possibilità di tornare indietro** e sostituire un file già caricato in qualsiasi punto del flusso, con persistenza garantita del progresso.

---

## Processo di lavoro

Ho iniziato disegnando gli schermi a mano su iPad — struttura, gerarchia delle informazioni, punti di attrito da anticipare — prima di aprire l'editor. Le correzioni fini (spaziature, dettagli di layout, coerenza tra le schermate) sono arrivate dopo, direttamente sull'implementazione, confrontando ogni volta il risultato con l'intenzione originale dello schizzo.

Per l'implementazione ho usato Claude Code come assistente di sviluppo — per accelerare la scrittura di boilerplate e la messa a punto tecnica. Le decisioni di prodotto, il flusso, i testi, la gerarchia visiva, la gestione degli errori e le scelte di sicurezza restano mie: l'ho usato per scrivere codice più in fretta, non per pensare al posto mio. Ogni componente generato è stato letto, capito e corretto quando necessario, non semplicemente accettato.
