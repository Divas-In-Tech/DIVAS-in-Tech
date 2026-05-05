import { useState, useEffect } from "react";
import { supabase } from "../supabaseConnection";
import { Calendar } from "../components/ui/calendar";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { Calendar as CalendarIcon, MapPin, Clock, Users, Link as LinkIcon } from "lucide-react";

interface Event {
  id: number;
  title: string;
  date: Date;
  startDate: Date;
  endDate: Date;
  time: string;
  location: string;
  link: string;
  description: string;
  capacity: number | null;
  unlimited: boolean;
}

interface CalendarPageProps {
  isLoggedIn: boolean;
  onLoginPrompt: () => void;
  userFirstName?: string;
  userLastName?: string;
}

const fmtTimetz = (t: string | null): string => {
  if (!t) return "";
  const [hh, mm] = t.split(":");
  const h = Number(hh);
  return `${h % 12 || 12}:${mm} ${h >= 12 ? "PM" : "AM"}`;
};

const getStartOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const isSameDay = (a: Date, b: Date) =>
  getStartOfDay(a).getTime() === getStartOfDay(b).getTime();

export function CalendarPage({ isLoggedIn, onLoginPrompt, userFirstName = "", userLastName = "" }: CalendarPageProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [registeredEvents, setRegisteredEvents] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("calendar")
        .select("*")
        .order("start_date", { ascending: true });

      if (error) { console.error("Load events error:", error); setLoading(false); return; }

      const mapped: Event[] = [];
      for (const r of data ?? []) {
        const start = new Date(r.start_date);
        const end = new Date(r.end_date);
        const startTime = fmtTimetz(r.time_start);
        const endTime = fmtTimetz(r.time_end);
        const time = startTime && endTime ? `${startTime} - ${endTime}` : startTime;

        const cursor = getStartOfDay(start);
        const finalDate = getStartOfDay(end);
        while (cursor.getTime() <= finalDate.getTime()) {
          mapped.push({
            id: r.id,
            title: r.name,
            date: new Date(cursor),
            startDate: start,
            endDate: end,
            time,
            location: r.location ?? "",
            link: r.link ?? "",
            description: r.description ?? "",
            capacity: r.num_of_attendees,
            unlimited: r.num_of_attendees === null,
          });
          cursor.setDate(cursor.getDate() + 1);
        }
      }
      setEvents(mapped);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!isLoggedIn || !userFirstName || !userLastName) return;
    (async () => {
      const { data, error } = await supabase
        .from("event_signups")
        .select("event_id")
        .eq("attendee_first_name", userFirstName)
        .eq("attendee_last_name", userLastName);

      if (error) { console.error("Load signups error:", error); return; }
      setRegisteredEvents(new Set((data ?? []).map((r: any) => r.event_id)));
    })();
  }, [isLoggedIn, userFirstName, userLastName]);

  const getEventsForDate = (d: Date | undefined) => {
    if (!d) return [];
    return events.filter(e => isSameDay(e.date, d));
  };

  const hasEventsOnDate = (d: Date) => events.some(e => isSameDay(e.date, d));

  const eventsForSelectedDate = getEventsForDate(date);

  const upcomingEvents = Array.from(
    new Map(events.map(e => [e.id, e])).values()
  ).sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  const handleRegisterForEvent = async (event: Event) => {
    if (!isLoggedIn) { onLoginPrompt(); return; }

    if (registeredEvents.has(event.id)) {
      const { error } = await supabase
        .from("event_signups")
        .delete()
        .eq("event_id", event.id)
        .eq("attendee_first_name", userFirstName)
        .eq("attendee_last_name", userLastName);

      if (error) { console.error("Unregister error:", error); return; }

      setRegisteredEvents(prev => {
        const next = new Set(prev);
        next.delete(event.id);
        return next;
      });
    } else {
      const { error } = await supabase
        .from("event_signups")
        .insert({
          event_id: event.id,
          attendee_first_name: userFirstName,
          attendee_last_name: userLastName,
        });

      if (error) { console.error("Register error:", error); return; }

      setRegisteredEvents(prev => new Set(prev).add(event.id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl text-gray-900 mb-2">Event Calendar</h1>
          <p className="text-gray-600">Stay updated with our upcoming events and activities</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="p-6">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md"
                modifiers={{ hasEvent: (day) => hasEventsOnDate(day) }}
                modifiersStyles={{
                  hasEvent: { fontWeight: "bold", textDecoration: "underline", color: "#7c3aed" },
                }}
              />
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-2xl mb-4">
                {date
                  ? `Events on ${date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
                  : "Select a date"}
              </h2>

              {loading ? (
                <div className="text-center py-12 text-gray-500">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Loading events...</p>
                </div>
              ) : eventsForSelectedDate.length > 0 ? (
                <div className="space-y-4">
                  {eventsForSelectedDate.map((event, i) => (
                    <Card
                      key={`${event.id}-${i}`}
                      className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl">{event.title}</h3>
                        {registeredEvents.has(event.id) && (
                          <Badge className="bg-green-100 text-green-700 border-green-200">Registered</Badge>
                        )}
                      </div>
                      <div className="space-y-2 text-gray-600">
                        {event.time && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{event.time}</span>
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        {event.link && (
                          <div className="flex items-center gap-2">
                            <LinkIcon className="w-4 h-4" />
                            <a href={event.link} target="_blank" rel="noreferrer" className="text-pink-700 underline truncate" onClick={e => e.stopPropagation()}>{event.link}</a>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{event.unlimited ? "Unlimited spots" : `${event.capacity} spots`}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No events scheduled for this date</p>
                </div>
              )}
            </Card>

            <Card className="p-6 mt-8">
              <h2 className="text-2xl mb-4">All Upcoming Events</h2>
              {loading ? (
                <p className="text-sm text-gray-500">Loading...</p>
              ) : upcomingEvents.length > 0 ? (
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div>
                        <p>{event.title}</p>
                        <p className="text-sm text-gray-600">
                          {event.startDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          {!isSameDay(event.startDate, event.endDate) &&
                            ` – ${event.endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
                        </p>
                      </div>
                      {registeredEvents.has(event.id) && (
                        <Badge className="bg-green-100 text-green-700 border-green-200">Registered</Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No upcoming events.</p>
              )}
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={selectedEvent !== null} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
            <DialogDescription>View event details and register to attend</DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <CalendarIcon className="w-5 h-5" />
                  <span>
                    {selectedEvent.startDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                    {!isSameDay(selectedEvent.startDate, selectedEvent.endDate) &&
                      ` – ${selectedEvent.endDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`}
                  </span>
                </div>
                {selectedEvent.time && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-5 h-5" />
                    <span>{selectedEvent.time}</span>
                  </div>
                )}
                {selectedEvent.location && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-5 h-5" />
                    <span>{selectedEvent.location}</span>
                  </div>
                )}
                {selectedEvent.link && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <LinkIcon className="w-5 h-5" />
                    <a href={selectedEvent.link} target="_blank" rel="noreferrer" className="text-pink-700 underline">{selectedEvent.link}</a>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-700">
                  <Users className="w-5 h-5" />
                  <span>{selectedEvent.unlimited ? "Unlimited spots" : `${selectedEvent.capacity} spots available`}</span>
                </div>
              </div>

              {selectedEvent.description && (
                <div>
                  <h4 className="mb-2 font-medium">Description</h4>
                  <p className="text-gray-600">{selectedEvent.description}</p>
                </div>
              )}

              <Button
                className="w-full"
                onClick={() => handleRegisterForEvent(selectedEvent)}
                variant={registeredEvents.has(selectedEvent.id) ? "outline" : "default"}
              >
                {registeredEvents.has(selectedEvent.id) ? "Unregister" : "Sign Up for Event"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
