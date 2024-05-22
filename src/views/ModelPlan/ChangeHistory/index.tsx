import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactPaginate from 'react-paginate';
import { useLocation, useParams } from 'react-router-dom';
import {
  GridContainer,
  Icon,
  Label,
  Select,
  SummaryBox
} from '@trussworks/react-uswds';
import { useGetChangeHistoryQuery } from 'gql/gen/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import Alert from 'components/shared/Alert';
import i18n from 'i18n';
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import NotFound from 'views/NotFound';

import ChangeRecord from './components/ChangeRecord';
import { handleSortOptions, sortAllChanges } from './util';

type LocationProps = {
  state: {
    from: string;
  };
  from?: string;
};

type SortProps = {
  value: 'newest' | 'oldest';
  label: string;
};

const sortOptions: SortProps[] = [
  {
    value: 'newest',
    label: i18n.t('changeHistory:sort.newest')
  },
  {
    value: 'oldest',
    label: i18n.t('changeHistory:sort.oldest')
  }
];

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

  const [sort, setSort] = useState<SortProps['value']>(sortOptions[0].value);

  const [auditChanges, setAuditChanges] = useState([...sortedChanges]);

  const [pageOffset, setPageOffset] = useState(0);

  const itemsPerPage = 10;

  const endOffset = pageOffset + itemsPerPage;

  const [currentItems, setCurrentItems] = useState(
    auditChanges.slice(pageOffset, endOffset)
  );

  const [pageCount, setPageCount] = useState(
    auditChanges ? Math.ceil(auditChanges.length / itemsPerPage) : 1
  );

  // Update the audit changes when the data is loaded.
  useEffect(() => {
    if (!loading) {
      setAuditChanges([...sortedChanges]);
    }
  }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update the current items when the page offset changes.
  useEffect(() => {
    setCurrentItems(auditChanges.slice(pageOffset, endOffset));
    setPageCount(
      auditChanges ? Math.ceil(auditChanges.length / itemsPerPage) : 1
    );
  }, [auditChanges, endOffset, pageOffset]);

  // Invoke when user click to request another page.
  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * itemsPerPage) % auditChanges?.length;
    setPageOffset(newOffset);
  };

  // Sort the changes when the sort option changes.
  useEffect(() => {
    setAuditChanges(handleSortOptions(auditChanges, sort));
  }, [sort]); // eslint-disable-line react-hooks/exhaustive-deps

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
          <div className="flex">
            <div
              className="margin-left-auto display-flex"
              style={{ maxWidth: '13rem' }}
            >
              <Label
                htmlFor="sort"
                className="text-normal margin-top-2 margin-right-1"
              >
                {t('sort.label')}
              </Label>

              <Select
                id="sort"
                className="margin-bottom-2"
                name="sort"
                value={sort}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  setSort(e.target.value as SortProps['value']);
                }}
              >
                {sortOptions.map(option => {
                  return (
                    <option key={`sort-${option.value}`} value={option.value}>
                      {option.label}
                    </option>
                  );
                })}
              </Select>
            </div>

            {auditChanges.length === 0 && (
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
                renderOnZeroPageCount={null}
              />
            )}
          </div>
        )}
      </GridContainer>
    </MainContent>
  );
};

export default ChangeHistory;
