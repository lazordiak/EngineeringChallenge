import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { setMachineScores } from "./slice";

export const useMachineData = () => {
  const [machineData, setMachineData] = useState(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    // Load machine data from local storage when the hook initializes
    loadMachineData();
  }, []);

  const loadMachineData = useCallback(async () => {
    try {
      const storedMachineData = await AsyncStorage.getItem("machineData");

      if (storedMachineData) {
        // Parse stored machine data and set it in state
        const parsedMachineData = JSON.parse(storedMachineData);
        setMachineData(parsedMachineData);
        dispatch(setMachineScores(parsedMachineData));
      } else {
        setMachineData(undefined);
        dispatch(setMachineScores(undefined));
      }
    } catch (error) {
      console.error(error);
      // Handle storage loading error
    }
  }, []);

  const resetMachineData = useCallback(async () => {
    try {
      // Clear the machine data from local storage
      await AsyncStorage.removeItem("machineData");
      setMachineData(undefined);
      dispatch(setMachineScores({}));
      // You can also clear other related data if needed
    } catch (error) {
      console.error(error);
      // Handle storage clearing error
    }
  }, []);

  const updateMachineData = useCallback(async (newMachineData) => {
    try {
      // Update the state with the new machine data
      setMachineData(newMachineData);
      dispatch(setMachineScores(newMachineData));

      // Persist the updated machine data to local storage
      await AsyncStorage.setItem("machineData", JSON.stringify(newMachineData));
    } catch (error) {
      console.error(error);
      // Handle storage saving error
    }
  }, []);

  const setScores = useCallback(
    async (newScores) => {
      try {
        if (!machineData) {
          return;
        }

        const newMachineData = JSON.parse(JSON.stringify(machineData)); // Deep copy machine parts

        newMachineData.scores = newScores;

        // Update the state with the new machine data
        setMachineData(newMachineData);
        dispatch(setMachineScores(newMachineData));

        // Persist the updated machine data to local storage
        await AsyncStorage.setItem(
          "machineData",
          JSON.stringify(newMachineData)
        );
      } catch (error) {
        console.error(error);
        // Handle storage saving error
      }
    },
    [machineData]
  );

  return {
    machineData,
    updateMachineData,
    resetMachineData,
    loadMachineData,
    setScores,
  };
};
