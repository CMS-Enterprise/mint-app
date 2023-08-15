import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { waitFor } from '@testing-library/react';
import { mount } from 'enzyme';
import toJson, { OutputMapper } from 'enzyme-to-json';
import i18next from 'i18next';

import { modelBasicsMocks as mocks, modelID } from 'data/mock/readonly';
import { ModelCategory } from 'types/graphql-global-types';
import { translateModelCategory } from 'utils/modelPlan';
import renameTooltipAriaAndID from 'utils/testing/snapshotSerializeReplacements';

import ReadOnlyModelBasics from './index';

describe('Read Only Model Plan Summary -- Model Basics', () => {
  it('renders without errors', async () => {
    const component = mount(
      <MemoryRouter
        initialEntries={[`/models/${modelID}/read-only/model-basics`]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <Route path="/models/:modelID/read-only/model-basics">
            <ReadOnlyModelBasics modelID={modelID} />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(component.text().includes('Second Name')).toBe(true);
      expect(
        component
          .text()
          .includes(translateModelCategory(ModelCategory.STATE_BASED))
      ).toBe(true);
      expect(
        component
          .text()
          .includes(
            i18next.t<string>(
              `basics:modelCategory.options.${ModelCategory.ACCOUNTABLE_CARE}`
            )
          )
      ).toBe(true);
    });
  });
  xit('matches snapshot', async () => {
    const component = mount(
      <MemoryRouter
        initialEntries={[`/models/${modelID}/read-only/model-basics`]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <Route path="/models/:modelID/read-only/model-basics">
            <ReadOnlyModelBasics modelID={modelID} />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(component.text().includes('The Center for Awesomeness')).toBe(
        true
      );
    });

    expect(
      toJson(component, {
        mode: 'deep',
        map: renameTooltipAriaAndID as OutputMapper
      })
    ).toMatchSnapshot();
  });
});
