"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter, useParams } from "next/navigation";
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
import { DatePicker } from "@/components/ui/date-picker";
import { Card, CardContent } from "@/components/ui/card";

// This would fetch from API in real app
const getStudentData = (id: string) => {
  return {
    section: "A",
    class: "1",
    admissionDate: new Date("2024-05-04"),
    admissionNumber: "502",
    residenceName: "hostel1",
    aided: "امدادی",
    resident: "اقامتی",
    oldNew: "new",
    seatNumber: "10",
    modernSciences: "Yes",
    monthlyFee: "1000",
    roomNumber: "101",
    dateOfBirth: new Date("2009-04-26"),
    fatherName: "Mohammed Ali",
    studentName: "Ahmed Ali",
    firstAcademicYear: "2023",
    postOffice: "Main Post Office",
    address: "123 Main Street",
    aadhaar: "123456789012",
    mobileNumber: "8171253035",
    relationshipWithGuardian: "father",
    pinCode: "110001",
    district: "delhi",
    state: "delhi",
    guardianName: "Fatima Ali",
  };
};

export default function StudentUpdatePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [formData, setFormData] = useState(getStudentData(id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form updated:", formData);
    router.push("/student/list");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-red-600">
            {t("student.update")}
          </h1>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Same form fields as add page */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="section">
                    {t("student.section")} <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.section}
                    onValueChange={(value) =>
                      setFormData({ ...formData, section: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="class">
                    {t("student.class")} <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.class}
                    onValueChange={(value) =>
                      setFormData({ ...formData, class: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Class 1</SelectItem>
                      <SelectItem value="2">Class 2</SelectItem>
                      <SelectItem value="3">Class 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentName">
                    {t("student.studentName")} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="studentName"
                    value={formData.studentName}
                    onChange={(e) =>
                      setFormData({ ...formData, studentName: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fatherName">
                    {t("student.fatherName")} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fatherName"
                    value={formData.fatherName}
                    onChange={(e) =>
                      setFormData({ ...formData, fatherName: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {t("common.save")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/student/list")}
                >
                  {t("common.cancel")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

