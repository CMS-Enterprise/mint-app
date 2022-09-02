import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { LockStatus } from 'views/SubscriptionHandler';

import ITToolsSummary from './index';

const modelID: string = '123';
const managePartCDEnrollment: boolean = true;
const questionOneNeedsTools: boolean = managePartCDEnrollment === true;

describe('The ITToolsSummary component', () => {
  it('renders summary that doesnt need tool', async () => {
    const { getByTestId, getAllByRole } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/it-tools/page-one'
        ]}
      >
        <Route path="/models/:modelID/task-list/it-tools/page-one">
          <ITToolsSummary
            question="Will you manage Part C/D enrollment?"
            answers={['Yes']}
            redirect={`/models/${modelID}/task-list/characteristics/key-characteristics`}
            answered={managePartCDEnrollment !== null}
            needsTool={questionOneNeedsTools}
            scrollElememnt="managePartCDEnrollment"
            locked={LockStatus.UNLOCKED}
          />
        </Route>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        getByTestId('tools-question-managePartCDEnrollment')
      ).toHaveTextContent('Will you manage Part C/D enrollment?');

      expect(
        getByTestId('has-answered-tools-question-managePartCDEnrollment')
      ).toHaveTextContent('You previously answered:');

      const listItems = getAllByRole('listitem');
      expect(listItems).toHaveLength(1);
      expect(listItems[0]).toHaveTextContent('Yes');
    });
  });

  it('renders summary that needs tool', async () => {
    const { getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/it-tools/page-one'
        ]}
      >
        <Route path="/models/:modelID/task-list/it-tools/page-one">
          <ITToolsSummary
            question="Will you manage Part C/D enrollment?"
            answers={['Yes']}
            redirect={`/models/${modelID}/task-list/characteristics/key-characteristics`}
            answered={false} // managePartCDEnrollment as false
            needsTool={false} // questionOneNeedsTools as false
            subtext="If you change your answer to “Yes”, you can select tools from the list below."
            scrollElememnt="managePartCDEnrollment"
            locked={LockStatus.UNLOCKED}
          />
        </Route>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        getByTestId('tools-question-managePartCDEnrollment')
      ).toHaveTextContent('Will you manage Part C/D enrollment?');

      expect(
        getByTestId('has-answered-tools-question-managePartCDEnrollment')
      ).toHaveTextContent('You haven’t answered:');

      expect(
        getByTestId('tools-change-answer-managePartCDEnrollment')
      ).toHaveTextContent(
        'If you change your answer to “Yes”, you can select tools from the list below.'
      );
    });
  });

  it('renders a locked modal is task list occupied', async () => {
    // ReactModel is throwing warning - App element is not defined. Please use `Modal.setAppElement(el)`.  The app is being set within the modal but RTL is not picking up on it
    // eslint-disable-next-line
    console.error = jest.fn();

    const { getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/it-tools/page-one'
        ]}
      >
        <Route path="/models/:modelID/task-list/it-tools/page-one">
          <ITToolsSummary
            question="Will you manage Part C/D enrollment?"
            answers={['Yes']}
            redirect={`/models/${modelID}/task-list/characteristics/key-characteristics`}
            answered={false} // managePartCDEnrollment as false
            needsTool={false} // questionOneNeedsTools as false
            subtext="If you change your answer to “Yes”, you can select tools from the list below."
            scrollElememnt="managePartCDEnrollment"
            locked={LockStatus.LOCKED}
          />
        </Route>
      </MemoryRouter>
    );

    const lockedButton = getByTestId('it-tools-locked-managePartCDEnrollment');
    userEvent.click(lockedButton);

    await waitFor(() => {
      expect(getByTestId('return-to-task-list')).toHaveTextContent(
        'Return to the task list'
      );
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/it-tools/page-one'
        ]}
      >
        <Route path="/models/:modelID/task-list/it-tools/page-one">
          <ITToolsSummary
            question="Will you manage Part C/D enrollment?"
            answers={['Yes']}
            redirect={`/models/${modelID}/task-list/payments`}
            answered={managePartCDEnrollment !== null}
            needsTool={questionOneNeedsTools}
            subtext="If you change your answer to “Yes”, you can select tools from the list below."
            scrollElememnt="managePartCDEnrollment"
            locked={LockStatus.UNLOCKED}
          />
        </Route>
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
