// load type definitions that come with Cypress module
/// <reference types="cypress" />



declare namespace Cypress {
    interface Chainable<Subject> {
      seedModelPlan(options) : Cypress.Chainable<import('./support/seed').ModelPlanSchema>;
    }
  }
