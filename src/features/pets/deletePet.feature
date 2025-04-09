 @deletePet @autoCreatePet
Feature: Delete Pet
  
  Scenario: Successfully delete an existing pet
    Given I have an existing pet for deletion
    When I send a request to delete the pet
    Then the response should indicate successful deletion
    And the pet should no longer exist in the system