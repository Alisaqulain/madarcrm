"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { List } from "lucide-react";

export default function StudentAddPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [formData, setFormData] = useState({
    section: "",
    class: "",
    admissionDate: new Date(),
    admissionNumber: "502",
    residenceName: "",
    aided: "امدادی",
    resident: "اقامتی",
    oldNew: "",
    seatNumber: "",
    modernSciences: "",
    monthlyFee: "1000",
    roomNumber: "",
    dateOfBirth: new Date("2009-04-26"),
    fatherName: "",
    studentName: "",
    firstAcademicYear: "2023",
    postOffice: "",
    address: "",
    aadhaar: "",
    mobileNumber: "8171253035",
    relationshipWithGuardian: "",
    pinCode: "",
    district: "",
    state: "",
    guardianName: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-red-600">
            {t("student.title")}
          </h1>
          <Button
            onClick={() => router.push("/student/list")}
            className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
          >
            <List className="mr-2 h-4 w-4" />
            {t("common.list")}
          </Button>
        </div>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1 */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
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
                      <SelectValue placeholder="--Select--" />
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
                      <SelectValue placeholder="--Select--" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Class 1</SelectItem>
                      <SelectItem value="2">Class 2</SelectItem>
                      <SelectItem value="3">Class 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admissionDate">
                    {t("student.dateOfAdmission")}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <DatePicker
                    date={formData.admissionDate}
                    onDateChange={(date) =>
                      setFormData({ ...formData, admissionDate: date || new Date() })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admissionNumber">
                    {t("student.registrationNo")}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="admissionNumber"
                    value={formData.admissionNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, admissionNumber: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="residenceName">
                    {t("student.resident")} <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.residenceName}
                    onValueChange={(value) =>
                      setFormData({ ...formData, residenceName: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="--Select--" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hostel1">Hostel 1</SelectItem>
                      <SelectItem value="hostel2">Hostel 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aided">
                    {t("student.aided")} / {t("student.nonAided")}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.aided}
                    onValueChange={(value) =>
                      setFormData({ ...formData, aided: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="امدادی">{t("student.aided")}</SelectItem>
                      <SelectItem value="nonAided">
                        {t("student.nonAided")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resident">
                    {t("student.resident")} / {t("student.nonResident")}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.resident}
                    onValueChange={(value) =>
                      setFormData({ ...formData, resident: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="اقامتی">{t("student.resident")}</SelectItem>
                      <SelectItem value="nonResident">
                        {t("student.nonResident")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="oldNew">
                    {t("student.old")} / {t("student.new")}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.oldNew}
                    onValueChange={(value) =>
                      setFormData({ ...formData, oldNew: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="-----" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="old">{t("student.old")}</SelectItem>
                      <SelectItem value="new">{t("student.new")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="seatNumber">
                    {t("student.seatNumber")} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="seatNumber"
                    value={formData.seatNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, seatNumber: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="modernSciences">
                    {t("student.modernSciences")}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="modernSciences"
                    value={formData.modernSciences}
                    onChange={(e) =>
                      setFormData({ ...formData, modernSciences: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthlyFee">
                    {t("student.monthlyFees")} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="monthlyFee"
                    value={formData.monthlyFee}
                    onChange={(e) =>
                      setFormData({ ...formData, monthlyFee: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roomNumber">
                    {t("student.roomNumber")} <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.roomNumber}
                    onValueChange={(value) =>
                      setFormData({ ...formData, roomNumber: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="---" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="101">101</SelectItem>
                      <SelectItem value="102">102</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 4 */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">
                    {t("student.dateOfBirth")} <span className="text-red-500">*</span>
                  </Label>
                  <DatePicker
                    date={formData.dateOfBirth}
                    onDateChange={(date) =>
                      setFormData({
                        ...formData,
                        dateOfBirth: date || new Date(),
                      })
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
                  <Label htmlFor="firstAcademicYear">
                    {t("student.firstAcademicYear")}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="firstAcademicYear"
                    value={formData.firstAcademicYear}
                    onChange={(e) =>
                      setFormData({ ...formData, firstAcademicYear: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Row 5 */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="postOffice">
                    {t("student.postOffice")} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="postOffice"
                    value={formData.postOffice}
                    onChange={(e) =>
                      setFormData({ ...formData, postOffice: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">
                    {t("student.address")} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aadhaar">{t("student.aadhaar")}</Label>
                  <Input
                    id="aadhaar"
                    value={formData.aadhaar}
                    onChange={(e) =>
                      setFormData({ ...formData, aadhaar: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobileNumber">
                    {t("student.mobileNumber")}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, mobileNumber: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Row 6 */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="relationshipWithGuardian">
                    {t("student.relationshipWithGuardian")}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.relationshipWithGuardian}
                    onValueChange={(value) =>
                      setFormData({ ...formData, relationshipWithGuardian: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="--Select--" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="father">Father</SelectItem>
                      <SelectItem value="mother">Mother</SelectItem>
                      <SelectItem value="guardian">Guardian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pinCode">
                    {t("student.pinCode")} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="pinCode"
                    value={formData.pinCode}
                    onChange={(e) =>
                      setFormData({ ...formData, pinCode: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district">
                    {t("student.district")} <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.district}
                    onValueChange={(value) =>
                      setFormData({ ...formData, district: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="--Select--" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="mumbai">Mumbai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">
                    {t("student.state")} <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.state}
                    onValueChange={(value) =>
                      setFormData({ ...formData, state: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="--- Select ---" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="up">Uttar Pradesh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 7 */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="guardianName">
                    {t("student.motherName")} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="guardianName"
                    value={formData.guardianName}
                    onChange={(e) =>
                      setFormData({ ...formData, guardianName: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                  {t("common.save")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/student/list")}
                  className="w-full sm:w-auto"
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

