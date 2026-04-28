import { useEffect, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import PrintIcon from "@mui/icons-material/Print";
import type { Invoice } from "../../../types/invoice";
import CustomButton from "../../../components/CustomButton";
import {
  Box,
  CircularProgress,
  Drawer,
  IconButton,
  Typography,
} from "@mui/material";
import { useInvoices } from "../../../hooks/useInvoices";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store";
import { usePreferences } from "../../../hooks/usePreferences";

const ViewInvoiceDrawer = ({
  invoice,
  open,
  onClose,
}: {
  invoice: Invoice | null;
  open: boolean;
  onClose: () => void;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { generateBill, billHtml, clearBillHtml } = useInvoices();
  const { preferences } = usePreferences();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [iframeSrc, setIframeSrc] = useState("");

  // Fetch rendered bill HTML from server when drawer opens
  useEffect(() => {
    if (open && invoice) {
      setIsGenerating(true);
      dispatch(generateBill({ id: invoice.id }))
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
  }, [open, invoice?.id]);

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
          <Typography variant="h6">{invoice?.invoiceNo}</Typography>

          <Box>
            <CustomButton
              size="small"
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
              disabled={!iframeSrc}
            >
              {"Print"}
            </CustomButton>

            <IconButton onClick={onClose}>
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
              title="Invoice Preview"
            />
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default ViewInvoiceDrawer;
