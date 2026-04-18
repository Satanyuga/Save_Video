# cobalt on render: advanced setup (ru)

этот гайд для случая, когда:
- фронтенд и api уже подняты на render;
- обычный запуск работает, но youtube периодически отдает `prove you're not a bot` / `unable to process`;
- вы хотите остаться на github + render.

## 1) базовая схема (рекомендуется)

используйте 2 сервиса на render:

1. `cobalt-api` (Web Service)
2. `cobalt-web` (Static Site)

github pages для cobalt не нужен.

---

## 2) настройки `cobalt-api` (web service)

### root/build/start
- **Root Directory**: оставить пустым (`.`)
- **Build Command**:
  ```bash
  corepack enable && pnpm install --frozen-lockfile
  ```
- **Start Command**:
  ```bash
  pnpm --filter @imput/cobalt-api start
  ```

### обязательные env
- `NODE_VERSION=20`
- `API_URL=https://YOUR-API-SERVICE.onrender.com/`

`API_URL` обязательно со слешем в конце.

---

## 3) настройки `cobalt-web` (static site)

- **Root Directory**: оставить пустым (`.`)
- **Build Command**:
  ```bash
  corepack enable && pnpm install --frozen-lockfile && pnpm --filter @imput/cobalt-web build
  ```
- **Publish Directory**:
  ```txt
  web/build
  ```

env:
- `NODE_VERSION=20`
- `WEB_DEFAULT_API=https://YOUR-API-SERVICE.onrender.com`
- `WEB_BASE_PATH=` (пусто, если это render static site)

---

## 4) youtube session server (advanced)

`YOUTUBE_SESSION_SERVER` часто помогает, когда youtube режет обычные запросы.

1. поднимите отдельный сервис `yt-session-generator` (из официального репозитория):
   - https://github.com/imputnet/yt-session-generator
2. получите URL сервиса, например:
   - `https://yt-session.onrender.com/`
3. добавьте в `cobalt-api` env:
   - `YOUTUBE_SESSION_SERVER=https://yt-session.onrender.com/`
   - `YOUTUBE_SESSION_INNERTUBE_CLIENT=WEB_EMBEDDED`

после этого сделайте redeploy `cobalt-api`.

---

## 5) cookies.json (advanced)

если часть роликов все еще не проходит, добавьте cookies.

### безопасный способ на render
не храните боевые cookies в git. используйте **Secret Files**:

1. в render откройте `cobalt-api` -> **Environment**
2. добавьте Secret File:
   - **Path**: `/etc/secrets/cookies.json`
   - **Content**: содержимое вашего `cookies.json`
3. добавьте env:
   - `COOKIE_PATH=/etc/secrets/cookies.json`
4. redeploy `cobalt-api`

пример структуры файла: `docs/examples/cookies.example.json`

---

## 6) proxy (когда youtube продолжает блочить ip)

если даже с `YOUTUBE_SESSION_SERVER` и cookies есть блокировки, нужен прокси:

- `HTTP_PROXY=http://user:pass@host:port`
- `HTTPS_PROXY=http://user:pass@host:port`
- `NO_PROXY=localhost,127.0.0.1`

важно:
- бесплатные/датацентр прокси могут не помочь;
- обычно лучше residential/mobile прокси;
- не используйте одновременно `FREEBIND_CIDR` и старый `API_EXTERNAL_PROXY`.

---

## 7) минимальный порядок включения (чтобы не усложнять сразу)

1. привести в порядок base deploy (шаги 2 и 3);
2. добавить `YOUTUBE_SESSION_SERVER`;
3. добавить `cookies.json` через Secret File;
4. только если не помогло — подключать `HTTP_PROXY`/`HTTPS_PROXY`.

---

## 8) быстрая проверка здоровья

после каждого изменения проверяйте:

1. `GET https://YOUR-API-SERVICE.onrender.com/` возвращает JSON;
2. в JSON есть `"youtube"` в `cobalt.services`;
3. тест ссылки:
   - 1 короткий youtube shorts,
   - 1 обычный youtube ролик,
   - 1 audio-only ролик.

если API отвечает JSON, но youtube снова падает, это почти всегда антибот/сеть, а не ошибка сборки фронтенда.
