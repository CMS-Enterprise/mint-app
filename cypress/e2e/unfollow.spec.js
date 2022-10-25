describe('Email Unfollow Link', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT', role: 'MINT_USER' });
  });

  it('follows a model plan and then unfollow via email link', () => {
    cy.visit('/models');

    cy.get('[data-testid="table"] a')
      .contains('Empty Plan')
      .then($el => {
        cy.wrap($el.attr('href')).as('modelPlanURL');
      });

    cy.get('#favorite-table').should('not.exist');

    cy.get('[data-testid="table"] button > svg[data-cy="unfavorited"]')
      .first()
      .click();

    cy.get('#favorite-table').within(() => {
      cy.contains('Empty Plan');
    });

    cy.visit('/unfollow/?modelID=75d7cfc7-cff5-4238-86ed-997a50f27908');

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/models\//);
    });

    // cy.clickPlanTableByName('Empty Plan');
    // cy.contains('a', 'Edit team').click();

    // cy.contains('h1', 'Add model team members');

    // cy.get('table').within(() => {
    //   cy.get('thead').within(() => {
    //     cy.contains('th', 'Name');
    //     cy.contains('th', 'Role');
    //     cy.contains('th', 'Date added');
    //     cy.contains('th', 'Actions');
    //   });

    //   cy.get('tbody').within(() => {
    //     cy.contains('th', 'mint Doe');
    //     cy.contains('td', 'Model Lead');
    //   });
    // });

    // cy.contains('a', 'Add team member').click();

    // cy.get('input')
    //   .type('Jerry{downArrow}{enter}')
    //   .should('have.value', 'Jerry Seinfeld, SF13');

    // cy.contains('button', 'Add team member').should('be.disabled');

    // cy.get('select').select('Evaluation').should('have.value', 'EVALUATION');

    // cy.contains('button', 'Add team member').click();

    // cy.get('table').within(() => {
    //   cy.get('tbody').within(() => {
    //     cy.contains('th', 'Jerry Seinfeld');
    //     cy.contains('td', 'Evaluation');
    //   });
    // });
  });
});
