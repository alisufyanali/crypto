import AppLayout from "@/layouts/app-layout";
import { Head, Link } from "@inertiajs/react";
import { type BreadcrumbItem } from "@/types";

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// recharts for chart
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

type Company = {
    id: number;
    name: string;
    symbol: string;
    description: string;
    sector: string;
    market_cap: number;
    shares_outstanding: number;
    current_price: number;
    logo: string | null;
    currentStock?: {
        id: number;
        price: number;
        price_date: string;
    };
};

type PriceHistory = {
    id: number;
    price: number;
    price_date: string;
};

interface Props {
    company: Company;
    priceHistory: PriceHistory[];
}

export default function CompanyShow({ company, priceHistory }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Companies", href: "/companies" },
        { title: company.name, href: `/companies/${company.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={company.name} />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">🏢 {company.name}</h1>
                    <Link
                        href="/companies"
                        className="text-sm font-medium text-blue-600 hover:underline"
                    >
                        ← Back to Companies
                    </Link>
                </div>

                {/* Company Details */}
                <Card className="max-w-3xl mx-auto shadow-lg">
                    <CardHeader>
                        <CardTitle>Company Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Logo */}
                        {company.logo && (
                            <div className="flex justify-center">
                                <img
                                    src={`/storage/${company.logo}`}
                                    alt={company.name}
                                    className="h-28 object-contain"
                                />
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="font-semibold">Symbol:</p>
                                <p>{company.symbol}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Sector:</p>
                                <p>{company.sector}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Market Cap:</p>
                                <p>${company.market_cap?.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Shares Outstanding:</p>
                                <p>{company.shares_outstanding?.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Current Price:</p>
                                <p>${company.current_price}</p>
                            </div>
                            {company.currentStock && (
                                <div>
                                    <p className="font-semibold">Latest Stock:</p>
                                    <p>
                                        ${company.currentStock.price} (
                                        {new Date(
                                            company.currentStock.price_date
                                        ).toLocaleDateString()})
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <p className="font-semibold mb-1">Description:</p>
                            <p className="text-gray-700">{company.description}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Stock Price History */}
                <Card className="max-w-3xl mx-auto shadow-lg">
                    <CardHeader>
                        <CardTitle>📈 Last 30 Days Price History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {priceHistory.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={priceHistory}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="price_date"
                                        tickFormatter={(date) =>
                                            new Date(date).toLocaleDateString()
                                        }
                                    />
                                    <YAxis />
                                    <Tooltip
                                        formatter={(value: any) => [`$${value}`, "Price"]}
                                        labelFormatter={(date) =>
                                            new Date(date).toLocaleDateString()
                                        }
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="price"
                                        stroke="#2563eb"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-gray-500">No price history available.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
