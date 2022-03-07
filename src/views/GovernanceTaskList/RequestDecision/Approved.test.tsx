import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { render, screen } from '@testing-library/react';
import { DateTime } from 'luxon';

import { initialSystemIntakeForm } from 'data/systemIntake';
import { GetSystemIntake_systemIntake as SystemIntake } from 'queries/types/GetSystemIntake';
import { SystemIntakeForm } from 'types/systemIntake';

import Approved from './Approved';

describe('Business owner task list approved view', () => {
  const approvedIntake: SystemIntake = {
    ...initialSystemIntakeForm,
    id: '40e866cb-6bf4-4b1a-8fc6-bf0d8328cdfc',
    lcid: '123456',
    lcidScope: 'Test scope',
    lcidExpiresAt: DateTime.fromISO('2021-07-19T07:00:00.000Z'),
    decisionNextSteps: 'Test next steps'
  } as SystemIntakeForm & SystemIntake;
  it('renders without errors', () => {
    render(
      <MemoryRouter>
        <Approved intake={approvedIntake} />
      </MemoryRouter>
    );

    expect(screen.getByTestId('grt-approved')).toBeInTheDocument();
  });

  it('matches the snapshot', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <Approved intake={approvedIntake} />
        </MemoryRouter>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
