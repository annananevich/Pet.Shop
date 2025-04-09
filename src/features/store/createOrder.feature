@createOrder @autoCreatePet @cleanupOrder @cleanupPet
Feature: Create a new order for purchasing a pet

  Scenario: Place an order successfully
    Given a new order with quantity 1, and status "cool"
    When a POST request is sent to "store/order" with the order details
    Then the response status for order creation should be 200
    And the response body should contain the order ID, petId, quantity, and status
    And the response body status should be "cool"
    And the response body should have complete set to true
    And the created order should be retrievable
    

