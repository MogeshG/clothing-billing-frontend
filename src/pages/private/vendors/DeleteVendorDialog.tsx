import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import CustomButton from "../../../components/CustomButton";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store";
import { deleteVendors } from "../../../slices/vendorsSlice";
import { useVendors } from "../../../hooks/useVendors";
import { DeleteOutlined } from "@mui/icons-material";
import { useState } from "react";

interface DeleteVendorDialogProps {
  open: boolean;
  vendorId: string | null;
  onClose: () => void;
}

const DeleteVendorDialog = ({
  open,
  vendorId,
  onClose,
}: DeleteVendorDialogProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const { refetch } = useVendors();

  const handleDelete = async () => {
    setLoading(true);
    if (!vendorId) return;

    try {
      await dispatch(deleteVendors([vendorId])).unwrap();
      refetch();
      onClose();
    } catch (err) {
      console.error("Delete failed", err);
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
          Are you sure you want to delete this vendor?
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

export default DeleteVendorDialog;
