import { StatusBar } from "expo-status-bar";
import { Button, Platform, StyleSheet } from "react-native";

import { Text, View } from "../components/Themed";
import { useSession } from "./ctx";
import { TextInput } from "react-native-gesture-handler";
import { useState } from "react";

export default function ModalScreen() {
  const { signIn } = useSession();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={setUsername}
        placeholder="username"
        style={styles.input}
      />
      <TextInput
        onChangeText={setPassword}
        placeholder="password"
        style={styles.input}
      />
      <Button
        onPress={() => {
          signIn(username, password);
        }}
        title="Sign In"
      />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    width: "80%",
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
