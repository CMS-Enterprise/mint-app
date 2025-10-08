import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom';
import '../config/i18n';

// Fill in some missing functions that aren't shimmed by jsdom.
window.URL.createObjectURL = vi.fn();

// Fill in some scroll functions
// Usually for alerts and form field attention
window.scroll = vi.fn;
Element.prototype.scrollIntoView = vi.fn(() => {});

// Mocks the clipboard and drag events - needed for TipTap editor
Object.defineProperty(window, 'ClipboardEvent', {
  writable: true,
  value: vi.fn()
});

Object.defineProperty(window, 'DragEvent', {
  writable: true,
  value: vi.fn()
});

// Mock ResizeObserver for ResponsiveContainer (Recharts)
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));

vi.mock('src/app/Clients/github', () => ({
  default: {
    query: vi.fn()
  }
}));
