import React, { useContext, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  ButtonGroup,
  CardGroup,
  Grid,
  GridContainer,
  Icon
} from '@trussworks/react-uswds';
import { TemplateCardType } from 'features/ModelPlan/ModelToOperations/_components/TemplateCard';
import NotFound from 'features/NotFound';
import { useGetMtoTemplatesQuery } from 'gql/generated/graphql';
import { mtoTemplateMock } from 'tests/mock/mto';

import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import CheckboxField from 'components/CheckboxField';
import Expire from 'components/Expire';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageLoading from 'components/PageLoading';
import Sidepanel from 'components/Sidepanel';
import GlobalClientFilter from 'components/TableFilter';
import TablePageSize from 'components/TablePageSize';
import TableResults from 'components/TableResults';
import { MTOModalContext } from 'contexts/MTOModalContext';
import useMessage from 'hooks/useMessage';
import usePagination from 'hooks/usePagination';
import useSearchSortPagination from 'hooks/useSearchSortPagination';

import TemplateCard from '../_components/TemplateCard';
import { MilestoneCardType } from '../MilestoneLibrary';

const TemplateLibrary = () => {
  const { modelID = '' } = useParams<{ modelID: string }>();
  const { t } = useTranslation('modelToOperationsMisc');

  const templates = mtoTemplateMock?.[0]?.result?.data?.mtoTemplates || [];

  const { data, loading, error } = useGetMtoTemplatesQuery();

  const dataAvalilable: boolean = true;
  //   const dataAvalilable: boolean = !loading || !!data?.mtoTemplates;

  //   const templates = useMemo(
  //     () => data?.mtoTemplates || [],
  //     [data?.mtoTemplates]
  //   );

  if (error) {
    return <NotFound errorMessage={error.message} />;
  }

  return (
    <GridContainer>
      <Breadcrumbs
        items={[
          BreadcrumbItemOptions.HOME,
          BreadcrumbItemOptions.COLLABORATION_AREA,
          BreadcrumbItemOptions.MODEL_TO_OPERATIONS
        ]}
        customItem={t('templateLibrary.heading')}
      />

      <h1 className="margin-bottom-2 margin-top-5 line-height-large">
        {t('templateLibrary.heading')}
      </h1>

      <p className="mint-body-large margin-bottom-2 margin-top-05">
        {t('templateLibrary.description')}
      </p>

      <div className="margin-bottom-6">
        <UswdsReactLink
          to={`/models/${modelID}/collaboration-area/model-to-operations/matrix`}
          data-testid="return-to-mto"
        >
          <span>
            <Icon.ArrowBack
              className="top-3px margin-right-1"
              aria-label="back"
            />
            {t('templateLibrary.returnToMTO')}
          </span>
        </UswdsReactLink>
      </div>

      {!dataAvalilable ? (
        <PageLoading />
      ) : (
        <TemplateCardGroup templates={templates} />
      )}
    </GridContainer>
  );
};

const searchTemplates = (
  query: string,
  items: TemplateCardType[]
): TemplateCardType[] => {
  return items.filter(
    template =>
      template.name.toLowerCase().includes(query.toLowerCase()) ||
      template.description?.toLowerCase().includes(query.toLowerCase())
  );
};

const TemplateCardGroup = ({
  templates
}: {
  templates: TemplateCardType[];
}) => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { modelID = '' } = useParams<{ modelID: string }>();

  const navigate = useNavigate();

  const { clearMessage, message } = useMessage();

  const {
    setMTOModalOpen: setIsModalOpen,
    setMTOModalState,
    isMTOModalOpen
  } = useContext(MTOModalContext);

  // Query parameters
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const templateParam: string = params.get('template') || '';
  //   const addedTemplatesHidden = params.get('hide-added-templates') === 'true';

  const [, setIsSidepanelOpen] = useState(false);

  const selectedTemplate: TemplateCardType | undefined = useMemo(() => {
    return templates.find(template => template.key === templateParam);
  }, [templates, templateParam]);

  //   const addedMilestones = useMemo(
  //     () => templates.filter(template => template.isAdded),
  //     [templates]
  //   );

  //   // Filter the milestones based on the Hide added milestones checkbox
  //   const milestonesNotAdded = useMemo(
  //     () =>
  //       templates.filter(template => {
  //         if (addedTemplatesHidden) {
  //           return !template.isAdded;
  //         }
  //         return template;
  //       }),
  //     [templates, addedTemplatesHidden]
  //   );

  const { allItems, search, pageSize } = useSearchSortPagination<
    TemplateCardType,
    any
  >({
    items: templates,
    filterFunction: useMemo(() => searchTemplates, []),
    sortFunction: (items: TemplateCardType[], sort: any) => items,
    sortOptions: [
      {
        value: '',
        label: ''
      }
    ],
    defaultItemsPerPage: 6
  });

  const { query, setQuery, rowLength } = search;

  const { itemsPerPage, setItemsPerPage } = pageSize;

  const {
    currentItems,
    Pagination: PaginationComponent,
    pagination: { currentPage, pageCount }
  } = usePagination<TemplateCardType[]>({
    items: allItems,
    itemsPerPage,
    withQueryParams: 'page',
    showPageIfOne: true
  });

  return (
    <>
      <Sidepanel
        isOpen={!!selectedTemplate}
        closeModal={() => {
          params.delete('template');
          navigate({ search: params.toString() }, { replace: true });
          setIsSidepanelOpen(false);
        }}
        ariaLabel={t('modal.editTemplate.templateTitle')}
        testid="milestone-sidepanel"
        modalHeading={t('modal.editTemplate.templateTitle')}
        noScrollable
      >
        <></>
        {/* {selectedTemplate && <TemplatePanel template={selectedTemplate} />} */}
      </Sidepanel>

      {!isMTOModalOpen && message && <Expire delay={45000}>{message}</Expire>}

      <div className="template-card-group">
        <div className="margin-top-2">
          <Grid row>
            <Grid tablet={{ col: 6 }}>
              {/* Search bar and results info */}
              <GlobalClientFilter
                globalFilter={query}
                setGlobalFilter={setQuery}
                tableID="help-articles"
                tableName=""
                className="margin-bottom-3 maxw-none tablet:width-mobile-lg"
              />
            </Grid>

            {!!query && (
              <Grid desktop={{ col: 12 }}>
                <TableResults
                  globalFilter={query}
                  pageIndex={currentPage - 1}
                  pageSize={itemsPerPage}
                  filteredRowLength={rowLength}
                  rowLength={allItems.length}
                  showAlert={false}
                />
              </Grid>
            )}

            {/* <Grid
              desktop={{ col: 12 }}
              className="display-flex flex-wrap margin-bottom-2"
            >
              <CheckboxField
                id="hide-added-milestones"
                name="hide-added-milestones"
                label={t('milestoneLibrary.hideAdded', {
                  count: addedMilestones.length
                })}
                value="true"
                checked={addedMilestonesHidden}
                onBlur={() => null}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  params.set(
                    'hide-added-milestones',
                    addedMilestonesHidden ? 'false' : 'true'
                  );
                  navigate({ search: params.toString() }, { replace: true });
                }}
              />
            </Grid> */}
          </Grid>
        </div>

        <div>
          <CardGroup className="padding-x-1">
            <Grid desktop={{ col: 12 }}>
              <Grid row gap={2}>
                {currentItems.map(template => (
                  <Grid
                    desktop={{ col: 4 }}
                    tablet={{ col: 6 }}
                    key={template.key}
                  >
                    <TemplateCard
                      template={template}
                      setIsSidepanelOpen={setIsSidepanelOpen}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </CardGroup>

          {/* {!!query && currentItems.length === 0 && (
            <>
              <Alert
                type={addedTemplatesHidden ? 'info' : 'warning'}
                heading={t('milestoneLibrary.alertHeading', {
                  query
                })}
              >
                <Trans
                  t={t}
                  i18nKey="milestoneLibrary.alertDescription"
                  components={{
                    email: <Link href="mailto:MINTTeam@cms.hhs.gov"> </Link>
                  }}
                />
              </Alert>
            </>
          )} */}

          {/* Pagination */}
          <div className="display-flex flex-wrap">
            {currentItems.length > 0 && pageCount > 0 && (
              <>{PaginationComponent}</>
            )}

            {currentItems.length > 0 && (
              <TablePageSize
                className="margin-left-auto desktop:grid-col-auto"
                pageSize={itemsPerPage}
                setPageSize={setItemsPerPage}
                valueArray={[6, 9, 'all']}
                suffix={t('templates').toLowerCase()}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TemplateLibrary;
