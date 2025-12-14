# OAuth & Decap CMS — Solution Applied

## ✅ РЕШЕНО: Переход на встроенный GitHub backend с implicit auth

Вместо кастомного OAuth сервера на Cloudflare Workers применена официальная поддержка GitHub в Decap CMS.

## Что изменилось

### 1. admin/config.yml
- **ДО**: `base_url: https://epoxea.binehold.workers.dev`, `auth_endpoint: /auth` (кастомный воркер)
- **ПОСЛЕ**: 
  ```yaml
  backend:
    name: github
    repo: binehold-coder/epoxea
    branch: main
    auth_type: implicit
    app_id: Ov23liRVrbchqD0R72vO
  ```

### 2. admin/index.html
- **ДО**: 169 строк с `window.CMS_MANUAL_INIT`, кастомными postMessage listeners, localStorage парсингом
- **ПОСЛЕ**: 11 строк минимального HTML + один `<script src="https://unpkg.com/decap-cms@^3.9.0/dist/decap-cms.js"></script>`

### 3. GitHub OAuth App (Settings → Developer settings → OAuth Apps)
- **Authorization callback URL должна быть**: `https://epoxea.pages.dev/admin/` (или ваш домен)
- **НЕ** `/callback`, `/auth`, `/token` — просто `/admin/`

## Как работает implicit flow

1. User открывает `/admin/` → видит "Login with GitHub"
2. Нажимает → Decap редирект на GitHub
3. GitHub спрашивает "Allow access?" → user нажимает Authorize
4. GitHub редирект на `https://your-domain/admin/#access_token=...`
5. Decap парсит токен из URL hash
6. Сохраняет сессию в localStorage (автоматически)
7. Перезагружает page → коллекции загружены

## Преимущества
- ✅ Официально поддерживается Decap
- ✅ Нет воркеров, нет костылей
- ✅ Нет лимитов Netlify (встроенный OAuth для бесплатных сайтов)
- ✅ Меньше кода → меньше багов
- ✅ Сессия сохраняется надежнее

## Ограничения (честно)
- ❌ Только GitHub (не GitLab, не Bitbucket)
- ❌ Не для команды редакторов (individual только)
- ❌ GitHub может попросить перелогин раз в N дней

## Что было удалено
- `workers/decap-oauth/` — больше не нужен (можно удалить из git или оставить)
- Все постMessage логика
- Все localStorage манипуляции
- `window.CMS_MANUAL_INIT` флаг

## Коммит
- `Switch to Decap native GitHub implicit auth - remove custom OAuth server`

## Что проверить

1. Откройте `https://your-domain/admin/`
2. Нажмите "Login with GitHub"
3. Разрешите доступ в GitHub
4. После редиректа должны увидеть коллекции (Products, Hero, About и т.д.)
5. Перезагрузите страницу — сессия сохранилась, снова не просит логин

## Если не работает
- Проверьте, что `Authorization callback URL` в GitHub OAuth App именно `https://your-domain/admin/`
- Проверьте, что `app_id` в config.yml совпадает с Client ID из GitHub
- Очистите localStorage вручную: `localStorage.clear()` в консоли
- Откройте Network tab, посмотрите, приходит ли редирект с `#access_token=`

