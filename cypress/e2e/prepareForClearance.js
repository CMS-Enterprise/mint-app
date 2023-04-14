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

    cy.wait('@GetModelPlan').its('response.statusCode').should('eq', 200);

    cy.get('[data-testid="task-list-intake-form-prepareForClearance"]').within(
      () => {
        cy.get('[data-testid="tasklist-tag"]').contains('Ready');
      }
    );

    cy.get('[data-testid="prepare-for-clearance"]').click();

    cy.wait('@GetClearanceStatuses')
      .its('response.statusCode')
      .should('eq', 200);

    cy.location().should(loc => {
      expect(loc.pathname).to.match(
        /\/models\/.{36}\/task-list\/prepare-for-clearance/
      );
    });

    // Basics Clearance Check

    cy.get('[data-testid="clearance-basics"]').click();

    cy.wait('@GetClearanceStatuses')
      .its('response.statusCode')
      .should('eq', 200);

    cy.wait('@GetAllBasics').its('response.statusCode').should('eq', 200);

    cy.get('[data-testid="mark-task-list-for-clearance"]').click();

    cy.wait('@GetClearanceStatuses')
      .its('response.statusCode')
      .should('eq', 200);

    cy.get('#prepare-for-clearance-basics').should('be.checked');

    cy.get('[data-testid="dont-update-clearance"]').click();

    cy.wait('@GetModelPlan').its('response.statusCode').should('eq', 200);

    cy.get('[data-testid="task-list-intake-form-prepareForClearance"]').within(
      () => {
        cy.get('[data-testid="tasklist-tag"]').contains('In progress');
      }
    );

    cy.get('[data-testid="prepare-for-clearance"]').click();

    cy.wait('@GetClearanceStatuses')
      .its('response.statusCode')
      .should('eq', 200);

    // General Characteristics Clearance Check
    cy.get('#prepare-for-clearance-generalCharacteristics')
      .check({ force: true })
      .should('be.checked');

    cy.get('[data-testid="update-clearance"]').click();

    cy.wait('@GetModelPlan').its('response.statusCode').should('eq', 200);

    cy.get('[data-testid="prepare-for-clearance"]').click();

    cy.wait('@GetClearanceStatuses')
      .its('response.statusCode')
      .should('eq', 200);

    cy.get('#prepare-for-clearance-generalCharacteristics').should(
      'be.checked'
    );

    // Participants and Providers Clearance Check

    cy.get('[data-testid="clearance-participantsAndProviders"]').click();

    cy.wait('@GetClearanceStatuses')
      .its('response.statusCode')
      .should('eq', 200);

    cy.wait('@GetAllParticipants').its('response.statusCode').should('eq', 200);

    cy.get('[data-testid="mark-task-list-for-clearance"]').click();

    cy.wait('@GetClearanceStatuses')
      .its('response.statusCode')
      .should('eq', 200);

    cy.get('#prepare-for-clearance-participantsAndProviders').should(
      'be.checked'
    );

    // Beneficiaries Clearance Check
    cy.get('#prepare-for-clearance-beneficiaries')
      .check({ force: true })
      .should('be.checked');

    cy.get('[data-testid="update-clearance"]').click();

    cy.wait('@GetModelPlan').its('response.statusCode').should('eq', 200);

    cy.get('[data-testid="prepare-for-clearance"]').click();

    cy.wait('@GetClearanceStatuses')
      .its('response.statusCode')
      .should('eq', 200);

    cy.get('#prepare-for-clearance-beneficiaries').should('be.checked');

    // Ops Eval and Learning Clearance Check
    cy.get('[data-testid="clearance-opsEvalAndLearning"]').click();

    cy.wait('@GetClearanceStatuses')
      .its('response.statusCode')
      .should('eq', 200);

    cy.wait('@GetAllOpsEvalAndLearning')
      .its('response.statusCode')
      .should('eq', 200);

    cy.get('[data-testid="mark-task-list-for-clearance"]').click();

    cy.wait('@GetClearanceStatuses')
      .its('response.statusCode')
      .should('eq', 200);

    cy.get('#prepare-for-clearance-opsEvalAndLearning').should('be.checked');

    // Payment Clearance Check
    cy.get('#prepare-for-clearance-payments')
      .check({ force: true })
      .should('be.checked');

    cy.get('[data-testid="update-clearance"]').click();

    cy.wait('@GetModelPlan').its('response.statusCode').should('eq', 200);

    cy.get('[data-testid="prepare-for-clearance"]').click();

    cy.wait('@GetClearanceStatuses')
      .its('response.statusCode')
      .should('eq', 200);

    cy.get('#prepare-for-clearance-payments').should('be.checked');

    cy.get('[data-testid="update-clearance"]').click();

    // Task List Check

    cy.wait('@GetModelPlan').its('response.statusCode').should('eq', 200);

    cy.get('[data-testid="task-list-intake-form-prepareForClearance"]').within(
      () => {
        cy.get('[data-testid="tasklist-tag"]').contains('Ready for clearance');
      }
    );
  });
});
