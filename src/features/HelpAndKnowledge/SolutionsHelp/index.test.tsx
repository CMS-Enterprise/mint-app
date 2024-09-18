import { OperationalSolutionCategories } from 'features/ModelPlan/TaskList/ITSolutions/operationalSolutionCategories';
import { OperationalSolutionKey } from 'gql/generated/graphql';

import { helpSolutions, HelpSolutionType } from './solutionsMap';
import { findCategoryMapByRouteParam, searchSolutions } from '.';

describe('solution help utils', () => {
  it('returns a corresponding category solutions by route', () => {
    const route: OperationalSolutionCategories =
      OperationalSolutionCategories.LEGAL;

    const foundSolutions = findCategoryMapByRouteParam(route, helpSolutions);

    const expectedSolutions = [
      {
        enum: OperationalSolutionKey.LV,
        key: 'legalVertical',
        route: 'legal-vertical',
        categories: [OperationalSolutionCategories.LEGAL],
        acronym: 'LV',
        name: 'Legal Vertical'
      }
    ];

    expect(foundSolutions.length).toEqual(expectedSolutions.length);
    expect(foundSolutions.length).toEqual(1);
    expect(foundSolutions[0].enum).toEqual(expectedSolutions[0].enum);
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
