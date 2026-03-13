Feature: Debit Card affiliate gating
  As a user of the Apply page
  I want to ensure affiliates can (or cannot) view the Debit Card section

  Background:
    Given the application is reachable

  Scenario: SG affiliate can view Debit Card section
    Given an SG affiliate is logged in
    When they navigate to the Apply page
    Then the Debit Card section should be visible

  Scenario: Non-SG affiliate cannot view Debit Card section
    Given a non-SG affiliate is logged in
    When they authenticate and navigate to the Apply page
    Then the Debit Card section should not be visible
