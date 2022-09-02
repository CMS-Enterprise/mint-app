describe('The Model Plan Form', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT' });
  });

  it('fills out model plan name and creates plan', () => {
    cy.visit('/');

    cy.contains('a', 'Start a draft model plan').click();

    cy.contains('h1', 'Start a new model plan');

    cy.get('[data-testid="continue-link"]').click();

    // General Model Plan Information

    cy.get('#new-plan-model-name')
      .type('My New Model Plan')
      .should('have.value', 'My New Model Plan');

    cy.contains('button', 'Next').click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/models\/new-plan\/.{36}\/collaborators/);
    });

    cy.get('[data-testid="continue-to-tasklist"]').click();

    cy.contains('h1', 'Model Plan task list');
  });

  it('create and renames a model plan', () => {
    cy.visit('/');

    cy.contains('a', 'Start a draft model plan').click();
    cy.contains('h1', 'Start a new model plan');
    cy.get('[data-testid="continue-link"]').click();

    // Creates a new plan
    cy.get('#new-plan-model-name')
      .type('Model Plan Name')
      .should('have.value', 'Model Plan Name');
    cy.contains('button', 'Next').click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/models\/new-plan\/.{36}\/collaborators/);
    });
    cy.get('[data-testid="continue-to-tasklist"]').click();
    cy.contains('h1', 'Model Plan task list');

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/models\/.{36}\/task-list/);
    });
    cy.contains('h3', 'Model basics');
    cy.contains('button', 'Start').click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/models\/.{36}\/task-list\/basics/);
    });
    cy.get('#plan-basics-model-name')
      .clear()
      .type('Renamed Model Plan Name')
      .should('have.value', 'Renamed Model Plan Name');
    cy.contains('button', 'Save and return to task list').click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/models\/.{36}\/task-list/);
    });
    cy.get('[data-testid="model-plan-name"]').contains(
      'p',
      'Renamed Model Plan Name'
    );
  });

  it('create a minimum Model Basics plan', () => {
    cy.clickPlanTableByName('Empty Plan');

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/models\/.{36}\/task-list/);
    });
    cy.contains('h3', 'Model basics');
    cy.contains('button', 'Start').click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/models\/.{36}\/task-list\/basics/);
    });

    cy.get('#plan-basics-model-name').should('have.value', 'Empty Plan');
    cy.get('#plan-basics-model-category').select('Demonstration');
    cy.get('#plan-basics-model-category').contains('Demonstration');
    cy.get('#new-plan-cmsCenters-CENTER_FOR_MEDICARE')
      .check({ force: true })
      .should('be.checked');
    cy.contains('button', 'Next').click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(
        /\/models\/.{36}\/task-list\/basics\/overview/
      );
    });

    cy.wait(500);

    cy.get('#ModelType-Voluntary').check({ force: true }).should('be.checked');

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
    cy.get('[data-testid="tasklist-tag"]').first().contains('In progress');
  });

  it('completes a Model Plan Basics', () => {
    cy.visit('/');

    cy.contains('a', 'Start a draft model plan').click();
    cy.contains('h1', 'Start a new model plan');
    cy.get('[data-testid="continue-link"]').click();

    // Creates a new plan
    cy.get('#new-plan-model-name')
      .type('Complete Model Basics Plan')
      .should('have.value', 'Complete Model Basics Plan');
    cy.contains('button', 'Next').click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/models\/new-plan\/.{36}\/collaborators/);
    });
    cy.get('[data-testid="continue-to-tasklist"]').click();
    cy.contains('h1', 'Model Plan task list');

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/models\/.{36}\/task-list/);
    });
    cy.contains('h3', 'Model basics');
    cy.contains('button', 'Start').click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/models\/.{36}\/task-list\/basics/);
    });
    cy.get('#plan-basics-model-name').should(
      'have.value',
      'Complete Model Basics Plan'
    );
    cy.get('#plan-basics-model-category')
      .select('Demonstration')
      .contains('Demonstration');
    cy.get('#new-plan-cmsCenters-CENTER_FOR_MEDICARE')
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

    cy.get('#ModelType-Problem')
      .first()
      .type('The problem')
      .should('have.value', 'The problem');

    cy.get('#ModelType-Goal')
      .first()
      .type('The goal')
      .should('have.value', 'The goal');

    cy.get('#ModelType-testInterventions')
      .first()
      .type('The interventions')
      .should('have.value', 'The interventions');

    cy.contains('button', 'Next').click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(
        /\/models\/.{36}\/task-list\/basics\/milestones/
      );
    });
    cy.contains('h3', 'High level timeline');
    cy.get('#Milestone-completeICIP')
      .type('05/23/2025')
      .should('have.value', '05/23/2025');

    cy.get('#Milestone-clearanceStarts')
      .type('05/23/2025')
      .should('have.value', '05/23/2025');

    cy.get('#Milestone-clearanceEnds')
      .type('05/23/2025')
      .should('have.value', '05/23/2025');

    cy.get('#Milestone-announced')
      .type('05/23/2025')
      .should('have.value', '05/23/2025');

    cy.get('#Milestone-applicationsStart')
      .type('05/23/2025')
      .should('have.value', '05/23/2025');

    cy.get('#Milestone-applicationsEnd')
      .type('05/23/2025')
      .should('have.value', '05/23/2025');

    cy.get('#Milestone-performancePeriodStarts')
      .type('05/23/2025')
      .should('have.value', '05/23/2025');

    cy.get('#Milestone-performancePeriodEnds')
      .type('05/23/2025')
      .should('have.value', '05/23/2025');

    cy.get('#Milestone-wrapUpEnds')
      .type('05/23/2025')
      .should('have.value', '05/23/2025');

    cy.get('#phasedIn-Yes').first().check({ force: true }).should('be.checked');
    cy.contains('button', 'Save and start next Model Plan section').click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/models\/.{36}\/task-list/);
    });

    cy.get('[data-testid="tasklist-tag"]').first().contains('In progress');
  });

  it('updates model plan status', () => {
    cy.visit('/');

    cy.contains('a', 'Start a draft model plan').click();
    cy.contains('h1', 'Start a new model plan');
    cy.get('[data-testid="continue-link"]').click();

    // Creates a new plan
    cy.get('#new-plan-model-name')
      .type('Updating Status')
      .should('have.value', 'Updating Status');
    cy.contains('button', 'Next').click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/models\/new-plan\/.{36}\/collaborators/);
    });
    cy.get('[data-testid="continue-to-tasklist"]').click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/models\/.{36}\/task-list/);
    });
    cy.contains('h1', 'Model Plan task list');
    cy.get('.mint-tag').contains('Draft model plan');
    cy.contains('a', 'Update').click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/models\/.{36}\/status/);
    });
    cy.contains('h1', 'Update status');
    cy.get('[data-testid="button"]')
      .contains('Update status')
      .should('be.disabled');
    cy.get('#Status-Dropdown')
      .select('Cleared')
      .should('have.value', 'CLEARED');
    cy.get('[data-testid="button"]')
      .contains('Update status')
      .should('be.not.disabled')
      .click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/models\/.{36}\/task-list/);
    });
    cy.get('.mint-tag').contains('Cleared');
  });
});
