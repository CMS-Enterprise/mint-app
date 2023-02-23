import OperationalSolutionCategories from 'data/operationalSolutionCategories';
import { OperationalSolutionKey } from 'types/graphql-global-types';

import { helpSolutions } from './solutionsMap';
import { findCategoryKey, findCategoryMapByRoute, seachSolutions } from '.';

describe('solution help utils', () => {
  it('returns a corresponding category key by route', () => {
    const route = 'contractors-and-contract-vehicles';

    const expectedCategoryKey = 'contractorsContractVehicles';

    expect(findCategoryKey(route)).toEqual(expectedCategoryKey);
  });

  it('returns a corresponding category solutions by route', () => {
    const route = 'learning';

    const expectedSolutions = [
      {
        enum: null,
        key: 'learningAndDiffusion',
        route: 'learning-and-diffusion-group',
        categories: [OperationalSolutionCategories.LEARNING],
        acronym: 'LDG',
        name: 'Learning and Diffusion Group',
        pointsOfContact: [
          {
            name: 'Andrew Philip',
            email: 'andrew.philip@cms.hhs.gov',
            role: 'Director, Division of Model Learning Systems (DMLS)'
          }
        ]
      },
      {
        enum: OperationalSolutionKey.CONNECT,
        key: 'salesforceConnect',
        route: 'salesforce-connect',
        categories: [OperationalSolutionCategories.LEARNING],
        name: 'Salesforce Connect',
        pointsOfContact: [
          {
            name: 'Elia Cossis',
            email: 'elia.cossis@cms.hhs.gov',
            role: 'Platform Lead'
          }
        ]
      }
    ];
    expect(findCategoryMapByRoute(route, helpSolutions)).toEqual(
      expectedSolutions
    );
  });

  it('returns a corresponding category mapped object by route', () => {
    const route = '4inn';

    const expectedSolutions = [
      {
        enum: OperationalSolutionKey.INNOVATION,
        key: 'innovation',
        route: '4-innovation',
        categories: [OperationalSolutionCategories.DATA_REPORTING],
        acronym: '4i',
        name: '4innovation',
        pointsOfContact: [
          {
            name: '4i/ACO-OS Team',
            email: 'ACO-OIT@cms.hhs.gov'
          }
        ]
      }
    ];

    expect(seachSolutions(route, helpSolutions)).toEqual(expectedSolutions);
  });
});
