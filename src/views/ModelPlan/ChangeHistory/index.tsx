import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactPaginate from 'react-paginate';
import { useLocation, useParams } from 'react-router-dom';
import { GridContainer, Icon, SummaryBox } from '@trussworks/react-uswds';
import { useGetChangeHistoryQuery } from 'gql/gen/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import Alert from 'components/shared/Alert';
import { formatDateUtc } from 'utils/date';
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import NotFound from 'views/NotFound';

import ChangeRecord from './components/ChangeRecord';
import { sortAllChanges, sortChangesByDay } from './util';

type LocationProps = {
  state: {
    from: string;
  };
  from?: string;
};

const ChangeHistory = () => {
  const { t } = useTranslation('changeHistory');

  const { state } = useLocation<LocationProps>();

  const fromReadView = state?.from === 'readview';

  const { modelID } = useParams<{
    modelID: string;
  }>();

  const { modelName } = useContext(ModelInfoContext);

  const { data, loading, error } = useGetChangeHistoryQuery({
    variables: {
      modelPlanID: modelID
    }
  });

  const changes = [...(data?.translatedAuditCollection || [])];

  const sortedChanges = sortAllChanges(changes);

  const [pageOffset, setPageOffset] = useState(0);

  // Pagination Configuration
  const itemsPerPage = 10;
  const endOffset = pageOffset + itemsPerPage;
  const currentItems = sortedChanges?.slice(pageOffset, endOffset);
  const pageCount = sortedChanges
    ? Math.ceil(sortedChanges.length / itemsPerPage)
    : 1;

  // Invoke when user click to request another page.
  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * itemsPerPage) % sortedChanges?.length;
    setPageOffset(newOffset);
  };

  // Group changes by day
  const changesByDay = sortChangesByDay(currentItems);

  if (error) {
    return <NotFound />;
  }

  return (
    <MainContent>
      <SummaryBox
        className="padding-y-6 padding-x-2 border-0 bg-primary-lighter radius-0 margin-top-0"
        data-testid="read-only-model-summary"
      >
        <GridContainer>
          <div className="display-flex flex-justify">
            <UswdsReactLink
              to={`/models/${modelID}/${
                fromReadView ? 'read-only' : 'task-list'
              }`}
              className="display-flex flex-align-center margin-bottom-4"
            >
              <Icon.ArrowBack className="text-primary margin-right-1" />
              {fromReadView ? t('backToReadView') : t('back')}
            </UswdsReactLink>
          </div>

          <PageHeading
            className="margin-0 line-height-sans-2 minh-6 margin-bottom-2"
            headingLevel="h1"
          >
            {t('heading')}
          </PageHeading>

          <span className="font-body-lg">
            {t('subheading', {
              modelName
            })}
          </span>

          {/* TODO: implement once we have a definitive release date */}
          <div className="bg-white-opacity-50 margin-top-4 padding-y-1 padding-x-2">
            {t('changesSinceRelease')}
          </div>
        </GridContainer>
      </SummaryBox>

      <GridContainer className="padding-y-4">
        {loading ? (
          <PageLoading />
        ) : (
          <>
            {sortedChanges.length === 0 && (
              <Alert type="info" slim className="margin-bottom-2">
                {t('noChanges')}
              </Alert>
            )}

            {/* Renders the day grouping, then maps over that day's changes */}
            {Object.keys(changesByDay).map(day => {
              return (
                <div key={day}>
                  <h3 className="margin-y-4">
                    {formatDateUtc(day, 'MMMM d, yyyy')}
                  </h3>
                  {changesByDay[day].map(changeRecord => (
                    <ChangeRecord
                      changeRecord={changeRecord}
                      key={changeRecord.id}
                    />
                  ))}
                </div>
              );
            })}

            {pageCount > 1 && (
              <ReactPaginate
                breakLabel="..."
                breakClassName="usa-pagination__item usa-pagination__overflow"
                nextLabel="Next >"
                containerClassName="mint-pagination usa-pagination usa-pagination__list"
                previousLinkClassName={
                  pageOffset === 0
                    ? 'display-none'
                    : 'usa-pagination__link usa-pagination__previous-page prev-page'
                }
                nextLinkClassName={
                  pageOffset / itemsPerPage === pageCount - 1
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
                onClick={() => window.scrollTo(0, 0)}
                renderOnZeroPageCount={null}
              />
            )}
          </>
        )}
      </GridContainer>
    </MainContent>
  );
};

export default ChangeHistory;
