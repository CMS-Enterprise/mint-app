import React from 'react';
import { act, render, waitFor } from '@testing-library/react';

import setup from 'utils/testing/setup';

import TabPanel from './TabPanel';
import Tabs from './Tabs';

describe('The Tabs component', () => {
  it('renders without errors', async () => {
    await act(async () => {
      const { getByTestId } = render(
        <Tabs>
          <TabPanel id="Tab1" tabName="Tab 1">
            Tab 1
          </TabPanel>
          <TabPanel id="Tab2" tabName="Tab 2">
            Tab 2
          </TabPanel>
        </Tabs>
      );

      expect(getByTestId('mint-tabs')).toBeInTheDocument();
    });
  });

  it('renders the first tab panel', () => {
    const fixture = 'test content panel 1';
    const { getByTestId } = render(
      <Tabs>
        <TabPanel id="Tab1" tabName="Tab 1">
          <div data-testid="panel-1">{fixture}</div>
        </TabPanel>
        <TabPanel id="Tab2" tabName="Tab 2">
          Tab 2
        </TabPanel>
      </Tabs>
    );

    expect(getByTestId('Tab1-tab')).toHaveClass('mint-tabs__tab--selected');
    expect(getByTestId('panel-1').textContent).toEqual(fixture);
  });

  it('renders a custom default active tab', async () => {
    await act(async () => {
      const { getByTestId } = render(
        <Tabs defaultActiveTab="Tab 2">
          <TabPanel id="Tab1" tabName="Tab 1">
            Tab 1
          </TabPanel>
          <TabPanel id="Tab2" tabName="Tab 2">
            Tab 2
          </TabPanel>
        </Tabs>
      );

      expect(getByTestId('Tab2-tab')).toHaveClass('mint-tabs__tab--selected');
      expect(getByTestId('Tab2-panel')).not.toHaveClass('mint-print-only');
    });
  });

  it('renders tabs based on tab panel children', async () => {
    await act(async () => {
      const { getAllByRole } = render(
        <Tabs>
          <TabPanel id="Tab1" tabName="Tab 1">
            Tab 1
          </TabPanel>
          <TabPanel id="Tab2" tabName="Tab 2">
            Tab 2
          </TabPanel>
          <TabPanel id="Tab3" tabName="Tab 3">
            Tab 3
          </TabPanel>
        </Tabs>
      );

      expect(getAllByRole('tab').length).toEqual(3);
    });
  });

  it('renders new tab panel on click', async () => {
    const { user, getByTestId } = setup(
      <Tabs defaultActiveTab="Tab 2">
        <TabPanel id="Tab1" tabName="Tab 1">
          Tab 1
        </TabPanel>
        <TabPanel id="Tab2" tabName="Tab 2">
          Tab 2
        </TabPanel>
        <TabPanel id="Tab3" tabName="Tab 3">
          Tab 3
        </TabPanel>
      </Tabs>
    );

    await user.click(getByTestId('Tab3-tab-btn'));
    expect(getByTestId('Tab3-tab')).toHaveClass('mint-tabs__tab--selected');
    expect(getByTestId('Tab3-panel')).not.toHaveClass('mint-print-only');
  });

  describe('keyboard actions', () => {
    it('switches tabs on arrow right', async () => {
      const { user, getByTestId } = setup(
        <Tabs>
          <TabPanel id="Tab1" tabName="Tab 1">
            Tab 1
          </TabPanel>
          <TabPanel id="Tab2" tabName="Tab 2">
            Tab 2
          </TabPanel>
          <TabPanel id="Tab3" tabName="Tab 3">
            Tab 3
          </TabPanel>
        </Tabs>
      );
      const startingTab = getByTestId('Tab1-tab-btn');

      await waitFor(async () => {
        await user.click(startingTab);
        await user.type(startingTab, '{arrowright}');
        expect(getByTestId('Tab2-tab-btn')).toHaveFocus();
        expect(getByTestId('Tab2-tab')).toHaveClass('mint-tabs__tab--selected');
        expect(getByTestId('Tab2-panel')).not.toHaveClass('mint-print-only');
      });
    });
    it('switches tabs on left right', async () => {
      const { user, getByTestId } = setup(
        <Tabs>
          <TabPanel id="Tab1" tabName="Tab 1">
            Tab 1
          </TabPanel>
          <TabPanel id="Tab2" tabName="Tab 2">
            Tab 2
          </TabPanel>
          <TabPanel id="Tab3" tabName="Tab 3">
            Tab 3
          </TabPanel>
        </Tabs>
      );
      const startingTab = getByTestId('Tab3-tab-btn');

      await waitFor(async () => {
        await user.click(startingTab);
        await user.type(startingTab, '{arrowleft}');

        expect(getByTestId('Tab2-tab-btn')).toHaveFocus();
        expect(getByTestId('Tab2-tab')).toHaveClass('mint-tabs__tab--selected');
        expect(getByTestId('Tab2-panel')).not.toHaveClass('mint-print-only');
      });
    });
    it('loops to last tab on left arrow click', async () => {
      const { user, getByTestId } = setup(
        <Tabs>
          <TabPanel id="Tab1" tabName="Tab 1">
            Tab 1
          </TabPanel>
          <TabPanel id="Tab2" tabName="Tab 2">
            Tab 2
          </TabPanel>
          <TabPanel id="Tab3" tabName="Tab 3">
            Tab 3
          </TabPanel>
        </Tabs>
      );
      const startingTab = getByTestId('Tab1-tab-btn');

      await waitFor(async () => {
        await user.click(startingTab);
        await user.type(startingTab, '{arrowleft}');
        expect(getByTestId('Tab3-tab-btn')).toHaveFocus();
        expect(getByTestId('Tab3-tab')).toHaveClass('mint-tabs__tab--selected');
        expect(getByTestId('Tab3-panel')).not.toHaveClass('mint-print-only');
      });
    });
    it('loops to first tab on right arrow click', async () => {
      const { user, getByTestId } = setup(
        <Tabs>
          <TabPanel id="Tab1" tabName="Tab 1">
            Tab 1
          </TabPanel>
          <TabPanel id="Tab2" tabName="Tab 2">
            Tab 2
          </TabPanel>
          <TabPanel id="Tab3" tabName="Tab 3">
            Tab 3
          </TabPanel>
        </Tabs>
      );
      const startingTab = getByTestId('Tab3-tab-btn');

      await waitFor(async () => {
        await user.click(startingTab);
        await user.type(startingTab, '{arrowright}');
        expect(getByTestId('Tab1-tab-btn')).toHaveFocus();
        expect(getByTestId('Tab1-tab')).toHaveClass('mint-tabs__tab--selected');
        expect(getByTestId('Tab1-panel')).not.toHaveClass('mint-print-only');
      });
    });

    it('focuses tab panel on tab', async () => {
      const { user, getByTestId } = setup(
        <Tabs>
          <TabPanel id="Tab1" tabName="Tab 1">
            Tab 1
          </TabPanel>
          <TabPanel id="Tab2" tabName="Tab 2">
            Tab 2
          </TabPanel>
          <TabPanel id="Tab3" tabName="Tab 3">
            Tab 3
          </TabPanel>
        </Tabs>
      );
      const startingTab = getByTestId('Tab1-tab-btn');

      await waitFor(async () => {
        await user.click(startingTab);
        await user.tab();
        expect(getByTestId('Tab1-panel')).toHaveFocus();
        expect(getByTestId('Tab1-panel')).not.toHaveClass('mint-print-only');
      });
    });
    it('focuses first tab on home key press', async () => {
      const { user, getByTestId } = setup(
        <Tabs>
          <TabPanel id="Tab1" tabName="Tab 1">
            Tab 1
          </TabPanel>
          <TabPanel id="Tab2" tabName="Tab 2">
            Tab 2
          </TabPanel>
          <TabPanel id="Tab3" tabName="Tab 3">
            Tab 3
          </TabPanel>
        </Tabs>
      );
      const startingTab = getByTestId('Tab3-tab-btn');

      await waitFor(async () => {
        await user.click(startingTab);
        await user.type(startingTab, '{home}');
        expect(getByTestId('Tab1-tab-btn')).toHaveFocus();
        expect(getByTestId('Tab1-tab')).toHaveClass('mint-tabs__tab--selected');
        expect(getByTestId('Tab1-panel')).not.toHaveClass('mint-print-only');
      });
    });
    it('focuses last tab on end key press', async () => {
      const { user, getByTestId } = setup(
        <Tabs>
          <TabPanel id="Tab1" tabName="Tab 1">
            Tab 1
          </TabPanel>
          <TabPanel id="Tab2" tabName="Tab 2">
            Tab 2
          </TabPanel>
          <TabPanel id="Tab3" tabName="Tab 3">
            Tab 3
          </TabPanel>
        </Tabs>
      );
      const startingTab = getByTestId('Tab3-tab-btn');

      await waitFor(async () => {
        await user.click(startingTab);
        await user.type(startingTab, '{end}');
        expect(getByTestId('Tab3-tab-btn')).toHaveFocus();
        expect(getByTestId('Tab3-tab')).toHaveClass('mint-tabs__tab--selected');
        expect(getByTestId('Tab3-panel')).not.toHaveClass('mint-print-only');
      });
    });
  });
  describe('html attributes', () => {
    it('has required accessiiblity attributes for selected tab', async () => {
      await act(async () => {
        const { getByTestId } = render(
          <Tabs>
            <TabPanel id="Tab1" tabName="Tab 1">
              Tab 1
            </TabPanel>
            <TabPanel id="Tab2" tabName="Tab 2">
              Tab 2
            </TabPanel>
          </Tabs>
        );
        const selectedTab = getByTestId('Tab1-tab-btn');
        const selectedTabPanel = getByTestId('Tab1-panel');
        expect(selectedTab).toHaveAttribute('aria-selected', 'true');
        expect(selectedTab).toHaveAttribute('aria-controls', 'Tab1');
        expect(selectedTabPanel).toHaveAttribute('id', 'Tab1');
      });
    });
    it('unselected tab has correct attributes', async () => {
      await act(async () => {
        const { getByTestId } = render(
          <Tabs>
            <TabPanel id="Tab1" tabName="Tab 1">
              Tab 1
            </TabPanel>
            <TabPanel id="Tab2" tabName="Tab 2">
              Tab 2
            </TabPanel>
          </Tabs>
        );
        const selectedTab = getByTestId('Tab2-tab-btn');
        expect(selectedTab).toHaveAttribute('aria-selected', 'false');
        expect(selectedTab).toHaveAttribute('tabindex', '-1');
        expect(selectedTab).toHaveAttribute('aria-controls', 'Tab2');
      });
    });
  });
});
