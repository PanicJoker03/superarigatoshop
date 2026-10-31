# superarigatoshop
Shopify Angular Web App for E Commerce for Super Arigato

Walktrough:
https://buttercms.com/blog/headless-commerce-your-shopify-store-built-with-angular-and-buttercms/ 

Trello:
https://trello.com/b/oBoz23Kn/super-arigato-shop 

This project is made with Angular +19, so it doesn't use module based schema.

## Alcance:

* Solo hacer tienda
* venta
* compra
* carga de productos
* consulta ordenes
* administracion implicita de cuenta compradores  

### shopify links

stores:
https://dev.shopify.com/dashboard/220771485/stores 

api:
https://admin.shopify.com/store/superarigatodev/headless/253050/storefront_api


## setup your env

* configure vs code with continue, use ollama or similar  

## Deployment


## 🚀 Deployment Workflow

Super Arigato uses Angular for its frontend and Netlify for production hosting.

The deployment process separates development, preview, and production releases to protect the live storefront.

### 1. Development Build

Compile the application using the production configuration:

```bash
npm run build:production
```

Generated output:

```text
dist/superarigatoshop/
└── browser/
```

### 2. Preview Deployment

Build the application and publish a draft deployment to Netlify:

```bash
npm run deploy:preview
```

Netlify generates a preview URL without replacing the production website.

Validate the following before releasing:

- [ ] Homepage renders correctly.
- [ ] Product catalog loads.
- [ ] Product details and variant selection work.
- [ ] Shopping cart operates correctly.
- [ ] Shopify checkout works.
- [ ] Customer authentication works.
- [ ] Order history loads correctly.
- [ ] Angular routes survive browser refresh.

### 3. Production Release

Once the preview has been validated, deploy to production:

```bash
npm run deploy:production
```

This command builds the application and publishes only:

```text
dist/superarigatoshop/browser/
```

Production URL:

**https://superarigato.com**

### 4. Deployment Commands Reference

| Command | Description |
|---|---|
| `npm run build:production` | Generate production build |
| `npm run deploy:preview` | Build and deploy a Netlify draft |
| `npm run deploy:production` | Build and publish production |
| `npm run netlify:login` | Authenticate with Netlify |
| `npm run netlify:link` | Link the local project to the existing Netlify site |

### 5. Important Deployment Rules

- Never use `ng deploy` for the Netlify production workflow.
- Always test a preview deployment before publishing production.
- Netlify must publish `dist/superarigatoshop/browser`, not the parent directory.
- Keep `_redirects` inside the browser output to support Angular client-side routing.
- Do not manually modify generated files inside `dist/`.
- Keep Shopify credentials and API secrets out of the repository.

### 6. Production Rollback

If a production deployment introduces an issue:

1. Open the Netlify Dashboard.
2. Navigate to **Deploys**.
3. Find the previous known-good production deployment.
4. Select **Publish deploy** to restore it.

---

**Deployment principle:** Build → Preview → Validate → Production.

Protect the live storefront by validating every release before publishing.


## Libs

* apollo
* angular material
* rxjs
* graphql

#### dev

* Currently on development store
* https://chromewebstore.google.com/detail/angular-devtools/ienfalfjdbdpebioblfackkekamfmbnh 
* important to comprehend Shopify Storefront API

#### Run 

> Use 'ng start'

### deploy

deployed automatically when commiting to main

