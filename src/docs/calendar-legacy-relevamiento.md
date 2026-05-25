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

1. **Modelo y API de scheduling**
   - Tipos `Appointment`, `CalendarAppointment`, `CalendarBlock`, `AppointmentStatus`.
   - API `appointments.api.ts`: listar semana, crear, actualizar, cancelar/cambiar estado, eliminar bloqueo.

2. **Estado base del calendario**
   - Appointments, loading, error, filtros por doctor.
   - Regla legacy: si no hay doctores seleccionados, no mostrar turnos.
   - Regla legacy: no mostrar `APPOINTMENT` cancelados.
   - Regla legacy: `BLOCK` sin `doctorId` se muestra como bloqueo general.

3. **Week view sin acoplamiento**
   - Extraer cálculos de semana, slots, columnas, filtros y posicionamiento.
   - `CalendarWeekGrid` debe recibir datos y callbacks; no leer Redux directo.

4. **Modal de creación/edición**
   - Migrar equivalente de `CalendarAppointmentModal`.
   - Forms separados: `Appointment.form.tsx` y `Block.form.tsx`.
   - Mantener precarga desde slot: fecha + hora + intención.

5. **Cards y detalle operativo**
   - Migrar card mínima para turno y bloqueo.
   - Migrar detalle con acciones: editar, cancelar, registrar pago, completar.

6. **Completar turno**
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

```txt
domains/scheduling/
├── pages/Calendar.page.tsx
├── model/appointment.types.ts
├── model/appointment.schema.ts
├── model/calendar.constants.ts
├── api/appointments.api.ts
├── state/appointments.slice.ts
├── state/appointments.selectors.ts
├── application/useCalendarWeek.hook.ts
├── application/useCalendarBookingDialog.hook.ts
├── application/useCompleteAppointment.hook.ts
├── ui/sections/CalendarHeader.section.tsx
├── ui/sections/CalendarWeek.section.tsx
├── ui/components/CalendarWeekGrid.component.tsx
├── ui/components/AppointmentCard.component.tsx
├── ui/dialogs/CalendarAppointment.dialog.tsx
├── ui/dialogs/UpdateAppointmentStatus.dialog.tsx
├── ui/forms/Appointment.form.tsx
├── ui/forms/Block.form.tsx
└── utils/calendar.utils.ts
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
