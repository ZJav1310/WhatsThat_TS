import React, { useEffect } from 'react';
import { Snackbar } from 'react-native-paper';
import { useNotificationContext } from '../../lib/context/NotificationContext';
import log from '../../lib/util/LoggerUtil';

function NotificationContainer() {
  const { notifications, notificationCount, dispatcher } = useNotificationContext();
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [notification, setNotification] = React.useState({} as any);

  useEffect(() => {
    if (notificationCount && notificationCount > 0) {
      log.debug('[NOTIFICATION] Recieved: ', notifications);
      setNotification(dispatcher.getNotification(notificationCount));
      setShowSnackbar(true);
    }
  }, [notificationCount]);

  return (
    <Snackbar
      wrapperStyle={{ bottom: 50 }}
      visible={showSnackbar}
      onDismiss={() => setShowSnackbar(false)}
    >
      {notification && notification.message ? notification.message : 'Something went wrong...'}
    </Snackbar>
  );
}

export default NotificationContainer;
