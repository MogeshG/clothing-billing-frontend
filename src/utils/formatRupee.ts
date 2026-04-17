export default function formatRupee(amount: number) {
  if (typeof amount !== "number" || !isFinite(amount)) {
    return "";
  }

  return `₹ ${amount.toFixed(2)}`;
}
