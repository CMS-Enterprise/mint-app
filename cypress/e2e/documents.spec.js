describe('Model Plan Documents', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT' });
    cy.visit('/');
  });

  it('uploads document through the Documents Card', () => {
    cy.visit('/');

    cy.get(`[data-testid="${'table'}"] a`).contains('Empty Plan').click();
    cy.url().should('include', '/collaboration-area');

    cy.get('[data-testid="page-loading"]').should('not.exist');

    cy.get('.card--documents').contains('No documents added');

    cy.contains('a', 'Add document').click();

    cy.contains('h1', 'Add a document');

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

    // check if document is in table
    cy.get('[data-testid="model-plan-documents-table"] tbody tr')
      .should('have.length', 1)
      .first()
      .within(() => {
        cy.contains('Concept Paper');
        cy.contains('Virus scan in progress...');

        // TODO - URL does not yet exist at this point - need to clear virus scan in order to test the download and remove button

        // const url = row.attr('data-testurl');
        // const path = new URL(url).pathname;

        // // Mark file as passing virus scan
        // cy.exec(`scripts/tag_minio_file ${path} CLEAN`);

        // cy.get('[data-testid="remove-document"]').click();
      });

    // // no documents are listed
    // cy.get('[data-testid="no-documents"]').contains(
    //   'p',
    //   'No documents uploaded'
    // );

    cy.contains('a', 'Return to model collaboration area').click();

    cy.get('.card--documents').contains('1 uploaded');
  });
});
