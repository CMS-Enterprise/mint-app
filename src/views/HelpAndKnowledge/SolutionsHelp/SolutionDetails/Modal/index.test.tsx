import { solutionHelpRoute } from '../../solutionsMap';

import { formatQueryParam } from '.';

describe('solution help utils', () => {
  it('returns a formated query string based on modal section', () => {
    const paramValues = ['page=4', 'category=applications', 'section=timeline'];
    const section = 'about';

    const expectedQueryString =
      '/help-and-knowledge/operational-solutions?page=4&category=applications&section=about';

    expect(formatQueryParam(paramValues, section, solutionHelpRoute)).toEqual(
      expectedQueryString
    );
  });
});
