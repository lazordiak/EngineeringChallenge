import { createSlice } from "@reduxjs/toolkit";
import { WeldingRobotPart } from "~data/types";
import { RootState } from "./store";

interface MachineScore {
  assemblyLine?: string;
  weldingRobot?: string;
  paintingStation?: string;
  qualityControlStation?: string;
}

interface MachineState {
  factory?: string;
  machineScores?: MachineScore[];
}

const initialState: MachineState = {};

export const machineSlice = createSlice({
  name: "machines",
  initialState,
  reducers: {
    setMachineScores: (state, action) => {
      if (action?.payload?.scores) {
        state.factory = action.payload.scores.factory || undefined;
        state.machineScores = action.payload.scores.machineScores;
      } else {
        state = initialState;
      }
    },
  },
  selectors: {
    scoreSelector: (state) => state,
  },
});

export const { setMachineScores } = machineSlice.actions;
export const { scoreSelector } = machineSlice.selectors;

export default machineSlice.reducer;
