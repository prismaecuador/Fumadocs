# 🌐 Guía Rápida: Subdominios Multi-Cliente

## ✅ ¿Qué se puede hacer?

**SÍ**, puedes configurar subdominios para cada cliente en Vercel con tu dominio `helloprisma.com` de Hostinger.

Cada cliente tendrá su propio subdominio:
- `partnergym.helloprisma.com` → Partner Gym
- `example.helloprisma.com` → Example
- `acme.helloprisma.com` → ACME (futuro cliente)
- Y así sucesivamente...

---

## 🎯 Cómo Funciona

```
┌─────────────────────────────────────────────────────────────────┐
│  Usuario accede a: partnergym.helloprisma.com                   │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  DNS (Hostinger)                                                 │
│  CNAME: partnergym → cname.vercel-dns.com                       │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  Vercel recibe la petición                                       │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  Next.js Middleware (src/middleware.ts)                          │
│  - Detecta hostname: "partnergym.helloprisma.com"               │
│  - Extrae subdominio: "partnergym"                              │
│  - Establece header: x-client-name = "partnergym"               │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  Aplicación Next.js                                              │
│  - Carga rutas: /partner-gym/*                                  │
│  - Logo: /partner-gym/logo.svg                                  │
│  - Colores: #D6F800 (del config.json)                          │
│  - Contenido: src/content/partner-gym/                          │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  Usuario ve el sitio de Partner Gym con su branding            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Configuración en 3 Pasos

### 1️⃣ Configurar Vercel

Ve a tu proyecto en Vercel → **Settings** → **Domains**

**Agrega estos dominios:**
```
helloprisma.com
*.helloprisma.com (wildcard para todos los subdominios)
partnergym.helloprisma.com
example.helloprisma.com
```

Vercel te dará valores DNS. Anótalos (ejemplo):
```
cname.vercel-dns.com
```

### 2️⃣ Configurar DNS en Hostinger

Inicia sesión en Hostinger → **Dominios** → `helloprisma.com` → **DNS**

**Agrega estos registros CNAME:**

| Tipo  | Nombre      | Apunta a                | TTL  |
|-------|-------------|-------------------------|------|
| CNAME | partnergym  | cname.vercel-dns.com    | 3600 |
| CNAME | example     | cname.vercel-dns.com    | 3600 |
| CNAME | *           | cname.vercel-dns.com    | 3600 |

**Nota:** El wildcard `*` permite que cualquier subdominio funcione automáticamente.

### 3️⃣ Esperar Propagación

- **Tiempo normal:** 5-30 minutos
- **Tiempo máximo:** 48 horas (raro)

**Verificar propagación:**
```bash
# Comando en terminal
dig partnergym.helloprisma.com

# O usar herramienta web
https://www.whatsmydns.net/#CNAME/partnergym.helloprisma.com
```

---

## ➕ Agregar Nuevo Cliente

### Opción 1: Script Automático (Recomendado)

```bash
./scripts/add-client.sh -n acme -f "ACME Corp" -c "#FF5733"
```

Esto crea:
- `import/clientes/acme/` (estructura completa)
- `config.json` con colores y dominio
- Contenido de ejemplo
- Logo placeholder

### Opción 2: Manual

```bash
# 1. Crear estructura
mkdir -p import/clientes/acme/sections/Seccion-1
mkdir -p import/clientes/acme/public

# 2. Crear config
cat > import/clientes/acme/config.json << 'EOF'
{
  "projectName": "ACME Corp",
  "domain": "acme.helloprisma.com",
  "secondaryColors": {
    "highlight": "#FF5733",
    "accent": "#EFEFEF",
    "hover": "#CCCCCC"
  }
}
EOF

# 3. Agregar logo
cp /ruta/a/logo.svg import/clientes/acme/public/logo.svg

# 4. Generar sitio
CLIENT_NAME=acme pnpm ingest

# 5. Agregar DNS en Hostinger
# CNAME: acme → cname.vercel-dns.com

# 6. Agregar dominio en Vercel
# acme.helloprisma.com

# 7. Deploy
git add . && git commit -m "feat: Add ACME client" && git push
```

---

## 📊 Estado Actual del Proyecto

### Clientes Configurados

| Cliente     | Subdominio                      | Estado    | Logo | Secciones |
|-------------|---------------------------------|-----------|------|-----------|
| Partner Gym | partnergym.helloprisma.com      | ✅ Activo | ✅   | 3         |

### Archivos Actualizados

| Archivo | Propósito | Estado |
|---------|-----------|--------|
| `src/middleware.ts` | Detecta subdominios en producción | ✅ Actualizado |
| `src/hooks/useClientName.ts` | Hook para cliente actual | ✅ Actualizado |
| `vercel.json` | Configuración Vercel | ✅ Actualizado |
| `DEPLOYMENT.md` | Guía completa de deploy | ✅ Creado |
| `scripts/add-client.sh` | Script para agregar clientes | ✅ Creado |
| `README.md` | Documentación principal | ✅ Actualizado |

---

## 🧪 Testing

### Desarrollo (Localhost)

```bash
pnpm dev

# Acceder a:
http://localhost:3000/partner-gym/seccion-1
```

### Producción (Vercel)

```bash
# Después de configurar DNS:
https://partnergym.helloprisma.com
```

### Verificar Detección de Cliente

**En DevTools (F12) → Console:**

```javascript
// Debe mostrar el nombre del cliente actual
console.log(window.location.hostname.split('.')[0])
// Output: "partnergym"
```

---

## 🚨 Troubleshooting

### Problema: "This site can't be reached"

**Causa:** DNS no propagado aún

**Solución:**
- Esperar 30 minutos más
- Verificar registros DNS en Hostinger
- Usar `dig partnergym.helloprisma.com`

### Problema: Se muestra cliente incorrecto

**Causa:** Nombre de subdominio no coincide con nombre de carpeta

**Ejemplo del problema:**
- Subdominio: `partnergym` (sin guion)
- Carpeta: `partner-gym` (con guion)

**Solución 1:** Renombrar carpeta para que coincida
```bash
mv import/clientes/partner-gym import/clientes/partnergym
```

**Solución 2:** Usar el mismo nombre en `config.json` y subdominio

### Problema: Logo no carga

**Causa:** Archivo no existe en la ruta correcta

**Solución:**
```bash
# Verificar que existe
ls public/partnergym/logo.svg

# Si no existe, copiar desde import
cp import/clientes/partnergym/public/logo.svg public/partnergym/logo.svg

# O ejecutar ingest nuevamente
CLIENT_NAME=partnergym pnpm ingest
```

### Problema: Colores no se aplican

**Causa:** Ingest no ejecutado después de cambiar config.json

**Solución:**
```bash
CLIENT_NAME=partnergym pnpm ingest
pnpm build
```

---

## 📋 Checklist de Deploy

Antes de configurar un nuevo cliente, verifica:

- [ ] Carpeta creada en `import/clientes/{nombre}/`
- [ ] `config.json` con domain, projectName y colors
- [ ] Logo agregado en `import/clientes/{nombre}/public/logo.svg`
- [ ] Contenido Markdown en `sections/`
- [ ] `CLIENT_NAME={nombre} pnpm ingest` ejecutado exitosamente
- [ ] Commit y push a GitHub
- [ ] Dominio agregado en Vercel: `{nombre}.helloprisma.com`
- [ ] CNAME agregado en Hostinger: `{nombre} → cname.vercel-dns.com`
- [ ] DNS propagado (verificado con `dig` o whatsmydns.net)
- [ ] SSL activo en Vercel (marca verde)
- [ ] Sitio accesible en `https://{nombre}.helloprisma.com`
- [ ] Logo carga correctamente
- [ ] Colores aplicados correctamente
- [ ] Navegación funciona
- [ ] Búsqueda funciona

---

## 🎉 Resultado Final

Una vez configurado, tendrás:

✅ **Infinitos clientes** sin límite (solo crea más carpetas)
✅ **Subdominios automáticos** (`*.helloprisma.com`)
✅ **Branding independiente** (colores, logos por cliente)
✅ **Deploy automático** (git push → Vercel despliega)
✅ **SSL gratis** (certificados automáticos por Vercel)
✅ **Escalabilidad** (agregar clientes en minutos)

---

## 📞 Recursos

- **Documentación completa:** [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Guía de uso:** [README.md](./README.md)
- **Configuración Vercel:** [vercel.json](./vercel.json)
- **Middleware:** [src/middleware.ts](./src/middleware.ts)

---

## 🔑 Puntos Clave

1. **Un proyecto, múltiples clientes** - Todo en un solo repositorio
2. **Detección automática** - Middleware detecta el subdominio
3. **Aislamiento total** - Cada cliente tiene su propio contenido, rutas y branding
4. **Fácil escalabilidad** - Agregar clientes es cuestión de minutos
5. **DNS simple** - Solo un CNAME por cliente en Hostinger
6. **Deploy automático** - Git push y Vercel se encarga del resto

¡Listo para escalar infinitamente! 🚀
