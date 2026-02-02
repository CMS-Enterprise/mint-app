describe('The IDDOC questionnaire Form', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT' });
    cy.visit('/');
  });

  it('should not be able enter IDDOC questionnaire by default', () => {
    cy.enterModelPlanCollaborationArea('Empty Plan');
    cy.contains('button', 'Go to questionnaires').click();

    cy.get('[data-testid="questionnaireList-tag"]').contains('Not Needed');

    cy.get('[data-testid="iddoc-questionnaire-button"]').should('not.exist');
  });

  it('completes a the IDDOC questionnaire form', () => {
    // Trigger IDDOC needed status
    cy.enterModelPlanTaskList('Empty Plan');
    cy.get('[data-testid="ops-eval-and-learning"]').click();

    cy.get('#ops-eval-and-learning-help-desk-use-true').should(
      'not.be.disabled'
    );

    cy.get('#ops-eval-and-learning-iddoc-support-true')
      .check({ force: true })
      .should('be.checked');
    cy.contains('button', 'Save and return to Model Plan').click();

    cy.get('[data-testid="return-to-collaboration"]').click();

    cy.contains('button', 'Go to questionnaires').click();

    // Enter into IDDOC questionnaire form
    cy.get('[data-testid="iddoc-questionnaire-button"]').within(() => {
      cy.contains('Start').click();
    });

    // Page - /iddoc-questionnaire/operations
    cy.url().should('include', '/iddoc-questionnaire/operations');

    cy.get('#technical-contacts-identified-true')
      .as('contacts')
      .should('not.be.disabled');

    cy.get('@contacts').check({ force: true });
    cy.get('@contacts').should('be.checked');

    cy.get('#technical-contacts-identified-detail').as('technical-contacts');
    cy.get('@technical-contacts').type('Bill in accounting');
    cy.get('@technical-contacts').should('have.value', 'Bill in accounting');

    cy.get('#capture-participant-info-true')
      .check({ force: true })
      .should('be.checked');

    cy.get('#icd-owner').type('Mark in accounting');
    cy.get('#icd-owner').should('have.value', 'Mark in accounting');

    cy.get('#draft-icd-due-date').type('10/26/2028');
    cy.get('#draft-icd-due-date').should('have.value', '10/26/2028');

    cy.contains('button', 'Next').click();

    // Page - /iddoc-questionnaire/testing
    cy.url().should('include', '/iddoc-questionnaire/testing');
    cy.get('#uat-needs').should('not.be.disabled');

    cy.get('#uat-needs')
      .type('Users to make sure this works correctly')
      .should('have.value', 'Users to make sure this works correctly');

    cy.get('#stc-needs')
      .type('Realistic information needed to ensure accuracy')
      .should('have.value', 'Realistic information needed to ensure accuracy');

    cy.get('#testing-timelines')
      .type(
        'testing will start in October, and hsould conclude by the 1st of December'
      )
      .should(
        'have.value',
        'testing will start in October, and hsould conclude by the 1st of December'
      );

    cy.get('#data-monitoring-file-types-OTHER')
      .check({ force: true })
      .should('be.checked');

    cy.get('#data-monitoring-file-other-OTHER')
      .type('suplementary')
      .should('have.value', 'suplementary');

    cy.get('#data-response-type')
      .type('survey responses')
      .should('have.value', 'survey responses');

    cy.get('#data-response-file-frequency')
      .type('Every 3 weeks')
      .should('have.value', 'Every 3 weeks');

    cy.contains('button', 'Next').click();

    // Page - /iddoc-questionnaire/monitoring
    cy.url().should('include', '/iddoc-questionnaire/monitoring');
    cy.get('#eft-set-up-true').should('not.be.disabled');

    cy.get('#data-full-time-or-incremental-FULL_TIME')
      .check({ force: true })
      .should('be.checked');

    cy.get('#eft-set-up-true')
      //       .check({ force: true })
      .check({ force: true })
      .should('be.checked');

    cy.get('#unsolicited-adjustments-included-true')
      .check({ force: true })
      .should('be.checked');

    cy.get('#data-flow-diagrams-needed-true')
      .check({ force: true })
      .should('be.checked');

    cy.get('#produce-benefit-enhancement-files-true')
      .check({ force: true })
      .should('be.checked');

    cy.get('#file-naming-conventions')
      .type('files start with s and are .xslx files')
      .should('have.value', 'files start with s and are .xslx files');

    cy.get('#is-iddocquestionnaire-complete')
      .should('not.be.disabled')
      .check({ force: true })
      .should('be.checked');

    // Save and go back to questionnaires area
    cy.contains('button', 'Save').click();

    cy.get('[data-testid="questionnaireList-tag"]').contains('Complete');
  });
});
