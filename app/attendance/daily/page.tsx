"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2, XCircle } from "lucide-react";
import { useLanguageStore } from "@/store/language-store";
import { extendedDummyStudents } from "@/data/dummy-data";

export default function AttendanceDailyPage() {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const [selectedClass, setSelectedClass] = useState("");
  const [attendanceDate, setAttendanceDate] = useState<Date | undefined>(
    new Date()
  );
  const [attendance, setAttendance] = useState<Record<string, "present" | "absent">>({});

  // Get students filtered by class with current language
  const filteredStudents = selectedClass
    ? extendedDummyStudents
        .filter(s => s.class === selectedClass)
        .map((student, index) => ({
          id: student.studentId,
          name: student.name[language] || student.name.en,
          registrationNo: student.studentId,
        }))
    : extendedDummyStudents.map((student, index) => ({
        id: student.studentId,
        name: student.name[language] || student.name.en,
        registrationNo: student.studentId,
      }));

  const handleToggleAttendance = (studentId: string) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === "present" ? "absent" : "present",
    }));
  };

  const handleSave = () => {
    console.log("Saving attendance:", attendance);
    alert("Attendance saved successfully!");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{t("attendance.title")}</h1>

        <Card>
          <CardHeader>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="class">{t("attendance.class")}</Label>
                <Select value={selectedClass || "all"} onValueChange={(value) => setSelectedClass(value === "all" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={`--${t("common.search")} ${t("attendance.class")}--`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("books.allClasses")}</SelectItem>
                    <SelectItem value="1">{t("student.class")} 1</SelectItem>
                    <SelectItem value="2">{t("student.class")} 2</SelectItem>
                    <SelectItem value="3">{t("student.class")} 3</SelectItem>
                    <SelectItem value="4">{t("student.class")} 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">{t("attendance.date")}</Label>
                <DatePicker
                  date={attendanceDate}
                  onDateChange={setAttendanceDate}
                />
              </div>

              <div className="flex items-end">
                <Button onClick={handleSave} className="w-full">
                  {t("common.save")}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>{t("student.registrationNo")}</TableHead>
                  <TableHead>{t("student.studentName")}</TableHead>
                  <TableHead className="text-center">{t("attendance.present")}</TableHead>
                  <TableHead className="text-center">{t("attendance.absent")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      {t("student.list")} {t("common.search")}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student, index) => (
                    <TableRow key={student.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{student.registrationNo}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant={
                            attendance[student.id] === "present"
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => handleToggleAttendance(student.id)}
                          className={
                            attendance[student.id] === "present"
                              ? "bg-green-600 hover:bg-green-700"
                              : ""
                          }
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant={
                            attendance[student.id] === "absent"
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => {
                            setAttendance((prev) => ({
                              ...prev,
                              [student.id]: "absent",
                            }));
                          }}
                          className={
                            attendance[student.id] === "absent"
                              ? "bg-red-600 hover:bg-red-700"
                              : ""
                          }
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
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

