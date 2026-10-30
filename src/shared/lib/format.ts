export function formatToRupiah(value: number) {
  return new Intl.NumberFormat('id-ID', {
    currency: 'IDR',
    style: 'currency',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
