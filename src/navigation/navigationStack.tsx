import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  ChangePassword,
  CmsScreen,
  CreateProfile,
  DeleteAccount,
  EditProfile,
  ForgotPassword,
  Home,
  Login,
  Profile,
  ResetPassword,
  Signup,
  Splash,
  Verification,
  ChatScreen,
  MoreOptions,
  CreateGroup,
  GroupChatScreen,
  ChatList,
  ConsultationDetails,
  AllAppointments,
  ManageAvailability,
  PatientDetails,
  UserList,
  ReviewDetails,
  UserMedicationListScreen,
  TransactionsList,
  NotificationList,
  VideoCall,
} from "../screens";
import BottomTab from "./bottomTab";
import ImageController from "../permissions/imageController";
import HelpSupport from "../screens/appScreens/helpSupport";
import { linking } from "./linking";

const Stack = createNativeStackNavigator();

function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerBackVisible: false,
          headerBackTitleVisible: false,
          headerTitleAlign: "center",
          fullScreenGestureEnabled: true,
        }}
        initialRouteName="Splash"
      >
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="BottomTab"
          component={BottomTab}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="PatientDetails"
          component={PatientDetails}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Verification"
          component={Verification}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPassword}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="HelpSupport"
          component={HelpSupport}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="VideoCall"
          component={VideoCall}
          options={{ headerShown: false, gestureEnabled: false }}
        />

        <Stack.Screen
          name="NotificationList"
          component={NotificationList}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: true,
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="ProfileScreen"
          component={Profile}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="CreateProfile"
          component={CreateProfile}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="TransactionList"
          component={TransactionsList}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="AllAppointments"
          component={AllAppointments}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ManageAvailability"
          component={ManageAvailability}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ConsultationDetails"
          component={ConsultationDetails}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePassword}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="CmsScreen"
          component={CmsScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="DeleteAccount"
          component={DeleteAccount}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ChatList"
          component={ChatList}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="UserList"
          component={UserList}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="UserMedicationListScreen"
          component={UserMedicationListScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ReviewDetails"
          component={ReviewDetails}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="GroupChatScreen"
          component={GroupChatScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="CreateGroup"
          component={CreateGroup}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Group screenOptions={{ presentation: "modal" }}>
          <Stack.Screen
            name="ImageController"
            component={ImageController}
            options={{ headerShown: false, presentation: "transparentModal" }}
          />
          <Stack.Screen
            name="MoreOptions"
            component={MoreOptions}
            options={{ headerShown: false, presentation: "transparentModal" }}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Routes;
