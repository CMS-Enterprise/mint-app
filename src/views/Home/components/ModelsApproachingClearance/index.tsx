import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Grid,
  Header,
  Icon,
  PrimaryNav,
  Select
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import {
  GetModelPlansQuery,
  ModelPlanFilter,
  useGetModelPlansQuery
} from 'gql/gen/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import Alert from 'components/shared/Alert';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';
import usePagination from 'hooks/usePagination';

import './index.scss';

const ModelsApproachingClearance = () => {
  const { t: customHomeT } = useTranslation('customHome');

  const isTablet = useCheckResponsiveScreen('tablet', 'smaller');

  const { data, loading, error } = useGetModelPlansQuery({
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
    <Grid row className="models-approaching-clearance">
      <Grid desktop={{ col: 6 }}>
        <h2>{customHomeT(`settings.MODELS_APPROACHING_CLEARANCE.heading`)}</h2>
      </Grid>

      <Grid desktop={{ col: 6 }}>
        <>
          {currentItems.map(model => (
            <Card key={model.id}>{model.modelName}</Card>
          ))}

          {Pagination}
        </>
      </Grid>
    </Grid>
  );
};

export default ModelsApproachingClearance;
