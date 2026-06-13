import React from "react";
import { View, Image, Dimensions, Platform, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Profile, Home, ChatList, Appointments, Account } from "../screens";
import imagePath from "../theme/imagePath";
import { Colors } from "../theme";
import fonts from "../theme/fonts";

// Define types for props
interface RenderTabIconsProps {
  icon: any;
  activeIcon: any;
  isFocused: boolean;
  name: string;
  isImage?: boolean;
}

const Tabs = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const DeviceW = Dimensions.get("screen").width;

const RenderTabIcons: React.FC<RenderTabIconsProps> = (props) => {
  const { isFocused, icon, activeIcon, name } = props;

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: DeviceW / 5,
        marginTop: 15,
      }}
    >
      <Image
        source={isFocused ? activeIcon : icon}
        resizeMode="contain"
        style={{
          height: 25,
          width: 25,
        }}
      />
      <Text
        style={{
          fontFamily: isFocused ? fonts.Poppins_Regular : fonts.Poppins_Regular,
          fontSize: fonts.SIZE_11,
          color: !isFocused
            ? Colors.primary.BOTTOM_INACTIVE
            : Colors.primary.BLACK,
          marginTop: 5,
        }}
      >
        {name}
      </Text>
    </View>
  );
};

function HomeStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeTab"
        component={Home}
        options={{
          headerShown: false,
          headerTitleAlign: "center",
          headerTransparent: false,
        }}
      />
    </Stack.Navigator>
  );
}

function ProfileStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AcoountTab"
        component={Account}
        options={{
          headerShown: false,
          headerTitleAlign: "center",
          headerTransparent: false,
        }}
      />
    </Stack.Navigator>
  );
}

function AppointMentsNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AppointmentsTab"
        component={Appointments}
        options={{
          headerShown: false,
          headerTitleAlign: "center",
          headerTransparent: false,
        }}
      />
    </Stack.Navigator>
  );
}

const BottomTab: React.FC = () => {
  return (
    <Tabs.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        headerTitleAlign: "center",
        tabBarStyle: {
          height: Platform.OS === "ios" ? 90 : 80,
          width: "100%",
          paddingHorizontal: 5,
          backgroundColor: Colors.primary.WHITE,
          borderTopWidth: 0,
        },
      }}
      initialRouteName={"Home"}
    >
      <Tabs.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => (
            <RenderTabIcons
              icon={imagePath.home_inactive_icon}
              activeIcon={imagePath.home_active_icon}
              name={"Home"}
              isFocused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Appointments"
        component={AppointMentsNavigator}
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => (
            <RenderTabIcons
              icon={imagePath.calendar_inactive_icon}
              activeIcon={imagePath.calendar_active_icon}
              name={"Appointments"}
              isFocused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => (
            <RenderTabIcons
              icon={imagePath.profile_inactive_icon}
              activeIcon={imagePath.profile_active_icon}
              name={"Account"}
              isFocused={focused}
            />
          ),
        }}
      />
    </Tabs.Navigator>
  );
};

export default BottomTab;
