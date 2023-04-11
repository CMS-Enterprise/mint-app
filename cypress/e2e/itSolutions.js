describe('The Model Plan IT solutions tracker', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT', role: 'MINT_USER_NONPROD' });
  });

  it('completes a Model Plan IT solutions tracker', () => {
    cy.clickPlanTableByName('Empty Plan');

    // Enter into op eval and learning and answer helpdesk op needs question
    cy.get('[data-testid="ops-eval-and-learning"]').click();

    cy.wait(500);

    cy.get('#ops-eval-and-learning-help-desk-use-true')
      .check({ force: true })
      .should('be.checked');

    cy.contains('button', 'Save and return to task list').click();

    cy.get('[data-testid="ops-eval-and-learning"]').click();

    cy.get('#ops-eval-and-learning-help-desk-use-warning').click();

    cy.wait(500);

    // Click into the it solutions tracker for helpdesk op needs
    cy.get('[data-testid="needs-table"] tbody tr')
      .should('have.length', 1)
      .first()
      .within(() => {
        cy.contains('Helpdesk support');
        cy.contains('Not started');
        cy.contains('Select a solution').click();
      });

    // Toggle the NeedsQuestionsAndAnswer component to see previously answered question
    cy.get('[data-testid="toggle-need-answer"]').click();

    cy.get('[data-testid="need-question"]').contains(
      'Do you plan to use a helpdesk?'
    );

    cy.get('[data-testid="true"]').contains('Yes');

    // Click to add a solution that is not a default
    cy.get('#add-solution-not-listed').click();

    // Selecting other to adda custom solution
    cy.get('#it-solutions-key').select('Other');
    cy.get('#it-solutions-key').contains('Other');

    cy.get('#add-custom-solution-button').click();

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
    cy.get('#submit-custom-solution').click();

    cy.wait(500);

    // Adding the custom solution
    cy.get('#add-solution-details-button').click();

    cy.wait(500);

    // Adding a few other solutions
    cy.get('#it-solutions-cbosc').check({ force: true }).should('be.checked');

    cy.get('#it-solutions-contractor')
      .check({ force: true })
      .should('be.checked');

    cy.contains('button', 'Continue').click();

    cy.wait(500);

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

    cy.get('#submit-solutions').click();

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
        cy.contains('View details').click();
      });

    // Click button to update existing solutions for the relevant need
    cy.get('[data-testid="update-solutions-link"]').click();

    cy.wait(500);

    cy.get('[data-testid="alert"]').contains(
      'Adding additional solutions will create new solution pages, and removing a selected solution will delete the corresponding solution page. Tread carefully.'
    );

    cy.wait(500);

    // Removing a solution
    cy.get('#it-solutions-contractor')
      .uncheck({ force: true })
      .should('not.be.checked');

    cy.contains('button', 'Continue').click();

    cy.wait(500);

    cy.get('[data-testid="alert"]').contains(
      'Saving these selections will delete the Through a contractor solution page/s that is associated with this operational need.'
    );

    cy.get('#submit-solutions').click();

    cy.get('[data-testid="it-solutions"]')
      .click({ force: true })
      .click({ force: true });

    cy.wait(500);

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
    cy.get('#submit-custom-solution').click();

    cy.get('#it-solutions-key')
      .should('not.be.disabled')
      .select('A cross-model contract')
      .should('have.value', 'CROSS_MODEL_CONTRACT');

    cy.get('[data-testid="add-solution-details-button"]').click();

    cy.get('button').contains('Continue').click();

    cy.get('#submit-solutions').should('not.be.disabled').click();

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
        cy.contains('A cross-model contract');
        cy.contains('View details').click();
      });

    cy.contains('button', 'Upload a document').click();

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
    cy.get('[data-testid="upload-document"]').click();

    cy.get('[data-testid="model-plan-documents-table"] tbody tr')
      .should('have.length', 1)
      .eq(0)
      .within(() => {
        cy.contains('test.pdf');
      });

    cy.wait(500);
    cy.get('#link-documents').click();

    cy.get('[data-testid="model-plan-documents-table"] tbody tr')
      .should('have.length', 1)
      .eq(0)
      .within(() => {
        cy.contains('test.pdf');
        cy.get('[type="checkbox"]').should('be.checked');
        cy.get('[type="checkbox"]').uncheck({ force: true });
      });
    cy.wait(500);

    cy.wait(500);

    cy.get('[data-testid="link-documents-button"]')
      .should('not.be.disabled')
      .click();

    cy.get('[data-testid="model-plan-documents-table"] tbody tr').should(
      'have.length',
      0
    );

    // Adding Subtasks
    cy.contains('button', 'Add subtasks').click();
    cy.get('[data-testid="add-subtask--0"]').within(() => {
      cy.get('#subtask-name--0')
        .should('not.be.disabled')
        .type('First Subtasks')
        .should('have.value', 'First Subtasks');
      cy.contains('label', 'In progress').click();
    });
    cy.contains('button', 'Add another subtask').click();
    cy.get('[data-testid="add-subtask--1"]').within(() => {
      cy.get('#subtask-name--1')
        .should('not.be.disabled')
        .type('Second Subtasks')
        .should('have.value', 'Second Subtasks');
      cy.contains('label', 'Done').click();
    });

    cy.get('#submit-subtasks').click();

    cy.get('.usa-alert__text').contains(
      'Success! Your subtasks have been added.'
    );

    cy.get('[data-testid="todo"] ul').should('have.length', 0);
    cy.get('[data-testid="inProgress"] ul').should('have.length', 1);
    cy.get('[data-testid="done"] ul').should('have.length', 1);

    // Manage Subtasks
    cy.contains('button', 'Manage subtasks').click();
    cy.contains('First Subtasks')
      .parents('.border-bottom.border-base-light')
      .within(() => {
        cy.contains('button', 'Remove this subtask').click();
      });
    cy.contains('button', 'Remove subtask').click();
    cy.get('.usa-alert__text').contains(
      'Success! First Subtasks has been removed.'
    );
    cy.contains('button', 'Add another subtask').click();
    cy.get('[data-testid="add-subtask--0"]').within(() => {
      cy.get('#subtask-name--0')
        .type('This should be in To Do column')
        .should('have.value', 'This should be in To Do column');
    });
    cy.get('#submit-subtasks').click();

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
