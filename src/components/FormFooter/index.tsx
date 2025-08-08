import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, Icon } from '@trussworks/react-uswds';

type SubmittionFooterProps = {
  homeArea: string;
  homeRoute: string;
  backPage?: string;
  nextPage?: boolean;
  disabled?: boolean;
};

const FormFooter = ({
  homeArea,
  homeRoute,
  nextPage = true,
  backPage,
  disabled
}: SubmittionFooterProps) => {
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const navigate = useNavigate();

  return (
    <>
      <div className="margin-top-6 margin-bottom-2 display-flex">
        {backPage && (
          <Button
            type="button"
            className="usa-button usa-button--outline"
            disabled={disabled}
            onClick={() => {
              navigate(backPage);
            }}
          >
            {miscellaneousT('back')}
          </Button>
        )}

        {nextPage && (
          <Button type="submit" disabled={disabled}>
            {miscellaneousT('next')}
          </Button>
        )}
      </div>

      <Button
        type="button"
        className="usa-button usa-button--unstyled"
        disabled={disabled}
        onClick={() => navigate(homeRoute)}
      >
        <Icon.ArrowBack
          className="margin-right-1"
          aria-hidden
          aria-label="back"
        />

        {homeArea}
      </Button>
    </>
  );
};

export default FormFooter;
