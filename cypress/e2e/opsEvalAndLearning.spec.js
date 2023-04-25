import { aliasQuery } from '../support/graphql-test-utils';

describe('The Model Plan Ops Eval and Learning Form', () => {
  beforeEach(() => {
    cy.localLogin({ name: 'MINT', role: 'MINT_USER_NONPROD' });

    cy.intercept('POST', '/api/graph/query', req => {
      aliasQuery(req, 'GetModelPlan');
      aliasQuery(req, 'GetOpsEvalAndLearning');
      aliasQuery(req, 'GetIDDOC');
      aliasQuery(req, 'GetIDDOCTesting');
      aliasQuery(req, 'GetIDDOCMonitoring');
      aliasQuery(req, 'GetPerformance');
      aliasQuery(req, 'GetEvaluation');
      aliasQuery(req, 'GetCCWAndQuality');
      aliasQuery(req, 'GetDataSharing');
      aliasQuery(req, 'GetLearning');
    });
  });

  it('completes a Model Plan Ops Eval and Learning form', () => {
    cy.clickPlanTableByName('Empty Plan');

    // Clicks the Ops Eval and Learning tasklist item
    cy.get('[data-testid="ops-eval-and-learning"]').clickEnabled();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(
        /\/models\/.{36}\/task-list\/ops-eval-and-learning/
      );
    });

    // Page - /ops-eval-and-learning
    cy.get('[data-testid="model-plan-name"]').contains('for Empty Plan');

    cy.get('#ops-eval-and-learning-agency-or-state-help-YES_AGENCY_IAA')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-agency-or-state-help-OTHER')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-agency-or-state-help-other')
      .typeEnabled('Department of Motor Vehicles')
      .should('have.value', 'Department of Motor Vehicles');

    cy.get('#ops-eval-and-learning-stakeholders').within(() => {
      cy.get("input[type='text']").clickEnabled();
    });

    cy.get('[data-testid="option-BENEFICIARIES"]')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.clickOutside();

    cy.get('#ops-eval-and-learning-help-desk-use-true')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-contractor-support-OTHER')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-contractor-support-other')
      .typeEnabled('Multiple to support design')
      .should('have.value', 'Multiple to support design');

    cy.get('#ops-eval-and-learning-contractor-support-how')
      .typeEnabled('They will provide wireframes of workflows')
      .should('have.value', 'They will provide wireframes of workflows');

    cy.get('#ops-eval-and-learning-iddoc-support')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.contains('button', 'Next').clickEnabled();

    // Page - /ops-eval-and-learning/iddoc

    cy.get('#ops-eval-and-learning-technical-contacts-identified-use-true')
      .as('contacts')
      .checkEnabled({ force: true });
    cy.get('@contacts').should('be.checked');

    cy.get('#ops-eval-and-learning-technical-contacts-identified-detail')
      .as('technical-contacts')
      .typeEnabled('Bill in accounting');
    cy.get('@technical-contacts').should('have.value', 'Bill in accounting');

    cy.get('#ops-eval-and-learning-capture-participant-info')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-capture-icd-owner')
      .as('icd-owner')
      .typeEnabled('Mark in accounting');
    cy.get('@icd-owner').should('have.value', 'Mark in accounting');

    cy.get('#ops-eval-and-learning-icd-due-date')
      .typeEnabled('10/26/2028')
      .should('have.value', '10/26/2028');

    cy.contains('button', 'Next').clickEnabled();

    // Page - /ops-eval-and-learning/iddoc-testing

    cy.get('#ops-eval-and-learning-uat-needs')
      .typeEnabled('Users to make sure this works correctly')
      .should('have.value', 'Users to make sure this works correctly');

    cy.get('#ops-eval-and-learning-stc-needs')
      .typeEnabled('Realistic information needed to ensure accuracy')
      .should('have.value', 'Realistic information needed to ensure accuracy');

    cy.get('#ops-eval-and-learning-testing-timelines')
      .typeEnabled(
        'testing will start in October, and hsould conclude by the 1st of December'
      )
      .should(
        'have.value',
        'testing will start in October, and hsould conclude by the 1st of December'
      );

    cy.get('#ops-eval-and-learning-data-monitoring-file-OTHER')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-data-monitoring-file-other')
      .typeEnabled('suplementary')
      .should('have.value', 'suplementary');

    cy.get('#ops-eval-and-learning-data-response-type')
      .typeEnabled('survey responses')
      .should('have.value', 'survey responses');

    cy.get('#ops-eval-and-learning-data-file-frequency')
      .typeEnabled('Every 3 weeks')
      .should('have.value', 'Every 3 weeks');

    cy.contains('button', 'Next').clickEnabled();

    // Page - /ops-eval-and-learning/iddoc-monitoring

    cy.get('#ops-eval-and-learning-fulltime-or-incremental-INCREMENTAL')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-eft-setup-true')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-unsolicted-adjustment-included-true')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-diagrams-needed-true')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-produce-benefit-files-true')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-file-naming-convention')
      .typeEnabled('files start with s and are .xslx files')
      .should('have.value', 'files start with s and are .xslx files');

    cy.contains('button', 'Next').clickEnabled();

    // Page - /ops-eval-and-learning/performance

    cy.get('#ops-eval-and-learning-benchmark-performance-YES_RECONCILE')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-compute-performance-true')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-risk-adjustment-performance-true')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-risk-adjustment-feedback-true')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-risk-adjustment-payment-true')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-risk-adjustment-other-true')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-appeal-performance-true')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-appeal-feedback-true')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-appeal-payment-true')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-appeal-other-true')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.contains('button', 'Next').clickEnabled();

    // Page - /ops-eval-and-learning/evaluation

    cy.get('#ops-eval-and-learning-evaluation-approach-OTHER')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-evaluation-approach-other')
      .typeEnabled('A New algorithym')
      .should('have.value', 'A New algorithym');

    cy.get('#ops-eval-and-learning-cmmi-involvement-YES_EVALUATION')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-cmmi-involvement-OTHER')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-cmmi-involvement-other')
      .typeEnabled('yes for other advice as needed')
      .should('have.value', 'yes for other advice as needed');

    cy.get('#ops-eval-and-learning-data-needed').within(() => {
      cy.get("input[type='text']").clickEnabled();
    });

    cy.get('[data-testid="option-OTHER"]')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.clickOutside();

    cy.get('[data-testid="multiselect-tag--Other"]').first().contains('Other');

    cy.get('#ops-eval-and-learning-data-to-send').within(() => {
      cy.get("input[type='text']").clickEnabled();
    });

    cy.get('[data-testid="option-OTHER_MIPS_DATA"]')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.clickOutside();

    cy.get('[data-testid="multiselect-tag--Other"]').last().contains('Other');

    cy.get('#ops-eval-and-learning-share-cclf-data-true')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.contains('button', 'Next').clickEnabled();

    // Page - /ops-eval-and-learning/ccw-and-quality

    cy.get('#ops-eval-and-learning-send-files-true')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-app-to-send-files-true')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-app-to-send-files-which')
      .typeEnabled('SharePoint')
      .should('have.value', 'SharePoint');

    cy.get('#ops-eval-and-learning-send-files-true')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-distribute-files-true')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.contains('button', 'Next').clickEnabled();

    // Page - /ops-eval-and-learning/data-sharing

    cy.get('#ops-eval-and-learning-data-sharing-starts').select('Other');

    cy.get('#ops-eval-and-learning-data-sharing-starts-other')
      .typeEnabled('the next leap year')
      .should('have.value', 'the next leap year');

    cy.get('#ops-eval-and-learning-data-sharing-frequency').within(() => {
      cy.get("input[type='text']").clickEnabled();
    });

    cy.get('[data-testid="option-OTHER"]')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.clickOutside();

    cy.get('[data-testid="multiselect-tag--Other"]').first().contains('Other');

    cy.get('#ops-eval-and-learning-data-collection-starts').select('Other');

    cy.get('#ops-eval-and-learning-data-collection-starts-other')
      .typeEnabled('the next leap year again')
      .should('have.value', 'the next leap year again');

    cy.get('#ops-eval-and-learning-data-collection-frequency').within(() => {
      cy.get("input[type='text']").clickEnabled();
    });

    cy.get('[data-testid="option-OTHER"]')
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.clickOutside();

    cy.get('[data-testid="multiselect-tag--Other"]').first().contains('Other');

    cy.get('#ops-eval-and-learning-data-reporting-starts').select('Other');

    cy.get('#ops-eval-and-learning-data-reporting-starts-other')
      .typeEnabled('the third leap year from now')
      .should('have.value', 'the third leap year from now');

    cy.contains('button', 'Next').clickEnabled();

    // Page - /ops-eval-and-learning/learning

    cy.get('#ops-eval-and-learning-learning-systems-OTHER')
      .checkEnabled({ force: true })
      .checkEnabled({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-learning-systems-other')
      .typeEnabled('We will make our own in house learning system')
      .should('have.value', 'We will make our own in house learning system');

    cy.get('#ops-eval-and-learning-learning-anticipated-challenges')
      .typeEnabled(
        'We might not have complete staffing for this. We might need to use more contractors than previously anticipated.'
      )
      .should(
        'have.value',
        'We might not have complete staffing for this. We might need to use more contractors than previously anticipated.'
      );

    cy.contains('button', 'Save and return to task list').clickEnabled();

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/models\/.{36}\/task-list/);
    });
  });
});
