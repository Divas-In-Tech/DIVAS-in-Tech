import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

const { invokeMock } = vi.hoisted(() => ({
  invokeMock: vi.fn().mockResolvedValue({ data: null, error: null }),
}));

vi.mock("../supabaseConnection", () => ({
  supabase: {
    functions: {
      invoke: invokeMock,
    },
  },
}));

import { ContactPage } from "../pages/ContactPage";

describe("ContactPage", () => {
  beforeEach(() => {
    invokeMock.mockReset();
    invokeMock.mockResolvedValue({ data: null, error: null });
  });

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

  test("blocks submit and shows an error when the message contains profanity", async () => {
    render(React.createElement(ContactPage));

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/topic/i), {
      target: { value: "feedback" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "john@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: "Don't be an asshole" },
    });

    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    expect(
      await screen.findByText(/please ensure your message is appropriate/i)
    ).toBeInTheDocument();
    expect(invokeMock).not.toHaveBeenCalled();
  });

  test("clears the profanity error after the message is updated", async () => {
    render(React.createElement(ContactPage));

    const messageInput = screen.getByLabelText(/message/i);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/topic/i), {
      target: { value: "feedback" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "john@test.com" },
    });
    fireEvent.change(messageInput, {
      target: { value: "Don't be an asshole" },
    });

    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    expect(
      await screen.findByText(/please ensure your message is appropriate/i)
    ).toBeInTheDocument();

    fireEvent.change(messageInput, {
      target: { value: "Thanks for your help" },
    });

    expect(
      screen.queryByText(/please ensure your message is appropriate/i)
    ).not.toBeInTheDocument();
  });
});
