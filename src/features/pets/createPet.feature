@createMultiplePets @cleanupPet
Feature: Create Multiple Pets

  Scenario: Adding multiple pets using a data table
    Given I create the following pets:
      | name   | category   | status    |
      | Charlie | Dog       | available |
      | Milo    | Cat       | pending   |
      | Ghost   | Wolf      | unknown   |
    When I send requests to add pets
    Then The responses should contain the IDs of the new pets
    When I send requests to retrieve pet information
    Then The responses should contain the pets' details


