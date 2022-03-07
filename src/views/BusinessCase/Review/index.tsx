import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';

import BusinessCaseReview from 'components/BusinessCaseReview';
import PageHeading from 'components/PageHeading';
import { alternativeSolutionHasFilledFields } from 'data/businessCase';
import { AppState } from 'reducers/rootReducer';
import { BusinessCaseModel } from 'types/businessCase';
import { postAction } from 'types/routines';

import './index.scss';

type ReviewProps = {
  businessCase: BusinessCaseModel;
};

const Review = ({ businessCase }: ReviewProps) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const isSubmitting = useSelector((state: AppState) => state.action.isPosting);
  const actionType =
    businessCase.systemIntakeStatus === 'BIZ_CASE_FINAL_NEEDED'
      ? 'SUBMIT_FINAL_BIZ_CASE'
      : 'SUBMIT_BIZ_CASE';

  return (
    <div className="business-case-review" data-testid="business-case-review">
      <div className="grid-container">
        <PageHeading>Check your answers before sending</PageHeading>
      </div>

      <BusinessCaseReview values={businessCase} />
      <div className="grid-container margin-top-6">
        <Button
          type="button"
          outline
          onClick={() => {
            const newUrl = alternativeSolutionHasFilledFields(
              businessCase.alternativeB
            )
              ? 'alternative-solution-b'
              : 'alternative-solution-a';
            history.push(newUrl);
          }}
        >
          Back
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          onClick={() => {
            dispatch(
              postAction({
                intakeId: businessCase.systemIntakeId,
                actionType
              })
            );
          }}
        >
          Send my business case
        </Button>
      </div>
    </div>
  );
};

export default Review;
