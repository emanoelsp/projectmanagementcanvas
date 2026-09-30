# Guia de Deploy — PMC (Vercel)

## Pré-requisitos

1. **Conta Vercel**: https://vercel.com (conecte com GitHub)
2. **Credenciais Firebase**: Variáveis de ambiente prontas
3. **GitHub**: Repositório pushado

## Passos de Deploy

### 1. Push para GitHub

```bash
git push origin main
```

### 2. Conectar no Vercel

**Opção A: Web Console (Recomendado)**
- Acesse https://vercel.com/new
- Selecione "Import Git Repository"
- Escolha seu repositório GitHub
- Clique "Import"

**Opção B: Vercel CLI**

```bash
vercel login
vercel --prod
```

### 3. Configurar Environment Variables

No dashboard Vercel, vá para **Settings → Environment Variables** e adicione:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDFLjCvNAuVWgtexlVLQ8jSEAVO0WhO6no
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=dataspace-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=dataspace-app
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=dataspace-app.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=243199439344
NEXT_PUBLIC_FIREBASE_APP_ID=1:243199439344:web:eaf5d043ddde7131406d35
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-3B8MR5HEF7
```

### 4. Deploy Automático

Após conectar GitHub:
- Cada push para `main` dispara deploy automático
- Preview deployments para PRs
- Logs de build disponíveis no dashboard

### 5. Verificar Deploy

```bash
# Validar build localmente antes de fazer push
npm run build
npm run test

# Push
git add . && git commit -m "Prep for deploy" && git push

# Vercel deploy automático
# Acompanhe em: https://vercel.com/dashboard
```

## Troubleshooting

### Build fails com "peer dependencies"

Vercel vai executar:
```bash
npm install --legacy-peer-deps
npm run build
```

Isso já está configurado em `vercel.json`.

### Variáveis de ambiente não aparecem

1. Verifique **Settings → Environment Variables** (escopo: Production)
2. Redeploy após adicionar variáveis
3. Limpe cache do browser

### Erro "Cannot find module"

Execute localmente:
```bash
npm install --legacy-peer-deps
npm run build
```

Se funcionar localmente mas falhar em Vercel, limpe o build cache do Vercel e redeploy.

## Próximos Passos

- [ ] Domínio customizado (Settings → Domains)
- [ ] Configurar CORS para Firebase (se necessário)
- [ ] Monitoramento (Sentry + Analytics)
- [ ] CI/CD customizado (`.github/workflows/`)

## URLs Úteis

- **Dashboard**: https://vercel.com/dashboard
- **Projeto PMC**: https://vercel.com/projects/pmc (após deploy)
- **Logs**: https://vercel.com/docs/concepts/deployments/logs
