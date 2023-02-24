import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactPaginate from 'react-paginate';
import { useLocation } from 'react-router-dom';
import { Grid, GridContainer, Link } from '@trussworks/react-uswds';
import classNames from 'classnames';

import Alert from 'components/shared/Alert';

import { HelpSolutionType } from '../../solutionsMap';
import SolutionHelpCard from '../SolutionHelpCard';

import './index.scss';

type SolutionHelpCardGroupProps = {
  className?: string;
  solutions: HelpSolutionType[];
  category?: string;
  setResultsNum: (offset: number) => void;
  isQuery: boolean;
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

export interface LocationSolutionProps {
  pathname: string;
  state: {
    prev?: string;
  };
  prev?: string;
}

const SolutionHelpCardGroup = ({
  className,
  solutions,
  category,
  setResultsNum,
  isQuery
}: SolutionHelpCardGroupProps) => {
  const { t } = useTranslation('helpAndKnowledge');
  const { t: h } = useTranslation('generalReadOnly');

  const { pathname } = useLocation();
  const location: LocationSolutionProps = useLocation();

  const locationState = location?.state;

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

  const solutionRoute = '/help-and-knowledge/operational-solutions/solutions';

  // Resets page offset when route or query changes
  useEffect(() => {
    if (
      !pathname.includes(solutionRoute) &&
      (!locationState || !locationState?.prev?.includes(solutionRoute))
    )
      setItemOffset(0);
  }, [pathname, isQuery, locationState]);

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
              previousLabel="< Previous"
            />
          )}
        </>
      )}
    </GridContainer>
  );
};

export default SolutionHelpCardGroup;
