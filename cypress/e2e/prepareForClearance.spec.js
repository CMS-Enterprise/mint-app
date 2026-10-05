import { aliasQuery } from '../support/graphql-test-utils';
import verifyStatus from '../support/verifyRequestStatus';

const openPrepareForClearanceFromTasks = () => {
  cy.contains('h3', 'Prepare for clearance')
    .closest('.collaboration-area__card')
    .contains('button', /Start|Continue/)
    .click({ force: true });

  cy.wait('@GetClearanceStatuses')
    .its('response.statusCode')
    .should('eq', 200)
    .wait(500);

  cy.location().should(loc => {
    expect(loc.pathname).to.match(
      /\/models\/.{36}\/collaboration-area\/prepare-for-clearance/
    );
  });
};

describe('The Model Plan Prepare for Clearance Form', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT' });
    cy.visit('/');

    cy.intercept('POST', '/api/graph/query', req => {
      aliasQuery(req, 'GetCollaborationArea');
      aliasQuery(req, 'GetClearanceStatuses');
      aliasQuery(req, 'GetAllBasics');
      aliasQuery(req, 'GetTimeline');
      aliasQuery(req, 'GetAllParticipantsAndProviders');
      aliasQuery(req, 'GetAllOpsEvalAndLearning');
    });
  });

  it('completes a Model Plan Prepare for clearance form', () => {
    cy.visit('/');
    cy.get('.model-plan-table button[aria-label="Page 2"]').click();
    cy.get('[data-testid="table"] a').contains('Plan with Timeline').click();
    cy.url().should('include', '/collaboration-area');
    cy.get('[data-testid="page-loading"]').should('not.exist');

    cy.contains('button', /See all \(\d+\)/).click();
    cy.url().should('include', '/collaboration-area/tasks');
    cy.get('[data-testid="tasks-page"]').should('be.visible');

    openPrepareForClearanceFromTasks();

    // Timeline Clearance Check
    cy.get('[data-testid="clearance-timeline"]').click({ force: true });

    cy.wait(['@GetClearanceStatuses', '@GetTimeline'])
      .then(verifyStatus)
      .wait(500);

    cy.get('[data-testid="mark-task-list-for-clearance"]').click({
      force: true
    });

    // Basics Clearance Check
    cy.get('[data-testid="clearance-basics"]').click({ force: true });

    cy.wait(['@GetClearanceStatuses', '@GetAllBasics'])
      .then(verifyStatus)
      .wait(500);

    cy.get('[data-testid="mark-task-list-for-clearance"]').click({
      force: true
    });

    cy.wait('@GetClearanceStatuses')
      .its('response.statusCode')
      .should('eq', 200)
      .wait(500);

    cy.get('#prepare-for-clearance-basics').should('be.checked');

    cy.get('[data-testid="dont-update-clearance"]').click({ force: true });

    cy.url().should('include', '/collaboration-area/tasks');
    cy.get('[data-testid="tasks-page"]').should('be.visible');

    openPrepareForClearanceFromTasks();

    // General Characteristics Clearance Check
    cy.get('#prepare-for-clearance-generalCharacteristics')
      .check({ force: true })
      .should('be.checked');

    cy.get('[data-testid="update-clearance"]').click({ force: true });

    cy.url().should('include', '/collaboration-area/tasks');
    cy.get('[data-testid="tasks-page"]').should('be.visible');

    openPrepareForClearanceFromTasks();

    cy.get('#prepare-for-clearance-generalCharacteristics').should(
      'be.checked'
    );

    // Participants and providers Clearance Check
    cy.get('[data-testid="clearance-participantsAndProviders"]').click({
      force: true
    });

    cy.wait(['@GetClearanceStatuses', '@GetAllParticipantsAndProviders'])
      .then(verifyStatus)
      .wait(500);

    cy.get('[data-testid="mark-task-list-for-clearance"]').click({
      force: true
    });

    cy.wait('@GetClearanceStatuses')
      .its('response.statusCode')
      .should('eq', 200)
      .wait(500);

    cy.get('#prepare-for-clearance-participantsAndProviders').should(
      'be.checked'
    );

    // Beneficiaries Clearance Check
    cy.get('#prepare-for-clearance-beneficiaries')
      .check({ force: true })
      .should('be.checked');

    cy.get('[data-testid="update-clearance"]').click({ force: true });

    cy.url().should('include', '/collaboration-area/tasks');
    cy.get('[data-testid="tasks-page"]').should('be.visible');

    openPrepareForClearanceFromTasks();

    cy.get('#prepare-for-clearance-beneficiaries').should('be.checked');

    // Ops Eval and Learning Clearance Check
    cy.get('[data-testid="clearance-opsEvalAndLearning"]').click({
      force: true
    });

    cy.wait(['@GetClearanceStatuses', '@GetAllOpsEvalAndLearning'])
      .then(verifyStatus)
      .wait(500);

    cy.get('[data-testid="mark-task-list-for-clearance"]').click({
      force: true
    });

    cy.wait('@GetClearanceStatuses')
      .its('response.statusCode')
      .should('eq', 200)
      .wait(500);

    cy.get('#prepare-for-clearance-opsEvalAndLearning').should('be.checked');

    // Payment Clearance Check
    cy.get('#prepare-for-clearance-payments')
      .check({ force: true })
      .should('be.checked');

    cy.get('[data-testid="update-clearance"]').click({ force: true });

    cy.url().should('include', '/collaboration-area/tasks');
    cy.get('[data-testid="tasks-page"]').should('be.visible');

    // All sections are ready for clearance, so the task moves to Completed.
    cy.get('[data-testid="completed-tab"]').click();
    cy.url().should('include', 'tab=completed');
    cy.contains('h3', 'Prepare for clearance')
      .should('be.visible')
      .closest('.collaboration-area__card')
      .contains('Complete')
      .should('be.visible');
  });
});
