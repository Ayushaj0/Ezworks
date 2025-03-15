import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { uploadComplete, TEST_EMAILS } from '../services/api';

jest.mock('../services/api');

describe('Email Validation Tests', () => {
  beforeEach(() => {
    render(<App />);
    uploadComplete.mockClear();
  });

  // Valid Email Tests
  test.each([
    'john.doe@example.com',
    'jane_doe123@company.co.uk',
    'test.email+label@domain.com',
    'first-last@domain.org',
    'email@subdomain.domain.com'
  ])('accepts valid email: %s', async (email) => {
    const input = screen.getByPlaceholderText('Email Address...');
    await userEvent.type(input, email);
    
    uploadComplete.mockResolvedValueOnce({ message: 'Form Submitted' });
    fireEvent.click(screen.getByText('Contact Me'));
    
    expect(await screen.findByText('Form Submitted')).toBeInTheDocument();
  });

  // Invalid Email Tests
  test.each([
    ['', 'Email is required'],
    ['plainaddress', 'Please enter a valid email address'],
    ['@domain.com', 'Please enter a valid email address'],
    ['email@domain', 'Please enter a valid email address'],
    ['email@.com', 'Please enter a valid email address'],
    ['email..test@domain.com', 'Please enter a valid email address']
  ])('shows error for invalid email: %s', async (email, expectedError) => {
    const input = screen.getByPlaceholderText('Email Address...');
    await userEvent.type(input, email);
    
    fireEvent.click(screen.getByText('Contact Me'));
    
    expect(await screen.findByText(expectedError)).toBeInTheDocument();
  });

  // Restricted Domain Tests
  test.each([
    'test@ez.works',
    'user.name@ez.works',
    'user+label@ez.works'
  ])('shows error for restricted domain: %s', async (email) => {
    const input = screen.getByPlaceholderText('Email Address...');
    await userEvent.type(input, email);
    
    uploadComplete.mockRejectedValueOnce(new Error('Email with @ez.works domain is not allowed'));
    fireEvent.click(screen.getByText('Contact Me'));
    
    expect(await screen.findByText('Email with @ez.works domain is not allowed')).toBeInTheDocument();
  });
});

describe('Quick Email Tests', () => {
  beforeEach(() => {
    render(<App />);
    uploadComplete.mockClear();
  });

  test('Test valid email submission', async () => {
    const input = screen.getByPlaceholderText('Email Address...');
    await userEvent.type(input, TEST_EMAILS.validEmails[0]); // test@gmail.com
    
    uploadComplete.mockResolvedValueOnce({ message: 'Form Submitted' });
    fireEvent.click(screen.getByText('Contact Me'));
    
    expect(await screen.findByText('Form Submitted')).toBeInTheDocument();
  });

  test('Test invalid email format', async () => {
    const input = screen.getByPlaceholderText('Email Address...');
    await userEvent.type(input, TEST_EMAILS.invalidEmails[0]); // notanemail
    
    fireEvent.click(screen.getByText('Contact Me'));
    
    expect(await screen.findByText('Please enter a valid email address')).toBeInTheDocument();
  });

  test('Test restricted domain', async () => {
    const input = screen.getByPlaceholderText('Email Address...');
    await userEvent.type(input, TEST_EMAILS.restrictedEmails[0]); // user@ez.works
    
    uploadComplete.mockRejectedValueOnce(new Error('Email with @ez.works domain is not allowed'));
    fireEvent.click(screen.getByText('Contact Me'));
    
    expect(await screen.findByText('Email with @ez.works domain is not allowed')).toBeInTheDocument();
  });
});

describe('Email Form Integration Tests', () => {
  beforeEach(() => {
    render(<App />);
    uploadComplete.mockClear();
  });

  test('shows error for empty submission', async () => {
    const submitButton = screen.getByText('Contact Me');
    fireEvent.click(submitButton);
    
    expect(await screen.findByText('Email is required')).toBeInTheDocument();
  });

  test('shows error for invalid email format', async () => {
    const input = screen.getByPlaceholderText('Email Address...');
    await userEvent.type(input, 'invalid-email');
    
    const submitButton = screen.getByText('Contact Me');
    fireEvent.click(submitButton);

    expect(await screen.findByText('Please enter a valid email address')).toBeInTheDocument();
  });

  test('shows error for @ez.works domain', async () => {
    const input = screen.getByPlaceholderText('Email Address...');
    await userEvent.type(input, 'test@ez.works');
    
    uploadComplete.mockRejectedValueOnce(new Error('Email with @ez.works domain is not allowed'));
    
    const submitButton = screen.getByText('Contact Me');
    fireEvent.click(submitButton);

    expect(await screen.findByText('Email with @ez.works domain is not allowed')).toBeInTheDocument();
  });

  test('shows success message for valid submission', async () => {
    const input = screen.getByPlaceholderText('Email Address...');
    await userEvent.type(input, 'test@example.com');
    
    uploadComplete.mockResolvedValueOnce({ message: 'Form Submitted' });
    
    const submitButton = screen.getByText('Contact Me');
    fireEvent.click(submitButton);

    expect(await screen.findByText('Form Submitted')).toBeInTheDocument();
    await waitFor(() => {
      expect(input.value).toBe('');  // Input should be cleared after success
    });
  });
});
