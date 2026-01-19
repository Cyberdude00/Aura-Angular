# Aura Scouting (Angular)

## Estructura del proyecto

```
Au-Angular/
├─ src/
│  ├─ app/
│  │  ├─ core/
│  │  │  └─ services/
│  │  │     └─ seo.service.ts
│  │  └─ features/
│  │     └─ landing/
│  │        ├─ landing.ts
│  │        ├─ landing.html
│  │        ├─ landing.scss
│  │        └─ contact.service.ts
│  └─ index.html
├─ package.json
└─ angular.json
```

## SEO

### Qué se gestiona en `index.html`

Usar para contenido fijo:

- Verificaciones (Google, Naver, Baidu, etc.).
- Favicons y manifest.
- Analytics (Google, Yandex).
- Datos estructurados (Schema.org).
- Fuentes y preloads.

### Qué se gestiona en `SeoService`

Usar para contenido dinámico:

- `<title>`
- `meta description`
- `meta keywords`
- `og:*`
- `twitter:*`
- `canonical` (si se usa dinámico)

`SeoService` se llama desde `LandingComponent` en `ngOnInit()` con `generateTags(...)`.
Si se desea canonical dinámico, usar `setCanonical(url)` desde el componente.

## Envío de mensajes (formulario)

- Servicio: `src/app/features/landing/contact.service.ts`
- Método principal: `sendEmail(formData)` que hace POST a `/send_email.php`.

### Verificación rápida

1. Ejecutar `ng serve`.
2. Enviar el formulario.
3. Abrir DevTools → Network → Fetch/XHR.
4. Confirmar POST a `/send_email.php` con status 200.

## Cómo arrancar el proyecto

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Levantar servidor de desarrollo:
   ```bash
   ng serve
   ```
3. Abrir en el navegador:
   ```
   http://localhost:4200/
   ```
