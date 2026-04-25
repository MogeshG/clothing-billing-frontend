import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Grid,
  Typography,
  Box,
  CircularProgress,
  IconButton,
  TextField,
} from "@mui/material";
import {
  Save as SaveIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import CustomInput from "../../../components/CustomInput";
import CustomButton from "../../../components/CustomButton";
import PermissionMatrix from "../../../components/PermissionMatrix";
import {
  updateUserSchema,
  type UserUpdateFormType,
} from "../../../validation/users";
import type { UserPermissions } from "../../../types/user";
import { PERMISSION_MODULES } from "../../../types/user";
import { useUserDetail, useUsers } from "../../../hooks/useUsers";

const buildInitialPermissions = (): UserPermissions =>
  PERMISSION_MODULES.reduce((acc, module) => {
    acc[module] = {
      create: false,
      read: false,
      update: false,
      delete: false,
    };
    return acc;
  }, {} as UserPermissions);

const EditUserPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, loading, error: detailError } = useUserDetail(id);
  const { updateUser } = useUsers();
  const [permissions, setPermissions] = useState<UserPermissions>(
    buildInitialPermissions(),
  );
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<UserUpdateFormType>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
    },
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
        password: "",
      });
      setPermissions({
        ...buildInitialPermissions(),
        ...(user.permissions ?? {}),
      });
    }
  }, [user, reset]);

  const handlePermissionChange = (
    module: string,
    key: keyof UserPermissions[(typeof PERMISSION_MODULES)[number]],
    value: boolean,
  ) => {
    setPermissions((current) => ({
      ...current,
      [module]: {
        ...current[module],
        [key]: value,
      },
    }));
  };

  const onSubmit = async (data: UserUpdateFormType) => {
    if (!id) return;
    setServerError(null);
    setIsSubmitting(true);

    try {
      const payload = {
        ...data,
        permissions,
      } as Record<string, unknown>;

      if (
        payload.password === undefined ||
        payload.password === null ||
        payload.password === ""
      ) {
        delete payload.password;
      }

      if (
        payload.confirmPassword === undefined ||
        payload.confirmPassword === null ||
        payload.confirmPassword === ""
      ) {
        delete payload.confirmPassword;
      }

      await updateUser(id, payload as UserUpdateFormType & { permissions: UserPermissions });
      navigate("/users");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else if (typeof err === "string") {
        setServerError(err);
      } else {
        setServerError("Unable to update user");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !user) {
    return (
      <Box className="flex items-center justify-center h-full w-full">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="flex flex-col w-full space-y-4 p-3 overflow-y-auto">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Edit User</h1>
          <p className="text-sm text-gray-500">
            Update user details and modify authorization settings.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {(serverError || detailError) && (
            <Alert severity="error">{serverError || detailError}</Alert>
          )}

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4, lg: 4 }}>
              <CustomInput
                {...register("name")}
                label="Name"
                placeholder="Enter full name"
                hasError={!!errors.name}
                errorText={errors.name?.message}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4, lg: 4 }}>
              <CustomInput
                {...register("phone")}
                label="Phone"
                placeholder="10 digit phone number"
                hasError={!!errors.phone}
                errorText={errors.phone?.message}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4, lg: 4 }}>
              <CustomInput
                {...register("email")}
                label="Email"
                type="email"
                placeholder="Email (optional)"
                hasError={!!errors.email}
                errorText={errors.email?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4, lg: 4 }}>
              <div className="relative">
                <TextField
                  {...register("password")}
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Leave empty to keep existing password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  fullWidth
                  size="medium"
                  variant="outlined"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2">
                  <IconButton
                    onClick={() => setShowPassword((current) => !current)}
                    size="small"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </span>
              </div>
            </Grid>
            <Grid size={{ xs: 12, md: 4, lg: 4 }}>
              <div className="relative">
                <TextField
                  {...register("confirmPassword")}
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  fullWidth
                  size="medium"
                  variant="outlined"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2">
                  <IconButton
                    onClick={() =>
                      setShowConfirmPassword((current) => !current)
                    }
                    size="small"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </span>
              </div>
            </Grid>
          </Grid>

          <Box className="rounded-lg border border-gray-200 p-4">
            <Typography
              variant="h6"
              className="font-semibold text-gray-800 mb-3"
            >
              Authorization Matrix
            </Typography>
            <Typography className="text-sm text-gray-500 mb-4">
              Adjust module permissions for this user.
            </Typography>

            <PermissionMatrix
              permissions={permissions}
              onChange={handlePermissionChange}
            />
          </Box>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <CustomButton
              variant="outlined"
              onClick={() => navigate("/users")}
              disabled={isSubmitting}
            >
              Cancel
            </CustomButton>
            <CustomButton
              type="submit"
              startIcon={<SaveIcon />}
              variant="contained"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserPage;
