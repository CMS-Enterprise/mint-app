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
});
