describe('The data exchange approach Form', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT' });
    cy.visit('/');
  });

  it('completes a the data exchange approach form', () => {
    cy.enterModelPlanCollaborationArea('Empty Plan');

    // Enter into DEA form
    cy.get('[data-testid="to-data-exchange-approach"]').click();

    // Progress to the next page, just text on this page
    cy.contains('button', 'Next').click();

    // Check that data is loaded by form being enabled
    cy.get('#dataWillNotBeCollectedFromParticipants-true').should(
      'not.be.disabled'
    );

    // Open multiselect
    cy.get('#data-to-collect-from-participants').within(() => {
      cy.get("input[type='text']").click();
    });

    // Select some options from Multiselect
    cy.get('[data-testid="option-REPORTS_FROM_PARTICIPANTS"]')
      .check({ force: true })
      .should('be.checked');

    cy.get('[data-testid="option-OTHER"]')
      .check({ force: true })
      .should('be.checked');

    cy.clickOutside();

    // Check if tag rendered
    cy.get('[data-testid="multiselect-tag--Other (please specify)"]')
      .first()
      .contains('Other');

    cy.get(
      '[data-testid="multiselect-tag--Reports from participants (please specify)"]'
    )
      .first()
      .contains('Reports from participants');

    // Check checkbox that disabled multiselect
    cy.get('#dataWillNotBeCollectedFromParticipants-true')
      .check({ force: true })
      .should('be.checked');

    // Make sure that the multiselect is disabled
    cy.get('#data-to-collect-from-participants').within(() => {
      cy.get("input[type='text']").should('be.disabled');
    });

    // Open note toggle
    cy.get(
      '[data-testid="dataToCollectFromParticipantsNote-add-note-toggle"]'
    ).click();

    // Add note text
    cy.get('#data-to-collect-from-participants-note')
      .type('Some notes')
      .should('have.value', 'Some notes');

    // Check checkbox that can be disabled but starts enabled
    cy.get('#data-to-send-to-participants-DATA_FEEDBACK_DASHBOARD')
      .should('not.be.disabled')
      .check({ force: true })
      .should('be.checked');

    // Select checkbox that disables the other checkbox
    cy.get(
      '#data-to-send-to-participants-DATA_WILL_NOT_BE_SENT_TO_PARTICIPANTS'
    )
      .check({ force: true })
      .should('be.checked');

    // Check that the other checkbox is disabled
    cy.get('#data-to-send-to-participants-DATA_FEEDBACK_DASHBOARD').should(
      'be.disabled'
    );

    // Open note toggle
    cy.get(
      '[data-testid="dataToSendToParticipantsNote-add-note-toggle"]'
    ).click();

    // Add note text
    cy.get('#data-to-send-to-participants-note')
      .type('Some notes 2')
      .should('have.value', 'Some notes 2');

    // Progress to the next page, page 3
    cy.contains('button', 'Next').click();

    // Second checkbox fields should be disabled until yes is selected
    cy.get(
      '#anticipated-multi-payer-data-availability-use-case-MORE_COMPETENT_ALERT_DISCHARGE_TRANSFER_NOTIFICATION'
    ).should('be.disabled');

    // Select yes
    cy.get('#does-need-to-make-multi-payer-data-available-true')
      .should('not.be.disabled')
      .check({ force: true })
      .check({ force: true })
      .should('be.checked');

    // Second checkbox should now be enabled
    cy.get(
      '#anticipated-multi-payer-data-availability-use-case-MORE_COMPETENT_ALERT_DISCHARGE_TRANSFER_NOTIFICATION'
    )
      .should('be.not.disabled')
      .check({ force: true })
      .should('be.checked');

    // Open note toggle
    cy.get(
      '[data-testid="doesNeedToMakeMultiPayerDataAvailableNote-add-note-toggle"]'
    ).click();

    // Add note text
    cy.get('#does-need-to-make-multi-payer-data-available-note')
      .type('Some notes 3')
      .should('have.value', 'Some notes 3');

    // Multiselect should be disabled until yes is selected
    cy.get('#multi-source-data-to-collect').within(() => {
      cy.get("input[type='text']").should('be.disabled');
    });

    cy.get('#does-need-to-collect-and-aggregate-multi-source-data-true')
      .should('be.not.disabled')
      .check({ force: true })
      .should('be.checked');

    // Multiselect should now be enabled
    cy.get('#multi-source-data-to-collect').should('be.not.disabled');

    // Open multiselect
    cy.get('#multi-source-data-to-collect').within(() => {
      cy.get("input[type='text']").click();
    });

    cy.get('[data-testid="option-OTHER"]')
      .check({ force: true })
      .should('be.checked');

    cy.clickOutside();

    // Check if tag rendered
    cy.get('[data-testid="multiselect-tag--Other (please specify)"]')
      .first()
      .contains('Other');

    // Type other info
    cy.get('#multi-source-data-to-collect-other')
      .type('Some other info')
      .should('have.value', 'Some other info');

    // Open note toggle
    cy.get(
      '[data-testid="doesNeedToCollectAndAggregateMultiSourceDataNote-add-note-toggle"]'
    ).click();

    // Add note text
    cy.get('#does-need-to-collect-and-aggregate-multi-source-data-note')
      .type('Some notes 4')
      .should('have.value', 'Some notes 4');

    // Progress to the next page, page 4
    cy.contains('button', 'Next').click();

    cy.get('#will-implement-new-data-exchange-methods-true')
      .should('not.be.disabled')
      .check({ force: true })
      .check({ force: true })
      .should('be.checked');

    // Open note toggle
    cy.get(
      '[data-testid="newDataExchangeMethodsNote-add-note-toggle"]'
    ).click();

    // Add note text
    cy.get('#new-data-exchange-methods-note')
      .type('Some notes 5')
      .should('have.value', 'Some notes 5');

    cy.get('#additional-data-exchange-considerations-description')
      .type('data exchange considerations')
      .should('have.value', 'data exchange considerations');

    cy.get('#isDataExchangeApproachComplete-true')
      .should('not.be.disabled')
      .check({ force: true })
      .should('be.checked');

    // Save and go back to collaboration area
    cy.contains(
      'button',
      'Save and return to model collaboration area'
    ).click();

    cy.get('[data-testid="tasklist-tag"]').contains('Complete');
  });
});
