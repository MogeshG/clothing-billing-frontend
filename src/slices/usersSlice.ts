import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { User } from "../types/user";
import api from "../utils/api";
import { snakeToCamel } from "../utils/caseConvert";

interface UsersState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk<
  User[],
  void,
  { rejectValue: string }
>("users/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/users");
    return response.data.users as User[];
  } catch (error: unknown) {
    const err = error as Error;
    return rejectWithValue(err.message || "Failed to fetch users");
  }
});

export const fetchUserById = createAsyncThunk<
  User,
  string,
  { rejectValue: string }
>("users/fetchUserById", async (id, { rejectWithValue }) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data.user as User;
  } catch (error: unknown) {
    const err = error as Error;
    return rejectWithValue(err.message || "Failed to fetch user");
  }
});

export const addUser = createAsyncThunk<
  User,
  Omit<User, "id" | "createdAt" | "updatedAt"> & { confirmPassword?: string },
  { rejectValue: string }
>("users/addUser", async (userData, { rejectWithValue }) => {
  try {
    const payload = { ...userData };
    delete (payload as Record<string, unknown>).confirmPassword;
    const response = await api.post("/users", payload);
    return snakeToCamel(response.data.user);
  } catch (error: unknown) {
    const err = error as Error;
    return rejectWithValue(err.message || "Failed to create user");
  }
});

export const updateUser = createAsyncThunk<
  User,
  { id: string } & Partial<Omit<User, "id" | "createdAt" | "updatedAt">> & {
      confirmPassword?: string;
    },
  { rejectValue: string }
>("users/updateUser", async (userData, { rejectWithValue }) => {
  try {
    const { id, ...payload } = userData;
    delete (payload as Record<string, unknown>).confirmPassword;

    const response = await api.put(`/users/${id}`, payload);
    return snakeToCamel(response.data.user);
  } catch (error: unknown) {
    const err = error as Error;
    return rejectWithValue(err.message || "Failed to update user");
  }
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearUsersError: (state) => {
      state.error = null;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to fetch users";
      })
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserById.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.loading = false;
          state.selectedUser = action.payload;
          const index = state.users.findIndex(
            (user) => user.id === action.payload.id,
          );
          if (index === -1) {
            state.users.push(action.payload);
          } else {
            state.users[index] = action.payload;
          }
        },
      )
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to fetch user";
      })
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.users.unshift(action.payload);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to create user";
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id,
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.selectedUser?.id === action.payload.id) {
          state.selectedUser = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to update user";
      });
  },
});

export const { clearUsersError } = usersSlice.actions;
export default usersSlice.reducer;
