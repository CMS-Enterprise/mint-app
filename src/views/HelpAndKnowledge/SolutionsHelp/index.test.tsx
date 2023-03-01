import React from 'react';

import OperationalSolutionCategories from 'data/operationalSolutionCategories';
import { OperationalSolutionKey } from 'types/graphql-global-types';

import Innovation4Timeline from './SolutionDetails/Solutions/4Innovation';
import { helpSolutions, HelpSolutionType } from './solutionsMap';
import { findCategoryMapByRoute, searchSolutions } from '.';

describe('solution help utils', () => {
  it('returns a corresponding category solutions by route', () => {
    const route: string = 'learning';

    const expectedSolutions: HelpSolutionType[] = [
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
        ],
        components: {
          timeline: props => <Innovation4Timeline {...props} />
        }
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
        ],
        components: {
          timeline: props => <Innovation4Timeline {...props} />
        }
      }
    ];
    expect(findCategoryMapByRoute(route, helpSolutions)).toEqual(
      expectedSolutions
    );
  });

  it('returns a corresponding solutions by query string', () => {
    const query: string = '4inn';

    const expectedSolutions: HelpSolutionType[] = [
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
        ],
        components: {
          timeline: props => <Innovation4Timeline {...props} />
        }
      }
    ];

    expect(searchSolutions(query, helpSolutions)).toEqual(expectedSolutions);

    const query2: string = 'gfwefesd';

    const expectedSolutions2: HelpSolutionType[] = [];

    expect(searchSolutions(query2, helpSolutions)).toEqual(expectedSolutions2);
  });
});
