import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { auth } from "../FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { router } from "expo-router";

const SignInScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      if (user) router.replace("/(tabs)");
    } catch (error: any) {
      console.log(error);
      alert("Sign in failed: " + error.message);
    }
  };

  const navigateToRegister = () => {
    router.replace("/register");
  };

  return (
    <LinearGradient
      colors={["#FFFFFF", "#EAFFCD"]}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <SafeAreaView style={styles.innerContainer}>
        <Text style={styles.title}>Sign In</Text>

        <TextInput
          style={styles.textInput}
          placeholder="Email"
          placeholderTextColor={"#98B66E"}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.textInput}
          placeholder="Password"
          placeholderTextColor={"#98B66E"}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.signInButton} onPress={signIn}>
          <Text style={styles.signInButtonText}>Sign in</Text>
        </TouchableOpacity>

        <View style={styles.registerTextContainer}>
          <Text style={styles.registerText}>
            Don't have an account?
            <Text style={styles.registerLinkText} onPress={navigateToRegister}>
              {" "}
              Register
            </Text>
          </Text>
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
  title: {
    fontFamily: "Parkinsans-Bold",
    fontWeight: "bold",
    fontSize: 36,
    color: "#304121",
    marginBottom: 40,
  },
  textInput: {
    width: 341,
    height: 57,
    backgroundColor: "#FFFFFF",
    borderColor: "#E8EAF6",
    borderWidth: 2,
    borderRadius: 15,
    marginVertical: 10,
    paddingHorizontal: 25,
    fontSize: 16,
    fontFamily: "NunitoSans_10pt_Expanded-Regular",
  },
  signInButton: {
    width: 341,
    height: 57,
    backgroundColor: "#98B66E",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#304121",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 21,
    elevation: 5,
  },
  signInButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 24,
    fontFamily: "NunitoSans_10pt_Expanded-Regular",
  },
  registerTextContainer: {
    marginTop: 20,
    position: "absolute",
    bottom: 40,
  },
  registerText: {
    fontFamily: "NunitoSans_10pt_Expanded-Regular",
    color: "#304121",
  },
  registerLinkText: {
    fontFamily: "NunitoSans_10pt_Expanded-Regular",
    fontWeight: "bold",
    color: "#98B66E",
  },
});

export default SignInScreen;
