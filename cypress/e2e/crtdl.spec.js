describe('Model Plan CRsand TDLs', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT' });
    cy.visit('/');
  });

  it('adds a cr or tdl', () => {
    cy.enterModelPlanTaskList('Empty Plan');

    cy.contains('a', 'Add a CR or TDL').click();

    cy.contains('h1', 'FFS CRs and TDLs');

    cy.get('#cr-tdl-id-number').type('My CR').should('have.value', 'My CR');

    cy.get('#cr-tdl-title')
      .type('Change request')
      .should('have.value', 'Change request');

    cy.get('#cr-tdl-date-initiated')
      .type('10/26/2028')
      .should('have.value', '10/26/2028');

    cy.get('#date-implemented-month')
      .select('01 - January')
      .should('have.value', 0);

    cy.get('#date-implemented-year').type('2024').should('have.value', 2024);

    cy.get('#cr-tdl-note').type('My note').should('have.value', 'My note');

    // click upload button
    cy.get('#submit-cr-and-tdl').click();

    // check if document is in table
    cy.get('[data-testid="cr-tdl-table-cr"] tbody tr')
      .should('have.length', 1)
      .first()
      .within(() => {
        cy.contains('My CR');
        cy.contains('Change request');
        cy.contains('10/26/2028');
        cy.contains('January 2024');
        cy.contains('My note');
      });

    cy.contains('a', 'Return to Model Plan task list').click();

    cy.get('[data-testid="cr-tdl-items"]').contains('My CR');

    cy.contains('a', 'Manage CRs and TDLs').click();

    cy.get('[data-testid="remove-cr-tdl"]').click();

    cy.contains('button', 'Remove it').click();

    // no cr and tdls are listed
    cy.get('[data-testid="no-crtdls"]').contains('p', 'No CRs');
  });
});
