import helpAndKnowledgeArticles, { HelpArticle } from '../..';

import { filterResourceArticles, handleSortOptions } from './index'; // Adjust the import to your actual file path

describe('filterResourceArticles', () => {
  it('filters articles based on the query string', () => {
    const result = filterResourceArticles(
      'Quality Vertical health equity resources on SharePoint',
      helpAndKnowledgeArticles
    );
    expect(result).toHaveLength(1);
    expect(result[0].key).toBe(HelpArticle.QUALITY_VERTICAL_HEALTH_EQUITY);
  });
});

describe('handleSortOptions', () => {
  it('sorts articles by title in ascending order', () => {
    const result = handleSortOptions(helpAndKnowledgeArticles, 'by-title-a-z');
    expect(result[0].key).toBe(HelpArticle.TWO_PAGER_MEETING);
    expect(result[1].key).toBe(HelpArticle.SIX_PAGER_MEETING);
  });

  it('sorts articles by title in descending order', () => {
    const result = handleSortOptions(helpAndKnowledgeArticles, 'by-title-z-a');
    expect(result[0].key).toBe(HelpArticle.UTILIZING_SOLUTIONS);
    expect(result[1].key).toBe(HelpArticle.STRATEGY_REFRESH_RESOURCES);
  });
});
