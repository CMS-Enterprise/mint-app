describe('CSV File Download', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT' });
    cy.visit('/');
  });

  it('should download a CSV file and verify its contents', () => {
    const downloadedFilename = 'MINT-Plan_Approaching_Clearance_in_3_months'; // The expected name of the downloaded file

    // Clean up any previous files
    const downloadsFolder = Cypress.config('downloadsFolder');
    const filePathAll = `${downloadsFolder}/${downloadedFilename}-ALL.csv`;

    cy.task('deleteAllFiles', downloadsFolder);

    cy.enterModelPlanCollaborationArea(
      'Plan Approaching Clearance in 3 months'
    );

    cy.get('[data-testid="share-export-button"').click();

    cy.get('[data-testid="export-button"').click();

    cy.get('[data-testid="share-export-modal-file-type-csv"')
      .check({ force: true })
      .should('be.checked');

    // ALL MODEL PLAN SECTIONS

    // Download
    cy.get('[data-testid="export-model-plan"').click();

    // Wait for file to be downloaded and verify contents
    cy.readFile(filePathAll, { timeout: 15000 }) // waits up to 15s
      .should('exist')
      .and('contain', 'Model ID,Model name,Previous names,Short name,') // selected CSV headers for task list sections
      .and(
        'contain',
        'Do you plan to implement any new or novel data exchange methods based on new technologies or policy initiatives?'
      ) // selected CSV headers for DEA
      .and('contain', 'Is this a draft milestone?'); // selected CSV headers for MTO

    // Clean up
    cy.task('deleteFile', filePathAll);

    // MODEL PLAN

    const filePathModelPlan = `${downloadsFolder}/${downloadedFilename}-MODEL_PLAN.csv`;

    // Open the select dropdown for custom csv
    cy.get('#share-export-modal-export-filter-group').click();

    // Select Model Plan csv
    cy.get('[data-testid="combo-box-option-MODEL_PLAN"')
      .contains('Model Plan')
      .click();

    // Download
    cy.get('[data-testid="export-model-plan"').click();

    // Wait for file to be downloaded and verify contents
    cy.readFile(filePathModelPlan, { timeout: 15000 }) // waits up to 15s
      .should('exist')
      .and('contain', 'Model ID,Model name,Previous names,Short name,') // selected CSV headers for task list sections
      .and(
        'contain',
        'Do you plan to implement any new or novel data exchange methods based on new technologies or policy initiatives?'
      ) // selected CSV headers for DEA - NOTE: For now a part of the model plan, but will be extracted later to its own selection
      .and('not.contain', 'Is this a draft milestone?'); // selected CSV headers for MTO

    // Clean up
    cy.task('deleteFile', filePathModelPlan);

    // MTO ALL

    const filePathMTOAll = `${downloadsFolder}/${downloadedFilename}-MTO_ALL.csv`;

    // Open the select dropdown for custom csv
    cy.get('#share-export-modal-export-filter-group').click();

    // Select Model Plan csv
    cy.get('[data-testid="combo-box-option-MTO_ALL"')
      .contains('Model-to-operations matrix (all)')
      .click();

    // Download
    cy.get('[data-testid="export-model-plan"').click();

    // Wait for file to be downloaded and verify contents
    cy.readFile(filePathMTOAll, { timeout: 15000 }) // waits up to 15s
      .should('exist')
      .and('not.contain', 'Model ID,Model name,Previous names,Short name,') // selected CSV headers for task list sections
      .and(
        'not.contain',
        'Do you plan to implement any new or novel data exchange methods based on new technologies or policy initiatives?'
      ) // selected CSV headers for DEA - NOTE: For now a part of the model plan, but will be extracted later to its own selection
      .and('contain', 'Is this a draft milestone?') // selected CSV headers for MTO
      .and('contain', 'Solution needed by'); // selected CSV headers for MTO

    // Clean up
    cy.task('deleteFile', filePathMTOAll);

    // MTO MILESTONES

    const filePathMTOMilestones = `${downloadsFolder}/${downloadedFilename}-MTO_MILESTONES.csv`;

    // Open the select dropdown for custom csv
    cy.get('#share-export-modal-export-filter-group').click();

    // Select Model Plan csv
    cy.get('[data-testid="combo-box-option-MTO_MILESTONES"')
      .contains('Model-to-operations matrix (milestones view only)')
      .click();

    // Download
    cy.get('[data-testid="export-model-plan"').click();

    // Wait for file to be downloaded and verify contents
    cy.readFile(filePathMTOMilestones, { timeout: 15000 }) // waits up to 15s
      .should('exist')
      .and('not.contain', 'Model ID,Model name,Previous names,Short name,') // selected CSV headers for task list sections
      .and(
        'not.contain',
        'Do you plan to implement any new or novel data exchange methods based on new technologies or policy initiatives?'
      ) // selected CSV headers for DEA - NOTE: For now a part of the model plan, but will be extracted later to its own selection
      .and('contain', 'Is this a draft milestone?') // selected CSV headers for MTO
      .and('not.contain', 'Solution needed by'); // selected CSV headers for MTO

    // Clean up
    cy.task('deleteFile', filePathMTOMilestones);

    // MTO SOLUTIONS

    const filePathMTOSolutions = `${downloadsFolder}/${downloadedFilename}-MTO_SOLUTIONS.csv`;

    // Open the select dropdown for custom csv
    cy.get('#share-export-modal-export-filter-group').click();

    // Select Model Plan csv
    cy.get('[data-testid="combo-box-option-MTO_SOLUTIONS"')
      .contains('Model-to-operations matrix (solutions view only)')
      .click();

    // Download
    cy.get('[data-testid="export-model-plan"').click();

    // Wait for file to be downloaded and verify contents
    cy.readFile(filePathMTOSolutions, { timeout: 15000 }) // waits up to 15s
      .should('exist')
      .and('not.contain', 'Model ID,Model name,Previous names,Short name,') // selected CSV headers for task list sections
      .and(
        'not.contain',
        'Do you plan to implement any new or novel data exchange methods based on new technologies or policy initiatives?'
      ) // selected CSV headers for DEA - NOTE: For now a part of the model plan, but will be extracted later to its own selection
      .and('not.contain', 'Is this a draft milestone?') // selected CSV headers for MTO
      .and('contain', 'Solution needed by'); // selected CSV headers for MTO

    // Clean up
    cy.task('deleteFile', filePathMTOSolutions);
  });
});
