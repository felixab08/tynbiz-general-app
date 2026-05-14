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
  morningStart:   string ;
  morningEnd:     string ;
  afternoonStart: string ;
  afternoonEnd:   string ;
  isDayOff:       boolean;
  reason:         string;
}

export interface DaySchedule {
  id:             number;
  dayOfWeek:      string;
  morningStart:   string ;
  morningEnd:     string ;
  afternoonStart: string ;
  afternoonEnd:   string ;
  isWorkDay:      boolean;
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
