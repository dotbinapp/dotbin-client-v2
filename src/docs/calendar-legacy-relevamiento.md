# Calendar migration roadmap

## Objetivo

Migrar el calendario legacy de `dotbin-client` a `dotbin-client-2` como parte del dominio `scheduling`, manteniendo el flujo crítico: ver semana → crear turno/bloqueo → operar una card → completar turno.

Este documento es hoja de ruta, no inventario infinito. Lo importante: qué migrar, en qué orden, con qué reglas y qué riesgos no podemos barrer abajo de la alfombra.

## Alcance de migración

### Entra

- Vista semanal única basada en `WeekView.component.tsx`.
- Creación y edición de turnos/bloqueos desde modal equivalente a `CalendarAppointmentModal.component.tsx`.
- Filtro por profesionales.
- Slots semanales según horario del centro.
- Días cerrados.
- Disponibilidad visual del doctor cuando hay un único doctor seleccionado.
- Cards de turno/bloqueo necesarias para abrir detalle, editar, cancelar, pagar y completar.
- Flujo de completar turno con notas evolutivas y stock cuando aplique.

### No entra

- Selector de vistas.
- `MonthView`.
- Vista `agenda` placeholder.
- Un dominio `calendar`. Esto pertenece a `domains/scheduling`.
- Copiar `WeekView` como componente monstruo con Redux adentro. Ni en pedo; eso es mudanza de deuda, no migración.

## Regla de arquitectura

La nueva estructura debe respetar `dotbin-client-2/AGENTS.md`:

```txt
src/domains/scheduling/
├── pages/
├── model/
├── api/
├── state/
├── application/
├── ui/
└── utils/
```

Regla práctica:

- `pages`: compone, no orquesta todo.
- `application`: hooks/casos de uso del flujo.
- `api`: wrappers HTTP del dominio.
- `state`: estado global si realmente hace falta.
- `ui`: componentes del calendario y diálogos.
- `utils`: cálculos puros testeables.

## Orden sugerido de migración

1. **Modelo base de scheduling — parcialmente hecho**
   - Ya existen `CalendarAppointment`, `CalendarBlock`, `CalendarItem`, `AppointmentStatus`, `CenterSchedule` y tipos de grilla en `model/scheduling.types.ts`.
   - Falta separar contratos de API/formulario de tipos visuales. No mezclar `CalendarItem` de UI con DTOs del backend, porque después una mutation termina acoplada a cómo se dibuja una card. Eso es una bomba de tiempo, no arquitectura.
   - Falta `model/appointment.schema.ts` para validar creación/edición con Zod.

2. **Persistencia y server state — próximo corte obligatorio**
   - Crear `api/appointments.api.ts` y `api/appointments.mapper.ts`.
   - Crear `queries/appointments.queryKeys.ts`, `queries/appointments.query.ts` y mutations de crear/editar/cambiar estado/eliminar.
   - Agregar TanStack Query al proyecto y provider global antes de empezar a pedir datos reales. `AGENTS.md` es claro: datos del backend van a TanStack Query, no a Redux.
   - Extender `shared/api/apiClient.ts` con `post`, `put`, `patch`, `delete`, `AbortSignal` y headers de autorización. Hoy solo soporta `GET`, así no se persiste nada.

3. **Contexto real del calendario — bloqueante para API**
   - Obtener `centerId`, `token`, `timezone`, permisos y schedule desde fronteras públicas existentes o bootstrap de app.
   - Definir frontera pública para datos auxiliares: doctores, pacientes y tratamientos. No importar deep internals de esos dominios.
   - Mientras esos dominios no tengan APIs públicas reales, usar contratos explícitos en `scheduling/application`, no mocks desperdigados en UI.

4. **Estado base del calendario — rediseñar según AGENTS.md**
   - Appointments/listado/loading/error deben vivir en TanStack Query.
   - Filtros de UI locales pueden vivir en `useCalendarWeek` si solo afectan la pantalla actual.
   - Filtro de doctores puede ser local al calendario en primera iteración; solo llevarlo a Redux si debe persistir globalmente o coordinarse con otras pantallas.
   - Mantener reglas legacy: si no hay doctores seleccionados, no mostrar turnos; no mostrar `APPOINTMENT` cancelados en grilla principal; `BLOCK` sin `doctorId` se muestra como bloqueo general.

5. **Week view sin acoplamiento — mayormente hecho**
   - Ya existe `CalendarWeekGrid` sin Redux directo y con cálculo en `useCalendarWeek` + utils.
   - Ya existen menús de slot/intervalo, filtros rápidos, columnas, time column y card mínima.
   - Falta conectar `schedule`, `items`, `loading`, `timezone`, `canEdit` y `onItemOpen` con casos de uso reales.
   - Falta reintroducir disponibilidad visual del doctor cuando hay un único doctor seleccionado. La función pura existe (`isSlotWithinDoctorWorkHours`), pero no está aplicada en la grilla nueva.
   - Falta mobile parity: scroll horizontal sincronizado, header mobile y línea de hora actual. Decidir si entra en el primer corte o queda explícitamente fuera.

6. **Modal de creación/edición — scaffold hecho, funcionalidad pendiente**
   - Ya existe `AppointmentCreate.dialog.tsx` y `AppointmentCreate.form.tsx`, pero hoy son UI sin submit real, sin schema, sin carga de pacientes/doctores/tratamientos y sin distinguir de verdad turno vs bloqueo.
   - Renombrar/evolucionar hacia `CalendarAppointment.dialog.tsx`, `Appointment.form.tsx` y `Block.form.tsx` cuando se implemente edición real. No hacerlo antes solo para “parecer prolijo”.
   - Mantener precarga desde slot: fecha + hora + intención.

7. **Cards y detalle operativo — pendiente**
   - Ya existe `CalendarItemCard.component.tsx` mínimo para visualizar.
   - Falta panel/drawer/dialog de detalle con editar, cancelar, eliminar bloqueo, registrar pago y completar.
   - La card NO debe llamar servicios complejos. La card abre acciones; `application/` orquesta. No repitamos el monstruo legacy.

8. **Completar turno — fuera del primer corte salvo decisión explícita**
   - Migrar `UpdateStatusModal` y flujo `TurnCompletion` solo si el corte funcional requiere completar desde calendario.
   - Separar cierre clínico/stock de la card para no convertir la card en un dios de 700 líneas.

## Flujo legacy actual: crear → completar

```txt
WeekView
  └─ click slot
      └─ onSlotIntent(day, startTime, appointment|block)
          └─ CalendarPage.handleSlotIntent
              └─ CalendarAppointmentModal
                  ├─ AppointmentForm | BlockForm
                  ├─ createAppointment / updateAppointment
                  └─ appointmentsSlice.addAppointment/updateAppointment

WeekView
  └─ AppointmentCard
      └─ AppointmentCardDetailPanel
          ├─ cambiar estado CONFIRMED / CANCELLED
          ├─ registrar pago
          └─ completar turno
              ├─ updateStatus(COMPLETED)
              ├─ appointmentsSlice.updateAppointment
              └─ UpdateStatusModal / TurnCompletionModalShell
                  ├─ notas evolutivas
                  └─ consumos de stock
```

## Estado actual en `dotbin-client-2`

### Ya creado

- `pages/Calendar.page.tsx`: compone header/body y mantiene `selectedDate` + selección de slot.
- `ui/sections/CalendarHeader.section.tsx`: week picker, botón `Nuevo`, permiso `CALENDAR_EDIT` y apertura de dialog.
- `ui/sections/CalendarBody.section.tsx`: monta la grilla semanal, pero con `EMPTY_CALENDAR_ITEMS` y timezone default.
- `ui/components/CalendarWeekGrid.component.tsx`: grilla desacoplada de Redux, con callbacks para slot e item.
- `ui/components/WeekGrid/*`: header, columna de horas, columna de día y celdas separadas.
- `ui/components/CalendarStatusFilters.component.tsx`, `CalendarIntervalMenu.component.tsx`, `CalendarSlotIntentMenu.component.tsx`.
- `ui/components/CalendarItemCard.component.tsx`: card mínima para turno/bloqueo.
- `application/useCalendarWeek.hook.ts`: cálculo de slots, columnas, filtros y posicionamiento.
- `utils/calendarWeek.utils.ts`, `calendarTime.utils.ts`, `weekGrid.utils.ts`, `weekPicker.utils.ts`: cálculos puros extraídos.
- `model/calendar.constants.ts` y `model/scheduling.types.ts`: constantes y tipos base.

### Todavía falta, y es lo que realmente importa ahora

- No hay `api/` implementada en `scheduling`.
- No hay `queries/` ni TanStack Query instalado/configurado, aunque `AGENTS.md` lo exige para server state.
- `shared/api/apiClient.ts` solo tiene `GET`; no sirve para crear, editar, cancelar, completar ni eliminar.
- La grilla usa `EMPTY_CALENDAR_ITEMS`; todavía no lee turnos reales.
- No hay mapper API ↔ dominio. La UI depende de tipos internos inventados para la migración, no del contrato real del backend.
- No hay schema Zod para creación/edición.
- El form no envía nada: el botón `Confirmar` está fuera del submit real y no dispara mutation.
- No hay carga real de pacientes, doctores ni tratamientos para selects.
- No hay filtro por doctor ni regla legacy aplicada antes de renderizar items.
- No hay schedule real del centro conectado; por eso los slots usan fallback.
- No hay detalle operativo de card.
- No hay flujo de edición, cancelación, pago ni completado.

## Próximo corte recomendado: conectar lectura real semanal

Este es el orden. No saltear al formulario porque “se ve más productivo”. Sin lectura real primero, después no sabés si creaste bien, si mapeaste bien o si rompiste timezone.

Estado: primer corte implementado parcialmente. Ya se configuró TanStack Query, `apiClient` soporta métodos mutables, existe API/mapper/query semanal de appointments y `CalendarBody` dejó de usar `EMPTY_CALENDAR_ITEMS`. Todavía falta selector real de doctores, schedule real del centro y validación runtime contra backend.

1. **Infraestructura mínima de requests**
   - Instalar/configurar TanStack Query y `QueryClientProvider` en `app/providers`.
   - Extender `apiClient` con métodos HTTP faltantes y soporte de headers/auth.
   - Definir cómo se obtiene el token Auth0 para adaptadores o hooks de query. No hardcodear token en servicios.

2. **Contrato de calendario semanal**
   - Crear `appointments.api.ts` con endpoints legacy equivalentes:
     - `GET /v1/appointment?from&to&centerId`
     - `POST /v1/appointment`
     - `PUT /v1/appointment`
     - `PATCH /v1/appointment/status`
     - `DELETE /v1/appointment`
   - Crear mapper para transformar `Appointment` backend → `CalendarItem`.
   - Calcular `from/to` por semana y timezone del centro. El legacy usa rango semanal convertido a UTC; mantener esa intención.

3. **Query semanal**
   - Crear `appointments.queryKeys.ts` con key estable por `centerId`, `weekStart`, `timezone`, `doctorIds` si aplica.
   - Crear `useWeeklyAppointmentsQuery`.
   - Aplicar reglas legacy de visibilidad en `application/`, no en JSX:
     - sin doctores seleccionados: grilla sin turnos;
     - `APPOINTMENT CANCELLED` fuera de la grilla principal;
     - `BLOCK` sin `doctorId` visible como bloqueo general;
     - `BLOCK` con `doctorId` visible si el doctor está seleccionado.

4. **Integración en `CalendarBody.section.tsx`**
   - Reemplazar `EMPTY_CALENDAR_ITEMS` por datos de query.
   - Pasar `loading`, `schedule`, `timezone`, `canEdit` y `onItemOpen` reales.
   - Mostrar error/empty state simple y accionable. Nada de errores técnicos crudos.

5. **Recién después: creación real**
   - Crear schema Zod de appointment/block.
   - Separar `Appointment.form.tsx` y `Block.form.tsx` cuando haya reglas distintas reales.
   - Conectar submit a mutation y hacer invalidación de la query semanal.
   - Verificar roundtrip: crear → invalidar → reaparece en grilla en el slot correcto.

## Decisiones de frontera para persistencia

- **Turnos y bloqueos** pertenecen a `scheduling`.
- **Doctores** pertenecen a `doctors`; `scheduling` solo consume una frontera pública para listar/select de profesionales y disponibilidad necesaria.
- **Pacientes** pertenecen a `patients`; `scheduling` no debe importar componentes ni services internos para crear el selector.
- **Tratamientos** pertenecen a `clinical-services`; costo/duración se puede consumir por frontera pública, no duplicar reglas en scheduling.
- **Pagos** pertenecen a `billing-payments`; registrar pago desde calendario debe abrir una integración pública o quedar fuera del primer corte.
- **Stock/cierre clínico** cruza `inventory` y `patients`; no meterlo en la card. Ese flujo necesita caso de uso propio.

## Faltantes técnicos concretos

```txt
domains/scheduling/
├── api/
│   ├── appointments.api.ts          # endpoints del backend
│   └── appointments.mapper.ts       # DTO backend <-> CalendarItem/form payload
├── queries/
│   ├── appointments.queryKeys.ts    # keys por centro/rango/filtros
│   ├── appointments.query.ts        # lectura semanal
│   └── appointments.mutation.ts     # create/update/status/delete
├── model/
│   └── appointment.schema.ts        # Zod para turno/bloqueo
├── application/
│   ├── useWeeklyCalendarData.hook.ts
│   ├── useCalendarDoctorFilter.hook.ts
│   └── useCalendarBookingDialog.hook.ts
└── ui/
    ├── dialogs/CalendarAppointment.dialog.tsx
    ├── forms/Appointment.form.tsx
    ├── forms/Block.form.tsx
    └── drawers|dialogs/CalendarItemDetail.*
```

Crear estos archivos solo cuando el paso correspondiente se implemente. Carpeta vacía + nombre lindo = teatro.

## Dependencias legacy del flujo

### Desde `WeekView.component.tsx`

Hooks React:

- `useState`
- `useMemo`
- `useCallback`
- `useEffect`
- `useRef`

Hooks app:

- `useAppSelector`
  - `state.appointments.selectedDoctorIds`
  - `state.doctors.doctors`

Utils usados directamente:

- `CALENDAR_SLOT_INTERVALS`
- `getPositionedAppointments`
- `getStartOfWeek`
- `addDays`
- `getDate`
- `formatDateCalendar`
- `toMinutes`
- `normalizeDoctorWorkHours`

Componentes usados directamente:

- `AppointmentCard`
- Portales con `createPortal` para menú de slot y menú de intervalo.

Tipos:

- `Appointment`
- `CenterSchedule`
- `DoctorWorkHours`
- `WeekDay`

Responsabilidades reales de `WeekView`:

- Calcula días de semana.
- Detecta días cerrados.
- Filtra por estado rápido.
- Agrupa turnos por fecha.
- Calcula disponibilidad del doctor seleccionado.
- Posiciona cards superpuestas.
- Abre menú de slot: nuevo turno / bloquear horario.
- Cambia intervalo visual de grilla.
- Maneja responsive mobile y scroll sincronizado.

### Creación/edición desde slot

Componentes:

- `CalendarAppointmentModal.component.tsx`
- `Appointment.component.tsx` (`AppointmentForm`)
- `Block.component.tsx` (`BlockForm`)
- `NewPatient.component.tsx`
- `ModalLayout`
- `CompletedAppointmentEditorModal` para editar turno ya completado.

Hooks:

- `useApi`
- `useResolvedAppointmentRelations`
- `useAppDispatch`
- `useAppSelector`
- `react-hook-form`: `useForm`, `useFormState`, `useWatch`
- `useImperativeHandle`, `forwardRef`

Services:

- `createAppointment`
- `updateAppointment`
- `getPatientsByCenter`
- `getDoctorsByCenter` vía selects y bootstrap.
- `getTreatmentsByCenter` vía selects y carga previa del modal.

Utils/schemas:

- `createCalendarAppointmentSchema`
- `createCalendarBlockSchema`
- `toISODateTime`
- `getDate`
- `isAppointment`
- `transformAppointment`
- `transformBlock`
- `timeSlots`
- `getOperatingHoursForDate`
- `getDurationMinutes`
- `getTreatmentCost`
- `getTreatmentDuration`
- `doesDurationExceedClosingTime`
- `normalizeDoctorWorkHours`

Estado:

- `appointmentsSlice.addAppointment`
- `appointmentsSlice.updateAppointment`
- `doctorsSlice.setDoctors`
- `treatmentsSlice.setTreatments`
- `appointmentsSlice.setDoctorFilter`

### Operación de card y completado

Componentes principales:

- `AppointmentCard.component.tsx`
- `AppointmentCompactCard.component.tsx`
- `AppointmentCardHoverPreview.component.tsx`
- `AppointmentCardDetailPanel.component.tsx`
- `BlockCardHoverPreview.component.tsx`
- `BlockCardDetailPanel.component.tsx`
- `AppointmentBlockCard.component.tsx`
- `ConfirmModal`
- `ConfirmDeleteModal`
- `ConvertProspectModal`
- `RegisterPaymentDrawer.component.tsx`
- `UpdateStatusModal.component.tsx`
- `TurnCompletionModalShell.component.tsx`
- `TurnCompletionSessionBody.component.tsx`
- `CompletedAppointmentEditorModal.component.tsx`

Hooks:

- `useApi`
- `useIsMobile`
- `usePermissions`
- `useResolvedAppointmentRelations`
- `useAppDispatch`
- `useAppSelector`
- `useTurnCompletionSession`
- `useTurnCompletionNavigation`
- `useTurnCompletionStock`
- `useTurnCompletionSubmit`
- `useEvolutiveNotesSubmit`

Services:

- `updateStatus`
- `deleteAppointment`
- `sendAppointmentReminder`
- `getConsultationById`
- `getTurnConsumptionsByAppointment`
- `confirmTurnConsumption`
- `getStockItems`
- `paymentCart.ts` services usados por `RegisterPaymentDrawer`
- `proxyFiles` para fotos existentes en cierre/edición.

Utils:

- `APPOINTMENT_STATUS`
- `APPOINTMENT_STATUS_FLOW`
- `getSelectableNextStatuses`
- `appointmentStatusActionButtonClass`
- `getStatusColor`
- `getTime`
- `getDurationMinutes`
- `formatCostInput`
- `isAppointment`
- `hasRequiredPatientIdentity`
- `base64ToFile`

Estado:

- `appointmentsSlice.updateAppointment`
- `appointmentsSlice.deleteAppointment`
- `appointmentsSlice.setPatientOpenChargesFlag` indirecto en pagos.
- `whatsapp.status` para recordatorios/resumen.
- `user.center.timezone` para cierre y visualización.

## Reglas de migración obligatorias

1. **Weekview only**: no `ViewMode` en UI nueva. Si una API necesita rango, usar rango semanal explícito.
2. **Timezone del centro siempre**: fechas visibles y payloads se calculan con timezone del centro, no con timezone del navegador.
3. **Slots desde schedule**: la semana usa el rango más amplio de días abiertos del centro.
4. **Permiso único de edición**: `CALENDAR_EDIT` controla crear, editar, cancelar, bloquear y completar desde calendario.
5. **Modal único de booking**: crear/editar turno o bloqueo pasa por el dialog equivalente a `CalendarAppointmentModal`.
6. **No deep imports entre dominios**: `scheduling` no debe importar internos de `patients`, `doctors`, `clinical-services`, `billing-payments` ni `inventory`.
7. **Card no orquesta todo**: la card puede abrir acciones, pero servicios complejos van a hooks/casos de uso.
8. **Utils puras testeables**: posicionamiento, slots, filtros, rangos y disponibilidad no deben vivir enterrados en JSX.
9. **Estado filtrado consistente**: mantener reglas legacy de filtro por doctor, cancelados y bloqueos generales.
10. **Completar no es solo cambiar status**: completar dispara consulta, notas evolutivas y potencial consumo de stock.

## Propuesta mínima de archivos destino

Estado recomendado actualizado: server state con TanStack Query; Redux solo si el filtro o preferencia debe sobrevivir fuera de esta pantalla.

```txt
domains/scheduling/
├── pages/Calendar.page.tsx
├── model/scheduling.types.ts
├── model/appointment.schema.ts
├── model/calendar.constants.ts
├── api/appointments.api.ts
├── api/appointments.mapper.ts
├── queries/appointments.queryKeys.ts
├── queries/appointments.query.ts
├── queries/appointments.mutation.ts
├── application/useCalendarWeek.hook.ts
├── application/useWeeklyCalendarData.hook.ts
├── application/useCalendarBookingDialog.hook.ts
├── application/useCompleteAppointment.hook.ts
├── ui/sections/CalendarHeader.section.tsx
├── ui/sections/CalendarBody.section.tsx
├── ui/components/CalendarWeekGrid.component.tsx
├── ui/components/CalendarItemCard.component.tsx
├── ui/dialogs/CalendarAppointment.dialog.tsx
├── ui/dialogs/UpdateAppointmentStatus.dialog.tsx
├── ui/forms/Appointment.form.tsx
├── ui/forms/Block.form.tsx
├── ui/drawers/CalendarItemDetail.drawer.tsx
└── utils/calendarWeek.utils.ts
```

Crear solo lo que se implemente. Carpetas vacías para “parecer prolijo” son teatro, no arquitectura.

## Riesgos y cuestiones abiertas

1. **CompletedAppointmentEditorModal**: decidir si el primer corte permite editar un turno ya completado o solo completar nuevos.
2. **Pagos**: `RegisterPaymentDrawer` depende de `billing-payments`; hay que definir frontera pública antes de migrarlo.
3. **Stock al completar**: `TurnCompletion` toca inventory/stock; puede inflar muchísimo el alcance.
4. **Pacientes mínimos/prospectos**: completar turno puede requerir `ConvertProspectModal`; esto cruza `patients`.
5. **Tratamientos y planes**: el form calcula duración, costo y planes vinculados; no meter esto en `shared` por ansiedad.
6. **WhatsApp**: recordatorios y resumen dependen de permisos/admin y `whatsapp.status`.
7. **AppointmentCard legacy**: hoy mezcla UI, pagos, status, recordatorios, cierre y eliminación. Hay que partirla antes de migrar.
8. **Estado global**: decidir qué queda en Redux y qué se resuelve con hooks del dominio.
9. **Mobile**: WeekView tiene lógica propia de scroll sincronizado y línea de hora actual; validar si entra en el primer corte.

## Definición de listo para esta migración

- Calendario muestra una semana, sin selector de vistas.
- Permite crear turno y bloqueo desde slot.
- Permite editar turno/bloqueo existente desde card.
- Respeta filtros por doctor y horarios del centro.
- Usa timezone del centro en lectura/escritura.
- Permite completar turno o deja explícitamente documentado que completar queda fuera del primer corte.
- No hay imports legacy tipo `@components`, `@services`, `@store`, `types` dentro de `dotbin-client-2`.
