describe('The Model Plan Form', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'TEST' });
  });

  it('fills out model plan name and creates plan', () => {
    cy.visit('/');

    cy.wait(1000);

    cy.contains('a', 'Start a draft model plan').click();

    cy.contains('h1', 'Start a new model plan');

    cy.get('[data-testid="continue-link"]').click();

    // General Model Plan Information

    cy.get('#new-plan-model-name')
      .type('My New Model Plan')
      .should('have.value', 'My New Model Plan');

    cy.contains('button', 'Next').click();

    cy.wait(1000);

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/models\/new-plan\/.{36}\/collaborators/);
    });

    cy.get('[data-testid="continue-to-tasklist"]').click();

    cy.wait(1000);

    cy.contains('h1', 'Model Plan task list');
  });

  it('create a minimum Model Basics plan', () => {
    cy.visit('/models');
    cy.contains('a', 'My New Model Plan').click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/models\/.{36}\/task-list/);
    });
    cy.contains('h3', 'Model basics');
    cy.contains('button', 'Start').click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/models\/.{36}\/task-list\/basics/);
    });

    cy.get('#plan-basics-model-name').should('have.value', 'My New Model Plan');
    cy.get('#plan-basics-model-category').select('Demonstration');
    cy.get('#plan-basics-model-category').contains('Demonstration');
    cy.get('#new-plan-cmsCenters--1')
      .check({ force: true })
      .should('be.checked');
    cy.contains('button', 'Next').click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(
        /\/models\/.{36}\/task-list\/basics\/overview/
      );
    });
    cy.get('#ModelType-Voluntary')
      .first()
      .check({ force: true })
      .should('be.checked');
    cy.contains('button', 'Next').click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(
        /\/models\/.{36}\/task-list\/basics\/milestones/
      );
    });
    cy.contains('h3', 'High level timeline');
    cy.get('#phasedIn-Yes').first().check({ force: true }).should('be.checked');
    cy.contains('button', 'Save and start next Model Plan section').click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/models\/.{36}\/task-list/);
    });

    cy.get('.model-plan-task-list__last-updated-status').should('be.visible');
  });

  it('archives a model plan', () => {
    cy.visit('/models/f11eb129-2c80-4080-9440-439cbe1a286f/task-list');

    cy.wait(1000);

    cy.contains('button', 'Remove your Model Plan').click();

    cy.contains('button', 'Remove request').click();

    cy.wait(1000);

    cy.location().should(loc => {
      expect(loc.pathname).to.eq('/');
    });

    cy.wait(1000);

    cy.get('table').within(() => {
      cy.get('tbody').within(() => {
        cy.contains('th', 'My excellent plan that I just initiated').should(
          'not.exist'
        );
      });
    });
  });
});
