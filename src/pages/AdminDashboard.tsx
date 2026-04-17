import { useState } from "react";
import { Calendar } from "../components/ui/calendar";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
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

type AdminDashboardProps = {
  pendingUsers?: PendingUser[];
  searchableUsers?: SearchableUser[];
};

type AdminEvent = {
  id: string;
  name: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  link: string;
  capacity: string;
  unlimited: boolean;
};

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
}: AdminDashboardProps) {
  const warningThresholdMs = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<typeof searchableUsers>([]);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [adminEvents, setAdminEvents] = useState<AdminEvent[]>([]);
  const [newEvent, setNewEvent] = useState({
    name: "",
    description: "",
    time: "",
    location: "",
    link: "",
    capacity: "",
    unlimited: false,
  });

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

  const getEventsForDate = (date: Date | undefined) => {
    if (!date) return [];

    return adminEvents.filter(
      (event) => event.date.toDateString() === date.toDateString()
    );
  };

  const hasEventsOnDate = (date: Date) => {
    return adminEvents.some(
      (event) => event.date.toDateString() === date.toDateString()
    );
  };

  const eventsForSelectedDate = getEventsForDate(selectedDate);

  const handleCreateEvent = () => {
    if (
      !selectedDate ||
      !newEvent.name.trim() ||
      !newEvent.description.trim() ||
      !newEvent.time.trim() ||
      (!newEvent.location.trim() && !newEvent.link.trim()) ||
      (!newEvent.unlimited && !newEvent.capacity.trim())
    ) {
      return;
    }

    setAdminEvents((currentEvents) => [
      ...currentEvents,
      {
        id: Date.now().toString(),
        name: newEvent.name.trim(),
        description: newEvent.description.trim(),
        date: new Date(selectedDate),
        time: newEvent.time.trim(),
        location: newEvent.location.trim(),
        link: newEvent.link.trim(),
        capacity: newEvent.unlimited ? "Unlimited" : newEvent.capacity.trim(),
        unlimited: newEvent.unlimited,
      },
    ]);

    setNewEvent({
      name: "",
      description: "",
      time: "",
      location: "",
      link: "",
      capacity: "",
      unlimited: false,
    });
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
                  pendingUsers.map((user) => {
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
                          <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-md bg-green-50 px-3 py-1 text-sm font-semibold text-green-700 transition hover:bg-green-100"
                          >
                            <UserCheck className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-md bg-red-50 px-3 py-1 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                          >
                            <UserX className="h-4 w-4" />
                          </button>
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
                          className="inline-flex items-center gap-2 rounded-md border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-100"
                        >
                          <Crown className="h-4 w-4" />
                          Promote to Admin
                        </button>
                        <button
                          type="button"
                          aria-label={`Deactivate ${user.firstName} ${user.lastName} account`}
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
                    <div>
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

                    <div>
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

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="admin-event-time">Time</Label>
                        <Input
                          id="admin-event-time"
                          value={newEvent.time}
                          onChange={(event) =>
                            setNewEvent({ ...newEvent, time: event.target.value })
                          }
                          placeholder="e.g. 6:00 PM - 8:00 PM"
                        />
                      </div>

                      <div>
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
                    </div>

                    <label className="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
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
                      Unlimited capacity
                    </label>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
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

                      <div>
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
                      className="inline-flex w-full items-center justify-center rounded-md bg-pink-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-800"
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
                          <h4 className="text-lg font-semibold text-gray-900">
                            {event.name}
                          </h4>
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
    </div>
  );
}
