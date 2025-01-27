import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { auth } from "../../FirebaseConfig";
import { router } from "expo-router";
import { getAuth } from "firebase/auth";
import { UserCircle2, LogOut } from "lucide-react-native";

export default function HomePage() {
  const [showSignOut, setShowSignOut] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const toggleSignOutButton = () => {
    setShowSignOut(!showSignOut);
  };

  const handleSignOut = () => {
    auth.signOut();
    router.replace("../sign-in.tsx");
  };

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: showSignOut ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [showSignOut]);

  // Redirect to login if not authenticated
  getAuth().onAuthStateChanged((user) => {
    if (!user) router.replace("../index.tsx");
  });

  return (
    <LinearGradient
      colors={["#FFFFFF", "#EAFFCD"]}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <SafeAreaView style={styles.innerContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.avatarButton}
            onPress={toggleSignOutButton}
          >
            <UserCircle2 color="#304121" size={40} />
          </TouchableOpacity>
          {showSignOut && (
            <Animated.View
              style={[styles.signOutContainer, { opacity: fadeAnim }]}
            >
              <TouchableOpacity
                style={styles.signOutButton}
                onPress={handleSignOut}
              >
                <LogOut color="white" size={24} />
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
        <View style={styles.content}>
          <Text style={styles.welcomeText}>Welcome!</Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: 10,
    alignItems: "center",
  },
  avatarButton: {
    width: 65,
    height: 50,
    padding: 10,
  },
  signOutContainer: {
    position: "absolute",
    top: 70, // Adjust position to align below the avatar
    right: 10,
  },
  signOutButton: {
    backgroundColor: "#98B66E",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    shadowColor: "#304121",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#304121",
    textAlign: "center",
  },
});
