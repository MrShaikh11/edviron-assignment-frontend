"use client";

import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type StatusResponse = {
  success: string;
  collect_request_id: string;
  status: string;
  details: {
    status: string;
    amount: number;
    jwt: string;
    sign: string;
  };
};

export default function TransactionStatusPage() {
  const [customOrderId, setCustomOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckStatus = async () => {
    if (!customOrderId) {
      setError("Please enter a Custom Order ID");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await axios.get(
        `https://edviron-assignment-backend.vercel.app/api/transaction-status/edviron/${customOrderId}`
      );
      setResult(res.data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Failed to fetch transaction status. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-fit w-full flex  justify-center p-6">
      <Card className="w-full max-w-xl shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Transaction Status Check
          </CardTitle>
          <CardDescription>
            Enter your <span className="font-medium">Custom Order ID</span> to
            check the current transaction status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Input Field */}
          <div className="flex flex-col gap-4 mb-6">
            <Label htmlFor="customOrderId">Custom Order ID</Label>
            <Input
              id="customOrderId"
              placeholder="Enter your custom_order_id"
              value={customOrderId}
              onChange={(e) => setCustomOrderId(e.target.value)}
            />
            <Button
              onClick={handleCheckStatus}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" /> Checking...
                </>
              ) : (
                "Check Status"
              )}
            </Button>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-600 text-sm font-medium text-center">
              {error}
            </p>
          )}
          {result && (
            <div className="rounded-md border mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Field</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Success</TableCell>
                    <TableCell>{result.success}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Custom Order ID
                    </TableCell>
                    <TableCell>{result.collect_request_id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Status</TableCell>
                    <TableCell className="uppercase">{result.status}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Amount</TableCell>
                    <TableCell>₹{result.details.amount}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">JWT</TableCell>
                    <TableCell className="truncate max-w-xs">
                      {result.details.jwt}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Sign</TableCell>
                    <TableCell className="truncate max-w-xs">
                      {result.details.sign}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
