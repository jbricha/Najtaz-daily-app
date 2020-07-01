import React from 'react';
import Login from './Views/Login';
import { StyleSheet, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import ReportTotalPresences from './Views/ReportTotalPresences';
import GroupActivity from './Views/GroupActivity';
import UpdateGroupDayParticipations from './Views/UpdateGroupDayParticipations';
import AddNewGroupDayParticipations from './Views/AddNewGroupDayParticipations';
import { Icon } from "react-native-elements";

require('moment/locale/fr.js');

const Stack = createStackNavigator();

export default function App() {

  function _goToAddNewGroupDayParticipations() {
    this.props.navigation.
      navigate("GroupDayParticipations",
        {
        })
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        
        {/* LOGIN */}
        <Stack.Screen options={{ headerShown: false }} name="Login" component={Login} />

        {/* Coordinators : COORD */}
        <Stack.Screen name="GroupActivity"
          component={GroupActivity}
          options={{ title: 'Activités du groupe',
                     headerLeft: null }} />
        <Stack.Screen name="UpdateGroupDayParticipations"
          component={UpdateGroupDayParticipations}
          options={{ title: 'Modification des participations' }} />
        <Stack.Screen name="AddNewGroupDayParticipations"
          component={AddNewGroupDayParticipations}
          options={{ title: 'Ajout de nouvelles participations' }} />

        {/* Observers : OBS */}
        <Stack.Screen name="ReportTotalPresences"
          component={ReportTotalPresences}
          options={{ title: 'Reporting des présences',
                    headerLeft: null }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
