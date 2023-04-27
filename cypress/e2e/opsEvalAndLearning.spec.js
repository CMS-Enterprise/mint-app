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

    cy.wait('@GetModelPlan')
      .its('response.statusCode')
      .should('eq', 200)
      .wait(500);

    // Clicks the Ops Eval and Learning tasklist item
    cy.get('[data-testid="ops-eval-and-learning"]').click();

    cy.wait('@GetOpsEvalAndLearning')
      .its('response.statusCode')
      .should('eq', 200)
      .wait(500);

    cy.location().should(loc => {
      expect(loc.pathname).to.match(
        /\/models\/.{36}\/task-list\/ops-eval-and-learning/
      );
    });

    // Page - /ops-eval-and-learning
    cy.get('[data-testid="model-plan-name"]').contains('for Empty Plan');

    cy.get('#ops-eval-and-learning-agency-or-state-help-YES_AGENCY_IAA')
      .check({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-agency-or-state-help-OTHER')
      .check({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-agency-or-state-help-other')
      .type('Department of Motor Vehicles')
      .should('have.value', 'Department of Motor Vehicles');

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

    cy.get('#ops-eval-and-learning-iddoc-support')
      .check({ force: true })
      .should('be.checked');

    cy.contains('button', 'Next').click();

    // Page - /ops-eval-and-learning/iddoc

    cy.wait('@GetIDDOC').its('response.statusCode').should('eq', 200).wait(500);

    cy.get('#ops-eval-and-learning-technical-contacts-identified-use-true').as(
      'contacts'
    );
    cy.get('@contacts').check({ force: true });
    cy.get('@contacts').should('be.checked');

    cy.get('#ops-eval-and-learning-technical-contacts-identified-detail').as(
      'technical-contacts'
    );
    cy.get('@technical-contacts').type('Bill in accounting');
    cy.get('@technical-contacts').should('have.value', 'Bill in accounting');

    cy.get('#ops-eval-and-learning-capture-participant-info')
      .check({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-capture-icd-owner')
      .as('icd-owner')
      .type('Mark in accounting');
    cy.get('@icd-owner').should('have.value', 'Mark in accounting');

    cy.get('#ops-eval-and-learning-icd-due-date')
      .type('10/26/2028')
      .should('have.value', '10/26/2028');

    cy.contains('button', 'Next').click();

    // Page - /ops-eval-and-learning/iddoc-testing

    cy.wait('@GetIDDOCTesting')
      .its('response.statusCode')
      .should('eq', 200)
      .wait(500);

    cy.get('#ops-eval-and-learning-uat-needs')
      .type('Users to make sure this works correctly')
      .should('have.value', 'Users to make sure this works correctly');

    cy.get('#ops-eval-and-learning-stc-needs')
      .type('Realistic information needed to ensure accuracy')
      .should('have.value', 'Realistic information needed to ensure accuracy');

    cy.get('#ops-eval-and-learning-testing-timelines')
      .type(
        'testing will start in October, and hsould conclude by the 1st of December'
      )
      .should(
        'have.value',
        'testing will start in October, and hsould conclude by the 1st of December'
      );

    cy.get('#ops-eval-and-learning-data-monitoring-file-OTHER')
      .check({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-data-monitoring-file-other')
      .type('suplementary')
      .should('have.value', 'suplementary');

    cy.get('#ops-eval-and-learning-data-response-type')
      .type('survey responses')
      .should('have.value', 'survey responses');

    cy.get('#ops-eval-and-learning-data-file-frequency')
      .type('Every 3 weeks')
      .should('have.value', 'Every 3 weeks');

    cy.contains('button', 'Next').click();

    // Page - /ops-eval-and-learning/iddoc-monitoring

    cy.wait('@GetIDDOCMonitoring')
      .its('response.statusCode')
      .should('eq', 200)
      .wait(200);

    cy.get('#ops-eval-and-learning-fulltime-or-incremental-INCREMENTAL')
      .check({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-eft-setup-true')
      .check({ force: true })
      .check({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-unsolicted-adjustment-included-true')
      .check({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-diagrams-needed-true')
      .check({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-produce-benefit-files-true')
      .check({ force: true })
      .should('be.checked');

    cy.get('#ops-eval-and-learning-file-naming-convention')
      .type('files start with s and are .xslx files')
      .should('have.value', 'files start with s and are .xslx files');

    cy.contains('button', 'Next').click();

    // Page - /ops-eval-and-learning/performance

    cy.wait('@GetPerformance')
      .its('response.statusCode')
      .should('eq', 200)
      .wait(500);

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

    cy.wait('@GetEvaluation')
      .its('response.statusCode')
      .should('eq', 200)
      .wait(500);

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

    cy.wait('@GetCCWAndQuality')
      .its('response.statusCode')
      .should('eq', 200)
      .wait(500);

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

    cy.wait('@GetDataSharing')
      .its('response.statusCode')
      .should('eq', 200)
      .wait(500);

    cy.get('#ops-eval-and-learning-data-sharing-starts').select('Other');

    cy.get('#ops-eval-and-learning-data-sharing-starts-other')
      .type('the next leap year')
      .should('have.value', 'the next leap year');

    cy.get('#ops-eval-and-learning-data-sharing-frequency').within(() => {
      cy.get("input[type='text']").click();
    });

    cy.get('[data-testid="option-OTHER"]')
      .check({ force: true })
      .should('be.checked');

    cy.clickOutside();

    cy.get('[data-testid="multiselect-tag--Other"]').first().contains('Other');

    cy.get('#ops-eval-and-learning-data-collection-starts').select('Other');

    cy.get('#ops-eval-and-learning-data-collection-starts-other')
      .type('the next leap year again')
      .should('have.value', 'the next leap year again');

    cy.get('#ops-eval-and-learning-data-collection-frequency').within(() => {
      cy.get("input[type='text']").click();
    });

    cy.get('[data-testid="option-OTHER"]')
      .check({ force: true })
      .should('be.checked');

    cy.clickOutside();

    cy.get('[data-testid="multiselect-tag--Other"]').first().contains('Other');

    cy.get('#ops-eval-and-learning-data-reporting-starts').select('Other');

    cy.get('#ops-eval-and-learning-data-reporting-starts-other')
      .type('the third leap year from now')
      .should('have.value', 'the third leap year from now');

    cy.contains('button', 'Next').click();

    // Page - /ops-eval-and-learning/learning

    cy.wait('@GetLearning')
      .its('response.statusCode')
      .should('eq', 200)
      .wait(500);

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

    cy.contains('button', 'Save and return to task list').click();

    cy.wait('@GetModelPlan')
      .its('response.statusCode')
      .should('eq', 200)
      .wait(500);

    cy.location().should(loc => {
      expect(loc.pathname).to.match(/\/models\/.{36}\/task-list/);
    });
  });
});
