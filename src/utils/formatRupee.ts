export default function formatRupee(amount: any) {
  const num = Number(amount);
  if (isNaN(num) || !isFinite(num)) {
    return "";
  }

  return `₹ ${num.toFixed(2)}`;
}
