import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Alert,
  Box,
  Typography,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/UploadFile";
import CustomButton from "../../../components/CustomButton";
import type { AddCustomerForm } from "../../../types/customer";
import { isValidEmail, isValidPhone } from "../../../utils/validation";
import ExcelJS from "exceljs";
import { useCustomers } from "../../../hooks/useCustomers";

interface BulkCustomerDialogProps {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
}

const safeString = (value: unknown) => (value ? String(value).trim() : "");

export default function BulkCustomerDialog({
  open,
  onClose,
  refetch,
}: BulkCustomerDialogProps) {
  const { bulkCreateCustomers: onBulkCreate } = useCustomers();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string | null>(null);

  const [uploadErrors, setUploadErrors] = useState<
    { row: number; errors: string[] }[]
  >([]);

  useEffect(() => {
    if (!open) {
      setFile(null);
      setErrors([]);
      setUploadErrors([]);
      setSuccess(null);
    }
  }, [open]);

  const downloadTemplate = useCallback(async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Customers");

    worksheet.addRow(["name", "phone", "email", "address"]);
    worksheet.getRow(1).font = { bold: true };

    worksheet.columns = [
      { width: 20 },
      { width: 15 },
      { width: 25 },
      { width: 30 },
    ];

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "customers-template.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const validateExcelData = useCallback((rows: AddCustomerForm[]) => {
    const validRows: AddCustomerForm[] = [];
    const rowErrors: { row: number; errors: string[] }[] = [];

    rows.forEach((row, index) => {
      const rowNum = index + 2;
      const err: string[] = [];

      if (!row.name?.trim()) err.push("Name is required");
      if (!row.phone?.trim()) err.push("Phone is required");
      else if (!isValidPhone(row.phone)) err.push("Invalid phone format");

      if (row.email && !isValidEmail(row.email)) {
        err.push("Invalid email format");
      }

      if (err.length > 0) {
        rowErrors.push({ row: rowNum, errors: err });
      } else {
        validRows.push(row);
      }
    });

    return { valid: validRows, errors: rowErrors };
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];

      if (selectedFile && selectedFile.name.endsWith(".xlsx")) {
        setFile(selectedFile);
        setErrors([]);
        setUploadErrors([]);
        setSuccess(null);
      } else {
        setErrors(["Please select a valid .xlsx file"]);
        setFile(null);
      }
    },
    [],
  );

  const handleUpload = useCallback(async () => {
    if (!file) {
      setErrors(["Please select a file first"]);
      return;
    }

    setLoading(true);
    setErrors([]);
    setUploadErrors([]);
    setSuccess(null);

    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(await file.arrayBuffer());

      const worksheet = workbook.getWorksheet(1);
      if (!worksheet) throw new Error("No worksheet found");

      // headers
      const headers = worksheet.getRow(1).values.slice(1) as string[];

      const expected = ["name", "phone", "email", "address"];

      const normalized = headers.map((h) => String(h).trim().toLowerCase());

      const isValid = expected.every((h) => normalized.includes(h));

      if (!isValid) {
        throw new Error(
          "Invalid format. Required: name, phone, email, address",
        );
      }

      // rows
      const rows: AddCustomerForm[] = [];

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;

        rows.push({
          name: safeString(row.getCell(1).value),
          phone: safeString(row.getCell(2).value),
          email: safeString(row.getCell(3).value) || undefined,
          address: safeString(row.getCell(4).value) || undefined,
        });
      });

      if (!rows.length) throw new Error("No data found");

      const { valid, errors: rowErrs } = validateExcelData(rows);

      if (rowErrs.length > 0) {
        setUploadErrors(rowErrs);
        setErrors(["Validation errors found. Please fix them."]);
        return;
      }

      await onBulkCreate(valid);

      setSuccess("Upload successful!");
      setFile(null);

      refetch();
    } catch (err) {
      setErrors([err.message || "Upload failed"]);
    } finally {
      setLoading(false);
    }
  }, [file, onBulkCreate, refetch, validateExcelData]);

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md">
      <DialogTitle className="text-lg p-3! font-semibold">
        Upload Customers
      </DialogTitle>

      <Divider />

      <DialogContent className="p-6">
        <div className="space-y-4">
          {/* DOWNLOAD TEMPLATE */}
          <CustomButton
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={downloadTemplate}
            fullWidth
            size="large"
          >
            Download Template
          </CustomButton>

          <Divider>OR</Divider>

          {/* FILE UPLOAD */}
          <Box>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            <CustomButton
              variant="contained"
              startIcon={<UploadIcon />}
              fullWidth
              size="large"
              disabled={loading}
              onClick={() => fileInputRef.current?.click()}
            >
              Choose Excel File
            </CustomButton>

            {file && (
              <Typography className="mt-2 text-blue-600">
                Selected: {file.name}
              </Typography>
            )}
          </Box>

          {/* ERROR */}
          {errors.length > 0 && <Alert severity="error">{errors[0]}</Alert>}

          {/* SUCCESS */}
          {success && <Alert severity="success">{success}</Alert>}

          {/* ROW ERRORS */}
          {uploadErrors.length > 0 && (
            <Box>
              <Typography variant="body2" fontWeight={600} className="mb-2">
                Row Errors:
              </Typography>

              {uploadErrors.map(({ row, errors }) => (
                <Alert key={row} severity="error" className="mb-1">
                  Row {row}: {errors.join(", ")}
                </Alert>
              ))}
            </Box>
          )}
        </div>
      </DialogContent>

      <Divider />

      <DialogActions className="px-6 py-4">
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>

        <CustomButton
          onClick={handleUpload}
          disabled={!file || loading}
          loading={loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
}
