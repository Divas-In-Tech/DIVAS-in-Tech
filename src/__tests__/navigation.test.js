import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { Navigation } from "../pages/Navigation";

describe("Navigation", () => {
  const defaultProps = {
    currentPage: "home",
    onNavigate: vi.fn(),
    isLoggedIn: false,
    onLoginClick: vi.fn(),
    onLogout: vi.fn(),
    userName: "",
  };

  test("shows Admin Dashboard in navigation when the user is an admin", () => {
    render(
      React.createElement(Navigation, {
        ...defaultProps,
        isAdmin: true,
      })
    );

    expect(
      screen.getByRole("button", { name: /admin dashboard/i })
    ).toBeInTheDocument();
  });

  test("does not show Admin Dashboard in navigation when the user is not an admin", () => {
    render(
      React.createElement(Navigation, {
        ...defaultProps,
        isAdmin: false,
      })
    );

    expect(
      screen.queryByRole("button", { name: /admin dashboard/i })
    ).not.toBeInTheDocument();
  });
});
