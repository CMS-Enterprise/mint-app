// Used to render the current page based on certain answers populated within this task list item
export const renderCurrentPage = (
  currentPage: number,
  hasClaims: boolean,
  hasNonClaims: boolean,
  hasReductionCostSharing: boolean
) => {
  let adjustedCurrentPage = currentPage;
  if (currentPage > 2 && !hasClaims) adjustedCurrentPage -= 2;
  if (currentPage > 3 && !hasReductionCostSharing) adjustedCurrentPage -= 1;
  if (currentPage > 5 && !hasNonClaims) adjustedCurrentPage -= 1;
  return adjustedCurrentPage;
};

// Used to render the total pages based on certain answers populated within this task list item
export const renderTotalPages = (
  hasClaims: boolean,
  hasNonClaims: boolean,
  hasReductionCostSharing: boolean
) => {
  let totalPages = 3;
  if (hasClaims) totalPages += 2;
  if (hasNonClaims) totalPages += 1;
  if (hasReductionCostSharing) totalPages += 1;
  return totalPages;
};
