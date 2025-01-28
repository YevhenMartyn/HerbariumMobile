import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

const index = () => {
  const navigateToSignIn = () => {
    router.push("/sign-in");
  };

  const navigateToRegister = () => {
    router.push("/register");
  };

  return (
    <LinearGradient
      colors={["#FFFFFF", "#EAFFCD"]}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <SafeAreaView style={styles.innerContainer}>
        <View style={styles.titleContainer}>
          <Image
            source={require("../assets/images/logo_herbarium.png")}
            style={styles.logo}
          />
          <Text style={styles.titleCollect}>Collect</Text>
          <Text style={styles.titleAmpersand}>&</Text>
          <Text style={styles.titleScan}>Scan plants</Text>
        </View>

        <View style={styles.formContainer}>
          <TouchableOpacity
            style={[styles.button, styles.signInButton]}
            onPress={navigateToSignIn}
          >
            <Text style={styles.signInButtonText}>Sign in</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.registerButton]}
            onPress={navigateToRegister}
          >
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 0,
  },
  titleCollect: {
    fontFamily: "Parkinsans-Bold",
    fontWeight: "bold",
    fontSize: 48,
    color: "#304121",
  },
  titleAmpersand: {
    fontFamily: "Parkinsans-Bold",
    fontWeight: "bold",
    fontSize: 48,
    color: "#98B66E",
    marginVertical: -10,
  },
  titleScan: {
    fontFamily: "Parkinsans-Bold",
    fontWeight: "bold",
    fontSize: 48,
    color: "#304121",
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    width: 341,
    height: 57,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    marginBottom: 20,
    shadowColor: "#304121",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
  },
  signInButton: {
    backgroundColor: "#98B66E",
  },
  signInButtonText: {
    fontFamily: "NunitoSans_10pt_Expanded-Regular",
    fontWeight: "bold",
    color: "white",
    fontSize: 24,
  },
  registerButton: {
    backgroundColor: "#FFFFFF",
  },
  registerButtonText: {
    fontFamily: "NunitoSans_10pt_Expanded-Regular",
    fontWeight: "bold",
    color: "#98B66E",
    fontSize: 24,
  },
});

export default index;
