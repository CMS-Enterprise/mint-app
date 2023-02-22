import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useLocation } from 'react-router-dom';
import { Grid, GridContainer } from '@trussworks/react-uswds';
import classNames from 'classnames';

import { HelpSolutionType } from '../../solutionsMap';
import SolutionHelpCard from '../SolutionHelpCard';

import './index.scss';

type SolutionHelpCardGroupProps = {
  className?: string;
  solutions: HelpSolutionType[];
  setResultsNum: (offset: number) => void;
};

function Solutions({
  currentSolutions
}: {
  currentSolutions: HelpSolutionType[];
}) {
  return (
    <Grid row gap={2} className="margin-bottom-2">
      {currentSolutions.map(solution => (
        <Grid tablet={{ col: 4 }} key={solution.key}>
          <SolutionHelpCard solution={solution} />
        </Grid>
      ))}
    </Grid>
  );
}

const SolutionHelpCardGroup = ({
  className,
  solutions,
  setResultsNum
}: SolutionHelpCardGroupProps) => {
  const { pathname } = useLocation();

  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 9;
  const endOffset = itemOffset + itemsPerPage;

  const currentItems = solutions.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(solutions.length / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * itemsPerPage) % solutions.length;
    setItemOffset(newOffset);
    setResultsNum(newOffset + itemsPerPage);
  };

  useEffect(() => {
    setItemOffset(0);
  }, [pathname]);

  useEffect(() => {
    setResultsNum(currentItems.length);
  }, [setResultsNum, currentItems]);

  return (
    <GridContainer className={classNames(className, 'margin-top-4')}>
      <Solutions currentSolutions={currentItems} />
      {pageCount > 1 && (
        <ReactPaginate
          breakLabel="..."
          breakClassName="usa-pagination__item usa-pagination__overflow"
          nextLabel="Next >"
          containerClassName="mint-pagination usa-pagination usa-pagination__list"
          previousLinkClassName={
            itemOffset === 0
              ? 'display-none'
              : 'usa-pagination__link usa-pagination__previous-page prev-page'
          }
          nextLinkClassName={
            itemOffset / itemsPerPage === pageCount - 1
              ? 'display-none'
              : 'usa-pagination__link usa-pagination__previous-page next-page'
          }
          disabledClassName="pagination__link--disabled"
          activeClassName="usa-current"
          activeLinkClassName="usa-current"
          pageClassName="usa-pagination__item"
          pageLinkClassName="usa-pagination__button"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="< Previous"
        />
      )}
    </GridContainer>
  );
};

export default SolutionHelpCardGroup;
