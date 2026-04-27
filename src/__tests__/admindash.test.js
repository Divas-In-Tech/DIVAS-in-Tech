import React from "react";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";

const { supabaseMock } = vi.hoisted(() => ({
  supabaseMock: {
    from: () => {
      throw new Error("Supabase mock was not configured for this test.");
    },
    storage: {
      from: () => ({
        upload: async () => ({ error: null }),
        getPublicUrl: () => ({ data: { publicUrl: "" } }),
      }),
    },
  },
}));

vi.mock("../supabaseConnection", () => ({
  supabase: supabaseMock,
}));

import { AdminDashboard } from "../pages/AdminDashboard";

const clone = (value) => JSON.parse(JSON.stringify(value));

const createDefaultSeed = () => ({
  users: [
    {
      email: "jane.doe@divasintech.org",
      first_name: "Jane",
      last_name: "Doe",
      role: "Student",
      approved: false,
      pending_since: "01/06/2024",
      event_attended: "Workshop 1",
    },
    {
      email: "john.smith@divasintech.org",
      first_name: "John",
      last_name: "Smith",
      role: "Student",
      approved: false,
      pending_since: "04/16/2026",
      event_attended: "Workshop 2",
    },
    {
      email: "janie.doe@divasintech.org",
      first_name: "Janie",
      last_name: "Doe",
      role: "Student",
      approved: true,
      pending_since: "01/06/2024",
      event_attended: "Workshop 1",
    },
  ],
  mentors: [
    {
      mentor_id: "mentor-1",
      first_name: "Alicia",
      last_name: "Nguyen",
      email: "alicia.nguyen@divasintech.org",
      bio: "Frontend engineer passionate about helping early-career developers build confidence, portfolios, and sustainable coding habits.",
      photo: "alicia-nguyen-headshot.jpg",
    },
    {
      mentor_id: "mentor-2",
      first_name: "Monica",
      last_name: "Patel",
      email: "monica.patel@divasintech.org",
      bio: "Product leader focused on mentorship around internships, technical interviewing, and turning ideas into well-scoped projects.",
      photo: "",
    },
  ],
  calendar: [
    {
      id: 1,
      name: "Resume Review Lab",
      description: "Bring your latest resume draft for feedback and next-step planning.",
      start_date: "2026-04-27",
      end_date: "2026-04-27",
      time_start: "18:00:00",
      time_end: "19:00:00",
      num_of_attendees: 20,
      location: "Innovation Hub",
      link: "",
    },
  ],
});

const buildSupabaseMock = (seedOverrides = {}) => {
  const baseSeed = createDefaultSeed();
  const db = {
    users: clone(seedOverrides.users ?? baseSeed.users),
    mentors: clone(seedOverrides.mentors ?? baseSeed.mentors),
    calendar: clone(seedOverrides.calendar ?? baseSeed.calendar),
  };

  const matchesIlike = (value, pattern) =>
    String(value ?? "")
      .toLowerCase()
      .includes(String(pattern).replaceAll("%", "").toLowerCase());

  const queryBuilder = (tableName, operation = "select", payload = null) => {
    const filters = [];
    let orderBy = null;
    let shouldReturnSingle = false;

    const builder = {
      select() {
        return builder;
      },
      insert(values) {
        return queryBuilder(tableName, "insert", values);
      },
      update(values) {
        return queryBuilder(tableName, "update", values);
      },
      delete() {
        return queryBuilder(tableName, "delete");
      },
      eq(field, value) {
        filters.push((row) => row[field] === value);
        return builder;
      },
      ilike(field, pattern) {
        filters.push((row) => matchesIlike(row[field], pattern));
        return builder;
      },
      order(field, options = {}) {
        orderBy = { field, ascending: options.ascending !== false };
        return builder;
      },
      single() {
        shouldReturnSingle = true;
        return builder;
      },
      then(resolve, reject) {
        return Promise.resolve(execute()).then(resolve, reject);
      },
    };

    const filteredRows = () => {
      let rows = clone(db[tableName] ?? []);

      if (filters.length > 0) {
        rows = rows.filter((row) => filters.every((filter) => filter(row)));
      }

      if (orderBy) {
        rows.sort((left, right) => {
          const leftValue = left[orderBy.field];
          const rightValue = right[orderBy.field];

          if (leftValue === rightValue) return 0;
          if (leftValue == null) return orderBy.ascending ? -1 : 1;
          if (rightValue == null) return orderBy.ascending ? 1 : -1;

          return orderBy.ascending
            ? String(leftValue).localeCompare(String(rightValue))
            : String(rightValue).localeCompare(String(leftValue));
        });
      }

      return rows;
    };

    const execute = () => {
      if (operation === "select") {
        const rows = filteredRows();
        return { data: shouldReturnSingle ? rows[0] ?? null : rows, error: null };
      }

      if (operation === "insert") {
        let insertedRow = clone(payload);

        if (tableName === "mentors") {
          insertedRow = {
            mentor_id: payload.mentor_id ?? `mentor-${db.mentors.length + 1}`,
            photo: payload.photo ?? "",
            ...insertedRow,
          };
          db.mentors.unshift(insertedRow);
        } else if (tableName === "calendar") {
          insertedRow = {
            id:
              payload.id ??
              db.calendar.reduce((highestId, row) => Math.max(highestId, Number(row.id) || 0), 0) + 1,
            ...insertedRow,
          };
          db.calendar.push(insertedRow);
        } else if (tableName === "users") {
          db.users.push(insertedRow);
        }

        return {
          data: shouldReturnSingle ? clone(insertedRow) : [clone(insertedRow)],
          error: null,
        };
      }

      if (operation === "update") {
        const updatedRows = [];

        db[tableName] = db[tableName].map((row) => {
          if (!filters.every((filter) => filter(row))) {
            return row;
          }

          const updatedRow = { ...row, ...payload };
          updatedRows.push(clone(updatedRow));
          return updatedRow;
        });

        return {
          data: shouldReturnSingle ? updatedRows[0] ?? null : updatedRows,
          error: null,
        };
      }

      if (operation === "delete") {
        const deletedRows = [];

        db[tableName] = db[tableName].filter((row) => {
          const shouldDelete = filters.every((filter) => filter(row));

          if (shouldDelete) {
            deletedRows.push(clone(row));
          }

          return !shouldDelete;
        });

        return {
          data: shouldReturnSingle ? deletedRows[0] ?? null : deletedRows,
          error: null,
        };
      }

      throw new Error(`Unsupported Supabase operation: ${operation}`);
    };

    return builder;
  };

  return {
    db,
    from(tableName) {
      return queryBuilder(tableName);
    },
    storage: {
      from() {
        return {
          upload: async () => ({ error: null }),
          getPublicUrl: () => ({ data: { publicUrl: "https://example.com/photo.jpg" } }),
        };
      },
    },
  };
};

const renderAdminDashboard = (seedOverrides = {}) => {
  const configuredSupabase = buildSupabaseMock(seedOverrides);
  supabaseMock.from = configuredSupabase.from;
  supabaseMock.storage = configuredSupabase.storage;

  return {
    ...render(React.createElement(AdminDashboard)),
    db: configuredSupabase.db,
  };
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

const getMentorshipControls = () => {
  const mentorshipSection = screen
    .getByRole("heading", { name: /mentorship management/i })
    .closest("section");

  return within(mentorshipSection);
};

describe("AdminDashboard", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  test("renders pending user data from the Supabase query", async () => {
    renderAdminDashboard({
      users: [
        {
          email: "avery.johnson@divasintech.org",
          first_name: "Avery",
          last_name: "Johnson",
          role: "Volunteer",
          approved: false,
          pending_since: "02/04/2026",
          event_attended: "DIVAS Tech Summit",
        },
        {
          email: "maya.patel@divasintech.org",
          first_name: "Maya",
          last_name: "Patel",
          role: "Mentor",
          approved: false,
          pending_since: "04/05/2026",
          event_attended: "Spring Coding Workshop",
        },
      ],
      mentors: [],
      calendar: [],
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
      users: [
        {
          email: "jordan.lee@divasintech.org",
          first_name: "Jordan",
          last_name: "Lee",
          role: "Volunteer",
          approved: false,
          pending_since: "04/02/2026",
          event_attended: "Hack Night",
        },
      ],
      mentors: [],
      calendar: [],
    });

    expect(
      await screen.findByLabelText(/account pending for more than 14 days/i)
    ).toBeInTheDocument();
    expect(screen.getByText("04/02/2026").closest("tr")).toHaveClass("bg-red-200");
  });

  test("successfully searches for a user", async () => {
    renderAdminDashboard({
      users: [
        {
          email: "taylor.brooks@divasintech.org",
          first_name: "Taylor",
          last_name: "Brooks",
          role: "Mentor",
          approved: true,
          pending_since: "03/10/2026",
          event_attended: "Summit",
        },
      ],
      mentors: [],
      calendar: [],
    });

    const accountSearchControls = getAccountSearchControls();

    fireEvent.change(accountSearchControls.getByLabelText(/search for a user by name/i), {
      target: { value: "taylor" },
    });
    fireEvent.click(accountSearchControls.getByRole("button", { name: /search/i }));

    expect(await screen.findByText("taylor.brooks@divasintech.org")).toBeInTheDocument();
    expect(screen.getByText(/account type: mentor/i)).toBeInTheDocument();
    expect(screen.getByText(/status: active/i)).toBeInTheDocument();
  });

  test("successfully returns duplicate-name matches", async () => {
    renderAdminDashboard({
      users: [
        {
          email: "a.smith@email.com",
          first_name: "Alex",
          last_name: "Smith",
          role: "Volunteer",
          approved: true,
          pending_since: "01/15/2026",
          event_attended: "Intro Night",
        },
        {
          email: "alex.smith@email.com",
          first_name: "Alex",
          last_name: "Smith",
          role: "Mentor",
          approved: false,
          pending_since: "02/20/2026",
          event_attended: "Mentor Meet",
        },
      ],
      mentors: [],
      calendar: [],
    });

    const accountSearchControls = getAccountSearchControls();

    fireEvent.change(accountSearchControls.getByLabelText(/search for a user by name/i), {
      target: { value: "alex" },
    });
    fireEvent.click(accountSearchControls.getByRole("button", { name: /search/i }));

    expect(await screen.findByText("a.smith@email.com")).toBeInTheDocument();
    expect(screen.getByText("alex.smith@email.com")).toBeInTheDocument();
    expect(screen.getByText(/account type: volunteer/i)).toBeInTheDocument();
    expect(screen.getByText(/status: active/i)).toBeInTheDocument();
    expect(screen.getByText(/account type: mentor/i)).toBeInTheDocument();
    expect(screen.getByText(/status: pending/i)).toBeInTheDocument();
  });

  test("shows an empty state when no user matches the search", async () => {
    renderAdminDashboard({
      users: [
        {
          email: "morgan.price@divasintech.org",
          first_name: "Morgan",
          last_name: "Price",
          role: "Volunteer",
          approved: false,
          pending_since: "02/21/2026",
          event_attended: "Career Night",
        },
      ],
      mentors: [],
      calendar: [],
    });

    const accountSearchControls = getAccountSearchControls();

    fireEvent.change(accountSearchControls.getByLabelText(/search for a user by name/i), {
      target: { value: "a user who does not exist" },
    });
    fireEvent.click(accountSearchControls.getByRole("button", { name: /search/i }));

    expect(await screen.findByText(/no account matched that name\./i)).toBeInTheDocument();
    expect(screen.queryByText("morgan.price@divasintech.org")).not.toBeInTheDocument();
  });

  test("opens an accept confirmation dialog and closes it with cancel", async () => {
    renderAdminDashboard();

    fireEvent.click(await screen.findByRole("button", { name: /activate jane doe/i }));

    expect(
      screen.getByRole("heading", { name: /activate this account\?/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^confirm$/i })).toHaveClass("bg-pink-700");

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: /activate this account\?/i })
      ).not.toBeInTheDocument();
    });
  });

  test("opens a reject confirmation dialog and closes it with the top corner x", async () => {
    renderAdminDashboard();

    fireEvent.click(await screen.findByRole("button", { name: /reject jane doe/i }));

    expect(
      screen.getByRole("heading", { name: /reject this account\?/i })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /close/i }));

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: /reject this account\?/i })
      ).not.toBeInTheDocument();
    });
  });

  test("opens a promote confirmation dialog without requiring a confirmation code", async () => {
    renderAdminDashboard();

    const accountSearchControls = getAccountSearchControls();

    fireEvent.change(accountSearchControls.getByLabelText(/search for a user by name/i), {
      target: { value: "janie" },
    });
    fireEvent.click(accountSearchControls.getByRole("button", { name: /search/i }));
    fireEvent.click(
      await screen.findByRole("button", { name: /promote janie doe to admin/i })
    );

    expect(
      screen.getByRole("heading", { name: /promote this user to admin\?/i })
    ).toBeInTheDocument();
    expect(screen.queryByLabelText(/confirmation code/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^confirm$/i }));

    await waitFor(() => {
      expect(screen.getByText(/account type: admin/i)).toBeInTheDocument();
    });
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

    renderAdminDashboard({ calendar: [] });
    await act(async () => {});

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

    fireEvent.click(calendarControls.getByRole("button", { name: /add event/i }));

    await act(async () => {});

    expect(calendarControls.getByText("Community Standup")).toBeInTheDocument();
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

    renderAdminDashboard();
    await act(async () => {});

    const calendarControls = getCalendarManagementControls();

    expect(calendarControls.getByText("Resume Review Lab")).toBeInTheDocument();

    fireEvent.click(calendarControls.getByRole("button", { name: /cancel event/i }));

    expect(screen.getByRole("heading", { name: /cancel this event\?/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /cancel event/i }));

    await act(async () => {});

    expect(calendarControls.queryByText("Resume Review Lab")).not.toBeInTheDocument();
    expect(calendarControls.getByText(/no events scheduled for this date yet/i)).toBeInTheDocument();
  });

  test("searches for a mentor and displays matching mentor details", async () => {
    renderAdminDashboard();

    const mentorControls = getMentorshipControls();

    fireEvent.change(mentorControls.getByLabelText(/search for a mentor by name/i), {
      target: { value: "alicia" },
    });
    fireEvent.click(mentorControls.getByRole("button", { name: /search/i }));

    expect(await mentorControls.findByText("alicia.nguyen@divasintech.org")).toBeInTheDocument();
    expect(
      mentorControls.getByRole("button", { name: /remove mentor alicia nguyen/i })
    ).toBeInTheDocument();
  });

  test("removes a mentor after confirmation", async () => {
    renderAdminDashboard();

    const mentorControls = getMentorshipControls();

    fireEvent.change(mentorControls.getByLabelText(/search for a mentor by name/i), {
      target: { value: "alicia" },
    });
    fireEvent.click(mentorControls.getByRole("button", { name: /search/i }));
    fireEvent.click(
      await mentorControls.findByRole("button", { name: /remove mentor alicia nguyen/i })
    );

    expect(screen.getByRole("heading", { name: /delete this account\?/i })).toBeInTheDocument();
    expect(screen.queryByLabelText(/confirmation code/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^confirm$/i }));

    await waitFor(() => {
      expect(
        mentorControls.queryByText("alicia.nguyen@divasintech.org")
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("heading", { name: /delete this account\?/i })
      ).not.toBeInTheDocument();
    });
  });

  test("opens a no-code confirmation and adds a mentor when confirmed", async () => {
    renderAdminDashboard();

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

    fireEvent.click(screen.getByRole("button", { name: /^confirm$/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/^first name$/i).value).toBe("");
      expect(screen.getByLabelText(/^last name$/i).value).toBe("");
      expect(screen.getByLabelText(/^email$/i).value).toBe("");
      expect(screen.getByLabelText(/^bio$/i).value).toBe("");
    });

    const mentorControls = getMentorshipControls();

    fireEvent.change(mentorControls.getByLabelText(/search for a mentor by name/i), {
      target: { value: "priya" },
    });
    fireEvent.click(mentorControls.getByRole("button", { name: /search/i }));

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
