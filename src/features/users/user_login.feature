@login @cleanupUser
Feature: User Login Flow

  Scenario: Create a user, login, and logout
    Given I create a new user
    When I log in with the new user's credentials
    Then I should be logged in and see a session message
    When I log out
    Then I should be logged out
