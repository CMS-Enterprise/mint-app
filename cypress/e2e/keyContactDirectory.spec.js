describe('Key Contact Directory', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT', role: 'MINT_ASSESSMENT_NONPROD' });
    cy.visit('/help-and-knowledge?page=1');
    cy.once('uncaught:exception', () => false);
    cy.contains('Contact directory').click();
  });

  it('Create a unique category', () => {
    cy.contains('Add a subject category').click();

    cy.contains('Add subject category').should('be.disabled');
    cy.get('#category-title').should('be.enabled').type('CMS');
    cy.contains('Add subject category').should('be.enabled').click();

    cy.get('[data-testid="toast-success"]').contains(
      'You added CMS as a subject category.'
    );
    cy.get('[data-testid="accordion"]').contains('CMS').should('be.visible');

    cy.contains('Add a subject category').click();
    cy.get('#category-title').should('be.enabled').type('CMS');
    cy.contains('Add subject category').should('be.enabled').click();
    cy.get('[data-testid="alert"]')
      .should('be.visible')
      .and(
        'contain',
        'This subject category is already added and cannot be added again. Please edit the existing entry.'
      );

    cy.contains('Cancel').click();
  });

  it('Add an user sme to the new category', () => {
    cy.contains('Add SME').click();

    cy.get('button[form="sme-form"]').should('be.disabled');

    cy.get('#sme-subject-category-select')
      .should('be.enabled')
      .find('option')
      .not('[value="default"]')
      .first()
      .then($option => {
        cy.get('#sme-subject-category-select').select($option.text());
      });

    cy.get('[data-testid="sme-subject-area"]')
      .should('be.enabled')
      .type('Model Planning');

    cy.get('#react-select-sme-name-input')
      .should('be.enabled')
      .type('Jerry', { delay: 100 });
    cy.get('#react-select-sme-name-option-0')
      .contains('Jerry Seinfeld (Jerry.Seinfeld@local.fake)')
      .click();

    cy.get('button[form="sme-form"]').should('be.enabled').click();

    cy.get('[data-testid="toast-success"]').contains(
      'You added Jerry Seinfeld as a subject matter expert'
    );

    cy.get('[data-testid="table"]')
      .should('contain', 'Model Planning')
      .and('contain', 'Jerry Seinfeld (Jerry.Seinfeld@local.fake');
  });

  it('Add a team mailbox sme from the new category', () => {
    cy.get('[data-testid="accordion"]').within(() => {
      cy.contains('CMS')
        .parent()
        .siblings()
        .contains('Add SME to this category')
        .click();
    });

    cy.contains('Team mailbox').should('be.enabled').click();

    cy.get('[data-testid="sme-subject-area"]')
      .should('be.enabled')
      .type('Market Place');

    cy.get('[data-testid="team-mailbox-address"]')
      .should('be.enabled')
      .type('test@cms.hhs.gov');

    cy.get('[data-testid="team-mailbox-title"]')
      .should('be.enabled')
      .type('Test Team Mailbox');

    cy.get('button[form="sme-form"]').should('be.enabled').click();

    cy.get('[data-testid="toast-success"]').contains(
      'You added Test Team Mailbox as a subject matter expert'
    );

    cy.get('[data-testid="table"]')
      .should('contain', 'Market Place')
      .and('contain', 'Test Team Mailbox');
  });

  it('Edit an existing SME', () => {
    cy.get('[data-testid="accordion"]').within(() => {
      cy.contains('CMS')
        .parent()
        .siblings()
        .get('[data-testid="table"]')
        .within(() => {
          cy.contains('td', 'Jerry Seinfeld')
            .siblings()
            .contains('button', 'Edit')
            .click();
        });
    });

    cy.get('button[form="sme-form"]').should('be.disabled');

    cy.get('[data-testid="sme-subject-area"]').should('be.enabled').clear();
    cy.get('[data-testid="sme-subject-area"]').type('Healthcare');

    cy.get('#react-select-sme-name-input').should('be.disabled');

    cy.get('button[form="sme-form"]').should('be.enabled').click();

    cy.get('[data-testid="toast-success"]').contains(
      'You updated subject matter expert information for Jerry Seinfeld.'
    );

    cy.get('[data-testid="accordion"]').within(() => {
      cy.contains('CMS')
        .parent()
        .siblings()
        .get('[data-testid="table"]')
        .within(() => {
          cy.contains('td', 'Healthcare').should('exist');
          cy.contains('td', 'Model Planning').should('not.exist');
        });
    });
  });

  it('Delete an existing SME', () => {
    cy.get('[data-testid="accordion"]').within(() => {
      cy.contains('CMS')
        .parent()
        .siblings()
        .get('[data-testid="table"]')
        .within(() => {
          cy.contains('td', 'Jerry Seinfeld')
            .siblings()
            .contains('button', 'Remove')
            .click();
        });
    });

    cy.get('button[type="submit"]')
      .contains('Remove SME')
      .should('be.enabled')
      .click();

    cy.get('[data-testid="toast-success"]').contains(
      'You removed Jerry Seinfeld as a subject matter expert.'
    );

    cy.get('[data-testid="accordion"]').within(() => {
      cy.contains('CMS')
        .parent()
        .siblings()
        .get('[data-testid="table"]')
        .within(() => {
          cy.contains('td', 'Jerry Seinfeld').should('not.exist');
        });
    });
  });

  it('Edit the created category', () => {
    cy.get('[data-testid="accordion"]').within(() => {
      cy.contains('CMS')
        .parent()
        .siblings()
        .contains('Rename category')
        .click();
    });

    cy.get('[data-testid="category-title"]').should('be.enabled').clear();
    cy.get('[data-testid="category-title"]').type(
      'Centers for Medicare and Medicaid Services'
    );

    cy.contains('button', 'Save changes').should('be.enabled').click();

    cy.get('[data-testid="toast-success"]').contains(
      'You renamed subject category Centers for Medicare and Medicaid Services.'
    );

    cy.get('[data-testid="accordion"]').within(() => {
      cy.contains('CMS').should('not.exist');
      cy.contains('Centers for Medicare and Medicaid Services').should(
        'be.visible'
      );
    });
  });

  it('Delete the created category', () => {
    cy.get('[data-testid="accordion"]').within(() => {
      cy.contains('Centers for Medicare and Medicaid Services')
        .parent()
        .siblings()
        .contains('Remove category')
        .click();
    });

    cy.get('button[type="submit"]')
      .contains('Remove category')
      .should('be.enabled')
      .click();

    cy.get('[data-testid="toast-success"]').contains(
      'You removed Centers for Medicare and Medicaid Services as a subject category.'
    );

    cy.get('[data-testid="accordion"]').within(() => {
      cy.contains('Centers for Medicare and Medicaid Services').should(
        'not.exist'
      );
    });
  });
});
