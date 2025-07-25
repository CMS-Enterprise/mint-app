import {
  MtoCommonSolutionKey,
  MtoCommonSolutionSubject
} from 'gql/generated/graphql';

import { helpSolutionsArray, HelpSolutionType } from './solutionsMap';
import { findCategoryMapByRouteParam, searchSolutions } from '.';

describe('solution help utils', () => {
  it('returns a corresponding category solutions by route', () => {
    const foundSolutions = findCategoryMapByRouteParam(
      MtoCommonSolutionSubject.LEGAL,
      helpSolutionsArray
    );

    const expectedSolutions = [
      {
        key: MtoCommonSolutionKey.LV,
        categories: [MtoCommonSolutionSubject.LEGAL],
        acronym: 'LV',
        name: 'Legal Vertical'
      }
    ];

    expect(foundSolutions.length).toEqual(expectedSolutions.length);
    expect(foundSolutions.length).toEqual(1);
    expect(foundSolutions[0].key).toEqual(expectedSolutions[0].key);
  });

  it('returns a corresponding solutions by query string', () => {
    const query: string = '4inn';

    const expectedSolutions: HelpSolutionType[] = [helpSolutionsArray[0]];

    expect(searchSolutions(query, helpSolutionsArray)).toEqual(
      expectedSolutions
    );

    const query2: string = 'gfwefesd';

    const expectedSolutions2: HelpSolutionType[] = [];

    expect(searchSolutions(query2, helpSolutionsArray)).toEqual(
      expectedSolutions2
    );
  });
});
