import React from "react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, Link } from "@inertiajs/react";

// shadcn/ui imports
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  stock: any;
  company: { id: number; name: string };
}

export default function StockShow({ stock, company }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Stocks", href: "/stocks" },
    { title: `Stock #${stock.id}`, href: `/stocks/${stock.id}` },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Stock #${stock.id}`} />

      <div className="flex flex-col gap-6 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">📊 Stock Details</h1>
          <Link href="/stocks" className="text-sm font-medium text-blue-600 hover:underline">
            ← Back to Stocks
          </Link>
        </div>

        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle>Stock Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <p className="font-medium">Company</p>
                <p>{stock.company?.name || "N/A"}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <p className="font-medium">Current Price</p>
                <p>{stock.current_price}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <p className="font-medium">Previous Close</p>
                <p>{stock.previous_close}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <p className="font-medium">Day High</p>
                <p>{stock.day_high}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <p className="font-medium">Day Low</p>
                <p>{stock.day_low}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <p className="font-medium">Volume</p>
                <p>{stock.volume}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <p className="font-medium">Change Amount</p>
                <p>{stock.change_amount}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <p className="font-medium">Change %</p>
                <p>{stock.change_percentage}%</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 mt-6">
              <Link href={`/stocks/${stock.id}/edit`}>
                <Button variant="outline" className="cursor-pointer">Edit</Button>
              </Link>
              <Link href="/stocks">
                <Button className="cursor-pointer">Back</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
