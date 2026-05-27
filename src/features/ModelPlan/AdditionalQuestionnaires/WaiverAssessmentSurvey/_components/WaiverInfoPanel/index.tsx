import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Fieldset,
  Form,
  FormGroup,
  GridContainer,
  Icon,
  Label
} from '@trussworks/react-uswds';

import {
  DescriptionDefinition,
  DescriptionList,
  DescriptionTerm
} from 'components/DescriptionGroup';
import Divider from 'components/Divider';
import ExternalLink from 'components/ExternalLink';
import HelpText from 'components/HelpText';
import Sidepanel from 'components/Sidepanel';

import './index.scss';

/**
 * TO DO:
 * - Update waiver type to match query
 * - Add DescriptionTerm text to translations file
 * - Empty state for waiver POC ("No point of contact listed")
 * - Remove temp test code from ModelPlanQuestions
 */

type CommonWaiver = {
  name: string;
  description: string;
  participationAgreementLanguageLink: string;
  cmmiWaiverPointOfContact: string;
  waiverType: string;
  waiverFocus: string;
  whatIsWaived: string;
  hasStandardizationEffort: boolean;
  hasClaimsDataOrRREGAnalysis: string;
  isUsedInActiveModels: boolean;
};

type WaiverInfoFields = {
  willUseWaiver: boolean;
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

  const { handleSubmit, control } = useForm<WaiverInfoFields>({
    defaultValues: {
      willUseWaiver,
      notUsingReason
    }
  });

  return (
    <Sidepanel
      ariaLabel="Waiver Information"
      testid="waiver-info-panel"
      isOpen={isOpen}
      closeModal={closeModal}
      modalHeading="Waiver information"
    >
      <GridContainer className="padding-y-6 padding-x-8">
        <div className="maxw-mobile-lg">
          <h2 className="margin-bottom-2">{name}</h2>
          <p className="text-base-dark margin-bottom-1">{description}</p>
          <ExternalLink href={participationAgreementLanguageLink}>
            Participation Agreement Language
          </ExternalLink>

          <Divider className="margin-top-3 margin-bottom-4" />

          <DescriptionList title="Waiver information">
            <DescriptionTerm
              term="CMMI Waiver Point Of Contact"
              className="margin-bottom-0 margin-top-3"
            />
            <DescriptionDefinition definition={cmmiWaiverPointOfContact} />

            <DescriptionTerm
              term="Waiver type"
              className="margin-bottom-0 margin-top-3"
            />
            <DescriptionDefinition definition={waiverType} />

            <DescriptionTerm
              term="Waiver focus"
              className="margin-bottom-0 margin-top-3"
            />
            <DescriptionDefinition definition={waiverFocus} />

            <DescriptionTerm
              term="What is waived?"
              className="margin-bottom-0 margin-top-3"
            />
            <DescriptionDefinition definition={whatIsWaived} />

            <DescriptionTerm
              term="Is there a waiver standardization effort?"
              className="margin-bottom-0 margin-top-3"
            />
            <DescriptionDefinition
              definition={hasStandardizationEffort ? 'Yes' : 'No'}
            />

            <DescriptionTerm
              term="Is claims data or RREG analysis available?"
              className="margin-bottom-0 margin-top-3"
            />
            <DescriptionDefinition definition={hasClaimsDataOrRREGAnalysis} />

            <DescriptionTerm
              term="Is this waiver used in active models?"
              className="margin-bottom-0 margin-top-3"
            />
            <DescriptionDefinition
              definition={isUsedInActiveModels ? 'Yes' : 'No'}
            />
          </DescriptionList>

          <Divider className="margin-top-3 margin-bottom-4" />

          <Form className="maxw-none" onSubmit={handleSubmit(() => {})}>
            <FormGroup>
              <Label
                id="willUseWaiverLabel"
                htmlFor="waiver-info-panel-will-use-waiver-yes"
              >
                Do you plan to use this waiver with your model?
              </Label>
              <HelpText id="willUseWaiverHelpText">
                Your answer to this question may reveal additional questions to
                be answered.
              </HelpText>
              <Controller
                name="willUseWaiver"
                control={control}
                render={({ field }) => (
                  <Fieldset
                    className="mint-yes-no-button-group margin-top-2"
                    aria-labelledby="willUseWaiverLabel"
                    aria-describedby="willUseWaiverHelpText"
                  >
                    <div className="mint-yes-no-button mint-yes-no-button--yes">
                      <input
                        type="radio"
                        id="waiver-info-panel-will-use-waiver-yes"
                        data-testid="waiver-info-panel-will-use-waiver-yes"
                        {...field}
                        value="true"
                      />
                      <label
                        className="usa-button"
                        htmlFor="waiver-info-panel-will-use-waiver-yes"
                      >
                        <Icon.Check aria-hidden />
                        Yes
                      </label>
                    </div>
                    <div className="mint-yes-no-button mint-yes-no-button--no">
                      <input
                        type="radio"
                        id="waiver-info-panel-will-use-waiver-no"
                        data-testid="waiver-info-panel-will-use-waiver-no"
                        {...field}
                        value="false"
                      />
                      <label
                        className="usa-button"
                        htmlFor="waiver-info-panel-will-use-waiver-no"
                      >
                        <Icon.Close aria-hidden />
                        No
                      </label>
                    </div>
                  </Fieldset>
                )}
              />
            </FormGroup>
          </Form>
        </div>
      </GridContainer>
    </Sidepanel>
  );
};

export default WaiverInfoPanel;
