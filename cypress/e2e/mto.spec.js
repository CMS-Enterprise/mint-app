describe('Model-to-Operations Matrix', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT' });
    cy.visit('/');

    cy.enterModelPlanCollaborationArea('Empty Plan');

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

  it('Fills out an empty MTO Matrix with milestones and solutions', () => {
    cy.contains('h2', 'Your model-to-operations matrix (MTO) is a bit empty!');

    cy.contains('a', 'Add solutions from library');
    cy.contains('button', 'Add this template');
    cy.contains('a', 'Add milestones from library').click({ force: true });

    cy.url().should('include', '/milestone-library');

    cy.get('[data-testid="alert"]').contains(
      'h4',
      'There are no suggested milestones for your model.'
    );

    cy.contains('button', /All common milestones/).click({ force: true });

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
        cy.contains('About this milestone')
          .should('exist')
          .click({ force: true });
      });

    cy.get('[data-testid="milestone-sidepanel"')
      .should('exist')
      .as('milestoneSidepanel')
      .within(() => {
        // Open Add Solution to Milestone Modal
        cy.contains('Add to matrix').click({ force: true });
      });

    cy.findModalWithThisHeadingAndSaveAlias(
      'Add a solution for this milestone?',
      'addSolutionToMilestoneModal'
    );

    cy.get('@addSolutionToMilestoneModal')
      .contains('button', 'Add without solutions')
      .should('be.not.disabled')
      .click({ force: true });

    cy.get('@milestoneSidepanel').within(() => {
      cy.contains('button', 'Added').should('be.disabled');
      cy.get('button[aria-label="Close Modal"]').click({ force: true });
    });

    cy.get('@firstCard').within(() => {
      cy.contains('Add to matrix').should('not.exist');
      cy.contains('button', 'Added').should('be.disabled');
    });

    cy.contains('a', 'Return to model-to-operations matrix').click({
      force: true
    });
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
        cy.contains('Select a solution').click({ force: true });
      });
    });

    cy.findModalWithThisHeadingAndSaveAlias(
      'Add a solution for this milestone?',
      'addSolutionModal'
    );
    cy.get('@addSolutionModal').within(() => {
      cy.get('#multi-source-data-to-collect')
        .click({ force: true })
        .type('4i{enter}');
      cy.get('#clear-selection')
        .parent()
        .find('[class$="indicatorContainer"]')
        .eq(1)
        .click({ force: true });
      cy.get('#multi-source-data-to-collect-tags li').should(
        'have.length.greaterThan',
        0
      );
      cy.contains('Add 1 solution').click({ force: true });
    });

    cy.get('table').within(() => {
      cy.get('td').contains('4i').should('exist');
    });
  });
  it('Adding a Solution from the Solution Library', () => {
    cy.contains('Add solutions from library').click({ force: true });
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
        // cy.contains('About this solution')
        //   .should('exist')
        //   .should('be.not.disabled')
        //   .click({ force: true });
      });

    // FLAKY: TODO: Fix this
    // // Wait for the modal to appear and be fully rendered
    // cy.get('[data-testid="operational-solution-modal"]', { timeout: 10000 })
    //   .should('be.visible')
    //   .as('operationalSolutionModal');

    // cy.get('@operationalSolutionModal')
    //   .scrollIntoView()
    //   .within(() => {
    //     cy.get('@solutionHeading').then(solutionHeading => {
    //       cy.contains(solutionHeading).should('be.visible');
    //     });
    //   })
    //   .as('sidePanel');
    // cy.get('[aria-label="Close Modal"]').click({ force: true });

    // cy.get('@sidePanel').should('not.exist');

    cy.get('@secondCard').within(() => {
      cy.contains('Add to matrix').click();
    });

    cy.findModalWithThisHeadingAndSaveAlias(
      'Add to existing milestone?',
      'addToExistingMilestone'
    );

    cy.get('#linked-milestones').within(() => {
      cy.get("input[type='text']").click().type('{downArrow}{enter}');
    });

    cy.get('#linked-milestones-tags li').should('have.length.greaterThan', 0);
    cy.contains('Add to 1 milestone').click({ force: true });

    cy.contains('a', 'Return to model-to-operations matrix').click({
      force: true
    });
    cy.url().should(
      'include',
      '/collaboration-area/model-to-operations/matrix'
    );

    cy.get('table').within(() => {
      cy.get('td').contains('ACO-OS').should('exist');
    });
  });

  it('Create custom milestone', () => {
    cy.contains('or, create a custom milestone').click({ force: true });

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

      cy.get('#name').should('be.not.disabled').type('Custom Milestone');
      cy.contains('Add milestone').click({ force: true });
    });

    cy.get('[data-testid="toast-success"]').should('exist');
    cy.get('td').contains('Custom Milestone').should('exist');

    cy.get('table').within(() => {
      cy.get('td')
        .contains('Custom Milestone')
        .should('exist')
        .parent('tr')
        .within(() => {
          cy.contains('Edit details').click({ force: true });
        });
    });

    cy.get('#name')
      .should('be.not.disabled')
      .clear()
      .type('Edited Custom Milestone', { force: true });

    cy.get('#description')
      .should('be.not.disabled')
      .type('Edited Custom Milestone Description');
    cy.get('#description').should(
      'have.value',
      'Edited Custom Milestone Description'
    );

    cy.get('#isDraft').should('be.not.disabled').click({ force: true });

    cy.contains('Save changes')
      .should('be.not.disabled')
      .click({ force: true });

    cy.get('[data-testid="toast-success"]').should('exist');
  });

  it('Create custom solution', () => {
    cy.contains('or, create a custom solution').click({ force: true });

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

      cy.get('#solution-title')
        .should('be.not.disabled')
        .type('Custom Solution');
      cy.get('#poc-name').should('be.not.disabled').type('Primary Contact');
      cy.get('#poc-email')
        .should('be.not.disabled')
        .type('primary@contact.com');
      // Cause a blur to trigger validation
      cy.get('#poc-name').click({ force: true });
      cy.contains('Add solution')
        .should('be.not.disabled')
        .click({ force: true });
    });

    cy.get('[data-testid="toast-success"]')
      .should('exist')
      .contains('Your solution (Custom Solution) has been added.');

    // Click the IT system and solutions tab
    cy.contains('Solutions and IT systems').click({ force: true });

    cy.get('table').within(() => {
      cy.get('td')
        .contains('Custom Solution')
        .should('exist')
        .parent('tr')
        .within(() => {
          cy.contains('Edit details').click({ force: true });
        });
    });

    cy.get('#name')
      .should('be.not.disabled')
      .clear()
      .type('Edited Custom Solution', { force: true });

    cy.get('#solution-needed-by').should('be.not.disabled').type('07/20/2025');
    cy.get('#solution-needed-by').should('have.value', '07/20/2025');

    cy.contains('Save changes')
      .should('be.not.disabled')
      .click({ force: true });

    cy.get('[data-testid="toast-success"]').should('exist');

    cy.get('table').within(() => {
      cy.get('td').contains('Edited Custom Solution').should('exist');
    });

    cy.get('table').within(() => {
      cy.get('td')
        .contains('Custom Solution')
        .should('exist')
        .parent('tr')
        .within(() => {
          cy.contains('Edit details').click({ force: true });
        });
    });

    cy.get('#solution-needed-by').should('be.not.disabled').clear();
    cy.get('#solution-needed-by').should('have.value', '');

    cy.contains('Save changes')
      .should('be.not.disabled')
      .click({ force: true });

    cy.get('[data-testid="toast-success"]').should('exist');
  });

  it('Adds a template', () => {
    cy.get('a').contains('Home').click({ force: true });

    cy.enterModelPlanCollaborationArea('Plan with Basics');

    cy.get('[data-testid="Card"]')
      .filter(':has(h3:contains("Model-to-operations matrix"))')
      .within(() => {
        cy.contains('button', 'Go to matrix').click({ force: true });
      });

    cy.url().should(
      'include',
      '/collaboration-area/model-to-operations/matrix'
    );

    cy.contains('View all templates in the library').click({ force: true });

    cy.contains(
      'Browse the model-to-operations (MTO) matrix templates available in MINT. Templates contain a combination of categories, milestones, and/or solutions. They are starting points for certain model types and can be further customized once added. Add any templates that are relevant for your MTO.'
    ).should('exist');

    cy.get('input[type="search"]').type('Standard categories');

    cy.contains('Showing 1-1 of 1 results for "Standard categories"').should(
      'exist'
    );

    cy.get('[data-testid="STANDARD_CATEGORIES-template-about"]').click({
      force: true
    });

    cy.contains(
      'Many teams find it useful to organize the model milestones in their into overarching high-level categories and sub-categories. MINT offers a template set of standard categories as a starting point for new MTOs. The categories and sub-categories in this template represent some of the most common model phases and/or groupings for model activities. Once you’ve added this template, you may add or remove categories as your model requires, and you may add milestones to the added categories. This template does not include milestones or solutions and IT systems.'
    ).should('exist');

    cy.contains('Template content').should('exist');

    cy.contains('Category: Participants').should('exist');

    cy.contains('Solutions and IT systems').click({ force: true });

    cy.contains(
      'There are no solutions or IT systems included in this template.'
    ).should('exist');

    cy.get('[data-testid="add-to-matrix-panel-button"]').click({ force: true });

    cy.contains('Selected template: Standard categories').should('exist');

    cy.get('button').contains('Add template').click({ force: true });

    cy.get('[data-testid="toast-success"]')
      .should('exist')
      .contains('Your template (Standard categories) has been added.');

    // Click to close te mod
    cy.get('[data-testid="close-discussions"]').click({ force: true });

    cy.get('li').contains('Model-to-operations matrix').click({ force: true });

    cy.contains('Participants').should('exist');
    cy.contains('Operations').should('exist');
    cy.contains('Legal').should('exist');
    cy.contains('Payment').should('exist');
    cy.contains('Payers').should('exist');
    cy.contains('Quality').should('exist');
    cy.contains('Learning').should('exist');
    cy.contains('Evaluation').should('exist');
    cy.contains('Model closeout or extension').should('exist');
  });

  it('tests Action Menu', () => {
    cy.get('a').contains('Home').click({ force: true });

    cy.enterModelPlanCollaborationArea('Plan with Basics');

    cy.get('[data-testid="Card"]')
      .filter(':has(h3:contains("Model-to-operations matrix"))')
      .within(() => {
        cy.contains('button', 'Go to matrix').click({ force: true });
      });

    cy.url().should(
      'include',
      '/collaboration-area/model-to-operations/matrix'
    );

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

  it('adds, edits, and removes a note', () => {
    cy.get('table').within(() => {
      cy.get('td')
        .contains('Custom Milestone')
        .should('exist')
        .parent('tr')
        .within(() => {
          cy.contains('Edit details').click({ force: true });
        });
    });

    cy.get('#description').type('Test description');
    cy.get('#description').should('have.value', 'Test description');

    cy.get('#responsible-component').click({ force: true }).type('fch{enter}');
    cy.get('#clear-selection')
      .parent()
      .find('[class$="indicatorContainer"]')
      .eq(1)
      .click({ force: true });
    cy.get('#responsible-component-tags li').should(
      'have.length.greaterThan',
      0
    );
    cy.contains('FCHCO').click({ force: true });

    cy.get('[data-testid="add-note-button"]').click();

    cy.contains('h3', 'Add a milestone note').should('exist');

    cy.get('[data-testid="save-note-button"]').should('be.disabled');

    cy.get('#content').type('Test note');

    cy.get('[data-testid="save-note-button"]')
      .should('be.not.disabled')
      .click();

    cy.contains('p', '1 note added to this milestone').should('exist');

    cy.contains('button', 'Save changes').should('be.not.disabled').click();

    cy.get('[data-testid="toast-success"]').should('exist');

    cy.get('table').within(() => {
      cy.get('td')
        .contains('Custom Milestone')
        .should('exist')
        .parent('tr')
        .within(() => {
          cy.contains('Edit details').click({ force: true });
        });
    });

    cy.get('[data-testid="edit-note-button"]')
      .should('be.not.disabled')
      .click();

    cy.contains('h3', 'Edit milestone note').should('exist');

    cy.get('[data-testid="save-note-button"]').should('be.disabled');

    cy.get('#content').should('have.value', 'Test note');

    cy.get('#content').type('Test note 2');

    cy.get('[data-testid="save-note-button"]')
      .should('be.not.disabled')
      .click();

    cy.contains('p', '1 note added to this milestone').should('exist');

    cy.get('[data-testid="remove-note-button"]').click();

    cy.contains('p', '0 notes added to this milestone').should('exist');

    cy.get('[data-testid="add-note-button"]').click();

    cy.contains('h3', 'Add a milestone note').should('exist');

    cy.get('[data-testid="save-note-button"]').should('be.disabled');

    cy.get('#content').type('Test note 3');

    cy.get('[data-testid="save-note-button"]')
      .should('be.not.disabled')
      .click();

    cy.contains('button', 'Save changes').should('be.not.disabled').click();

    cy.get('[data-testid="toast-success"]').should('exist');
  });
});
