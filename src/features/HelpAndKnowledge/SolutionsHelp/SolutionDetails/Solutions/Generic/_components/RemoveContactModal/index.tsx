import React, { useState } from 'react';
import { Trans } from 'react-i18next';
import { Alert, Button } from '@trussworks/react-uswds';
import {
  SolutionContactType,
  SolutionContractorType
} from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import {
  useDeleteMtoCommonSolutionContactMutation,
  useDeleteMtoCommonSolutionContractorMutation
} from 'gql/generated/graphql';
import GetMTOSolutionContacts from 'gql/operations/ModelToOperations/GetMTOSolutionContacts';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import useMessage from 'hooks/useMessage';
import { mtoCommonSolutionContactMisc } from 'i18n/en-US/modelPlan/mtoCommonSolutionContact';
import { mtoCommonSolutionContractorMisc } from 'i18n/en-US/modelPlan/mtoCommonSolutionContractor';

type ContactType = 'teamOrMember' | 'owner' | 'contractor';

const getModalStrings = (contactType: ContactType) => {
  switch (contactType) {
    case 'teamOrMember':
      return mtoCommonSolutionContactMisc.removePointOfContact;
    case 'contractor':
      return mtoCommonSolutionContractorMisc.removeContractor;
    default:
      throw new Error(`contact type ${contactType} is incorrect`);
  }
};

const getUseMutation = (contactType: ContactType) => {
  switch (contactType) {
    case 'teamOrMember':
      return useDeleteMtoCommonSolutionContactMutation;
    case 'contractor':
      return useDeleteMtoCommonSolutionContractorMutation;
    default:
      throw new Error(`contact type ${contactType} is incorrect`);
  }
};

const getContactName = (
  contact: SolutionContactType | SolutionContractorType
) => {
  switch (contact.__typename) {
    case 'MTOCommonSolutionContact':
      return contact.name;
    case 'MTOCommonSolutionContractor':
      return contact.contractorName;
    default:
      throw new Error(`contact object ${contact} is incorrect`);
  }
};

const RemoveContactModal = ({
  isModalOpen,
  closeModal,
  pointOfContact,
  contactType
}: {
  isModalOpen: boolean;
  closeModal: () => void;
  pointOfContact: SolutionContactType | SolutionContractorType;
  contactType: ContactType;
}) => {
  const useMutation = getUseMutation(contactType);
  const [deleteContact] = useMutation();
  const { showMessage } = useMessage();
  const [hasMutationError, setHasMutationError] = useState(false);

  const modalStrings = getModalStrings(contactType);
  const contactName = getContactName(pointOfContact);

  const removePointOfContact = (id: string) => {
    deleteContact({
      variables: {
        id
      },
      refetchQueries: [GetMTOSolutionContacts]
    })
      .then(response => {
        if (!response?.errors) {
          showMessage(
            <Trans
              i18nKey={modalStrings.success}
              values={{
                contact: contactName
              }}
              components={{
                bold: <span className="text-bold" />
              }}
            />
          );
          closeModal();
        }
      })
      .catch(() => {
        setHasMutationError(true);
      });
  };

  return (
    <Modal
      isOpen={isModalOpen}
      closeModal={closeModal}
      fixed
      className="tablet:width-mobile-lg mint-body-normal"
    >
      <div className="margin-bottom-2">
        <PageHeading headingLevel="h3" className="margin-y-0">
          {modalStrings.title}
        </PageHeading>
        {hasMutationError && (
          <Alert type="error" slim headingLevel="h1">
            {modalStrings.error}
          </Alert>
        )}
        <p>{mtoCommonSolutionContactMisc.actionWarning}</p>
        <Trans
          i18nKey={modalStrings.text}
          values={{
            contact: contactName
          }}
          components={{
            bold: <span className="text-bold" />
          }}
        />

        <div className="margin-top-3 display-flex">
          <Button
            type="submit"
            className="margin-right-3 margin-top-0 bg-error"
            onClick={() => removePointOfContact(pointOfContact.id)}
          >
            {modalStrings.cta}
          </Button>

          <Button
            type="button"
            className="margin-top-0"
            unstyled
            onClick={closeModal}
          >
            {mtoCommonSolutionContactMisc.cancel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
export default RemoveContactModal;
