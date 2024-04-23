import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import FeedbackForm from './FeedbackForm';
import { QueryClient, QueryClientProvider } from 'react-query';
import axios from 'axios';
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react';

vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

const queryClient = new QueryClient();

const renderWithQueryProvider = (component: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined) => {
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

let originalCreateObjectURL: (obj: Blob | MediaSource) => string;


beforeAll(() => {
    originalCreateObjectURL = URL.createObjectURL;
    URL.createObjectURL = vi.fn(() => "http://dummyurl.com/dummy");
});
  
  afterAll(() => {
    URL.createObjectURL = originalCreateObjectURL;
});

describe('FeedbackForm Component', () => {
  beforeEach(() => {
    mockedAxios.post.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders without crashing', () => {
    renderWithQueryProvider(<FeedbackForm />);
    expect(screen.getByText('Leave Us Feedback!')).toBeInTheDocument();
  });

  it('allows input to be entered into the form fields', async () => {
    renderWithQueryProvider(<FeedbackForm />);
    
    // Simulate typing into the name input
    const nameInput = screen.getByLabelText('Name');
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    expect(nameInput).toHaveValue('John Doe');

    // Simulate typing into the email input
    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    expect(emailInput).toHaveValue('john@example.com');

    // Simulate typing into the message textarea
    const messageTextarea = screen.getByLabelText('Message');
    fireEvent.change(messageTextarea, { target: { value: 'This is a test message.' } });
    expect(messageTextarea).toHaveValue('This is a test message.');
  });

  it('submits the form and handles the response correctly', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        status: 201,
        issueKey: 'JIRA-123',
      },
    }).mockResolvedValueOnce({
      data: {
        status: 200,
        tempAttachmentId: 'ATTACH-123',
      },
    }).mockResolvedValueOnce({
      status: 200,
    });

    renderWithQueryProvider(<FeedbackForm />);

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'This is a test message.' } });

    const file = new File(['(⌐□_□)'], 'testImage.png', { type: 'image/png' });
    const fileInput = screen.getByLabelText('Upload Image:');

    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledTimes(3);
    });
    
    const successMessage = await screen.findByText('Feedback and image submitted successfully!');
    expect(successMessage).toBeInTheDocument();
  });

  it('displays error message if the form submission fails', async () => {
    mockedAxios.post.mockRejectedValue(new Error('Async error'));

    renderWithQueryProvider(<FeedbackForm />);

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'This is a test message.' } });
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.getByText('An error occurred while submitting the form')).toBeInTheDocument();
    });
  });
});