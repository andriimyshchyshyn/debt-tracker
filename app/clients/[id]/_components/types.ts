export type Sale = {
  id: string;
  amountUAH: number;
  comment: string | null;
  date: string;
};

export type Payment = {
  id: string;
  amountUAH: number;
  comment: string | null;
  date: string;
};

export type ClientDetail = {
  id: string;
  name: string;
  phone: string | null;
  note: string | null;
  sales: Sale[];
  payments: Payment[];
};

export type Totals = {
  totalSales: number;
  totalPayments: number;
  debt: number;
};

export function formatUAH(n: number) {
  return new Intl.NumberFormat("uk-UA").format(n) + " ₴";
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}