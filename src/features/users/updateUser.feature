@updateUser @cleanupUser
Feature: User Update

  Scenario: Create and update a user
    Given I have created a new user
    When I update the user's details
    Then I should see the updated user details
