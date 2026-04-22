export default function formatRupee(amount: number) {
  console.log(amount)
  if (typeof amount !== "number" || !isFinite(amount)) {
    return "";
  }

  return `₹ ${amount.toFixed(2)}`;
}
