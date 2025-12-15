"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

// Mock data
const mockStudentData = {
  id: 1,
  studentName: "Ahmed Ali",
  registrationNo: "502",
  fatherName: "Mohammed Ali",
  fatherMobile: "9876543210",
  motherName: "Fatima Ali",
  motherMobile: "9876543211",
  class: "Class 1",
  section: "A",
  monthlyFee: 1000,
  totalFeesPaid: 5000,
  totalFeesPending: 2000,
  attendancePercentage: 95,
  lastExamResult: "A+",
};

export default function ReportParentsPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [studentData, setStudentData] = useState<typeof mockStudentData | null>(
    null
  );

  const handleSearch = () => {
    if (searchTerm) {
      // In real app, this would fetch from API
      setStudentData(mockStudentData);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{t("report.title")}</h1>

        <Card>
          <CardHeader>
            <CardTitle>{t("report.searchStudent")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="search">{t("common.search")}</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Enter student name or registration number"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <Button onClick={handleSearch}>{t("common.search")}</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {studentData && (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t("report.fatherInfo")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="font-semibold">Name: </span>
                    {studentData.fatherName}
                  </div>
                  <div>
                    <span className="font-semibold">Mobile: </span>
                    {studentData.fatherMobile}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("report.motherInfo")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="font-semibold">Name: </span>
                    {studentData.motherName}
                  </div>
                  <div>
                    <span className="font-semibold">Mobile: </span>
                    {studentData.motherMobile}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{t("report.academicSummary")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="font-semibold">Student Name: </span>
                  {studentData.studentName}
                </div>
                <div>
                  <span className="font-semibold">Registration No: </span>
                  {studentData.registrationNo}
                </div>
                <div>
                  <span className="font-semibold">Class: </span>
                  {studentData.class} - {studentData.section}
                </div>
                <div>
                  <span className="font-semibold">Last Exam Result: </span>
                  {studentData.lastExamResult}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("report.feeSummary")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="font-semibold">Monthly Fee: </span>
                  ₹{studentData.monthlyFee}
                </div>
                <div>
                  <span className="font-semibold">Total Fees Paid: </span>
                  ₹{studentData.totalFeesPaid}
                </div>
                <div>
                  <span className="font-semibold">Total Fees Pending: </span>
                  ₹{studentData.totalFeesPending}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("report.attendanceSummary")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <span className="font-semibold">Attendance Percentage: </span>
                  {studentData.attendancePercentage}%
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

