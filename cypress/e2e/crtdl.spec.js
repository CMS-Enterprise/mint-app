describe('FFS CRs and TDLs', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT' });
    cy.visit('/');
  });

  it('navigates to the FFS CR and TDL page', () => {
    cy.enterModelPlanCollaborationArea('Plan With CRs and TDLs 1');

    cy.contains('h3', 'FFS CRs and TDLS');
    cy.contains('a', 'View all').click();

    cy.url().should('include', '/collaboration-area/cr-and-tdl');

    cy.contains('h4', 'FFS3559');
    cy.contains('h4', 'TDL240535');

    cy.contains('button', 'View more').click();
    cy.get('[data-testid="cr-and-tdl-sidepanel"]').contains(
      'Billing Requirements for Physician Services Rendered in Method II Critical Access Hospitals'
    )
    cy.get('[data-testid="cr-and-tdl-sidepanel"]').within(() => {
      cy.contains('button', 'View this in ECHIMP').click();
    });
  });
});
