Feature: Delete a user

    Background: Existing user
        Given user profile data
            | email              | country | street      | postalCode |
            | john.doe@gmail.com | England | Road Avenue | 29145      |
        When I send a request to create a user

    Scenario: I can delete a user
        Given I send a request to delete my user
        Then I cannot see my user in a list of all users
