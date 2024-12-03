import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { auth } from "../../FirebaseConfig";
import { router } from "expo-router";
import { getAuth } from "firebase/auth";

export default function HomePage() {
  getAuth().onAuthStateChanged((user) => {
    if (!user) router.replace("../index.tsx"); // something wrong
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home screen</Text>
      <TouchableOpacity style={styles.button} onPress={() => auth.signOut()}>
        <Text style={styles.text}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: "90%",
    backgroundColor: "#5C6BC0",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#5C6BC0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
    marginTop: 15,
  },
  text: {
    color: "#fff",
  },
});
