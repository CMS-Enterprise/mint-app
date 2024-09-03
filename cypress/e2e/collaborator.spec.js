describe('The Collaborator/Team Member Form', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT' });
    cy.visit('/');
  });

  it('adds a collaborator to model plan', () => {
    cy.enterModelPlanCollaborationArea('Empty Plan');

    cy.get('[data-testid="manage-collaborators"]').click();

    cy.contains('h1', 'Manage model team');

    cy.get('table').within(() => {
      cy.get('thead').within(() => {
        cy.contains('th', 'Name');
        cy.contains('th', 'Role(s)');
        cy.contains('th', 'Date added');
        cy.contains('th', 'Actions');
      });

      cy.get('tbody').within(() => {
        cy.contains('td', 'MINT Doe');
        cy.contains('td', 'Model Lead');
      });
    });

    cy.contains('a', 'Add team member').click();

    cy.get('#react-select-model-team-cedar-contact-input')
      .click()
      .type('Jerry', { delay: 1000 });

    cy.get('#react-select-model-team-cedar-contact-option-0')
      .contains('Jerry Seinfeld, SF13')
      .click();

    cy.contains('button', 'Add team member').should('be.disabled');

    cy.get('#collaborator-role').within(() => {
      cy.get("input[type='text']").click().type('evalu{downArrow}{enter}');
    });

    cy.clickOutside();

    cy.get('[data-testid="multiselect-tag--Evaluation"]')
      .first()
      .contains('Evaluation');

    cy.contains('button', 'Add team member').click();

    cy.get('table').within(() => {
      cy.get('tbody').within(() => {
        cy.contains('td', 'Jerry Seinfeld');
        cy.contains('td', 'Evaluation');
      });
    });

    // Edits a collaborator
    cy.enterModelPlanCollaborationArea('Plan With Collaborators');

    cy.get('[data-testid="manage-collaborators"]').click();

    cy.get('table').within(() => {
      cy.get('tbody').within(() => {
        cy.contains('td', 'BTAL Doe').siblings().contains('a', 'Edit').click();
      });
    });

    cy.get('input').should('be.disabled');

    cy.get('#collaborator-role').within(() => {
      cy.get("input[type='text']").click().type('evalu{downArrow}{enter}');
    });

    cy.clickOutside();

    cy.get('[data-testid="multiselect-tag--Evaluation"]')
      .first()
      .contains('Evaluation');

    cy.get('#collaborator-role').should('not.be.disabled');

    cy.get('#collaborator-role').within(() => {
      cy.get("input[type='text']").click().type('model tea{downArrow}{enter}');
    });

    cy.clickOutside();

    cy.get('[data-testid="multiselect-tag--Model Team"]')
      .first()
      .contains('Model Team');

    cy.contains('button', 'Update team member').click();

    cy.get('table').within(() => {
      cy.get('tbody').within(() => {
        cy.contains('td', 'BTAL Doe').siblings('td').contains('Model Team');
      });
    });

    // Removes a collaborator
    cy.enterModelPlanCollaborationArea('Plan With Collaborators');

    cy.get('[data-testid="manage-collaborators"]').click();

    cy.get('table').within(() => {
      cy.get('tbody').within(() => {
        cy.contains('td', 'BTAL Doe')
          .siblings()
          .contains('button', 'Remove')
          .click();
      });
    });

    cy.contains('button', 'Remove team member').click();

    cy.get('table').within(() => {
      cy.get('tbody').within(() => {
        cy.contains('td', 'BTAL Doe').should('not.exist');
      });
    });

    // The Collaborator Access Control
    // attempts to enter a model plan where not a collaborator
    cy.get('[data-testid="signout-link"]').click();

    cy.localLogin({ name: 'ABCD' });

    cy.visit('/models');

    cy.get('[data-testid="table"] a')
      .contains('Empty Plan')
      .then($el => {
        cy.wrap($el.attr('href')).as('modelPlanURL');
      });

    cy.get('[data-testid="table"] a').contains('Empty Plan').click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/models\/.{36}\/read-view\/model-basics/);
    });

    cy.get('@modelPlanURL').then(modelPlanURL => {
      const taskList = modelPlanURL.replace(
        'read-view',
        'collaboration-area/task-list'
      );
      cy.visit(taskList);
      cy.location().should(loc => {
        expect(loc.pathname).to.match(
          /\/models\/.{36}\/read-view\/model-basics/
        );
      });
    });
  });
});
