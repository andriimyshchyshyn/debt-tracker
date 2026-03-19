export type ClientSummary = {
  id: string;
  name: string;
  phone: string | null;
  note: string | null;
  totalSales: number;
  totalPayments: number;
  debt: number;
  lastActivityAt: string;
};

export function formatUAH(n: number) {
  return new Intl.NumberFormat("uk-UA").format(n) + " ₴";
}