import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import LoginForm from './LoginForm'; // Ensure this path is correct
import configureTestStore from '../../services/testStore.tsx'; 
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


function base64url(source: any) {
    // Encode in classical base64
    let encodedSource = Buffer.from(source).toString('base64');
    // Remove padding equal characters
    encodedSource = encodedSource.replace(/=+$/, '');
    // Replace characters according to base64url specifications
    encodedSource = encodedSource.replace(/\+/g, '-');
    encodedSource = encodedSource.replace(/\//g, '_');
    return encodedSource;
  }
  
  // Example header and payload
  const header = {
    "alg": "HS256",
    "typ": "JWT"
  };
  
  const payload = {
    "sub": "1234567890",
    "name": "John Doe",
    "iat": 1516239022
  };
  
  // Creating a non-secure example JWT (without signature for simplicity)
  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(payload));
  const signature = 'signature'; 
  
  const mockAccessToken = `${encodedHeader}.${encodedPayload}.${signature}`;
  const mockRefreshToken = `${encodedHeader}.${encodedPayload}.${signature}`;

vi.mock('react-router-dom', async () => {
    const actual = await import('react-router-dom'); 
    return {
        ...actual,
        useNavigate: vi.fn(),
    };
});

vi.mock('jwt-decode', () => ({
    __esModule: true,
    default: vi.fn().mockImplementation(token => {
        return { sub: '1234567890', name: 'John Doe', iat: 1516239022 }; 
    })
}));

  
  

describe('LoginForm Component', () => {
    let store: any;

    beforeEach(() => {
        window.localStorage.clear();

        store = configureTestStore({
            auth: {
                isAuthenticated: false,
                error: null,
            }
        });

        // eslint-disable-next-line @typescript-eslint/no-empty-function
        vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {});
        vi.spyOn(window.localStorage, 'getItem').mockImplementation(() => null);
        vi.restoreAllMocks();
    });

  it('renders LoginForm and allows user input', () => {
    render(
      <Provider store={store}>
        <Router>
          <LoginForm />
        </Router>
      </Provider>
    );

    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput).toHaveValue('test@example.com');

    const passwordInput = screen.getByLabelText('Password');
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(passwordInput).toHaveValue('password123');
  });

  it('displays error messages when there is an error', () => {
    store.dispatch({
        type: 'LOGIN_FAILURE',
        error: 'Login failed'
      });
       
    render(
      <Provider store={store}>
        <Router>
          <LoginForm />
        </Router>
      </Provider>
    );

    screen.findByText('Login failed').then(element => {
        expect(element).toBeInTheDocument();
      }).catch(e => {
        console.error('Error message not found:', e);
      });
    });

    it('tests jwt-decode mock', () => {
        const decoded = jwtDecode('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
        expect(decoded).toEqual({ sub: '1234567890', name: 'John Doe', iat: 1516239022 });
    });
      

  it('navigates user when login is successful', async () => {
    store.dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
            access: 'valid.mock.jwt',
            refresh: 'valid.mock.refresh'
        }
    });
      
      const navigate = vi.fn();
      vi.mocked(useNavigate).mockReturnValue(navigate);

    render(
    <Provider store={store}>
        <Router>
            <LoginForm />
        </Router>
    </Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await vi.runAllTimers();

    expect(navigate).toHaveBeenCalledWith('/');
    expect(localStorage.setItem).toHaveBeenCalledWith('access', 'mock_access_token');
    expect(localStorage.setItem).toHaveBeenCalledWith('refresh', 'mock_refresh_token');
  });
});
