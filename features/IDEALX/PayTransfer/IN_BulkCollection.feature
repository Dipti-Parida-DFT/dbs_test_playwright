Feature: IN Bulk Collection
  Bulk Collection flows for India

  Background:
    Given the user is authenticated and on the Pay & Transfer menu

  Scenario: Verify creating a Bulk collection with new Payee
    When the user opens Bulk Collection form, adds a new payee and provides optional details and submits
    Then the created Bulk collection should be locatable by reference and its view page fields should match expected values

  Scenario: Verify edit a Bulk Collection via Transfer Center
    Given an existing Bulk collection is available
    When the user edits the collection via Transfer Center and resubmits
    Then the edited collection should reflect the updated values in the view page
