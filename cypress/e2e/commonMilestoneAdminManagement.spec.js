describe('Common Milestone Admin Management', () => {
  describe('Non-Assessment User Tests', () => {
    beforeEach(() => {
      cy.localLogin({ name: 'MINT' });
      cy.visit('/');
    });

    it('does not allow non-assessment users to see action buttons', () => {
      cy.contains('h2', 'Admin actions').should('not.exist');

      cy.visit('/help-and-knowledge/milestone-library');
      cy.get('button').contains('Add a milestone').should('not.exist');
    });
  });

  describe('Assessment User Tests', () => {
    beforeEach(() => {
      cy.localLogin({ name: 'JTTC', role: 'MINT_ASSESSMENT_NONPROD' });
      cy.visit('/');
    });

    it('creates a new milestone with multi-selects and conditional fields', () => {
      cy.contains('h2', 'Admin actions').should('exist');
      cy.get('[data-testid="to-view-common-milestones"]').click();

      cy.url().should('include', '/help-and-knowledge/milestone-library');

      cy.get('button').contains('Add a milestone').click();

      // Fill out the form
      cy.get('[data-testid="common-milestone-side-panel"]')
        .find('button[type="submit"],[name="Add milestone"]')
        .should('be.disabled');

      cy.get('input[name="name"]').type('A Test Milestone');
      cy.get('textarea[name="description"]').type(
        'System-generated description.'
      );

      cy.get('select[name="categoryName"]').select('Beneficiaries');
      cy.get('select[name="subCategoryName"]').select('Uncategorized');

      cy.get('#facilitated-by-role').within(() => {
        cy.get("input[type='text']").click();
        cy.get('[data-testid="option-MODEL_LEAD"]').click({ force: true });
        cy.get('[data-testid="option-OTHER"]').click({ force: true });
      });

      cy.get('label[for="facilitated-by-role"]').click();

      cy.get('input[name="facilitatedByOther"]')
        .should('be.visible')
        .type('External Consultant');

      cy.get('#common-solutions').within(() => {
        cy.get("input[type='text']").click().type('evalu{downArrow}{enter}');
      });

      cy.get('label[for="common-solutions"]').click();

      cy.get('[data-testid="common-milestone-side-panel"]')
        .find('button[type="submit"],[name="Add milestone"]')
        .click();

      cy.get('[data-testid="toast-success"]').contains(
        `You have added a new milestone (A Test Milestone) to the model milestone library.`
      );

      cy.get('[data-testid="CardGroup"]')
        .contains('A Test Milestone')
        .should('be.visible');
    });

    it('edits an existing milestone and handles confirmation flow', () => {
      cy.visit('/help-and-knowledge/milestone-library');

      cy.get('[data-testid="CardGroup"]')
        .contains('Acquire a learning contractor')
        .parents('.usa-card')
        .within(() => {
          cy.contains('Category: Learning').should('be.visible');
          cy.get('button').contains('Learn about this milestone').click();
        });

      cy.get('button').contains('Edit milestone').click();
      cy.url().should('include', 'edit=true');

      cy.get('[data-testid="common-milestone-side-panel"]').should('exist');

      cy.get('input[name="name"]')
        .clear({ force: true })
        .type('Acquire a new learning contractor', { force: true, delay: 50 }); // Slight delay mimics human typing;

      cy.get('[aria-label="Remove IT Lead"]').click();

      cy.get('#facilitated-by-role').within(() => {
        cy.get("input[type='text']").click();
        cy.get('[data-testid="option-MODEL_LEAD"]').click({
          force: true
        });
      });

      cy.get('label[for="facilitated-by-role"]').click();

      cy.get('[data-testid="common-milestone-side-panel"]')
        .find('button')
        .contains(/save changes/i)
        .should('not.be.disabled')
        .click();

      cy.get('[data-testid="edit-common-milestone-confirmation-modal"]').within(
        () => {
          cy.get('button').contains('Save changes').click();
        }
      );

      cy.get('[data-testid="toast-success"]').contains(
        `Your changes for a milestone (Acquire a new learning contractor) have been saved.`
      );

      cy.get('[data-testid="common-milestone-side-panel"]').should('not.exist');
      cy.url().should('not.contain', 'edit=true');

      cy.clickOutside();

      cy.get('[data-testid="CardGroup"]')
        .contains('Acquire a new learning contractor')
        .should('be.visible');

      cy.get('[data-testid="CardGroup"]')
        .contains('Acquire a learning contractor')
        .should('not.exist');
    });

    it('deletes a milestone through the confirmation modal', () => {
      cy.visit('/help-and-knowledge/milestone-library');

      cy.get('[data-testid="CardGroup"]')
        .contains('Acquire a quality measures development contractor')
        .parents('.usa-card')
        .within(() => {
          cy.get('button').contains('Learn about this milestone').click();
        });

      cy.get('button').contains('Remove milestone').click();

      cy.get(
        '[data-testid="remove-common-milestone-confirmation-modal"]'
      ).within(() => {
        cy.get('button').contains('Remove milestone').click();
      });

      cy.get('[data-testid="toast-success"]').contains(
        'You have removed a milestone from the library. It is no longer available for use.'
      );

      cy.get('[data-testid="CardGroup"]')
        .contains('Acquire a quality measures development contractor')
        .should('not.exist');
    });
  });
});
