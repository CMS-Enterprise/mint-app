/**
 * Cross-panel MTO editing: open the solution editor from the milestone editor
 * (MINT-3691) and the milestone editor from the solution editor (MINT-3692).
 */

describe('MTO edit milestone ↔ edit solution cross-navigation', () => {
  const modelPlanName = 'Model Plan for MTO testing';
  const milestoneName = 'MilestoneCategory 0A';
  const solutionName = '4i';

  beforeEach(() => {
    cy.localLogin({ name: 'MINT' });
    cy.visit('/');
    cy.enterModelPlanCollaborationArea(modelPlanName);
    cy.get('[data-testid="Card"]')
      .filter(':has(h3:contains("Model-to-operations matrix"))')
      .within(() => {
        cy.contains('button', 'Go to matrix').click({ force: true });
      });
    cy.url().should(
      'include',
      '/collaboration-area/model-to-operations/matrix'
    );
  });

  it('edits solution details from milestone panel with milestone context', () => {
    cy.get('table').within(() => {
      cy.get('td')
        .contains(milestoneName)
        .closest('tr')
        .within(() => {
          cy.contains('Edit details').click({ force: true });
        });
    });

    cy.get('[data-testid="edit-milestone-sidepanel"]')
      .should('be.visible')
      .within(() => {
        cy.contains('button', 'Edit solution').first().click({ force: true });
      });

    cy.location('search').should('include', 'edit-solution=');
    cy.location('search').should('include', 'source=milestone');

    cy.get('[data-testid="edit-solution-sidepanel"]').within(() => {
      cy.contains('h4', 'Back to milestone details').should('be.visible');
      cy.get('h2').should('contain.text', solutionName);
      cy.contains('h3', 'Related milestones').should('not.exist');
    });

    cy.get('#solution-needed-by')
      .should('be.not.disabled')
      .clear({ force: true })
      .type('07/20/2025', { force: true });
    cy.get('#solution-needed-by').should('have.value', '07/20/2025');

    cy.contains('button', 'Save and return to milestone details')
      .should('be.not.disabled')
      .click({ force: true });

    cy.get('[data-testid="toast-success"]').should('exist');

    cy.location('search').should('not.include', 'edit-solution=');
    cy.location('search').should('not.include', 'source=milestone');
    cy.location('search').should('include', 'edit-milestone=');

    cy.get('[data-testid="edit-milestone-sidepanel"]').within(() => {
      cy.contains('h4', 'Milestone details').should('be.visible');
    });
  });

  it('edits milestone details from solution panel with solution context', () => {
  cy.contains('button', 'Solutions and IT systems').click({ force: true });
    cy.get('table').within(() => {
      cy.get('td')
        .contains(solutionName)
        .closest('tr')
        .within(() => {
          cy.contains('Edit details').click({ force: true });
        });
    });

    cy.get('[data-testid="edit-solution-sidepanel"]').within(() => {
      cy.contains('button', 'Edit milestone').first().click({ force: true });
    });

    cy.location('search').should('include', 'edit-solution=');
    cy.location('search').should('include', 'edit-milestone=');
    cy.location('search').should('include', 'source=solution');

    cy.get('[data-testid="edit-milestone-sidepanel"]').within(() => {
      cy.contains('h4', 'Back to solution details').should('be.visible');
      cy.get('h2').should('contain.text', milestoneName);
      cy.contains('button', 'Remove milestone').should('not.exist');
      cy.contains('button', 'Add a milestone note').should('not.exist');
    });

    cy.get('#responsible-component').click({ force: true }).type('fch{enter}');
    cy.get('#clear-selection')
      .parent()
      .find('[class$="indicatorContainer"]')
      .eq(1)
      .click({ force: true });
    cy.contains('FCHCO').click({ force: true });
    cy.get('#responsible-component-tags li').should('contain.text', 'FCHCO');

    cy.contains('button', 'Save and return to solution details')
      .should('be.not.disabled')
      .click({ force: true });

    cy.get('[data-testid="toast-success"]').should('exist');

    cy.location('search').should('not.include', 'edit-milestone=');
    cy.location('search').should('not.include', 'source=solution');
    cy.location('search').should('include', 'edit-solution=');

    cy.get('[data-testid="edit-solution-sidepanel"]').within(() => {
      cy.contains('h4', 'Solution details').should('be.visible');
    });
  });

  it('returns to milestone details when closing solution panel opened from milestone', () => {
    cy.get('table').within(() => {
      cy.get('td')
        .contains(milestoneName)
        .closest('tr')
        .within(() => {
          cy.contains('Edit details').click({ force: true });
        });
    });

    cy.get('[data-testid="edit-milestone-sidepanel"]').within(() => {
      cy.contains('button', 'Edit solution').first().click({ force: true });
    });

    cy.get('[data-testid="edit-solution-sidepanel"]')
      .should('be.visible')
      .find('[data-testid="close-discussions"]')
      .click({ force: true });

    cy.location('search').should('not.include', 'edit-solution=');
    cy.location('search').should('not.include', 'source=milestone');
    cy.location('search').should('include', 'edit-milestone=');

    cy.get('[data-testid="edit-milestone-sidepanel"]').within(() => {
      cy.contains('h4', 'Milestone details').should('be.visible');
    });
  });

  it('returns to solution details when closing milestone panel opened from solution', () => {
    cy.contains('button', 'Solutions and IT systems').click({ force: true });
    cy.get('table').within(() => {
      cy.get('td')
        .contains(solutionName)
        .closest('tr')
        .within(() => {
          cy.contains('Edit details').click({ force: true });
        });
    });

    cy.get('[data-testid="edit-solution-sidepanel"]').within(() => {
      cy.contains('button', 'Edit milestone').first().click({ force: true });
    });

    cy.get('[data-testid="edit-milestone-sidepanel"]')
      .should('be.visible')
      .find('[data-testid="close-discussions"]')
      .click({ force: true });

    cy.location('search').should('not.include', 'edit-milestone=');
    cy.location('search').should('not.include', 'source=solution');
    cy.location('search').should('include', 'edit-solution=');

    cy.get('[data-testid="edit-solution-sidepanel"]').within(() => {
      cy.contains('h4', 'Solution details').should('be.visible');
    });
  });
});
