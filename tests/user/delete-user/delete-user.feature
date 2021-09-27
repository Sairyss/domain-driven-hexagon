Feature: Delete a user

Scenario: Deleting a user happy path
    Given that my email is "jane.doe@gmail.com", my country is "England", my postal code is "29145" and my street is "Road Avenue"
    And my user is created
    When I send a request to delete my user
    Then I cannot see my user in a list of all users