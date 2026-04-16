/* eslint-disable @typescript-eslint/no-explicit-any */
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
import ExcelJS from "exceljs";
import { useProducts } from "../../../hooks/useProducts";
import type {
  AddProductForm,
  Product,
  ProductVariantInput,
} from "../../../types/product";

interface BulkProductDialogProps {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
}

interface VariantRow {
  productSku: string;
  size: string;
  color: string;
  barcode: string;
  sku?: string | null;
  costPrice: number;
  sellingPrice: number;
  mrp: number;
}

const safeString = (value: unknown) => (value ? String(value).trim() : "");
const safeNumber = (value: unknown, defaultValue = 0): number => {
  const str = safeString(value);
  const num = parseFloat(str);
  return isNaN(num) ? defaultValue : num;
};

export default function BulkProductDialog({
  open,
  onClose,
  refetch,
}: BulkProductDialogProps) {
  const { bulkCreateProducts: onBulkCreate } = useProducts();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string | null>(null);

  const [uploadErrors, setUploadErrors] = useState<
    { sheet: string; row: number; errors: string[] }[]
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

    // Sheet 1: Products
    const productSheet = workbook.addWorksheet("Products");
    productSheet.addRow([
      "name",
      "sku",
      "hsnCode",
      "description",
      "categoryId",
      "brand",
      "gstPercent",
      "taxInclusive",
    ]);
    productSheet.getRow(1).font = { bold: true };
    productSheet.addRow([
      "Cotton T-Shirt",
      "TS001",
      "61091000",
      "Premium cotton T-shirt",
      "cat1",
      "BrandX",
      5,
      true,
    ]);
    productSheet.columns = [
      { width: 25 },
      { width: 15 },
      { width: 15 },
      { width: 30 },
      { width: 15 },
      { width: 15 },
      { width: 12 },
      { width: 12 },
    ];

    // Sheet 2: Variants
    const variantSheet = workbook.addWorksheet("Variants");
    variantSheet.addRow([
      "productSku",
      "size",
      "color",
      "barcode",
      "sku",
      "costPrice",
      "sellingPrice",
      "mrp",
    ]);
    variantSheet.getRow(1).font = { bold: true };
    variantSheet.addRow([
      "TS001",
      "M",
      "Blue",
      "123456789012",
      "TS001-M-BL",
      100,
      120,
      150,
    ]);
    variantSheet.addRow([
      "TS001",
      "L",
      "Red",
      "123456789013",
      "TS001-L-RD",
      100,
      120,
      150,
    ]);
    variantSheet.columns = [
      { width: 15 },
      { width: 10 },
      { width: 12 },
      { width: 18 },
      { width: 15 },
      { width: 12 },
      { width: 12 },
      { width: 12 },
    ];

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officdocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products-template.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const validateProductsSheet = useCallback((rows: any[]) => {
    const validRows: Omit<
      Product,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "categoryName"
      | "isActive"
      | "isDeleted"
      | "variant"
    >[] = [];
    const rowErrors: { row: number; errors: string[] }[] = [];

    rows.forEach((row, index) => {
      const rowNum = index + 2;
      const err: string[] = [];

      const name = safeString(row.getCell(1).value);
      const sku = safeString(row.getCell(2).value);
      const hsnCode = safeString(row.getCell(3).value);
      const description = safeString(row.getCell(4).value) || null;
      const categoryId = safeString(row.getCell(5).value);
      const brand = safeString(row.getCell(6).value) || null;
      const gstPercent = safeNumber(row.getCell(7).value);
      const taxInclusive =
        safeString(row.getCell(8).value).toLowerCase() === "true";

      if (!name) err.push("Name is required");
      if (!sku) err.push("SKU is required for variant matching");
      if (!hsnCode) err.push("HSN Code is required");
      if (!categoryId) err.push("Category ID is required");
      if (gstPercent < 0 || gstPercent > 100) err.push("GST % must be 0-100");

      if (err.length > 0) {
        rowErrors.push({ row: rowNum, errors: err });
      } else {
        validRows.push({
          name,
          sku,
          hsnCode,
          description,
          categoryId,
          brand,
          gstPercent,
          taxInclusive,
        });
      }
    });

    return { valid: validRows, errors: rowErrors };
  }, []);

  const validateVariantsSheet = useCallback(
    (
      rows: any[],
      productSkus: string[],
    ): {
      valid: VariantRow[];
      errors: { row: number; errors: string[] }[];
      unknownSkus: string[];
    } => {
      const validRows: VariantRow[] = [];
      const rowErrors: { row: number; errors: string[] }[] = [];
      const unknownSkus: string[] = [];

      rows.forEach((row, index) => {
        const rowNum = index + 2;
        const err: string[] = [];

        const productSku = safeString(row.getCell(1).value);
        const size = safeString(row.getCell(2).value);
        const color = safeString(row.getCell(3).value);
        const barcode = safeString(row.getCell(4).value);
        const sku = safeString(row.getCell(5).value) || null;
        const costPrice = safeNumber(row.getCell(6).value);
        const sellingPrice = safeNumber(row.getCell(7).value);
        const mrp = safeNumber(row.getCell(8).value);

        if (!productSku) err.push("Product SKU is required");
        else if (!productSkus.includes(productSku)) {
          err.push(`Product SKU '${productSku}' not found in Products sheet`);
          if (!unknownSkus.includes(productSku)) unknownSkus.push(productSku);
        }
        if (!size) err.push("Size is required");
        if (!color) err.push("Color is required");
        if (!barcode) err.push("Barcode is required");
        if (costPrice <= 0) err.push("Cost Price must be > 0");
        if (sellingPrice <= 0) err.push("Selling Price must be > 0");
        if (mrp <= 0) err.push("MRP must be > 0");

        if (err.length > 0) {
          rowErrors.push({ row: rowNum, errors: err });
        } else {
          validRows.push({
            productSku,
            size,
            color,
            barcode,
            sku,
            costPrice,
            sellingPrice,
            mrp,
          });
        }
      });

      return { valid: validRows, errors: rowErrors, unknownSkus };
    },
    [],
  );

  const buildProductsWithVariants = useCallback(
    (
      productRows: Omit<AddProductForm, "variants">[],
      variantRows: VariantRow[],
    ): AddProductForm[] => {
      const productsMap: {
        [sku: string]: {
          product: Omit<AddProductForm, "variants">;
          variants: ProductVariantInput[];
        };
      } = {};

      // Build products map
      productRows.forEach((p) => {
        const sku = p.sku || "";
        productsMap[sku] = { product: p, variants: [] };
      });

      // Attach variants
      variantRows.forEach((v) => {
        const sku = v.productSku;
        if (productsMap[sku]) {
          productsMap[sku].variants.push({
            size: v.size,
            color: v.color,
            barcode: v.barcode,
            sku: v.sku,
            costPrice: v.costPrice,
            sellingPrice: v.sellingPrice,
            mrp: v.mrp,
          });
        }
      });

      // Convert to array
      return Object.values(productsMap).map(({ product, variants }) => ({
        ...product,
        variants,
      }));
    },
    [],
  );

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

      // Get sheets by name
      const productSheet = workbook.getWorksheet("Products");
      const variantSheet = workbook.getWorksheet("Variants");

      if (!productSheet || !variantSheet) {
        throw new Error('Required sheets "Products" and "Variants" not found');
      }

      // Validate product sheet headers
      const productHeaders = productSheet.getRow(1).values.slice(1) as string[];
      const expectedProductHeaders = [
        "name",
        "sku",
        "hsnCode",
        "description",
        "categoryId",
        "brand",
        "gstPercent",
        "taxInclusive",
      ];
      const normalizedProduct = productHeaders.map((h) =>
        safeString(h).toLowerCase(),
      );
      if (!expectedProductHeaders.every((h) => normalizedProduct.includes(h))) {
        throw new Error(
          `Products sheet must have headers: ${expectedProductHeaders.join(", ")}`,
        );
      }

      // Parse products
      const productRows: any[] = [];
      productSheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        productRows.push(row);
      });

      const { valid: validProducts, errors: productErrs } =
        validateProductsSheet(productRows);
      if (productErrs.length > 0) {
        setUploadErrors(productErrs.map((e) => ({ sheet: "Products", ...e })));
        setErrors(["Validation errors in Products sheet"]);
        return;
      }

      if (validProducts.length === 0) {
        setErrors(["No valid products found"]);
        return;
      }

      const productSkus = validProducts
        .map((p) => p.sku!)
        .filter(Boolean) as string[];

      // Validate variant sheet headers
      const variantHeaders = variantSheet.getRow(1).values.slice(1) as string[];
      const expectedVariantHeaders = [
        "productSku",
        "size",
        "color",
        "barcode",
        "sku",
        "costPrice",
        "sellingPrice",
        "mrp",
      ];
      const normalizedVariant = variantHeaders.map((h) =>
        safeString(h).toLowerCase(),
      );
      if (!expectedVariantHeaders.every((h) => normalizedVariant.includes(h))) {
        throw new Error(
          `Variants sheet must have headers: ${expectedVariantHeaders.join(", ")}`,
        );
      }

      // Parse variants
      const variantRowsData: any[] = [];
      variantSheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        variantRowsData.push(row);
      });

      const { valid: validVariants, errors: variantErrs } =
        validateVariantsSheet(variantRowsData, productSkus);

      if (variantErrs.length > 0) {
        setUploadErrors((prev) => [
          ...prev,
          ...variantErrs.map((e) => ({ sheet: "Variants", ...e })),
        ]);
        setErrors(["Validation errors in Variants sheet"]);
        return;
      }

      // Build final products with nested variants
      const finalProducts = buildProductsWithVariants(
        validProducts,
        validVariants,
      );

      if (finalProducts.length === 0) {
        setErrors(["No valid data after processing"]);
        return;
      }

      await onBulkCreate(finalProducts);

      setSuccess(
        `Successfully uploaded ${finalProducts.length} products with ${validVariants.length} variants!`,
      );
      setFile(null);
      refetch();
    } catch (err) {
      setErrors([(err as Error).message || "Upload failed"]);
    } finally {
      setLoading(false);
    }
  }, [
    file,
    refetch,
    validateProductsSheet,
    validateVariantsSheet,
    buildProductsWithVariants,
    onBulkCreate,
  ]);

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm">
      <DialogTitle className="text-lg p-3! font-semibold">
        Bulk Upload Products
      </DialogTitle>

      <Divider />

      <DialogContent className="p-6 max-h-[70vh] overflow-auto">
        <div className="space-y-4">
          {/* DOWNLOAD TEMPLATE */}
          <CustomButton
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={downloadTemplate}
            fullWidth
            size="large"
          >
            Download Template (2 sheets: Products + Variants)
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
              <Typography
                variant="body2"
                sx={{ fontWeight: 600 }}
                className="mb-2"
              >
                Row Errors:
              </Typography>

              {uploadErrors.map(({ sheet, row, errors }, idx) => (
                <Alert key={idx} severity="error" className="mb-1">
                  {sheet} Sheet, Row {row}: {errors.join(", ")}
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
