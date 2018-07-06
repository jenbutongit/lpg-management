Feature: Login
  In order to login
  As an authenticated user
  I want to be directed to the home page

  Scenario:
    Given I am not authenticated
    When I request the home page
    Then I am redirected to the login page
