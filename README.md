# CurioBox Apps — Geri Bildirim

CenterHit, CurioBox ve FinBuddy uygulamaları (ve genel) için geri bildirim toplayan
Next.js (App Router) uygulaması. **Tüm PocketBase istekleri server-side** yapılır;
tarayıcıya hiçbir kimlik bilgisi veya doğrudan PocketBase erişimi sızmaz.

## Mimari

- `app/page.tsx` — Geri bildirim formu sayfası (statik)
- `app/FeedbackForm.tsx` — Client form bileşeni (Server Action'ı çağırır)
- `app/actions.ts` — `submitFeedback` Server Action (doğrulama + PocketBase yazımı)
- `app/api/feedback/route.ts` — REST endpoint (mobil uygulamalar da POST atabilir)
- `lib/pocketbase.ts` — `server-only` PocketBase istemcisi
- `lib/apps.ts` — Uygulama / tür / platform sabitleri

Veri `app_feedback` koleksiyonuna şu alanlarla yazılır:
`category` (uygulama), `message`, `app_version`, `platform`.

## Kurulum

```bash
npm install
npm run dev     # http://localhost:3000
```

## Ortam değişkenleri (`.env.local`)

```
POCKETBASE_URL=https://pocketbase.curioboxapp.info
POCKETBASE_FEEDBACK_COLLECTION=app_feedback
# Koleksiyonun create kuralı herkese açık değilse:
POCKETBASE_ADMIN_EMAIL=
POCKETBASE_ADMIN_PASSWORD=
```

## Mobil uygulamalardan kullanım

```http
POST /api/feedback
Content-Type: application/json

{ "category": "centerhit", "message": "...", "app_version": "1.4.2", "platform": "ios" }
```

## ⚠️ Dağıtım (ÖNEMLİ)

Bu proje **Server Action + API route** kullanır, yani çalışan bir Node sunucusuna
ihtiyaç duyar. **GitHub Pages yalnızca statik dosya sunar; bu uygulamayı olduğu
gibi çalıştıramaz.** Önerilen dağıtım: **Vercel** (ücretsiz) veya kendi Node
sunucunuz (`npm run build && npm run start`).

> `ugurcanguden.github.io` reposundasınız ama bu bir Pages sitesi değil, tam bir
> Next.js uygulamasıdır. Vercel'e bağlayıp `pocketbase.curioboxapp.info` benzeri
> bir alt alan adı yönlendirebilirsiniz.
