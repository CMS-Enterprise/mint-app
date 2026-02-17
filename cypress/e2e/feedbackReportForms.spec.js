describe('Footer report and feedback forms', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT' });
    cy.visit('/');
  });

  it('verifies Report a problem footer link and submits form', () => {
    cy.get('a[href="/report-a-problem"]')
      .should('have.attr', 'target', '_blank')
      .invoke('attr', 'href')
      .then(href => {
        expect(href).to.include('/report-a-problem');
      });

    // Cypress does not support testing separate tabs, so we need to visit the page directly
    cy.visit('/report-a-problem');

    cy.contains('h1', 'Report a problem').should('be.visible');
    cy.get('#report-a-problem-allow-anon-submission-false').check({
      force: true
    });
    cy.get('#report-a-problem-allow-contact-false').check({ force: true });
    cy.get('#report-a-problem-section-READ_VIEW').check({ force: true });
    cy.get('#report-a-problem-section-what-doing').type('Testing the form');
    cy.get('#report-a-problem-section-what-went-wrong').type(
      'E2E test submission'
    );
    cy.get('#report-a-problem-severity-MINOR').check({ force: true });

    cy.contains('button', 'Send report').click();

    cy.url().should('include', '/feedback-received');
    cy.contains('Thank you for your feedback').should('be.visible');
    cy.contains('The MINT team has received your report').should('be.visible');
  });

  it('verifies Send feedback footer link and submits form', () => {
    cy.get('a[href="/send-feedback"]')
      .should('have.attr', 'target', '_blank')
      .invoke('attr', 'href')
      .then(href => {
        expect(href).to.include('/send-feedback');
      });

    // Cypress does not support testing separate tabs, so we need to visit the page directly
    cy.visit('/send-feedback');

    cy.contains('h1', 'Send feedback').should('be.visible');
    cy.get('#send-feedback-allow-anon-submission-false').check({
      force: true
    });
    cy.get('#send-feedback-allow-contact-false').check({ force: true });
    cy.get('#send-feedback-cmsRole').type('E2E tester');
    cy.get('#send-feedback-mint-used-for-VIEW_MODEL').check({ force: true });
    cy.get('#send-feedback-ease-of-use-AGREE').check({ force: true });
    cy.get('#send-feedback-how-satisfied-SATISFIED').check({ force: true });

    cy.contains('button', 'Send feedback').click();

    cy.url().should('include', '/feedback-received');
    cy.contains('Thank you for your feedback').should('be.visible');
    cy.contains('The MINT team has received your report').should('be.visible');
  });
});
