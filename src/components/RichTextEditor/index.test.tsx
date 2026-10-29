import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { stubProseMirrorLayout } from 'tests/util';

import RichTextEditor from './index';

const renderEditor = () => {
  const onChange = vi.fn();
  render(
    <>
      <span id="message-label">Message</span>
      <RichTextEditor
        id="message"
        ariaLabelledBy="message-label"
        onChange={onChange}
      />
    </>
  );

  const lastHtml = () => onChange.mock.lastCall?.[0];

  return { onChange, lastHtml };
};

const typeIntoEditor = async (
  user: ReturnType<typeof userEvent.setup>,
  text: string
) => {
  const editor = await screen.findByRole('textbox', { name: 'Message' });
  await user.click(editor);
  await user.keyboard(text);
};

// Toolbar commands return focus to the editor asynchronously
const clickToolbarButton = async (
  user: ReturnType<typeof userEvent.setup>,
  button: HTMLElement
) => {
  await user.click(button);
  await waitFor(() =>
    expect(screen.getByRole('textbox', { name: 'Message' })).toHaveFocus()
  );
};

const selectAll = (user: ReturnType<typeof userEvent.setup>) =>
  user.keyboard('{Control>}a{/Control}');

describe('RichTextEditor', () => {
  beforeAll(() => {
    stubProseMirrorLayout();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('starts with every toolbar button unpressed', async () => {
    renderEditor();

    await screen.findByRole('textbox', { name: 'Message' });

    [
      'Bold',
      'Italic',
      'Underline',
      'Bulleted list',
      'Numbered list',
      'Link'
    ].forEach(name => {
      expect(screen.getByRole('button', { name })).toHaveAttribute(
        'aria-pressed',
        'false'
      );
    });
  });

  it.each([
    ['Bold', 'strong'],
    ['Italic', 'em'],
    ['Underline', 'u']
  ])('applies and removes %s formatting', async (label, tag) => {
    const user = userEvent.setup();
    const { lastHtml } = renderEditor();

    await typeIntoEditor(user, 'a');

    const button = screen.getByRole('button', { name: label });
    await clickToolbarButton(user, button);
    expect(button).toHaveAttribute('aria-pressed', 'true');
    await user.keyboard('b');

    await clickToolbarButton(user, button);
    expect(button).toHaveAttribute('aria-pressed', 'false');
    await user.keyboard('c');

    expect(lastHtml()).toBe(`<p>a<${tag}>b</${tag}>c</p>`);
  });

  it.each([
    ['Bulleted list', 'ul'],
    ['Numbered list', 'ol']
  ])('toggles a %s on and off', async (label, tag) => {
    const user = userEvent.setup();
    const { lastHtml } = renderEditor();

    await typeIntoEditor(user, 'Item');

    const button = screen.getByRole('button', { name: label });
    await clickToolbarButton(user, button);
    expect(button).toHaveAttribute('aria-pressed', 'true');
    // TipTap keeps an empty paragraph after a list so users can type below it
    expect(lastHtml()).toBe(`<${tag}><li><p>Item</p></li></${tag}><p></p>`);

    await clickToolbarButton(user, button);
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(lastHtml()).toBe('<p>Item</p><p></p>');
  });

  it('creates and removes a link', async () => {
    const user = userEvent.setup();
    const { lastHtml } = renderEditor();
    const prompt = vi
      .spyOn(window, 'prompt')
      .mockReturnValue('https://example.com');

    await typeIntoEditor(user, 'Docs');
    await selectAll(user);

    const button = screen.getByRole('button', { name: 'Link' });
    await clickToolbarButton(user, button);

    expect(prompt).toHaveBeenCalledWith('Enter the URL for this link');
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(lastHtml()).toMatch(
      /^<p><a [^>]*href="https:\/\/example\.com"[^>]*>Docs<\/a><\/p>$/
    );

    await clickToolbarButton(user, button);

    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(lastHtml()).toBe('<p>Docs</p>');
    expect(prompt).toHaveBeenCalledTimes(1);
  });

  it('leaves the text unchanged when the link prompt is cancelled', async () => {
    const user = userEvent.setup();
    const { onChange, lastHtml } = renderEditor();
    vi.spyOn(window, 'prompt').mockReturnValue(null);

    await typeIntoEditor(user, 'Docs');
    await selectAll(user);
    const callsBeforeLink = onChange.mock.calls.length;

    const button = screen.getByRole('button', { name: 'Link' });
    await user.click(button);

    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(onChange).toHaveBeenCalledTimes(callsBeforeLink);
    expect(lastHtml()).toBe('<p>Docs</p>');
  });

  it('reports the editor as empty once its text is cleared', async () => {
    const user = userEvent.setup();
    const { onChange } = renderEditor();

    await typeIntoEditor(user, 'Hello');
    expect(onChange).toHaveBeenLastCalledWith('<p>Hello</p>', false);

    await selectAll(user);
    await user.keyboard('{Backspace}');

    expect(onChange).toHaveBeenLastCalledWith('<p></p>', true);
  });
});
