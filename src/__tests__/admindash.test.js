import React from "react";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { AdminDashboard } from "../pages/AdminDashboard";

const {
  configureSupabaseMock,
  supabase,
  supabaseSpies,
} = vi.hoisted(() => {
  const queryResponse = (data = [], error = null) => Promise.resolve({ data, error });
  const mutationResponse = (error = null) => Promise.resolve({ error });

  const state = {
    pendingUsers: [],
    calendarEvents: [],
    userSearchResults: [],
    mentorSearchResults: [],
    mentorInsertResult: null,
    calendarInsertResult: null,
  };

  const supabaseSpies = {
    userUpdate: vi.fn(),
    userUpdateEq: vi.fn(),
    userDeleteEq: vi.fn(),
    mentorDeleteEq: vi.fn(),
    calendarDeleteEq: vi.fn(),
    mentorInsert: vi.fn(),
    calendarInsert: vi.fn(),
    storageUpload: vi.fn(),
    storageGetPublicUrl: vi.fn(),
  };

  const getSearchResults = (results, field) =>
    Array.isArray(results) ? results : results?.[field] ?? [];

  const buildMentorInsertResult = (payload) => ({
    mentor_id: "mentor-new",
    first_name: payload.first_name,
    last_name: payload.last_name,
    email: payload.email,
    bio: payload.bio,
    photo: payload.photo ?? "",
  });

  const buildCalendarInsertResult = (payload) => ({
    id: 1,
    ...payload,
  });

  const configureSupabaseMock = ({
    pendingUsers = [],
    calendarEvents = [],
    userSearchResults = [],
    mentorSearchResults = [],
    mentorInsertResult = null,
    calendarInsertResult = null,
  } = {}) => {
    state.pendingUsers = pendingUsers;
    state.calendarEvents = calendarEvents;
    state.userSearchResults = userSearchResults;
    state.mentorSearchResults = mentorSearchResults;
    state.mentorInsertResult = mentorInsertResult;
    state.calendarInsertResult = calendarInsertResult;

    Object.values(supabaseSpies).forEach((spy) => spy.mockClear());
  };

  const supabase = {
    from(table) {
      return {
        select() {
          return {
            eq(field, value) {
              return {
                order() {
                  if (table === "users" && field === "approved" && value === false) {
                    return queryResponse(state.pendingUsers);
                  }

                  return queryResponse([]);
                },
              };
            },
            order() {
              if (table === "calendar") {
                return queryResponse(state.calendarEvents);
              }

              return queryResponse([]);
            },
            ilike(field) {
              if (table === "users") {
                return queryResponse(getSearchResults(state.userSearchResults, field));
              }

              if (table === "mentors") {
                return queryResponse(getSearchResults(state.mentorSearchResults, field));
              }

              return queryResponse([]);
            },
          };
        },
        update(payload) {
          if (table === "users") {
            supabaseSpies.userUpdate(payload);
          }

          return {
            eq(field, value) {
              if (table === "users") {
                supabaseSpies.userUpdateEq(field, value);
              }

              return mutationResponse();
            },
          };
        },
        delete() {
          return {
            eq(field, value) {
              if (table === "users") {
                supabaseSpies.userDeleteEq(field, value);
              }

              if (table === "mentors") {
                supabaseSpies.mentorDeleteEq(field, value);
              }

              if (table === "calendar") {
                supabaseSpies.calendarDeleteEq(field, value);
              }

              return mutationResponse();
            },
          };
        },
        insert(payload) {
          if (table === "mentors") {
            supabaseSpies.mentorInsert(payload);
          }

          if (table === "calendar") {
            supabaseSpies.calendarInsert(payload);
          }

          return {
            select() {
              return {
                single() {
                  if (table === "mentors") {
                    return queryResponse(
                      state.mentorInsertResult ?? buildMentorInsertResult(payload)
                    );
                  }

                  if (table === "calendar") {
                    return queryResponse(
                      state.calendarInsertResult ?? buildCalendarInsertResult(payload)
                    );
                  }

                  return queryResponse(null);
                },
              };
            },
          };
        },
      };
    },
    storage: {
      from() {
        return {
          upload(path, file) {
            supabaseSpies.storageUpload(path, file);
            return mutationResponse();
          },
          getPublicUrl(path) {
            supabaseSpies.storageGetPublicUrl(path);
            return {
              data: { publicUrl: `https://example.com/${path}` },
            };
          },
        };
      },
    },
  };

  return {
    configureSupabaseMock,
    supabase,
    supabaseSpies,
  };
});

vi.mock("../supabaseConnection", () => ({
  supabase,
}));

const pendingUserRow = ({
  email = "pending-user@divasintech.org",
  firstName = "Jane",
  lastName = "Doe",
  accountType = "Student",
  eventAttended = "Workshop 1",
  createdAt = "01/06/2024",
} = {}) => ({
  email,
  first_name: firstName,
  last_name: lastName,
  role: accountType,
  event_attended: eventAttended,
  pending_since: createdAt,
  approved: false,
});

const searchableUserRow = ({
  email = "user@divasintech.org",
  firstName = "Janie",
  lastName = "Doe",
  accountType = "Student",
  status = "Active",
  joinedAt = "01/06/2024",
} = {}) => ({
  email,
  first_name: firstName,
  last_name: lastName,
  role: accountType,
  event_attended: "",
  pending_since: joinedAt,
  approved: status === "Active",
});

const mentorRow = ({
  id = "mentor-1",
  firstName = "Alicia",
  lastName = "Nguyen",
  email = "alicia.nguyen@divasintech.org",
  bio = "Frontend engineer passionate about helping early-career developers build confidence.",
  photo = "alicia-nguyen-headshot.jpg",
} = {}) => ({
  mentor_id: id,
  first_name: firstName,
  last_name: lastName,
  email,
  bio,
  photo,
});

const calendarRow = ({
  id = 1,
  name = "Resume Review Lab",
  description = "Bring your latest resume for live feedback.",
  startDate = "2026-04-27T12:00:00",
  endDate = "2026-04-27T12:00:00",
  timeStart = "18:00:00",
  timeEnd = "19:00:00",
  capacity = 12,
  location = "Career Center",
  link = "",
  multiDay = false,
  monday = false,
  tuesday = false,
  wednesday = false,
  thursday = false,
  friday = false,
  saturday = false,
  sunday = false,
} = {}) => ({
  id,
  name,
  description,
  start_date: startDate,
  end_date: endDate,
  time_start: timeStart,
  time_end: timeEnd,
  num_of_attendees: capacity,
  location,
  link,
  multi_day: multiDay,
  monday,
  tuesday,
  wednesday,
  thursday,
  friday,
  saturday,
  sunday,
});

const renderAdminDashboard = (mockConfig = {}) => {
  configureSupabaseMock(mockConfig);
  return render(React.createElement(AdminDashboard));
};

const getAccountSearchControls = () => {
  const accountSearchSection = screen
    .getByRole("heading", { name: /account search/i })
    .closest("section");

  return within(accountSearchSection);
};

const getCalendarManagementControls = () => {
  const calendarManagementSection = screen
    .getByRole("heading", { name: /calendar management/i })
    .closest("section");

  return within(calendarManagementSection);
};

describe("AdminDashboard", () => {
  beforeEach(() => {
    configureSupabaseMock();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  test("renders pending user data passed into the table", async () => {
    renderAdminDashboard({
      pendingUsers: [
        pendingUserRow({
          email: "avery.johnson@divasintech.org",
          firstName: "Avery",
          lastName: "Johnson",
          accountType: "Volunteer",
          eventAttended: "DIVAS Tech Summit",
          createdAt: "02/04/2026",
        }),
        pendingUserRow({
          email: "maya.patel@divasintech.org",
          firstName: "Maya",
          lastName: "Patel",
          accountType: "Mentor",
          eventAttended: "Spring Coding Workshop",
          createdAt: "04/05/2026",
        }),
      ],
    });

    expect(screen.getByRole("columnheader", { name: /first name/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /last name/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /account type/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /event attended/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /pending since/i })).toBeInTheDocument();

    expect(await screen.findByText("Avery")).toBeInTheDocument();
    expect(screen.getByText("Johnson")).toBeInTheDocument();
    expect(screen.getByText("Volunteer")).toBeInTheDocument();
    expect(screen.getByText("DIVAS Tech Summit")).toBeInTheDocument();
    expect(screen.getByText("02/04/2026")).toBeInTheDocument();

    expect(screen.getByText("Maya")).toBeInTheDocument();
    expect(screen.getByText("Patel")).toBeInTheDocument();
    expect(screen.getByText("Mentor")).toBeInTheDocument();
    expect(screen.getByText("Spring Coding Workshop")).toBeInTheDocument();
    expect(screen.getByText("04/05/2026")).toBeInTheDocument();
  });

  test("marks users pending for 14 days or more with a warning icon and red row styling", async () => {
    vi.spyOn(Date, "now").mockReturnValue(new Date("04/16/2026").getTime());

    renderAdminDashboard({
      pendingUsers: [
        pendingUserRow({
          email: "jordan.lee@divasintech.org",
          firstName: "Jordan",
          lastName: "Lee",
          accountType: "Volunteer",
          eventAttended: "Hack Night",
          createdAt: "04/02/2026",
        }),
      ],
    });

    expect(await screen.findByText("04/02/2026")).toBeInTheDocument();
    expect(screen.getAllByLabelText(/account pending for more than 14 days/i)).toHaveLength(1);
    expect(screen.getByText("04/02/2026").closest("tr")).toHaveClass("bg-red-200");
  });

  test("successfully searches for a user", async () => {
    renderAdminDashboard({
      userSearchResults: [
        searchableUserRow({
          email: "taylor.brooks@divasintech.org",
          firstName: "Taylor",
          lastName: "Brooks",
          accountType: "Mentor",
          status: "Active",
          joinedAt: "03/10/2026",
        }),
      ],
    });

    const accountSearchControls = getAccountSearchControls();

    fireEvent.change(accountSearchControls.getByLabelText(/search for a user by name/i), {
      target: { value: "taylor" },
    });

    await act(async () => {
      fireEvent.click(accountSearchControls.getByRole("button", { name: /search/i }));
    });

    expect(await screen.findByText("taylor.brooks@divasintech.org")).toBeInTheDocument();
    expect(screen.getByText(/account type: mentor/i)).toBeInTheDocument();
    expect(screen.getByText(/status: active/i)).toBeInTheDocument();
  });

  test("successfully searches for a user with a duplicate name but different email", async () => {
    renderAdminDashboard({
      userSearchResults: [
        searchableUserRow({
          email: "a.smith@email.com",
          firstName: "Alex",
          lastName: "Smith",
          accountType: "Volunteer",
          status: "Active",
          joinedAt: "01/15/2026",
        }),
        searchableUserRow({
          email: "alex.smith@email.com",
          firstName: "Alex",
          lastName: "Smith",
          accountType: "Mentor",
          status: "Pending",
          joinedAt: "02/20/2026",
        }),
      ],
    });

    const accountSearchControls = getAccountSearchControls();

    fireEvent.change(accountSearchControls.getByLabelText(/search for a user by name/i), {
      target: { value: "alex" },
    });

    await act(async () => {
      fireEvent.click(accountSearchControls.getByRole("button", { name: /search/i }));
    });

    expect(await screen.findByText("a.smith@email.com")).toBeInTheDocument();
    expect(screen.getByText(/account type: volunteer/i)).toBeInTheDocument();
    expect(screen.getByText(/status: active/i)).toBeInTheDocument();
    expect(screen.getByText("alex.smith@email.com")).toBeInTheDocument();
    expect(screen.getByText(/account type: mentor/i)).toBeInTheDocument();
    expect(screen.getByText(/status: pending/i)).toBeInTheDocument();
  });

  test("unsuccessfully searches for a user", async () => {
    renderAdminDashboard({
      userSearchResults: [],
    });

    const accountSearchControls = getAccountSearchControls();

    fireEvent.change(accountSearchControls.getByLabelText(/search for a user by name/i), {
      target: { value: "a user who does not exist" },
    });

    await act(async () => {
      fireEvent.click(accountSearchControls.getByRole("button", { name: /search/i }));
    });

    expect(await screen.findByText(/no account matched that name\./i)).toBeInTheDocument();
    expect(screen.queryByText("morgan.price@divasintech.org")).not.toBeInTheDocument();
  });

  test("opens an accept confirmation dialog and closes it with cancel", async () => {
    renderAdminDashboard({
      pendingUsers: [
        pendingUserRow({
          email: "jane.doe@divasintech.org",
          firstName: "Jane",
          lastName: "Doe",
        }),
      ],
    });

    fireEvent.click(await screen.findByRole("button", { name: /activate jane doe/i }));

    expect(screen.getByRole("heading", { name: /activate this account\?/i })).toBeInTheDocument();

    const confirmButton = screen.getByRole("button", { name: /^confirm$/i });
    expect(confirmButton).toHaveClass("bg-pink-700");

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(
      screen.queryByRole("heading", { name: /activate this account\?/i })
    ).not.toBeInTheDocument();
  });

  test("opens a reject confirmation dialog and closes it with the top corner x", async () => {
    renderAdminDashboard({
      pendingUsers: [
        pendingUserRow({
          email: "jane.doe@divasintech.org",
          firstName: "Jane",
          lastName: "Doe",
        }),
      ],
    });

    fireEvent.click(await screen.findByRole("button", { name: /reject jane doe/i }));

    expect(screen.getByRole("heading", { name: /reject this account\?/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /close/i }));

    expect(
      screen.queryByRole("heading", { name: /reject this account\?/i })
    ).not.toBeInTheDocument();
  });

  test("opens a promote confirmation without a code field", async () => {
    renderAdminDashboard({
      userSearchResults: [
        searchableUserRow({
          email: "janie.doe@divasintech.org",
          firstName: "Janie",
          lastName: "Doe",
          accountType: "Student",
          status: "Active",
        }),
      ],
    });

    const accountSearchControls = getAccountSearchControls();

    fireEvent.change(accountSearchControls.getByLabelText(/search for a user by name/i), {
      target: { value: "janie" },
    });

    await act(async () => {
      fireEvent.click(accountSearchControls.getByRole("button", { name: /search/i }));
    });

    await screen.findByText("janie.doe@divasintech.org");
    fireEvent.click(screen.getByRole("button", { name: /promote janie doe to admin/i }));

    expect(
      screen.getByRole("heading", { name: /promote this user to admin\?/i })
    ).toBeInTheDocument();
    expect(screen.queryByLabelText(/confirmation code/i)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^confirm$/i })).not.toBeDisabled();
  });

  test("shows a demote action for admin accounts and updates supabase after confirmation", async () => {
    renderAdminDashboard({
      userSearchResults: [
        searchableUserRow({
          email: "amina.admin@divasintech.org",
          firstName: "Amina",
          lastName: "Admin",
          accountType: "admin",
          status: "Active",
          joinedAt: "02/14/2026",
        }),
      ],
    });

    const accountSearchControls = getAccountSearchControls();

    fireEvent.change(accountSearchControls.getByLabelText(/search for a user by name/i), {
      target: { value: "amina" },
    });

    await act(async () => {
      fireEvent.click(accountSearchControls.getByRole("button", { name: /search/i }));
    });

    expect(await screen.findByText("amina.admin@divasintech.org")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /promote amina admin to admin/i })
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /demote amina admin from admin/i }));

    expect(screen.getByRole("heading", { name: /demote this admin\?/i })).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /^confirm$/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/account type: user/i)).toBeInTheDocument();
    });

    expect(supabaseSpies.userUpdate).toHaveBeenCalledWith({ role: "user" });
    expect(supabaseSpies.userUpdateEq).toHaveBeenCalledWith(
      "email",
      "amina.admin@divasintech.org"
    );
    expect(
      screen.getByRole("button", { name: /deactivate amina admin account/i })
    ).toBeInTheDocument();
  });

  test("opens a delete confirmation without a code field", async () => {
    renderAdminDashboard({
      userSearchResults: [
        searchableUserRow({
          email: "janie.doe@divasintech.org",
          firstName: "Janie",
          lastName: "Doe",
          accountType: "Student",
          status: "Active",
        }),
      ],
    });

    const accountSearchControls = getAccountSearchControls();

    fireEvent.change(accountSearchControls.getByLabelText(/search for a user by name/i), {
      target: { value: "janie" },
    });

    await act(async () => {
      fireEvent.click(accountSearchControls.getByRole("button", { name: /search/i }));
    });

    await screen.findByText("janie.doe@divasintech.org");
    fireEvent.click(screen.getByRole("button", { name: /deactivate janie doe account/i }));

    expect(screen.getByRole("heading", { name: /delete this account\?/i })).toBeInTheDocument();
    expect(screen.queryByLabelText(/confirmation code/i)).not.toBeInTheDocument();
  });

  test("shows multi-day controls and requires a future until date", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-05T12:00:00"));

    renderAdminDashboard();

    const calendarControls = getCalendarManagementControls();

    expect(screen.queryByLabelText(/until:/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByLabelText(/multi-day event/i));

    expect(screen.getByText(/repeat every:/i)).toBeInTheDocument();
    expect(
      screen.getByText(/selected calendar date is always included as the start date/i)
    ).toBeInTheDocument();

    const untilDateInput = screen.getByLabelText(/until:/i);
    expect(untilDateInput).toHaveAttribute("min", "2026-05-06");

    fireEvent.click(screen.getByLabelText(/^Th$/i));
    fireEvent.change(untilDateInput, {
      target: { value: "2026-05-05" },
    });

    expect(screen.getByText(/select a future date after the start date/i)).toBeInTheDocument();
    expect(calendarControls.getByRole("button", { name: /add event/i })).toBeDisabled();
  });

  test("creates a multi-day event on the start date and matching repeat days through the inclusive end date", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-05T12:00:00"));

    renderAdminDashboard({
      calendarInsertResult: calendarRow({
        id: 77,
        name: "Community Standup",
        description: "Weekly planning touchpoint for volunteers.",
        startDate: "2026-05-05",
        endDate: "2026-05-07",
        timeStart: "18:00:00",
        timeEnd: "19:00:00",
        capacity: 20,
        location: "Innovation Lab",
      }),
    });
    vi.useRealTimers();

    const calendarControls = getCalendarManagementControls();

    fireEvent.change(screen.getByLabelText(/event name/i), {
      target: { value: "Community Standup" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "Weekly planning touchpoint for volunteers." },
    });
    fireEvent.change(screen.getByLabelText(/start time/i), {
      target: { value: "6:00 PM" },
    });
    fireEvent.blur(screen.getByLabelText(/start time/i), {
      target: { value: "6:00 PM" },
    });
    fireEvent.change(screen.getByLabelText(/end time/i), {
      target: { value: "7:00 PM" },
    });
    fireEvent.blur(screen.getByLabelText(/end time/i), {
      target: { value: "7:00 PM" },
    });
    fireEvent.change(screen.getByLabelText(/capacity/i), {
      target: { value: "20" },
    });
    fireEvent.change(screen.getByLabelText(/location/i), {
      target: { value: "Innovation Lab" },
    });

    fireEvent.click(screen.getByLabelText(/multi-day event/i));
    fireEvent.click(screen.getByLabelText(/^Th$/i));
    fireEvent.change(screen.getByLabelText(/until:/i), {
      target: { value: "2026-05-07" },
    });

    await act(async () => {
      fireEvent.click(calendarControls.getByRole("button", { name: /add event/i }));
    });

    expect(await calendarControls.findByText("Community Standup")).toBeInTheDocument();
    expect(
      calendarControls.getByText(/weekly planning touchpoint for volunteers/i)
    ).toBeInTheDocument();

    const selectedWeekRow = calendarControls.getByRole("row", {
      name: /3 4 5 6 7 8 9/i,
    });

    fireEvent.click(within(selectedWeekRow).getByRole("gridcell", { name: "6" }));
    expect(calendarControls.getByText(/no events scheduled for this date yet/i)).toBeInTheDocument();

    fireEvent.click(within(selectedWeekRow).getByRole("gridcell", { name: "7" }));
    expect(calendarControls.getByText("Community Standup")).toBeInTheDocument();
  });

  test("cancels a scheduled event from the selected date", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-27T12:00:00"));

    renderAdminDashboard({
      calendarEvents: [
        calendarRow({
          id: 5,
          name: "Resume Review Lab",
          description: "Bring your latest resume for live feedback.",
          startDate: "2026-04-27T12:00:00",
          endDate: "2026-04-27T12:00:00",
          timeStart: "18:00:00",
          timeEnd: "19:00:00",
          capacity: 12,
          location: "Career Center",
        }),
      ],
    });
    vi.useRealTimers();

    const calendarControls = getCalendarManagementControls();

    expect(await calendarControls.findByText("Resume Review Lab")).toBeInTheDocument();

    fireEvent.click(calendarControls.getByRole("button", { name: /cancel event/i }));

    expect(screen.getByRole("heading", { name: /cancel this event\?/i })).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /cancel event/i }));
    });

    await waitFor(() => {
      expect(calendarControls.queryByText("Resume Review Lab")).not.toBeInTheDocument();
    });

    expect(supabaseSpies.calendarDeleteEq).toHaveBeenCalledWith("id", 5);
    expect(calendarControls.getByText(/no events scheduled for this date yet/i)).toBeInTheDocument();
  });

  test("searches for a mentor and displays matching mentor details", async () => {
    renderAdminDashboard({
      mentorSearchResults: [
        mentorRow({
          id: "mentor-1",
          firstName: "Alicia",
          lastName: "Nguyen",
          email: "alicia.nguyen@divasintech.org",
          bio: "Frontend engineer passionate about helping early-career developers build confidence, portfolios, and sustainable coding habits.",
        }),
      ],
    });

    const mentorshipSection = screen
      .getByRole("heading", { name: /mentorship management/i })
      .closest("section");
    const mentorSearchControls = within(mentorshipSection);

    fireEvent.change(mentorSearchControls.getByLabelText(/search for a mentor by name/i), {
      target: { value: "alicia" },
    });

    await act(async () => {
      fireEvent.click(mentorSearchControls.getByRole("button", { name: /search/i }));
    });

    expect(
      await mentorSearchControls.findByText("alicia.nguyen@divasintech.org")
    ).toBeInTheDocument();
    expect(
      mentorSearchControls.getByRole("button", {
        name: /remove mentor alicia nguyen/i,
      })
    ).toBeInTheDocument();
  });

  test("removes a mentor after confirmation", async () => {
    renderAdminDashboard({
      mentorSearchResults: [
        mentorRow({
          id: "mentor-1",
          firstName: "Alicia",
          lastName: "Nguyen",
          email: "alicia.nguyen@divasintech.org",
        }),
      ],
    });

    const mentorshipSection = screen
      .getByRole("heading", { name: /mentorship management/i })
      .closest("section");
    const mentorControls = within(mentorshipSection);

    fireEvent.change(mentorControls.getByLabelText(/search for a mentor by name/i), {
      target: { value: "alicia" },
    });

    await act(async () => {
      fireEvent.click(mentorControls.getByRole("button", { name: /search/i }));
    });

    await mentorControls.findByText("alicia.nguyen@divasintech.org");
    fireEvent.click(
      mentorControls.getByRole("button", { name: /remove mentor alicia nguyen/i })
    );

    expect(screen.getByRole("heading", { name: /delete this account\?/i })).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /^confirm$/i }));
    });

    await waitFor(() => {
      expect(screen.queryByText("alicia.nguyen@divasintech.org")).not.toBeInTheDocument();
    });

    expect(supabaseSpies.mentorDeleteEq).toHaveBeenCalledWith("mentor_id", "mentor-1");
    expect(screen.queryByRole("heading", { name: /delete this account\?/i })).not.toBeInTheDocument();
  });

  test("opens a no-code confirmation and adds a mentor when confirmed", async () => {
    const createdMentor = mentorRow({
      id: "mentor-3",
      firstName: "Priya",
      lastName: "Shah",
      email: "priya.shah@divasintech.org",
      bio: "Engineering manager who mentors students on resume reviews, confidence building, and career growth.",
      photo: "",
    });

    renderAdminDashboard({
      mentorInsertResult: createdMentor,
      mentorSearchResults: [createdMentor],
    });

    fireEvent.change(screen.getByLabelText(/^first name$/i), {
      target: { value: "Priya" },
    });
    fireEvent.change(screen.getByLabelText(/^last name$/i), {
      target: { value: "Shah" },
    });
    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: "priya.shah@divasintech.org" },
    });
    fireEvent.change(screen.getByLabelText(/^bio$/i), {
      target: {
        value:
          "Engineering manager who mentors students on resume reviews, confidence building, and career growth.",
      },
    });

    const addMentorButton = screen.getByRole("button", { name: /add mentor/i });
    expect(addMentorButton).not.toBeDisabled();

    fireEvent.click(addMentorButton);

    expect(screen.getByRole("heading", { name: /add this mentor\?/i })).toBeInTheDocument();
    expect(screen.queryByLabelText(/confirmation code/i)).not.toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /^confirm$/i }));
    });

    await waitFor(() => {
      expect(screen.getByLabelText(/^first name$/i).value).toBe("");
      expect(screen.getByLabelText(/^last name$/i).value).toBe("");
      expect(screen.getByLabelText(/^email$/i).value).toBe("");
      expect(screen.getByLabelText(/^bio$/i).value).toBe("");
    });

    expect(supabaseSpies.mentorInsert).toHaveBeenCalledWith({
      first_name: "Priya",
      last_name: "Shah",
      email: "priya.shah@divasintech.org",
      bio: "Engineering manager who mentors students on resume reviews, confidence building, and career growth.",
      photo: "",
    });

    const mentorshipSection = screen
      .getByRole("heading", { name: /mentorship management/i })
      .closest("section");
    const mentorControls = within(mentorshipSection);

    fireEvent.change(mentorControls.getByLabelText(/search for a mentor by name/i), {
      target: { value: "priya" },
    });

    await act(async () => {
      fireEvent.click(mentorControls.getByRole("button", { name: /search/i }));
    });

    expect(await mentorControls.findByText("priya.shah@divasintech.org")).toBeInTheDocument();
  });

  test("disables adding a mentor when the bio exceeds 200 words", () => {
    renderAdminDashboard();

    const overLimitBio = Array.from({ length: 201 }, (_, index) => `word${index + 1}`).join(" ");

    fireEvent.change(screen.getByLabelText(/^first name$/i), {
      target: { value: "Jamie" },
    });
    fireEvent.change(screen.getByLabelText(/^last name$/i), {
      target: { value: "Lopez" },
    });
    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: "jamie.lopez@divasintech.org" },
    });
    fireEvent.change(screen.getByLabelText(/^bio$/i), {
      target: { value: overLimitBio },
    });

    expect(screen.getByText("201/200 words")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add mentor/i })).toBeDisabled();
  });
});
