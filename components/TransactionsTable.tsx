"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Transaction = {
  _id: string;
  collect_id: string;
  school_id: string;
  gateway: string;
  order_amount?: number;
  transaction_amount?: number;
  status?: string;
  custom_order_id?: string;
  createdAt?: string;
};

export default function TransactionsTable() {
  const [data, setData] = useState<Transaction[]>([]); // 🔹 Raw data from API
  const [filteredData, setFilteredData] = useState<Transaction[]>([]); // 🔹 Client-side filtered data
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [page, setPage] = useState(1);

  // 🔹 Fetch transactions only once (on mount)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://edviron-assignment-backend.vercel.app/api/transactions"
        );
        setData(res.data.data); // keep original dataset
        setFilteredData(res.data.data); // initialize filtered with full data
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔹 Apply filters client-side whenever search/statusFilter changes
  useEffect(() => {
    let result = [...data];

    if (statusFilter) {
      result = result.filter(
        (t) => t.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (search) {
      result = result.filter((t) =>
        t.collect_id.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredData(result);
    setPage(1); // reset to page 1 when filters change
  }, [statusFilter, search, data]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Transactions Overview</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Search by collect_id"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />

        <Select
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(value === "none" ? undefined : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="user_dropped">User Dropped</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.slice((page - 1) * 10, page * 10).map((t) => (
                <TableRow key={t._id}>
                  <TableCell>{t.collect_id}</TableCell>
                  <TableCell>{t.school_id}</TableCell>
                  <TableCell>{t.gateway}</TableCell>
                  <TableCell>{t.order_amount || "-"}</TableCell>
                  <TableCell>{t.transaction_amount || "-"}</TableCell>
                  <TableCell className="uppercase">{t.status || "-"}</TableCell>
                  <TableCell>{t.custom_order_id || "-"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </Button>
        <span>Page {page}</span>
        <Button
          variant="outline"
          disabled={page * 10 >= filteredData.length}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
