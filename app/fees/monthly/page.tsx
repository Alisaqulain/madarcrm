"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
const mockStudents = [
  { id: 1, name: "Ahmed Ali", registrationNo: "502" },
  { id: 2, name: "Hassan Khan", registrationNo: "503" },
];

const mockFees = [
  {
    id: 1,
    month: "January 2024",
    studentName: "Ahmed Ali",
    amount: 1000,
    status: "paid",
  },
  {
    id: 2,
    month: "February 2024",
    studentName: "Ahmed Ali",
    amount: 1000,
    status: "pending",
  },
];

export default function FeesMonthlyPage() {
  const { t } = useTranslation();
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [amount, setAmount] = useState("");

  const handleAddFee = () => {
    if (!selectedMonth || !selectedStudent || !amount) {
      alert("Please fill all fields");
      return;
    }
    console.log("Adding fee:", { selectedMonth, selectedStudent, amount });
    alert("Fee added successfully!");
    setAmount("");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{t("fees.title")}</h1>

        <Card>
          <CardHeader>
            <CardTitle>Add Monthly Fee</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="month">{t("fees.month")}</Label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger>
                    <SelectValue placeholder="--Select Month--" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="january">January 2024</SelectItem>
                    <SelectItem value="february">February 2024</SelectItem>
                    <SelectItem value="march">March 2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="student">{t("fees.student")}</Label>
                <Select
                  value={selectedStudent}
                  onValueChange={setSelectedStudent}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="--Select Student--" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockStudents.map((student) => (
                      <SelectItem key={student.id} value={student.id.toString()}>
                        {student.name} ({student.registrationNo})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">{t("fees.amount")}</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>

              <div className="flex items-end">
                <Button onClick={handleAddFee} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Fee
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Fees Records</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("fees.month")}</TableHead>
                  <TableHead>{t("fees.student")}</TableHead>
                  <TableHead>{t("fees.amount")}</TableHead>
                  <TableHead>{t("fees.status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockFees.map((fee) => (
                  <TableRow key={fee.id}>
                    <TableCell>{fee.month}</TableCell>
                    <TableCell>{fee.studentName}</TableCell>
                    <TableCell>₹{fee.amount}</TableCell>
                    <TableCell>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          fee.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {fee.status === "paid"
                          ? t("fees.paid")
                          : t("fees.pending")}
                      </span>
                    </TableCell>
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

