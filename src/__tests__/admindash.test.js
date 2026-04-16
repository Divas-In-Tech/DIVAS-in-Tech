import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { AdminDashboard } from "../pages/AdminDashboard";

describe("AdminDashboard", () => {
  test("renders pending user data passed into the table", () => {
    const mockPendingUsers = [
      {
        firstName: "Avery",
        lastName: "Johnson",
        accountType: "Volunteer",
        eventAttended: "DIVAS Tech Summit",
        createdAt: "2026-04-02",
      },
      {
        firstName: "Maya",
        lastName: "Patel",
        accountType: "Mentor",
        eventAttended: "Spring Coding Workshop",
        createdAt: "2026-04-05",
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
      screen.getByRole("columnheader", { name: /date of account creation/i })
    ).toBeInTheDocument();

    expect(screen.getByText("Avery")).toBeInTheDocument();
    expect(screen.getByText("Johnson")).toBeInTheDocument();
    expect(screen.getByText("Volunteer")).toBeInTheDocument();
    expect(screen.getByText("DIVAS Tech Summit")).toBeInTheDocument();
    expect(screen.getByText("2026-04-02")).toBeInTheDocument();

    expect(screen.getByText("Maya")).toBeInTheDocument();
    expect(screen.getByText("Patel")).toBeInTheDocument();
    expect(screen.getByText("Mentor")).toBeInTheDocument();
    expect(screen.getByText("Spring Coding Workshop")).toBeInTheDocument();
    expect(screen.getByText("2026-04-05")).toBeInTheDocument();
  });
});
