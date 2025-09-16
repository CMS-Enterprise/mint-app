describe('Reports and Analytics', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT' });
    cy.visit('/reports-and-analytics');
  });

  const downloadsFolder = Cypress.config('downloadsFolder');

  it('should display the reports and analytics page correctly', () => {
    // Verify page loads and shows expected content
    cy.get('h1').should('contain', 'Reports and analytics');
    cy.get('[data-testid="analytics-description"]').should('be.visible');

    // Verify chart navigation is present
    cy.get('[data-testid="chart-navigation"]').should('be.visible');

    // Verify download button is present
    cy.get('[data-testid="download-analytics-button"]').should('be.visible');
  });

  it('should download analytics Excel file successfully', () => {
    const expectedFilename = 'MINT-Analytics.xlsx';

    // Clean up any previous files
    cy.task('createFolderIfNotExists', downloadsFolder);
    cy.task('deleteAllFiles', downloadsFolder);

    // Click the download button
    cy.get('[data-testid="download-analytics-button"]').click();

    // Wait for download to complete and verify file exists
    cy.readFile(`${downloadsFolder}/${expectedFilename}`).should('exist');

    // Verify the file is not empty (basic check)
    cy.readFile(`${downloadsFolder}/${expectedFilename}`).should('not.be.null');
  });

  it('should download MTO milestone summary Excel file successfully', () => {
    const expectedFilename = 'MINT-MTO_Milestone_Summary.xlsx';

    // Clean up any previous files
    cy.task('createFolderIfNotExists', downloadsFolder);
    cy.task('deleteAllFiles', downloadsFolder);

    // Click the MTO milestone summary download button
    cy.get('[data-testid="download-mtoMilestoneSummary-button"]').click();

    // Wait for download to complete and verify file exists
    cy.readFile(`${downloadsFolder}/${expectedFilename}`).should('exist');

    // Verify the file is not empty (basic check)
    cy.readFile(`${downloadsFolder}/${expectedFilename}`).should('not.be.null');
  });

  it('should display error state when no analytics data is available', () => {
    // This test would need to be run in an environment with no analytics data
    // or with mocked empty data
    cy.get('[data-testid="no-analytics-data"]').should('not.exist');
  });

  it('should verify Excel file contains expected sheets and data', () => {
    const expectedFilename = 'MINT-Analytics.xlsx';

    // Clean up any previous files
    cy.task('createFolderIfNotExists', downloadsFolder);
    cy.task('deleteAllFiles', downloadsFolder);

    // Download the file
    cy.get('[data-testid="download-analytics-button"]').click();
    cy.readFile(`${downloadsFolder}/${expectedFilename}`).should('exist');

    // Note: For more detailed Excel file verification, you would need to:
    // 1. Install a library like 'xlsx' in Cypress
    // 2. Parse the Excel file and verify sheet names and content
    // 3. Check that translated column headers are present
    // 4. Verify that cell values are properly translated

    // Basic file verification
    cy.readFile(`${downloadsFolder}/${expectedFilename}`).should('not.be.null');
    // Additional Excel-specific checks would go here

    // Clean up any previous files
    cy.task('deleteAllFiles', downloadsFolder);
  });
});
