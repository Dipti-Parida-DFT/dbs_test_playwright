Feature: VN Bulk Payment
  Bulk Payment flows for Vietnam

  Background:
    Given the user is authenticated and on the Pay & Transfer menu

  Scenario: Cannot create Bulk Payment with item amount > 500000000 VND
    When the user opens Bulk Payment form and adds a new payee with amount above limit
    Then inline and banner error messages should be displayed

  Scenario: Create Bulk Payment with item amount equal to 500000000 VND
    When the user opens Bulk Payment form and adds a new payee with amount equal to max and submits
    Then the submitted payment can be searched by reference and validated

  Scenario: Create Bulk Payment with Total amount > 500000000 IDR
    When the user adds multiple payees so total exceeds the limit and submits
    Then the submitted payment should be retrievable and validated
