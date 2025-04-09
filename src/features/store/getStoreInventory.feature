@getinventory
Feature: Get store inventory

  Scenario: Retrieve store inventory
    When a GET request is sent to "store/inventory"
    Then the response status should be 200
    And the response body should contain the inventory list



