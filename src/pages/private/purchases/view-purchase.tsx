import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Grid, Chip, Card, CardContent } from "@mui/material";
import { usePurchaseDetail } from "../../../hooks/usePurchases";
import type { Purchase, PurchaseItem } from "../../../types/purchase";
import CustomButton from "../../../components/CustomButton";
import { CustomTable } from "../../../components/CustomTable";
import type { MRT_ColumnDef } from "material-react-table";
import { RemoveRedEye } from "@mui/icons-material";
import formatRupee from "../../../utils/formatRupee";
import Loader from "../../../components/CustomLoader";

const ViewPurchasePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { purchase, loading, error, refetch } = usePurchaseDetail(id || "");

  const itemsColumns = useMemo<MRT_ColumnDef<PurchaseItem>[]>(
    () => [
      {
        accessorKey: "itemName",
        header: "Item Name",
        size: 200,
      },
      {
        accessorKey: "itemType",
        header: "Type",
        Cell: ({ row }) => (
          <Chip
            label={row.original.itemType}
            size="small"
            color={
              row.original.itemType === "finished" ? "primary" : "secondary"
            }
          />
        ),
      },
      {
        accessorKey: "sku",
        header: "SKU",
      },
      {
        accessorKey: "size",
        header: "Size",
      },
      {
        accessorKey: "color",
        header: "Color",
      },
      {
        accessorKey: "hsnCode",
        header: "HSN Code",
      },
      {
        accessorKey: "quantity",
        header: "Qty",
        size: 80,
      },
      {
        accessorKey: "costPrice",
        header: "Price",
        Cell: ({ renderedCellValue }) =>
          `₹${Number(renderedCellValue).toLocaleString()}`,
        size: 100,
      },
      {
        accessorKey: "cgstPercent",
        header: "CGST%",
        size: 120,
      },
      {
        accessorKey: "sgstPercent",
        header: "SGST%",
        size: 120,
      },
      {
        accessorKey: "igstPercent",
        header: "IGST%",
        size: 120,
      },
      {
        accessorKey: "total",
        header: "Total",
        Cell: ({ renderedCellValue }) =>
          `₹${Number(renderedCellValue).toLocaleString()}`,
        size: 120,
      },
    ],
    [],
  );

  if (loading) {
    return <Loader />;
  }

  if (error || !purchase) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <RemoveRedEye className="text-6xl text-gray-400" />
        <div className="text-xl text-gray-600">
          {error || "Purchase not found"}
        </div>
        <div className="flex gap-2">
          <CustomButton variant="outlined" onClick={refetch}>
            Retry
          </CustomButton>
          <CustomButton
            variant="outlined"
            onClick={() => navigate("/purchases")}
          >
            Back to Purchases
          </CustomButton>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: Purchase["status"]) => {
    switch (status) {
      case "COMPLETED":
        return "success";
      case "DRAFT":
        return "info";
      case "CANCELLED":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <div className="flex flex-col m-2 w-full space-y-4 p-3 overflow-y-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Purchase Details</h1>
        <CustomButton
          variant="outlined"
          onClick={() => navigate("/purchases")}
          startIcon={<RemoveRedEye />}
        >
          Back to List
        </CustomButton>
      </div>

      <div className="flex flex-col w-full bg-white space-y-6 p-6 rounded-md mx-auto max-w-7xl shadow-sm">
        <div className="grid grid-cols-3 gap-4">
          {/* Field 1 */}
          <Grid size={{ xs: 12, md: 6 }}>
            <div className="flex items-center">
              <p className=" text-gray-500 w-40">Purchase No</p>
              <span className="text-gray-500 mr-2">:</span>
              <p className="text-base font-medium">{purchase.purchaseNo}</p>
            </div>
          </Grid>

          {/* Field 2 */}
          <Grid size={{ xs: 12, md: 6 }}>
            <div className="flex items-center">
              <p className=" text-gray-500 w-40">Purchase Date</p>
              <span className="text-gray-500 mr-2">:</span>
              <p className="text-base font-medium">
                {new Date(purchase.purchaseDate).toLocaleDateString()}
              </p>
            </div>
          </Grid>

          {/* Field 3 */}
          <Grid size={{ xs: 12, md: 6 }}>
            <div className="flex items-center">
              <p className=" text-gray-500 w-40">Status</p>
              <span className="text-gray-500 mr-2">:</span>
              <Chip
                label={purchase.status}
                color={getStatusColor(purchase.status)}
                size="small"
                variant="filled"
              />
            </div>
          </Grid>

          {/* Field 4 */}
          <Grid size={{ xs: 12, md: 6 }}>
            <div className="flex items-center">
              <p className=" text-gray-500 w-40">Vendor Name</p>
              <span className="text-gray-500 mr-2">:</span>
              <p className="text-base font-medium">
                {purchase.vendorName || "N/A"}
              </p>
            </div>
          </Grid>

          {/* Field 5 */}
          <Grid size={{ xs: 12, md: 6 }}>
            <div className="flex items-center">
              <p className=" text-gray-500 w-40">Vendor Phone</p>
              <span className="text-gray-500 mr-2">:</span>
              <p className="text-base font-medium">
                {purchase.vendorPhone || "N/A"}
              </p>
            </div>
          </Grid>

          {/* Field 6 */}
          <Grid size={{ xs: 12, md: 6 }}>
            <div className="flex items-center">
              <p className=" text-gray-500 w-40">Vendor GSTIN</p>
              <span className="text-gray-500 mr-2">:</span>
              <p className="text-base font-medium">
                {purchase.vendorGstin || "N/A"}
              </p>
            </div>
          </Grid>
        </div>

        {/* Items Table */}
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-gray-700 pb-2">
            Purchase Items ({purchase.items.length} items)
          </h2>
          <CustomTable
            columns={itemsColumns}
            data={purchase.items}
            enableRowActions={false}
            enableRowSelection={false}
            enableColumnFilters={false}
            enableSorting={false}
            enablePagination={false}
            enableGlobalFilter={false}
          />
        </div>

        {/* Totals Summary */}
        <Card className="bg-linear-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
              <div className="flex flex-col">
                <span className="text-gray-600">Sub Total</span>
                <span className="text-xl font-bold text-gray-900">
                  {formatRupee(parseInt(purchase.subTotal))}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-600">Discount</span>
                <span className="text-xl font-semibold text-green-600">
                  -{formatRupee(parseInt(purchase.discount))}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-600">Tax Amount</span>
                <span className="text-xl font-semibold">
                  {formatRupee(parseInt(purchase.taxAmount))}
                </span>
              </div>
              <div className="flex flex-col border-l border-gray-200 pl-6">
                <span className="text-gray-600">Grand Total</span>
                <span className="text-3xl font-bold text-gray-900">
                  {formatRupee(parseInt(purchase.totalAmount))}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewPurchasePage;
