# 📌 Edviron Assignment – Frontend

This is the **frontend application** for the Edviron Assignment project.  
It provides a clean UI for viewing transactions, filtering by school/status, checking transaction statuses, and exploring transaction overviews.

The project is built with **Next.js + TypeScript + Tailwind + Shadcn/UI** and consumes APIs from the [Edviron Backend](https://edviron-assignment-backend.vercel.app).

---

## 🚀 Features

- 📊 **Transactions Overview** – View all transactions with filtering by status (Success, Pending, Failed, None).
- 🏫 **Transactions by School** – Search and filter transactions by `school_id`, with dropdown filter and pagination.
- 🔍 **Transaction Status Check** – Enter a `custom_order_id` to check the latest transaction status and details.
- 🎨 **Modern UI/UX** – Built with TailwindCSS, Shadcn UI components, and responsive design.
- ⚡ **API Integrated** – Fetches real-time data from the backend API.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Language**: TypeScript
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/), [Lucide Icons](https://lucide.dev/)
- **Styling**: TailwindCSS
- **HTTP Client**: Axios

---

## 📂 Project Structure

```bash
edviron-assignment-frontend/
│── app/
│   ├── transactions/        # Transactions pages (overview, by school)
│   ├── transaction-status/  # Transaction status checker

│   ├── transaction-status-check/  # Transaction status checker
│── components/
│   ├── ui/                  # Reusable shadcn components (Table, Input, Select, etc.)
│   ├── TransactionsTable.tsx
│── public/
│── package.json
│── tailwind.config.js
│── README.md
```
