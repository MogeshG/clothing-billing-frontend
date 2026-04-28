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
import { DeleteOutlined, CheckCircle } from "@mui/icons-material";
import { useSalesReturnActions } from "../../../hooks/useSalesReturn";

interface SalesReturnConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  action: "approve" | "delete" | null;
  salesReturnId: string | null;
  onSuccess: () => void;
}

const SalesReturnConfirmDialog = ({
  open,
  onClose,
  action,
  salesReturnId,
  onSuccess,
}: SalesReturnConfirmDialogProps) => {
  const { approve, remove } = useSalesReturnActions();
  const [loading, setLoading] = useState(false);

  const isApprove = action === "approve";
  const isDelete = action === "delete";

  const handleConfirm = async () => {
    if (!salesReturnId || !action) return;

    try {
      setLoading(true);
      if (isApprove) {
        await approve(salesReturnId);
      } else if (isDelete) {
        await remove(salesReturnId);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error(`${action} failed`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose}>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {isApprove ? (
          <CheckCircle color="success" />
        ) : (
          <DeleteOutlined color="error" />
        )}
        {isApprove ? "Confirm Approval" : "Confirm Delete"}
      </DialogTitle>

      <DialogContent>
        <Typography color="text.secondary">
          {isApprove
            ? "Are you sure you want to approve this sales return? Stock will be restored."
            : "Are you sure you want to delete this sales return?"}
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
          onClick={handleConfirm}
          className={
            isApprove
              ? "bg-green-600! hover:bg-green-700! text-white"
              : "bg-red-600! hover:bg-red-700! text-white"
          }
        >
          {loading
            ? isApprove
              ? "Approving..."
              : "Deleting..."
            : isApprove
              ? "Approve"
              : "Delete"}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default SalesReturnConfirmDialog;
