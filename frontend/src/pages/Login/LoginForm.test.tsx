import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm'; // Update this path if it is incorrect
import configureTestStore from '../../services/testStore'; // Ensure path and TypeScript types are correct

// Mocking axios and react-router-dom with correct TypeScript types
vi.mock('axios', () => ({
  default: {
    post: vi.fn(() => Promise.resolve({
      data: {
        success: true,
        token: 'abc123',
        userId: '12345'
      }
    })),
    get: vi.fn(() => Promise.resolve({
      data: {
        userId: '12345',
        name: 'John Doe',
        email: 'test@example.com'
      }
    }))
  }
}));

vi.mock('react-router-dom', async () => {
  const actual = await import('react-router-dom'); 
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn((token: string) => ({
    is_superuser: true,
    user_id: '12345',
    exp: 1682233600,
    email: 'test@example.com',
  }))
}));

describe('LoginForm Component', () => {
    let store: ReturnType<typeof configureTestStore>;
    let navigate: any;

    beforeEach(() => {
        window.localStorage.clear();
        store = configureTestStore({
            auth: {
                isAuthenticated: false,
                error: null,
            }
        });
        navigate = vi.fn();
        vi.mocked(useNavigate, true).mockReturnValue(navigate);
    });

    it('renders LoginForm and allows user input', async () => {
        render(
            <Provider store={store}>
                <Router>
                    <LoginForm />
                </Router>
            </Provider>
        );

        const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
        await userEvent.type(emailInput, 'test@example.com');
        expect(emailInput.value).toBe('test@example.com');

        const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
        await userEvent.type(passwordInput, 'password123');
        expect(passwordInput.value).toBe('password123');
    });

    it('navigates user when login is successful', async () => {
        store.dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
                access: 'valid.mock.jwt',
                refresh: 'valid.mock.refresh'
            }
        });

        render(
            <Provider store={store}>
                <Router>
                    <LoginForm />
                </Router>
            </Provider>
        );

        // Wait for any potential re-renders due to state changes
        await new Promise((resolve) => setTimeout(resolve, 0));

        const submitButton = screen.getByRole('button', { name: /sign in/i });
        await userEvent.click(submitButton);

        expect(navigate).toHaveBeenCalledWith('/');
    });
});
