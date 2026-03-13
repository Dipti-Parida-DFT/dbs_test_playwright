Feature: SG Payroll
  Payroll flows for Singapore region

  Background:
    Given the SG user is authenticated and on the Pay & Transfer menu

  Scenario: Create Payroll Alternate with new payee
    When the user creates a payroll alternate with a new payee and submits
    Then the payroll should be available in Transfer Center and its details should match expected values

  Scenario: Edit Payroll Alternate via Transfer Center
    Given an existing payroll has been created
    When the user edits the payroll via Transfer Center and resubmits
    Then the edited payroll should show updated values in Transfer Center
