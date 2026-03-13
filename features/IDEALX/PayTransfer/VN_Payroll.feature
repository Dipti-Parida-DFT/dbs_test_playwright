Feature: VN Payroll
  Validate Payroll behaviour for Vietnam region

  Background:
    Given the user is authenticated and on the Pay & Transfer menu

  Scenario: Cannot create Payroll with item amount > 500000000 VND
    When the user opens Payroll form and adds a new payee
    And sets an amount greater than the allowed maximum
    Then an inline error and a banner error should be shown

  Scenario: Create Payroll with item amount equal to 500000000 VND
    When the user opens Payroll form and adds a new payee
    And sets an amount equal to the maximum and submits
    Then the payment should be created and retrievable by reference

  Scenario: Create payroll with Total amount > 500000000 IDR
    When the user composes a payroll with multiple items that exceed the total limit
    Then the payment should be submitted and visible in Transfer Center
