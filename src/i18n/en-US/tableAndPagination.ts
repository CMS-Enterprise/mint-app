const tableAndPagination = {
  pagination: {
    previous: 'Previous',
    next: 'Next'
  },
  search: 'Search Table',
  results: {
    noResults: 'No results found',
    results:
      'Showing <1>{{currentPage}}</1>-<1>{{pageRange}}</1> of <1>{{rows}}</1> results ',
    searchInput: 'for',
    alertHeading: `We couldn't find any matches for "{{query}}".`,
    alertDescription:
      'Double check your search for typos or try a different search.'
  }
};

export default tableAndPagination;
