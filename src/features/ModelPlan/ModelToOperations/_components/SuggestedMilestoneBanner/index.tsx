import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Grid, GridContainer, Icon } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';

const SuggestedMilestoneBanner = ({
  suggestedMilestones
}: {
  suggestedMilestones: {
    __typename: 'MTOCommonMilestone';
    isSuggested: boolean;
  }[];
}) => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { modelID } = useParams<{ modelID: string }>();
  return (
    <div className="bg-accent-cool-lighter shadow-2 position-relative">
      <GridContainer className="padding-y-2">
        <Grid row className="flex-no-wrap">
          <div className="bg-accent-cool-darker circle-3 margin-right-2 display-flex flex-align-center flex-justify-center">
            <Icon.LightbulbOutline className="text-white" />
          </div>
          <span className="margin-y-0">
            {suggestedMilestones?.length > 0 ? (
              <>
                {t('suggestedMilestoneBanner.notEmpty_part1.output', {
                  count: suggestedMilestones.length
                })}
                <Trans
                  i18nKey={t('suggestedMilestoneBanner.notEmpty_part2')}
                  components={{
                    s: (
                      <UswdsReactLink
                        to={`/models/${modelID}/collaboration-area/model-to-operations/milestone-library`}
                      />
                    ),
                    arrow: (
                      <Icon.ArrowForward className="margin-left-05 top-05" />
                    )
                  }}
                />
              </>
            ) : (
              <Trans
                i18nKey={t('suggestedMilestoneBanner.empty')}
                components={{
                  s: (
                    <UswdsReactLink
                      to={`/models/${modelID}/collaboration-area/task-list`}
                    />
                  )
                }}
              />
            )}
          </span>
        </Grid>
      </GridContainer>
    </div>
  );
};

export default SuggestedMilestoneBanner;
