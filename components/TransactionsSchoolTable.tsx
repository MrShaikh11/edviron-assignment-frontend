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

export default function TransactionsBySchool() {
  const [data, setData] = useState<Transaction[]>([]);
  const [filteredData, setFilteredData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [schoolSearch, setSchoolSearch] = useState(""); // 🔹 filter by school_id
  const [schoolFilter, setSchoolFilter] = useState<string | undefined>();
  const [schoolOptions, setSchoolOptions] = useState<string[]>([]);

  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://edviron-assignment-backend.vercel.app/api/transactions"
        );
        const transactions: Transaction[] = res.data.data;

        setData(transactions);
        setFilteredData(transactions);

        // extract unique school IDs
        const uniqueSchools = Array.from(
          new Set(transactions.map((t) => t.school_id))
        );
        setSchoolOptions(uniqueSchools);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔹 Apply filters client-side
  useEffect(() => {
    let result = [...data];

    if (schoolFilter) {
      result = result.filter((t) => t.school_id === schoolFilter);
    }

    if (schoolSearch) {
      result = result.filter((t) =>
        t.school_id.toLowerCase().includes(schoolSearch.toLowerCase())
      );
    }

    setFilteredData(result);
    setPage(1);
  }, [schoolFilter, schoolSearch, data]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Transaction Details by School</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Search by school_id"
          value={schoolSearch}
          onChange={(e) => setSchoolSearch(e.target.value)}
          className="max-w-xs"
        />

        {/* 🔹 School ID Dropdown */}
        <Select
          value={schoolFilter}
          onValueChange={(value) =>
            setSchoolFilter(value === "none" ? undefined : value)
          }
        >
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Filter by school_id" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">All Schools</SelectItem>
            {schoolOptions.map((id) => (
              <SelectItem key={id} value={id}>
                {id}
              </SelectItem>
            ))}
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
