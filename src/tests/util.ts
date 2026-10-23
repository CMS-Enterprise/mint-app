import { ReactElement } from 'react';
import { render } from '@testing-library/react';
import userEvent, { type Options } from '@testing-library/user-event';

const setup = (ui: ReactElement, options?: Options) => ({
  user: userEvent.setup(options),
  ...render(ui)
});

// jsdom does not implement layout APIs that ProseMirror reads while typing
export const stubProseMirrorLayout = () => {
  const emptyRects = () => ({
    length: 0,
    item: () => null,
    [Symbol.iterator]: () => [][Symbol.iterator]()
  });
  Range.prototype.getClientRects = emptyRects as () => DOMRectList;
  Range.prototype.getBoundingClientRect = () => new DOMRect();
  document.elementFromPoint = () => null;
};

export default setup;
