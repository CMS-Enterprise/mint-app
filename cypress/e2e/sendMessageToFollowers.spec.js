import { aliasMutation } from '../support/graphql-test-utils';

describe('Send a message to followers', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT' });

    cy.intercept('POST', '/api/graph/query', req => {
      aliasMutation(req, 'SendModelFollowerUpdate');
    });

    cy.visit('/');
  });

  it('sends a message from the collaboration area banner', () => {
    cy.enterModelPlanCollaborationArea('Empty Plan');

    cy.get('[data-testid="follower-message-banner"]')
      .contains('a', 'Send a message to followers')
      .click();

    cy.location('pathname').should('include', '/send-message-to-followers');
    cy.contains('h1', 'Send a message to followers');

    cy.contains('button', 'Send message').should('be.disabled');

    cy.get('#follower-message').click().type('The model has an update. ');

    cy.get('button[aria-label="Bold"]').click();
    cy.get('#follower-message').type('Read more');

    cy.contains('button', 'Send message').should('not.be.disabled').click();

    cy.wait('@SendModelFollowerUpdate').then(({ request, response }) => {
      expect(request.body.variables.content).to.include(
        'The model has an update.'
      );
      expect(request.body.variables.content).to.include(
        '<strong>Read more</strong>'
      );
      expect(response.body.data.sendModelFollowerUpdate.content).to.include(
        '<strong>Read more</strong>'
      );
    });

    cy.location('pathname').should('match', /\/collaboration-area$/);
    cy.get('[data-testid="send-message-to-followers-success"]').contains(
      'Your message was sent to followers of this model.'
    );
  });
});
