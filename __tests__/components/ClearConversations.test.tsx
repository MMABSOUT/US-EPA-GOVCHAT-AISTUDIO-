/**
 * @vitest-environment jsdom
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock next-i18next
vi.mock('next-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

import { ClearConversations } from '@/components/Chatbar/components/ClearConversations';

describe('ClearConversations', () => {
  let container: HTMLDivElement;
  let root: ReactDOM.Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = ReactDOM.createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it('renders initial Clear conversations button', () => {
    const onClearMock = vi.fn();
    act(() => {
      root.render(<ClearConversations onClearConversations={onClearMock} />);
    });

    const button = container.querySelector('button');
    expect(button).not.toBeNull();
    expect(button?.textContent).toContain('Clear conversations');
  });

  it('switches to accessible confirmation state when clicked', () => {
    const onClearMock = vi.fn();
    act(() => {
      root.render(<ClearConversations onClearConversations={onClearMock} />);
    });

    const initialButton = container.querySelector('button')!;
    act(() => {
      initialButton.click();
    });

    expect(container.textContent).toContain('Are you sure?');

    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(2);

    const confirmButton = buttons[0];
    const cancelButton = buttons[1];

    expect(confirmButton.getAttribute('aria-label')).toBe('Confirm clear conversations');
    expect(confirmButton.getAttribute('title')).toBe('Confirm clear conversations');

    expect(cancelButton.getAttribute('aria-label')).toBe('Cancel');
    expect(cancelButton.getAttribute('title')).toBe('Cancel');
  });

  it('calls onClearConversations and resets when confirm button is clicked', () => {
    const onClearMock = vi.fn();
    act(() => {
      root.render(<ClearConversations onClearConversations={onClearMock} />);
    });

    const initialButton = container.querySelector('button')!;
    act(() => {
      initialButton.click();
    });

    const confirmButton = container.querySelectorAll('button')[0];
    act(() => {
      confirmButton.click();
    });

    expect(onClearMock).toHaveBeenCalledTimes(1);
    expect(container.textContent).toContain('Clear conversations');
  });

  it('cancels confirmation without calling onClearConversations when cancel button is clicked', () => {
    const onClearMock = vi.fn();
    act(() => {
      root.render(<ClearConversations onClearConversations={onClearMock} />);
    });

    const initialButton = container.querySelector('button')!;
    act(() => {
      initialButton.click();
    });

    const cancelButton = container.querySelectorAll('button')[1];
    act(() => {
      cancelButton.click();
    });

    expect(onClearMock).not.toHaveBeenCalled();
    expect(container.textContent).toContain('Clear conversations');
  });
});
