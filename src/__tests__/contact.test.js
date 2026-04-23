import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { ContactPage } from "../pages/ContactPage";

describe("ContactPage", () => {
  test("renders the contact form fields name, topic, email, and message", () => {
    render(React.createElement(ContactPage));

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/topic/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send message/i })
    ).toBeInTheDocument();
  });

  test("marks the required fields as required", () => {
    render(React.createElement(ContactPage));

    expect(screen.getByLabelText(/name/i)).toBeRequired();
    expect(screen.getByLabelText(/topic/i)).toBeRequired();
    expect(screen.getByLabelText(/email/i)).toBeRequired();
    expect(screen.getByLabelText(/message/i)).toBeRequired();
  });

  test("allows user to fill out the form", () => {
    render(React.createElement(ContactPage));

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/message/i);
    const topicSelect = screen.getByLabelText(/topic/i);

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@test.com" } });
    fireEvent.change(messageInput, { target: { value: "Hello there" } });
    fireEvent.change(topicSelect, { target: { value: "feedback" } });

    expect(nameInput.value).toBe("John Doe");
    expect(emailInput.value).toBe("john@test.com");
    expect(messageInput.value).toBe("Hello there");
    expect(topicSelect.value).toBe("feedback");
  });
});
