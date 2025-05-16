const tableAndPagination = {
  pagination: {
    previous: 'Previous',
    next: 'Next'
  },
  search: 'Search Table',
  results: {
    noResults: 'No results found',
    results: 'Showing {{currentPage}}-{{pageRange}} of {{rows}} results ',
    searchInput: 'for',
    alertHeading: `We couldn't find any matches for "{{query}}".`,
    alertDescription:
      'Double check your search for typos or try a different search.',
    resultsFor: '{{count}} result for ',
    resultsFor_other: '{{count}} results for '
  },
  pageSize: {
    show: 'Show {{value}}'
  }
};

export default tableAndPagination;
