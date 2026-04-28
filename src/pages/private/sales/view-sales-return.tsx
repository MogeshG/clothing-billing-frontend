import { useEffect, useRef, useState } from "react";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import type { SalesReturn } from "../../../types/salesReturn";
import CustomButton from "../../../components/CustomButton";
import {
  Box,
  Chip,
  CircularProgress,
  Drawer,
  IconButton,
  Typography,
} from "@mui/material";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store";
import {
  generateSalesReturnBill,
  clearBillHtml,
} from "../../../slices/salesReturnSlice";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import { usePreferences } from "../../../hooks/usePreferences";

const ViewSalesReturn = ({
  salesReturn,
  open,
  onClose,
}: {
  salesReturn: SalesReturn | null;
  open: boolean;
  onClose: () => void;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [iframeSrc, setIframeSrc] = useState("");
  const { preferences } = usePreferences();

  const billHtml = useSelector(
    (state: RootState) => state.salesReturn.billHtml,
  );

  // Fetch rendered bill HTML from server when drawer opens
  useEffect(() => {
    if (open && salesReturn) {
      setIsGenerating(true);
      dispatch(generateSalesReturnBill({ id: salesReturn.id }))
        .unwrap()
        .catch(() => {})
        .finally(() => setIsGenerating(false));
    }

    if (!open) {
      dispatch(clearBillHtml());
      if (iframeSrc) {
        URL.revokeObjectURL(iframeSrc);
        setIframeSrc("");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, salesReturn?.id]);

  // Convert billHtml to blob URL when it arrives
  useEffect(() => {
    if (billHtml) {
      const blob = new Blob([billHtml], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      setIframeSrc(url);
    }
  }, [billHtml]);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (iframeSrc) URL.revokeObjectURL(iframeSrc);
    };
  }, [iframeSrc]);

  const handlePrint = () => {
    iframeRef.current?.contentWindow?.print();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: {
            xs: "100%",
            md: preferences.invoiceType === "thermal" ? 450 : 800,
          },
        },
      }}
    >
      <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="h6">{salesReturn?.salesReturnNo}</Typography>
            {salesReturn && (
              <Chip
                label={salesReturn.status}
                color={
                  salesReturn.status === "APPROVED" ? "success" : "warning"
                }
                size="small"
              />
            )}
          </Box>

          <Box>
            <CustomButton
              size="small"
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
              disabled={!iframeSrc}
            >
              Print
            </CustomButton>
            <IconButton onClick={onClose} sx={{ ml: 1 }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, position: "relative" }}>
          {isGenerating && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                bgcolor: "background.paper",
                zIndex: 1,
              }}
            >
              <CircularProgress size={40} />
              <Typography variant="body2" color="text.secondary">
                Generating bill...
              </Typography>
            </Box>
          )}

          {iframeSrc && (
            <iframe
              ref={iframeRef}
              src={iframeSrc}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
              }}
              title="Sales Return Preview"
            />
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default ViewSalesReturn;
