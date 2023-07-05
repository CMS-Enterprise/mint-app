import OperationalSolutionCategories from 'data/operationalSolutionCategories';
import { OperationalSolutionKey } from 'types/graphql-global-types';

import { helpSolutions, HelpSolutionType } from './solutionsMap';
import { findCategoryMapByRouteParam, searchSolutions } from '.';

describe('solution help utils', () => {
  it('returns a corresponding category solutions by route', () => {
    const route: OperationalSolutionCategories =
      OperationalSolutionCategories.COMMUNICATION_TOOLS;

    const foundSolutions = findCategoryMapByRouteParam(route, helpSolutions);

    const expectedSolutions = [
      {
        enum: OperationalSolutionKey.CBOSC,
        key: 'cbosc',
        route: 'consolidated-business-operations-support-center',
        categories: [OperationalSolutionCategories.COMMUNICATION_TOOLS],
        acronym: 'CBOSC',
        name: 'Consolidated Business Operations Support Center',
        pointsOfContact: [
          {
            name: 'Richard Speights',
            email: 'richard.speights@cms.hhs.gov',
            role: 'Contracting Officer Representative'
          },
          {
            name: 'Don Rocker',
            email: 'don.rocker1@cms.hhs.gov',
            role: 'Operations and Management Lead '
          }
        ],
        systemOwner: {
          name:
            'Business Services Group, Division of IT Operations and Security',
          system: 'Center for Medicare and Medicaid Innovation'
        },
        contractors: [
          {
            name: 'NewWave',
            system: 'Innovation Development and Operation Services (IDOS)'
          }
        ],
        components: {}
      }
    ];

    expect(foundSolutions).toEqual(expectedSolutions);
  });

  it('returns a corresponding solutions by query string', () => {
    const query: string = '4inn';

    const expectedSolutions: HelpSolutionType[] = [helpSolutions[0]];

    expect(searchSolutions(query, helpSolutions)).toEqual(expectedSolutions);

    const query2: string = 'gfwefesd';

    const expectedSolutions2: HelpSolutionType[] = [];

    expect(searchSolutions(query2, helpSolutions)).toEqual(expectedSolutions2);
  });
});
