import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./index.ts";
import type { Collaborator } from "../types.ts";

const API_URL =
  "http://localhost:4000/users?limit=0&select=firstName,lastName,email,phone,image,role,company,address";

interface CollaboratorsState {
  items: Collaborator[];
  added: Collaborator[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CollaboratorsState = {
  items: [],
  added: [],
  status: "idle",
  error: null,
};

export const fetchCollaborators = createAsyncThunk<
  Collaborator[],
  void,
  { state: RootState; rejectValue: string }
>(
  "collaborators/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) return rejectWithValue(`HTTP ${response.status}`);
      const data = (await response.json()) as { users: Collaborator[] };
      return data.users;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  },
  {
    condition: (_, { getState }) =>
      ["idle", "failed"].includes(getState().collaborators.status),
  },
);

const collaboratorsSlice = createSlice({
  name: "collaborators",
  initialState,
  reducers: {
    collaboratorAdded(state, action: PayloadAction<Collaborator>) {
      state.added.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollaborators.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCollaborators.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCollaborators.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "erreur inconnue";
      });
  },
});

export const { collaboratorAdded } = collaboratorsSlice.actions;
export default collaboratorsSlice.reducer;
