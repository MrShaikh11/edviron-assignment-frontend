import TransactionsTable from "@/components/TransactionsTable";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense>
      <TransactionsTable />;
    </Suspense>
  );
};

export default page;
