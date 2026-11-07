# 🌿 DOCUMENTACIÓN TÉCNICA Y OPERATIVA - HUERTA HOGAREÑA

> ⚠️ **REGLA MANDATORIA PARA DESARROLLADORES Y ASISTENTES DE IA:**  
> **ESTE DOCUMENTO DEBE ACTUALIZARSE OBLIGATORIAMENTE ANTE CUALQUIER CAMBIO EN EL PROYECTO** (arquitectura, infraestructura, workflows CI/CD, procesos PM2, paletas, rutas o reglas de negocio). Nunca dar por finalizada una tarea sin reflejar los cambios aquí.

---

## 📌 1. RESUMEN DEL PROYECTO

* **Nombre del Emprendimiento:** Huerta Hogareña (Huerta Luque)
* **Propósito y Filosofía:** Venta directa de plantines excedentes. Son plantas germinadas de forma casera para la huerta propia que quedaron de más y se ofrecen a los vecinos para que no se desperdicien. Principal foco en colocar los tomates.
* **URL en vivo:** `https://huertaluque.duckdns.org/`
* **URL de carteles imprimibles:** `https://huertaluque.duckdns.org/carteles.html`
* **WhatsApp de contacto:** `+5491127504590` (Formato local: `11 2750-4590`).
* **Tono de comunicación:** Informal, cercano, vecino, casero y en singular (ej. *"Tengo plantines"*, *"Escribime por WhatsApp"*). **Queda prohibido el uso de lenguaje corporativo o plurales ("nosotros", "envianos")**.

---

## 📂 2. UBICACIÓN DE CÓDIGO Y REPOSITORIOS

### Repositorio del Proyecto Huerta Hogareña:
* **Ubicación Local:** `/var/home/dilelu/repos/HuertaLuque`
* **Repositorio GitHub:** `https://github.com/dilelu94/huerta-luque` (rama principal: `main`)
* **Ubicación en el Servidor (OCI):** `/home/ubuntu/huertaluque`
* **Proceso PM2 en Servidor:** `huertaluque` (Puerto local `8085`).

### Repositorio Principal (Granja Luque):
* **Ubicación Local:** `/var/home/dilelu/repos/Granja`
* **Repositorio GitHub:** `dilelu94/granja-luque`
* **Ubicación en el Servidor (OCI):** `/home/ubuntu/granja-luque`
* **Proceso PM2 en Servidor:** `granja-app` (Puerto local `8080`).

---

## 🌐 3. INFRAESTRUCTURA Y DESPLIEGUE (SERVER OCI)

* **Proveedor Cloud:** Oracle Cloud Infrastructure (OCI).
* **IP del Servidor:** `129.80.59.99`
* **Dominio Huerta:** `huertaluque.duckdns.org`
* **Dominio Granja:** `granjaluque.duckdns.org`
* **Usuario SSH:** `ubuntu`
* **Llave SSH:** `~/.ssh/granja`
* **Servidor Web / Reverse Proxy:** Nginx (`/etc/nginx/sites-available/huerta` y `/etc/nginx/sites-available/granja`).

### Configuración de Nginx para Huerta Luque (`/etc/nginx/sites-available/huerta`):
```nginx
server {
    server_name huertaluque.duckdns.org;

    location / {
        proxy_pass http://localhost:8085;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/huertaluque.duckdns.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/huertaluque.duckdns.org/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}
```

### Redirección de QR Antiguo en Nginx (`/etc/nginx/sites-available/granja`):
El bloque de Granja redirige permanentemente (`301`) las peticiones a `/plantines` y `/granja` directamente a `https://huertaluque.duckdns.org/`, permitiendo que los carteles viejos ya impresos sigan funcionando sin problemas.

---

## 🛠️ 4. RESOLUCIÓN DE PROBLEMAS TÉCNICOS CRÍTICOS

### 🛑 Problema de Redirección / Service Worker Scope en Chrome:
* **Causa Raíz:** Granja Luque es una PWA que registraba un Service Worker con scope `'/'`. Al usar subdirectorios (`/plantines`), Chrome interceptaba la navegación y mostraba la home de Granja.
* **Solución Definitiva:**
  1. Se separó la huerta en su propio dominio: `huertaluque.duckdns.org`.
  2. Nginx redirige los accesos viejos de `/plantines` hacia el nuevo dominio.
  3. Cada dominio tiene su propio contexto de cookies, caché y Service Worker sin interferencias.

---

## 💰 5. PRECIOS, STOCK Y ENCARGOS ($ ARS)

* **1 Plantín individual:** **$2.500 ARS**
* **Combo 3 Plantines (Mix):** **$7.500 ARS**
* **Combo 5 Plantines (Kit Huertita):** **$11.000 ARS**

### Variedades y Disponibilidad:
1. 🍅 **Tomate Reliquia:** `✅ 5 disponibles` - Variedades antiguas de sabor dulce e intenso. Sabor a tomate de verdad.
2. 🍅 **Mini Kumato (Cherry):** `✅ 5 disponibles` - Estilo Cherry oscurito, súper dulzón. Ideal para comer directo de la planta o en ensaladas.
3. 🌶️ **Ajíes Variados:** `❌ Sin stock (0)` - Variedad de ajíes dulces y picantes.
4. 🫑 **Morrón Rojo:** `❌ Sin stock (0)` - Morrón rojo dulce de huerta.

### Sección por Encargo (al fondo de la web):
Bloque discreto para pedir tandas pequeñas a germinar por pedido vía WhatsApp:
* 🌿 **Albahaca**
* 🥗 **Rúcula**
* 🥬 **Acelga**

---

## 🖨️ 6. CARTELES IMPRIMIBLES (`carteles.html`)

El archivo `carteles.html` genera **4 Hojas A4** diseñadas para impresión directa (`Ctrl + P` / botón de impresión):

* **Hoja 1 (A4):** Cartel de Precios de Distancia (Genérico con letras gigantes para la calle).
* **Hoja 2 (A4):** Cartel con Código QR + WhatsApp (Título: *"🌱 ARMÁ TU HUERTA"*, diseño de ahorro de tinta con QR directo a `huertaluque.duckdns.org`).
* **Hojas 3 y 4 (A4):** Carteles Identificadores de Planta individuales.
  * **Medida exacta:** **15,5 cm x 8,0 cm** (diseñados para deslizar dentro de bolsas Ziplock de **16 cm x 8,5 cm**).
  * **Sin precio:** Solo indican nombre de variedad, icono/gráfico SVG en rojo y descripción, con diseño limpio para ahorro de tinta.

---

## 🧪 7. PRUEBAS AUTOMÁTICAS Y CI/CD (AUTO-DEPLOY)

### Ejecutar Tests Locales:
```bash
cd /var/home/dilelu/repos/HuertaLuque
npm test
```
*(Utiliza Vitest + Supertest para validar endpoints `/health`, `/`, `/carteles.html`, stock de tomates y variedades).*

### Pipeline Automatizado en GitHub Actions (`.github/workflows/deploy.yml`):
El repositorio cuenta con auto-deploy automatizado mediante GitHub Actions:
1. **Fase 1 (`Run Automated Tests`):** Corre `npm test` en `ubuntu-latest`. Si algún test falla, el pipeline se detiene inmediatamente y **no** despliega.
2. **Fase 2 (`Deploy to OCI`):** Se ejecuta solo tras aprobar los tests (`needs: test`) en ramas `main`/`master`. Conecta por SSH usando los secrets del repositorio (`OCI_HOST`, `OCI_USER`, `OCI_SSH_KEY`), sincroniza los archivos en `/home/ubuntu/huertaluque/` vía `rsync` y reinicia el proceso con `pm2 restart huertaluque`.

### Despliegue Manual de Contingencia a Servidor OCI:
```bash
cd /var/home/dilelu/repos/HuertaLuque
scp -i ~/.ssh/granja index.html styles.css carteles.html server.js tests/server.test.js ubuntu@129.80.59.99:/home/ubuntu/huertaluque/
ssh -i ~/.ssh/granja ubuntu@129.80.59.99 "pm2 restart huertaluque"
```

---

## 🔔 8. ALERTAS PM2 Y TELEGRAM
* El servidor cuenta con un monitor de Telegram (`pm2-telegram-monitor`).
* **Aislamiento:** Está configurado para escuchar exclusivamente el proceso `granja-app`. No monitorea ni envía notificaciones cruzadas de `huertaluque`.

---

## 🎨 9. DIRECTRICES DE DISEÑO E IDENTIDAD VISUAL
* **Paleta:** Botánica artesanal (fondo lino `#faf8f5`, texto carbón `#111a14` y `#222d25` con alto contraste y nitidez, acentos verdes bosque y terracota).
* **Tipografía:** Fraunces (títulos con carácter editorial botánico) + Plus Jakarta Sans (lectura limpia).
* **Anti-Clichés:** Prohibido spamear pills decorativos o etiquetas de tipo SaaS ("eyebrows") sobre títulos. Los pills solo se permiten como tags funcionales (ej. selección de aromáticas por encargo). Prohibido el uso de la palabra "casera" en la interfaz pública.

