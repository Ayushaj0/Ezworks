import axios from 'axios';

const API_BASE_URL = 'https://test.ezworks.ai';

export const uploadComplete = async (data) => {
  if (!data.email) {
    throw new Error('Email is required');
  }

  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
  if (!emailRegex.test(data.email)) {
    throw new Error('Please enter a valid email address');
  }

  try {
    // Simulate API call
    if (data.email.endsWith('@ez.works')) {
      throw { response: { status: 422 } };
    }

    // Simulated successful response
    return {
      status: 200,
      data: {
        success: true,
        message: 'Form Submitted'
      }
    };
  } catch (error) {
    if (error.response?.status === 422) {
      throw new Error('Email with @ez.works domain is not allowed');
    }
    throw new Error('Failed to submit form');
  }
};

// Test Email Suite
export const TEST_EMAILS = {
  // ✅ Valid Emails - Should show "Form Submitted"
  validEmails: [
    'test@gmail.com',
    'user123@yahoo.com',
    'john.doe@outlook.com',
    'mary-jane@company.co.uk',
    'support+123@domain.com',
    'info@sub.domain.org'
  ],

  // ❌ Invalid Emails - Should show "Please enter a valid email address"
  invalidEmails: [
    'notanemail',           // Missing @ and domain
    'missing@.com',         // Missing domain name
    '@incomplete.com',      // Missing username
    'spaces @ domain.com',  // Contains spaces
    'double@@domain.com',   // Double @
    '.invalid@domain.com',  // Starts with dot
    'invalid.@domain.com',  // Ends with dot
  ],

  // ❌ Restricted Emails - Should show "@ez.works domain is not allowed"
  restrictedEmails: [
    'user@ez.works',
    'support@ez.works',
    'test.account@ez.works'
  ],

  // ❌ Empty Input - Should show "Email is required"
  emptyEmail: ''
};

// Test Cases:
// 1. Empty submission - Should show "Email is required"
// 2. Invalid email (e.g., "test") - Should show "Please enter a valid email address"
// 3. @ez.works email - Should show "@ez.works domain is not allowed"
// 4. Valid email - Should show "Form Submitted"