import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Grid } from '@trussworks/react-uswds';
import {
  GetModelPlansQuery,
  ModelPlanFilter,
  useGetModelPlansQuery,
  ViewCustomizationType
} from 'gql/generated/graphql';

import CalendarDate from 'components/CalendarDate';
import Alert from 'components/Alert';
import Spinner from 'components/Spinner';
import usePagination from 'hooks/usePagination';

import './index.scss';

const ModelsApproachingClearance = () => {
  const { t: customHomeT } = useTranslation('customHome');

  const { data, loading } = useGetModelPlansQuery({
    variables: {
      filter: ModelPlanFilter.APPROACHING_CLEARANCE,
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
    <Grid row gap={6} className="models-approaching-clearance">
      <Grid desktop={{ col: 5 }} className="flex-align-self-center">
        <h2 className="margin-bottom-2">
          {customHomeT(
            `settings.${ViewCustomizationType.MODELS_APPROACHING_CLEARANCE}.heading`
          )}
        </h2>

        <p className="line-height-body-5 font-body-md">
          {customHomeT(
            `settings.${ViewCustomizationType.MODELS_APPROACHING_CLEARANCE}.description`
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
                    `settings.${ViewCustomizationType.MODELS_APPROACHING_CLEARANCE}.noResultsHeading`
                  )}
                >
                  {customHomeT(
                    `settings.${ViewCustomizationType.MODELS_APPROACHING_CLEARANCE}.noResultsDescription`
                  )}
                </Alert>
              ) : (
                <>
                  {currentItems.map(model => (
                    <Card key={model.id}>
                      <CalendarDate
                        dateISO={model.basics.clearanceStarts}
                        link={`/models/${model.id}/read-view`}
                        linkText={`${model.modelName}${
                          model.abbreviation ? ` (${model.abbreviation})` : ''
                        }`}
                      />
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

export default ModelsApproachingClearance;
