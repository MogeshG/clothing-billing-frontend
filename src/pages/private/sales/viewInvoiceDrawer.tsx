import React, { useState, useEffect, useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import PrintIcon from "@mui/icons-material/Print";
import formatRupee from "../../../utils/formatRupee";
import dayjs from "dayjs";
import type { Invoice } from "../../../types/invoice";
import CustomButton from "../../../components/CustomButton";
import { mockInvoices } from "./mockInvoices";
import { Box, Drawer, IconButton, Typography } from "@mui/material";

const ViewInvoiceDrawer = ({
  invoiceId,
  open,
  onClose,
}: {
  invoiceId: string;
  open: boolean;
  onClose: () => void;
}) => {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [iframeSrc, setIframeSrc] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (open && invoiceId) {
      const foundInvoice = mockInvoices.find((inv) => inv.id === invoiceId);
      setInvoice(foundInvoice || null);
    }
  }, [invoiceId, open]);

  const generateIframe = () => {
    if (!invoice) return;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Invoice ${invoice.invoiceNo}</title>
  <style>
    body { font-family: Arial; padding: 20px; }
    h1, h2, h3 { margin: 5px 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #ccc; padding: 8px; }
    th { background: #f5f5f5; }
    .right { text-align: right; }
    .total { font-weight: bold; font-size: 18px; color: green; }
  </style>
</head>
<body>

  <h1>Invoice #${invoice.invoiceNo}</h1>
  <p>Date: ${dayjs(invoice.invoiceDate).format("DD MMM YYYY, HH:mm")}</p>

  <h3>Customer</h3>
  <p>${invoice.customerName || "Walk-in Customer"}</p>

  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th>Qty</th>
        <th>Rate</th>
        <th class="right">Total</th>
      </tr>
    </thead>
    <tbody>
      ${invoice.items
        .map(
          (item) => `
        <tr>
          <td>${item.productName}</td>
          <td>${item.quantity}</td>
          <td>${formatRupee(item.price)}</td>
          <td class="right">${formatRupee(item.total)}</td>
        </tr>
      `,
        )
        .join("")}
    </tbody>
  </table>

  <p class="total">Total: ${formatRupee(invoice.totalAmount)}</p>
  <p>Paid: ${formatRupee(invoice.paidAmount)}</p>
  ${
    invoice.balanceDue > 0
      ? `<p style="color:red;">Balance: ${formatRupee(invoice.balanceDue)}</p>`
      : ""
  }

</body>
</html>
`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    setIframeSrc(url);
  };

  useEffect(() => {
    if (invoice) {
      generateIframe();
    }
  }, [invoice]);

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
          width: { xs: "100%", md: 800 },
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
            >
              Print
            </CustomButton>

            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Iframe Content ONLY */}
        <Box sx={{ flex: 1 }}>
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
