import miscellaneous from '../../src/i18n/en-US/modelPlan/miscellaneous';
import { aliasQuery } from '../support/graphql-test-utils';

describe('The Model Plan Ops Eval and Learning Form', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT' });
    cy.visit('/');

    cy.intercept('POST', '/api/graph/query', req => {
      aliasQuery(req, 'GetModelPlan');
    });
  });

  it('completes a Model Plan Ops Eval and Learning form', () => {
    cy.enterModelPlanTaskList('Empty Plan');

    cy.wait('@GetModelPlan')
      .its('response.statusCode')
      .should('eq', 200)
      .wait(500);

    // Clicks the Ops Eval and Learning tasklist item
    cy.get('[data-testid="ops-eval-and-learning"]').click();

    // Page - /ops-eval-and-learning

    cy.get('#ops-eval-and-learning-help-desk-use-true').should(
      'not.be.disabled'
    );

    cy.get('[data-testid="model-plan-name"]').contains('for Empty Plan');

    cy.get('#ops-eval-and-learning-stakeholders').within(() => {
      cy.get("input[type='text']").click();
    });

    cy.get('[data-testid="option-BENEFICIARIES"]')
      .check({ force: true })
      .should('be.checked');

    cy.clickOutside();

    cy.get('#ops-eval-and-learning-help-desk-use-true')
      .check({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-contractor-support-OTHER')
      .check({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-contractor-support-other')
      .type('Multiple to support design')
      .should('have.value', 'Multiple to support design');

    cy.get('#ops-eval-and-learning-contractor-support-how')
      .type('They will provide wireframes of workflows')
      .should('have.value', 'They will provide wireframes of workflows');

    cy.get('#ops-eval-and-learning-iddoc-support-true')
      .check({ force: true })
      .should('be.checked');

    cy.contains('button', 'Next').click();

    // Page - /ops-eval-and-learning/performance

    cy.get('#ops-eval-and-learning-benchmark-performance-YES_RECONCILE').should(
      'not.be.disabled'
    );

    cy.get('#ops-eval-and-learning-benchmark-performance-YES_RECONCILE')
      .check({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-compute-performance-true')
      .check({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-risk-adjustment-performance-true')
      .check({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-risk-adjustment-feedback-true')
      .check({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-risk-adjustment-payment-true')
      .check({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-risk-adjustment-other-true')
      .check({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-appeal-performance-true')
      .check({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-appeal-feedback-true')
      .check({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-appeal-payment-true')
      .check({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-appeal-other-true')
      .check({ force: true })
      .should('be.checked');

    cy.contains('button', 'Next').click();

    // Page - /ops-eval-and-learning/evaluation

    cy.get('#ops-eval-and-learning-evaluation-approach-OTHER').should(
      'not.be.disabled'
    );

    cy.get('#ops-eval-and-learning-evaluation-approach-OTHER')
      .check({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-evaluation-approach-other')
      .type('A New algorithym')
      .should('have.value', 'A New algorithym');

    cy.get('#ops-eval-and-learning-cmmi-involvement-YES_EVALUATION')
      .check({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-cmmi-involvement-OTHER')
      .check({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-cmmi-involvement-other')
      .type('yes for other advice as needed')
      .should('have.value', 'yes for other advice as needed');

    cy.get('#ops-eval-and-learning-data-needed').within(() => {
      cy.get("input[type='text']").click();
    });

    cy.get('[data-testid="option-OTHER"]')
      .check({ force: true })
      .should('be.checked');

    cy.clickOutside();

    cy.get('[data-testid="multiselect-tag--Other"]').first().contains('Other');

    cy.get('#ops-eval-and-learning-data-to-send').within(() => {
      cy.get("input[type='text']").click();
    });

    cy.get('[data-testid="option-OTHER_MIPS_DATA"]')
      .check({ force: true })
      .should('be.checked');

    cy.clickOutside();

    cy.get('[data-testid="multiselect-tag--Other"]').last().contains('Other');

    cy.get('#ops-eval-and-learning-share-cclf-data-true')
      .check({ force: true })
      .should('be.checked');

    cy.contains('button', 'Next').click();

    // Page - /ops-eval-and-learning/ccw-and-quality

    cy.get('#ops-eval-and-learning-send-files-true').should('not.be.disabled');

    cy.get('#ops-eval-and-learning-send-files-true')
      .check({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-app-to-send-files-true')
      .check({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-app-to-send-files-which')
      .type('SharePoint')
      .should('have.value', 'SharePoint');

    cy.get('#ops-eval-and-learning-send-files-true')
      .check({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-distribute-files-true')
      .check({ force: true })
      .should('be.checked');

    cy.contains('button', 'Next').click();

    // Page - /ops-eval-and-learning/data-sharing

    cy.get('#ops-eval-and-learning-data-sharing-starts').should(
      'not.be.disabled'
    );

    cy.get('#ops-eval-and-learning-data-sharing-starts').select('Other');

    cy.get('#ops-eval-and-learning-data-sharing-starts-other')
      .type('the next leap year')
      .should('have.value', 'the next leap year');

    cy.get('#ops-eval-and-learning-data-sharing-frequency-other')
      .check({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-data-sharing-frequency-other-text')
      .type('Data Sharing Frequency Other')
      .should('have.value', 'Data Sharing Frequency Other');

    cy.get('#ops-eval-and-learning-data-collection-starts').select('Other');

    cy.get('#ops-eval-and-learning-data-collection-starts-other')
      .type('the next leap year again')
      .should('have.value', 'the next leap year again');

    cy.get('#ops-eval-and-learning-data-collection-frequency-continually')
      .check({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-data-collection-frequency-continually-text')
      .type('Data Sharing Frequency Continually')
      .should('have.value', 'Data Sharing Frequency Continually');

    cy.get('#ops-eval-and-learning-data-reporting-starts').select('Other');

    cy.get('#ops-eval-and-learning-data-reporting-starts-other')
      .type('the third leap year from now')
      .should('have.value', 'the third leap year from now');

    cy.get('#ops-eval-and-learning-quality-reporting-frequency-continually')
      .check({ force: true })
      .should('be.checked');

    cy.get(
      '#ops-eval-and-learning-quality-reporting-frequency-continually-text'
    )
      .type('Quality Reporting Frequency Continually')
      .should('have.value', 'Quality Reporting Frequency Continually');

    cy.contains('button', 'Next').click();

    // Page - /ops-eval-and-learning/learning

    cy.get('#ops-eval-and-learning-learning-systems-OTHER').should(
      'not.be.disabled'
    );

    cy.get('#ops-eval-and-learning-learning-systems-OTHER')
      .check({ force: true })
      .check({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-learning-systems-other')
      .type('We will make our own in house learning system')
      .should('have.value', 'We will make our own in house learning system');

    cy.get('#ops-eval-and-learning-learning-anticipated-challenges')
      .type(
        'We might not have complete staffing for this. We might need to use more contractors than previously anticipated.'
      )
      .should(
        'have.value',
        'We might not have complete staffing for this. We might need to use more contractors than previously anticipated.'
      );

    cy.contains('button', miscellaneous.saveAndReturn).click();

    cy.wait('@GetModelPlan')
      .its('response.statusCode')
      .should('eq', 200)
      .wait(500);

    cy.location().should(loc => {
      expect(loc.pathname).to.match(
        /\/models\/.{36}\/collaboration-area\/model-plan/
      );
    });
  });
});
