import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@trussworks/react-uswds';
import {
  SolutionContactType,
  SolutionContractorType,
  SolutionSystemOwnerType
} from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import {
  useDeleteMtoCommonSolutionContactMutation,
  useDeleteMtoCommonSolutionContractorMutation,
  useDeleteMtoCommonSolutionSystemOwnerMutation
} from 'gql/generated/graphql';
import GetMTOSolutionContacts from 'gql/operations/ModelToOperations/GetMTOSolutionContacts';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import toastSuccess from 'components/ToastSuccess';
import { useErrorMessage } from 'contexts/ErrorContext';
import usePlanTranslation from 'hooks/usePlanTranslation';

type ContactType = 'teamOrMember' | 'owner' | 'contractor';

const getUseMutation = (contactType: ContactType) => {
  switch (contactType) {
    case 'teamOrMember':
      return useDeleteMtoCommonSolutionContactMutation;
    case 'owner':
      return useDeleteMtoCommonSolutionSystemOwnerMutation;
    case 'contractor':
      return useDeleteMtoCommonSolutionContractorMutation;
    default:
      throw new Error(`contact type ${contactType} is incorrect`);
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
  pointOfContact:
    | SolutionContactType
    | SolutionContractorType
    | SolutionSystemOwnerType;
  contactType: ContactType;
}) => {
  const { t: contactT } = useTranslation('mtoCommonSolutionContactMisc');
  const { t: systemOwnerT } = useTranslation(
    'mtoCommonSolutionSystemOwnerMisc'
  );
  const { cmsComponent: cmsComponentConfig } = usePlanTranslation(
    'mtoCommonSolutionSystemOwner'
  );
  const { t: contractorT } = useTranslation('mtoCommonSolutionContractorMisc');
  const useMutation = getUseMutation(contactType);
  const [deleteContact] = useMutation();
  const { setErrorMeta } = useErrorMessage();

  const getContactName = () => {
    switch (pointOfContact.__typename) {
      case 'MTOCommonSolutionContact':
        return pointOfContact.name;
      case 'MTOCommonSolutionContractor':
        return pointOfContact.contractorName;
      case 'MTOCommonSolutionSystemOwner':
        return cmsComponentConfig.options[pointOfContact.cmsComponent];
      default:
        throw new Error(`contact object ${pointOfContact} is incorrect`);
    }
  };
  const contactName = getContactName();

  const getModalStrings = (
    field: 'title' | 'text' | 'cta' | 'success' | 'error'
  ) => {
    switch (contactType) {
      case 'teamOrMember':
        return {
          i18nKey: `mtoCommonSolutionContactMisc:removePointOfContact.${field}`,
          text: contactT(`removePointOfContact.${field}`)
        };
      case 'owner':
        return {
          i18nKey: `mtoCommonSolutionSystemOwnerMisc:removeSystemOwner.${field}`,
          text: systemOwnerT(`removeSystemOwner.${field}`)
        };
      case 'contractor':
        return {
          i18nKey: `mtoCommonSolutionContractorMisc:removeContractor.${field}`,
          text: contractorT(`removeContractor.${field}`)
        };
      default:
        throw new Error(`contact type ${contactType} is incorrect`);
    }
  };

  const removePointOfContact = (id: string) => {
    setErrorMeta({
      overrideMessage: getModalStrings('error').text
    });

    deleteContact({
      variables: {
        id
      },
      refetchQueries: [GetMTOSolutionContacts]
    }).then(response => {
      if (!response?.errors) {
        toastSuccess(
          <Trans
            i18nKey={getModalStrings('success').i18nKey}
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
    });
  };

  return (
    <Modal
      isOpen={isModalOpen}
      closeModal={closeModal}
      fixed
      className="tablet:width-mobile-lg mint-body-normal"
    >
      <div className="padding-bottom-8">
        <PageHeading headingLevel="h3" className="margin-y-0">
          {getModalStrings('title').text}
        </PageHeading>

        <p>{contactT('actionWarning')}</p>

        <Trans
          i18nKey={getModalStrings('text').i18nKey}
          values={{
            contact: contactName
          }}
          components={{
            bold: <span className="text-bold" />
          }}
        />

        <div className="margin-top-2 display-flex mint-modal__footer">
          <Button
            type="submit"
            className="margin-right-3 margin-top-0 bg-error"
            onClick={() => removePointOfContact(pointOfContact.id)}
          >
            {getModalStrings('cta').text}
          </Button>

          <Button
            type="button"
            className="margin-top-0"
            unstyled
            onClick={closeModal}
          >
            {contactT('cancel')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
export default RemoveContactModal;
