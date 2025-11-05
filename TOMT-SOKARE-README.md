# 🏡 Tomtsökare - Automated Property Plot Search

Automatisk daglig sökning efter lediga tomter inom gångavstånd från Fältvägens busshållplats, Märsta/Arlanda.

## ✨ Features

- 🔍 **Daglig automatisk sökning** på Objektvision.se
- 📏 **Gångavståndsberäkning** med Google Maps API
- 📧 **Email-notifikationer** med vackert formaterade resultat
- ⏰ **Schemalagd körning** varje dag kl 20:00 via GitHub Actions
- 💰 **100% GRATIS** - Använder endast gratis API-tiers

## 🎯 Vad systemet gör

1. Scrapar **Objektvision.se** efter lediga tomter och bostadsfastigheter
2. Beräknar **gångavstånd** från varje tomt till Fältvägens busshållplats
3. Filtrerar tomter inom **1000 meter** gångavstånd
4. Skickar **email** med resultat till din inkorg
5. Körs **automatiskt varje dag** kl 20:00

## 🚀 Snabbstart

### 1. Krav

- Node.js 18+ (för lokal utveckling)
- Gmail-konto (för att skicka email)
- Google Cloud Platform-konto (för Maps API)
- GitHub-konto (för automatisk schemaläggning)

### 2. Installation

```bash
# Klona repository
git clone https://github.com/filiptheking/Snake.git
cd Snake

# Installera dependencies
npm install
```

### 3. Konfigurera API-nycklar

#### A. Google Maps API Key (GRATIS - $200/månad kredit)

1. Gå till [Google Cloud Console](https://console.cloud.google.com/)
2. Skapa ett nytt projekt
3. Aktivera **Distance Matrix API** och **Places API**
4. Skapa en API-nyckel under "Credentials"
5. (Valfritt) Begränsa nyckeln till endast Distance Matrix & Places APIs

#### B. Gmail App Password

1. Gå till [Google Account Security](https://myaccount.google.com/security)
2. Aktivera **2-Step Verification** (om inte redan aktiverad)
3. Gå till **App passwords**
4. Välj "Mail" och "Other (Custom name)"
5. Kopiera den genererade 16-siffriga koden

### 4. Skapa .env-fil

```bash
# Kopiera example-filen
cp .env.example .env

# Redigera .env med dina API-nycklar
nano .env  # eller använd valfri editor
```

Fyll i följande i `.env`:

```env
GOOGLE_MAPS_API_KEY=din_google_maps_api_nyckel
EMAIL_USER=din.email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx  # App password från Gmail
RECIPIENT_EMAIL=sjoofilip@gmail.com
BUS_STOP_LAT=59.6196
BUS_STOP_LNG=17.8555
MAX_DISTANCE=1000
RUN_HOUR=20
RUN_MINUTE=0
```

### 5. Testa lokalt

```bash
# Kör ett test direkt (utan att vänta på schemalagd tid)
npm start -- --test

# eller
node src/index.js --now
```

## 🤖 Automatisk körning med GitHub Actions

### Setup GitHub Secrets

För att köra automatiskt varje dag på GitHub Actions:

1. Gå till ditt repository på GitHub
2. Gå till **Settings** → **Secrets and variables** → **Actions**
3. Lägg till följande secrets:

| Secret Name | Value | Description |
|------------|-------|-------------|
| `GOOGLE_MAPS_API_KEY` | Din Google Maps API-nyckel | För avståndsmätning |
| `EMAIL_USER` | din.email@gmail.com | Gmail-adress för att skicka |
| `EMAIL_PASS` | xxxx xxxx xxxx xxxx | Gmail App Password |
| `RECIPIENT_EMAIL` | sjoofilip@gmail.com | Mottagarens email |
| `BUS_STOP_LAT` | 59.6196 | Busshållplatsens latitude |
| `BUS_STOP_LNG` | 17.8555 | Busshållplatsens longitude |
| `MAX_DISTANCE` | 1000 | Max gångavstånd i meter |

### Justera tidzon

GitHub Actions kör i UTC-tid. Workflow-filen är konfigurerad för:
- **Vintertid (CET)**: 19:00 UTC = 20:00 CET
- **Sommartid (CEST)**: 18:00 UTC = 20:00 CEST

Justera cron-schemat i `.github/workflows/daily-search.yml` om du vill ändra:

```yaml
schedule:
  - cron: '0 19 * * *'  # 19:00 UTC = 20:00 CET
```

### Testa GitHub Actions manuellt

1. Gå till **Actions** i ditt repository
2. Välj **Daily Property Search**
3. Klicka på **Run workflow**
4. Se loggarna för att kontrollera att allt fungerar

## 📁 Projektstruktur

```
Snake/
├── src/
│   ├── index.js        # Main entry point & scheduler
│   ├── scraper.js      # Objektvision.se web scraper
│   ├── distance.js     # Google Maps distance calculations
│   └── mailer.js       # Email notification system
├── .github/
│   └── workflows/
│       └── daily-search.yml  # GitHub Actions workflow
├── .env.example        # Environment variables template
├── .gitignore         # Git ignore file
├── package.json       # Node.js dependencies
└── TOMT-SOKARE-README.md  # This file
```

## 🛠️ Användning

### Lokalt läge (för utveckling)

```bash
# Kör omedelbart (test mode)
npm start -- --test

# Kör i schemalagt läge (väntar till 20:00)
npm start
```

### Produktionsläge (GitHub Actions)

Systemet körs automatiskt varje dag kl 20:00. Du kan:
- Se loggar under **Actions** på GitHub
- Manuellt trigga körningar med **Run workflow**
- Få email i din inkorg när tomter hittas

## 📧 Email-notifikationer

Systemet skickar **alltid** ett email, antingen:

### När tomter hittas
- 🎉 Vacker HTML-formaterad email
- Komplett information om varje tomt
- Gångavstånd och gångtid
- Direktlänk till annons på Objektvision.se

### När inga tomter hittas
- 📭 Bekräftelse att sökningen har körts
- Information om att systemet fortsätter söka

## 💰 Kostnad

**Detta system är 100% GRATIS!**

- **Google Maps API**: $200 gratis kredit/månad
  - Distance Matrix API: ~$5 per 1000 requests
  - Med daglig sökning: ~30 requests/månad = **GRATIS**

- **GitHub Actions**: 2000 gratis minuter/månad
  - Denna workflow: ~2 minuter/dag
  - Per månad: ~60 minuter = **GRATIS**

- **Gmail**: Helt gratis
- **Objektvision.se**: Gratis att scrapa (publikt tillgänglig data)

## 🔧 Felsökning

### Problem: Email skickas inte

**Lösning:**
- Kontrollera att du använder Gmail App Password (inte vanligt lösenord)
- Verifiera att 2-Step Verification är aktiverad på Gmail
- Testa med ett annat Gmail-konto

### Problem: Google Maps API-fel

**Lösning:**
- Kontrollera att Distance Matrix API är aktiverad
- Verifiera API-nyckeln i Google Cloud Console
- Se till att billing är aktiverat (krävs även för free tier)

### Problem: Inga tomter hittas

**Möjliga orsaker:**
- Objektvision.se har ändrat sin HTML-struktur (kräver uppdatering av scraper)
- Inga tomter finns inom 1000m just nu (systemet fungerar korrekt!)
- Scraping blockeras (lägg till fördröjning mellan requests)

### Problem: GitHub Actions körs inte

**Lösning:**
- Kontrollera att alla GitHub Secrets är korrekt konfigurerade
- Se Actions-loggar för felmeddelanden
- Verifiera att workflow-filen har rätt syntax

## 🔒 Säkerhet

- **LÄGG ALDRIG TILL `.env` I GIT!** (redan i .gitignore)
- Använd GitHub Secrets för känslig data
- Begränsa Google Maps API-nyckeln till endast nödvändiga APIs
- Använd Gmail App Password istället för huvudlösenord

## 📈 Förbättringsmöjligheter

- [ ] Lägg till fler tomtkällor (Hemnet, Booli, kommuner)
- [ ] Spara historik av sökningar i databas
- [ ] Web-interface för att se historik
- [ ] Telegram/SMS-notifikationer
- [ ] Konfigurerbar sökradie
- [ ] Flera sökplatser samtidigt
- [ ] Prisfiltrering och prisvarningar

## 🤝 Bidrag

Detta är ett personligt projekt, men förslag och förbättringar är välkomna!

## 📝 Licens

MIT License - Fri att använda och modifiera

## 👨‍💻 Skapad av

**Claude** (AI-assistent från Anthropic) för Filip

---

**Lycka till med tomtjakten! 🏡🔍**

Om du har frågor eller problem, skapa en issue i GitHub-repositoryt.
