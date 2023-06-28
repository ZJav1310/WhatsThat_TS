import React, { useEffect } from 'react';
import { View } from 'react-native';
import { ProgressBar, Snackbar, Text, TextInput } from 'react-native-paper';
import ButtonComponent from '../../components/Button';
import DialogComponent from '../../components/Dialog';
import { useApiContext } from '../../lib/context/ApiContext';
import { useAuthContext } from '../../lib/context/AuthContext';
import useFetchHook from '../../lib/hooks/useFetchHook';
import log from '../../lib/util/LoggerUtil';
import { styles } from '../../styles/GlobalStyle';
import ContactList from '../AddedUsersView/list/ContactList';

const BlockedUsersView = () => {
  const { useFetch } = useApiContext();
  const { logout } = useAuthContext();

  if (!useFetch || !logout) {
    log.error('Unable to find Auth API...');
    throw new Error('Unable to find Auth API...');
  }

  const { data, isLoading, onFetch, onError, getFresh, getCache } = useFetchHook(
    { url: '/blocked', method: 'GET' },
    true
  );

  const { DialogBlock, showDialog, hideDialog } = DialogComponent();
  const dialogContent = [
    {
      children: <TextInput label="Chat name" />,
    },
  ];

  useEffect(() => {
    onFetch(async () => await getCache())
      .then((data) => {
        if (!data) return;
        // console.log('Not implemented', data);
      })
      .catch();
  }, []);

  const Result = () => {
    if (isLoading) return <ProgressBar indeterminate={true} visible={isLoading} />;
    if (onError) return <Text>{onError}</Text>;
    if (!data) return <Text>No contacts</Text>;

    if (data) {
      return (
        <View>
          <ContactList contacts={data} />
        </View>
      );
    }
    return <Text>Blocked</Text>;
  };

  return (
    <View style={styles.container}>
      <Result />
      <DialogBlock
        title={'Create Chat'}
        content={dialogContent}
        actions={
          <>
            <ButtonComponent
              title={'Cancel'}
              onPress={() => {
                hideDialog();
              }}
            />
            <ButtonComponent
              title={'Create Chat'}
              mode="contained"
              onPress={() => {
                onFetch(async () => await getFresh());
                hideDialog();
              }}
            />
          </>
        }
      />
    </View>
  );
};

export default BlockedUsersView;
