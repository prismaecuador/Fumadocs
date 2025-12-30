# 🚀 Guía de Despliegue - Fumadocs Multi-Cliente

Esta guía te explica paso a paso cómo configurar subdominios personalizados para cada cliente en Vercel con tu dominio `helloprisma.com` desde Hostinger.

## 📋 Tabla de Contenidos

1. [Arquitectura de Subdominios](#arquitectura-de-subdominios)
2. [Configuración en Vercel](#configuración-en-vercel)
3. [Configuración DNS en Hostinger](#configuración-dns-en-hostinger)
4. [Agregar Nuevos Clientes](#agregar-nuevos-clientes)
5. [Verificación y Testing](#verificación-y-testing)
6. [Troubleshooting](#troubleshooting)

---

## 🏗️ Arquitectura de Subdominios

Cada cliente tendrá su propio subdominio:

- **Partner Gym**: `partnergym.helloprisma.com`
- **Futuro Cliente**: `nombrecliente.helloprisma.com`

### Cómo funciona:

1. **Usuario accede** → `partnergym.helloprisma.com`
2. **DNS (Hostinger)** → Redirige a Vercel
3. **Middleware** → Detecta subdominio "partnergym"
4. **App** → Carga contenido de `/partner-gym/*`
5. **Branding** → Aplica colores y logo de Partner Gym

---

## ⚙️ Configuración en Vercel

### Paso 1: Desplegar el Proyecto

1. Ve a [vercel.com](https://vercel.com) y conecta tu repositorio
2. Importa el proyecto `Fumadocs-Dezik`
3. Configura el build:
   - **Framework Preset**: Next.js
   - **Build Command**: `pnpm build`
   - **Output Directory**: `.next`
   - **Install Command**: `pnpm install`

4. Click en **Deploy**

### Paso 2: Agregar Dominio Principal

1. En tu proyecto de Vercel, ve a **Settings** → **Domains**
2. Agrega el dominio: `helloprisma.com`
3. Vercel te mostrará los registros DNS necesarios (guárdalos para el siguiente paso)

### Paso 3: Agregar Wildcard para Subdominios

1. En la misma sección **Domains**, agrega:
   ```
   *.helloprisma.com
   ```
2. Esto permitirá que TODOS los subdominios apunten a tu proyecto
3. Vercel te dará registros DNS adicionales

### Paso 4: Agregar Subdominios Específicos (Opcional pero Recomendado)

Para mejor control, agrega cada subdominio explícitamente:

1. Click en **Add Domain**
2. Agrega:
   - `partnergym.helloprisma.com`

3. Vercel lo marcará como "Valid Configuration" una vez configurado el DNS

---

## 🌐 Configuración DNS en Hostinger

### Paso 1: Acceder al Panel DNS

1. Inicia sesión en [Hostinger](https://www.hostinger.com)
2. Ve a **Dominios** → Selecciona `helloprisma.com`
3. Click en **DNS / Servidores de Nombres**

### Paso 2: Configurar Registros DNS

Debes agregar los siguientes registros DNS:

#### A) Registro para Dominio Principal (opcional)

Si quieres que `helloprisma.com` también funcione:

| Tipo | Nombre | Contenido | TTL |
|------|--------|-----------|-----|
| A | @ | `76.76.21.21` | 3600 |

#### B) Registro Wildcard para TODOS los Subdominios

**OPCIÓN 1: Wildcard CNAME (Recomendado)**

| Tipo | Nombre | Contenido | TTL |
|------|--------|-----------|-----|
| CNAME | * | `cname.vercel-dns.com` | 3600 |

**OPCIÓN 2: Registros Individuales por Subdominio**

Si Hostinger no permite wildcards, agrega cada subdominio:

| Tipo | Nombre | Contenido | TTL |
|------|--------|-----------|-----|
| CNAME | partnergym | `cname.vercel-dns.com` | 3600 |

### Paso 3: Valores Específicos de Vercel

Vercel puede pedirte valores diferentes. Usa EXACTAMENTE los que te muestra Vercel, que pueden ser:

**Para el dominio principal:**
```
Tipo: A
Nombre: @
Valor: 76.76.21.21
```

**Para subdominios (wildcard):**
```
Tipo: CNAME
Nombre: *
Valor: cname.vercel-dns.com
```

O valores específicos como:
```
Tipo: CNAME
Nombre: partnergym
Valor: cname-china.vercel-dns.com
```

### Paso 4: Guardar y Esperar Propagación

1. Click en **Guardar Cambios**
2. La propagación DNS puede tomar entre **5 minutos a 48 horas**
3. Típicamente funciona en 15-30 minutos

---

## ➕ Agregar Nuevos Clientes

### Paso 1: Crear Estructura del Cliente

```bash
# Crear carpeta del cliente
mkdir -p import/clientes/nuevo-cliente/sections
mkdir -p import/clientes/nuevo-cliente/public

# Crear config.json
cat > import/clientes/nuevo-cliente/config.json << 'EOF'
{
  "projectName": "Nuevo Cliente",
  "domain": "nuevocliente.helloprisma.com",
  "secondaryColors": {
    "highlight": "#FF5733",
    "accent": "#C70039",
    "hover": "#900C3F"
  }
}
EOF
```

### Paso 2: Agregar Contenido

```bash
# Agregar secciones
import/clientes/nuevo-cliente/sections/
├── Sección 1/
│   └── Página 1.md
├── Sección 2/
│   └── Página 2.md
```

### Paso 3: Agregar Logo

```bash
# Copiar logo del cliente (SVG o PNG)
cp /ruta/al/logo.svg import/clientes/nuevo-cliente/public/logo.svg
```

### Paso 4: Generar Contenido

```bash
# Ejecutar ingest para generar el sitio
CLIENT_NAME=nuevo-cliente pnpm ingest
```

### Paso 5: Configurar DNS

1. En **Hostinger**, agrega registro DNS:
   ```
   Tipo: CNAME
   Nombre: nuevocliente
   Valor: cname.vercel-dns.com
   TTL: 3600
   ```

2. En **Vercel** → **Domains**, agrega:
   ```
   nuevocliente.helloprisma.com
   ```

### Paso 6: Deploy

```bash
# Commit y push
git add .
git commit -m "feat: Add nuevo-cliente"
git push

# Vercel desplegará automáticamente
```

### Paso 7: Verificar

Espera 15-30 minutos y accede a:
```
https://nuevocliente.helloprisma.com
```

---

## ✅ Verificación y Testing

### 1. Verificar Configuración DNS

```bash
# Comprobar si el DNS está propagado
dig partnergym.helloprisma.com

# O usar herramienta online
# https://www.whatsmydns.net/#CNAME/partnergym.helloprisma.com
```

### 2. Probar en Desarrollo (Localhost)

```bash
# Iniciar servidor
pnpm dev

# Acceder en navegador
http://localhost:3000/partner-gym/seccion-1
```

### 3. Probar en Producción

```bash
# Acceder a cada subdominio
https://partnergym.helloprisma.com
https://example.helloprisma.com
```

### 4. Verificar Detección de Cliente

Abre las **DevTools** del navegador (F12) y ejecuta:

```javascript
// En la consola
console.log(window.location.hostname.split('.')[0])
// Debe mostrar: "partnergym" o el nombre del cliente
```

---

## 🔧 Troubleshooting

### Problema: "Domain Not Found" o "404"

**Causa**: DNS no propagado o mal configurado

**Solución**:
1. Verifica los registros DNS en Hostinger
2. Usa `dig` o whatsmydns.net para verificar propagación
3. Espera hasta 48 horas para propagación completa
4. Verifica que el valor CNAME sea exactamente el que Vercel proporciona

### Problema: Se muestra el cliente incorrecto

**Causa**: Middleware no detecta el subdominio correctamente

**Solución**:
1. Verifica que el nombre del subdominio coincida con la carpeta:
   - Subdominio: `partnergym`
   - Carpeta: `import/clientes/partner-gym` ❌ (guion)
   - **Debe ser**: `import/clientes/partnergym` ✅

2. O actualiza el `config.json`:
   ```json
   {
     "domain": "partner-gym.helloprisma.com"
   }
   ```

### Problema: Logo no carga

**Causa**: Archivo de logo no existe o ruta incorrecta

**Solución**:
1. Verifica que existe: `public/partnergym/logo.svg` o `public/partnergym/logo.png`
2. Ejecuta el ingest nuevamente: `pnpm ingest`
3. Verifica en DevTools → Network que la ruta sea correcta

### Problema: Colores no se aplican

**Causa**: Ingest no ejecutado o colores mal configurados

**Solución**:
1. Ejecuta: `pnpm ingest`
2. Verifica `tailwind.config.ts` tiene los colores actualizados
3. Haz rebuild: `pnpm build`

### Problema: SSL/HTTPS no funciona

**Causa**: Vercel aún está generando certificados

**Solución**:
1. Vercel genera certificados SSL automáticamente
2. Puede tomar 5-10 minutos después de configurar el DNS
3. Verifica en **Vercel** → **Domains** que diga "Valid Configuration"

### Problema: Wildcard (*) no funciona en Hostinger

**Causa**: Algunos providers no soportan wildcards

**Solución**:
1. Agrega cada subdominio manualmente:
   ```
   CNAME partnergym → cname.vercel-dns.com
   CNAME example → cname.vercel-dns.com
   CNAME cliente3 → cname.vercel-dns.com
   ```

---

## 📊 Resumen de Configuración

| Componente | Configuración |
|------------|---------------|
| **Vercel** | Proyecto desplegado + Dominios agregados |
| **DNS** | CNAME wildcard (*) o registros individuales |
| **Middleware** | Detecta automáticamente el subdominio |
| **Config** | Cada cliente tiene `config.json` con domain |
| **Rutas** | `/partner-gym/*`, `/example/*`, etc. |

---

## 🎯 Checklist de Despliegue

- [ ] Proyecto desplegado en Vercel
- [ ] Dominio `helloprisma.com` agregado en Vercel
- [ ] Wildcard `*.helloprisma.com` agregado en Vercel
- [ ] Registros DNS configurados en Hostinger
- [ ] DNS propagado (verificado con dig/whatsmydns)
- [ ] Subdominios agregados explícitamente (opcional)
- [ ] SSL activo en Vercel (marca verde)
- [ ] Testing de cada subdominio funcionando
- [ ] Logos cargando correctamente
- [ ] Colores de branding aplicados
- [ ] Búsqueda funcionando
- [ ] Navegación funcionando

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs de Vercel: **Project** → **Deployments** → Click en deployment → **View Function Logs**
2. Verifica el middleware: `src/middleware.ts`
3. Revisa la consola del navegador (F12)
4. Verifica que los archivos estén en las rutas correctas

---

## 🎉 ¡Listo!

Una vez configurado, cada vez que agregues un nuevo cliente solo necesitas:

1. Crear carpeta en `import/clientes/{nombre-cliente}`
2. Agregar contenido y config.json
3. Ejecutar `pnpm ingest`
4. Agregar registro DNS en Hostinger
5. Deploy automático con git push

¡El sistema escalará infinitamente con nuevos clientes! 🚀
