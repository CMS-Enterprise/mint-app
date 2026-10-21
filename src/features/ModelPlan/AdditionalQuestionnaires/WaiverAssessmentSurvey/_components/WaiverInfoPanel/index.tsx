import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { GridContainer } from '@trussworks/react-uswds';
import { useGetCommonWaiverQuery } from 'gql/generated/graphql';

import {
  DescriptionDefinition,
  DescriptionList,
  DescriptionTerm
} from 'components/DescriptionGroup';
import ExternalLink from 'components/ExternalLink';
import Sidepanel from 'components/Sidepanel';

/**
 * Side panel for viewing common waiver details and selecting whether to use it.
 * Must be rendered within a FormProvider when not on read view.
 */
const WaiverInfoPanel = () => {
  const { t } = useTranslation('waiverAssessmentSurveyMisc');
  const { t: generalT } = useTranslation('general');

  const [searchParams, setSearchParams] = useSearchParams();
  const waiverId = searchParams.get('waiverId') ?? '';

  const { data } = useGetCommonWaiverQuery({
    variables: {
      id: waiverId
    },
    skip: !waiverId
  });

  const closeModal = () => {
    setSearchParams(
      prev => {
        const nextParams = new URLSearchParams(prev);
        nextParams.delete('waiverId');
        return nextParams;
      },
      { preventScrollReset: true }
    );
  };

  const {
    name,
    description,
    participationAgreementLanguageLink,
    waiverType,
    waiverFocus,
    whatIsWaived,
    hasStandardizationEffort,
    hasClaimsDataOrRREGAnalysis,
    isUsedInActiveModels
  } = data?.commonWaiver || {};

  return (
    <Sidepanel
      ariaLabel={t('waiverInfoPanel.heading')}
      testid="waiver-info-panel"
      isOpen={!!waiverId}
      closeModal={closeModal}
      modalHeading={t('waiverInfoPanel.heading')}
    >
      <GridContainer className="padding-y-6 padding-x-8">
        <div className="maxw-mobile-lg">
          <div className="border-bottom-1px border-base-light margin-bottom-4">
            <p className="text-mint-body margin-top-0 margin-bottom-1">
              {t(`${waiverType}.heading`)}
            </p>

            <h2 className="margin-top-0 margin-bottom-1 line-height-large">
              {name}
            </h2>

            <p className="text-base-dark margin-bottom-1">{description}</p>

            <ExternalLink
              href={participationAgreementLanguageLink || ''}
              className="margin-bottom-3"
            >
              {t('waiverInfoPanel.participationAgreementLanguage')}
            </ExternalLink>
          </div>

          <DescriptionList title={t('waiverInfoPanel.heading')}>
            <DescriptionTerm
              term={t('waiverInfoPanel.waiverFocus')}
              className="margin-bottom-0 margin-top-3"
            />
            <DescriptionDefinition definition={waiverFocus} />

            <DescriptionTerm
              term={t('waiverInfoPanel.whatIsWaived')}
              className="margin-bottom-0 margin-top-3"
            />
            <DescriptionDefinition definition={whatIsWaived} />

            <DescriptionTerm
              term={t('waiverInfoPanel.hasStandardizationEffort')}
              className="margin-bottom-0 margin-top-3"
            />
            <DescriptionDefinition
              definition={
                hasStandardizationEffort ? generalT('yes') : generalT('no')
              }
            />

            <DescriptionTerm
              term={t('waiverInfoPanel.hasClaimsDataOrRREGAnalysis')}
              className="margin-bottom-0 margin-top-3"
            />
            <DescriptionDefinition definition={hasClaimsDataOrRREGAnalysis} />

            <DescriptionTerm
              term={t('waiverInfoPanel.isUsedInActiveModels')}
              className="margin-bottom-0 margin-top-3"
            />
            <DescriptionDefinition
              definition={
                isUsedInActiveModels ? generalT('yes') : generalT('no')
              }
            />
          </DescriptionList>
        </div>
      </GridContainer>
    </Sidepanel>
  );
};

export default WaiverInfoPanel;
