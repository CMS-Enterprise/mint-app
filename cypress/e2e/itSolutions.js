import { aliasQuery } from '../support/graphql-test-utils';

describe('The Model Plan IT solutions tracker', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT', role: 'MINT_USER_NONPROD' });

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

  it('completes a Model Plan IT solutions tracker', () => {
    cy.clickPlanTableByName('Empty Plan');

    // Enter into op eval and learning and answer helpdesk op needs question
    cy.get('[data-testid="ops-eval-and-learning"]').clickEnabled();

    cy.get('#ops-eval-and-learning-help-desk-use-true')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.contains('button', 'Save and return to task list').clickEnabled();

    cy.get('[data-testid="ops-eval-and-learning"]').clickEnabled();

    cy.get('#ops-eval-and-learning-help-desk-use-warning')
      .should('be.visible')
      .clickEnabled();

    // Click into the it solutions tracker for helpdesk op needs
    cy.get('[data-testid="needs-table"] tbody tr')
      .should('have.length', 1)
      .first()
      .within(() => {
        cy.contains('Helpdesk support');
        cy.contains('Not started');
        cy.contains('Select a solution').clickEnabled();
      });

    // Toggle the NeedsQuestionsAndAnswer component to see previously answered question
    cy.get('[data-testid="toggle-need-answer"]').clickEnabled();

    cy.get('[data-testid="need-question"]').contains(
      'Do you plan to use a helpdesk?'
    );

    cy.get('[data-testid="true"]').contains('Yes');

    // Click to add a solution that is not a default
    cy.get('#add-solution-not-listed').clickEnabled();

    // Selecting other to adda custom solution
    cy.get('#it-solutions-key').select('Other');
    cy.get('#it-solutions-key').contains('Other');

    cy.get('#add-custom-solution-button').clickEnabled();

    // Fill out other custom solution form
    cy.get('#it-solution-custom-name-other')
      .typeEnabled('My custom solution')
      .should('have.value', 'My custom solution');

    cy.get('#it-solution-custom-poc-name')
      .typeEnabled('John Doe')
      .should('have.value', 'John Doe');

    cy.get('#it-solution-custom-poc-email')
      .typeEnabled('j.doe@oddball.io')
      .should('have.value', 'j.doe@oddball.io');

    // Submitting the custom solution
    cy.get('#submit-custom-solution').clickEnabled();

    // Adding the custom solution
    cy.get('#add-solution-details-button').clickEnabled();

    // Adding a few other solutions
    cy.get('#it-solutions-cbosc').as('cbosc').checkEnabled({ force: true });
    cy.get('@cbosc').should('be.checked');

    cy.get('#it-solutions-contractor')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.contains('button', 'Continue').clickEnabled();

    // Filling out solutions details
    cy.get('#solution-must-start-CBOSC')
      .typeEnabled('12/10/2030')
      .should('have.value', '12/10/2030');

    cy.get('#solution-status-CBOSC-AT_RISK')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#solution-must-start-My-custom-solution')
      .typeEnabled('12/10/2030')
      .should('have.value', '12/10/2030');

    cy.get('#solution-status-My-custom-solution-ONBOARDING')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#submit-solutions').clickEnabled();

    // Verifying solutions are added on the IT solutions tracker
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
        cy.contains('View details').clickEnabled();
      });

    // Click button to update existing solutions for the relevant need
    cy.get('[data-testid="update-solutions-link"]').clickEnabled();

    cy.get('[data-testid="alert"]').contains(
      'Adding additional solutions will create new solution pages, and removing a selected solution will delete the corresponding solution page. Tread carefully.'
    );

    // Removing a solution
    cy.get('#it-solutions-contractor')
      .uncheck({ force: true })
      .should('not.be.checked');

    cy.contains('button', 'Continue').clickEnabled();

    cy.get('[data-testid="alert"]').contains(
      'Saving these selections will delete the Contractor solution page/s that is associated with this operational need.'
    );

    cy.get('#submit-solutions').clickEnabled();

    // Add new custom need
    cy.get('[data-testid="add-new-operational-need"]').clickEnabled();

    cy.get('button')
      .contains('Save without adding a solution')
      .should('be.disabled');

    cy.get('[data-testid="it-solution-custom-name-other"]')
      .typeEnabled('My custom need')
      .should('have.value', 'My custom need');

    cy.get('button')
      .contains('Save without adding a solution')
      .should('not.be.disabled');

    // Submit need
    cy.get('#submit-custom-solution').clickEnabled();

    cy.get('#it-solutions-key')
      .should('not.be.disabled')
      .select('Cross-model contract')
      .should('have.value', 'CROSS_MODEL_CONTRACT');

    cy.get('[data-testid="add-solution-details-button"]').clickEnabled();

    cy.get('span').contains(
      'Success! Your operational need “My custom need” and solution are added.'
    );

    // Link document
    // Click to view solution details view
    cy.get('[data-testid="needs-table"] tbody tr')
      .should('have.length', 3)
      .eq(0)
      .within(() => {
        cy.contains('My custom need');
        cy.contains('Cross-model contract');
        cy.contains('View details').clickEnabled();
      });

    cy.contains('button', 'Upload a document').clickEnabled();

    // select document
    cy.get('[data-testid="file-upload-input"]').attachFile('test.pdf');

    // enter the document type
    cy.contains('.usa-radio', 'Concept Paper')
      .find('input')
      .checkEnabled({ force: true });

    cy.get('#document-upload-restricted-true')
      .checkEnabled({ force: true })
      .should('be.checked');

    // click upload button
    cy.get('[data-testid="upload-document"]').clickEnabled();

    cy.get('[data-testid="model-plan-documents-table"] tbody tr')
      .should('have.length', 1)
      .eq(0)
      .within(() => {
        cy.contains('test.pdf');
      });

    cy.get('#link-documents').clickEnabled();

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
      .clickEnabled();

    cy.get('[data-testid="model-plan-documents-table"] tbody tr').should(
      'have.length',
      0
    );

    // Adding Subtasks
    cy.contains('button', 'Add subtasks').clickEnabled();

    cy.get('[data-testid="add-subtask--0"]').within(() => {
      cy.get('#subtask-name--0').as('subtask');
      cy.get('@subtask').should('not.be.disabled');
      cy.get('@subtask').typeEnabled('First Subtasks');
      cy.get('@subtask').should('have.value', 'First Subtasks');

      cy.contains('label', 'In progress').clickEnabled();
    });

    cy.contains('button', 'Add another subtask').clickEnabled();

    cy.get('[data-testid="add-subtask--1"]').within(() => {
      cy.get('#subtask-name--1').as('subtask1');
      cy.get('@subtask1').should('not.be.disabled');
      cy.get('@subtask1').typeEnabled('Second Subtasks');
      cy.get('@subtask1').should('have.value', 'Second Subtasks');

      cy.contains('label', 'Done').clickEnabled();
    });

    cy.get('#submit-subtasks').clickEnabled();

    cy.get('.usa-alert__text').contains(
      'Success! Your subtasks have been added.'
    );

    cy.get('[data-testid="todo"] ul').should('have.length', 0);

    cy.get('[data-testid="inProgress"] ul').should('have.length', 1);

    cy.get('[data-testid="done"] ul').should('have.length', 1);

    // Manage Subtasks
    cy.contains('button', 'Manage subtasks').clickEnabled();

    cy.contains('First Subtasks')
      .parents('.border-bottom.border-base-light')
      .within(() => {
        cy.contains('button', 'Remove this subtask').clickEnabled();
      });

    cy.contains('button', 'Remove subtask').clickEnabled();

    cy.get('.usa-alert__text').contains(
      'Success! First Subtasks has been removed.'
    );

    cy.contains('button', 'Add another subtask').clickEnabled();

    cy.get('[data-testid="add-subtask--0"]').within(() => {
      cy.get('#subtask-name--0').as('subtask0');
      cy.get('@subtask0').typeEnabled('This should be in To Do column');
      cy.get('@subtask0').should(
        'have.value',
        'This should be in To Do column'
      );
    });

    cy.get('#submit-subtasks').clickEnabled();

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
