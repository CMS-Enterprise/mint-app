describe('Common Milestone Admin Management', () => {
  describe('Non-Assessment User Tests', () => {
    beforeEach(() => {
      cy.localLogin({ name: 'MINT' });
      cy.visit('/');
    });

    it('does not allow non-assessment users to see action buttons', () => {
      cy.get('h2', { name: 'Admin actions' }).should('not.exist');

      cy.visit('/help-and-knowledge/milestone-library');
      cy.get('button').contains('Add a milestone').should('not.exist');
    });
  });

  describe('Assessment User Tests', () => {
    const milestoneName = 'A Test Milestone';
    const updatedMilestoneName = 'A New Test Milestone';

    beforeEach(() => {
      cy.localLogin({ name: 'JTTC', role: 'MINT_ASSESSMENT_NONPROD' });
      cy.visit('/');
    });

    it('creates a new milestone with multi-selects and conditional fields', () => {
      cy.get('h2', { name: 'Admin actions' }).should('exist');
      cy.get('[data-testid="to-view-common-milestones"]').click();

      cy.url().should('include', '/help-and-knowledge/milestone-library');

      cy.get('button').contains('Add a milestone').click();

      // Fill out the form
      cy.get('[data-testid="common-milestone-side-panel"]')
        .find('button[type="submit"]')
        .should('be.disabled');

      cy.get('input[name="name"]').type(milestoneName);
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
        .find('button[type="submit"]')
        .click();

      cy.get('[data-testid="toast-success"]').contains(
        `You have added a new milestone (${milestoneName}) to the model milestone library.`
      );

      cy.get('[data-testid="CardGroup"]')
        .contains(milestoneName)
        .should('be.visible');
    });

    it('edits an existing milestone and handles confirmation flow', () => {
      cy.visit('/help-and-knowledge/milestone-library');

      cy.get('[data-testid="CardGroup"]')
        .contains(milestoneName)
        .parents('.usa-card')
        .within(() => {
          cy.contains('Category: Beneficiaries').should('be.visible');
          cy.get('button').contains('Learn about this milestone').click();
        });

      cy.get('button').contains('Edit milestone').click();
      cy.url().should('include', 'edit=true');

      cy.get('[data-testid="common-milestone-side-panel"]').should('exist');

      cy.get('input[name="name"]')
        .clear({ force: true })
        .type(updatedMilestoneName, { force: true, delay: 50 }); // Slight delay mimics human typing;

      cy.get('[aria-label="Remove Model Lead"]').click();

      cy.get('#facilitated-by-role').within(() => {
        cy.get("input[type='text']").click();
        cy.get('[data-testid="option-IT_LEAD"]').click({
          force: true
        });
      });

      cy.get('label[for="facilitated-by-role"]').click();

      cy.get('[data-testid="common-milestone-side-panel"]')
        .find('button[type="submit"]')
        .should('not.be.disabled')
        .click();

      cy.get('[data-testid="edit-common-milestone-confirmation-modal"]').within(
        () => {
          cy.get('button').contains('Save changes').click();
        }
      );

      cy.get('[data-testid="toast-success"]').contains(
        `Your changes for a milestone (${updatedMilestoneName}) have been saved.`
      );

      cy.get('[data-testid="common-milestone-side-panel"]').should('not.exist');
      cy.url().should('not.contain', 'edit=true');

      cy.clickOutside();

      cy.get('[data-testid="CardGroup"]')
        .contains(updatedMilestoneName)
        .should('be.visible');

      cy.get('[data-testid="CardGroup"]')
        .contains(`${milestoneName}`)
        .should('not.exist');
    });

    it('deletes a milestone through the confirmation modal', () => {
      cy.visit('/help-and-knowledge/milestone-library');

      cy.get('[data-testid="CardGroup"]')
        .contains(updatedMilestoneName)
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
        .contains(updatedMilestoneName)
        .should('not.exist');
    });
  });
});
