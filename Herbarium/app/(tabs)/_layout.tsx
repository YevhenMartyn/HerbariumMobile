import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: "Index",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              size={30}
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
            />
          ),
        }}
      />
    </Tabs>
  );
}
