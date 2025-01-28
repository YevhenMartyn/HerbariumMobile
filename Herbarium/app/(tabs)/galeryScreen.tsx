import {
  StyleSheet,
  Image,
  FlatList,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  Text,
  View,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { storage, auth, firestore } from "../../FirebaseConfig";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  listAll,
  deleteObject,
} from "firebase/storage";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { User, onAuthStateChanged } from "firebase/auth";
import { useFocusEffect } from "expo-router";

export default function GaleryScreen() {
  const [image, setImage] = useState<any>(null);
  const [images, setImages] = useState<any[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [description, setDescription] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [viewModalVisible, setViewModalVisible] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [selectedImageDescription, setSelectedImageDescription] =
    useState<string>("");
  const [selectedImageName, setSelectedImageName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // New loading state

  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchImages(user.uid);
      }
    }, [user])
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchImages(currentUser.uid);
      }
    });
    return unsubscribe;
  }, []);

  const fetchImages = async (userId: any) => {
    try {
      const storageRef = ref(storage, `images/${userId}`);
      const result = await listAll(storageRef);
      const urls = await Promise.all(
        result.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          const q = query(
            collection(firestore, "images"),
            where("url", "==", url)
          );
          const querySnapshot = await getDocs(q);
          let description = "";
          let name = "";
          querySnapshot.forEach((doc) => {
            description = doc.data().description;
            name = doc.data().name;
          });
          return { url, description, name, docId: querySnapshot.docs[0].id };
        })
      );
      setImages(urls);
    } catch (error) {
      console.error("Error fetching images: ", error);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      setImage(imageUri);
      setModalVisible(true);
    }
  };

  const uploadImage = async (withDescription: boolean, withName: boolean) => {
    if (!user || !image) {
      Alert.alert("No user or image found!");
      return;
    }

    setLoading(true); // Start loading

    try {
      const response = await fetch(image);
      const blob = await response.blob();

      const storageRef = ref(storage, `images/${user.uid}/${Date.now()}`);
      await uploadBytes(storageRef, blob);

      const url = await getDownloadURL(storageRef);
      const docRef = await addDoc(collection(firestore, "images"), {
        url,
        description: withDescription ? description : "",
        name: withName ? name : "",
        userId: user.uid,
      });

      setImages((images) => [
        ...images,
        {
          url,
          description: withDescription ? description : "",
          name: withName ? name : "",
          docId: docRef.id,
        },
      ]);
      setImage(null); // Reset the image state
      setDescription(""); // Reset the description state
      setName(""); // Reset the name state
      setModalVisible(false); // Close the modal
    } catch (error: any) {
      console.error("Error uploading image: ", error);
      Alert.alert("Upload failed!", error.message);
    } finally {
      setLoading(false); // End loading
    }
  };

  const deleteImage = async (url: any, docId: string) => {
    if (!user) {
      Alert.alert("No user found!");
      return;
    }

    setLoading(true); // Start loading

    try {
      const storageRef = ref(storage, url);
      await deleteObject(storageRef);

      await deleteDoc(doc(firestore, "images", docId));

      setImages(images.filter((img) => img.url !== url));
      setViewModalVisible(false); // Close the view modal after deleting
    } catch (error: any) {
      console.error("Error deleting image: ", error);
      Alert.alert("Delete failed!", error.message);
    } finally {
      setLoading(false); // End loading
    }
  };

  const selectImage = (image: any) => {
    setSelectedImage(image);
    setSelectedImageDescription(image.description);
    setSelectedImageName(image.name);
    setViewModalVisible(true);
  };

  const updateDescriptionAndName = async () => {
    if (!selectedImage) return;

    setLoading(true); // Start loading

    try {
      const docRef = doc(firestore, "images", selectedImage.docId);
      await updateDoc(docRef, {
        description: selectedImageDescription,
        name: selectedImageName,
      });

      setImages((images) =>
        images.map((img) =>
          img.url === selectedImage.url
            ? {
                ...img,
                description: selectedImageDescription,
                name: selectedImageName,
              }
            : img
        )
      );
      setViewModalVisible(false);
    } catch (error: any) {
      console.error("Error updating description and name: ", error);
      Alert.alert("Update failed!", error.message);
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Gallery</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={pickImage}
          disabled={loading} // Disable button when loading
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>
              Pick an image from camera roll
            </Text>
          )}
        </TouchableOpacity>
        {image && (
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
                onPress={() => uploadImage(true, true)}
                disabled={loading} // Disable button when loading
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Add</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => uploadImage(false, false)}
                disabled={loading} // Disable button when loading
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Later</Text>
                )}
              </TouchableOpacity>
            </View>
          </Modal>
        )}
        <FlatList
          data={images}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <TouchableOpacity onPress={() => selectImage(item)}>
                <Image source={{ uri: item.url }} style={styles.image} />
              </TouchableOpacity>
              <Text style={styles.name}>{item.name}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2} // Display images in two columns
          columnWrapperStyle={styles.columnWrapper} // Optional: Style to add space between columns
        />
        {selectedImage && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={viewModalVisible}
            onRequestClose={() => {
              setViewModalVisible(!viewModalVisible);
            }}
          >
            <View style={styles.modalView}>
              <Image
                source={{ uri: selectedImage.url }}
                style={styles.modalImage}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter name"
                value={selectedImageName}
                onChangeText={setSelectedImageName}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter description"
                value={selectedImageDescription}
                onChangeText={setSelectedImageDescription}
              />
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={updateDescriptionAndName}
                disabled={loading} // Disable button when loading
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Update</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() =>
                  deleteImage(selectedImage.url, selectedImage.docId)
                }
                disabled={loading} // Disable button when loading
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Delete</Text>
                )}
              </TouchableOpacity>
            </View>
          </Modal>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#EAFFCD",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#304121",
  },
  image: {
    width: 150,
    height: 150,
    marginVertical: 10,
    borderRadius: 10,
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 10,
    width: "50%", // Ensures two columns by giving each image half the width of the container
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
  },
  columnWrapper: {
    justifyContent: "space-between", // Space out the columns
    marginHorizontal: 5,
  },
  button: {
    padding: 12,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#98B66E",
    shadowColor: "#5C6BC0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 10,
    width: "80%",
  },
  uploadButton: {
    backgroundColor: "#304121",
    borderRadius: 60,
    width: "80%",
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#304121",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 21,
    elevation: 5,
    marginVertical: 20,
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    borderRadius: 15,
    width: "80%",
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF3B30",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  modalView: {
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
  modalImage: {
    width: 300,
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: "100%",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#304121",
    marginTop: 5,
  },
});
