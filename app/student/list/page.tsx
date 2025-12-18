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
import { Plus, Edit, Trash2, Search, FileSpreadsheet } from "lucide-react";
import { exportToExcel } from "@/lib/excel-export";
import { extendedDummyStudents } from "@/data/dummy-data";
import { useLanguageStore } from "@/store/language-store";

export default function StudentListPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { language } = useLanguageStore();
  const [searchTerm, setSearchTerm] = useState("");

  // Get students with current language
  const mockStudents = extendedDummyStudents.map((student, index) => ({
    id: index + 1,
    registrationNo: student.studentId,
    studentName: student.name[language] || student.name.en,
    fatherName: student.fatherName[language] || student.fatherName.en,
    class: `Class ${student.class}`,
    section: student.section,
    mobileNumber: student.phone,
    monthlyFee: "1000", // Default fee
  }));

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

  const handleExportExcel = () => {
    const exportData = filteredStudents.map((student) => ({
      "Registration No": student.registrationNo,
      "Student Name": student.studentName,
      "Father Name": student.fatherName,
      "Class": student.class,
      "Section": student.section,
      "Mobile Number": student.mobileNumber,
      "Monthly Fees": `₹${student.monthlyFee}`,
    }));
    
    exportToExcel(exportData, `students-export-${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <h1 className="text-2xl sm:text-3xl font-bold">{t("student.list")}</h1>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button onClick={handleExportExcel} variant="outline" className="w-full sm:w-auto">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export Excel
            </Button>
            <Button onClick={() => router.push("/student/add")} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              {t("student.add")}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder={t("common.search")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm sm:text-base"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">{t("student.registrationNo")}</TableHead>
                  <TableHead className="text-xs sm:text-sm">{t("student.studentName")}</TableHead>
                  <TableHead className="text-xs sm:text-sm">{t("student.fatherName")}</TableHead>
                  <TableHead className="text-xs sm:text-sm">{t("student.class")}</TableHead>
                  <TableHead className="text-xs sm:text-sm">{t("student.section")}</TableHead>
                  <TableHead className="text-xs sm:text-sm">{t("student.mobileNumber")}</TableHead>
                  <TableHead className="text-xs sm:text-sm">{t("student.monthlyFees")}</TableHead>
                  <TableHead className="text-right text-xs sm:text-sm">Actions</TableHead>
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
                      <TableCell className="text-xs sm:text-sm">{student.registrationNo}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{student.studentName}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{student.fatherName}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{student.class}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{student.section}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{student.mobileNumber}</TableCell>
                      <TableCell className="text-xs sm:text-sm">₹{student.monthlyFee}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 sm:gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(student.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(student.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
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

