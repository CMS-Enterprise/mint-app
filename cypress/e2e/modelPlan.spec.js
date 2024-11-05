describe('The Model Plan Form', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT' });
    cy.visit('/');
  });

  it('fills out model plan name and creates plan', () => {
    cy.visit('/');

    cy.contains('a', 'Start a new Model Plan').click();
    cy.contains('h1', 'Start a new model plan');
    cy.get('[data-testid="continue-link"]').click();

    // General Model Plan Information

    cy.get('#new-plan-model-name')
      .type('My New Model Plan')
      .should('have.value', 'My New Model Plan');

    cy.contains('button', 'Next').click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(
        /\/models\/.{36}\/collaboration-area\/collaborators/
      );
    });

    cy.get('[data-testid="page-loading"]').should('not.exist');

    cy.get('[data-testid="continue-to-collaboration-area"]').click();

    // renames a model plan
    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/models\/.{36}\/collaboration-area/);
    });

    cy.get('[data-testid="page-loading"]').should('not.exist');

    cy.get(`[data-testid="to-task-list"]`).click();
    cy.url().should('include', '/collaboration-area/task-list');

    cy.contains('h1', 'Model Plan task list');

    cy.contains('h3', 'Model basics');

    cy.contains('button', /Start$/).click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(
        /\/models\/.{36}\/collaboration-area\/task-list\/basics/
      );
    });

    cy.get('[data-testid="fieldset"]').should('not.be.disabled');

    cy.get('#plan-basics-model-name')
      .clear()
      .type('Renamed Model Plan Name')
      .should('have.value', 'Renamed Model Plan Name');

    cy.contains('button', 'Save and return to task list').click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(
        /\/models\/.{36}\/collaboration-area\/task-list/
      );
    });

    cy.get('[data-testid="model-plan-name"]').contains(
      'p',
      'Renamed Model Plan Name'
    );

    cy.get('[data-testid="basics"]').click();

    cy.get('[data-testid="fieldset"]').should('not.be.disabled');

    cy.get('#plan-basics-abbreviation').type('RMP').should('have.value', 'RMP');

    cy.get('#plan-basics-ams-model-id')
      .type('46723163')
      .should('have.value', '46723163');

    cy.get('#plan-basics-demo-code')
      .type('933245623')
      .should('have.value', '933245623');

    cy.get('#plan-basics-model-category-ACCOUNTABLE_CARE')
      .check({ force: true })
      .should('be.checked');

    cy.get(
      '#plan-basics-model-additional-category-DISEASE_SPECIFIC_AND_EPISODIC'
    )
      .check({ force: true })
      .should('be.checked');

    cy.get('#new-plan-cmsCenters-CENTER_FOR_MEDICARE')
      .check({ force: true })
      .should('be.checked');

    cy.contains('button', 'Next').click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(
        /\/models\/.{36}\/collaboration-area\/task-list\/basics\/overview/
      );
    });

    cy.get('[data-testid="fieldset"]').should('not.be.disabled');

    cy.get('#ModelType-VOLUNTARY').check({ force: true }).should('be.checked');

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
        /\/models\/.{36}\/collaboration-area\/task-list\/basics\/milestones/
      );
    });

    cy.get('[data-testid="fieldset"]').should('not.be.disabled');

    cy.contains('h3', 'Anticipated high level timeline');

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

    cy.get('#phasedIn-true')
      .first()
      .check({ force: true })
      .should('be.checked');

    cy.contains('button', 'Save and return to task list').click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(
        /\/models\/.{36}\/collaboration-area\/task-list/
      );
    });

    cy.get('.model-plan-task-list__last-updated-status').should('be.visible');

    cy.get('[data-testid="tasklist-tag"]').first().contains('In progress');

    cy.get('[data-testid="return-to-collaboration"]').click();

    // updates model plan status

    cy.get('.mint-tag').contains('Draft Model Plan');

    cy.contains('a', 'Update').click();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(
        /\/models\/.{36}\/collaboration-area\/status/
      );
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
      expect(loc.pathname).to.match(/\/models\/.{36}\/collaboration-area/);
    });

    cy.get('.mint-tag').contains('Cleared');

    // favorites and unfavorites a model plan
    cy.visit('/models');

    cy.get('[data-testid="page-loading"]').should('not.exist');

    cy.contains('tr', 'Empty Plan').get('[data-cy="favorited"]');

    cy.contains('tr', 'Empty Plan')
      .get('[data-testid="Empty Plan-favorite"]')
      .click();

    cy.contains('tr', 'Empty Plan').get('[data-cy="unfavorited"]');
  });

  it('updates model status in modal dropdown', () => {
    cy.enterModelPlanCollaborationArea('Enhancing Oncology Model');

    cy.get('[data-testid="update-status-modal"]').should('exist');
    cy.get('select').should('exist').select('In CMS clearance');

    cy.contains('button', 'Yes, update status').click();

    cy.get('[data-testid="alert"]').contains(
      'You have successfully updated the status to In CMS clearance.'
    );
  });
});
