import { Button, Platform, StyleSheet } from "react-native";
import { Text, View } from "../../components/Themed";
import { Link, useFocusEffect } from "expo-router";
import axios from "axios";
import { useMachineData } from "../useMachineData";
import { useCallback, useState } from "react";
import { PartsOfMachine } from "../../components/PartsOfMachine";
import { MachineScore } from "../../components/MachineScore";
import { useSession } from "../ctx";
import { useSelector } from "react-redux";
import { scoreSelector } from "../slice";

let apiUrl: string =
  "https://fancy-dolphin-65b07b.netlify.app/api/machine-health";

if (__DEV__) {
  apiUrl = `http://${
    Platform?.OS === "android" ? "10.0.2.2" : "localhost"
  }:3001/machine-health`;
}

export default function StateScreen() {
  const { machineData, resetMachineData, loadMachineData, setScores } =
    useMachineData();
  const { signOut } = useSession();
  const machineScores = useSelector(scoreSelector);

  //Doing this because we're not using central state like redux
  useFocusEffect(
    useCallback(() => {
      loadMachineData();
    }, [])
  );

  const calculateHealth = useCallback(async () => {
    try {
      const response = await axios.post(apiUrl, {
        machines: machineData?.machines,
        user: "Aloysius",
      });

      if (response.data?.factory) {
        setScores(response.data);
      }
    } catch (error) {
      console.error(error);
      console.log(
        `There was an error calculating health. ${
          error.toString() === "AxiosError: Network Error"
            ? "Is the api server started?"
            : error
        }`
      );
    }
  }, [machineData]);

  return (
    <View style={styles.container}>
      <View style={styles.separator} />
      {!machineData && (
        <Link href="/two" style={styles.link}>
          <Text style={styles.linkText}>
            Please log a part to check machine health
          </Text>
        </Link>
      )}
      {machineData && (
        <>
          <PartsOfMachine
            machineName={"Welding Robot"}
            parts={machineData?.machines?.weldingRobot}
          />
          <PartsOfMachine
            machineName={"Assembly Line"}
            parts={machineData?.machines?.assemblyLine}
          />
          <PartsOfMachine
            machineName={"Painting Station"}
            parts={machineData?.machines?.paintingStation}
          />
          <PartsOfMachine
            machineName={"Quality Control Station"}
            parts={machineData?.machines?.qualityControlStation}
          />
          <View
            style={styles.separator}
            lightColor="#eee"
            darkColor="rgba(255,255,255,0.1)"
          />
          <Text style={styles.title}>Factory Health Score</Text>
          <Text style={styles.text}>
            {machineScores?.factory
              ? machineScores?.factory
              : "Not yet calculated"}
          </Text>
          {machineScores?.machineScores && (
            <>
              <Text style={styles.title2}>Machine Health Scores</Text>
              {Object.keys(machineScores?.machineScores).map((key) => (
                <MachineScore
                  key={key}
                  machineName={key}
                  score={machineScores?.machineScores[key]}
                />
              ))}
            </>
          )}
        </>
      )}
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <View style={styles.buttonContainer}>
        <View>
          <Button title="Calculate Health" onPress={calculateHealth} />
          <View style={styles.resetButton}>
            <Button
              title="Reset Machine Data"
              onPress={async () => await resetMachineData()}
              color="#FF0000"
            />
          </View>
        </View>
        <View style={styles.logoutButton}>
          <Button
            title="Log Out"
            onPress={() => {
              signOut();
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  title2: {
    fontSize: 17,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: "80%",
  },
  text: {},
  link: {
    paddingBottom: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
  resetButton: {
    marginTop: 10,
  },
  buttonContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  logoutButton: {
    paddingBottom: 20,
  },
});
