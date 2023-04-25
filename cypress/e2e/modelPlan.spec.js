import { aliasQuery } from '../support/graphql-test-utils';

describe('The Model Plan Form', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT', role: 'MINT_USER_NONPROD' });

    cy.intercept('POST', '/api/graph/query', req => {
      aliasQuery(req, 'GetModelPlan');
      aliasQuery(req, 'GetIsCollaborator');
      aliasQuery(req, 'GetModelPlanBase');
      aliasQuery(req, 'GetModelCollaborators');
      aliasQuery(req, 'GetModelPlanInfo');
      aliasQuery(req, 'GetBasics');
      aliasQuery(req, 'GetMilestones');
      aliasQuery(req, 'GetAllModelPlans');
    });
  });

  it('fills out model plan name and creates plan', () => {
    cy.visit('/');

    cy.contains('a', 'Start a new Model Plan').clickEnabled();
    cy.contains('h1', 'Start a new model plan');
    cy.get('[data-testid="continue-link"]').clickEnabled();

    // General Model Plan Information

    cy.get('#new-plan-model-name')
      .typeEnabled('My New Model Plan')
      .should('have.value', 'My New Model Plan');

    cy.contains('button', 'Next').clickEnabled();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/models\/.{36}\/collaborators/);
    });

    cy.get('[data-testid="continue-to-tasklist"]').clickEnabled();

    cy.contains('h1', 'Model Plan task list');

    // renames a model plan
    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/models\/.{36}\/task-list/);
    });

    cy.contains('h3', 'Model basics');

    cy.contains('button', 'Start').clickEnabled();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/models\/.{36}\/task-list\/basics/);
    });

    cy.get('#plan-basics-model-name')
      .clear()
      .typeEnabled('Renamed Model Plan Name')
      .should('have.value', 'Renamed Model Plan Name');

    cy.contains('button', 'Save and return to task list').clickEnabled();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/models\/.{36}\/task-list/);
    });

    cy.get('[data-testid="model-plan-name"]').contains(
      'p',
      'Renamed Model Plan Name'
    );

    cy.get('[data-testid="basics"]').clickEnabled();

    cy.get('#plan-basics-model-category').select('Demonstration');

    cy.get('#plan-basics-model-category').contains('Demonstration');

    cy.get('#new-plan-cmsCenters-CENTER_FOR_MEDICARE')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.contains('button', 'Next').clickEnabled();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(
        /\/models\/.{36}\/task-list\/basics\/overview/
      );
    });

    cy.get('#ModelType-Voluntary')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#ModelType-Problem')
      .first()
      .typeEnabled('The problem')
      .should('have.value', 'The problem');

    cy.get('#ModelType-Goal')
      .first()
      .typeEnabled('The goal')
      .should('have.value', 'The goal');

    cy.get('#ModelType-testInterventions')
      .first()
      .typeEnabled('The interventions')
      .should('have.value', 'The interventions');

    cy.contains('button', 'Next').clickEnabled();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(
        /\/models\/.{36}\/task-list\/basics\/milestones/
      );
    });

    cy.contains('h3', 'Anticipated high level timeline');

    cy.get('#Milestone-completeICIP')
      .typeEnabled('05/23/2025')
      .should('have.value', '05/23/2025');

    cy.get('#Milestone-clearanceStarts')
      .typeEnabled('05/23/2025')
      .should('have.value', '05/23/2025');

    cy.get('#Milestone-clearanceEnds')
      .typeEnabled('05/23/2025')
      .should('have.value', '05/23/2025');

    cy.get('#Milestone-announced')
      .typeEnabled('05/23/2025')
      .should('have.value', '05/23/2025');

    cy.get('#Milestone-applicationsStart')
      .typeEnabled('05/23/2025')
      .should('have.value', '05/23/2025');

    cy.get('#Milestone-applicationsEnd')
      .typeEnabled('05/23/2025')
      .should('have.value', '05/23/2025');

    cy.get('#Milestone-performancePeriodStarts')
      .typeEnabled('05/23/2025')
      .should('have.value', '05/23/2025');

    cy.get('#Milestone-performancePeriodEnds')
      .typeEnabled('05/23/2025')
      .should('have.value', '05/23/2025');

    cy.get('#Milestone-wrapUpEnds')
      .typeEnabled('05/23/2025')
      .should('have.value', '05/23/2025');

    cy.get('#phasedIn-Yes')
      .first()
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.contains('button', 'Save and return to task list').clickEnabled();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/models\/.{36}\/task-list/);
    });

    cy.get('.model-plan-task-list__last-updated-status').should('be.visible');

    cy.get('[data-testid="tasklist-tag"]').first().contains('In progress');

    // updates model plan status

    cy.get('.mint-tag').contains('Draft model plan');

    cy.contains('a', 'Update').clickEnabled();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/models\/.{36}\/status/);
    });

    cy.contains('h1', 'Update status');

    cy.get('[data-testid="button"]')
      .contains('Update status')
      .should('be.disabled');

    cy.get('#Status-Dropdown')
      .select('Cleared')
      .should('have.value', 'CLEARED');

    cy.get('[data-testid="button"]')
      .contains('Update status')
      .should('be.not.disabled')
      .clickEnabled();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/models\/.{36}\/task-list/);
    });

    cy.get('.mint-tag').contains('Cleared');

    // favorites and unfavorites a model plan
    cy.visit('/models');

    cy.contains('tr', 'Empty Plan').get('[data-cy="favorited"]');

    cy.contains('tr', 'Empty Plan')
      .get('[data-testid="Empty Plan-favorite"]')
      .clickEnabled();

    cy.contains('tr', 'Empty Plan').get('[data-cy="unfavorited"]');
  });
});
