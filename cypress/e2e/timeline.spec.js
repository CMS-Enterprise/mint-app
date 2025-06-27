describe('The model timeline form', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT' });
    cy.visit('/');
  });

  it('completes a the timeline form', () => {
    cy.enterModelPlanCollaborationArea('Empty Plan');

    // Enter into DEA form
    cy.get('[data-testid="to-timeline"]').click();

    cy.get('[data-testid="fieldset"]').should('not.be.disabled');

    cy.get('#timeline-completeICIP')
      .type('05/23/2065')
      .should('have.value', '05/23/2065');

    cy.get('#timeline-clearanceStarts')
      .type('05/23/2065')
      .should('have.value', '05/23/2065');

    cy.get('#timeline-clearanceEnds')
      .type('05/23/2021')
      .should('have.value', '05/23/2021');

    cy.get('#timeline-announced')
      .type('05/23/2065')
      .should('have.value', '05/23/2065');

    cy.get('#timeline-applicationsStart')
      .type('05/23/2065')
      .should('have.value', '05/23/2065');

    cy.get('#timeline-applicationsEnd')
      .type('05/23/2065')
      .should('have.value', '05/23/2065');

    cy.get('#timeline-performancePeriodStarts')
      .type('05/23/2065')
      .should('have.value', '05/23/2065');

    cy.get('#timeline-performancePeriodEnds')
      .type('05/23/2065')
      .should('have.value', '05/23/2065');

    cy.get('#timeline-wrapUpEnds')
      .type('05/23/2065')
      .should('have.value', '05/23/2065');

    cy.contains('button', 'Save').click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/models\/.{36}\/collaboration-area/);
    });

    cy.get('[data-testid="update-status-modal"]').should('exist');
  });

  //   it('updates model status in modal dropdown', () => {
  //     cy.enterModelPlanCollaborationArea('Enhancing Oncology Model');

  //     cy.get('[data-testid="update-status-modal"]').should('exist');
  //     cy.get('select').should('exist').select('In CMS clearance');

  //     cy.contains('button', 'Yes, update status').click();

  //     cy.get('[data-testid="alert"]').contains(
  //       'You have successfully updated the status to In CMS clearance.'
  //     );
  //   });
});
