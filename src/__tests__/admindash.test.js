import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { AdminDashboard } from "../pages/AdminDashboard";

describe("AdminDashboard", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const defaultPendingUsers = [
    {
      firstName: "Jane",
      lastName: "Doe",
      accountType: "Student",
      eventAttended: "Workshop 1",
      createdAt: "01/06/2024",
    },
    {
      firstName: "John",
      lastName: "Smith",
      accountType: "Student",
      eventAttended: "Workshop 2",
      createdAt: "04/16/2026",
    },
  ];

  const defaultSearchableUsers = [
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
  ];

  const defaultMentors = [
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

  const renderAdminDashboard = (props = {}) =>
    render(
      React.createElement(AdminDashboard, {
        pendingUsers: defaultPendingUsers,
        searchableUsers: defaultSearchableUsers,
        mentors: defaultMentors,
        ...props,
      })
    );

  const getAccountSearchControls = () => {
    const accountSearchSection = screen
      .getByRole("heading", { name: /account search/i })
      .closest("section");

    return within(accountSearchSection);
  };

  test("renders pending user data passed into the table", () => {
    const mockPendingUsers = [
      {
        firstName: "Avery",
        lastName: "Johnson",
        accountType: "Volunteer",
        eventAttended: "DIVAS Tech Summit",
        createdAt: "02/04/2026",
      },
      {
        firstName: "Maya",
        lastName: "Patel",
        accountType: "Mentor",
        eventAttended: "Spring Coding Workshop",
        createdAt: "04/05/2026",
      },
    ];

    renderAdminDashboard({ pendingUsers: mockPendingUsers });

    expect(
      screen.getByRole("columnheader", { name: /first name/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /last name/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /account type/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /event attended/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /pending since/i })
    ).toBeInTheDocument();

    expect(screen.getByText("Avery")).toBeInTheDocument();
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

  test("marks users pending for 14 days or more with a warning icon and red row styling", () => {
    vi.spyOn(Date, "now").mockReturnValue(
      new Date("04/16/2026").getTime()
    );

    renderAdminDashboard({
      pendingUsers: [
        {
          firstName: "Jordan",
          lastName: "Lee",
          accountType: "Volunteer",
          eventAttended: "Hack Night",
          createdAt: "04/02/2026",
        },
      ],
    });

    expect(
      screen.getByLabelText(/account pending for more than 14 days/i)
    ).toBeInTheDocument();
    expect(screen.getByText("04/02/2026").closest("tr")).toHaveClass(
      "bg-red-200"
    );
  });

  test("successfully searches for a user", () => {
    const mockSearchableUsers = [
      {
        firstName: "Taylor",
        lastName: "Brooks",
        email: "taylor.brooks@divasintech.org",
        accountType: "Mentor",
        status: "Active",
        joinedAt: "03/10/2026",
      },
    ];

    renderAdminDashboard({ searchableUsers: mockSearchableUsers });

    const accountSearchControls = getAccountSearchControls();

    fireEvent.change(accountSearchControls.getByLabelText(/search for a user by name/i), {
      target: { value: "taylor brooks" },
    });
    fireEvent.click(accountSearchControls.getByRole("button", { name: /search/i }));

    expect(screen.getByText("taylor.brooks@divasintech.org")).toBeInTheDocument();
    expect(screen.getByText(/account type: mentor/i)).toBeInTheDocument();
    expect(screen.getByText(/status: active/i)).toBeInTheDocument();
  });
  test("successfully searches for a user with a duplicate name but different email", () => {
    const mockSearchableUsers = [
      {
        firstName: "Alex",
        lastName: "Smith",
        email: "a.smith@email.com",
        accountType: "Volunteer",
        status: "Active",
        joinedAt: "01/15/2026",
      },
      {
        firstName: "Alex",
        lastName: "Smith",
        email: "alex.smith@email.com",
        accountType: "Mentor",
        status: "Pending",
        joinedAt: "02/20/2026",
      }
    ];

    renderAdminDashboard({ searchableUsers: mockSearchableUsers });

    const accountSearchControls = getAccountSearchControls();

    fireEvent.change(accountSearchControls.getByLabelText(/search for a user by name/i), {
      target: { value: "alex smith" },
    });
    fireEvent.click(accountSearchControls.getByRole("button", { name: /search/i }));

    expect(screen.getByText("a.smith@email.com")).toBeInTheDocument();
    expect(screen.getByText(/account type: volunteer/i)).toBeInTheDocument();
    expect(screen.getByText(/status: active/i)).toBeInTheDocument();
    expect(screen.getByText("alex.smith@email.com")).toBeInTheDocument();
    expect(screen.getByText(/account type: mentor/i)).toBeInTheDocument();
    expect(screen.getByText(/status: pending/i)).toBeInTheDocument();
  });
  test("unsuccessfully searches for a user", () => {
    const mockSearchableUsers = [
      {
        firstName: "Morgan",
        lastName: "Price",
        email: "morgan.price@divasintech.org",
        accountType: "Volunteer",
        status: "Pending",
        joinedAt: "02/21/2026",
      },
    ];

    renderAdminDashboard({ searchableUsers: mockSearchableUsers });

    const accountSearchControls = getAccountSearchControls();

    fireEvent.change(accountSearchControls.getByLabelText(/search for a user by name/i), {
      target: { value: "a user who does not exist" },
    });
    fireEvent.click(accountSearchControls.getByRole("button", { name: /search/i }));

    expect(
      screen.getByText(/no account matched that name\./i)
    ).toBeInTheDocument();
    expect(screen.queryByText("morgan.price@divasintech.org")).not.toBeInTheDocument();
  });

  test("opens an accept confirmation dialog and closes it with cancel", () => {
    renderAdminDashboard();

    fireEvent.click(screen.getByRole("button", { name: /activate jane doe/i }));

    expect(
      screen.getByRole("heading", { name: /activate this account\?/i })
    ).toBeInTheDocument();

    const confirmButton = screen.getByRole("button", { name: /^confirm$/i });
    expect(confirmButton).toHaveClass("bg-pink-700");

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(
      screen.queryByRole("heading", { name: /activate this account\?/i })
    ).not.toBeInTheDocument();
  });

  test("opens a reject confirmation dialog and closes it with the top corner x", () => {
    renderAdminDashboard();

    fireEvent.click(screen.getByRole("button", { name: /reject jane doe/i }));

    expect(
      screen.getByRole("heading", { name: /reject this account\?/i })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /close/i }));

    expect(
      screen.queryByRole("heading", { name: /reject this account\?/i })
    ).not.toBeInTheDocument();
  });

  test("requires a confirmation code for promote actions", () => {
    renderAdminDashboard();

    const accountSearchControls = getAccountSearchControls();

    fireEvent.change(accountSearchControls.getByLabelText(/search for a user by name/i), {
      target: { value: "janie doe" },
    });
    fireEvent.click(accountSearchControls.getByRole("button", { name: /search/i }));
    fireEvent.click(
      screen.getByRole("button", { name: /promote janie doe to admin/i })
    );

    expect(
      screen.getByRole("heading", { name: /promote this user to admin\?/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmation code/i)).toBeInTheDocument();

    const confirmButton = screen.getByRole("button", { name: /^confirm$/i });
    expect(confirmButton).toBeDisabled();

    fireEvent.change(screen.getByLabelText(/confirmation code/i), {
      target: { value: "PROMOTE-123" },
    });

    expect(confirmButton).not.toBeDisabled();
  });

  test("requires a confirmation code for delete actions", () => {
    renderAdminDashboard();

    const accountSearchControls = getAccountSearchControls();

    fireEvent.change(accountSearchControls.getByLabelText(/search for a user by name/i), {
      target: { value: "janie doe" },
    });
    fireEvent.click(accountSearchControls.getByRole("button", { name: /search/i }));
    fireEvent.click(
      screen.getByRole("button", { name: /deactivate janie doe account/i })
    );

    expect(
      screen.getByRole("heading", { name: /delete this account\?/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmation code/i)).toBeInTheDocument();
  });

  test("searches for a mentor and displays matching mentor details", () => {
    renderAdminDashboard();

    const mentorshipSection = screen
      .getByRole("heading", { name: /mentorship management/i })
      .closest("section");
    const mentorSearchControls = within(mentorshipSection);

    fireEvent.change(
      mentorSearchControls.getByLabelText(/search for a mentor by name/i),
      {
        target: { value: "alicia nguyen" },
      }
    );
    fireEvent.click(mentorSearchControls.getByRole("button", { name: /search/i }));

    expect(
      mentorSearchControls.getByText("alicia.nguyen@divasintech.org")
    ).toBeInTheDocument();
    expect(
      mentorSearchControls.getByRole("button", {
        name: /remove mentor alicia nguyen/i,
      })
    ).toBeInTheDocument();
  });

  test("removes a mentor after confirmation", () => {
    renderAdminDashboard();

    const mentorshipSection = screen
      .getByRole("heading", { name: /mentorship management/i })
      .closest("section");
    const mentorControls = within(mentorshipSection);

    fireEvent.change(mentorControls.getByLabelText(/search for a mentor by name/i), {
      target: { value: "alicia nguyen" },
    });
    fireEvent.click(mentorControls.getByRole("button", { name: /search/i }));
    fireEvent.click(
      mentorControls.getByRole("button", { name: /remove mentor alicia nguyen/i })
    );

    expect(
      screen.getByRole("heading", { name: /delete this account\?/i })
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/confirmation code/i), {
      target: { value: "DELETE-123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /^confirm$/i }));

    expect(
      screen.queryByText("alicia.nguyen@divasintech.org")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /delete this account\?/i })
    ).not.toBeInTheDocument();
  });

  test("opens a no-code confirmation and adds a mentor when confirmed", () => {
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

    expect(
      screen.getByRole("heading", { name: /add this mentor\?/i })
    ).toBeInTheDocument();
    expect(screen.queryByLabelText(/confirmation code/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^confirm$/i }));

    expect(screen.getByLabelText(/^first name$/i).value).toBe("");
    expect(screen.getByLabelText(/^last name$/i).value).toBe("");
    expect(screen.getByLabelText(/^email$/i).value).toBe("");
    expect(screen.getByLabelText(/^bio$/i).value).toBe("");

    const mentorshipSection = screen
      .getByRole("heading", { name: /mentorship management/i })
      .closest("section");
    const mentorControls = within(mentorshipSection);

    fireEvent.change(mentorControls.getByLabelText(/search for a mentor by name/i), {
      target: { value: "priya shah" },
    });
    fireEvent.click(mentorControls.getByRole("button", { name: /search/i }));

    expect(
      mentorControls.getByText("priya.shah@divasintech.org")
    ).toBeInTheDocument();
  });

  test("disables adding a mentor when the bio exceeds 200 words", () => {
    render(React.createElement(AdminDashboard));

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
    expect(
      screen.getByRole("button", { name: /add mentor/i })
    ).toBeDisabled();
  });
});
