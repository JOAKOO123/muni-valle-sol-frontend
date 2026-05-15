# Municipalidad Valle del Sol — Frontend

Plataforma web de gestión de incendios para la Municipalidad Valle del Sol. Permite a ciudadanos, brigadistas y administradores visualizar reportes de incendios en tiempo real, gestionar alertas y coordinar respuestas de emergencia.

---

## Tabla de Contenidos

- [Stack Tecnológico](#stack-tecnológico)
- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Patrones de Diseño](#patrones-de-diseño)
- [Estructura de Carpetas](#estructura-de-carpetas)
- [Git Flow](#git-flow)
- [Convenciones de Commits](#convenciones-de-commits)
- [Buenas Prácticas de Código](#buenas-prácticas-de-código)
- [Seguridad](#seguridad)
- [Instalación y Uso](#instalación-y-uso)
- [Variables de Entorno](#variables-de-entorno)

---

## Stack Tecnológico

| Tecnología | Versión | Propósito |
|---|---|---|
| Next.js | 16.2.4 | Framework React con App Router |
| React | 19.2.4 | Librería de UI |
| TypeScript | ^5 | Tipado estático |
| Zustand | ^5.0.13 | Gestión de estado global |
| Zod | ^4.4.3 | Validación de esquemas |
| MapLibre GL | ^5.24.0 | Renderizado de mapas interactivos |
| Tailwind CSS | ^4 | Estilos utilitarios |
| ESLint | ^9 | Linting y calidad de código |

---

## Arquitectura del Proyecto

El proyecto sigue una **arquitectura en capas** inspirada en Clean Architecture, separando claramente las responsabilidades entre presentación, lógica de negocio y acceso a datos.

```
┌─────────────────────────────────────┐
│           CAPA DE PRESENTACIÓN      │
│     Pages (app/) + Components       │
├─────────────────────────────────────┤
│         CAPA DE LÓGICA              │
│     Custom Hooks (hooks/)           │
├─────────────────────────────────────┤
│         CAPA DE ESTADO              │
│     Stores Zustand (store/)         │
├─────────────────────────────────────┤
│         CAPA DE DATOS               │
│     Services (services/)            │
├─────────────────────────────────────┤
│         CAPA DE TIPOS               │
│     TypeScript Interfaces (types/)  │
└─────────────────────────────────────┘
                   │
                   ▼
         BFF (Backend for Frontend)
```

### Patrón BFF (Backend for Frontend)

El frontend **nunca se comunica directamente con microservicios**. Toda la comunicación pasa por un BFF intermediario cuya URL se configura mediante la variable de entorno `NEXT_PUBLIC_BFF_URL`. Esto desacopla el frontend de los servicios internos y centraliza la lógica de autenticación y transformación de datos.

---

## Patrones de Diseño

### 1. Singleton Store (Zustand)

Cada store de Zustand es una instancia única compartida en toda la aplicación. Se definen tres stores con responsabilidades bien separadas:

- **`useAuthStore`** — Estado de autenticación: usuario activo, sesión y acciones de login/logout.
- **`useAlertStore`** — Estado de alertas activas: listado, adición y limpieza de alertas.
- **`useAppStore`** — Estado global de UI: modo oscuro y ubicación del usuario.

```ts
// Ejemplo: patrón Singleton con Zustand
const useAuthStore = create<AuthState>((set) => ({
  usuario: null,
  isAuthenticated: false,
  login: (usuario) => set({ usuario, isAuthenticated: true }),
  logout: () => set({ usuario: null, isAuthenticated: false }),
}))
```

### 2. Custom Hooks (Separación de responsabilidades)

La lógica de negocio y los side-effects están encapsulados en **custom hooks**, manteniendo los componentes enfocados exclusivamente en la presentación.

- **`useAlerts`** — Obtiene alertas del servicio y las almacena en el store.
- **`useReports`** — Obtiene reportes del BFF con manejo de loading y error.
- **`useUserLocation`** — Suscribe al GPS del dispositivo y sincroniza la ubicación en el store global.
- **`useDashboard`** — Hook compuesto que agrega `useReports` y `useAlerts` en una única interfaz para la página del dashboard.

```ts
// Ejemplo: hook compuesto (Facade Pattern)
const useDashboard = () => {
  const { reports, loading: loadingReports, error: errorReports } = useReports()
  const { loading: loadingAlerts, error: errorAlerts } = useAlerts()
  return {
    reports,
    loading: loadingReports || loadingAlerts,
    error: errorReports || errorAlerts,
  }
}
```

### 3. Service Layer (Acceso a datos centralizado)

Toda la comunicación con el BFF está abstraída en archivos de servicio independientes. Los componentes y hooks nunca usan `fetch` directamente; siempre delegan en un servicio.

```
services/
├── authService.ts    → login, register, logout, getMe
├── alertService.ts   → obtenerAlertas, crearAlerta
└── reportService.ts  → obtenerReportes, crearReporte, actualizarReporte, eliminarReporte
```

### 4. Schema Validation con Zod

Los formularios se validan mediante **esquemas Zod** antes de enviar datos al servidor. Los tipos TypeScript se infieren directamente del esquema, evitando duplicación de definiciones.

```ts
const registerSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

type RegisterForm = z.infer<typeof registerSchema> // Tipado inferido automáticamente
```

### 5. Control de Acceso Basado en Roles (RBAC)

La aplicación diferencia las acciones disponibles según el rol del usuario autenticado (`ADMIN`, `BRIGADISTA`, `CIUDADANO`). La UI se adapta dinámicamente sin lógica de permisos dispersa en múltiples componentes.

```ts
// Solo los ciudadanos pueden crear alertas desde el dashboard
const isCiudadano = usuario?.rol === 'CIUDADANO'
{isCiudadano && <button onClick={() => setShowAlertModal(true)}>Nueva Alerta</button>}
```

### 6. Dynamic Import con SSR Deshabilitado

El componente `FireMap` utiliza MapLibre GL, que requiere acceso al DOM. Se importa dinámicamente con `ssr: false` para evitar errores en el servidor durante el renderizado de Next.js.

```ts
const FireMap = dynamic(() => import('@/components/FireMap'), {
  ssr: false,
  loading: () => <p>Cargando mapa...</p>,
})
```

### 7. Auto-refresh sin recarga de página

El dashboard implementa un **polling silencioso** cada 30 segundos usando `setInterval` dentro de un `useEffect`, actualizando reportes y alertas sin recargar la página completa.

```ts
useEffect(() => {
  fetchData()
  const interval = setInterval(fetchData, 30000)
  return () => clearInterval(interval) // Cleanup para evitar memory leaks
}, [])
```

---

## Estructura de Carpetas

```
src/
├── app/                    # App Router de Next.js (Pages)
│   ├── layout.tsx          # Layout raíz: Header + Footer globales
│   ├── page.tsx            # Redirección a /dashboard
│   ├── login/
│   │   └── page.tsx        # Página de login y registro
│   └── dashboard/
│       └── page.tsx        # Dashboard principal (mapa + alertas + reportes)
│
├── components/             # Componentes de UI reutilizables
│   ├── Header.tsx          # Barra de navegación superior
│   ├── Footer.tsx          # Pie de página
│   ├── Sidebar.tsx         # Navegación lateral con perfil de usuario
│   ├── FireMap.tsx         # Mapa interactivo MapLibre GL
│   ├── AlertPanel.tsx      # Panel de alertas activas
│   ├── ReportTable.tsx     # Tabla de reportes con acciones por rol
│   └── CreateAlertModal.tsx # Modal para crear nuevas alertas
│
├── hooks/                  # Custom hooks (lógica de negocio)
│   ├── useAlerts.ts        # Carga y gestión de alertas
│   ├── useReports.ts       # Carga y gestión de reportes
│   ├── useDashboard.ts     # Hook compuesto para el dashboard
│   └── useUserLocation.ts  # Geolocalización del usuario
│
├── services/               # Capa de acceso al BFF
│   ├── authService.ts      # Autenticación (login, register, logout, getMe)
│   ├── alertService.ts     # CRUD de alertas
│   └── reportService.ts    # CRUD de reportes
│
├── store/                  # Estado global con Zustand
│   ├── useAuthStore.ts     # Estado de sesión y usuario
│   ├── useAlertStore.ts    # Estado de alertas activas
│   └── useAppStore.ts      # Estado UI: darkMode, ubicación
│
└── types/                  # Interfaces TypeScript compartidas
    ├── User.ts             # Interface User con roles
    ├── Alert.ts            # Interface Alert con severidades
    └── Report.ts           # Interface Report con ubicación anidada
```

---

## Git Flow

El proyecto sigue una adaptación de **Git Flow** con las siguientes ramas:

```
main          ← Producción (estable)
  └── develop ← Integración (rama base de trabajo)
        ├── feature/HDU-XX-nombre-descripcion   ← Nuevas funcionalidades
        ├── fix/HDU-XX-descripcion-del-fix      ← Correcciones de bugs
        └── chore/descripcion                   ← Tareas técnicas (refactors, renombres)
```

### Flujo de trabajo

1. Toda nueva tarea se desarrolla en una rama `feature/`, `fix/` o `chore/` creada desde `develop`.
2. Al completar la tarea, se hace merge a `develop` mediante Pull Request.
3. Cuando `develop` está estable y testeada, se hace merge a `main` para un nuevo release.

### Ejemplos de ramas del proyecto

```
feature/HDU-16-zustand-global-store
feature/HDU-17-custom-hooks-bff
feature/HDU-18-dashboard-mapa-alertas
feature/HDU-21-refactor-sidebar-perfil
feature/HDU-23-seguridad-jwt-httponly
feature/HDU-25-validaciones-login-register
feature/HDU-26-acciones-por-rol
feature/HDU-27-marcador-ubicacion-usuario
feature/HDU-28-responsive-layout
fix/HDU-24-auto-refresh-sin-recarga
fix/sincronizar-endpoints-bff
chore/renombrar-archivos-ingles
```

---

## Convenciones de Commits

Los commits siguen la convención **Conventional Commits** con referencia a la Historia de Usuario (HDU):

```
<tipo>: <descripcion en imperativo> [HDU-XX opcional]

Tipos:
  feat    → Nueva funcionalidad
  fix     → Corrección de bug
  chore   → Tareas técnicas (refactor, renombrar, config)
  docs    → Documentación
  style   → Cambios de estilos sin lógica
```

### Ejemplos reales del proyecto

```
feat: HDU-23 implementar seguridad JWT con cookies HttpOnly en lugar de localStorage
feat: HDU-25 agregar validaciones de email con dominios permitidos y contraseña segura con Zod
fix: HDU-24 reemplazar window.location.reload por fetch silencioso cada 30 segundos
fix: corregir anclaje del marcador de ubicación del usuario
chore: renombrar archivos del proyecto a inglés para consistencia profesional
```

---

## Buenas Prácticas de Código

### TypeScript Estricto

El proyecto tiene habilitado `"strict": true` en `tsconfig.json`, lo que activa `strictNullChecks`, `noImplicitAny` y otras validaciones que previenen errores en tiempo de ejecución.

### Alias de Importaciones

Se usa el alias `@/` para evitar rutas relativas frágiles:

```ts
// Correcto
import useAuthStore from '@/store/useAuthStore'

// Evitado
import useAuthStore from '../../store/useAuthStore'
```

### Cleanup de Efectos

Todos los `useEffect` que crean suscripciones, watchers o intervalos retornan su función de limpieza para prevenir memory leaks:

```ts
const watcher = navigator.geolocation.watchPosition(...)
return () => navigator.geolocation.clearWatch(watcher)
```

### Manejo de Errores Tipado

Los bloques `catch` castean el error para manejar mensajes de forma segura:

```ts
} catch (err: unknown) {
  const message = err instanceof Error ? err.message : 'Ocurrió un error'
  setServerError(message)
}
```

### Responsividad Mobile-first

Los componentes usan clases de Tailwind con breakpoints progresivos. La Sidebar tiene comportamiento diferenciado: drawer en mobile, fija en desktop.

```tsx
className={`fixed md:static ... ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
```

### Separación de Concerns

Los componentes de presentación no contienen lógica de negocio ni llamadas directas a servicios. Reciben datos y callbacks por props o leen del store global, delegando todo en hooks y servicios.

---

## Seguridad

### JWT con Cookies HttpOnly

La autenticación usa tokens JWT almacenados en **cookies HttpOnly** gestionadas por el BFF, en lugar de `localStorage`. Esto previene ataques XSS ya que el JavaScript del cliente no puede acceder al token.

```ts
// credentials: 'include' envía las cookies automáticamente en cada request
const response = await fetch(`${BASE_URL}/api/auth/login`, {
  method: 'POST',
  credentials: 'include',
  ...
})
```

### Validación de Dominios de Email

El registro solo acepta correos de dominios universitarios y proveedores reconocidos, validado con Zod en el cliente antes de enviar al servidor.

### Logout Resiliente

Si el BFF falla durante el logout, el estado local de sesión se limpia igualmente, garantizando que el usuario siempre pueda cerrar su sesión en el cliente.

---

## Instalación y Uso

### Requisitos

- Node.js >= 18
- npm >= 9

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/JOAKOO123/muni-valle-sol-frontend.git
cd muni-valle-sol-frontend

# 2. Cambiar a la rama de desarrollo
git checkout develop

# 3. Instalar dependencias
npm install

# 4. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con la URL del BFF

# 5. Iniciar en modo desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

### Scripts disponibles

```bash
npm run dev      # Servidor de desarrollo con hot-reload
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Análisis estático con ESLint
```

---

## Variables de Entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `NEXT_PUBLIC_BFF_URL` | URL base del Backend for Frontend | `http://localhost:8080` |

> Las variables prefijadas con `NEXT_PUBLIC_` son expuestas al cliente. No incluir secretos en ellas.

---

## Roles de Usuario

| Rol | Permisos |
|---|---|
| `CIUDADANO` | Crear alertas, ver reportes y mapa |
| `BRIGADISTA` | Ver reportes y mapa, gestionar incidentes |
| `ADMIN` | Acceso completo: crear, editar y eliminar reportes y alertas |