import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/chat/ChatSummaryScreen';
import ProfileScreen from '../screens/account/MyProfileScreen';
import { HStack, IconButton } from '@react-native-material/core';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import ContactsScreen from '../screens/account/MyContactListScreen';
import { useNavigation } from '@react-navigation/native';

export type BottomTabNavigator = {
  Chats: undefined;
  Contacts: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<BottomTabNavigator>();

export function TabNavigator() {
  const navigation = useNavigation();

  return (
    <Tab.Navigator initialRouteName="Chats">
      <Tab.Screen
        name="Contacts"
        component={ContactsScreen}
        options={() => ({
          // Add a placeholder button without the `onPress` to avoid flicker
          headerRight: () => (
            <HStack>
              <IconButton
                icon={(props) => <Icon name="account-plus" {...props} />}
                color="primary"
                onPress={() => navigation.navigate('AddContact')}
              />
              <IconButton
                icon={(props) => <Icon name="account-remove" {...props} />}
                color="primary"
                onPress={() => console.log("block contact")}
                // onPress={() => navigation.navigate('Blocked List')} //FIXME: Shouldn't need to navigate to a new page
              />
            </HStack>
          ),
        })}
      />
      <Tab.Screen
        name="Chats"
        component={HomeScreen}
        options={() => ({
          // Add a placeholder button without the `onPress` to avoid flicker
          headerRight: () => (
            <IconButton
              icon={(props) => <Icon name="plus" {...props} />}
              color="primary"
              onPress={() => navigation.navigate('MyModal')}
            />
          ),
        })}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
