export interface ICalendar {
  calendarId:                     number;
  calendarName:                   string;
  slotDurationMinutes:            number;
  status:                         string;
  bookingWindowDays:              number;
  bookingWindowType:              string;
  daySchedules:                   DaySchedule[];
  dateOverrides:                  DateOverride[];
  allowedSlotDurations:           number[];
  maxAppointmentsPerDay:          number;
  userMaxAppointmentsPerDay:      number;
  effectiveMaxAppointmentsPerDay: number;
  maxAppointmentsPerMonth:        number;
  maxParticipantsPerSession:      number;
  videoCourtesyMinutes:           number;
  planType:                       string;
  usedAppointmentsToday:          number;
  usedAppointmentsThisMonth:      number;
  remainingAppointmentsThisMonth: number;
}

export interface DateOverride {
  id:             number;
  overrideDate:   Date;
  morningStart:   TimeOfDay ;
  morningEnd:     TimeOfDay ;
  afternoonStart: TimeOfDay ;
  afternoonEnd:   TimeOfDay ;
  isDayOff:       boolean;
  reason:         string;
}

export interface DaySchedule {
  id:             number;
  dayOfWeek:      string;
  morningStart:   TimeOfDay ;
  morningEnd:     TimeOfDay ;
  afternoonStart: TimeOfDay ;
  afternoonEnd:   TimeOfDay ;
  isWorkDay:      boolean;
}

export interface TimeOfDay  {
  hour:   number;
  minute: number;
  second: number;
  nano:   number;
}

export interface ICalendarConfig {
  description:           string;
  slotDurationMinutes:   number;
  status:                string;
  bookingWindowDays:     number;
  bookingWindowType:     string;
  maxAppointmentsPerDay: number;
  daySchedules:          DaySchedule[];
  dateOverrides:         DateOverride[];
}
