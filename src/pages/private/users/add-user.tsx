import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Grid,
  Typography,
  Box,
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
import { createUserSchema, type UserFormType } from "../../../validation/users";
import type { UserPermissions } from "../../../types/user";
import { PERMISSION_MODULES } from "../../../types/user";
import { useUsers } from "../../../hooks/useUsers";

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

const AddUserPage = () => {
  const navigate = useNavigate();
  const { createUser } = useUsers();
  const [permissions, setPermissions] = useState<UserPermissions>(
    buildInitialPermissions(),
  );
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<UserFormType>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

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

  const onSubmit = async (data: UserFormType) => {
    setServerError(null);
    setIsSubmitting(true);

    try {
      await createUser({ ...data, permissions });
      navigate("/users");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setServerError(error.message);
      } else if (typeof error === "string") {
        setServerError(error);
      } else {
        setServerError("Unable to create user");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full space-y-4 p-3 overflow-y-auto">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Create User</h1>
          <p className="text-sm text-gray-500">
            Add a new user and assign module permissions.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {serverError && <Alert severity="error">{serverError}</Alert>}
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
                  placeholder="Password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  required
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
                  required
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
              Permission Matrix
            </Typography>
            <Typography className="text-sm text-gray-500 mb-4">
              Grant access per module using CRUD permissions.
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
              {isSubmitting ? "Creating..." : "Create User"}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserPage;
