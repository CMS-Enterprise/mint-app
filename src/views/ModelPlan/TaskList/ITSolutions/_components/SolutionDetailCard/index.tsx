/*
SolutionDetailCard component used to display solution information
Contains NeedQuestionAndAnswer component, SolutionCard component, and NeedsStatus
Contains additional info - dates, status, etc
*/

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button, Grid } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { GetOperationalSolutionQuery } from 'gql/gen/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import Divider from 'components/shared/Divider';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';
import { formatDateUtc } from 'utils/date';

import NeedQuestionAndAnswer from '../NeedQuestionAndAnswer';
import OperationalNeedsStatusTag from '../NeedsStatus';
import SolutionCard from '../SolutionCard';

type OperationalSolutionType = GetOperationalSolutionQuery['operationalSolution'];

type SolutionDetailCardProps = {
  solution: OperationalSolutionType;
  operationalNeedID: string;
  operationalSolutionID: string;
  modelID: string;
  className?: string;
  isUpdatingStatus?: boolean;
};

const SolutionDetailCard = ({
  solution,
  operationalNeedID,
  operationalSolutionID,
  modelID,
  className,
  isUpdatingStatus = false
}: SolutionDetailCardProps) => {
  const { t } = useTranslation('itSolutions');

  const history = useHistory();

  const tablet = useCheckResponsiveScreen('tablet', 'smaller');

  return (
    <div className={classNames('bg-base-lightest', className)}>
      <NeedQuestionAndAnswer
        operationalNeedID={operationalNeedID}
        modelID={modelID}
        expanded={!isUpdatingStatus}
        isRenderingOnSolutionsDetails
      />

      {!isUpdatingStatus && (
        <div className="padding-x-3 padding-top-0">
          <Divider className="margin-bottom-3" />
        </div>
      )}

      <Grid row gap className="padding-x-3 padding-bottom-3">
        <Grid desktop={{ col: isUpdatingStatus ? 12 : 6 }}>
          <p className="text-bold margin-top-0 margin-bottom-1">
            {t('solution')}
          </p>
          <SolutionCard solution={solution} shadow />
          <div
            className={classNames('margin-y-1', {
              'margin-bottom-4': tablet
            })}
          >
            <UswdsReactLink
              to={`/models/${modelID}/task-list/it-solutions/${operationalNeedID}/select-solutions?update=true`}
              data-testid="update-solutions-link"
            >
              {t('updateSolutionsLink')}
            </UswdsReactLink>
          </div>
        </Grid>
        {!isUpdatingStatus && (
          <Grid desktop={{ col: 6 }}>
            <Grid row gap className="margin-bottom-2">
              <Grid mobile={{ col: 6 }}>
                <p className="margin-0 text-bold">{t('mustStartBy')}</p>

                <p className="margin-y-1">
                  {solution.mustStartDts
                    ? formatDateUtc(solution.mustStartDts, 'MMMM d, yyyy')
                    : t('notSpecified')}
                </p>
              </Grid>

              <Grid mobile={{ col: 6 }}>
                <p className="margin-0 text-bold">{t('mustFinishBy')}</p>

                <p className="margin-y-1">
                  {solution.mustFinishDts
                    ? formatDateUtc(solution.mustFinishDts, 'MMMM d, yyyy')
                    : t('notSpecified')}
                </p>
              </Grid>
            </Grid>

            <Grid className="margin-bottom-3">
              <p className="margin-top-0 margin-bottom-1 text-bold">
                {t('itSolutionsTable.status')}
              </p>

              <OperationalNeedsStatusTag status={solution.status} />
            </Grid>
            <Grid>
              <Button
                type="button"
                id="add-solution-not-listed"
                className="usa-button usa-button--outline"
                onClick={() => {
                  history.push({
                    pathname: `/models/${modelID}/task-list/it-solutions/${operationalNeedID}/solution-implementation-details/${operationalSolutionID}`
                  });
                }}
              >
                {t('updateStatusAndTiming')}
              </Button>
            </Grid>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default SolutionDetailCard;
