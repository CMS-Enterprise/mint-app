describe('Model Plan CRsand TDLs', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT', role: 'MINT_USER' });
  });

  it('adds a cr or tdl', () => {
    cy.clickPlanTableByName('Empty Plan');

    cy.contains('a', 'Add a CR or TDL').click();

    cy.contains('h1', 'CR and TDLs');

    cy.get('#cr-tdl-id-number').type('My CR').should('have.value', 'My CR');

    cy.get('#cr-tdl-date-initiated')
      .type('10/26/2028')
      .should('have.value', '10/26/2028');

    cy.get('#cr-tdl-id-title')
      .type('Change request')
      .should('have.value', 'Change request');

    cy.get('#cr-tdl-note').type('My note').should('have.value', 'My note');

    // click upload button
    cy.get('#submit-cr-and-tdl').click();

    // check if document is in table
    cy.get('[data-testid="cr-tdl-table"] tbody tr')
      .should('have.length', 1)
      .first()
      .within(() => {
        cy.contains('My CR');
        cy.contains('10/26/2028');
        cy.contains('Change request');
        cy.contains('My note');
      });

    cy.contains('a', 'Return to Model Plan task list').click();

    cy.get('[data-testid="cr-tdl-items"]').contains('My CR');

    cy.contains('a', 'Manage CRs and TDLs').click();

    cy.get('[data-testid="remove-cr-tdl"]').click();

    cy.contains('button', 'Remove it').click();

    // no cr and tdls are listed
    cy.get('[data-testid="no-crtdls"]').contains('p', 'No CRs or TDLs');
  });
});
