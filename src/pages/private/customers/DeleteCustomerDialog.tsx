import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import CustomButton from "../../../components/CustomButton";
import { useState } from "react";
import { DeleteOutlined } from "@mui/icons-material";

import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store";
import { deleteCustomers } from "../../../slices/customersSlice";
import { useCustomers } from "../../../hooks/useCustomers";

interface DeleteCustomerDialogProps {
  open: boolean;
  onClose: () => void;
  customerId: string | null;
}

const DeleteCustomerDialog = ({
  open,
  onClose,
  customerId,
}: DeleteCustomerDialogProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const {refetch} = useCustomers();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!customerId) return;

    try {
      setLoading(true);

      await dispatch(deleteCustomers([customerId])).unwrap();
      refetch();
      onClose();
    } catch (err) {
      console.error("Delete customer failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose}>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <DeleteOutlined color="error" />
        Confirm Delete
      </DialogTitle>

      <DialogContent>
        <Typography color="text.secondary">
          Are you sure you want to delete this customer?
          <br />
          This action <b>cannot be undone</b>.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>

        <CustomButton
          variant="contained"
          disabled={loading}
          onClick={handleDelete}
          className="bg-red-600! hover:bg-red-700! text-white"
        >
          {loading ? "Deleting..." : "Delete"}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteCustomerDialog;
