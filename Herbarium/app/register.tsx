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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { router } from "expo-router";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUp = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      if (user) router.replace("/(tabs)");
    } catch (error: any) {
      console.log(error);
      alert("Sign up failed: " + error.message);
    }
  };

  const navigateToSignIn = () => {
    router.replace("/sign-in");
  };

  return (
    <LinearGradient
      colors={["#FFFFFF", "#EAFFCD"]}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <SafeAreaView style={styles.innerContainer}>
        <Text style={styles.title}>Register</Text>

        <TextInput
          style={styles.textInput}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.textInput}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.registerButton} onPress={signUp}>
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>

        <View style={styles.signInTextContainer}>
          <Text style={styles.signInText}>
            Already have an account?
            <Text style={styles.signInLinkText} onPress={navigateToSignIn}>
              {" "}
              Sign in
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
  registerButton: {
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
  registerButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 24,
    fontFamily: "NunitoSans_10pt_Expanded-Regular",
  },
  signInTextContainer: {
    marginTop: 40,
    position: "absolute",
    bottom: 40,
  },
  signInText: {
    fontFamily: "NunitoSans_10pt_Expanded-Regular",
    color: "#304121",
  },
  signInLinkText: {
    fontFamily: "NunitoSans_10pt_Expanded-Regular",
    fontWeight: "bold",
    color: "#98B66E",
  },
});

export default RegisterScreen;
