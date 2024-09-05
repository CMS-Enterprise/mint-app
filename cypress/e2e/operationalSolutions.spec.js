import { aliasQuery } from '../support/graphql-test-utils';
import verifyStatus from '../support/verifyRequestStatus';

describe('The Model Plan Operational solutions tracker', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT' });
    cy.visit('/');

    cy.intercept('POST', '/api/graph/query', req => {
      aliasQuery(req, 'GetOpsEvalAndLearning');
      aliasQuery(req, 'GetOperationalNeeds');
      aliasQuery(req, 'GetOperationalNeed');
      aliasQuery(req, 'GetOperationalNeedAnswer');
      aliasQuery(req, 'GetPossibleOperationalSolutions');
      aliasQuery(req, 'GetOperationalSolution');
      aliasQuery(req, 'GetModelPlanDocuments');
    });
  });

  it('completes a Model Plan Operational solutions tracker', () => {
    cy.enterModelPlanTaskList('Empty Plan');

    // Enter into op eval and learning and answer helpdesk op needs question
    cy.get('[data-testid="ops-eval-and-learning"]').click();

    cy.wait('@GetOpsEvalAndLearning')
      .its('response.statusCode')
      .should('eq', 200)
      .wait(250);

    cy.get('#ops-eval-and-learning-help-desk-use-true')
      .check({ force: true })
      .check({ force: true })
      .should('be.checked');

    cy.contains('button', 'Save and return to task list').click();

    cy.get('[data-testid="ops-eval-and-learning"]').click();

    cy.wait('@GetOpsEvalAndLearning')
      .its('response.statusCode')
      .should('eq', 200)
      .wait(250);

    cy.get('#ops-eval-and-learning-help-desk-use-warning')
      .should('be.visible')
      .click();

    cy.wait('@GetOperationalNeeds')
      .its('response.statusCode')
      .should('eq', 200)
      .wait(250);

    // Click into the operational solutions tracker for helpdesk op needs
    cy.get('[data-testid="needs-table"] tbody tr')
      .should('have.length', 1)
      .first()
      .within(() => {
        cy.contains('Helpdesk support');
        cy.contains('Not started');
        cy.contains('Select a solution').click();
      });

    cy.wait(['@GetOperationalNeed', '@GetOperationalNeedAnswer'])
      .then(verifyStatus)
      .wait(250);

    // Toggle the NeedsQuestionsAndAnswer component to see previously answered question
    cy.get('[data-testid="toggle-need-answer"]').click();

    cy.get('[data-testid="need-question"]').contains(
      'Do you plan to use a helpdesk?'
    );

    cy.get('[data-testid="true"]').contains('Yes');

    // Click to add a solution that is not a default
    cy.get('#add-solution-not-listed').click();

    cy.wait([
      '@GetOperationalNeed',
      '@GetOperationalNeedAnswer',
      '@GetPossibleOperationalSolutions'
    ])
      .then(verifyStatus)
      .wait(250);

    // Selecting other to adda custom solution

    cy.get('[data-testid="combo-box-input"]').type('other{enter}');

    cy.clickOutside();

    cy.get('[data-testid="combo-box-input"]').should('have.value', 'Other');

    cy.get('#add-custom-solution-button').should('not.be.disabled').click();

    cy.wait(['@GetOperationalNeed', '@GetOperationalNeedAnswer'])
      .then(verifyStatus)
      .wait(250);

    // Fill out other custom solution form
    cy.get('#it-solution-custom-name-other')
      .type('My custom solution')
      .should('have.value', 'My custom solution');

    cy.get('#it-solution-custom-poc-name')
      .type('John Doe')
      .should('have.value', 'John Doe');

    cy.get('#it-solution-custom-poc-email')
      .type('j.doe@oddball.io')
      .should('have.value', 'j.doe@oddball.io');

    // Submitting the custom solution
    cy.get('#submit-custom-solution').should('not.be.disabled').click();

    cy.wait(['@GetOperationalNeed', '@GetOperationalNeedAnswer'])
      .then(verifyStatus)
      .wait(250);

    // Adding a few other solutions
    cy.get('[id^=it-solutions-cbosc').as('cbosc').check({ force: true });
    cy.get('@cbosc').should('be.checked');

    cy.get('[id^=it-solutions-contractor')
      .as('contractor')
      .check({ force: true });
    cy.get('@contractor').should('be.checked');

    cy.get('[id^=it-solutions-my-custom-solution')
      .check({ force: true })
      .should('be.checked');

    cy.contains('button', 'Continue').should('not.be.disabled').click();

    cy.wait(['@GetOperationalNeed', '@GetOperationalNeedAnswer'])
      .then(verifyStatus)
      .wait(250);

    // Filling out solutions details
    cy.get('#solution-must-start-CBOSC')
      .type('12/10/2030')
      .should('have.value', '12/10/2030');

    cy.get('#solution-status-CBOSC-AT_RISK')
      .check({ force: true })
      .should('be.checked');

    cy.get('#solution-must-start-My-custom-solution')
      .type('12/10/2030')
      .should('have.value', '12/10/2030');

    cy.get('#solution-status-My-custom-solution-ONBOARDING')
      .check({ force: true })
      .should('be.checked');

    cy.get('#submit-solutions').should('not.be.disabled').click();

    cy.wait('@GetOperationalNeeds')
      .its('response.statusCode')
      .should('eq', 200)
      .wait(250);

    // Verifying solutions are added on the Operational solutions tracker
    cy.get('[data-testid="needs-table"] tbody tr')
      .should('have.length', 3)
      .first()
      .within(() => {
        cy.contains('Helpdesk support');
        cy.contains('My custom solution');
      });

    // Click to view solution details view
    cy.get('[data-testid="needs-table"] tbody tr')
      .should('have.length', 3)
      .eq(2)
      .within(() => {
        cy.contains('Helpdesk support');
        cy.contains('Consolidated Business Operations Support Center (CBOSC)');
        cy.contains('View details').click();
      });

    cy.wait([
      '@GetOperationalNeed',
      '@GetOperationalNeedAnswer',
      '@GetOperationalSolution'
    ])
      .then(verifyStatus)
      .wait(250);

    // Click button to update existing solutions for the relevant need
    cy.get('[data-testid="update-solutions-link"]').click();

    cy.wait(['@GetOperationalNeed', '@GetOperationalNeedAnswer'])
      .then(verifyStatus)
      .wait(250);
    cy.get('[data-testid="alert"]').contains(
      'Adding additional solutions will create new solution pages, and removing a selected solution will delete the corresponding solution page. Tread carefully.'
    );

    // Removing a solution
    cy.get('[id^=it-solutions-contractor')
      .uncheck({ force: true })
      .should('not.be.checked');

    cy.contains('button', 'Continue').should('not.be.disabled').click();

    cy.wait(['@GetOperationalNeed', '@GetOperationalNeedAnswer'])
      .then(verifyStatus)
      .wait(250);

    cy.get('[data-testid="alert"]').contains(
      'Saving these selections will delete the following solution page(s) associated with this operational need:'
    );

    cy.get('#submit-solutions').should('not.be.disabled').click();

    cy.wait('@GetOperationalNeeds')
      .its('response.statusCode')
      .should('eq', 200)
      .wait(250);

    // Add new custom need
    cy.get('[data-testid="add-new-operational-need"]').click();

    cy.get('button')
      .contains('Save without adding a solution')
      .should('be.disabled');

    cy.get('[data-testid="it-solution-custom-name-other"]')
      .type('My custom need')
      .should('have.value', 'My custom need');

    cy.get('button')
      .contains('Save without adding a solution')
      .should('not.be.disabled');

    // Submit need
    cy.get('#submit-custom-solution').should('not.be.disabled').click();

    cy.wait(['@GetOperationalNeed', '@GetPossibleOperationalSolutions'])
      .then(verifyStatus)
      .wait(250);

    cy.get('[data-testid="combo-box-input"]').type(
      'Cross-model contract{enter}'
    );

    cy.clickOutside();

    cy.get('[data-testid="combo-box-input"]').should(
      'have.value',
      'Cross-model contract'
    );

    cy.get('button#add-solution-details-button')
      .contains('Add solution')
      .should('not.be.disabled')
      .click();

    cy.wait('@GetOperationalNeed')
      .its('response.statusCode')
      .should('eq', 200)
      .wait(250);

    cy.contains('button', 'Continue').should('not.be.disabled').click();

    cy.wait('@GetOperationalNeed')
      .its('response.statusCode')
      .should('eq', 200)
      .wait(250);

    cy.get('#submit-solutions').should('not.be.disabled').click();

    cy.wait('@GetOperationalNeeds')
      .its('response.statusCode')
      .should('eq', 200)
      .wait(250);

    cy.get('span').contains('Success! Solutions added for My custom need');

    // Link document
    // Click to view solution details view
    cy.get('[data-testid="needs-table"] tbody tr')
      .should('have.length', 3)
      .eq(2)
      .within(() => {
        cy.contains('My custom need');
        cy.contains('Cross-model contract');
        cy.contains('View details').click();
      });

    cy.wait(['@GetOperationalNeed', '@GetOperationalSolution'])
      .then(verifyStatus)
      .wait(250);

    cy.contains('button', 'Add a new document')
      .should('not.be.disabled')
      .click();

    // select document
    cy.get('[data-testid="file-upload-input"]').attachFile('test.pdf');

    // enter the document type
    cy.contains('.usa-radio', 'Concept Paper')
      .find('input')
      .check({ force: true });

    cy.get('#document-upload-restricted-true')
      .check({ force: true })
      .should('be.checked');

    // click upload button
    cy.get('[data-testid="upload-document"]').should('not.be.disabled').click();

    cy.wait('@GetOperationalNeed')
      .its('response.statusCode')
      .should('eq', 200)
      .wait(250);

    cy.get('[data-testid="model-plan-documents-table"] tbody tr')
      .should('have.length', 1)
      .eq(0)
      .within(() => {
        cy.contains('test.pdf');
      });

    cy.get('#link-documents').should('not.be.disabled').click();

    cy.wait([
      '@GetOperationalNeed',
      '@GetOperationalSolution',
      '@GetModelPlanDocuments'
    ])
      .then(verifyStatus)
      .wait(250);

    cy.get('[data-testid="model-plan-documents-table"] tbody tr')
      .should('have.length', 1)
      .eq(0)
      .within(() => {
        cy.contains('test.pdf');
        cy.get('[type="checkbox"]').should('be.checked');
        cy.get('[type="checkbox"]').uncheck({ force: true });
      });

    cy.get('[data-testid="link-documents-button"]')
      .should('not.be.disabled')
      .click();

    cy.wait(['@GetOperationalNeed', '@GetOperationalSolution'])
      .then(verifyStatus)
      .wait(250);

    cy.get('[data-testid="model-plan-documents-table"] tbody tr').should(
      'have.length',
      0
    );

    // Adding Subtasks
    cy.contains('button', 'Add subtasks').should('not.be.disabled').click();

    cy.wait(['@GetOperationalNeed', '@GetOperationalSolution'])
      .then(verifyStatus)
      .wait(250);

    cy.get('[data-testid="add-subtask--0"]').within(() => {
      cy.get('#subtask-name--0').as('subtask');
      cy.get('@subtask').should('not.be.disabled');
      cy.get('@subtask').type('First Subtasks');
      cy.get('@subtask').should('have.value', 'First Subtasks');

      cy.contains('label', 'In progress').click();
    });

    cy.contains('button', 'Add another subtask').click();

    cy.get('[data-testid="add-subtask--1"]').within(() => {
      cy.get('#subtask-name--1').as('subtask1');
      cy.get('@subtask1').should('not.be.disabled');
      cy.get('@subtask1').type('Second Subtasks');
      cy.get('@subtask1').should('have.value', 'Second Subtasks');

      cy.contains('label', 'Done').click();
    });

    cy.get('#submit-subtasks').should('not.be.disabled').click();

    cy.wait(['@GetOperationalNeed', '@GetOperationalSolution'])
      .then(verifyStatus)
      .wait(250);

    cy.get('[data-testid="success-subtask-alert"]').contains(
      'Success! Your subtasks have been added.'
    );

    cy.get('[data-testid="todo"] ul').should('have.length', 0);

    cy.get('[data-testid="inProgress"] ul').should('have.length', 1);

    cy.get('[data-testid="done"] ul').should('have.length', 1);

    // Manage Subtasks
    cy.contains('button', 'Manage subtasks').click();

    cy.wait(['@GetOperationalNeed', '@GetOperationalSolution'])
      .then(verifyStatus)
      .wait(250);

    cy.contains('First Subtasks')
      .parents('.border-bottom.border-base-light')
      .within(() => {
        cy.contains('button', 'Remove this subtask').click();
      });

    cy.contains('button', 'Remove subtask').click();

    cy.wait('@GetOperationalSolution')
      .its('response.statusCode')
      .should('eq', 200)
      .wait(250);

    cy.get('.usa-alert__text').contains(
      'Success! First Subtasks has been removed.'
    );

    cy.contains('button', 'Add another subtask')
      .should('not.be.disabled')
      .click();

    cy.get('[data-testid="add-subtask--0"]').within(() => {
      cy.get('#subtask-name--0').as('subtask0');
      cy.get('@subtask0').type('This should be in To Do column');
      cy.get('@subtask0').should(
        'have.value',
        'This should be in To Do column'
      );
    });

    cy.get('#submit-subtasks').should('not.be.disabled').click();

    cy.wait(['@GetOperationalNeed', '@GetOperationalSolution'])
      .then(verifyStatus)
      .wait(250);

    cy.get('.usa-alert__text').contains(
      'Success! Your subtasks have been added.'
    );

    cy.get('[data-testid="todo"] ul').should('have.length', 1);

    cy.get('[data-testid="todo"] ul')
      .find('li')
      .first()
      .should('include.text', 'This should be in To Do column');

    cy.get('[data-testid="inProgress"] ul').should('have.length', 0);

    cy.get('[data-testid="done"] ul').should('have.length', 1);
  });
});
