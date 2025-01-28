import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Alert,
  TextInput,
  Modal,
  Text,
  ActivityIndicator,
} from "react-native";
import { storage, auth, firestore } from "../../FirebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const cameraRef = useRef<any>(null);
  const [user, setUser] = useState<User | null>(null);
  const [description, setDescription] = useState<string>("");
  const [name, setName] = useState<string>(""); // New state variable for name
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false); // New loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera.
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function takePhoto() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setPhotoUri(photo.uri);
    }
  }

  async function savePhoto(withDescription: boolean, withName: boolean) {
    if (!user || !photoUri) {
      Alert.alert("No user or photo found!");
      return;
    }

    setLoading(true); // Start loading

    try {
      const response = await fetch(photoUri);
      const blob = await response.blob();

      const storageRef = ref(storage, `images/${user.uid}/${Date.now()}`);
      await uploadBytes(storageRef, blob);

      const url = await getDownloadURL(storageRef);
      await addDoc(collection(firestore, "images"), {
        url,
        description: withDescription ? description : "",
        name: withName ? name : "",
        userId: user.uid,
        timestamp: new Date(), // Add timestamp field
      });

      Alert.alert("Success!", "Image has been saved to Firebase.");
      setPhotoUri(null); // Reset photo state after upload
      setDescription(""); // Reset description state
      setName(""); // Reset name state
      setModalVisible(false); // Close the modal
    } catch (error: any) {
      console.error("Error saving photo: ", error);
      Alert.alert("Upload failed!", error.message);
    } finally {
      setLoading(false); // End loading
    }
  }

  function retakePhoto() {
    setPhotoUri(null);
  }

  function confirmSavePhoto() {
    setModalVisible(true);
  }

  if (photoUri) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photoUri }} style={styles.preview} />
        <View style={styles.bottomPanel}>
          <TouchableOpacity
            style={styles.button}
            onPress={retakePhoto}
            disabled={loading}
          >
            <Ionicons name="reload-circle" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={confirmSavePhoto}
            disabled={loading} // Disable button when loading
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name="cloud-upload" size={30} color="white" />
            )}
          </TouchableOpacity>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Add Name and Description</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter description"
              value={description}
              onChangeText={setDescription}
            />
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => savePhoto(true, true)}
              disabled={loading} // Disable button when loading
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Add</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.uploadButton2}
              onPress={() => savePhoto(false, false)}
              disabled={loading} // Disable button when loading
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText2}>Later</Text>
              )}
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        <View style={styles.bottomPanel}>
          <TouchableOpacity
            style={styles.button}
            onPress={toggleCameraFacing}
            disabled={loading}
          >
            <FontAwesome6 name="arrows-rotate" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={takePhoto}
            disabled={loading}
          >
            <Ionicons name="camera" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
  },
  preview: {
    flex: 1,
    width: "100%",
    resizeMode: "contain",
    borderRadius: 10,
    marginBottom: 20,
  },
  bottomPanel: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 15,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: "#000000",
    borderRadius: 15,
    minWidth: 100,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  modalView: {
    marginTop: 150,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 30,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    height: 45,
    borderWidth: 2,
    borderColor: "#E8EAF6",
    marginBottom: 20,
    borderRadius: 20,
    paddingHorizontal: 10,
    width: "100%",
  },
  uploadButton: {
    backgroundColor: "#98B66E",
    borderRadius: 60,
    width: "80%",
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#304121",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    marginVertical: 20,
  },
  uploadButton2: {
    backgroundColor: "#f8fff6",
    borderRadius: 60,
    width: "80%",
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#304121",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  buttonText2: {
    color: "#98B66E",
    fontSize: 18,
    fontWeight: "600",
  },
});
