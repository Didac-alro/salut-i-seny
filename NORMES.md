# Salut i seny · Normes de l'app

Aquest document recull les decisions de disseny, dades i funcionament de l'app. Qualsevol canvi nou les ha de respectar. Si una norma canvia, s'actualitza aquí.

## 1. Principis
- **Mòbil primer.** Tot es dissenya i es prova primer al mòbil. A l'ordinador l'app es mostra com una columna de mòbil centrada.
- **En català**, amb un to proper, frases curtes i noms d'aliments curts.
- **Privacitat per sobre de tot.** Cada usuari només veu i modifica les seves dades.
- **Menys text, més visual.** Si una dada es pot entendre amb un color, una barra o una icona, no s'explica amb una frase.

## 2. Disseny
- **Un sol color principal** a tota l'app, que no canvia segons la secció. Per defecte, *coral sobre grafit*; cada usuari el pot canviar a Configuració (coral, verd sàlvia, blau oceà, morat profund).
- **Colors amb significat:**
  - Estats: verd = bé, ambre = atenció, vermell = alerta.
  - Paleta de dades fixa: proteïna (lila), hidrats/passos (ambre), greixos/aigua (turquesa). Sempre volen dir el mateix.
- **Icones:** Phosphor Duotone per a la interfície (dos tons, amb el color principal); Fluent Emoji (o l'estil triat) per als aliments, sobre una rajola suau. Les fotos reals de producte (Open Food Facts) tenen prioritat sobre les icones.
- **Patrons natius:** barra de pestanyes flotant amb botó «+», formularis en fulls que pugen des de baix, lliscar per editar (dreta) o esborrar (esquerra), «Desfés» després d'esborrar, títol que s'encongeix en desplaçar-se.
- **Moviment amb propòsit:** sense animacions en accions freqüents (canviar de pestanya). La línia de batec només batega en obrir l'app, en desar i en completar objectius.
- **Vibració** només en moments clau (desar, afegir, objectiu assolit, desfer).
- **Accessibilitat:** contrast mínim 4,5:1, zones tàctils de 44 px, respecte per «reduir animacions».
- **En escriure**, el menú inferior i el botó «+» s'amaguen.

## 3. Estructura
- **Seccions:** Inici · Pes · Activitat · Tensió · Nutrició (Avui · Tuppers · Aliments · Setmana · Consells).
- **El meu perfil** (icona de persona): dades personals, apartats actius i objectius.
- **Configuració** (engranatge): tema, color, icones, recordatoris, compte, privacitat, versió.
- **Mòduls:** cada usuari tria què fa servir (Nutrició, Aigua, Pes i mesures, Activitat, Tensió). El que es desactiva desapareix de tota l'app (menú, inici, observacions, calendari, botó «+», recordatoris).
- **Només s'obre una finestra (full) alhora.** Si se n'obre una des d'una altra, l'anterior es tanca. Cada ✕ tanca la seva.

## 4. Dades i nutrició
- **Pes cuinat** per defecte al registre del dia i als tuppers. **Pes en cru** a les receptes (amb pes final del plat cuinat).
- **Fonts per ordre:** Despensa → Open Food Facts → IA (Gemini) → Google.
- **Despensa compartida:** només la fitxa de l'aliment (nom, marca, valors per 100 g, foto, tipologia). Mai què menja ningú.
- **Privat de cada usuari:** registre del dia, tuppers, receptes en ús, pes, tensió, activitat, aigua, perfil i objectius.
- **Objectius** calculats a partir del perfil i de l'objectiu (perdre, mantenir, guanyar); l'objectiu adaptatiu els ajusta amb dades reals. Mínim de seguretat: 1.500 kcal (homes) / 1.200 kcal (dones).
- **Historial sense límit** a Supabase. L'exportació a Excel és la còpia de seguretat de cada usuari (recordatori cada 3 mesos).

## 5. Seguretat i privacitat
- Regles de la base de dades (RLS): **cada fila només la veu el seu propietari**.
- **Administrador** (secret `ADMIN_EMAILS`): l'únic que pot convidar amics i importar còpies JSON.
- L'app és **només per invitació**.
- **Cap clau privada al repositori de GitHub.** Les claus (Gemini, VAPID, CRON, SMTP) van als secrets de Supabase.
- **La còpia local del dispositiu queda lligada a cada usuari.** Si entra una altra persona, s'esborra. Mai es copien dades d'un compte a un altre.
- **A la IA només s'envia** la descripció del menjar o la foto de l'etiqueta; mai dades personals.
- Cada usuari pot **exportar** les seves dades i **esborrar el seu compte** amb totes les dades.

## 6. Versions i actualitzacions
- **Numeració 2.x.y:** el número del mig puja amb funcions noves (2.10 → 2.11) i l'últim amb correccions (2.10.0 → 2.10.1).
- **Cada versió porta:** número (`APP_VER`), data (`APP_DATE`), **nom de l'actualització** (`APP_TITLE`) i llista de novetats (`APP_NEWS`).
- **Quan un usuari entra per primer cop després d'una actualització**, li apareix des de baix el full amb el nom de l'actualització i les novetats. Només una vegada per versió; després es poden consultar a Configuració → «Què hi ha de nou?».
- **Test complet abans de cada lliurament** (flux d'usuari nou, nutrició, tuppers, pes, tensió, activitat, configuració, privacitat).
- **Només es lliuren fitxers d'actualització quan el Dídac ho demana.** Mentrestant, els canvis s'acumulen.
- Normalment només canvia l'`index.html`. Quan calen altres fitxers (funcions de Supabase, SQL, `sw.js`), s'indica explícitament.
