This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Scelte di design (Document Upload Wizard)

**Compressione delle immagini lato client.** Quando una foto JPEG supera i 5MB, la demo
non propone un servizio esterno di conversione: i documenti d'identità sono dati
personali sensibili, e inviarli a un sito terzo non verificato contraddirebbe i valori
di sicurezza dei dati che Iusful comunica ai propri utenti. Al loro posto, la
compressione avviene interamente nel browser tramite Canvas API (`lib/compressImage.ts`):
il file non lascia mai il dispositivo dell'utente. È una scelta più solida di un semplice
link a un convertitore online, non una funzionalità mancante.

**Persistenza dello stato con localStorage.** In questa demo uso `localStorage` per
salvare solo lo *stato* di avanzamento di ogni caricamento (es. "success"), non il file
stesso — i `File` non sono serializzabili e comunque non dovrebbero restare sul
dispositivo. Se l'utente chiude la scheda e torna, vede un indicatore "caricato in
precedenza" ma deve ricaricare il file per procedere davvero. In produzione, con un
backend reale, salverei lo stato progressivamente sul server ad ogni step, permettendo
il ripristino da qualsiasi dispositivo.

## Come testare i diversi stati

Nella cartella `test-files/` del repository trovi file pronti per testare ogni stato:

- `documento-formato-errato.txt` → attiva l'errore di formato non valido
- `documento-troppo-grande.pdf` (~6MB) → attiva l'errore di dimensione
- `documento-vuoto.pdf` (0 byte) → attiva l'errore di file danneggiato
- `test-error.pdf` → attiva l'errore di rete in modo deterministico (per demo —
  normalmente è casuale, ~10% delle volte)
- `documento-valido.pdf` → carica con successo, per vedere lo stato Successo
