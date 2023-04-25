describe('Model Plan CRsand TDLs', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT', role: 'MINT_USER_NONPROD' });
  });

  it('adds a cr or tdl', () => {
    cy.clickPlanTableByName('Empty Plan');

    cy.contains('a', 'Add a CR or TDL').clickEnabled();

    cy.contains('h1', 'CR and TDLs');

    cy.get('#cr-tdl-id-number')
      .typeEnabled('My CR')
      .should('have.value', 'My CR');

    cy.get('#cr-tdl-date-initiated')
      .typeEnabled('10/26/2028')
      .should('have.value', '10/26/2028');

    cy.get('#cr-tdl-title')
      .typeEnabled('Change request')
      .should('have.value', 'Change request');

    cy.get('#cr-tdl-note')
      .typeEnabled('My note')
      .should('have.value', 'My note');

    // click upload button
    cy.get('#submit-cr-and-tdl').clickEnabled();

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

    cy.contains('a', 'Return to Model Plan task list').clickEnabled();

    cy.get('[data-testid="cr-tdl-items"]').contains('My CR');

    cy.contains('a', 'Manage CRs and TDLs').clickEnabled();

    cy.get('[data-testid="remove-cr-tdl"]').clickEnabled();

    cy.contains('button', 'Remove it').clickEnabled();

    // no cr and tdls are listed
    cy.get('[data-testid="no-crtdls"]').contains('p', 'No CRs or TDLs');
  });
});
