import { DateTime } from 'luxon';

const CONTRACT_NAME = 'E2E CTAT Contract';
const HELP_TYPE_LABEL = 'Guidance on market research';
const ASSISTANCE_DESCRIPTION =
  'Need help with market research for an upcoming contract.';
const CTAT_PATH = '/help-and-knowledge/contract-assistance';

const openTicket = contractName => {
  cy.contains('td', contractName).closest('tr').find('button').click();
  cy.get('[data-testid="ctat-ticket-view-sidepanel"]').should('be.visible');
};

const openDiscussion = () => {
  cy.get('[data-testid="ctat-ticket-view-sidepanel"]')
    .contains('a', 'Go to discussion')
    .click();
  cy.get('[data-testid="ctat-discussion-sidepanel"]').should('be.visible');
};

let createdTicketId;

const fillRequiredCtatTicketFields = () => {
  const typedDate = DateTime.now().plus({ days: 7 }).toFormat('MM/dd/yyyy');

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
    .type(typedDate, { force: true });
  cy.get('#assistance-needed-by').should('have.value', typedDate);
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

      cy.get('[data-testid="ctat-ticket-view-sidepanel"]')
        .contains('Latest message: No messages yet')
        .should('be.visible');
      openDiscussion();
      cy.url().should('match', /\/contract-assistance\/[^/]+\/discussion$/);
      cy.url().then(url => cy.visit(url));
      cy.then(() => {
        cy.get('[data-testid="ctat-discussion-sidepanel"]')
          .contains(`Ticket ${createdTicketId}`)
          .should('be.visible');
      });
      cy.contains(
        'There are not yet any messages about this ticket. Add a message to start a discussion.'
      ).should('be.visible');

      const message = 'First line of the E2E discussion.\n\nSecond line.';
      cy.get('#ctat-discussion-message').should('be.visible');
      cy.contains('button', 'Save message').should('be.disabled');
      cy.get('#ctat-discussion-message').type(message);
      cy.contains('button', 'Save message').should('be.enabled').click();
      cy.contains(
        '[data-testid="toast-success"]',
        'You added a message to the discussion'
      ).should('be.visible');
      cy.get('#ctat-discussion-message').should('have.value', '');
      cy.get('#ctat-discussion-messages article')
        .should('have.length', 1)
        .first()
        .should('contain.text', message);
      cy.contains('1 message').should('be.visible');

      cy.get('[data-testid="ctat-discussion-sidepanel"]')
        .find('[data-testid="close-discussions"]')
        .click();
      cy.get('[data-testid="ctat-ticket-view-sidepanel"]')
        .contains('1 message')
        .should('be.visible');

      cy.get('[data-testid="close-discussions"]').click();
      cy.get('[data-testid="ctat-ticket-view-sidepanel"]').should('not.exist');
    });
  });

  describe('Discussion history and safeguards', () => {
    beforeEach(() => {
      cy.localLogin({ name: 'BTAL' });
      cy.visit(CTAT_PATH);
    });

    it('shows the latest two seeded messages and expands the full thread in order', () => {
      cy.intercept('POST', '/api/graph/query', req => {
        if (req.body.operationName === 'GetCtatDiscussions') {
          req.alias = 'discussionHistory';
        }
      });
      openTicket('CMMI Operational Support Services');

      cy.wait('@discussionHistory').then(({ response }) => {
        const messages = response.body.data.discussions;
        expect(messages).to.have.length(7);
        const latest = messages.at(-1);
        const latestName = `${latest.createdByUserAccount.givenName} ${latest.createdByUserAccount.familyName}`;
        cy.get('[data-testid="ctat-ticket-view-sidepanel"]')
          .contains('7 messages')
          .should('be.visible');
        cy.get('[data-testid="ctat-ticket-view-sidepanel"]')
          .contains('Latest message:')
          .should('contain.text', latestName);

        openDiscussion();
        cy.contains('Showing the most recent 2 messages').should('be.visible');
        cy.get('#ctat-discussion-messages article')
          .should('have.length', 2)
          .eq(0)
          .should('contain.text', messages.at(-2).content);
        cy.get('#ctat-discussion-messages article')
          .eq(1)
          .should('contain.text', latest.content);

        cy.contains('button', 'Show earlier messages').click();
        cy.contains('Showing all messages').should('exist');
        cy.get('#ctat-discussion-messages article')
          .should('have.length', messages.length)
          .each(($message, index) => {
            expect($message.text()).to.contain(messages[index].content);
          });
        cy.get('#ctat-discussion-messages').should('contain.text', 'Requester');
        cy.get('#ctat-discussion-messages').should(
          'contain.text',
          'CTAT Admin'
        );

        cy.contains('button', 'Hide earlier messages').click();
        cy.get('#ctat-discussion-messages article').should('have.length', 2);
      });
    });

    it('keeps the draft and shows an error when posting fails', () => {
      cy.intercept('POST', '/api/graph/query', req => {
        if (req.body.operationName === 'CreateCtatDiscussion') {
          req.alias = 'failedDiscussion';
          req.reply({
            statusCode: 200,
            body: { data: null, errors: [{ message: 'Save failed' }] }
          });
        }
      });
      openTicket('Health Care Delivery Advisory');
      openDiscussion();

      cy.get('#ctat-discussion-message').type('Keep this draft');
      cy.contains('button', 'Save message').click();
      cy.wait('@failedDiscussion');
      cy.get('#ctat-discussion-message').should(
        'have.value',
        'Keep this draft'
      );
      cy.contains('There was an error adding your message.').should(
        'be.visible'
      );
    });

    it('confirms panel and browser Back navigation while a draft exists', () => {
      openTicket('Health Care Delivery Advisory');
      openDiscussion();
      cy.get('#ctat-discussion-message').type('Unsent draft');

      cy.get('[data-testid="ctat-discussion-sidepanel"]')
        .find('[data-testid="close-discussions"]')
        .click();
      cy.contains('Are you sure you want to leave?').should('be.visible');
      cy.contains('button', "Don't leave").click();
      cy.get('#ctat-discussion-message').should('have.value', 'Unsent draft');

      cy.go('back');
      cy.contains('Are you sure you want to leave?').should('be.visible');
      cy.contains('button', "Don't leave").click();
      cy.get('#ctat-discussion-message').should('have.value', 'Unsent draft');

      cy.contains('button', 'Cancel').click();
      cy.contains('button', 'Leave discussion').click();
      cy.get('[data-testid="ctat-ticket-view-sidepanel"]').should('be.visible');
    });

    it('shows existing messages but no message form for a closed ticket', () => {
      cy.intercept('POST', '/api/graph/query', req => {
        if (req.body.operationName === 'GetCtatRequest') {
          req.continue(res => {
            res.body.data.ctatRequest.status = 'CLOSED';
          });
        }
      });
      openTicket('Health Care Delivery Advisory');
      cy.contains('This ticket is closed.').should('be.visible');
      openDiscussion();
      cy.get('#ctat-discussion-messages article').should('have.length', 1);
      cy.contains('Add a message').should('not.exist');
      cy.get('#ctat-discussion-message').should('not.exist');
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

    it('opens a discussion directly and posts as a CTAT admin', () => {
      cy.contains('h2', 'Admin ticket management')
        .closest('.admin-section')
        .find('[data-testid="table-page-size"]')
        .select('25');
      openTicket('Population Health Advisory Support');
      cy.get('[data-testid="ctat-ticket-view-sidepanel"]')
        .contains(/\d+ messages/)
        .should('exist');
      openDiscussion();
      cy.url().then(url => cy.visit(url));
      cy.get('[data-testid="ctat-discussion-sidepanel"]').should('be.visible');

      const message = `Admin E2E reply ${Date.now()}`;
      cy.get('#ctat-discussion-message').type(message);
      cy.contains('button', 'Save message').click();
      cy.get('#ctat-discussion-messages article')
        .last()
        .should('contain.text', message)
        .and('contain.text', 'CTAT Admin');
      cy.get('#ctat-discussion-message').should('have.value', '');
    });
  });
});
