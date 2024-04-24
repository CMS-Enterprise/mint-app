import { TaskListSection } from 'gql/gen/graphql';

describe('Web Socket Connections', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT', role: 'MINT_USER_NONPROD' });
  });

  it('inits a ws connection and locks basics', () => {
    cy.clickPlanTableByName('Empty Plan');

    cy.get('[data-testid="basics"]').should('not.be.disabled');

    cy.location().then(location => {
      cy.wrap(location.pathname.split('/')[2]).as('modelPlanID');
    });

    cy.get('@modelPlanID').then(modelPlanID => {
      cy.task('lockTaskListSection', {
        euaId: 'KR14',
        modelPlanID,
        section: TaskListSection.BASICS
      });

      cy.get('[data-testid="basics"]').should('be.disabled');
    });

    // tries to edit an occupied section
    cy.get('@modelPlanID').then(modelPlanID => {
      cy.task('lockTaskListSection', {
        euaId: 'ABCD',
        modelPlanID,
        section: TaskListSection.PAYMENT
      });
      cy.visit(`/models/${modelPlanID}/task-list/payment`);
    });

    cy.get('[data-testid="page-locked"]').contains(
      'Someone is currently editing the Model Plan section you’re trying to access'
    );
  });
});
