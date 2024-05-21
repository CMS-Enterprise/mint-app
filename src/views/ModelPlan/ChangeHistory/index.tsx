import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactPaginate from 'react-paginate';
import { useLocation, useParams } from 'react-router-dom';
import { Grid, GridContainer, Icon, SummaryBox } from '@trussworks/react-uswds';
import { useGetChangeHistoryQuery } from 'gql/gen/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import Alert from 'components/shared/Alert';
import GlobalClientFilter from 'components/TableFilter';
import { formatDateUtc } from 'utils/date';
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import NotFound from 'views/NotFound';

import ChangeRecord from './components/ChangeRecord';
import { ChangeRecordType, sortAllChanges } from './util';

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

  const searchAudits = useCallback(
    (query: string, audits: ChangeRecordType[]): ChangeRecordType[] => {
      return audits.filter(audit => {
        const lowerCaseQuery = query.toLowerCase();

        const translatedFieldsMatchQuery = audit.translatedFields.filter(
          field =>
            field.fieldNameTranslated?.toLowerCase().includes(lowerCaseQuery) ||
            field.newTranslated?.toLowerCase().includes(lowerCaseQuery) ||
            field.oldTranslated?.toLowerCase().includes(lowerCaseQuery) ||
            field.referenceLabel?.toLowerCase().includes(lowerCaseQuery)
        );

        if (audit.actorName.toLowerCase().includes(lowerCaseQuery)) {
          return true;
        }
        if (
          formatDateUtc(audit.date.replace(' ', 'T'), 'MM/dd/yyyy').includes(
            lowerCaseQuery
          )
        ) {
          return true;
        }
        if (
          t(`sections:${audit.tableName}`)
            .toLowerCase()
            .includes(lowerCaseQuery)
        ) {
          return true;
        }
        if (translatedFieldsMatchQuery.length > 0) {
          return true;
        }
        return false;
      });
    },
    [t]
  );

  const [query, setQuery] = useState<string>('');
  const [resultsNum, setResultsNum] = useState<number>(0);

  const [queryAudits, setQueryAudits] = useState<ChangeRecordType[]>(
    sortedChanges
  );

  //  If no query, return all solutions, otherwise, matching query solutions
  useEffect(() => {
    if (query.trim()) {
      const filteredAudits = searchAudits(query, sortedChanges);
      setQueryAudits(filteredAudits);
      setResultsNum(filteredAudits.length);
    } else {
      setQueryAudits(sortedChanges);
    }
    setPageOffset(0);
  }, [query, searchAudits, setPageOffset]); // eslint-disable-line react-hooks/exhaustive-deps

  const availableChanges = query ? queryAudits : sortedChanges;

  // Pagination Configuration
  const itemsPerPage = 10;
  const endOffset = pageOffset + itemsPerPage;
  const currentItems = availableChanges?.slice(pageOffset, endOffset);
  const pageCount = availableChanges
    ? Math.ceil(availableChanges.length / itemsPerPage)
    : 1;

  // Invoke when user click to request another page.
  const handlePageClick = (event: { selected: number }) => {
    const newOffset =
      (event.selected * itemsPerPage) % availableChanges?.length;
    setPageOffset(newOffset);
  };

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
            <div className="margin-bottom-2">
              <Grid tablet={{ col: 6 }}>
                <GlobalClientFilter
                  setGlobalFilter={setQuery}
                  tableID="table-id"
                  tableName="table-name"
                  className="width-full maxw-none margin-bottom-3"
                />
              </Grid>

              {query && (
                <div className="display-flex">
                  <p className="margin-y-0">
                    {t('resultsInfo', {
                      resultsNum:
                        availableChanges.length > 0
                          ? (pageOffset / itemsPerPage) * 10 + 1
                          : (pageOffset / itemsPerPage) * 10,
                      count:
                        (pageOffset / itemsPerPage) * 10 + currentItems?.length,
                      total: resultsNum,
                      query: 'for'
                    })}
                    {query && (
                      <span className="text-bold">{` "${query}"`}</span>
                    )}
                  </p>
                </div>
              )}
            </div>

            {sortedChanges.length === 0 && (
              <Alert type="info" slim className="margin-bottom-2">
                {t('noChanges')}
              </Alert>
            )}

            {currentItems.map(changeRecord => (
              <ChangeRecord changeRecord={changeRecord} key={changeRecord.id} />
            ))}

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
                forcePage={pageOffset / itemsPerPage}
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
