import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@trussworks/react-uswds';
import { MtoRiskIndicator } from 'gql/generated/graphql';

import { Alert } from 'components/Alert';
import UswdsReactLink from 'components/LinkWrapper';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import usePlanTranslation from 'hooks/usePlanTranslation';

const CompletionModal = ({
  isModalOpen,
  closeModal,
  mode,
  modelID,
  riskIndicator,
  handleRemoveRiskIndicator
}: {
  isModalOpen: boolean;
  closeModal: () => void;
  mode: 'milestone' | 'solution';
  modelID: string;
  riskIndicator: MtoRiskIndicator;
  handleRemoveRiskIndicator: () => void;
}) => {
  const { t: modelToOperationsMiscT } = useTranslation('modelToOperationsMisc');
  const { riskIndicator: riskIndicatorConfig } =
    usePlanTranslation('mtoMilestone');

  return (
    <Modal
      isOpen={isModalOpen}
      closeModal={closeModal}
      fixed
      className="tablet:width-mobile-lg mint-body-normal"
      testId="remove-contact-modal"
    >
      <div className="padding-bottom-8">
        <PageHeading headingLevel="h3" className="margin-y-0">
          {modelToOperationsMiscT(`modal.completionModal.heading.${mode}`)}
        </PageHeading>

        {riskIndicator === MtoRiskIndicator.ON_TRACK && (
          <div>
            <p className="margin-bottom-0">
              <Trans
                i18nKey={modelToOperationsMiscT(
                  `modal.completionModal.noRiskText.${mode}`
                )}
                components={{
                  solutionTabLink: (
                    <UswdsReactLink
                      to={`/models/${modelID}/collaboration-area/model-to-operations/matrix?view=solutions&page=1`}
                      onClick={closeModal}
                    >
                      {' '}
                    </UswdsReactLink>
                  )
                }}
              />
            </p>

            <div className="margin-top-2 display-flex mint-modal__footer">
              <Button
                type="submit"
                className="margin-right-3 margin-top-0"
                onClick={closeModal}
              >
                {modelToOperationsMiscT('modal.completionModal.cta.okay')}
              </Button>
            </div>
          </div>
        )}

        {riskIndicator !== MtoRiskIndicator.ON_TRACK && (
          <div>
            <div>
              <p>
                <Trans
                  i18nKey={modelToOperationsMiscT(
                    `modal.completionModal.riskText.${mode}`
                  )}
                  values={{
                    riskIndicator: riskIndicatorConfig.options[riskIndicator]
                  }}
                />
              </p>
              <Alert type="info" slim>
                {modelToOperationsMiscT(
                  `modal.completionModal.riskInfoAlert.${mode}`
                )}
              </Alert>
            </div>

            <div className="margin-top-2 display-flex mint-modal__footer">
              <Button
                type="submit"
                className="margin-right-3 margin-top-0"
                onClick={handleRemoveRiskIndicator}
              >
                {modelToOperationsMiscT(
                  'modal.completionModal.cta.removeRiskIndicator'
                )}
              </Button>

              <Button
                type="button"
                className="margin-top-0"
                unstyled
                onClick={closeModal}
              >
                {modelToOperationsMiscT(
                  'modal.completionModal.cta.dontRemoveRiskIndicator'
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CompletionModal;
