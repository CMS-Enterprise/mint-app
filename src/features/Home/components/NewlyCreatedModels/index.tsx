import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Grid, Icon } from '@trussworks/react-uswds';
import {
  GetModelPlansQuery,
  ModelPlanFilter,
  useGetModelPlansQuery,
  ViewCustomizationType
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import CalendarDate from 'components/CalendarDate';
import UswdsReactLink from 'components/LinkWrapper';
import Spinner from 'components/Spinner';
import usePagination from 'hooks/usePagination';

import '../../index.scss';

const NewlyCreatedModels = () => {
  const { t: customHomeT } = useTranslation('customHome');

  const { data, loading } = useGetModelPlansQuery({
    variables: {
      filter: ModelPlanFilter.NEWLY_CREATED,
      isMAC: false
    }
  });

  const models = useMemo(() => {
    return data?.modelPlanCollection || [];
  }, [data?.modelPlanCollection]);

  const { currentItems, Pagination } = usePagination<
    GetModelPlansQuery['modelPlanCollection']
  >({
    items: models,
    itemsPerPage: 3,
    loading
  });

  return (
    <Grid row gap={6}>
      <Grid desktop={{ col: 5 }} className="flex-align-self-center">
        <h2 className="margin-bottom-2">
          {customHomeT(
            `settings.${ViewCustomizationType.NEWLY_CREATED_MODEL_PLANS}.heading`
          )}
        </h2>

        <p className="line-height-body-5 font-body-md">
          {customHomeT(
            `settings.${ViewCustomizationType.NEWLY_CREATED_MODEL_PLANS}.description`
          )}
        </p>
      </Grid>

      <Grid desktop={{ col: 7 }}>
        <>
          {loading ? (
            <div className="display-flex flex-justify-center margin-top-4">
              <Spinner />
            </div>
          ) : (
            <>
              {currentItems.length === 0 ? (
                <Alert
                  type="info"
                  className="margin-top-4"
                  heading={customHomeT(
                    `settings.${ViewCustomizationType.NEWLY_CREATED_MODEL_PLANS}.noResultsHeading`
                  )}
                >
                  {customHomeT(
                    `settings.${ViewCustomizationType.NEWLY_CREATED_MODEL_PLANS}.noResultsDescription`
                  )}
                </Alert>
              ) : (
                <>
                  {currentItems.map(model => (
                    <Card key={model.id} className="home__card">
                      <div className="usa-collection__item border-0 padding-0 margin-0">
                        <UswdsReactLink
                          to={`/models/${model.id}/read-view`}
                          aria-label={model.modelName}
                        >
                          <span>
                            <h4 className="usa-collection__heading display-inline margin-right-1 font-body-md">
                              {model.modelName}
                            </h4>
                            <Icon.ArrowForward
                              className="top-3px"
                              aria-label="forward"
                            />
                          </span>
                        </UswdsReactLink>
                      </div>
                    </Card>
                  ))}

                  {Pagination}
                </>
              )}
            </>
          )}
        </>
      </Grid>
    </Grid>
  );
};

export default NewlyCreatedModels;
