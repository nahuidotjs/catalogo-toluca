# Catálogo Geográfico · México 🗺

Sitio web estático para explorar y descargar capas KML de datos geográficos de México.  
Desplegado en **GitHub Pages** — sin backend, sin base de datos.

---

## 🚀 Cómo desplegar en GitHub Pages

### 1. Sube el repositorio a GitHub

```bash
git init
git add .
git commit -m "Primer commit — catálogo geográfico"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
```

### 2. Activa GitHub Pages

1. Ve a tu repositorio en GitHub.
2. Clic en **Settings** → sección **Pages** (barra izquierda).
3. En "Branch", selecciona `main` y carpeta `/root (/)`.
4. Clic en **Save**.
5. En ~1 minuto el sitio estará en:  
   `https://TU_USUARIO.github.io/TU_REPO/`

---

## 📁 Estructura del proyecto

```
geocatalogo/
├── index.html          ← Página principal
├── css/
│   └── style.css       ← Estilos (tema claro)
├── js/
│   ├── data.js         ← 📝 AQUÍ agregas tus capas KML
│   └── app.js          ← Lógica de filtros, cards y modal
├── README.md
└── .nojekyll           ← Evita problemas con GitHub Pages
```

---

## ✏️ Cómo agregar una capa KML

Edita el archivo `js/data.js` y agrega un bloque al arreglo `window.CAPAS`:

```javascript
{
  id: "mi-capa-unica",           // identificador único (sin espacios)
  titulo: "Nombre visible",
  grupo: "Censos",               // Sección del catálogo
  tema: "censos",                // Filtro: censos | clima | areas-naturales | recursos | infraestructura
  escala: "estatal",             // estatal | municipal | localidad | nacional
  fuente: "INEGI",
  fecha: "2020",
  desc: "Descripción breve de la capa.",
  thumb: "",                     // URL de imagen preview (opcional)
  driveUrl: "https://drive.google.com/uc?id=TU_ID_DE_DRIVE&export=download",
  icon: "🗺"                     // Ícono si no hay imagen
}
```

### Obtener enlace de descarga de Google Drive

1. Sube tu KML a Google Drive.
2. Clic derecho → **Compartir** → cambia a "Cualquier persona con el enlace".
3. Copia el enlace. Ejemplo:  
   `https://drive.google.com/file/d/1aBcDeFgHiJkLmNoPqRsTuV/view`
4. Conviértelo a enlace de descarga directa:  
   `https://drive.google.com/uc?id=1aBcDeFgHiJkLmNoPqRsTuV&export=download`
5. Pega esa URL en el campo `driveUrl`.

---

## 🎨 Personalización rápida

| Qué cambiar | Dónde |
|---|---|
| Nombre del sitio | `index.html` → `.site-title` y `<title>` |
| Colores | `css/style.css` → variables `:root` |
| Grupos del catálogo | `js/data.js` → campo `grupo` |
| Opciones de filtro | `index.html` → `<select>` + `js/data.js` → campo `tema` |

---

## 🛠 Tecnologías

- HTML5 + CSS3 + JavaScript vanilla
- Google Fonts (Playfair Display + Source Sans 3)
- Google Drive (almacenamiento de KMLs)
- GitHub Pages (hosting gratuito)
