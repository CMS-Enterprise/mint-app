export interface ModelPlanSchema {
  id: string;
  modelName: string;
  status: string;
}

Cypress.Commands.add(
  'seedModelPlan',
  (options: ModelPlanSchema): Cypress.Chainable<ModelPlanSchema> => {
    return cy
      .exec('scripts/seed_database modelPlan', {
        env: {
          SEED_INPUT: JSON.stringify(options)
        }
      })
      .then(result => {
        Cypress.log({
          name: 'seedModelPlan',
          displayName: 'result',
          message: [result.stdout]
        });
        return JSON.parse(result.stdout);
      });
  }
);
