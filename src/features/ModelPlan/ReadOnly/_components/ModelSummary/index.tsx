import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Grid, Icon } from '@trussworks/react-uswds';
import classnames from 'classnames';
import {
  GetEchimpCrandTdlQuery,
  GetModelSummaryQuery
} from 'gql/generated/graphql';
import i18next from 'i18next';

import CollapsableLink from 'components/CollapsableLink';
import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/DescriptionGroup';
import { formatDateLocal } from 'utils/date';

type CollaboratorsType = GetModelSummaryQuery['modelPlan']['collaborators'][0];
type CharacteristicsType =
  GetModelSummaryQuery['modelPlan']['generalCharacteristics'];

type EchimpCrAndTdlsType =
  GetEchimpCrandTdlQuery['modelPlan']['echimpCRsAndTDLs'][0];

type ModelSummaryProps = {
  characteristics: CharacteristicsType;
  crTdls: EchimpCrAndTdlsType[] | null;
  goal: string;
  loading: boolean;
  modelLeads: CollaboratorsType[];
  modelName: string;
  performancePeriodStarts: string | null;
};

const ModelSummary = ({
  characteristics,
  crTdls,
  goal,
  loading,
  modelLeads,
  modelName,
  performancePeriodStarts
}: ModelSummaryProps) => {
  const { t } = useTranslation('modelSummary');
  const { t: h } = useTranslation('generalReadOnly');
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  // Formatting the data
  const formattedKeyCharacteristics = characteristics?.keyCharacteristics
    .map(item => {
      return i18next.t(
        `generalCharacteristics:keyCharacteristics.options.${item}`
      );
    })
    .join(', ');

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

  const formattedCrTdls = (items: EchimpCrAndTdlsType[]) => {
    const idNumbers = items.map(item => item.id);
    if (idNumbers.length > 3) {
      return `${idNumbers.slice(0, 3).join(', ')} ${i18next.t(
        'collaborationArea:crtdlsCard.andMore',
        {
          count: idNumbers.length - 3
        }
      )}`;
    }
    return idNumbers.join(', ');
  };

  const descriptionRef = React.createRef<HTMLElement>();

  const [isDescriptionExpandable, setIsDescriptionExpandable] =
    useState<boolean>(false);

  const [descriptionOpen, isDescriptionOpen] = useState<boolean>(false);

  // Enable the description toggle if it overflows
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const { current: el } = descriptionRef;
    if (!el) return;
    if (el.scrollHeight > el.offsetHeight) {
      setIsDescriptionExpandable(true);
    }
  }, [descriptionRef, descriptionOpen]);

  return (
    <CollapsableLink
      toggleClassName="margin-top-3 padding-0"
      labelPosition="top"
      iconPosition="left"
      closeLabel={h('hideSummary')}
      styleLeftBar={false}
      id={`${modelName?.replace(/\s+/g, '-').toLowerCase()}--description`}
      showDescription={isDescriptionOpen}
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
              <Icon.ExpandMore className="expand-icon margin-left-05 margin-bottom-2px text-tbottom" />
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
