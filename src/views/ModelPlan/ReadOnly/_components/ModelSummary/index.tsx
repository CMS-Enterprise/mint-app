import React, { RefObject, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Grid, IconExpandMore } from '@trussworks/react-uswds';
import classnames from 'classnames';

import CollapsableLink from 'components/shared/CollapsableLink';
import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import {
  GetModelSummary_modelPlan_collaborators as CollaboratorsType,
  GetModelSummary_modelPlan_crTdls as CRTDLsTypes,
  GetModelSummary_modelPlan_generalCharacteristics as CharacteristicsType
} from 'queries/ReadOnly/types/GetModelSummary';
import { formatDateLocal } from 'utils/date';
import { translateKeyCharacteristics } from 'utils/modelPlan';

type ModelSummaryProps = {
  characteristics: CharacteristicsType;
  crTdls: CRTDLsTypes[] | null;
  descriptionRef: RefObject<HTMLElement>;
  goal: string;
  isDescriptionExpandable: boolean;
  loading: boolean;
  modelLeads: CollaboratorsType[];
  modelName: string;
  performancePeriodStarts: string | null;
};

const ModelSummary = ({
  characteristics,
  crTdls,
  descriptionRef,
  goal,
  isDescriptionExpandable,
  loading,
  modelLeads,
  modelName,
  performancePeriodStarts
}: ModelSummaryProps) => {
  const { t } = useTranslation('modelSummary');
  const { t: h } = useTranslation('generalReadOnly');
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  // Formatting the data
  const formattedKeyCharacteristics = characteristics?.keyCharacteristics.map(
    (item, index) => {
      return `${translateKeyCharacteristics(item)}${
        index === characteristics?.keyCharacteristics.length - 1 ? '' : ', '
      }`;
    }
  );

  const formattedPerformanceStartDate =
    performancePeriodStarts &&
    formatDateLocal(performancePeriodStarts, 'MMMM d, yyyy');

  const formattedModelLeads =
    modelLeads &&
    modelLeads.map((collaborator, index) => {
      return `${collaborator.userAccount.commonName}${
        index === modelLeads.length - 1 ? '' : ', '
      }`;
    });

  const formattedCrTdls = (items: CRTDLsTypes[]) => {
    const idNumbers = items.map(item => item.idNumber);
    if (idNumbers.length > 3) {
      return `${idNumbers.slice(0, 3).join(', ')} +${idNumbers.length - 3} ${t(
        'more'
      )}`;
    }
    return idNumbers.join(', ');
  };

  return (
    <CollapsableLink
      className="margin-top-3 padding-0"
      labelPosition="bottom"
      iconPosition="right"
      closeLabel={h('hideSummary')}
      styleLeftBar={false}
      id={`${modelName?.replace(/\s+/g, '-').toLowerCase()}--description`}
      label={h('showSummary')}
    >
      <div
        className={classnames('description-truncated', 'margin-bottom-2', {
          expanded: descriptionExpanded
        })}
      >
        <DescriptionDefinition
          definition={goal}
          ref={descriptionRef}
          dataTestId="read-only-model-summary__description"
          className={classnames('font-body-lg line-height-body-5 text-light', {
            'minh-5': loading || goal
          })}
        />
        {isDescriptionExpandable && (
          <div>
            <Button
              unstyled
              type="button"
              className="margin-top-1"
              onClick={() => {
                setDescriptionExpanded(!descriptionExpanded);
              }}
            >
              {h(descriptionExpanded ? 'description.less' : 'description.more')}
              <IconExpandMore className="expand-icon margin-left-05 margin-bottom-2px text-tbottom" />
            </Button>
          </div>
        )}
      </div>
      <Grid row className="margin-top-3">
        <Grid col={6} className="margin-bottom-2 minh-7">
          <DescriptionDefinition
            className="font-body-sm"
            definition={t('summary.keyCharacteristics')}
          />
          <DescriptionTerm
            className="font-body-lg line-height-sans-2 margin-bottom-0"
            term={
              characteristics?.keyCharacteristics.length !== 0
                ? formattedKeyCharacteristics
                : t('noAnswer.noneEntered')
            }
          />
        </Grid>
        <Grid col={6} className="margin-bottom-2 minh-7">
          <DescriptionDefinition
            className="font-body-sm"
            definition={t('summary.modelLeads')}
          />
          <DescriptionTerm
            className="font-body-lg line-height-sans-2 margin-bottom-0"
            term={formattedModelLeads}
          />
        </Grid>
        <Grid
          col={6}
          className="margin-bottom-2 desktop:margin-bottom-0 minh-7"
        >
          <DescriptionDefinition
            className="font-body-sm"
            definition={t('summary.modelStartDate')}
          />
          <DescriptionTerm
            className="font-body-lg line-height-sans-2 margin-bottom-0"
            term={formattedPerformanceStartDate ?? t('noAnswer.tBD')}
          />
        </Grid>
        <Grid
          col={6}
          className="margin-bottom-2 desktop:margin-bottom-0 minh-7"
        >
          <DescriptionDefinition
            className="font-body-sm"
            definition={t('summary.crAndTdls')}
          />
          <DescriptionTerm
            className="font-body-lg line-height-sans-2 margin-bottom-0 "
            term={
              crTdls && crTdls.length !== 0
                ? formattedCrTdls(crTdls)
                : t('noAnswer.noneEntered')
            }
          />
        </Grid>
      </Grid>
    </CollapsableLink>
  );
};

export default ModelSummary;
