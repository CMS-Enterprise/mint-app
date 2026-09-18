import React from 'react';
import { render, screen } from '@testing-library/react';
import { GeographyType } from 'gql/generated/graphql';
import i18next from 'i18next';

import { generalCharacteristics } from 'i18n/en-US/modelPlan/generalCharacteristics';
import { Bool } from 'types/translation';

import SimpleReadOnlySection from '.';

const defaultEmptyProps = {
  field: 'geographiesTargeted',
  translations: generalCharacteristics,
  values: {
    geographiesTargeted: null as null | Bool,
    geographiesTargetedTypes: null as null | GeographyType[],
    geographiesTargetedTypesOther: ''
  }
};

describe('The Simple Read Only Section', () => {
  describe('As a Non-list Component', () => {
    it('renders without crashing', async () => {
      const data = {
        ...defaultEmptyProps,
        values: {
          ...defaultEmptyProps.values,
          geographiesTargeted: Bool.true
        }
      };

      render(<SimpleReadOnlySection {...data} />);

      expect(
        screen.getByText(
          i18next.t<string, {}, string>(
            'generalCharacteristics:geographiesTargeted.label'
          )
        )
      ).toBeInTheDocument();
      expect(screen.getByText('Yes')).toBeInTheDocument();
    });

    it('renders "No answer entered" if copy is empty', async () => {
      render(<SimpleReadOnlySection {...defaultEmptyProps} />);

      expect(
        screen.getByText(
          i18next.t<string, {}, string>(
            'generalCharacteristics:geographiesTargeted.label'
          )
        )
      ).toBeInTheDocument();

      expect(
        screen.getByText(i18next.t<string, {}, string>('miscellaneous:na'))
      ).toBeInTheDocument();
    });
  });

  describe('As a List Component', () => {
    it('renders Other entry', async () => {
      const data = {
        ...defaultEmptyProps,
        field: 'geographiesTargetedTypes',
        values: {
          ...defaultEmptyProps.values,
          geographiesTargeted: Bool.true,
          geographiesTargetedTypes: [GeographyType.REGION, GeographyType.OTHER]
        }
      };

      render(<SimpleReadOnlySection {...data} />);
      screen.debug();

      expect(
        screen.getByText(
          i18next.t<string, {}, string>(
            'generalCharacteristics:geographiesTargetedTypes.label'
          )
        )
      ).toBeInTheDocument();

      expect(screen.getByText('Region, Other')).toBeInTheDocument();
    });
  });
});
