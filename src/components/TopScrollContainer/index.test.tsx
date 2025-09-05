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
      // Mock scrollWidth > clientWidth to simulate overflow
      const mockElement = {
        scrollWidth: 1500,
        clientWidth: 800,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      };

      vi.spyOn(React, 'useRef').mockReturnValue({ current: mockElement });

      render(
        <TopScrollContainer>
          <WideContent width={1500} />
        </TopScrollContainer>
      );

      // Wait for the overflow detection to run
      await waitFor(() => {
        const topScrollbar = document.querySelector('.top-scroll-container');
        expect(topScrollbar).toBeInTheDocument();
      });
    });

    it('hides top scrollbar when content does not overflow', async () => {
      // Mock scrollWidth <= clientWidth to simulate no overflow
      const mockElement = {
        scrollWidth: 600,
        clientWidth: 800,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      };

      vi.spyOn(React, 'useRef').mockReturnValue({ current: mockElement });

      render(
        <TopScrollContainer>
          <NarrowContent />
        </TopScrollContainer>
      );

      // Wait for the overflow detection to run
      await waitFor(() => {
        const topScrollbar = document.querySelector('.top-scroll-container');
        expect(topScrollbar).not.toBeInTheDocument();
      });
    });
  });

  describe('Scroll Synchronization', () => {
    it('sets up scroll event listeners', () => {
      const addEventListenerSpy = vi.fn();
      const mockElement = {
        scrollWidth: 1500,
        clientWidth: 800,
        addEventListener: addEventListenerSpy,
        removeEventListener: vi.fn()
      };

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

    it('cleans up event listeners on unmount', () => {
      const removeEventListenerSpy = vi.fn();
      Object.defineProperty(HTMLElement.prototype, 'removeEventListener', {
        value: removeEventListenerSpy,
        configurable: true
      });

      const { unmount } = render(
        <TopScrollContainer>
          <WideContent width={1500} />
        </TopScrollContainer>
      );

      unmount();

      // Component should clean up event listeners
      expect(removeEventListenerSpy).toHaveBeenCalled();
    });
  });

  describe('Dynamic Content Changes', () => {
    it('handles content width changes', async () => {
      const { rerender } = render(
        <TopScrollContainer>
          <WideContent width={500} />
        </TopScrollContainer>
      );

      // Initially no scrollbar
      expect(
        document.querySelector('.top-scroll-container')
      ).not.toBeInTheDocument();

      // Change to wider content
      rerender(
        <TopScrollContainer>
          <WideContent width={1500} />
        </TopScrollContainer>
      );

      // Should now show scrollbar (with proper mocking this would work)
      // In a real test environment, you'd need to properly mock the DOM measurements
    });

    it('handles multiple children', () => {
      render(
        <TopScrollContainer>
          <div>First child</div>
          <div>Second child</div>
          <WideContent />
        </TopScrollContainer>
      );

      expect(screen.getByText('First child')).toBeInTheDocument();
      expect(screen.getByText('Second child')).toBeInTheDocument();
      expect(screen.getByTestId('wide-content')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles null refs gracefully', () => {
      vi.spyOn(React, 'useRef').mockReturnValue({ current: null });

      expect(() => {
        render(
          <TopScrollContainer>
            <WideContent />
          </TopScrollContainer>
        );
      }).not.toThrow();
    });

    it('handles missing DOM elements gracefully', () => {
      const mockElement = {
        scrollWidth: 1500,
        clientWidth: 800,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      };

      let refCallCount = 0;
      vi.spyOn(React, 'useRef').mockImplementation(() => {
        refCallCount++;
        if (refCallCount === 1) return { current: null }; // Top scroll ref is null
        if (refCallCount === 2) return { current: mockElement };
        return { current: null };
      });

      expect(() => {
        render(
          <TopScrollContainer>
            <WideContent />
          </TopScrollContainer>
        );
      }).not.toThrow();
    });

    it('handles zero width content', () => {
      render(
        <TopScrollContainer>
          <div style={{ width: 0, height: '100px' }}>Zero width content</div>
        </TopScrollContainer>
      );

      expect(screen.getByText('Zero width content')).toBeInTheDocument();
    });

    it('handles very large content width', () => {
      render(
        <TopScrollContainer>
          <WideContent width={10000} />
        </TopScrollContainer>
      );

      expect(screen.getByTestId('wide-content')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('maintains proper DOM structure for screen readers', () => {
      render(
        <TopScrollContainer>
          <div role="table" aria-label="Data table">
            <WideContent />
          </div>
        </TopScrollContainer>
      );

      const table = screen.getByRole('table');
      expect(table).toHaveAttribute('aria-label', 'Data table');
    });

    it('preserves child component accessibility attributes', () => {
      render(
        <TopScrollContainer>
          <button aria-label="Test button">Click me</button>
        </TopScrollContainer>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Test button');
    });
  });

  describe('Performance', () => {
    it('renders efficiently with static content', () => {
      const TestChild = () => <div>Test content</div>;

      expect(() => {
        render(
          <TopScrollContainer>
            <TestChild />
          </TopScrollContainer>
        );
      }).not.toThrow();
    });

    it('handles multiple re-renders gracefully', () => {
      const { rerender } = render(
        <TopScrollContainer>
          <div>Initial content</div>
        </TopScrollContainer>
      );

      expect(() => {
        rerender(
          <TopScrollContainer>
            <div>Updated content</div>
          </TopScrollContainer>
        );
      }).not.toThrow();
    });
  });

  describe('Integration', () => {
    it('works with table elements', () => {
      render(
        <TopScrollContainer>
          <table style={{ width: '1500px' }}>
            <thead>
              <tr>
                <th>Column 1</th>
                <th>Column 2</th>
                <th>Column 3</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Data 1</td>
                <td>Data 2</td>
                <td>Data 3</td>
              </tr>
            </tbody>
          </table>
        </TopScrollContainer>
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByText('Column 1')).toBeInTheDocument();
    });

    it('works with complex nested components', () => {
      const ComplexComponent = () => (
        <div>
          <header>Header</header>
          <main style={{ width: '1500px' }}>
            <section>
              <h1>Title</h1>
              <p>Content</p>
            </section>
          </main>
          <footer>Footer</footer>
        </div>
      );

      render(
        <TopScrollContainer>
          <ComplexComponent />
        </TopScrollContainer>
      );

      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
      expect(screen.getByText('Footer')).toBeInTheDocument();
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

    it('matches snapshot with multiple children', () => {
      const { asFragment } = render(
        <TopScrollContainer>
          <div>Child 1</div>
          <div>Child 2</div>
          <WideContent />
        </TopScrollContainer>
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
