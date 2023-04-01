import './index.scss';
import tmi from 'tmi.js';
import 'unfonts.css';
import { HTMLBuilder } from './HTMLBuilder';

async function main(): Promise<void> {
  const client = new tmi.Client({
    channels: ['zuruuh'],
  });

  const chat = document.getElementById('chat')!;
  const chatCursor = document.querySelector('#chatline span')!;

  setInterval(() => chatCursor.classList.toggle('hidden'), 500);

  const activeUsers = new Map<string, number>();

  client.on('message', (_, meta, message) => {
    if (!meta['display-name']) return;
    if (!meta.id) return;

    if (activeUsers.has(meta['display-name'])) {
      clearTimeout(activeUsers.get(meta['display-name']));
    } else {
      appendMessage(createInfoMessage(meta['display-name']!, 'joined'));
    }

    activeUsers.set(
      meta['display-name'],
      setTimeout(() => {
        appendMessage(createInfoMessage(meta['display-name']!, 'left'));
      }, 1000 * 60 * 15)
    );

    appendMessage(
      HTMLBuilder.node({
        tag: 'div',
        attributes: {
          class: 'message',
          'data-message-id': meta.id,
          'data-author-id': meta.username!,
        },
        children: [
          {
            tag: 'span',
            attributes: {
              class: `author ${meta.mod ? 'mod' : ''}`,
            },
            text: meta['display-name'],
          },
          {
            tag: 'span',
            attributes: {
              class: 'content',
            },
            text: message,
          },
        ],
      })
    );
  });

  function createInfoMessage(
    username: string,
    info: 'joined' | 'left'
  ): HTMLElement {
    return HTMLBuilder.node({
      tag: 'div',
      attributes: {
        class: 'message info',
      },
      text: `${username} ${info} the game.`,
    });
  }

  function appendMessage(message: HTMLElement): void {
    chat.appendChild(message);
    setTimeout(() => message.remove(), 1000 * 15);
  }

  const url = new URL(window.location.href);

  if (url.searchParams.get('enable') === 'true') {
    await client.connect();
  } else {
    for (let i = 0; i < 10; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      client.emit(
        // @ts-ignore
        'message',
        '#zuruuh',
        {
          'badge-info': null,
          badges: {
            broadcaster: '1',
            premium: '1',
          },
          'client-nonce': 'ceceb68c0912a28c9c8e365becf30e4b',
          color: '#FF4500',
          'display-name': 'Zuruuh',
          emotes: null,
          'first-msg': false,
          flags: null,
          id: '5d8ed21d-11d8-4990-a5ac-206b150c598'.concat(String(i)),
          mod: true,
          'returning-chatter': false,
          'room-id': '161748259',
          subscriber: false,
          'tmi-sent-ts': '1680347956143',
          turbo: false,
          'user-id': '161748259',
          'user-type': null,
          'emotes-raw': null,
          'badge-info-raw': null,
          'badges-raw': 'broadcaster/1,premium/1',
          username: 'zuruuh',
          'message-type': 'chat',
        },
        'salut tout le monde'
      );
    }
  }
}

main();
