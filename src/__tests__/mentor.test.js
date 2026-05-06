import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { MentorPage } from "../pages/MentorPage";

describe("MentorPage", () => {
  test("blocks an inappropriate mentor message and allows resubmission after editing", async () => {
    render(React.createElement(MentorPage));

    fireEvent.click(screen.getAllByRole("button", { name: /contact mentor/i })[0]);

    const messageInput = screen.getByPlaceholderText(/message marisol valeriano/i);

    fireEvent.change(messageInput, {
      target: { value: "Don't be an asshole" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    expect(
      await screen.findByText(/please ensure your message is appropriate/i)
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/message marisol valeriano/i)).toBeInTheDocument();

    fireEvent.change(messageInput, {
      target: { value: "I would love to learn more about your career path." },
    });

    expect(
      screen.queryByText(/please ensure your message is appropriate/i)
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    expect(
      screen.queryByPlaceholderText(/message marisol valeriano/i)
    ).not.toBeInTheDocument();
  });
});
