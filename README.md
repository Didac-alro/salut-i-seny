# Salut i seny · Guia per publicar l'app

Aquesta és la **versió 2** de Salut i seny, preparada per funcionar fora de claude.ai.
Novetats respecte a la versió de claude.ai:

- **Compte amb correu i contrasenya**: les dades són només teves.
- **Cerca a Open Food Facts en temps real** (per nom o marca) i **escàner de codis de barres** amb la càmera.
- **Funciona sense connexió** i es pot instal·lar al mòbil com una app (PWA).
- **Sincronització en temps real** entre el mòbil i l'ordinador.
- **IA opcional** (cerca amb IA i lectura de fotos d'etiquetes) a través d'una funció segura.

Temps aproximat: **30-45 minuts** la primera vegada. No cal saber programar.

---

## Què necessites

| Servei | Per a què | Cost |
|---|---|---|
| **GitHub** (github.com) | Publicar l'app | Gratuït |
| **Supabase** (supabase.com) | Base de dades i inici de sessió | Gratuït (pla Free) |
| **Anthropic API** (console.anthropic.com) | IA dins de l'app (opcional) | Pagament per ús |

---

## Pas 1 · Crear la base de dades (Supabase)

1. Entra a **supabase.com** i crea un compte.
2. **New project**:
   - Nom: `salut-i-seny`
   - Contrasenya de la base de dades: genera'n una i guarda-la.
   - **Region: Europe (Frankfurt o Irlanda)** — les dades de salut, millor a Europa.
3. Quan el projecte estigui a punt, ves a **SQL Editor → New query**, enganxa tot el contingut del fitxer `supabase/schema.sql` i prem **Run**. Ha de dir *Success*.
4. Ves a **Project Settings → API** i copia:
   - **Project URL** (`https://xxxx.supabase.co`)
   - **anon public key** (una clau llarga que comença per `eyJ...`)
5. Obre el fitxer **`config.js`** i enganxa-hi aquests dos valors.

> La clau *anon* és pública per disseny. Les regles de seguretat (RLS) de l'`schema.sql` fan que cada usuari només pugui veure les seves pròpies dades.

## Pas 2 · Publicar l'app (GitHub Pages)

1. Entra a **github.com**, crea un compte i ves a **github.com/new**.
2. Nom del repositori: `salut-i-seny`. Marca'l com a **Public** (GitHub Pages és gratuït per a repositoris públics; **les teves dades no hi van**, viuen a Supabase).
3. **Add file → Upload files** i puja **tot el contingut d'aquesta carpeta** (`index.html`, `config.js`, `manifest.webmanifest`, `sw.js`, `.nojekyll` i les carpetes `icons` i `supabase`). Prem **Commit changes**.
4. Ves a **Settings → Pages**: a *Source* tria **Deploy from a branch**, branca **main**, carpeta **/ (root)** i prem **Save**.
5. En 1-2 minuts l'app estarà a: `https://EL-TEU-USUARI.github.io/salut-i-seny/`

## Pas 3 · Configurar l'inici de sessió

1. A Supabase: **Authentication → URL Configuration**:
   - **Site URL**: l'adreça de GitHub Pages del pas anterior.
   - **Redirect URLs**: afegeix-hi la mateixa adreça.
2. **Authentication → Providers → Email**: ha d'estar activat.
   - Si no vols haver de confirmar el correu en crear el compte, desactiva **Confirm email** (com que l'app és només per a tu, és raonable). Si el deixes activat, en crear el compte rebràs un correu per confirmar-lo.

## Pas 4 · Crear el teu compte i importar les dades

1. Obre l'adreça de l'app amb **Chrome** al mòbil.
2. Toca **"No tens compte? Crea'n un"**, posa el correu i una contrasenya (mínim 8 caràcters).
3. Un cop dins: **⚙ Configuració → Importa una còpia de seguretat (JSON)** i tria el fitxer `salut-dades-copia.json` que t'he donat a part. Hi ha tots els teus registres i aliments.
4. Menú de Chrome **⋮ → Afegeix a la pantalla d'inici** (o *Instal·la l'aplicació*). Ja la tens com una app més.

> ⚠️ **No pugis mai `salut-dades-copia.json` a GitHub**: el repositori és públic.

## Pas 5 (opcional) · Activar la IA

Sense aquest pas l'app funciona igual, però la **cerca amb IA** i la **lectura de fotos d'etiquetes** no estaran disponibles (Open Food Facts i l'escàner sí). Si no la vols, posa `AI_ENABLED: false` a `config.js`.

1. Entra a **console.anthropic.com**, crea un compte, afegeix crèdit i crea una **API key**.
2. A Supabase: **Edge Functions → Deploy a new function → Via Editor**.
   - Nom de la funció: **`ai`** (exactament així).
   - Enganxa el contingut de `supabase/functions/ai/index.ts` i prem **Deploy**.
3. **Edge Functions → Secrets → Add new secret**:
   - Nom: `ANTHROPIC_API_KEY` · Valor: la teva clau.
   - (Opcional) `ANTHROPIC_MODEL` per canviar el model principal (per defecte `claude-sonnet-5-5`) i `ANTHROPIC_MODEL_QUICK` per al ràpid (per defecte `claude-haiku-5-5`).

La funció només respon a usuaris que han iniciat sessió a l'app, i la clau de l'API no surt mai del servidor.

---

## Actualitzar l'app més endavant

Quan tinguis una versió nova d'`index.html`, puja-la al repositori (**Add file → Upload files**, sobreescriu) i en un parell de minuts s'actualitzarà. **No tornis a pujar `config.js`** si ja té les teves claus, o torna-les a posar.

## Diferències amb la versió de claude.ai

- La skill **registre-salut** del xat escriu a la versió de claude.ai, no a aquesta.
- Les dues versions tenen dades separades. La còpia JSON et permet passar les dades d'una a l'altra.

## Problemes habituals

- **"Falta configurar Supabase al fitxer config.js"**: revisa que hi hagis enganxat la URL i la clau *anon*.
- **No puc entrar després de crear el compte**: confirma el correu o desactiva *Confirm email* (Pas 3).
- **"La IA ha trigat massa" o error de connexió amb Claude**: revisa que la funció es digui `ai` i que el secret `ANTHROPIC_API_KEY` estigui posat.
- **No es veuen canvis en una actualització**: tanca l'app i torna-la a obrir dues vegades (el service worker la refresca).
