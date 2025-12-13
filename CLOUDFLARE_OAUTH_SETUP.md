# GitHub OAuth для Decap CMS на Cloudflare Pages

## 1. Регистрация OAuth App на GitHub

**Форма:** https://github.com/settings/applications/new

| Поле | Значение |
|------|----------|
| **Application name** | `Epoxea CMS` |
| **Homepage URL** | `https://epoxea.pages.dev` |
| **Application description** | (оставить пусто или написать "Content Management System") |
| **Authorization callback URL** | `https://epoxea.pages.dev/api/oauth/callback` |

## 2. Что НЕ трогать

- **Client Secret** — скопировать и сохранить ОДИН раз, затем использовать только в Worker (не в конфиге)
- **Webhook URL** — оставить пусто
- **Enable Device Flow** — оставить без изменений
- **Expiration** — не менять

## 3. После регистрации: скопировать

1. **Client ID** → сохранить
2. **Client Secret** → сохранить (одна копия на весь проект)

Больше ничего не копировать.

---

## 4. Создать Cloudflare Worker

**Путь:** Cloudflare Dashboard → Workers and Pages → Create application → Create Worker

**Имя Worker:** `decap-oauth`

**Код Worker:**

```javascript
export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Обработка callback
    if (url.pathname === '/api/oauth/callback') {
      const code = url.searchParams.get('code');
      if (!code) {
        return new Response('Missing code', { status: 400 });
      }

      // Обменять код на токен
      const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code: code,
        }),
      });

      const tokenData = await tokenResponse.json();

      if (tokenData.error) {
        return new Response(`Error: ${tokenData.error}`, { status: 400 });
      }

      // Вернуть token в Decap CMS
      return new Response(
        `<html><body><script>
          window.opener.postMessage(
            { token: '${tokenData.access_token}' },
            'https://epoxea.pages.dev'
          );
          window.close();
        </script></body></html>`,
        { headers: { 'Content-Type': 'text/html' } }
      );
    }

    return new Response('Not Found', { status: 404 });
  },
};
```

**Environment Variables в Worker:**
- `GITHUB_CLIENT_ID` = значение из OAuth App
- `GITHUB_CLIENT_SECRET` = значение из OAuth App (скопировать один раз)

---

## 5. Подключить Worker к Pages

**Cloudflare Pages → Epoxea → Settings → Functions:**
- Worker route: `/api/oauth/*`
- Worker: `decap-oauth`

---

## 6. Финальный блок `admin/config.yml`

```yaml
backend:
  name: github
  repo: binehold-coder/epoxea
  branch: main
  auth_endpoint: /api/oauth/callback
  base_url: https://epoxea.pages.dev

media_folder: "assets/images"
public_folder: "/assets/images"

collections:
  # ... остальные коллекции
```

**Ключевые различия от Personal Access Token:**
- НЕТ `token:` поля
- ЕСТЬ `auth_endpoint:` указывающий на Worker
- `base_url:` указывает на сайт (для правильного редиректа)

---

## Итог

✅ OAuth App зарегистрирована  
✅ Client ID/Secret сохранены в Worker (не в конфиг)  
✅ Worker обрабатывает callback и выдает токен в браузер  
✅ Decap CMS получает токен через WebMessage API  
✅ NO Personal Access Tokens в конфиге  
✅ NO видимых токенов в коде  

Сайт полностью статический, Cloudflare Pages + Worker, $0 стоимости.
