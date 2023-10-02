describe('Discussion Center', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT', role: 'MINT_USER_NONPROD' });
  });

  it('asks a question and answers a question', () => {
    cy.clickPlanTableByName('Empty Plan');

    cy.contains('button', 'Start a discussion').click();

    cy.contains('h1', 'Start a discussion');

    cy.contains('button', 'Save discussion').should('be.disabled');

    cy.get('#user-role').should('not.be.disabled');

    cy.get('#user-role').select('None of the above');

    cy.get('#user-role-description')
      .type('Designer')
      .should('have.value', 'Designer');

    cy.get('#discussion-content')
      .type('How to I get to model characteristics?')
      .should('have.value', 'How to I get to model characteristics?');

    cy.contains('button', 'Save discussion').click();

    cy.contains('button', '1 new discussion topic');

    cy.contains(
      '.usa-alert__body',
      'There are no discussions with replies yet. Once a discussion has been replied to, it will appear here.'
    );

    cy.contains('button', 'Reply').click();

    cy.contains('p', 'How to I get to model characteristics?');

    cy.contains('label', 'Type your reply');

    cy.contains('button', 'Save reply').should('be.disabled');

    cy.get('#discussion-content')
      .should('not.be.disabled')
      .type('Model characteristics is located within the task list.')
      .should(
        'have.value',
        'Model characteristics is located within the task list.'
      );

    cy.contains('button', 'Save reply').click();

    cy.contains('button', '1 discussion');

    cy.contains(
      '.usa-alert__body',
      'There are no new discussion topics. Start a discussion and it will appear here.'
    );

    cy.get('[data-testid="close-discussions"]').click();

    cy.get('[data-testid="discussion-modal"]').should('not.exist');
  });
});
