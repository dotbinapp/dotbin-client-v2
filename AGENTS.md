# AGENTS.md — Convención de arquitectura Dotbin Client 2

Este proyecto usa una arquitectura **por capacidades de negocio**, no por carpetas técnicas. La prioridad es que el código grite el negocio de Dotbin antes que React, Redux, TanStack Query o cualquier herramienta de turno.

## 1. Principio rector

Separar por **dominio de negocio** y, dentro de cada dominio, ordenar por responsabilidad.

No crear features por rutas ni por menú. `calendar` y `dashboard` son pantallas; `scheduling` y `analytics` son capacidades.

La arquitectura debe cumplir tres objetivos:

1. Que el negocio sea fácil de encontrar.
2. Que cada archivo tenga una responsabilidad clara.
3. Que las dependencias apunten siempre hacia capas más estables, no al revés.

```txt
src/
├── app/       # composición de aplicación
├── shared/    # infraestructura y UI realmente reusable
├── domains/   # capacidades de negocio
├── assets/
└── styles/
```

## 2. Directivas de Clean Code

El código debe ser explícito, chico y legible. Si una persona nueva no puede entender qué hace un archivo en menos de un minuto, el archivo probablemente está mezclando responsabilidades.

### Reglas obligatorias

- Escribir código simple antes que código ingenioso.
- Evitar boilerplate innecesario. No crear archivos, capas, wrappers o abstracciones “por si acaso”.
- Nombrar variables, funciones, componentes y archivos según intención de negocio, no según implementación.
- Mantener funciones pequeñas y con una única razón de cambio.
- Mantener componentes enfocados en renderizar UI. La lógica de aplicación debe vivir en hooks o servicios de `application/`.
- Evitar comentarios que expliquen código confuso. Primero mejorar el código; comentar solo decisiones, restricciones o reglas no obvias.
- No usar nombres genéricos como `data`, `item`, `handler`, `manager`, `helper`, `utils` cuando exista un nombre de dominio más preciso.
- No duplicar lógica de negocio entre pantallas. Extraer a `application/`, `model/` o `api/` según corresponda.
- No mezclar formateo visual, llamadas HTTP, validaciones de negocio y estado global en un mismo componente.
- Preferir retornos tempranos antes que bloques `if/else` anidados.
- Tipar contratos de entrada y salida. No usar `any` salvo justificación puntual y temporal.
- El texto visible para el usuario debe ser mínimo, específico y accionable. No mostrar IDs internos, flujos técnicos ni errores crudos de backend.

### Componentes React

- Un componente debe tener una responsabilidad visual clara.
- Si un componente crece demasiado, dividir en `sections`, `forms`, `dialogs`, `tables` o componentes internos del dominio.
- No hacer fetching directo dentro de componentes visuales reutilizables.
- No acoplar componentes de `shared/ui` a reglas de negocio de Dotbin.
- No crear componentes “mega configurables” con 20 props si el dominio necesita una variante específica.

## 3. Directivas de Clean Architecture

La aplicación debe separar **políticas de negocio**, **casos de uso**, **adaptadores** y **UI**. React, Redux, TanStack Query, Zod, Axios, MUI o cualquier librería son detalles de implementación, no el centro de la arquitectura.

### Regla de dependencias

Las dependencias deben apuntar hacia adentro:

```txt
app -> domains -> shared
```

Dentro de un dominio:

```txt
pages/ui -> application -> model
pages/ui -> api
application -> api/model/state
api -> shared/api
state -> model
```

El `model/` no debe depender de UI, router, Redux, TanStack Query, Axios ni componentes React. Puede contener schemas Zod porque forman parte del contrato del dominio.

### Responsabilidades por capa

- `model/`: entidades, tipos, schemas, constantes, permisos y reglas propias del dominio.
- `api/`: adaptadores para comunicarse con el backend. Transforman datos externos a datos útiles para el dominio.
- `state/`: estado global del dominio con Redux cuando sea necesario a nivel app.
- `application/`: casos de uso, hooks orquestadores y lógica de aplicación.
- `pages/`: composición de rutas/pantallas. No concentran lógica de negocio.
- `ui/`: componentes visuales del dominio.
- `shared/`: infraestructura y UI transversal sin conocimiento de negocio específico.

### Reglas obligatorias

- No poner reglas de negocio en componentes de UI.
- No poner lógica de presentación en `model/`.
- No poner llamadas HTTP en `pages/` ni en componentes visuales.
- No exponer detalles del backend directamente a la UI si requieren transformación.
- No importar internos de otro dominio.
- No crear dependencias circulares entre dominios.
- No permitir que `shared` conozca dominios.
- No crear abstracciones genéricas sin al menos dos usos reales.
- Cada dominio debe exponer únicamente su API pública desde `index.ts`.

## 4. Gestión de estado y APIs

Este proyecto usa una estrategia separada para **estado de aplicación** y **datos del servidor**.

### Redux

Usar **Redux Toolkit** como gestor de estado global a nivel app.

Redux se usa para estado que:

- debe compartirse entre múltiples dominios o pantallas;
- representa decisiones globales de la app;
- necesita selectors, trazabilidad o actualizaciones coordinadas;
- no depende directamente de la frescura del servidor;
- modela estado de UI global o contexto activo.

Ejemplos válidos:

```txt
auth/session snapshot
center activo
permisos normalizados
layout global
filtros globales persistidos
estado de navegación funcional
preferencias de usuario a nivel app
```

Los slices viven cerca del dominio dueño del estado:

```txt
domains/patients/state/patients.slice.ts
domains/scheduling/state/scheduling.slice.ts
```

El store raíz solo compone reducers publicados por dominios desde sus fronteras públicas.

### TanStack Query

Usar **TanStack Query** para datos provenientes de APIs.

TanStack Query se usa para:

- fetching;
- cache de datos del servidor;
- loading/error states de requests;
- invalidaciones;
- refetch;
- mutations;
- sincronización con backend.

Ejemplos válidos:

```txt
pacientes
turnos
tratamientos
profesionales
disponibilidad
historial clínico
pagos
inventario
métricas
```

No duplicar en Redux datos que TanStack Query ya cachea correctamente.

### Regla práctica

```txt
Datos del backend       -> TanStack Query
Estado global de app    -> Redux Toolkit
Estado local de UI      -> useState/useReducer
Estado de formulario    -> librería de forms o estado local + Zod
Preferencias persistidas -> Redux persistido solo si son globales
```

Si un dato viene de la API, primero pensar en TanStack Query. Si un estado describe cómo la app se comporta globalmente, pensar en Redux.


## 5. Formularios y validaciones

Este proyecto usa **Zod** como herramienta estándar para validación y definición de contratos de formularios.

### Reglas obligatorias

- Todo formulario con reglas de validación debe tener un schema Zod asociado.
- Los schemas Zod viven en `model/` cuando representan reglas del dominio.
- No escribir validaciones de negocio sueltas dentro de componentes React.
- No duplicar validaciones entre UI, hooks y servicios. La fuente de verdad debe ser el schema.
- Los mensajes de error deben ser claros, específicos y orientados a la acción.
- No mostrar errores técnicos crudos al usuario.
- No usar `any` para inputs de formulario. Inferir tipos desde Zod siempre que sea posible.
- Validar datos antes de enviarlos a una mutation o servicio de aplicación.
- Transformaciones necesarias para adaptar UI -> API deben hacerse en `mapper.ts` o `application/`, no dentro del componente visual.

### Ubicación

Ejemplo:

```txt
domains/patients/model/patient.schema.ts
domains/patients/model/patient.types.ts
domains/patients/ui/forms/PatientCreate.form.tsx
domains/patients/application/useCreatePatientForm.hook.ts
domains/patients/queries/patientCreate.mutation.ts
```

### Patrón recomendado

```ts
// domains/patients/model/patient.schema.ts
import { z } from 'zod';

export const patientCreateSchema = z.object({
  firstName: z.string().min(1, 'Ingresá el nombre'),
  lastName: z.string().min(1, 'Ingresá el apellido'),
  phone: z.string().min(1, 'Ingresá un teléfono'),
});

export type PatientCreateFormValues = z.infer<typeof patientCreateSchema>;
```

El componente de formulario consume el schema, pero no define reglas de negocio inline.

```ts
// domains/patients/ui/forms/PatientCreate.form.tsx
// El form usa patientCreateSchema y PatientCreateFormValues.
// No define reglas duplicadas dentro del JSX.
```

### Integración con formularios

Si se usa una librería de formularios, debe integrarse con Zod mediante resolver/adaptador.

Ejemplo de intención arquitectónica:

```txt
UI form -> Zod schema -> application hook -> TanStack mutation -> API mapper -> backend
```

### Separación de responsabilidades

- `model/*.schema.ts`: reglas de validación y contratos del dominio.
- `model/*.types.ts`: tipos inferidos o tipos propios del dominio.
- `ui/forms/*.form.tsx`: render del formulario y feedback visual.
- `application/*.hook.ts`: orquestación de submit, parseo, side effects y navegación.
- `queries/*.mutation.ts`: mutation de TanStack Query.
- `api/*.mapper.ts`: adaptación entre payload de frontend y contrato de backend.

Zod valida el contrato. El formulario renderiza. La mutation persiste. Ninguna capa hace magia negra en horario laboral.

## 6. Estructura base obligatoria

```txt
src/
├── app/
│   ├── bootstrap/
│   ├── components/
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
│   ├── professionals/
│   ├── inventory/
│   ├── catalog/
│   ├── billing-payments/
│   ├── analytics/
│   └── dotty-assistant/
├── assets/
└── styles/
```

## 7. Responsabilidad de carpetas principales

### `app/`

Composición global de la SPA.

- `router/`: router principal y composición de rutas publicadas por dominios.
- `store/`: store raíz, hooks tipados, root reducer.
- `providers/`: providers globales: auth, Redux, TanStack Query, router, theme si aplica.
- `bootstrap/`: carga inicial de sesión y datos mínimos de aplicación.
- `components/`: componentes de nivel aplicativo, como layout raíz, sidebar de aplicación, guards visuales de routing y redirecciones. Pueden conocer router, providers, permisos y composición global. No pertenecen a `shared/ui` porque no son UI reusable libre de contexto.

`app` puede importar desde `domains` y `shared`.

### `shared/`

Solo cosas transversales y reutilizables.

- `api/`: cliente HTTP base, helpers de auth headers, tipos genéricos de request.
- `config/`: environment, configuración global, error maps globales.
- `hooks/`: hooks sin negocio específico.
- `types/`: tipos transversales (`Nullable`, `ApiError`, `ServiceCall`, etc.).
- `ui/`: sistema visual reusable.

No meter cosas en `shared` “por si algún día se reutilizan”. Si no se usa en 2+ dominios y no es transversal, vive en su dominio.

### `domains/`

Cada carpeta representa una capacidad de negocio. No representa una página ni una categoría visual.

## 8. Dominios estándar

```txt
identity-access     # sesión, usuario, permisos, Auth0, perfil
center-management   # centro, configuración, integraciones del centro
patients            # pacientes, detalle, documentos, historia clínica, consultas
scheduling          # agenda, turnos, bloqueos, disponibilidad, cierre de turno
clinical-services   # tratamientos, categorías de tratamiento, servicios clínicos
professionals       # staff/profesionales, agenda profesional, disponibilidad profesional
inventory           # stock, movimientos, recepción, órdenes de compra
catalog             # productos y proveedores
billing-payments    # pagos, carrito, recibos, PDFs, checkout
analytics           # dashboard, métricas, KPIs
dotty-assistant     # IA, importación asistida, panel Dotty
```

## 9. Estructura interna de un dominio

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
├── queries/
│   ├── *.query.ts
│   ├── *.mutation.ts
│   └── *.queryKeys.ts
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
- `queries/`: hooks y definiciones de TanStack Query para datos del servidor.
- `application/`: hooks/casos de uso que orquestan UI + API + state + queries.
- `pages/`: pantallas/rutas del dominio. Componen componentes, no concentran UI reusable.
- `ui/`: componentes específicos del dominio. No meter pages acá.
- `ui/styles`: tokens visuales, class maps y estilos compartidos dentro del dominio. No meter reglas de negocio acá.
- `ui/types`: tipos estrictamente visuales o de interacción UI. Los tipos de negocio siguen viviendo en `model`.
- `utils/`: helpers privados del dominio.

## 10. Atomic Design

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

## 11. Convención de nombres por responsabilidad

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
.query.ts        # hook/definición de TanStack Query
.mutation.ts     # mutation de TanStack Query
.queryKeys.ts    # query keys del dominio
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
domains/patients/queries/patients.query.ts
domains/patients/queries/patientCreate.mutation.ts
domains/patients/queries/patient.queryKeys.ts
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

## 12. Reglas de importación

Dirección permitida:

```txt
app -> domains -> shared
```

Reglas:

- `shared` no importa desde `domains` ni desde `app`.
- Un dominio no debe importar internos de otro dominio.
- Si un dominio necesita exponer algo, debe hacerlo desde su `index.ts` público.
- No importar deep internals de otro dominio.
- Importar desde fronteras de dominio y aliases públicos (`@domains/<domain>`, `@shared/...`, `@app/...`); no resolver dependencias con rutas relativas ascendentes como `../../`.
- `model/` no importa desde `api/`, `state/`, `queries/`, `application/`, `pages/` ni `ui/`.
- `shared/ui` no importa desde `shared/api`.
- `api/` puede importar desde `shared/api` y `model/`.
- `queries/` puede importar desde `api/` y `model/`.
- `application/` puede orquestar `queries/`, `state/`, `api/` y `model/`.

Permitido:

```ts
import { Button } from '@shared/ui/atoms';
import { patientsRoutes } from '@domains/patients';
import { patientCreateSchema } from '@domains/patients/model';
```

Evitar:

```ts
import { Button } from '../../../shared/ui/atoms';
import { patientCreateSchema } from '../../model/patient.schema';
import { PatientTable } from '@domains/patients/ui/tables/PatientTable.table';
import { patientsReducer } from '@domains/patients/state/patients.slice';
```

## 13. Router, store y query client

Cada dominio puede publicar rutas desde `routes/routes.tsx` y exponerlas por `routes/index.ts`.

```txt
domains/patients/routes/routes.tsx
domains/scheduling/routes/routes.tsx
domains/clinical-services/routes/routes.tsx
```

El router global compone esas rutas en `app/router`.

El store global compone reducers publicados por dominios desde `app/store`.

Los slices viven cerca del dominio, no en una carpeta global de slices.

TanStack Query se configura a nivel app desde `app/providers` o `app/bootstrap`, pero las queries/mutations viven cerca del dominio que las usa.

## 14. Profesionales, tratamientos y categorías de tratamiento

La gestión de profesionales/staff pertenece a `professionals`.

```txt
domains/professionals/
├── model/
│   ├── professional.types.ts
│   └── professional.schema.ts
├── api/
│   └── professionals.api.ts
├── state/
├── queries/
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
├── queries/
├── application/
└── ui/
```

## 15. Qué NO hacer

- No crear `components/`, `services/`, `types/`, `utils/` globales por costumbre.
- No llamar dominio a una pantalla: `calendar`, `dashboard`, `profilePage`.
- No meter UI específica de negocio en `shared/ui`.
- No crear `atoms/molecules/organisms` dentro de cada dominio si no hay complejidad real.
- No usar enums rígidos para categorías configurables por centro.
- No pisar valores cargados por el usuario al aplicar defaults de categoría.
- No importar deep internals de otro dominio.
- No guardar en Redux datos de API que TanStack Query debe cachear.
- No hacer llamadas HTTP directas desde componentes visuales.
- No mezclar validación de negocio con estilos visuales.
- No definir validaciones de formulario inline si corresponden a reglas de dominio; usar Zod en `model/*.schema.ts`.
- No exponer errores técnicos crudos al usuario.
- No crear abstracciones sin uso real.
- No agregar texto genérico, explicaciones de flujo o IDs internos en la UI.

## 16. Checklist antes de crear un archivo

Preguntar:

1. ¿Esto pertenece a una capacidad de negocio concreta?
2. ¿Es realmente reusable entre dominios o estoy mandándolo a `shared` por ansiedad?
3. ¿El nombre del archivo dice su responsabilidad?
4. ¿Estoy importando desde una frontera pública?
5. ¿La carpeta donde lo pongo ayuda a entender el negocio?
6. ¿Estoy usando Redux para estado global de app y TanStack Query para datos de API?
7. ¿La lógica de negocio quedó fuera de la UI?
8. ¿El archivo tiene una sola razón clara para cambiar?
9. ¿Las validaciones de formulario están centralizadas en Zod y no duplicadas en la UI?

Si la respuesta es no, frená. Ordenar después sale caro.
