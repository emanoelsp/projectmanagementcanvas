# Fix Firebase CORS Error

## Problema
```
Blocked a frame with origin "https://dataspace-app.firebaseapp.com" 
from accessing a frame with origin "https://pmc-five-navy.vercel.app"
```

## Solução: Autorizar domínio no Firebase Console

### Passo 1: Ir para as Chaves de API
1. Acesse: https://console.firebase.google.com/project/dataspace-app/settings/apikeys
2. Selecione a chave: `AIzaSyDFLjCvNAuVWgtexlVLQ8jSEAVO0WhO6no`
3. Clique em **Edit API Key** (ícone de lápis)

### Passo 2: Adicionar Restrições HTTP
1. Vá até a seção **API restrictions**
2. Em **Application restrictions**, selecione: **HTTP referrers (websites)**
3. Na caixa de texto, adicione estas origens:
```
https://pmc-five-navy.vercel.app/*
https://pmc-*.vercel.app/*
localhost:3000/*
localhost:3001/*
```

### Passo 3: Salvar
- Clique em **Save**
- Aguarde 5-10 minutos para propagação

---

## Alternativa: Usar Domínio Customizado (RECOMENDADO)

### Se quiser usar um domínio próprio:
1. No Vercel Dashboard → Settings → Domains
2. Adicione seu domínio (ex: pmc.seu-dominio.com)
3. Configure DNS
4. Autorize apenas esse domínio no Firebase

---

## Teste Local
```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Test registration
curl http://localhost:3000/auth/register
```

Se funcionar localmente mas não em produção, o CORS está bloqueado.
