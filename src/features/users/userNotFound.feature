@usernotfound
Feature: Check if user does not exist

  Scenario: Try to fetch a non-existent user
    Given I want to check if a user does not exist
    When I send a request to fetch the non-existent user
    Then I should receive a 404 error with 'User not found' message
