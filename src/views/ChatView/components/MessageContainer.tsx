/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable camelcase */
import React, { memo } from 'react';
import { List } from 'react-native-paper';

import { useAuth } from '../../../lib/context/auth';

import DialogComponent from '../../../components/Dialog';
import MessageBubble from './MessageBubble';

import { TSingleMessage } from '../../../lib/types/TSchema';
import { useMessages } from '../../../lib/context/messages';
import MessageInteractions from '../services/interactions';

interface IMessageContainer {
  message: TSingleMessage;
}

function MessageContainer({ message }: IMessageContainer) {
  const currentUser = useAuth().authState.id;
  const { DialogBlock, showDialog, hideDialog } = DialogComponent();

  const { chat_id } = useMessages();
  if (!chat_id) throw new Error('Missing chat_id');

  const m = MessageInteractions(chat_id);

  const dialogContent = [
    {
      children: (
        <List.Item
          title="Edit"
          description="Edit your message"
          left={(props) => <List.Icon {...props} icon="folder" />}
          onPress={() => {
            console.log('Edit', message.message_id);
            m.updateMessage(message.message_id, 'Hello World').then(() => hideDialog());
          }}
        />
      ),
    },
    {
      children: (
        <List.Item
          title="Delete"
          description="Delete your message"
          left={(props) => <List.Icon {...props} icon="folder" />}
          onPress={() => {
            if (chat_id) m.deleteMessage(message.message_id).then(() => hideDialog());
          }}
        />
      ),
    },
  ];

  const isToday = (date: Date) => {
    const now = new Date();

    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  };
  const isSelf = message.author.user_id === currentUser;
  const date = new Date(message.timestamp);
  const author = isSelf ? 'Me' : `${message.author.first_name} ${message.author.last_name}`;

  return (
    <>
      <MessageBubble
        message={message.message}
        author={author}
        date={isToday(date) ? date.toLocaleTimeString() : date.toLocaleString()}
        isSelf={isSelf}
        actions={{
          onLongPress: showDialog,
          onTouchStart: () =>
            console.log(`chat_id ${chat_id}, message id: ${message.message_id ?? 'not defined'}`),
        }}
      />
      <DialogBlock title="Actions" content={dialogContent} />
    </>
  );
}

export default memo(MessageContainer);
