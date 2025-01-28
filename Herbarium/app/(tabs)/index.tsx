import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Image,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { auth, firestore } from "../../FirebaseConfig";
import { router } from "expo-router";
import { getAuth } from "firebase/auth";
import { UserCircle2, LogOut } from "lucide-react-native";
import {
  collection,
  query,
  orderBy,
  limit,
  where,
  onSnapshot,
} from "firebase/firestore";

export default function HomePage() {
  const [showSignOut, setShowSignOut] = useState(false);
  const [latestImage, setLatestImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const [user, setUser] = useState(getAuth().currentUser);

  const toggleSignOutButton = () => {
    setShowSignOut(!showSignOut);
  };

  const handleSignOut = () => {
    auth.signOut();
    router.replace("/sign-in"); // Ensure the correct path to the login page
  };

  const fetchLatestImage = () => {
    if (!user) return;

    try {
      const q = query(
        collection(firestore, "images"),
        where("userId", "==", user.uid),
        orderBy("timestamp", "desc"),
        limit(1)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        if (!querySnapshot.empty) {
          const latestImageDoc = querySnapshot.docs[0];
          setLatestImage(latestImageDoc.data().url);
        } else {
          setLatestImage(null);
        }
        setLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error("Error fetching latest image: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    let unsubscribe;
    if (user) {
      unsubscribe = fetchLatestImage();
    }
    return () => {
      if (unsubscribe && typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [user]);

  useEffect(() => {
    const authUnsubscribe = getAuth().onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        router.replace("/sign-in"); // Ensure the correct path to the login page
      } else {
        setUser(currentUser);
      }
    });

    return () => authUnsubscribe();
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: showSignOut ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [showSignOut]);

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
          <Text style={styles.welcomeText}>Recent Photo</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#304121" />
          ) : latestImage ? (
            <Image source={{ uri: latestImage }} style={styles.latestImage} />
          ) : (
            <Text style={styles.noImageText}>No images available</Text>
          )}
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
  latestImage: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginTop: 20,
  },
  noImageText: {
    fontSize: 18,
    color: "#304121",
    marginTop: 20,
  },
});
