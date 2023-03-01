import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactPaginate from 'react-paginate';
import { useHistory, useLocation } from 'react-router-dom';
import { Grid, GridContainer, Link } from '@trussworks/react-uswds';
import classNames from 'classnames';

import Alert from 'components/shared/Alert';
import usePreviousModalRoute from 'hooks/usePreviousModalRoute';

import { HelpSolutionType, modalRoute } from '../../solutionsMap';
import SolutionHelpCard from '../SolutionHelpCard';

import './index.scss';

type SolutionHelpCardGroupProps = {
  className?: string;
  solutions: HelpSolutionType[];
  category?: string;
  setResultsNum: (offset: number) => void;
};

// Return mapped solution component based on category or query
function Solutions({
  currentSolutions,
  category
}: {
  currentSolutions: HelpSolutionType[];
  category?: string;
}) {
  return (
    <Grid row gap={2} className="margin-bottom-2">
      {currentSolutions.map(solution => (
        <Grid tablet={{ col: 4 }} key={solution.key}>
          <SolutionHelpCard solution={solution} category={category} />
        </Grid>
      ))}
    </Grid>
  );
}

const SolutionHelpCardGroup = ({
  className,
  solutions,
  category,
  setResultsNum
}: SolutionHelpCardGroupProps) => {
  const { t } = useTranslation('helpAndKnowledge');
  const { t: h } = useTranslation('generalReadOnly');

  const location = useLocation();

  // Hook used to preserve the underlying component route while navigating modal routes
  const prevLocation = usePreviousModalRoute(location, modalRoute);

  // Gets the page param while directly viewing component as well as when viewing modal overlay
  const prevParam = prevLocation?.search;
  const params = new URLSearchParams(location.search || prevParam);
  const page = params.get('page');

  const history = useHistory();

  let pageNumber = Number(page);
  pageNumber =
    pageNumber === 0 || Number.isNaN(pageNumber) ? 0 : pageNumber - 1;

  const itemsPerPage = 9;
  const [itemOffset, setItemOffset] = useState(
    (pageNumber * itemsPerPage) % solutions.length
  );
  const endOffset = itemOffset + itemsPerPage;

  const currentItems = solutions.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(solutions.length / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (event: { selected: number }) => {
    history.push(
      `/help-and-knowledge/operational-solutions?page=${event.selected + 1}`
    );
  };

  // Resets page offset when route or query changes
  useEffect(() => {
    setItemOffset((pageNumber * itemsPerPage) % solutions.length);
  }, [pageNumber, setItemOffset, solutions]);

  // Updates the result nums
  useEffect(() => {
    setResultsNum(currentItems.length);
  }, [setResultsNum, currentItems]);

  return (
    <GridContainer className={classNames(className, 'margin-top-4')}>
      {currentItems.length === 0 ? (
        <Alert
          type="info"
          heading={t('noResults.header')}
          className="margin-top-6"
        >
          <span className="mandatory-fields-alert__text">
            <span>{t('noResults.content')}</span>
            <Link
              aria-label={h('contactInfo.sendAnEmail')}
              className="line-height-body-5"
              href="mailto:MINTTeam@cms.hhs.gov"
              target="_blank"
            >
              MINTTeam@cms.hhs.gov
            </Link>
            .
          </span>
        </Alert>
      ) : (
        <>
          <Solutions currentSolutions={currentItems} category={category} />
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
              forcePage={pageNumber}
              previousLabel="< Previous"
            />
          )}
        </>
      )}
    </GridContainer>
  );
};

export default SolutionHelpCardGroup;
