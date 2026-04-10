/**
 * Centralized test data for payroll payment tests
 */

export const LOGIN_CREDENTIALS = {
  organisationId: 'SG2BFE1',
  userId: 'DBSAUTO0001',
  pin: '123'
};

export const SECURITY_CODE = '123';

export const PAYEE_DATA = {
  name: 'TestPayee01',
  nickname: 'TP01',
  bankId: '001',
  accountNumber: '1234567890123456',
  category: 'Others'
};

export const PAYMENT_DATA = {
  amount: '1000',
  purpose: 'SALA - Salary Payment',
  reference: 'REF001',
  particulars: 'Test payment for payroll',
  messageToPayee: 'Payment received',
  emails: 'test@example.com'
};

export const TRANSACTION_REFERENCES = {
  internalReference: 'PR20260409',
  batchId: '12345'
};

export const ACCOUNT_SELECTION = {
  accountName: '021account',
  fullName: '021account 021account (SGD)'
};

export const UI_TIMEOUTS = {
  DEFAULT_WAIT: 1000,
  DIALOG_WAIT: 2000,
  NAVIGATION_WAIT: 3000,
  NETWORK_WAIT: 5000
};