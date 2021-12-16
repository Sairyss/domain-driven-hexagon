# This is a Gherkin feature file https://cucumber.io/docs/gherkin/reference/

Feature: Create a user

Scenario: Creating a user happy path
    Given that my email is "john.doe@gmail.com"
    And my country is "England", my postal code is "29145" and my street is "Road Avenue"
    When I send a request to create a user
    Then I receive my user ID
    And I can see my user in a list of all users