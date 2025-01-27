import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
export default function TabsLayout() {
  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          tabBarStyle: styles.tabBar,
          tabBarItemStyle: styles.tabItem,
          tabBarIconStyle: styles.tabIcon,
          tabBarActiveTintColor: "#25292e",
          tabBarInactiveTintColor: "#98B66E",
          tabBarLabelStyle: styles.tabLabel,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            headerTitle: "Index",
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "home-sharp" : "home-outline"}
                size={30}
                color={focused ? "#000000" : "#FFFFFF"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="galeryScreen"
          options={{
            headerTitle: "Galery",
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "image-sharp" : "image-outline"}
                size={30}
                color={focused ? "#000000" : "#FFFFFF"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="cameraScreen"
          options={{
            headerTitle: "CameraScreen",
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "camera-sharp" : "camera-outline"}
                size={30}
                color={focused ? "#000000" : "#FFFFFF"}
              />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: "#98B66E",
    height: 100,
    shadowColor: "#304121",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  tabItem: {
    paddingVertical: 10,
  },
  tabIcon: {
    marginBottom: 5,
  },
  tabLabel: {
    fontFamily: "NunitoSans_10pt_Expanded-Regular",
    fontSize: 14,
    color: "#98B66E",
  },
});
