import React, { useContext, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  CardGroup,
  Grid,
  GridContainer,
  Icon,
  Link
} from '@trussworks/react-uswds';
import { TemplateCardType } from 'features/ModelPlan/ModelToOperations/_components/TemplateCard';
import NotFound from 'features/NotFound';
import { useGetMtoModelPlanTemplatesQuery } from 'gql/generated/graphql';

import Alert from 'components/Alert';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import CheckboxField from 'components/CheckboxField';
import Expire from 'components/Expire';
import UswdsReactLink from 'components/LinkWrapper';
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
import TemplatePanel from '../_components/TemplatePanel';

const TemplateLibrary = () => {
  const { modelID = '' } = useParams<{ modelID: string }>();
  const { t } = useTranslation('modelToOperationsMisc');

  const { data, loading, error } = useGetMtoModelPlanTemplatesQuery({
    variables: {
      id: modelID
    }
  });

  const dataAvalilable: boolean =
    !loading || !!data?.modelPlan?.mtoMatrix?.mtoTemplates;

  const templates = useMemo(
    () => data?.modelPlan?.mtoMatrix?.mtoTemplates || [],
    [data?.modelPlan?.mtoMatrix?.mtoTemplates]
  );

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

  const navigate = useNavigate();

  const { message } = useMessage();

  const { isMTOModalOpen } = useContext(MTOModalContext);

  // Query parameters
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const templateParam: string = params.get('template') || '';
  const addedTemplatesHidden = params.get('hide-added-templates') === 'true';

  const [, setIsSidepanelOpen] = useState(false);

  const selectedTemplate: TemplateCardType | undefined = useMemo(() => {
    return templates.find(template => template.key === templateParam);
  }, [templates, templateParam]);

  const addedTemplates = useMemo(
    () => templates.filter(template => template.isAdded),
    [templates]
  );

  // Filter the milestones based on the Hide added milestones checkbox
  const templatesNotAdded = useMemo(
    () =>
      templates.filter(template => {
        if (addedTemplatesHidden) {
          return !template.isAdded;
        }
        return template;
      }),
    [templates, addedTemplatesHidden]
  );

  const { allItems, search, pageSize } = useSearchSortPagination<
    TemplateCardType,
    any
  >({
    items: templatesNotAdded,
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
        ariaLabel={t('templateLibrary.aboutThisTemplate')}
        testid="template-sidepanel"
        modalHeading={t('templateLibrary.aboutThisTemplate')}
        noScrollable
      >
        {selectedTemplate && <TemplatePanel template={selectedTemplate} />}
      </Sidepanel>

      {!isMTOModalOpen && message && <Expire delay={45000}>{message}</Expire>}

      <div className="template-card-group">
        <div className="margin-top-2">
          <Grid row>
            <Grid desktop={{ col: 12 }}>
              {/* Search bar and results info */}
              <div className="display-flex flex-wrap margin-bottom-2">
                <GlobalClientFilter
                  globalFilter={query}
                  setGlobalFilter={setQuery}
                  tableID="help-articles"
                  tableName=""
                  className="margin-bottom-3 maxw-none tablet:width-mobile-lg margin-right-4"
                />

                <div className="margin-top-05">
                  <CheckboxField
                    id="hide-added-templates"
                    name="hide-added-templates"
                    label={t('templateLibrary.hideAdded', {
                      count: addedTemplates.length
                    })}
                    value="true"
                    checked={addedTemplatesHidden}
                    onBlur={() => null}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      params.set(
                        'hide-added-templates',
                        addedTemplatesHidden ? 'false' : 'true'
                      );
                      navigate(
                        { search: params.toString() },
                        { replace: true }
                      );
                    }}
                    noMargin
                  />
                </div>
              </div>
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
                    <TemplateCard template={template} />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </CardGroup>

          {!!query && currentItems.length === 0 && (
            <>
              <Alert
                type={addedTemplatesHidden ? 'info' : 'warning'}
                heading={t('templateLibrary.alertHeading', {
                  query
                })}
              >
                <Trans
                  t={t}
                  i18nKey="templateLibrary.alertDescription"
                  components={{
                    email: <Link href="mailto:MINTTeam@cms.hhs.gov"> </Link>
                  }}
                />
              </Alert>
            </>
          )}

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
