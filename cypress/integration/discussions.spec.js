describe('Discussion Center', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT' });
  });

  it('asks a question and answers a question', () => {
    cy.clickPlanTableByName('Empty Test Plan');

    cy.contains('button', 'Ask a question').click();

    cy.contains('h1', 'Ask a question');

    cy.contains('button', 'Save question').should('be.disabled');

    cy.get('#discussion-content')
      .type('How to I get to model characteristics?')
      .should('have.value', 'How to I get to model characteristics?');

    cy.contains('button', 'Save question').click();

    cy.contains('button', '1 unanswered question');

    cy.contains(
      'p',
      'There are no answered questions yet. When a question is answered, it will appear here with the response.'
    );

    cy.contains('button', 'Answer').click();

    cy.contains('p', 'How to I get to model characteristics?');

    cy.contains('label', 'Type your answer');

    cy.contains('button', 'Save answer').should('be.disabled');

    cy.get('#discussion-content')
      .type('Model characteristics is located within the task list.')
      .should(
        'have.value',
        'Model characteristics is located within the task list.'
      );

    cy.contains('button', 'Save answer').click();

    cy.contains('button', '1 answered question');

    cy.contains(
      'p',
      'There are no unanswered questions. Ask a question using the link above.'
    );

    cy.get('[data-testid="close-discussions"]').click();

    cy.get('[data-testid="discussion-modal"]').should('not.exist');
  });
});
