import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactPage from '../ContactPage';

describe('ContactPage', () => {
    it('should render contact form', () => {
        render(<ContactPage />);
        expect(screen.getByRole('form')).toBeInTheDocument();
    });

    it('should display form fields', () => {
        render(<ContactPage />);
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    });

    it('should update input values on change', async () => {
        render(<ContactPage />);
        const nameInput = screen.getByLabelText(/name/i);
        await userEvent.type(nameInput, 'John Doe');
        expect(nameInput.value).toBe('John Doe');
    });

    it('should submit form with valid data', async () => {
        render(<ContactPage />);
        await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
        await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
        await userEvent.type(screen.getByLabelText(/message/i), 'Test message');
        fireEvent.click(screen.getByRole('button', { name: /submit/i }));
        await waitFor(() => expect(screen.getByText(/success/i)).toBeInTheDocument());
    });

    it('should show validation errors for empty fields', async () => {
        render(<ContactPage />);
        fireEvent.click(screen.getByRole('button', { name: /submit/i }));
        await waitFor(() => expect(screen.getByText(/required/i)).toBeInTheDocument());
    });
});