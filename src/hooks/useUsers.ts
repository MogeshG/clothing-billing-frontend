import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import type { UserPermissions } from "../types/user";
import type {
  UserFormType,
  UserUpdateFormType,
} from "../validation/users";
import {
  fetchUsers,
  fetchUserById,
  addUser as addUserAction,
  updateUser as updateUserAction,
} from "../slices/usersSlice";

export const useUsers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error } = useSelector(
    (state: RootState) => state.users,
  );

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const createUser = useCallback(
    async (userData: UserFormType & { permissions: UserPermissions }) =>
      dispatch(addUserAction(userData)).unwrap(),
    [dispatch],
  );

  const updateUser = useCallback(
    async (
      id: string,
      userData: UserUpdateFormType & { permissions: UserPermissions },
    ) => dispatch(updateUserAction({ id, ...userData })).unwrap(),
    [dispatch],
  );

  return {
    users,
    loading,
    error,
    refetch: () => dispatch(fetchUsers()),
    createUser,
    updateUser,
  };
};

export const useUserDetail = (id?: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedUser, loading, error } = useSelector(
    (state: RootState) => state.users,
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchUserById(id));
    }
  }, [id, dispatch]);

  return {
    user: selectedUser,
    loading,
    error,
    refetch: id ? () => dispatch(fetchUserById(id)) : undefined,
  };
};
