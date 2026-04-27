import { useState } from "react";
import { Calendar } from "../components/ui/calendar";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Calendar as CalendarIcon, MapPin, Clock, Users } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: Date;
  time: string;
  location: string;
  description: string;
  type: "volunteer" | "fundraiser" | "workshop" | "community";
}

interface CalendarPageProps {
  isLoggedIn: boolean;
  onLoginPrompt: () => void;
}

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Intro to Python",
    date: new Date(2026, 5, 2),
    time: "10:00 AM - 6:00 PM",
    location: "1025 N. Broadway, Milwaukee, WI",
    description: "This program teaches basic programming concepts in the Python coding language. Participants will engage in hands-on coding activities and projects. No coding experience required.",
    type: "workshop"
  },
];

export function CalendarPage({ isLoggedIn, onLoginPrompt }: CalendarPageProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(new Set());
  const [newEvent, setNewEvent] = useState({
    title: "",
    time: "",
    location: "",
    description: "",
    type: "volunteer" as Event["type"]
  });

  const getEventsForDate = (selectedDate: Date | undefined) => {
    if (!selectedDate) return [];
    return events.filter(event => 
      event.date.toDateString() === selectedDate.toDateString()
    );
  };

  const hasEventsOnDate = (checkDate: Date) => {
    return events.some(event => 
      event.date.toDateString() === checkDate.toDateString()
    );
  };

  const eventsForSelectedDate = getEventsForDate(date);

  const typeColors: Record<Event["type"], string> = {
    volunteer: "bg-blue-100 text-blue-700 border-blue-200",
    fundraiser: "bg-purple-100 text-purple-700 border-purple-200",
    workshop: "bg-gray-100 text-gray-700 border-gray-200",
    community: "bg-green-100 text-green-700 border-green-200"
  };

  const handleRegisterForEvent = (eventId: string) => {
    if (!isLoggedIn) {
      onLoginPrompt();
      return;
    }

    if (registeredEvents.has(eventId)) {
      // Unregister
      const newSet = new Set(registeredEvents);
      newSet.delete(eventId);
      setRegisteredEvents(newSet);
      
    } else {
      // Register
      const newSet = new Set(registeredEvents);
      newSet.add(eventId);
      setRegisteredEvents(newSet);
      
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl text-gray-900 mb-2">Event Calendar</h1>
          <p className="text-gray-600">
            Stay updated with our upcoming events and activities
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md"
                modifiers={{
                  hasEvent: (day) => hasEventsOnDate(day)
                }}
                modifiersStyles={{
                  hasEvent: {
                    fontWeight: 'bold',
                    textDecoration: 'underline',
                    color: '#7c3aed'
                  }
                }}
              />
            </Card>
          </div>

          {/* Events List */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-2xl mb-4">
                {date ? `Events on ${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}` : 'Select a date'}
              </h2>
              
              {eventsForSelectedDate.length > 0 ? (
                <div className="space-y-4">
                  {eventsForSelectedDate.map((event) => (
                    <Card 
                      key={event.id} 
                      className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl">{event.title}</h3>
                        <Badge className={typeColors[event.type]}>
                          {event.type}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
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

            {/* Upcoming Events */}
            <Card className="p-6 mt-8">
              <h2 className="text-2xl mb-4">All Upcoming Events</h2>
              <div className="space-y-3">
                {events
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .map((event) => (
                    <div 
                      key={event.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div>
                        <p>{event.title}</p>
                        <p className="text-sm text-gray-600">
                          {event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <Badge className={typeColors[event.type]}>
                        {event.type}
                      </Badge>
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Event Details Dialog */}
      <Dialog open={selectedEvent !== null} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
            <DialogDescription>
              View event details and register to attend
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Badge className={typeColors[selectedEvent.type]}>
                  {selectedEvent.type}
                </Badge>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <CalendarIcon className="w-5 h-5" />
                  <span>{selectedEvent.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="w-5 h-5" />
                  <span>{selectedEvent.time}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="w-5 h-5" />
                  <span>{selectedEvent.location}</span>
                </div>
              </div>
              <div>
                <h4 className="mb-2">Description</h4>
                <p className="text-gray-600">{selectedEvent.description}</p>
              </div>
              <Button 
                className="w-full" 
                onClick={() => handleRegisterForEvent(selectedEvent.id)}
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
