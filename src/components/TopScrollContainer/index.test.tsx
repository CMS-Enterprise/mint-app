import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import TopScrollContainer from './index';

// Mock the SCSS import
vi.mock('./index.scss', () => ({}));

describe('TopScrollContainer Component', () => {
  // Helper function to create a wide content element
  const WideContent = ({ width = 2000 }: { width?: number }) => (
    <div
      data-testid="wide-content"
      style={{
        width: `${width}px`,
        height: '100px',
        backgroundColor: 'lightblue',
        whiteSpace: 'nowrap'
      }}
    >
      Very wide content that should trigger horizontal overflow
    </div>
  );

  // Helper function to create narrow content that won't overflow
  const NarrowContent = () => (
    <div
      data-testid="narrow-content"
      style={{ width: '200px', height: '100px' }}
    >
      Normal width content
    </div>
  );

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock scrollWidth and clientWidth properties
    Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
      configurable: true,
      value: 1000
    });
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      value: 800
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(
        <TopScrollContainer>
          <NarrowContent />
        </TopScrollContainer>
      );

      expect(screen.getByTestId('narrow-content')).toBeInTheDocument();
    });

    it('renders children correctly', () => {
      const testText = 'Test child content';
      render(
        <TopScrollContainer>
          <div>{testText}</div>
        </TopScrollContainer>
      );

      expect(screen.getByText(testText)).toBeInTheDocument();
    });

    it('applies correct CSS classes to containers', () => {
      render(
        <TopScrollContainer>
          <WideContent />
        </TopScrollContainer>
      );

      // Content container should have the correct class
      const contentContainer = screen.getByTestId('wide-content').parentElement;
      expect(contentContainer).toHaveClass('top-scroll-content');
    });
  });

  describe('Overflow Detection', () => {
    it('does not show top scrollbar initially', () => {
      render(
        <TopScrollContainer>
          <NarrowContent />
        </TopScrollContainer>
      );

      // Top scrollbar should not be visible initially
      expect(screen.queryByTestId('top-scrollbar')).not.toBeInTheDocument();
    });

    it('shows top scrollbar when content overflows', async () => {
      // Mock scrollWidth > clientWidth to simulate overflow for content element
      Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
        configurable: true,
        get() {
          // Return larger width for content that overflows
          return this.classList.contains('top-scroll-content') ? 1500 : 1000;
        }
      });
      Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
        configurable: true,
        get() {
          // Return smaller client width so content overflows
          return this.classList.contains('top-scroll-content') ? 800 : 800;
        }
      });

      render(
        <TopScrollContainer>
          <WideContent width={1500} />
        </TopScrollContainer>
      );

      // Wait for the overflow detection to run (component checks multiple times with timeouts)
      await waitFor(
        () => {
          const topScrollbar = document.querySelector('.top-scroll-container');
          expect(topScrollbar).toBeInTheDocument();
        },
        { timeout: 2000 }
      ); // Increase timeout since component checks after 1000ms
    });

    it('hides top scrollbar when content does not overflow', async () => {
      // Mock scrollWidth <= clientWidth to simulate no overflow for content element
      Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
        configurable: true,
        get() {
          // Return smaller width for content that doesn't overflow
          return this.classList.contains('top-scroll-content') ? 600 : 1000;
        }
      });
      Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
        configurable: true,
        get() {
          // Return larger client width so content fits
          return this.classList.contains('top-scroll-content') ? 800 : 800;
        }
      });

      render(
        <TopScrollContainer>
          <NarrowContent />
        </TopScrollContainer>
      );

      // Wait for the overflow detection to run (component checks multiple times with timeouts)
      await waitFor(
        () => {
          const topScrollbar = document.querySelector('.top-scroll-container');
          expect(topScrollbar).not.toBeInTheDocument();
        },
        { timeout: 2000 }
      ); // Increase timeout since component checks after 1000ms
    });
  });

  describe('Scroll Synchronization', () => {
    it('sets up scroll event listeners', () => {
      const addEventListenerSpy = vi.fn();

      // Mock HTMLElement prototype to simulate DOM element behavior
      Object.defineProperty(HTMLElement.prototype, 'addEventListener', {
        value: addEventListenerSpy,
        configurable: true
      });

      render(
        <TopScrollContainer>
          <WideContent width={1500} />
        </TopScrollContainer>
      );

      // The component should attempt to set up event listeners
      expect(addEventListenerSpy).toHaveBeenCalled();
    });

    it('handles scroll synchronization setup', () => {
      // Test that the component doesn't crash when setting up scroll sync
      expect(() => {
        render(
          <TopScrollContainer>
            <WideContent width={1500} />
          </TopScrollContainer>
        );
      }).not.toThrow();
    });
  });

  describe('Snapshots', () => {
    it('matches snapshot with narrow content', () => {
      const { asFragment } = render(
        <TopScrollContainer>
          <NarrowContent />
        </TopScrollContainer>
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it('matches snapshot with wide content', () => {
      const { asFragment } = render(
        <TopScrollContainer>
          <WideContent />
        </TopScrollContainer>
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
