import React from 'react';
import { GridContainer } from '@trussworks/react-uswds';

import {
  DescriptionDefinition,
  DescriptionList,
  DescriptionTerm
} from 'components/DescriptionGroup';
import Divider from 'components/Divider';
import ExternalLink from 'components/ExternalLink';
import Sidepanel from 'components/Sidepanel';

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

type WaiverInfoPanelProps = {
  isOpen: boolean;
  closeModal: () => void;
  waiverInfo: {
    willUseWaiver: boolean;
    notUsingReason: string;
    commonWaiver: CommonWaiver;
  };
};

const WaiverInfoPanel = ({
  isOpen,
  closeModal,
  waiverInfo
}: WaiverInfoPanelProps) => {
  const { commonWaiver } = waiverInfo;

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
        </div>
      </GridContainer>
    </Sidepanel>
  );
};

export default WaiverInfoPanel;
