@autoCreatePet @updatePet
Feature: Update Pet Details

  Scenario: Successfully update pet name
    Given I have an existing pet for update
    When I update the pet's "name" to "Lucky"
    Then the pet's "name" should be "Lucky"

