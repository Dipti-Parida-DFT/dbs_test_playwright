Feature: HK Management Payroll
  Management payroll flows for Hong Kong

  Background:
    Given the HK user is authenticated and on the Management Payroll page

  Scenario: Create Management Payroll with new change Account number payee
    When the user creates a management payroll with a new payee and relevant particulars and submits
    Then the created payroll should be searchable in Transfer Center and its details should match expected values
