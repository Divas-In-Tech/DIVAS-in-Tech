import { useState, useEffect } from "react";
import { Calendar } from "../components/ui/calendar";
import { Card } from "../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "../components/ui/tooltip";
import { Calendar as CalendarIcon, Crown, Link as LinkIcon, MapPin, Search, TriangleAlert, UserCheck, UserX, Users } from "lucide-react";

/* TODO: Most of this right below here is prop data used to test. Doesn't
  guarantee future data appearance-- must be changed to match
  actual database structure */

export type PendingUser = {
  firstName: string;
  lastName: string;
  accountType: string;
  eventAttended: string;
  createdAt: string;
};

export type SearchableUser = {
  firstName: string;
  lastName: string;
  email: string;
  accountType: string;
  status: string;
  joinedAt: string;
};

export type Mentor = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  photoName?: string;
};

type AdminDashboardProps = {
  pendingUsers?: PendingUser[];
  searchableUsers?: SearchableUser[];
  mentors?: Mentor[];
};

type ConfirmationAction = "accept" | "reject" | "promote" | "delete" | "addMentor" | "cancelEvent";

type ConfirmationState = {
  action: ConfirmationAction;
  targetLabel: string;
  onConfirm?: () => void;
} | null;

type AdminEvent = {
  id: string;
  name: string;
  description: string;
  date: Date;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  time: string;
  location: string;
  link: string;
  capacity: string;
  unlimited: boolean;
};

type NewEventState = {
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  link: string;
  capacity: string;
  unlimited: boolean;
  isMultiDay: boolean;
  repeatDays: number[];
  untilDate: string;
};

const REPEAT_DAY_OPTIONS = [
  { label: "M", value: 1 },
  { label: "T", value: 2 },
  { label: "W", value: 3 },
  { label: "Th", value: 4 },
  { label: "F", value: 5 },
  { label: "Sa", value: 6 },
  { label: "Su", value: 0 },
] as const;

const createEmptyEvent = (): NewEventState => ({
  name: "",
  description: "",
  startTime: "",
  endTime: "",
  location: "",
  link: "",
  capacity: "",
  unlimited: false,
  isMultiDay: false,
  repeatDays: [],
  untilDate: "",
});

const TIME_OPTIONS = Array.from({ length: 96 }, (_, index) => {
  const totalMinutes = index * 15;
  const hours24 = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const meridiem = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;

  return {
    value: `${hours24.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`,
    label: `${hours12}:${minutes.toString().padStart(2, "0")} ${meridiem}`,
    minutes: totalMinutes,
  };
});

const parseTimeInput = (value: string) => {
  const normalizedValue = value.trim().toUpperCase().replace(/\s+/g, "");
  const match = normalizedValue.match(/^(\d{1,2})(?::(\d{1,2}))?(AM|PM)$/);

  if (!match) {
    return null;
  }

  const hours = Number(match[1]);
  const minutes = match[2] ? Number(match[2]) : 0;
  const period = match[3];

  if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) {
    return null;
  }

  return {
    hours,
    minutes,
    period,
  };
};

const formatTimeLabel = (value: string) => {
  const parsedTime = parseTimeInput(value);

  if (!parsedTime) {
    return value.trim();
  }

  return `${parsedTime.hours}:${parsedTime.minutes
    .toString()
    .padStart(2, "0")} ${parsedTime.period}`;
};

const getTimeInMinutes = (value: string) => {
  const parsedTime = parseTimeInput(value);

  if (!parsedTime) {
    return -1;
  }

  const normalizedHour = parsedTime.hours % 12;
  const hours24 =
    parsedTime.period === "PM" ? normalizedHour + 12 : normalizedHour;

  return hours24 * 60 + parsedTime.minutes;
};

const getStartOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const isSameDay = (firstDate: Date, secondDate: Date) =>
  getStartOfDay(firstDate).getTime() === getStartOfDay(secondDate).getTime();

const parseDateInput = (value: string) => {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
};

const formatDateInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const buildRecurringEventDates = (
  startDate: Date,
  endDate: Date,
  repeatDays: number[]
) => {
  const dates: Date[] = [];
  const cursor = getStartOfDay(startDate);
  const finalDate = getStartOfDay(endDate);

  while (cursor.getTime() <= finalDate.getTime()) {
    if (isSameDay(cursor, startDate) || repeatDays.includes(cursor.getDay())) {
      dates.push(new Date(cursor));
    }

    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
};

const sampleMentors: Mentor[] = [
  {
    id: "mentor-1",
    firstName: "Alicia",
    lastName: "Nguyen",
    email: "alicia.nguyen@divasintech.org",
    bio: "Frontend engineer passionate about helping early-career developers build confidence, portfolios, and sustainable coding habits.",
    photoName: "alicia-nguyen-headshot.jpg",
  },
  {
    id: "mentor-2",
    firstName: "Monica",
    lastName: "Patel",
    email: "monica.patel@divasintech.org",
    bio: "Product leader focused on mentorship around internships, technical interviewing, and turning ideas into well-scoped projects.",
  },
];

const sampleAdminEvents: AdminEvent[] = [
  {
    id: "mock-single-day-2026-04-27",
    name: "Resume Review Lab",
    description: "A focused resume workshop with live feedback and recruiter tips.",
    date: new Date(2026, 3, 27),
    startDate: new Date(2026, 3, 27),
    endDate: new Date(2026, 3, 27),
    startTime: "6:00 PM",
    endTime: "7:30 PM",
    time: "6:00 PM - 7:30 PM",
    location: "DIVAS Community Center",
    link: "",
    capacity: "25",
    unlimited: false,
  },
  {
    id: "mock-multi-day-2026-04-28-0",
    name: "Spring Coding Sprint",
    description: "A multi-day collaborative coding event with daily progress check-ins.",
    date: new Date(2026, 3, 28),
    startDate: new Date(2026, 3, 28),
    endDate: new Date(2026, 4, 1),
    startTime: "5:30 PM",
    endTime: "7:00 PM",
    time: "5:30 PM - 7:00 PM",
    location: "Innovation Lab",
    link: "",
    capacity: "Unlimited",
    unlimited: true,
  },
  {
    id: "mock-multi-day-2026-04-28-1",
    name: "Spring Coding Sprint",
    description: "A multi-day collaborative coding event with daily progress check-ins.",
    date: new Date(2026, 3, 29),
    startDate: new Date(2026, 3, 28),
    endDate: new Date(2026, 4, 1),
    startTime: "5:30 PM",
    endTime: "7:00 PM",
    time: "5:30 PM - 7:00 PM",
    location: "Innovation Lab",
    link: "",
    capacity: "Unlimited",
    unlimited: true,
  },
  {
    id: "mock-multi-day-2026-04-28-2",
    name: "Spring Coding Sprint",
    description: "A multi-day collaborative coding event with daily progress check-ins.",
    date: new Date(2026, 3, 30),
    startDate: new Date(2026, 3, 28),
    endDate: new Date(2026, 4, 1),
    startTime: "5:30 PM",
    endTime: "7:00 PM",
    time: "5:30 PM - 7:00 PM",
    location: "Innovation Lab",
    link: "",
    capacity: "Unlimited",
    unlimited: true,
  },
  {
    id: "mock-multi-day-2026-04-28-3",
    name: "Spring Coding Sprint",
    description: "A multi-day collaborative coding event with daily progress check-ins.",
    date: new Date(2026, 4, 1),
    startDate: new Date(2026, 3, 28),
    endDate: new Date(2026, 4, 1),
    startTime: "5:30 PM",
    endTime: "7:00 PM",
    time: "5:30 PM - 7:00 PM",
    location: "Innovation Lab",
    link: "",
    capacity: "Unlimited",
    unlimited: true,
  },
];

export function AdminDashboard({
  pendingUsers = [{
    firstName: "Jane",
    lastName: "Doe",
    accountType: "Student",
    eventAttended: "Workshop 1",
    createdAt: "01/06/2024"
  },
  {
    firstName: "John",
    lastName: "Smith",
    accountType: "Student",
    eventAttended: "Workshop 2",
    createdAt: "04/16/2026"
  }],
  searchableUsers = [
    {
      firstName: "Janie",
      lastName: "Doe",
      email: "janie.doe@divasintech.org",
      accountType: "Student",
      status: "Active",
      joinedAt: "01/06/2024",
    },
    {
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@divasintech.org",
      accountType: "Student",
      status: "Pending",
      joinedAt: "04/16/2026",
    },
    {
      firstName: "John",
      lastName: "Smith",
      email: "john.smith2@divasintech.org",
      accountType: "Student",
      status: "Pending",
      joinedAt: "04/01/2026",
    },
  ],
  mentors: initialMentors = sampleMentors,
}: AdminDashboardProps) {
  const warningThresholdMs = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;
  useEffect(() => {
    setCurrentPage(1);
  }, [pendingUsers]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<typeof searchableUsers>([]);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [mentors, setMentors] = useState<Mentor[]>(initialMentors);
  const [mentorSearchQuery, setMentorSearchQuery] = useState("");
  const [selectedMentors, setSelectedMentors] = useState<Mentor[]>([]);
  const [mentorSearchAttempted, setMentorSearchAttempted] = useState(false);
  const [newMentor, setNewMentor] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    photoName: "",
  });

  const [confirmationState, setConfirmationState] = useState<ConfirmationState>(null);
  const [confirmationCode, setConfirmationCode] = useState("");

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [adminEvents, setAdminEvents] = useState<AdminEvent[]>(sampleAdminEvents);
  const [newEvent, setNewEvent] = useState<NewEventState>(createEmptyEvent);

  const totalPages = Math.ceil(pendingUsers.length / pageSize);
  //TODO: Needs to sort by date eventually
  const paginatedUsers = pendingUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSearch = () => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    setSearchAttempted(true);

    if (!normalizedQuery) {
      setSelectedUsers([]);
      return;
    }

    const matchedUsers = searchableUsers.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return fullName.includes(normalizedQuery) || user.email.toLowerCase().includes(normalizedQuery);
    });

    setSelectedUsers(matchedUsers);
  };

  const handleMentorSearch = () => {
    const normalizedQuery = mentorSearchQuery.trim().toLowerCase();

    setMentorSearchAttempted(true);

    if (!normalizedQuery) {
      setSelectedMentors([]);
      return;
    }

    const matchedMentors = mentors.filter((mentor) => {
      const fullName = `${mentor.firstName} ${mentor.lastName}`.toLowerCase();
      return (
        fullName.includes(normalizedQuery) ||
        mentor.email.toLowerCase().includes(normalizedQuery)
      );
    });

    setSelectedMentors(matchedMentors);
  };

  const getEventsForDate = (date: Date | undefined) => {
    if (!date) return [];

    return adminEvents.filter(
      (event) => isSameDay(event.date, date)
    );
  };

  const hasEventsOnDate = (date: Date) => {
    return adminEvents.some(
      (event) => isSameDay(event.date, date)
    );
  };

  const eventsForSelectedDate = getEventsForDate(selectedDate);
  const minimumUntilDate =
    selectedDate
      ? formatDateInputValue(
          new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate() + 1
          )
        )
      : undefined;

  const closeConfirmationDialog = () => {
    setConfirmationState(null);
    setConfirmationCode("");
  };

  const openConfirmationDialog = (
    action: ConfirmationAction,
    targetLabel: string,
    onConfirm?: () => void
  ) => {
    setConfirmationState({ action, targetLabel, onConfirm });
    setConfirmationCode("");
  };

  const requiresConfirmationCode =
    confirmationState?.action === "promote" || confirmationState?.action === "delete";

  const actionLabels: Record<ConfirmationAction, { title: string; confirm: string; description: string; codeLabel?: string }> = {
    accept: {
      title: "Activate this account?",
      confirm: "Confirm",
      description: "This will approve the pending account:",
    },
    reject: {
      title: "Reject this account?",
      confirm: "Confirm",
      description: "This will reject the pending account:",
    },
    promote: {
      title: "Promote this user to admin?",
      confirm: "Confirm",
      description: "This will grant this account elevated admin access:",
      codeLabel: "Confirmation code",
    },
    delete: {
      title: "Delete this account?",
      confirm: "Confirm",
      description: "This will remove this account:",
      codeLabel: "Confirmation code",
    },
    addMentor: {
      title: "Add this mentor?",
      confirm: "Confirm",
      description: "This will add this mentor record:",
    },
    cancelEvent: {
      title: "Cancel this event?",
      confirm: "Cancel Event",
      description: "This will remove this scheduled event:",
    },
  };

  const handleConfirmAction = () => {
    if (requiresConfirmationCode && !confirmationCode.trim()) {
      return;
    }

    confirmationState?.onConfirm?.();
    closeConfirmationDialog();
  };

  const mentorBioWordCount = newMentor.bio
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const mentorBioTooLong = mentorBioWordCount > 200;
  const canAddMentor =
    newMentor.firstName.trim() &&
    newMentor.lastName.trim() &&
    newMentor.email.trim() &&
    newMentor.bio.trim() &&
    !mentorBioTooLong;

  const eventHasRequiredFields =
    Boolean(selectedDate) &&
    Boolean(newEvent.name.trim()) &&
    Boolean(newEvent.description.trim()) &&
    getTimeInMinutes(newEvent.startTime) >= 0 &&
    getTimeInMinutes(newEvent.endTime) >= 0 &&
    Boolean(newEvent.location.trim() || newEvent.link.trim()) &&
    Boolean(newEvent.unlimited || newEvent.capacity.trim());

  const multiDayUntilDate = parseDateInput(newEvent.untilDate);
  const multiDayHasRepeatDays =
    !newEvent.isMultiDay || newEvent.repeatDays.length > 0;
  const multiDayUntilIsValid =
    !newEvent.isMultiDay ||
    (selectedDate !== undefined &&
      multiDayUntilDate !== null &&
      getStartOfDay(multiDayUntilDate).getTime() >
        getStartOfDay(selectedDate).getTime());

  const eventTimesAreInOrder =
    !newEvent.startTime ||
    !newEvent.endTime ||
    getTimeInMinutes(newEvent.endTime) >= getTimeInMinutes(newEvent.startTime);

  const canCreateEvent =
    eventHasRequiredFields &&
    eventTimesAreInOrder &&
    multiDayHasRepeatDays &&
    multiDayUntilIsValid;

  const handleStartTimeChange = (value: string) => {
    setNewEvent((currentEvent) => {
      const nextStartTime = value;
      const nextStartTimeMinutes = getTimeInMinutes(nextStartTime);
      const currentEndTimeMinutes = getTimeInMinutes(currentEvent.endTime);
      const shouldResetEndTime =
        nextStartTimeMinutes >= 0 &&
        currentEndTimeMinutes >= 0 &&
        currentEndTimeMinutes < nextStartTimeMinutes;

      return {
        ...currentEvent,
        startTime: nextStartTime,
        endTime: shouldResetEndTime ? "" : currentEvent.endTime,
      };
    });
  };

  const handleToggleMultiDay = (checked: boolean) => {
    setNewEvent((currentEvent) => ({
      ...currentEvent,
      isMultiDay: checked,
      repeatDays: checked ? currentEvent.repeatDays : [],
      untilDate: checked ? currentEvent.untilDate : "",
    }));
  };

  const handleRepeatDayChange = (dayValue: number, checked: boolean) => {
    setNewEvent((currentEvent) => ({
      ...currentEvent,
      repeatDays: checked
        ? [...currentEvent.repeatDays, dayValue].sort((firstDay, secondDay) => firstDay - secondDay)
        : currentEvent.repeatDays.filter((currentDay) => currentDay !== dayValue),
    }));
  };

  const handleAddMentor = () => {
    if (!canAddMentor) {
      return;
    }
    {/*The ID is just a temporary placeholder. Not sure how the photo thing works.*/}
    const mentorToAdd: Mentor = {
      id: `mentor-${Date.now()}`, 
      firstName: newMentor.firstName.trim(),
      lastName: newMentor.lastName.trim(),
      email: newMentor.email.trim(),
      bio: newMentor.bio.trim(),
      photoName: newMentor.photoName.trim() || undefined,
    };

    setMentors((currentMentors) => [mentorToAdd, ...currentMentors]);

    const normalizedQuery = mentorSearchQuery.trim().toLowerCase();
    if (normalizedQuery) {
      const fullName = `${mentorToAdd.firstName} ${mentorToAdd.lastName}`.toLowerCase();
      const matchesSearch =
        fullName.includes(normalizedQuery) ||
        mentorToAdd.email.toLowerCase().includes(normalizedQuery);

      if (matchesSearch) {
        setSelectedMentors((currentMentors) => [mentorToAdd, ...currentMentors]);
      }
    }

    setNewMentor({
      firstName: "",
      lastName: "",
      email: "",
      bio: "",
      photoName: "",
    });
  };

  const handleOpenAddMentorConfirmation = () => {
    if (!canAddMentor) {
      return;
    }

    openConfirmationDialog(
      "addMentor",
      `${newMentor.firstName.trim()} ${newMentor.lastName.trim()}`,
      handleAddMentor
    );
  };

  const handleRemoveMentor = (mentorId: string) => {
    setMentors((currentMentors) =>
      currentMentors.filter((mentor) => mentor.id !== mentorId)
    );
    setSelectedMentors((currentMentors) =>
      currentMentors.filter((mentor) => mentor.id !== mentorId)
    );
  };

  const handleCancelEvent = (eventId: string) => {
    setAdminEvents((currentEvents) =>
      currentEvents.filter((event) => event.id !== eventId)
    );
  };

  const handleCreateEvent = () => {
    if (!canCreateEvent || !selectedDate) {
      return;
    }

    const formattedStartTime = formatTimeLabel(newEvent.startTime);
    const formattedEndTime = formatTimeLabel(newEvent.endTime);
    const startDate = getStartOfDay(selectedDate);
    const endDate =
      newEvent.isMultiDay && multiDayUntilDate
        ? getStartOfDay(multiDayUntilDate)
        : startDate;
    const eventDates = newEvent.isMultiDay
      ? buildRecurringEventDates(startDate, endDate, newEvent.repeatDays)
      : [startDate];
    const seriesId = Date.now().toString();

    setAdminEvents((currentEvents) => [
      ...currentEvents,
      ...eventDates.map((eventDate, index) => ({
        id: `${seriesId}-${index}`,
        name: newEvent.name.trim(),
        description: newEvent.description.trim(),
        date: new Date(eventDate),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        time: `${formattedStartTime} - ${formattedEndTime}`,
        location: newEvent.location.trim(),
        link: newEvent.link.trim(),
        capacity: newEvent.unlimited ? "Unlimited" : newEvent.capacity.trim(),
        unlimited: newEvent.unlimited,
      })),
    ]);

    setNewEvent(createEmptyEvent());
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[100px] overflow-hidden">
        <div className="absolute inset-0 bg-pink-700 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl">
            <h1 className="text-5xl mb-4">Admin Dashboard</h1>
          </div>
        </div>
      </section>


      {/* Pending Users Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl text-gray-900 mb-6">Pending Users</h2>
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">First Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Last Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Account Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Event Attended</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Pending Since</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pendingUsers.length > 0 ? (
                  paginatedUsers.map((user) => {
                    const isOlderThan14Days = Date.now() - new Date(user.createdAt).getTime() >= warningThresholdMs;

                    return (
                    <tr
                      key={`${user.firstName}-${user.lastName}-${user.createdAt}`}
                      className={isOlderThan14Days ? "bg-red-200 hover:bg-red-300" : "hover:bg-gray-50"}
                    >
                      <td className="px-6 py-4 text-sm text-gray-700">{user.firstName}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{user.lastName}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{user.accountType}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{user.eventAttended}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <span>{user.createdAt}</span>
                          {isOlderThan14Days ? <TriangleAlert className="h-4 w-4 text-red-600" aria-label="Account pending for more than 14 days" /> : null}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="flex items-center gap-3 whitespace-nowrap">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                aria-label={`Activate ${user.firstName} ${user.lastName}`}
                                onClick={() =>
                                  openConfirmationDialog(
                                    "accept",
                                    `${user.firstName} ${user.lastName}`
                                  )
                                }
                                className="inline-flex items-center gap-2 rounded-md bg-green-50 px-3 py-1 text-sm font-semibold text-green-700 transition hover:bg-green-100"
                              >
                                <UserCheck className="h-4 w-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Activate {user.firstName} {user.lastName}
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                aria-label={`Reject ${user.firstName} ${user.lastName}`}
                                onClick={() =>
                                  openConfirmationDialog(
                                    "reject",
                                    `${user.firstName} ${user.lastName}`
                                  )
                                }
                                className="inline-flex items-center gap-2 rounded-md bg-red-50 px-3 py-1 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                              >
                                <UserX className="h-4 w-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Reject {user.firstName} {user.lastName}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-500" colSpan={6}>
                      No pending users to display.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="flex items-center justify-between px-6 py-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
              >
                Previous
              </button>

              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Account Search Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl text-gray-900 mb-6">Account Search</h2>
          <Card className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <label className="sr-only" htmlFor="account-search">
                Search for a user by name
              </label>
              <input
                id="account-search"
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSearch();
                  }
                }}
                placeholder="Search by name"
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 focus:border-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-200"
              />
              <button
                type="button"
                onClick={handleSearch}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-pink-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-800"
              >
                <Search className="h-4 w-4" />
                Search
              </button>
            </div>

            {selectedUsers.length > 0 ? (
              <div className="mt-6 space-y-4">
                {selectedUsers.map((user) => (
                  <div
                    key={`${user.email}-${user.joinedAt}`}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-5"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-2 text-sm text-gray-700">
                        <p className="text-lg font-semibold text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p>{user.email}</p>
                        <p>Account Type: {user.accountType}</p>
                        <p>Status: {user.status}</p>
                        <p>Joined: {user.joinedAt}</p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          aria-label={`Promote ${user.firstName} ${user.lastName} to admin`}
                          onClick={() =>
                            openConfirmationDialog(
                              "promote",
                              `${user.firstName} ${user.lastName}`
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-md border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-100"
                        >
                          <Crown className="h-4 w-4" />
                          Promote to Admin
                        </button>
                        <button
                          type="button"
                          aria-label={`Deactivate ${user.firstName} ${user.lastName} account`}
                          onClick={() =>
                            openConfirmationDialog(
                              "delete",
                              `${user.firstName} ${user.lastName}`
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                        >
                          <UserX className="h-4 w-4" />
                          Deactivate Account
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchAttempted ? (
              <p className="mt-4 text-sm text-gray-500">
                No account matched that name.
              </p>
            ) : null}
          </Card>
        </div>
      </section>

      <Dialog
        open={Boolean(confirmationState)}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            closeConfirmationDialog();
          }
        }}
      >
        <DialogContent className="border-pink-100 sm:max-w-md">
          {confirmationState ? (
            <>
              <DialogHeader className="pr-8">
                <DialogTitle className="text-gray-900">
                  {actionLabels[confirmationState.action].title}
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  {actionLabels[confirmationState.action].description} <span className="font-medium text-gray-800">{confirmationState.targetLabel}</span>
                </DialogDescription>
              </DialogHeader>

              {requiresConfirmationCode ? (
                <div className="space-y-2">
                  <Label htmlFor="confirmation-code">
                    {actionLabels[confirmationState.action].codeLabel}
                  </Label>
                  <Input
                    id="confirmation-code"
                    value={confirmationCode}
                    onChange={(event) => setConfirmationCode(event.target.value)}
                    placeholder="Enter confirmation code"
                  />
                </div>
              ) : null}

              <DialogFooter className="mt-2">
                <button
                  type="button"
                  onClick={closeConfirmationDialog}
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAction}
                  disabled={requiresConfirmationCode && !confirmationCode.trim()}
                  className="inline-flex items-center justify-center rounded-md bg-pink-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-800 disabled:cursor-not-allowed disabled:bg-pink-300"
                >
                  {actionLabels[confirmationState.action].confirm}
                </button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Caldenar Management Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl text-gray-900 mb-6">Calendar Management</h2>
          <p className="mb-8 text-gray-600">
            Select a date, add event details, and review what's already scheduled.
          </p>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <Card className="p-6">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md"
                  modifiers={{
                    hasEvent: (day) => hasEventsOnDate(day),
                  }}
                  modifiersStyles={{
                    hasEvent: {
                      fontWeight: "bold",
                      textDecoration: "underline",
                      color: "#7c3aed",
                    },
                  }}
                />
              </Card>
            </div>

            <div className="space-y-8 lg:col-span-2">
              <Card className="p-6">
                <div className="mb-6 flex items-start gap-3">
                  <CalendarIcon className="mt-1 h-5 w-5 text-pink-700" />
                  <div>
                    <h3 className="text-2xl text-gray-900">
                      {selectedDate
                        ? `Add event for ${selectedDate.toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}`
                        : "Select a date"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Fill out the form below to create a new calendar entry.
                    </p>
                  </div>
                </div>

                {selectedDate ? (
                  <div className="space-y-4">
                    <div className = "space-y-2">
                      <Label htmlFor="admin-event-name">Event name</Label>
                      <Input
                        id="admin-event-name"
                        value={newEvent.name}
                        onChange={(event) =>
                          setNewEvent({ ...newEvent, name: event.target.value })
                        }
                        placeholder="Enter event name"
                      />
                    </div>

                    <div className = "space-y-2">
                      <Label htmlFor="admin-event-description">Description</Label>
                      <Textarea
                        id="admin-event-description"
                        value={newEvent.description}
                        onChange={(event) =>
                          setNewEvent({
                            ...newEvent,
                            description: event.target.value,
                          })
                        }
                        placeholder="Add event details"
                        rows={4}
                      />
                    </div>

                    <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <label className="flex items-center gap-3 text-sm font-medium text-gray-900">
                        <input
                          id="admin-event-multi-day"
                          type="checkbox"
                          checked={newEvent.isMultiDay}
                          onChange={(event) => handleToggleMultiDay(event.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-pink-700 focus:ring-pink-500"
                        />
                        Multi-day event
                      </label>

                      {newEvent.isMultiDay ? (
                        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
                          <div className="space-y-2">
                            <Label>Repeat every:</Label>
                            <div className="flex flex-wrap gap-2">
                              {REPEAT_DAY_OPTIONS.map((dayOption) => (
                                <label
                                  key={dayOption.label}
                                  className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-2 py-2 text-sm text-gray-700"
                                >
                                  <input
                                    type="checkbox"
                                    checked={newEvent.repeatDays.includes(dayOption.value)}
                                    onChange={(event) =>
                                      handleRepeatDayChange(
                                        dayOption.value,
                                        event.target.checked
                                      )
                                    }
                                    className="h-4 w-4 rounded border-gray-300 text-pink-700 focus:ring-pink-500"
                                  />
                                  <span>{dayOption.label}</span>
                                </label>
                              ))}
                            </div>
                            <p className="text-xs text-gray-500">
                              The selected calendar date is always included as the start date.
                            </p>
                            {!multiDayHasRepeatDays ? (
                              <p className="text-sm text-red-600">
                                Select at least one weekday to repeat this event.
                              </p>
                            ) : null}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="admin-event-until-date">Until:</Label>
                            <Input
                              id="admin-event-until-date"
                              type="date"
                              value={newEvent.untilDate}
                              min={minimumUntilDate}
                              onChange={(event) =>
                                setNewEvent({
                                  ...newEvent,
                                  untilDate: event.target.value,
                                })
                              }
                            />
                            {!multiDayUntilIsValid ? (
                              <p className="text-sm text-red-600">
                                Select a future date after the start date.
                              </p>
                            ) : null}
                          </div>
                        </div>
                      ) : null}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="admin-event-start-time">Start time</Label>
                        <Input
                          id="admin-event-start-time"
                          value={newEvent.startTime}
                          onChange={(event) => handleStartTimeChange(event.target.value)}
                          onBlur={(event) => handleStartTimeChange(formatTimeLabel(event.target.value))}
                          list="admin-event-time-options"
                          placeholder="e.g. 6:00 PM"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="admin-event-end-time">End time</Label>
                        <Input
                          id="admin-event-end-time"
                          value={newEvent.endTime}
                          onChange={(event) =>
                            setNewEvent({ ...newEvent, endTime: event.target.value })
                          }
                          onBlur={(event) =>
                            setNewEvent({
                              ...newEvent,
                              endTime: formatTimeLabel(event.target.value),
                            })
                          }
                          list="admin-event-time-options"
                          placeholder="e.g. 7:30 PM"
                          disabled={!newEvent.startTime.trim()}
                        />
                        {!eventTimesAreInOrder ? (
                          <p className="text-sm text-red-600">
                            End time cannot be earlier than the start time.
                          </p>
                        ) : null}
                      </div>

                      <datalist id="admin-event-time-options">
                        {TIME_OPTIONS.map((option) => (
                          <option key={option.value} value={option.label} />
                        ))}
                      </datalist>

                      <div className="space-y-2 md:col-span-2">
                        <div className="flex flex-col gap-3 md:flex-row md:items-end ">
                          <div className="w-half md:max-w-xs space-y-2">
                            <Label htmlFor="admin-event-capacity">Capacity</Label>
                            <Input
                              id="admin-event-capacity"
                              type="number"
                              min="1"
                              value={newEvent.capacity}
                              onChange={(event) =>
                                setNewEvent({
                                  ...newEvent,
                                  capacity: event.target.value,
                                })
                              }
                              disabled={newEvent.unlimited}
                              placeholder={newEvent.unlimited ? "Unlimited" : "Enter capacity"}
                            />
                          </div>

                          <label className="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700 md:mb-0.5">
                            <input
                              type="checkbox"
                              checked={newEvent.unlimited}
                              onChange={(event) =>
                                setNewEvent({
                                  ...newEvent,
                                  unlimited: event.target.checked,
                                  capacity: event.target.checked ? "" : newEvent.capacity,
                                })
                              }
                              className="h-4 w-4 rounded border-gray-300 text-pink-700 focus:ring-pink-500"
                            />
                            Unlimited
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className = "space-y-2">
                        <Label htmlFor="admin-event-location">Location</Label>
                        <Input
                          id="admin-event-location"
                          value={newEvent.location}
                          onChange={(event) =>
                            setNewEvent({
                              ...newEvent,
                              location: event.target.value,
                            })
                          }
                          placeholder="In-person location"
                        />
                      </div>

                      <div className = "space-y-2">
                        <Label htmlFor="admin-event-link">Link</Label>
                        <Input
                          id="admin-event-link"
                          value={newEvent.link}
                          onChange={(event) =>
                            setNewEvent({ ...newEvent, link: event.target.value })
                          }
                          placeholder="Virtual meeting or RSVP link"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCreateEvent}
                      disabled={!canCreateEvent}
                      className="inline-flex w-full items-center justify-center rounded-md bg-pink-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-800 disabled:cursor-not-allowed disabled:bg-pink-300"
                    >
                      Add Event
                    </button>
                  </div>
                ) : (
                  <div className="py-12 text-center text-gray-500">
                    <CalendarIcon className="mx-auto mb-3 h-12 w-12 opacity-50" />
                    <p>Select a date on the calendar to add an event.</p>
                  </div>
                )}
              </Card>

              <Card className="p-6">
                <h3 className="mb-4 text-2xl text-gray-900">
                  {selectedDate
                    ? `Scheduled for ${selectedDate.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}`
                    : "Scheduled events"}
                </h3>

                {eventsForSelectedDate.length > 0 ? (
                  <div className="space-y-4">
                    {eventsForSelectedDate.map((event) => (
                      <div
                        key={event.id}
                        className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                      >
                        <div className="mb-2 flex items-start justify-between gap-4">
                          <div className="space-y-2">
                            <h4 className="text-lg font-semibold text-gray-900">
                              {event.name}
                            </h4>
                            <button
                              type="button"
                              onClick={() =>
                                openConfirmationDialog(
                                  "cancelEvent",
                                  event.name,
                                  () => handleCancelEvent(event.id)
                                )
                              }
                              className="inline-flex items-center justify-center rounded-md border border-red-300 bg-white px-3 py-1.5 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                            >
                              Cancel Event
                            </button>
                          </div>
                          <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-700">
                            {event.capacity}
                          </span>
                        </div>
                        <p className="mb-4 text-sm text-gray-600">
                          {event.description}
                        </p>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            <span>{event.time}</span>
                          </div>
                          {event.location ? (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{event.location}</span>
                            </div>
                          ) : null}
                          {event.link ? (
                            <div className="flex items-center gap-2">
                              <LinkIcon className="h-4 w-4" />
                              <span className="truncate">{event.link}</span>
                            </div>
                          ) : null}
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>
                              Capacity: {event.unlimited ? "Unlimited" : event.capacity}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-gray-500">
                    <Users className="mx-auto mb-3 h-12 w-12 opacity-50" />
                    <p>No events scheduled for this date yet.</p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Mentorship Management Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl text-gray-900 mb-6">Mentorship Management</h2>
          <p className="mb-8 text-gray-600">
            Manage mentor records here.
          </p>

          <div className="grid gap-8 lg:grid-cols-2">
            <Card className="p-6">
              <h3 className="text-2xl text-gray-900 mb-4">Find and Remove Mentors</h3>
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <label className="sr-only" htmlFor="mentor-search">
                  Search for a mentor by name
                </label>
                <input
                  id="mentor-search"
                  type="text"
                  value={mentorSearchQuery}
                  onChange={(event) => setMentorSearchQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleMentorSearch();
                    }
                  }}
                  placeholder="Search by mentor name"
                  className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 focus:border-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-200"
                />
                <button
                  type="button"
                  onClick={handleMentorSearch}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-pink-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-800"
                >
                  <Search className="h-4 w-4" />
                  Search
                </button>
              </div>

              {selectedMentors.length > 0 ? (
                <div className="mt-6 space-y-4">
                  {selectedMentors.map((mentor) => (
                    <div
                      key={mentor.id}
                      className="rounded-lg border border-gray-200 bg-gray-50 p-5"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="space-y-2 text-sm text-gray-700">
                          <p className="text-lg font-semibold text-gray-900">
                            {mentor.firstName} {mentor.lastName}
                          </p>
                          <p>{mentor.email}</p>
                        </div>
                        <button
                          type="button"
                          aria-label={`Remove mentor ${mentor.firstName} ${mentor.lastName}`}
                          onClick={() =>
                            openConfirmationDialog(
                              "delete",
                              `${mentor.firstName} ${mentor.lastName}`,
                              () => handleRemoveMentor(mentor.id)
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                        >
                          <UserX className="h-4 w-4" />
                          Remove Mentor
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : mentorSearchAttempted ? (
                <p className="mt-4 text-sm text-gray-500">
                  No mentor matched that search.
                </p>
              ) : (
                <p className="mt-4 text-sm text-gray-500">
                  Search by mentor name to review or remove an existing mentor.
                </p>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="text-2xl text-gray-900 mb-4">Add a Mentor</h3>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className = "space-y-2">
                    <Label htmlFor="mentor-first-name">First Name</Label>
                    <Input
                      id="mentor-first-name"
                      value={newMentor.firstName}
                      onChange={(event) =>
                        setNewMentor({ ...newMentor, firstName: event.target.value })
                      }
                      placeholder="Enter first name"
                    />
                  </div>

                  <div className = "space-y-2">
                    <Label htmlFor="mentor-last-name">Last Name</Label>
                    <Input
                      id="mentor-last-name"
                      value={newMentor.lastName}
                      onChange={(event) =>
                        setNewMentor({ ...newMentor, lastName: event.target.value })
                      }
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className = "space-y-2">
                  <Label htmlFor="mentor-email">Email</Label>
                  <Input
                    id="mentor-email"
                    type="email"
                    value={newMentor.email}
                    onChange={(event) =>
                      setNewMentor({ ...newMentor, email: event.target.value })
                    }
                    placeholder="Enter email address"
                  />
                </div>

                <div className = "space-y-2">
                  <Label htmlFor="mentor-bio">Bio</Label>
                  <Textarea
                    id="mentor-bio"
                    value={newMentor.bio}
                    onChange={(event) =>
                      setNewMentor({ ...newMentor, bio: event.target.value })
                    }
                    placeholder="Write a short mentor bio"
                    rows={6}
                  />
                  <p
                    className={`mt-2 text-sm ${
                      mentorBioTooLong ? "text-red-600" : "text-gray-500"
                    }`}
                  >
                    {mentorBioWordCount}/200 words
                  </p>
                </div>

                <div className = "space-y-2">
                  <Label htmlFor="mentor-photo">Upload Photo (Optional)</Label>
                  <Input
                    id="mentor-photo"
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      setNewMentor({
                        ...newMentor,
                        photoName: event.target.files?.[0]?.name ?? "",
                      })
                    }
                    className="cursor-pointer"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    {newMentor.photoName
                      ? `Selected file: ${newMentor.photoName}`
                      : "No photo selected."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenAddMentorConfirmation}
                  disabled={!canAddMentor}
                  className="inline-flex w-full items-center justify-center rounded-md bg-pink-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-800 disabled:cursor-not-allowed disabled:bg-pink-300"
                >
                  Add Mentor
                </button>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
