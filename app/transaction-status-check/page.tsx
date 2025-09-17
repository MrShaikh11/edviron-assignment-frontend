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
    } catch (err) {
      setError("Failed to fetch transaction status. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
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

          {/* Status Result */}
          {result && (
            <div className="p-4 border rounded-xl bg-gray-50 space-y-3 animate-in fade-in slide-in-from-bottom-2">
              <p>
                <span className="font-semibold">Status:</span>{" "}
                <span className="uppercase">{result.status}</span>
              </p>
              <p>
                <span className="font-semibold">Custom Order ID:</span>{" "}
                {result.collect_request_id}
              </p>
              <p>
                <span className="font-semibold">Amount:</span> ₹
                {result.details.amount}
              </p>

              {/* Advanced details collapsible (optional later) */}
              <details className="mt-2 cursor-pointer">
                <summary className="text-sm font-medium text-gray-600">
                  View Raw Details
                </summary>
                <pre className="bg-black text-white p-3 rounded-md mt-2 text-xs overflow-x-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
