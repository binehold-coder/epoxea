# GITHUB PAGES + DECAP CMS: ИНСТРУКЦИЯ

## 1. СОЗДАТЬ PERSONAL ACCESS TOKEN НА GITHUB

1. Открой https://github.com/settings/tokens?type=beta
2. Нажми "Generate new token" → "Generate new token (beta)"
3. **Заполни:**
   - Token name: `decap-cms-token`
   - Expiration: 90 days (или больше)
   - Repository access: `Only select repositories` → выбери `epoxea`
4. **Permissions (Repository):**
   - Contents: `Read and write` ✓
   - Pull requests: `Read and write` ✓
5. Нажми "Generate token"
6. **СКОПИРУЙ токен** (он больше не будет показан)

---

## 2. ДОБАВИТЬ ТОКЕН В admin/config.yml

Найди в `admin/config.yml` строку `repo: binehold-coder/epoxea` и добавь строку выше:

```yaml
backend:
  name: github
  repo: binehold-coder/epoxea
  token: YOUR_PERSONAL_ACCESS_TOKEN_HERE
  branch: main
```

**Заменить** `YOUR_PERSONAL_ACCESS_TOKEN_HERE` на скопированный токен.

⚠️ **БЕЗОПАСНОСТЬ:**
- Этот файл в репозитории будет публичным
- GitHub автоматически сканирует и блокирует токены, найденные в коде
- Если случайно закоммитишь — GitHub заблокирует токен, нужно будет создать новый

**Если нужна максимальная безопасность:**
- Используй environment переменную (но это требует сборки)
- Для статического GitHub Pages это невозможно
- Вариант: удали токен из `config.yml` перед публикацией, потом добавь обратно локально

---

## 3. ВКЛЮЧИТЬ GITHUB PAGES

1. Открой https://github.com/binehold-coder/epoxea → Settings
2. Слева: "Pages"
3. **Build and deployment:**
   - Source: `Deploy from a branch`
   - Branch: `main` / `/ (root)`
4. Нажми "Save"
5. Подожди 1–2 минуты

**Сайт будет доступен по адресу:**
```
https://binehold-coder.github.io/epoxea/
```

---

## 4. ОБНОВИТЬ ССЫЛКИ В КОНФИГУРАЦИИ

В `admin/config.yml` убедись, что правильно указаны пути:

```yaml
media_folder: "assets/images"
public_folder: "/epoxea/assets/images"
```

⚠️ GitHub Pages хостит сайт в подпапке `/USERNAME/REPO/`, поэтому `public_folder` должен включать `/epoxea/`.

---

## 5. ВХОД В АДМИНКУ

1. Открой https://binehold-coder.github.io/epoxea/admin/
2. GitHub запросит авторизацию (если это первый вход)
3. После авторизации — Decap CMS готова к редактированию

---

## 6. РАБОЧИЙ ПОТОК

**Редактирование контента:**
1. Зайди в админку → https://binehold-coder.github.io/epoxea/admin/
2. Отредактируй (например, Settings → Site Title)
3. Нажми "Publish"
4. Decap CMS создаст коммит в GitHub
5. GitHub Pages автоматически пересборит сайт (1–2 мин)
6. Сайт обновится: https://binehold-coder.github.io/epoxea/

---

## 7. ПРОВЕРКА РАБОТЫ

После первого коммита из CMS проверь:
1. https://github.com/binehold-coder/epoxea → Commits
2. Должны появиться новые коммиты от Decap CMS
3. Если коммитов нет — проверь конфиг `admin/config.yml` (токен, repo, branch)

---

## 8. РЕШЕНИЕ ПРОБЛЕМ

**Проблема:** "Authorization failed" в админке
- **Решение:** токен либо невалидный, либо истёк срок. Создай новый и замени в `config.yml`.

**Проблема:** Коммиты не появляются в GitHub
- **Решение:** проверь `admin/config.yml`:
  - `repo:` правильный?
  - `branch:` = `main`?
  - `token:` вставлен корректно?

**Проблема:** Изображения загружаются, но не видны на сайте
- **Решение:** проверь `public_folder` в `admin/config.yml` — должно быть `/epoxea/assets/images/`

**Проблема:** Админка не открывается
- **Решение:**
  - GitHub Pages опубликован? (Settings → Pages)
  - URL правильный? `https://USERNAME.github.io/REPO/admin/`

---

## 9. СТОИМОСТЬ

- GitHub Pages: **0$**
- Decap CMS: **0$** (open-source)
- Домен: **бесплатный** (USERNAME.github.io/REPO)
- Personal Access Token: **0$**

**Никаких кредитов, никаких лимитов, никогда.**

---

## 10. БУДУЩИЕ УЛУЧШЕНИЯ

Когда потребуется:
- Кастомный домен: просто DNS на GitHub Pages
- Форма обратной связи: Formspree.io (бесплатная)
- Аналитика: Plausible или Fathom (платно, но опционально)
- Магазин: Snipcart или Gumroad (интеграция в существующий HTML)

Всё остаётся на GitHub Pages, ничего не меняется.
