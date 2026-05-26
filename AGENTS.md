# AGENTS.md — Convención de arquitectura Dotbin Client 2

Este proyecto usa una arquitectura **por capacidades de negocio**, no por carpetas técnicas. La prioridad es que el código grite el negocio de Dotbin antes que React, Redux o cualquier herramienta de turno.

## 1. Principio rector

Separar por **dominio de negocio** y, dentro de cada dominio, ordenar por responsabilidad.

No crear features por rutas ni por menú. `calendar` y `dashboard` son pantallas; `scheduling` y `analytics` son capacidades.

```txt
src/
├── app/       # composición de aplicación
├── shared/    # infraestructura y UI realmente reusable
├── domains/   # capacidades de negocio
├── assets/
└── styles/
```

## 2. Estructura base obligatoria

```txt
src/
├── app/
│   ├── bootstrap/
│   ├── providers/
│   ├── router/
│   └── store/
├── shared/
│   ├── api/
│   ├── config/
│   ├── hooks/
│   ├── types/
│   └── ui/
├── domains/
│   ├── identity-access/
│   ├── center-management/
│   ├── patients/
│   ├── scheduling/
│   ├── clinical-services/
│   ├── doctors/
│   ├── inventory/
│   ├── catalog/
│   ├── billing-payments/
│   ├── analytics/
│   └── dotty-assistant/
├── assets/
└── styles/
```

## 3. Responsabilidad de carpetas principales

### `app/`

Composición global de la SPA.

- `router/`: router principal y composición de rutas publicadas por dominios.
- `store/`: store raíz, hooks tipados, root reducer.
- `providers/`: providers globales: auth, store, router, theme si aplica.
- `bootstrap/`: carga inicial de sesión y datos mínimos de aplicación.

`app` puede importar desde `domains` y `shared`.

### `shared/`

Solo cosas transversales y reutilizables.

- `api/`: cliente HTTP, helpers de auth headers, tipos genéricos de request.
- `config/`: environment, configuración global, error maps globales.
- `hooks/`: hooks sin negocio específico.
- `types/`: tipos transversales (`Nullable`, `ApiError`, `ServiceCall`, etc.).
- `ui/`: sistema visual reusable.

No meter cosas en `shared` “por si algún día se reutilizan”. Si no se usa en 2+ dominios y no es transversal, vive en su dominio.

### `domains/`

Cada carpeta representa una capacidad de negocio. No representa una página ni una categoría visual.

## 4. Dominios estándar

```txt
identity-access     # sesión, usuario, permisos, Auth0, perfil
center-management   # centro, configuración, integraciones del centro
patients            # pacientes, detalle, documentos, historia clínica, consultas
scheduling          # agenda, turnos, bloqueos, disponibilidad, cierre de turno
clinical-services   # tratamientos, categorías de tratamiento, servicios clínicos
doctors             # profesionales/doctores, agenda profesional, disponibilidad profesional
inventory           # stock, movimientos, recepción, órdenes de compra
catalog             # productos y proveedores
billing-payments    # pagos, carrito, recibos, PDFs, checkout
analytics           # dashboard, métricas, KPIs
dotty-assistant     # IA, importación asistida, panel Dotty
```

## 5. Estructura interna de un dominio

```txt
domains/<domain>/
├── index.ts
├── routes/
│   ├── index.ts
│   └── routes.tsx
├── pages/
│   └── *.page.tsx
├── model/
│   ├── *.types.ts
│   ├── *.schema.ts
│   ├── *.constants.ts
│   └── *.permissions.ts
├── api/
│   ├── *.api.ts
│   └── *.mapper.ts
├── state/
│   ├── *.slice.ts
│   ├── *.selectors.ts
│   └── *.thunks.ts
├── application/
│   ├── *.hook.ts
│   └── *.service.ts
├── ui/
│   ├── components/
│   ├── forms/
│   ├── sections/
│   ├── dialogs/
│   ├── drawers/
│   ├── styles/
│   ├── types/
│   └── tabs/
└── utils/
    └── *.utils.ts
```

### Capas del dominio

- `model/`: tipos, schemas Zod, constantes y permisos propios del dominio.
- `api/`: adaptadores HTTP. No deben contener lógica de UI.
- `state/`: Redux slices, selectors y thunks si el dominio necesita estado global.
- `application/`: hooks/casos de uso que orquestan UI + API + state.
- `pages/`: pantallas/rutas del dominio. Componen componentes, no concentran UI reusable.
- `ui/`: componentes específicos del dominio. No meter pages acá.
- `ui/styles`: tokens visuales, class maps y estilos compartidos dentro del dominio. No meter reglas de negocio acá.
- `ui/types`: tipos estrictamente visuales o de interacción UI. Los tipos de negocio siguen viviendo en `model`.
- `utils/`: helpers privados del dominio.

## 6. Atomic Design

### Dónde sí

Usar Atomic Design en `shared/ui`, porque ahí vive el sistema visual reusable.

```txt
shared/ui/
├── atoms/
├── molecules/
├── organisms/
├── templates/
├── layout/
└── feedback/
```

Ejemplos válidos:

```txt
shared/ui/atoms/Button.component.tsx
shared/ui/atoms/Input.component.tsx
shared/ui/molecules/SearchBar.component.tsx
shared/ui/organisms/AppSidebar.component.tsx
shared/ui/layout/AppLayout.component.tsx
shared/ui/feedback/EmptyState.component.tsx
```

### Dónde no por defecto

No repetir Atomic Design automáticamente dentro de cada dominio. En dominios usar carpetas por rol de pantalla:

```txt
domains/patients/ui/
├── components/
├── forms/
├── sections/
├── dialogs/
├── drawers/
└── tabs/
```

Solo usar `atoms/molecules/organisms` dentro de un dominio si hay masa crítica real de UI propia. No crear carpetas vacías para aparentar arquitectura.

## 7. Convención de nombres por responsabilidad

Formato:

```txt
<Name>.<responsibility>.tsx
<name>.<responsibility>.ts
```

Sufijos permitidos:

```txt
.page.tsx        # pantalla/ruta
.component.tsx   # componente visual genérico o fallback
.form.tsx        # formulario
.section.tsx     # sección grande de una page
.dialog.tsx      # modal/dialog
.drawer.tsx      # drawer lateral
.tab.tsx         # tab de pantalla
.table.tsx       # tabla de negocio
.card.tsx        # card de negocio
.hook.ts         # custom hook
.api.ts          # adaptador HTTP
.slice.ts        # Redux slice
.selectors.ts    # selectors
.thunks.ts       # thunks/async orchestration
.schema.ts       # schema Zod
.types.ts        # tipos del dominio
.mapper.ts       # transformación API <-> dominio
.constants.ts    # constantes
.styles.ts       # tokens visuales/class maps compartidos dentro de ui
.permissions.ts  # permisos del dominio
.utils.ts        # helpers
.service.ts      # caso de uso/servicio de aplicación
```

Ejemplo correcto:

```txt
domains/patients/pages/Patients.page.tsx
domains/patients/pages/PatientDetail.page.tsx
domains/patients/ui/forms/PatientCreate.form.tsx
domains/patients/ui/tables/PatientTable.table.tsx
domains/patients/ui/dialogs/PatientDelete.dialog.tsx
domains/patients/application/usePatientsList.hook.ts
domains/patients/api/patients.api.ts
domains/patients/state/patients.slice.ts
domains/patients/model/patient.schema.ts
domains/patients/model/patient.types.ts
```

Evitar nombres genéricos sin rol:

```txt
Patients.tsx
indexComponent.tsx
helper.ts
data.ts
utils.ts
```

## 8. Reglas de importación

Dirección permitida:

```txt
app -> domains -> shared
```

Reglas:

- `shared` no importa desde `domains` ni desde `app`.
- Un dominio no debe importar internos de otro dominio.
- Si un dominio necesita exponer algo, debe hacerlo desde su `index.ts` público.
- No importar deep internals de otro dominio.

Permitido:

```ts
import { Button } from '@shared/ui/atoms';
import { patientsRoutes } from '@domains/patients';
```

Evitar:

```ts
import { PatientTable } from '@domains/patients/ui/tables/PatientTable.table';
import { patientsReducer } from '@domains/patients/state/patients.slice';
```

## 9. Router y store

Cada dominio puede publicar rutas desde `routes/routes.tsx` y exponerlas por `routes/index.ts`.

```txt
domains/patients/routes/routes.tsx
domains/scheduling/routes/routes.tsx
domains/clinical-services/routes/routes.tsx
```

El router global compone esas rutas en `app/router`.

El store global compone reducers publicados por dominios desde `app/store`.

Los slices viven cerca del dominio, no en una carpeta global de slices.

## 10. Doctores, tratamientos y categorías de tratamiento

La gestión de doctores/profesionales pertenece a `doctors`.

```txt
domains/doctors/
├── model/
│   ├── doctor.types.ts
│   └── doctor.schema.ts
├── api/
│   └── doctors.api.ts
├── state/
├── application/
└── ui/
```

La gestión de tratamientos pertenece a `clinical-services`.

```txt
domains/clinical-services/
├── model/
│   ├── treatment.types.ts
│   ├── treatment.schema.ts
│   ├── treatmentCategory.types.ts
│   └── treatmentCategory.schema.ts
├── api/
│   ├── treatments.api.ts
│   └── treatmentCategories.api.ts
├── state/
├── application/
└── ui/
```

## 12. Qué NO hacer

- No crear `components/`, `services/`, `types/`, `utils/` globales por costumbre.
- No llamar dominio a una pantalla: `calendar`, `dashboard`, `profilePage`.
- No meter UI específica de negocio en `shared/ui`.
- No crear `atoms/molecules/organisms` dentro de cada dominio si no hay complejidad real.
- No usar enums rígidos para categorías configurables por centro.
- No pisar valores cargados por el usuario al aplicar defaults de categoría.
- No importar deep internals de otro dominio.

## 13. Checklist antes de crear un archivo

Preguntar:

1. ¿Esto pertenece a una capacidad de negocio concreta?
2. ¿Es realmente reusable entre dominios o estoy mandándolo a `shared` por ansiedad?
3. ¿El nombre del archivo dice su responsabilidad?
4. ¿Estoy importando desde una frontera pública?
5. ¿La carpeta donde lo pongo ayuda a entender el negocio?

Si la respuesta es no, frená. Ordenar después sale caro.
