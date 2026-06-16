import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';
import { MilestoneCardType } from 'features/MilestoneLibrary/MilestoneCardGroup';
import { useDeleteCommonMilestoneMutation } from 'gql/generated/graphql';
import GetMTOAllCommonMilestones from 'gql/operations/ModelToOperations/GetMTOAllCommonMilestones';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { AppState } from 'stores/reducers/rootReducer';

import toastSuccess from 'components/ToastSuccess';
import { useErrorMessage } from 'contexts/ErrorContext';
import { isAssessment } from 'utils/user';

import CommonMilestoneConfirmationModal from '../CommonMilestoneConfirmationModal';
import CommonMilestoneSidePanel from '../CommonMilestoneSidePanel';

const CommonMilestoneActions = ({
  milestone
}: {
  milestone: MilestoneCardType;
}) => {
  const { t: mtoCommonMilestoneMiscT } = useTranslation(
    'mtoCommonMilestoneMisc'
  );

  const { groups } = useSelector((state: AppState) => state.auth);
  const flags = useFlags();
  const isAssessmentTeam = isAssessment(groups, flags);

  const navigate = useNavigate();
  const location = useLocation();

  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const editParam = params.get('edit');

  const [deleteCommonMilestone] = useDeleteCommonMilestoneMutation({
    refetchQueries: [{ query: GetMTOAllCommonMilestones }]
  });

  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
    useState<boolean>(false);

  const { setErrorMeta } = useErrorMessage();

  useEffect(() => {
    if (isAssessmentTeam && editParam === 'true') {
      setIsPanelOpen(true);
    } else {
      params.delete('edit');
      navigate({ search: params.toString() }, { replace: true });
      setIsPanelOpen(false);
    }
  }, [editParam, isAssessmentTeam, navigate, params]);

  const removeCommonMilestone = (id: string) => {
    setErrorMeta({
      overrideMessage: mtoCommonMilestoneMiscT('confirmationModal.remove.error')
    });

    deleteCommonMilestone({ variables: { id } }).then(response => {
      if (!response?.errors) {
        toastSuccess(
          mtoCommonMilestoneMiscT('confirmationModal.remove.success')
        );

        params.delete('milestone');
        navigate({ search: params.toString() }, { replace: true });
        setIsConfirmationModalOpen(false);
      }
    });
  };

  return (
    <>
      <CommonMilestoneSidePanel
        isPanelOpen={isPanelOpen}
        mode="editCommonMilestone"
        commonMilestone={milestone}
        closeModal={() => {
          params.delete('edit');
          navigate({ search: params.toString() }, { replace: true });
          setIsPanelOpen(false);
        }}
      />

      <CommonMilestoneConfirmationModal
        isModalOpen={isConfirmationModalOpen}
        closeModal={() => setIsConfirmationModalOpen(false)}
        actionType="remove"
        onConfirmClick={() => removeCommonMilestone(milestone.id)}
      />

      <div className="margin-top-3">
        <Button
          type="button"
          className="usa-button usa-button--outline margin-right-2"
          onClick={() => {
            params.set('edit', 'true');
            navigate({ search: params.toString() });
            setIsPanelOpen(true);
          }}
        >
          {mtoCommonMilestoneMiscT('editCommonMilestone.heading')}
        </Button>
        <Button
          type="button"
          className="text-error-dark deep-underline"
          unstyled
          onClick={() => setIsConfirmationModalOpen(true)}
        >
          {mtoCommonMilestoneMiscT('removeCommonMilestone')}
        </Button>
      </div>
    </>
  );
};

export default CommonMilestoneActions;
