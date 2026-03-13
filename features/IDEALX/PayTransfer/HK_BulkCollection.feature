Feature: HK Bulk Collection
  Bulk Collection flows for Hong Kong

  Background:
    Given the HK user is authenticated and on the Bulk Collection form

  Scenario: Create a Bulk collection with new Payer
    When the user creates a new payer with full details and submits
    Then the created collection should be visible in Transfer Center and pass validation

  Scenario: Create a Bulk collection with Transaction code add 38 and 98
    When the user composes a batch mixing existing and new payers with transaction codes 38 and 98 and submits
    Then the batch should be validated in the view page and removed as part of cleanup
