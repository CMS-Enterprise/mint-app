import { TaskListSection } from '../../src/types/graphql-global-types';

describe('Web Socket Connections', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT', role: 'MINT_USER' });
  });

  it('inits a ws connection and locks basics', () => {
    cy.clickPlanTableByName('Empty Plan');

    cy.task('lockTaskListSection', {
      euaId: 'MINT',
      modelPlanID: '53054496-6d1f-47f5-b6a0-1edaf73b935e',
      section: TaskListSection.MODEL_BASICS
    });

    cy.get('[data-testid="basics"]').should('be.disabled');
  });

  it('tries to edit an occupied section', () => {
    cy.clickPlanTableByName('Empty Plan');

    cy.location().then(location => {
      cy.wrap(location.pathname.split('/')[2]).as('modelPlanID');
    });

    cy.task('lockTaskListSection', {
      euaId: 'ABCD',
      modelPlanID: '53054496-6d1f-47f5-b6a0-1edaf73b935e',
      section: TaskListSection.PAYMENT
    });

    cy.get('@modelPlanID').then(modelPlanID => {
      cy.visit(`/models/${modelPlanID}/task-list/payment`);
    });

    cy.get('[data-testid="page-locked"]').contains(
      'Someone is currently editing the Model Plan section you’re trying to access'
    );
  });
});
