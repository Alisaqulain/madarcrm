"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";

// Mock data
const mockPayments = [
  {
    id: 1,
    date: new Date("2024-01-15"),
    itemName: "Rice",
    amount: 5000,
  },
  {
    id: 2,
    date: new Date("2024-01-20"),
    itemName: "Vegetables",
    amount: 3000,
  },
  {
    id: 3,
    date: new Date("2024-02-01"),
    itemName: "Spices",
    amount: 2000,
  },
];

export default function KitchenPaymentPage() {
  const { t } = useTranslation();
  const [paymentDate, setPaymentDate] = useState<Date | undefined>(new Date());
  const [itemName, setItemName] = useState("");
  const [amount, setAmount] = useState("");

  const handleAddPayment = () => {
    if (!paymentDate || !itemName || !amount) {
      alert("Please fill all fields");
      return;
    }
    console.log("Adding payment:", { paymentDate, itemName, amount });
    alert("Payment added successfully!");
    setItemName("");
    setAmount("");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{t("kitchen.title")}</h1>

        <Card>
          <CardHeader>
            <CardTitle>Add Kitchen Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="date">{t("kitchen.date")}</Label>
                <DatePicker
                  date={paymentDate}
                  onDateChange={setPaymentDate}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="itemName">{t("kitchen.itemName")}</Label>
                <Input
                  id="itemName"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="Enter item name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">{t("kitchen.amount")}</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>

              <div className="flex items-end">
                <Button onClick={handleAddPayment} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Payment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("kitchen.date")}</TableHead>
                  <TableHead>{t("kitchen.itemName")}</TableHead>
                  <TableHead>{t("kitchen.amount")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      {payment.date.toLocaleDateString()}
                    </TableCell>
                    <TableCell>{payment.itemName}</TableCell>
                    <TableCell>₹{payment.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

