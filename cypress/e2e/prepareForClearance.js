import { aliasQuery } from '../support/graphql-test-utils';

describe('The Model Plan Prepare for Clearance Form', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT', role: 'MINT_USER_NONPROD' });

    cy.intercept('POST', '/api/graph/query', req => {
      aliasQuery(req, 'GetModelPlan');
      aliasQuery(req, 'GetClearanceStatuses');
      aliasQuery(req, 'GetAllBasics');
      aliasQuery(req, 'GetAllParticipants');
      aliasQuery(req, 'GetAllOpsEvalAndLearning');
    });
  });

  it('completes a Model Plan Prepare for clearance form', () => {
    cy.clickPlanTableByName('Plan with Basics');

    cy.get('[data-testid="task-list-intake-form-prepareForClearance"]').within(
      () => {
        cy.get('[data-testid="tasklist-tag"]').contains('Ready');
      }
    );

    cy.get('[data-testid="prepare-for-clearance"]').clickEnabled();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(
        /\/models\/.{36}\/task-list\/prepare-for-clearance/
      );
    });

    // Basics Clearance Check

    cy.get('[data-testid="clearance-basics"]').clickEnabled();

    cy.get('#prepare-for-clearance-basics').should('be.checked');

    cy.get('[data-testid="dont-update-clearance"]').clickEnabled();

    cy.get('[data-testid="task-list-intake-form-prepareForClearance"]').within(
      () => {
        cy.get('[data-testid="tasklist-tag"]').contains('In progress');
      }
    );

    cy.get('[data-testid="prepare-for-clearance"]').clickEnabled();

    // General Characteristics Clearance Check
    cy.get('#prepare-for-clearance-generalCharacteristics')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('[data-testid="update-clearance"]').clickEnabled();

    cy.get('[data-testid="prepare-for-clearance"]').clickEnabled();

    cy.get('#prepare-for-clearance-generalCharacteristics').should(
      'be.checked'
    );

    // Participants and Providers Clearance Check

    cy.get('[data-testid="clearance-participantsAndProviders"]').clickEnabled();

    cy.get('#prepare-for-clearance-participantsAndProviders').should(
      'be.checked'
    );

    // Beneficiaries Clearance Check
    cy.get('#prepare-for-clearance-beneficiaries')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('[data-testid="update-clearance"]').clickEnabled();

    cy.get('[data-testid="prepare-for-clearance"]').clickEnabled();

    cy.get('#prepare-for-clearance-beneficiaries').should('be.checked');

    // Ops Eval and Learning Clearance Check
    cy.get('[data-testid="clearance-opsEvalAndLearning"]').clickEnabled();

    cy.get('[data-testid="mark-task-list-for-clearance"]').clickEnabled();

    cy.get('#prepare-for-clearance-opsEvalAndLearning').should('be.checked');

    // Payment Clearance Check
    cy.get('#prepare-for-clearance-payments')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('[data-testid="update-clearance"]').clickEnabled();

    cy.get('[data-testid="prepare-for-clearance"]').clickEnabled();

    cy.get('#prepare-for-clearance-payments').should('be.checked');

    cy.get('[data-testid="update-clearance"]').clickEnabled();

    // Task List Check

    cy.get('[data-testid="task-list-intake-form-prepareForClearance"]').within(
      () => {
        cy.get('[data-testid="tasklist-tag"]').contains('Ready for clearance');
      }
    );
  });
});
