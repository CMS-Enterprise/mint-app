describe('Model-to-Operations Matrix', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT' });
    cy.visit('/');

    cy.enterModelPlanCollaborationArea('Empty Plan');

    cy.get('[data-testid="Card"]')
      .filter(':has(h3:contains("Model-to-operations matrix"))')
      .within(() => {
        cy.contains('button', 'Go to matrix').click();
      });

    cy.url().should(
      'include',
      '/collaboration-area/model-to-operations/matrix'
    );
  });

  it('Fills out an empty MTO Matrix with milestones and solutions', () => {
    cy.contains('h2', 'Your model-to-operations matrix (MTO) is a bit empty!');

    cy.contains('a', 'Add solutions from library');
    cy.contains('button', 'Add this template');
    cy.contains('a', 'Add milestones from library').click();

    cy.url().should('include', '/milestone-library');

    cy.get('[data-testid="alert"]').contains(
      'h4',
      'There are no suggested milestones for your model.'
    );

    cy.contains('button', /All common milestones/).click();

    cy.get('[data-testid="alert"]').should('not.exist');

    cy.get('[data-testid="Card"]')
      .first()
      .as('firstCard')
      .within(() => {
        cy.get('h3')
          .invoke('text')
          .then(text => {
            // Save the milestone name
            cy.wrap(text.trim()).as('milestoneHeading');
          });
        cy.contains('Add to matrix').should('exist');
        // Open up Milestone Sidepanel
        cy.contains('About this milestone').should('exist').click();
      });

    cy.get('[data-testid="milestone-sidepanel"')
      .should('exist')
      .as('milestoneSidepanel')
      .within(() => {
        // Open Add Solution to Milestone Modal
        cy.contains('Add to matrix').click();
      });

    cy.findModalWithThisHeadingAndSaveAlias(
      'Add a solution for this milestone?',
      'addSolutionToMilestoneModal'
    );

    cy.get('@addSolutionToMilestoneModal')
      .contains('button', 'Add without solutions')
      .click();

    cy.get('@milestoneSidepanel').within(() => {
      cy.contains('button', 'Added').should('be.disabled');
      cy.get('button[aria-label="Close Modal"]').click();
    });

    cy.get('@firstCard').within(() => {
      cy.contains('Add to matrix').should('not.exist');
      cy.contains('button', 'Added').should('be.disabled');
    });

    cy.contains('a', 'Return to model-to-operations matrix').click();
    cy.url().should(
      'include',
      '/collaboration-area/model-to-operations/matrix'
    );

    cy.contains(
      'h2',
      'Your model-to-operations matrix (MTO) is a bit empty!'
    ).should('not.exist');
    cy.get('[data-testid="tasklist-tag"').contains('In progress');

    // Check to see saved milestone is inside the table
    cy.get('@milestoneHeading').then(headingText => {
      cy.get('table').within(() => {
        cy.get('td').contains(headingText).should('exist');
        cy.contains('Select a solution').click();
      });
    });

    cy.findModalWithThisHeadingAndSaveAlias(
      'Add a solution for this milestone?',
      'addSolutionModal'
    );
    cy.get('@addSolutionModal').within(() => {
      cy.get('#multi-source-data-to-collect').click().type('4i{enter}');
      cy.get('#clear-selection')
        .parent()
        .find('[class$="indicatorContainer"]')
        .eq(1)
        .click();
      cy.get('#multi-source-data-to-collect-tags li').should(
        'have.length.greaterThan',
        0
      );
      cy.contains('Add 1 solution').click();
    });

    cy.get('table').within(() => {
      cy.get('td').contains('4i').should('exist');
    });
  });
  it('Adding a Solution from the Solution Library', () => {
    cy.contains('Add solutions from library').click();
    cy.url().should('include', '/solution-library');

    // Add the second solution
    cy.get('[data-testid="Card"]')
      .eq(1)
      .as('secondCard')
      .within(() => {
        cy.get('h3')
          .invoke('text')
          .then(text => {
            // Save the milestone name
            cy.wrap(text.trim()).as('solutionHeading');
          });
        cy.contains('Add to matrix').should('exist');
        // Open up Solutions Sidepanel
        cy.contains('About this solution').should('exist').click().click();
      });

    cy.get('@solutionHeading').then(solutionHeading => {
      cy.get('[role="dialog"]')
        .scrollIntoView()
        .within(() => {
          cy.contains(solutionHeading).should('be.visible');
        })
        .as('sidePanel');
      cy.get('[aria-label="Close Modal"]').click();
    });

    cy.get('@sidePanel').should('not.exist');

    cy.get('@secondCard').within(() => {
      cy.contains('Add to matrix').click();
    });

    cy.findModalWithThisHeadingAndSaveAlias(
      'Add to existing milestone?',
      'addToExistingMilestone'
    );

    cy.get('@addToExistingMilestone').within(() => {
      cy.get('#linked-milestones').click();
      cy.get('[role="listbox"]')
        .find('input[type="checkbox"]')
        .first()
        .check({ force: true })
        .should('be.checked');
      cy.get('#linked-milestones-tags li').should('have.length.greaterThan', 0);
      cy.contains('Add to 1 milestone').click();
    });

    cy.contains('a', 'Return to model-to-operations matrix').click();
    cy.url().should(
      'include',
      '/collaboration-area/model-to-operations/matrix'
    );

    cy.get('table').within(() => {
      cy.get('td').contains('ACO-OS').should('exist');
    });
  });

  it('Create custom milestone', () => {
    cy.contains('or, create a custom milestone').click();

    cy.findModalWithThisHeadingAndSaveAlias(
      'Add a new model milestone',
      'customMilestoneModal'
    );

    cy.get('@customMilestoneModal').within(() => {
      cy.get('#primary-category')
        .should('be.not.disabled')
        .find('option')
        .not('[value="default"]')
        .first()
        .then($option => {
          cy.get('#primary-category').select($option.text());
        });
      cy.get('#subcategory')
        .find('option')
        .not('[value="default"]')
        .first()
        .then($option => {
          cy.get('#subcategory').select($option.text());
        });

      cy.get('#name').type('Custom Milestone');
      cy.contains('Add milestone').click();
    });

    cy.get('[data-testid="mandatory-fields-alert"]').should('exist');
    cy.get('td').contains('Custom Milestone').should('exist');
  });

  it('Create custom solution', () => {
    cy.contains('or, create a custom solution').click();

    cy.findModalWithThisHeadingAndSaveAlias(
      'Add a new solution',
      'customSolutionModal'
    );

    cy.get('@customSolutionModal').within(() => {
      cy.get('#solution-type')
        .should('be.not.disabled')
        .find('option')
        .not('[value="default"]')
        .first()
        .then($option => {
          cy.get('#solution-type').select($option.text());
        });

      cy.get('#solution-title').type('Custom Solution');
      cy.get('#poc-name').type('Primary Contact');
      cy.get('#poc-email').type('primary@contact.com');
      // Cause a blur to trigger validation
      cy.get('#poc-name').click();
      cy.contains('Add solution').should('be.not.disabled').click();
    });

    cy.get('[data-testid="mandatory-fields-alert"]')
      .should('exist')
      .contains('Your solution (Custom Solution) has been added.');

    // Click the IT system and solutions tab
    cy.contains('Solutions and IT systems').click();

    cy.get('table').within(() => {
      cy.get('td')
        .contains('Custom Solution')
        .should('exist')
        .parent('tr')
        .within(() => {
          cy.contains('Edit details').click();
        });
    });

    cy.get('#name').clear().type('Edited Custom Solution', { force: true });

    cy.get('#solution-needed-by').type('07/20/2025');
    cy.get('#solution-needed-by').should('have.value', '07/20/2025');

    cy.contains('Save changes').should('be.not.disabled').click();

    cy.get('[data-testid="mandatory-fields-alert"]').should('exist');

    cy.get('table').within(() => {
      cy.get('td').contains('Edited Custom Solution').should('exist');
    });

    cy.get('table').within(() => {
      cy.get('td')
        .contains('Custom Solution')
        .should('exist')
        .parent('tr')
        .within(() => {
          cy.contains('Edit details').click();
        });
    });

    cy.get('#solution-needed-by').should('be.not.disabled').clear();
    cy.get('#solution-needed-by').should('have.value', '');

    cy.contains('Save changes').should('be.not.disabled').click();

    cy.get('[data-testid="mandatory-fields-alert"]').should('exist');
  });

  it('Add standard categories', () => {
    cy.contains('Add this template').click();
    cy.findModalWithThisHeadingAndSaveAlias(
      'Are you sure you want to continue?'
    );

    cy.contains('Add template').click();

    cy.get('[data-testid="mandatory-fields-alert"]')
      .should('exist')
      .contains('Your template (Standard categories) has been added.');
  });

  it('tests Action Menu', () => {
    cy.get('tbody tr')
      .first()
      .find('td')
      .eq(1)
      .invoke('text')
      .then(text => {
        cy.wrap(text.trim()).as('firstRowName');
      });

    cy.get('tbody tr')
      .first()
      .find('button[aria-label="Open action menu"]')
      .click({ force: true });

    cy.contains('button', 'Move category down').click({ force: true });

    cy.get('@firstRowName').then(firstRowName => {
      cy.get('tbody tr')
        .first()
        .find('td')
        .eq(1)
        .invoke('text')
        .then(currentFirstRowName => {
          expect(currentFirstRowName.trim()).to.not.equal(firstRowName);
        });
    });
  });
});
