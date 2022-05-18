describe('The Collaborator/Team Member Form', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT' });
  });

  it('adds a collaborator to model plan', () => {
    cy.visit(`/models/f11eb129-2c80-4080-9440-439cbe1a286f/collaborators`);

    cy.contains('h1', 'Add model team members');

    cy.get('table').within(() => {
      cy.get('thead').within(() => {
        cy.contains('th', 'Name');
        cy.contains('th', 'Role');
        cy.contains('th', 'Date added');
        cy.contains('th', 'Actions');
      });

      cy.get('tbody').within(() => {
        cy.contains('th', 'Betty Alpha');
        cy.contains('td', 'Leadership');
      });
    });

    cy.contains('a', 'Add team member').click();

    cy.get('input')
      .type('Jerry{downArrow}{enter}')
      .should('have.value', 'Jerry Seinfeld, SF13');

    cy.contains('button', 'Add team member').should('be.disabled');

    cy.get('select').select('Evaluation').should('have.value', 'EVALUATION');

    cy.contains('button', 'Add team member').click();

    cy.get('table').within(() => {
      cy.get('tbody').within(() => {
        cy.contains('th', 'Jerry Seinfeld');
        cy.contains('td', 'Evaluation');
      });
    });
  });

  it('edits a collaborator', () => {
    cy.visit(`/models/f11eb129-2c80-4080-9440-439cbe1a286f/collaborators`);

    cy.get('table').within(() => {
      cy.get('tbody').within(() => {
        cy.contains('th', 'Betty Alpha')
          .siblings()
          .contains('a', 'Edit')
          .click();
      });
    });

    cy.get('input').should('be.disabled');

    cy.get('select').select('Model Team').should('have.value', 'MODEL_TEAM');

    cy.contains('button', 'Update team member').click();

    cy.get('table').within(() => {
      cy.get('tbody').within(() => {
        cy.contains('th', 'Betty Alpha').siblings('td').contains('Model Team');
      });
    });
  });

  it('removes a collaborator', () => {
    cy.visit(`/models/f11eb129-2c80-4080-9440-439cbe1a286f/collaborators`);

    cy.get('table').within(() => {
      cy.get('tbody').within(() => {
        cy.contains('th', 'Betty Alpha')
          .siblings()
          .contains('button', 'Remove')
          .click();
      });
    });

    cy.contains('button', 'Yes, remove team member').click();

    cy.get('table').within(() => {
      cy.get('tbody').within(() => {
        cy.contains('th', 'Betty Alpha').should('not.exist');
      });
    });
  });
});
