const CONTRACT_NAME = 'E2E CTAT Contract';
const HELP_TYPE_LABEL = 'Guidance on Market Research';
const ASSISTANCE_DESCRIPTION =
  'Need help with market research for an upcoming contract.';

let createdTicketId;

const fillRequiredCtatTicketFields = () => {
  cy.get('#cmmi-group').select('BSG');
  cy.get('#cmmi-division').select('BSG_DBOM');

  cy.get('#type-of-help-needed').within(() => {
    cy.get("input[type='text']").click();
    cy.get('[data-testid="option-GUIDANCE_ON_MARKET_RESEARCH"]').click({
      force: true
    });
  });
  cy.get('label[for="type-of-help-needed"]').click();

  cy.get('#describe-help-needed').type(ASSISTANCE_DESCRIPTION);
  cy.get('#request-urgency').select('MEDIUM');
  cy.get('#assistance-needed-by')
    .should('be.not.disabled')
    .clear({ force: true })
    .type('07/20/2025', { force: true });
  cy.get('#assistance-needed-by').should('have.value', '07/20/2025');
  cy.get('label[for="assistance-needed-by"]').click({ force: true });
};

describe('Contract Technical Assistance (CTAT)', () => {
  describe('Requester', () => {
    beforeEach(() => {
      cy.localLogin({ name: 'MINT' });
    });

    it('navigates to contract assistance from Help and Knowledge Center', () => {
      cy.visit('/help-and-knowledge');
      cy.once('uncaught:exception', () => false);

      cy.contains('a', 'Create and manage help tickets').click();

      cy.url().should('include', '/help-and-knowledge/contract-assistance');
      cy.contains('h1', 'Contract assistance').should('be.visible');
      cy.contains('h2', 'My submitted help tickets').should('be.visible');
      cy.contains('h2', 'Admin ticket management').should('not.exist');
    });

    it('creates and views a contract assistance ticket', () => {
      cy.visit('/help-and-knowledge/contract-assistance');
      cy.once('uncaught:exception', () => false);

      cy.contains('button', 'Create a new ticket').click();

      cy.get('[data-testid="ctat-sidepanel"]').within(() => {
        cy.contains('h2', 'New ticket').should('be.visible');
        cy.get('button[form="ctat-ticket-form"]').should('be.disabled');
      });

      fillRequiredCtatTicketFields();
      cy.get('#contract-name').type(CONTRACT_NAME);

      cy.get('[data-testid="ctat-sidepanel"]')
        .find('button[form="ctat-ticket-form"]')
        .should('be.enabled')
        .click();

      cy.get('[data-testid="toast-success"]')
        .should('be.visible')
        .contains('You submitted a new contract assistance ticket');

      cy.contains('h2', 'My submitted help tickets')
        .parent()
        .find('[data-testid="table"]')
        .contains('td', CONTRACT_NAME)
        .closest('tr')
        .as('submittedTicketRow');

      cy.get('@submittedTicketRow')
        .find('button')
        .invoke('text')
        .then(ticketId => {
          createdTicketId = ticketId.trim();
        });

      cy.get('@submittedTicketRow').within(() => {
        cy.get('button').should('be.visible');
        cy.contains('td', HELP_TYPE_LABEL);
        cy.contains('td', 'New');
      });

      cy.get('@submittedTicketRow').find('button').click();

      cy.get('[data-testid="ctat-ticket-view-sidepanel"]').within(() => {
        cy.contains(createdTicketId).should('be.visible');
      });

      cy.get('[data-testid="ctat-ticket-view-sidepanel"]')
        .find('.mint-sidepanel__scroll-container')
        .should('contain', 'Ticket details')
        .and('contain', CONTRACT_NAME)
        .and('contain', ASSISTANCE_DESCRIPTION)
        .and('contain', 'What happens next?');

      cy.get('[data-testid="close-discussions"]').click();
      cy.get('[data-testid="ctat-ticket-view-sidepanel"]').should('not.exist');
    });
  });

  describe('Assessment team', () => {
    beforeEach(() => {
      cy.localLogin({ name: 'BTMN', role: 'MINT_ASSESSMENT_NONPROD' });
      cy.visit('/help-and-knowledge/contract-assistance');
      cy.once('uncaught:exception', () => false);
    });

    it('shows admin ticket management and updates a submitted ticket', () => {
      cy.contains('h2', 'Admin ticket management').should('be.visible');

      cy.contains('h2', 'Admin ticket management')
        .closest('.admin-section')
        .find('[data-testid="table"] tbody tr')
        .first()
        .as('firstAdminTicketRow');

      cy.get('@firstAdminTicketRow').find('button').click();

      cy.get('[data-testid="ctat-ticket-view-sidepanel"]').within(() => {
        cy.get('[data-testid="ctat-admin-status"]')
          .should('be.visible')
          .select('IN_PROGRESS');
        cy.get('#ctat-admin-progress-notes').type(
          'Reviewing market research requirements.'
        );
        cy.get('button[form="ctat-admin-form"]').should('be.enabled').click();
      });

      cy.get('[data-testid="toast-success"]').contains(
        'You have updated a contract assistance ticket'
      );

      cy.contains('h2', 'Admin ticket management')
        .closest('.admin-section')
        .find('[data-testid="table"] tbody tr')
        .first()
        .within(() => {
          cy.contains('td', 'In progress');
        });
    });
  });
});
