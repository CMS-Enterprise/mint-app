import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { mount } from 'enzyme';
import toJson, { OutputMapper } from 'enzyme-to-json';
import i18next from 'i18next';

import { modelBasicsMocks as mocks, modelID } from 'data/mock/readonly';
import i18n from 'i18n';
import { ModelCategory } from 'types/graphql-global-types';
import { translateModelCategory } from 'utils/modelPlan';
import renameTooltipAriaAndID from 'utils/testing/snapshotSerializeReplacements';

import ReadOnlyModelBasics from './index';

describe('Read Only Model Plan Summary -- Model Basics', () => {
  it('renders without errors', async () => {
    render(
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
      expect(screen.getByText('Second Name')).toBeInTheDocument();
      expect(
        screen.getByText(
          i18next.t<string>(
            `basics:modelCategory.options.${ModelCategory.STATE_BASED}`
          )
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          i18next.t<string>(
            `basics:modelCategory.options.${ModelCategory.ACCOUNTABLE_CARE}`
          )
        )
      ).toBeInTheDocument();
    });
  });
  it('matches snapshot', async () => {
    // const { asFragment } = render(
    const component = mount(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter
          initialEntries={[`/models/${modelID}/read-only/model-basics`]}
        >
          <MockedProvider mocks={mocks} addTypename={false}>
            <Route path="/models/:modelID/read-only/model-basics">
              <ReadOnlyModelBasics modelID={modelID} />
            </Route>
          </MockedProvider>
        </MemoryRouter>
      </I18nextProvider>
    );

    await waitFor(() => {
      expect(
        component
          .text()
          .includes(translateModelCategory(ModelCategory.STATE_BASED))
      ).toBe(true);
    });
    //   expect(component.text().includes('The Center for Awesomeness')).toBe(
    //     true
    //   );
    // });

    // expect(
    //   toJson(component, {
    //     mode: 'deep',
    //     map: renameTooltipAriaAndID as OutputMapper
    //   })
    // ).toMatchSnapshot();

    // await waitFor(() => {
    //   // expect(screen.getByText('Second Name')).toBeInTheDocument();
    //   expect(component.text().includes('Second Name')).toBe(true);
    //   expect(
    //     screen.getByText(
    //       i18next.t<string>(
    //         `basics:modelCategory.options.${ModelCategory.STATE_BASED}`
    //       )
    //     )
    //   ).toBeInTheDocument();
    //   expect(
    //     screen.getByText(
    //       i18next.t<string>(
    //         `basics:modelCategory.options.${ModelCategory.ACCOUNTABLE_CARE}`
    //       )
    //     )
    //   ).toBeInTheDocument();
    // });

    expect(
      toJson(component, {
        mode: 'deep',
        map: renameTooltipAriaAndID as OutputMapper
      })
    ).toMatchSnapshot();
  });
});
