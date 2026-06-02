import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Form, GridContainer } from '@trussworks/react-uswds';
import classNames from 'classnames';

import {
  DescriptionDefinition,
  DescriptionList,
  DescriptionTerm
} from 'components/DescriptionGroup';
import Divider from 'components/Divider';
import ExternalLink from 'components/ExternalLink';
import Sidepanel from 'components/Sidepanel';

import SelectWaiverField from '../SelectWaiverField';

/**
 * TO DO:
 * - Update waiver type to match query
 * - Remove temp test code from ModelPlanQuestions
 */

type CommonWaiver = {
  name: string;
  description: string;
  participationAgreementLanguageLink: string;
  // TODO: This is not nullable in schema - how to tell if answer has been provided?
  cmmiWaiverPointOfContact?: string | null;
  waiverType: string;
  waiverFocus: string;
  whatIsWaived: string;
  hasStandardizationEffort: boolean;
  hasClaimsDataOrRREGAnalysis: string;
  isUsedInActiveModels: boolean;
};

type WaiverInfoFields = {
  willUseWaiver: boolean | null;
  notUsingReason: string;
};

type WaiverInfoPanelProps = {
  isOpen: boolean;
  closeModal: () => void;
  waiverInfo: WaiverInfoFields & {
    commonWaiver: CommonWaiver;
  };
};

const WaiverInfoPanel = ({
  isOpen,
  closeModal,
  waiverInfo
}: WaiverInfoPanelProps) => {
  const { t } = useTranslation('waiverAssessmentSurvey');

  const { willUseWaiver, notUsingReason, commonWaiver } = waiverInfo;

  const {
    cmmiWaiverPointOfContact,
    name,
    description,
    participationAgreementLanguageLink,
    waiverType,
    waiverFocus,
    whatIsWaived,
    hasStandardizationEffort,
    hasClaimsDataOrRREGAnalysis,
    isUsedInActiveModels
  } = commonWaiver;

  const methods = useForm<WaiverInfoFields>({
    defaultValues: {
      willUseWaiver,
      notUsingReason
    }
  });

  return (
    <Sidepanel
      ariaLabel={t('waiverInfoPanel.heading')}
      testid="waiver-info-panel"
      isOpen={isOpen}
      closeModal={closeModal}
      modalHeading={t('waiverInfoPanel.heading')}
    >
      <GridContainer className="padding-y-6 padding-x-8">
        <div className="maxw-mobile-lg">
          <h2 className="margin-bottom-2">{name}</h2>
          <p className="text-base-dark margin-bottom-1">{description}</p>
          <ExternalLink href={participationAgreementLanguageLink}>
            {t('waiverInfoPanel.participationAgreementLanguage')}
          </ExternalLink>

          <Divider className="margin-top-3 margin-bottom-4" />

          <DescriptionList title={t('waiverInfoPanel.heading')}>
            <DescriptionTerm
              term={t('waiverInfoPanel.cmmiWaiverPointOfContact')}
              className="margin-bottom-0 margin-top-3"
            />
            <DescriptionDefinition
              className={classNames({
                'text-italic': !cmmiWaiverPointOfContact?.trim()
              })}
              definition={
                cmmiWaiverPointOfContact?.trim()
                  ? cmmiWaiverPointOfContact
                  : t('waiverInfoPanel.noPointOfContactListed')
              }
            />

            <DescriptionTerm
              term={t('waiverInfoPanel.waiverType')}
              className="margin-bottom-0 margin-top-3"
            />
            <DescriptionDefinition definition={waiverType} />

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
              definition={hasStandardizationEffort ? 'Yes' : 'No'}
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
              definition={isUsedInActiveModels ? 'Yes' : 'No'}
            />
          </DescriptionList>

          <Divider className="margin-top-3 margin-bottom-4" />

          <Form className="maxw-none" onSubmit={methods.handleSubmit(() => {})}>
            <FormProvider {...methods}>
              <SelectWaiverField />
            </FormProvider>
          </Form>
        </div>
      </GridContainer>
    </Sidepanel>
  );
};

export default WaiverInfoPanel;
