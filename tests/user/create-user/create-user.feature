# This is a Gherkin feature file https://cucumber.io/docs/gherkin/reference/

Feature: Create a user

    Scenario: I can create a user
        Given user profile data
            | email              | country | street      | postalCode |
            | john.doe@gmail.com | England | Road Avenue | 29145      |
        When I send a request to create a user
        Then I receive my user ID
        And I can see my user in a list of all users

    Scenario Outline: I try to create a user with invalid data
        Given user profile data
            | email   | country   | street   | postalCode   |
            | <Email> | <Country> | <Street> | <PostalCode> |
        When I send a request to create a user
        Then I receive an error "Bad Request" with status code 400

        Examples:
            | Email          | Country | Street      | PostalCode |
            | johngmail.com  | England | Road Avenue | 29145      |
            | john@gmail.com | 123     | Road Avenue | 29145      |
            | johng@mail.com | England | 123         | 29145      |
            | johng@mail.com | England | Road Avenue | @          |
            | #@!$           | $#@1    | %542        | !321       |