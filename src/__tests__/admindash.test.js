import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { AdminDashboard } from "../pages/AdminDashboard";

describe("AdminDashboard", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

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

    render(
      React.createElement(AdminDashboard, { pendingUsers: mockPendingUsers })
    );

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

    render(
      React.createElement(AdminDashboard, {
        pendingUsers: [
          {
            firstName: "Jordan",
            lastName: "Lee",
            accountType: "Volunteer",
            eventAttended: "Hack Night",
            createdAt: "04/02/2026",
          },
        ],
      })
    );

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

    render(
      React.createElement(AdminDashboard, {
        searchableUsers: mockSearchableUsers,
      })
    );

    fireEvent.change(screen.getByLabelText(/search for a user by name/i), {
      target: { value: "taylor brooks" },
    });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));

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

    render(
      React.createElement(AdminDashboard, {
        searchableUsers: mockSearchableUsers,
      })
    );

    fireEvent.change(screen.getByLabelText(/search for a user by name/i), {
      target: { value: "alex smith" },
    });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));

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

    render(
      React.createElement(AdminDashboard, {
        searchableUsers: mockSearchableUsers,
      })
    );

    fireEvent.change(screen.getByLabelText(/search for a user by name/i), {
      target: { value: "a user who does not exist" },
    });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    expect(
      screen.getByText(/no account matched that name\./i)
    ).toBeInTheDocument();
    expect(screen.queryByText("morgan.price@divasintech.org")).not.toBeInTheDocument();
  });

  test("opens an accept confirmation dialog and closes it with cancel", () => {
    render(React.createElement(AdminDashboard));

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
    render(React.createElement(AdminDashboard));

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
    render(React.createElement(AdminDashboard));

    fireEvent.change(screen.getByLabelText(/search for a user by name/i), {
      target: { value: "janie doe" },
    });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));
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
    render(React.createElement(AdminDashboard));

    fireEvent.change(screen.getByLabelText(/search for a user by name/i), {
      target: { value: "janie doe" },
    });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));
    fireEvent.click(
      screen.getByRole("button", { name: /deactivate janie doe account/i })
    );

    expect(
      screen.getByRole("heading", { name: /delete this account\?/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmation code/i)).toBeInTheDocument();
  });
});
