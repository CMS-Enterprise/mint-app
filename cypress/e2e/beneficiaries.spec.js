describe('The Model Plan Beneficiaries Form', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT' });
    cy.visit('/');
  });

  it('completes a Model Plan Beneficiaries form', () => {
    cy.enterModelPlanTaskList('Empty Plan');

    cy.get('[data-testid="beneficiaries"]').click();

    cy.url().should('include', '/beneficiaries');

    cy.get('#beneficiaries-beneficiaries')
      .should('not.be.disabled')
      .within(() => {
        cy.get("input[type='text']").click().type('disease{downArrow}{enter}');
      });

    cy.clickOutside();

    cy.get('#beneficiaries-disease-specific-group')
      .type('Lorem, ipsum dolor')
      .should('have.value', 'Lorem, ipsum dolor');

    cy.get('#beneficiaries-dual-eligibility-no')
      .check({ force: true })
      .should('be.checked');

    cy.get('#beneficiaries-exclude-no')
      .check({ force: true })
      .should('be.checked');

    cy.contains('button', 'Next').click();

    cy.get('#expected-people-impacted')
      .should('not.be.disabled')
      .invoke('val', 2345)
      .trigger('change')
      .should('have.value', 2345);

    cy.get('#beneficiaries-impact-confidence-COMPLETELY')
      .check({ force: true })
      .should('be.checked');

    cy.get('#beneficiaries-chooseBeneficiaries').within(() => {
      cy.get("input[type='text']").click().type('histor{downArrow}{enter}');
    });

    cy.clickOutside();

    cy.contains('button', 'Next').click();

    cy.get('#beneficiary-selection-frequency-monthly')
      .should('not.be.disabled')
      .check({ force: true })
      .should('be.checked');

    cy.get('#beneficiary-removal-frequency-quarterly')
      .check({ force: true })
      .should('be.checked');

    cy.get('#beneficiaries-overlap-YES_NO_ISSUES')
      .check({ force: true })
      .should('be.checked');

    cy.get('#beneficiaries-precedence-rules-YES')
      .check({ force: true })
      .should('be.checked');

    cy.get('#beneficiaries-precedence-rules-YES-note').type(
      'Lorem, ipsum dolor'
    );

    cy.contains('button', 'Save and return to task list').click();

    cy.url().should('include', '/collaboration-area/task-list');
  });
});
