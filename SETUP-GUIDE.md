# 🚀 Snabb Setup-Guide för Tomtsökaren

## Du har redan:
✅ Google Maps API-nyckel: `AIzaSyBban3eyqonPc1Fw_W4d5UWp6Y0nrigV2o`
✅ Koden är pushad till GitHub
✅ GitHub Actions workflow är konfigurerad

## Steg-för-steg: Få igång systemet på 5 minuter

### Steg 1: Aktivera Distance Matrix API

1. Gå till: https://console.cloud.google.com/apis/library/distance-matrix-backend.googleapis.com
2. Se till att du är i rätt projekt
3. Klicka på **"ENABLE"** / **"AKTIVERA"**
4. Vänta 1-2 minuter tills API:et är aktivt

### Steg 2: Aktivera Billing (MÅSTE göras, även för gratis tier!)

1. Gå till: https://console.cloud.google.com/billing
2. Klicka **"Link a billing account"**
3. Fyll i kortuppgifter (du får $200 gratis kredit/månad!)
4. **Du kommer INTE debiteras** - systemet använder <$1/månad

> **OBS:** Google kräver billing för att använda Maps API, även med gratis kredit. Du får en varning om krediten tar slut.

### Steg 3: Skaffa Gmail App Password

#### 3.1 Aktivera 2-Step Verification
1. Gå till: https://myaccount.google.com/security
2. Under "Signing in to Google", klicka **"2-Step Verification"**
3. Följ stegen för att aktivera det (SMS, authenticator app, etc.)

#### 3.2 Skapa App Password
1. Gå till: https://myaccount.google.com/apppasswords
2. Under "App name", skriv: **"Tomtsökare"**
3. Klicka **"Generate"** / **"Skapa"**
4. Kopiera den 16-siffriga koden (ex: `abcd efgh ijkl mnop`)

### Steg 4: Konfigurera GitHub Secrets

1. Gå till: https://github.com/filiptheking/Snake/settings/secrets/actions
2. Klicka **"New repository secret"** för varje:

| Secret Name | Value |
|-------------|-------|
| `GOOGLE_MAPS_API_KEY` | `AIzaSyBban3eyqonPc1Fw_W4d5UWp6Y0nrigV2o` |
| `EMAIL_USER` | `din.email@gmail.com` ← **DIN** Gmail |
| `EMAIL_PASS` | `xxxx xxxx xxxx xxxx` ← App Password från steg 3 |
| `RECIPIENT_EMAIL` | `sjoofilip@gmail.com` |
| `BUS_STOP_LAT` | `59.6196` |
| `BUS_STOP_LNG` | `17.8555` |
| `MAX_DISTANCE` | `1000` |

### Steg 5: Testa med GitHub Actions

1. Gå till: https://github.com/filiptheking/Snake/actions
2. Klicka på **"Daily Property Search"** (vänster sida)
3. Klicka **"Run workflow"** (höger sida, blå knapp)
4. Klicka **"Run workflow"** igen (grön knapp)
5. Vänta 1-2 minuter
6. Klicka på workflow-körningen för att se loggar

### Steg 6: Vänta på resultat!

- ✅ Systemet körs nu **automatiskt varje dag kl 20:00**
- 📧 Du får email till `sjoofilip@gmail.com` med resultat
- 🔍 Även om inga tomter hittas får du en bekräftelse

## 🔧 Felsökning

### "Distance Matrix API not enabled"
→ Gå tillbaka till Steg 1 och aktivera API:et

### "This API project is not authorized to use this API"
→ Gå tillbaka till Steg 2 och aktivera Billing

### "Invalid credentials" för email
→ Dubbelkolla att du använder App Password (16 siffror), inte vanligt Gmail-lösenord

### Inga tomter hittas
→ Detta är normalt! Objektvision kanske inte har tomter nära Fältvägen just nu. Systemet fortsätter söka automatiskt.

### Scraping fel (403/blocked)
→ GitHub Actions har olika IP-adresser varje gång, vilket oftast fungerar bättre än lokala tester

## 🎯 Efter Setup

**Du behöver inte göra något mer!** Systemet körs automatiskt varje dag kl 20:00.

Du kan:
- Se historik under **Actions** på GitHub
- Ändra MAX_DISTANCE i GitHub Secrets för att söka längre/kortare avstånd
- Lägga till fler email-mottagare

## 📧 Support

Om du stöter på problem:
1. Kolla loggarna under Actions på GitHub
2. Öppna en issue i repositoryt
3. Eller fråga Claude! 😊

---

**Lycka till med tomtjakten! 🏡**
