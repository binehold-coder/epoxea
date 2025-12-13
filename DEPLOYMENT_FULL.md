# ПОЛНЫЙ ПРОМТ: СОЗДАНИЕ МНОГОЯЗЫЧНОГО САЙТА С DECAP CMS И ДЕПЛОЕМ НА NETLIFY

## Исходные требования
- Статический многоязычный сайт (5+ языков: FR, EN, DE, ES, IT)
- Данные в JSON-файлах (`_data/*.json`)
- Админка Decap CMS (преемник Netlify CMS) для редактирования контента
- Локализация через `locales/*.json` и JavaScript (`assets/js/i18n.js`)
- Деплой на Netlify с Git Gateway (GitHub синхронизация)
- Netlify Identity для аутентификации в CMS

---

## Архитектура проекта

```
krosh/
├── index.html                    # Главная страница с Netlify Identity widget
├── admin/
│   ├── index.html               # Админка Decap CMS + Identity init
│   ├── config.yml               # Конфигурация Decap CMS (backend: git-gateway)
├── _data/
│   ├── settings.json            # Основные данные сайта (название, языки, контакты)
│   ├── hero.json                # Hero-секция (заголовок, CTA, фон)
│   ├── products.json            # Каталог продуктов (массив объектов)
│   ├── about.json               # О нас (текст, описание)
│   └── contact.json             # Контакты (email, phone, адрес)
├── locales/                     # Переводы для каждого языка
│   ├── en.json
│   ├── fr.json
│   ├── de.json
│   ├── es.json
│   └── it.json
├── assets/
│   ├── css/
│   │   └── style.css            # Единый стиль (адаптивный, flex/grid)
│   ├── js/
│   │   ├── i18n.js              # Система локализации
│   │   └── app.js               # Загрузка данных, рендер компонентов, логика
│   └── images/
│       ├── logo.png
│       └── products/             # Изображения товаров (редактируются через CMS)
├── netlify.toml                 # Конфиг деплоя и редиректов
├── package.json                 # Описание проекта (minimal, no deps)
├── robots.txt                   # SEO
├── sitemap.xml                  # SEO
└── README.md, QUICK_START.md, DEPLOYMENT.md и т.д.
```

---

## Ключевые конфигурационные файлы

### 1. `netlify.toml`

```toml
[build]
  publish = "."
  command = ""

[[redirects]]
  from = "/admin"
  to = "/admin/index.html"
  status = 200

[[redirects]]
  from = "/admin/*"
  to = "/admin/index.html"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Назначение:**
- Публикация всего репозитория как статического сайта.
- Редиректы для `/admin` на `admin/index.html` (Decap CMS SPA).
- Catch-all редирект для SPA главного сайта.

### 2. `admin/config.yml`

```yaml
backend:
  name: git-gateway
  branch: main

media_folder: "assets/images"
public_folder: "/assets/images"

collections:
  - name: "settings"
    label: "Settings"
    files:
      - name: "settings"
        label: "Site Settings"
        file: "_data/settings.json"
        fields:
          - { label: "Site Title", name: "title", widget: "string" }
          - { label: "Site Tagline", name: "tagline", widget: "string" }
          - { label: "Logo", name: "logo", widget: "image" }
          - { label: "Languages", name: "languages", widget: "list" }
          - { label: "Contact Email", name: "contactEmail", widget: "string" }
          - { label: "Contact Phone", name: "contactPhone", widget: "string" }

  - name: "products"
    label: "Products"
    files:
      - name: "products"
        label: "Products List"
        file: "_data/products.json"
        fields:
          - name: products
            label: Products
            widget: list
            fields:
              - { label: "ID", name: "id", widget: "string" }
              - { label: "Title", name: "name", widget: "string" }
              - { label: "Description", name: "description", widget: "text" }
              - { label: "Price", name: "price", widget: "number" }
              - { label: "Image", name: "image", widget: "image" }
              - { label: "Category", name: "category", widget: "string" }

  - name: "hero"
    label: "Hero Section"
    files:
      - name: "hero"
        label: "Hero"
        file: "_data/hero.json"
        fields:
          - { label: "Title", name: "title", widget: "string" }
          - { label: "Subtitle", name: "subtitle", widget: "text" }
          - { label: "CTA Text", name: "ctaText", widget: "string" }
          - { label: "CTA Link", name: "ctaLink", widget: "string" }

  - name: "about"
    label: "About Section"
    files:
      - name: "about"
        label: "About"
        file: "_data/about.json"
        fields:
          - { label: "Title", name: "title", widget: "string" }
          - { label: "Content", name: "description", widget: "text" }

  - name: "contact"
    label: "Contact Section"
    files:
      - name: "contact"
        label: "Contact"
        file: "_data/contact.json"
        fields:
          - { label: "Email", name: "email", widget: "string" }
          - { label: "Phone", name: "phone", widget: "string" }
          - { label: "Address", name: "address", widget: "text" }
```

**Назначение:**
- Определяет коллекции данных для Decap CMS.
- `git-gateway` — работает с Netlify Identity и GitHub (автоматические коммиты при публикации).
- Каждая коллекция — файл JSON, поля — форма редактирования в админке.

### 3. `admin/index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Content Manager</title>
    <link rel="icon" href="/assets/images/logo.png">
    <!-- Netlify Identity (auth) -->
    <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
    <!-- Decap CMS app (v3.9.0+) with manual init -->
    <script>
      window.CMS_MANUAL_INIT = true;
    </script>
    <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
  </head>
  <body>
    <script>
      (function() {
        function initIdentity() {
          if (!window.netlifyIdentity) return;
          window.netlifyIdentity.on('login', function() {
            window.location.href = '/admin/';
          });
        }
        function initCMS() {
          if (window.CMS && typeof window.CMS.init === 'function') {
            window.CMS.init({ configPath: '/admin/config.yml' });
          } else {
            console.error('CMS failed to load');
          }
        }
        function boot() {
          initIdentity();
          initCMS();
        }
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', boot);
        } else {
          boot();
        }
      })();
    </script>
  </body>
</html>
```

**Назначение:**
- Загружает Netlify Identity для аутентификации.
- Загружает Decap CMS с флагом `CMS_MANUAL_INIT = true` (избегает race-условий).
- Явно инициализирует CMS после загрузки скриптов.

### 4. `index.html` (главная страница) — ключевые части

```html
<head>
  <!-- ... -->
  <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
  <script>
    (function() {
      function hasInviteToken() {
        return typeof window.location.hash === 'string' && window.location.hash.indexOf('invite_token') !== -1;
      }
      function ensureIdentity() {
        if (!window.netlifyIdentity) return;
        if (hasInviteToken()) {
          window.netlifyIdentity.open('login');
        }
        window.netlifyIdentity.on('login', function() {
          window.location.href = '/admin/';
        });
      }
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ensureIdentity);
      } else {
        ensureIdentity();
      }
    })();
  </script>
</head>
```

**Назначение:**
- Включает Netlify Identity widget для обработки email-ссылок (invite, reset).
- Если URL содержит `#invite_token`, открывает модал входа и редиректит на `/admin` после авторизации.

---

## Данные (_data/*.json)

### settings.json
```json
{
  "title": "Éclats de Résine",
  "tagline": "Créations artisanales uniques",
  "logo": "/assets/images/logo.png",
  "languages": ["fr", "en", "de", "es", "it"],
  "contactEmail": "contact@eclatsderesine.fr",
  "contactPhone": "+33 (0)1 23 45 67 89"
}
```

### hero.json
```json
{
  "title": "Créations en Résine",
  "subtitle": "Chaque pièce est unique et faite avec passion",
  "ctaText": "Découvrir nos collections",
  "ctaLink": "/#collections"
}
```

### products.json
```json
[
  {
    "id": "ornament-galaxy",
    "name": "Ornament Galaxy",
    "description": "Beautiful galaxy-themed ornament with shimmering effects",
    "price": 29.99,
    "image": "/assets/images/products/galaxy.jpg",
    "category": "home"
  },
  {
    "id": "ornament-ocean",
    "name": "Ornament Ocean",
    "description": "Ocean-inspired ornament with turquoise and blue hues",
    "price": 34.99,
    "image": "/assets/images/products/ocean.jpg",
    "category": "home"
  }
  // ... ещё товары
]
```

### about.json
```json
{
  "title": "À propos de nous",
  "description": "Chaque création d'Éclats de Résine est le fruit d'une passion pour les matériaux et les techniques artisanales."
}
```

### contact.json
```json
{
  "email": "contact@eclatsderesine.fr",
  "phone": "+33 (0)1 23 45 67 89",
  "address": "123 Rue de la Résine, 75000 Paris, France"
}
```

---

## Локализация (locales/*.json)

**Структура ключей (примеры для en.json, fr.json и т.д.):**

```json
{
  "header.home": "Home",
  "header.collections": "Collections",
  "header.about": "About",
  "header.contact": "Contact",
  "hero.title": "Resin Creations",
  "hero.subtitle": "Each piece is unique and made with passion",
  "cta.buy": "Add to cart",
  "form.submit": "Send",
  "footer.copyright": "© 2024 Éclats de Résine. All rights reserved."
}
```

**Файлы:** `en.json`, `fr.json`, `de.json`, `es.json`, `it.json` с переводами по одинаковым ключам.

**JavaScript загрузка** (`assets/js/i18n.js`):
- Загружает JSON локализаций асинхронно.
- Определяет текущий язык из `localStorage` или `navigator.language`.
- Заменяет текст элементов с атрибутом `data-i18n="key"`.
- Поддерживает переключатель языка в хедере.

---

## Процесс деплоя на Netlify

### Шаг 1: Создание сайта

1. Открой https://app.netlify.com/ → "Add new site" → "Import an existing project".
2. Авторизуйся через GitHub.
3. Выбери репозиторий (например, `username/project-name`).
4. Нажми "Deploy site" — Netlify автоматически начнёт сборку и публикацию.
5. После 1–2 минут сайт будет доступен по адресу типа `https://project-name.netlify.app`.

### Шаг 2: Включение Netlify Identity

1. В панели проекта перейди в "Site settings" → "Identity".
2. Нажми "Enable Identity".
3. В "Registration" выбери "Invite only" (чтобы только авторизованные пользователи заходили).
4. В "Services" включи "Git Gateway".

### Шаг 3: Пригласить пользователя

1. Identity → "Invite users" → введи email → Send.
2. Пользователь получит письмо с ссылкой подтверждения в папку Inbox или Spam.
3. По ссылке установить пароль.

### Шаг 4: Вход в CMS

- URL: `https://твой-сайт.netlify.app/admin/`
- Логин: email + пароль.
- Коллекции готовы к редактированию.

---

## Критические проблемы и решения

### Проблема 1: Пустая страница админки

**Причина:** Глобальный редирект `/*` → `/index.html` перенаправлял `/admin` на главную.

**Решение:** Добавить явные редиректы в `netlify.toml`:
```toml
[[redirects]]
  from = "/admin"
  to = "/admin/index.html"
  status = 200

[[redirects]]
  from = "/admin/*"
  to = "/admin/index.html"
  status = 200
```

### Проблема 2: `Backend not found: git`

**Причина:** В `admin/config.yml` указан `backend: name: git`, что не совместимо с Netlify Identity.

**Решение:** Изменить на `backend: name: git-gateway`.

### Проблема 3: CORS и 404 при загрузке Netlify CMS

**Причина:** Старая версия `netlify-cms@^2.15.72` не загружалась из unpkg/jsDelivr (CORS, невалидный MIME).

**Решение:** Перейти на `decap-cms@^3.0.0` (официальный преемник Netlify CMS, лучше поддерживается).

### Проблема 4: JSON.parse ошибка в CMS

**Причина:** Файлы `settings.json` и `hero.json` были пусты, CMS не мог их спарсить.

**Решение:** Заполнить все JSON-файлы валидным содержимым, соответствующим структуре в `admin/config.yml`.

### Проблема 5: Исчерпание кредитов Netlify

**Причина:** Множество коммитов и автосборок привели к перерасходу лимита за цикл.

**Решение:**
- Upgrade на Personal план ($9/месяц, 1000 кредитов) или Pro план ($20/месяц, 3000 кредитов).
- Оптимизация: отключить Deploy Previews, ограничить сборки только для `main`, публиковать батчами.

---

## Итоговая структура данных для CMS

Коллекции в Decap CMS:
- **Settings** → файл `_data/settings.json`
- **Hero** → файл `_data/hero.json`
- **Products** → файл `_data/products.json` (список продуктов)
- **About** → файл `_data/about.json`
- **Contact** → файл `_data/contact.json`

Каждая публикация в CMS → коммит в GitHub → автодеплой на Netlify → сайт обновляется.

---

## Быстрый старт для нового проекта

### На основе этого промта создай:

1. **Репозиторий на GitHub** с указанной выше структурой.
2. **Заполни `_data/*.json`** валидным содержимым.
3. **Создай `admin/config.yml`** с коллекциями, соответствующими JSON-файлам.
4. **Создай `admin/index.html`** с загрузкой Decap CMS и Identity.
5. **Создай `index.html`** с подключением Identity widget и i18n.
6. **Сгенерируй `locales/*.json`** с переводами.
7. **Создай `netlify.toml`** с редиректами для `/admin` и SPA.
8. **Сделай первый коммит** и пушь на GitHub.

### На Netlify:

9. Import project from GitHub → Deploy.
10. Включи Identity + Git Gateway в Site settings.
11. Пригласи пользователя в Identity.
12. Зайди в админку → `https://твой-сайт.netlify.app/admin/` → редактируй контент.

---

## Технологический стек

- **Frontend:** Чистый HTML5, CSS3 (flex/grid), vanilla JavaScript.
- **Данные:** JSON-файлы в `_data/`.
- **Локализация:** `locales/*.json` + `assets/js/i18n.js`.
- **CMS:** Decap CMS (v3.9.0+) с Netlify Identity.
- **Backend/Auth:** Netlify Identity + Git Gateway.
- **Хостинг:** Netlify (статический хостинг + деплой из GitHub).
- **CI/CD:** GitHub → Netlify автодеплой при каждом коммите в `main`.

---

## Экономия кредитов Netlify

1. **Отключи Deploy Previews:**
   - Site settings → Build & deploy → Deploy previews: "None".
   
2. **Ограничь сборки на ветках:**
   - Build filters: только `main` деплоится автоматически.
   
3. **Публикуй батчами:**
   - Вместо 10 отдельных публикаций за день → 1 публикация с 10 изменениями.
   
4. **Минимизируй коммиты:**
   - Не коммитить на каждое изменение в разработке; объединяй в логические блоки.

При соблюдении этого — 1000 кредитов в месяц (Personal план) достаточно для ~100 публикаций в CMS и десятков обновлений кода.

---

## Дополнительные возможности (при необходимости)

- Добавить Netlify Forms для контактных форм.
- Расширить CMS коллекции (галерея, отзывы, блог).
- Добавить кнопку "Admin" в хедер сайта для быстрого входа.
- Настроить Slack/Email уведомления при публикациях.
- Подключить Google Analytics / Яндекс.Метрика.
- Кастомные домены и HTTPS (Netlify обеспечивает бесплатно).

---

**Документ создан:** 13 декабря 2025 г.  
**Статус:** Готово к использованию как шаблон для аналогичных проектов.
