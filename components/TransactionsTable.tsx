"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

type Transaction = {
  collect_id: string;
  school_id: string;
  gateway: string;
  order_amount: number;
  transaction_amount: number;
  status: string;
  custom_order_id: string;
};

export default function TransactionsOverview() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // --- States synced with URL ---
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [schoolId, setSchoolId] = useState(searchParams.get("school_id") || "");
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  // --- Update URL when filters change ---
  useEffect(() => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (schoolId) params.set("school_id", schoolId);
    if (search) params.set("search", search);

    const newUrl = `/transactions?${params.toString()}`;
    router.replace(newUrl); // no re-render loop
  }, [status, schoolId, search, router]);

  // --- Fetch data whenever filters change ---
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "https://edviron-assignment-backend.vercel.app/api/transactions",
          {
            params: {
              status,
              school_id: schoolId,
              search,
            },
          }
        );
        setTransactions(res.data.data || []);
      } catch (err) {
        console.error("Error fetching transactions", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [status, schoolId, search]);

  return (
    <div className="p-6 w-full">
      <Card className="w-full shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Transactions Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* --- Filters --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Status Filter */}
            <div>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Success">Success</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* School ID Filter */}
            <div>
              <Input
                placeholder="Filter by School ID"
                value={schoolId}
                onChange={(e) => setSchoolId(e.target.value)}
              />
            </div>

            {/* Search */}
            <div>
              <Input
                placeholder="Search by Order ID"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* --- Table --- */}
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Collect ID</TableHead>
                    <TableHead>School ID</TableHead>
                    <TableHead>Gateway</TableHead>
                    <TableHead>Order Amount</TableHead>
                    <TableHead>Transaction Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Custom Order ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((txn) => (
                      <TableRow key={txn.collect_id}>
                        <TableCell>{txn.collect_id}</TableCell>
                        <TableCell>{txn.school_id}</TableCell>
                        <TableCell>{txn.gateway}</TableCell>
                        <TableCell>₹{txn.order_amount}</TableCell>
                        <TableCell>₹{txn.transaction_amount}</TableCell>
                        <TableCell>{txn.status}</TableCell>
                        <TableCell>{txn.custom_order_id}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
