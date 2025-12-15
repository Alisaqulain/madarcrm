"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
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
import { Plus, Edit, Trash2, Search } from "lucide-react";

// Mock data - in real app, this would come from API
const mockStudents = [
  {
    id: 1,
    registrationNo: "502",
    studentName: "Ahmed Ali",
    fatherName: "Mohammed Ali",
    class: "Class 1",
    section: "A",
    mobileNumber: "8171253035",
    monthlyFee: "1000",
  },
  {
    id: 2,
    registrationNo: "503",
    studentName: "Hassan Khan",
    fatherName: "Ibrahim Khan",
    class: "Class 2",
    section: "B",
    mobileNumber: "9876543210",
    monthlyFee: "1200",
  },
];

export default function StudentListPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = mockStudents.filter(
    (student) =>
      student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.registrationNo.includes(searchTerm) ||
      student.fatherName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id: number) => {
    router.push(`/student/update/${id}`);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this student?")) {
      // Handle delete
      console.log("Delete student:", id);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{t("student.list")}</h1>
          <Button onClick={() => router.push("/student/add")}>
            <Plus className="mr-2 h-4 w-4" />
            {t("student.add")}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder={t("common.search")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("student.registrationNo")}</TableHead>
                  <TableHead>{t("student.studentName")}</TableHead>
                  <TableHead>{t("student.fatherName")}</TableHead>
                  <TableHead>{t("student.class")}</TableHead>
                  <TableHead>{t("student.section")}</TableHead>
                  <TableHead>{t("student.mobileNumber")}</TableHead>
                  <TableHead>{t("student.monthlyFees")}</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      No students found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.registrationNo}</TableCell>
                      <TableCell>{student.studentName}</TableCell>
                      <TableCell>{student.fatherName}</TableCell>
                      <TableCell>{student.class}</TableCell>
                      <TableCell>{student.section}</TableCell>
                      <TableCell>{student.mobileNumber}</TableCell>
                      <TableCell>₹{student.monthlyFee}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(student.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(student.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

