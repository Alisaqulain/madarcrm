"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Printer, Download, Calendar } from "lucide-react";
import { useLanguageStore } from "@/store/language-store";
import { extendedDummyStudents, dummyAttendance } from "@/data/dummy-data";
import type { DummyStudent } from "@/data/dummy-students";

type Student = DummyStudent;

export default function AttendanceRegisterPage() {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [excludedDates, setExcludedDates] = useState<Set<number>>(new Set());
  const [registerLanguage, setRegisterLanguage] = useState<"en" | "hi" | "ur">(language);

  // Get unique classes
  const uniqueClasses = useMemo(() => {
    const classes = new Set(extendedDummyStudents.map(s => s.class));
    return Array.from(classes).sort();
  }, []);

  // Get students filtered by class
  const filteredStudents = useMemo(() => {
    return selectedClass
      ? extendedDummyStudents.filter(s => s.class === selectedClass)
      : extendedDummyStudents;
  }, [selectedClass]);

  // Generate all dates in the selected month
  const monthDates = useMemo(() => {
    const dates: number[] = [];
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      dates.push(day);
    }
    return dates;
  }, [selectedMonth, selectedYear]);

  // Get month name
  const monthName = useMemo(() => {
    const date = new Date(selectedYear, selectedMonth - 1, 1);
    return date.toLocaleDateString(language === "ur" ? "ar-SA" : language === "hi" ? "hi-IN" : "en-US", { month: "long", year: "numeric" });
  }, [selectedMonth, selectedYear, language]);

  // Get attendance data for students
  const getAttendanceForStudent = (studentId: string, date: number): "P" | "A" | "" => {
    const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    const attendance = dummyAttendance.find(
      a => a.studentId === studentId && a.date === dateStr
    );
    return attendance ? (attendance.status === "Present" ? "P" : "A") : "";
  };

  const handleToggleDate = (date: number) => {
    setExcludedDates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(date)) {
        newSet.delete(date);
      } else {
        newSet.add(date);
      }
      return newSet;
    });
  };

  const handlePrint = () => {
    const printHtml = generateAttendanceRegisterHtml(
      filteredStudents,
      selectedMonth,
      selectedYear,
      excludedDates,
      selectedClass,
      registerLanguage
    );
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printHtml);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  const generateAttendanceRegisterHtml = (
    students: Student[],
    month: number,
    year: number,
    excluded: Set<number>,
    classFilter: string,
    lang: "en" | "hi" | "ur"
  ) => {
    const dates = monthDates.filter(d => !excluded.has(d));
    const monthNameStr = new Date(year, month - 1, 1).toLocaleDateString(
      lang === "ur" ? "ar-SA" : lang === "hi" ? "hi-IN" : "en-US",
      { month: "long", year: "numeric" }
    );

    const labels = {
      en: {
        title: "Attendance Register",
        appName: "Nizam-e-Taleem",
        class: "Class",
        month: "Month",
        rollNo: "Roll No",
        name: "Name",
        fatherName: "Father's Name",
        present: "Present",
        absent: "Absent",
        total: "Total",
        signature: "Teacher's Signature"
      },
      hi: {
        title: "उपस्थिति रजिस्टर",
        appName: "निजाम-ए-तालीम",
        class: "कक्षा",
        month: "महीना",
        rollNo: "रोल नंबर",
        name: "नाम",
        fatherName: "पिता का नाम",
        present: "उपस्थित",
        absent: "अनुपस्थित",
        total: "कुल",
        signature: "शिक्षक के हस्ताक्षर"
      },
      ur: {
        title: "حاضری رجسٹر",
        appName: "نظام تعلیم",
        class: "درجہ",
        month: "مہینہ",
        rollNo: "رول نمبر",
        name: "نام",
        fatherName: "والد کا نام",
        present: "حاضر",
        absent: "غائب",
        total: "کل",
        signature: "استاد کے دستخط"
      }
    };

    const l = labels[lang];
    const isRTL = lang === "ur";

    // Calculate totals for each student
    const studentTotals = students.map(student => {
      let present = 0;
      let absent = 0;
      dates.forEach(date => {
        const attendance = getAttendanceForStudent(student.studentId, date);
        if (attendance === "P") present++;
        if (attendance === "A") absent++;
      });
      return { present, absent, total: present + absent };
    });

    const dateHeaders = dates.map(d => `<th style="min-width: 30px; font-size: 10px;">${d}</th>`).join('');
    
    const studentRows = students.map((student, index) => {
      const name = student.name[lang] || student.name.en;
      const fatherName = student.fatherName[lang] || student.fatherName.en;
      const totals = studentTotals[index];
      const attendanceCells = dates.map(date => {
        const attendance = getAttendanceForStudent(student.studentId, date);
        const color = attendance === "P" ? "#10b981" : attendance === "A" ? "#ef4444" : "#f3f4f6";
        return `<td style="text-align: center; background: ${color}; color: ${attendance ? "white" : "#666"}; font-weight: bold;">${attendance || ""}</td>`;
      }).join('');
      
      return `
        <tr>
          <td style="text-align: center;">${index + 1}</td>
          <td>${student.studentId}</td>
          <td>${name}</td>
          <td>${fatherName}</td>
          ${attendanceCells}
          <td style="text-align: center; background: #10b981; color: white; font-weight: bold;">${totals.present}</td>
          <td style="text-align: center; background: #ef4444; color: white; font-weight: bold;">${totals.absent}</td>
          <td style="text-align: center; background: #667eea; color: white; font-weight: bold;">${totals.total}</td>
        </tr>
      `;
    }).join('');

    const grandTotal = studentTotals.reduce((acc, curr) => ({
      present: acc.present + curr.present,
      absent: acc.absent + curr.absent,
      total: acc.total + curr.total
    }), { present: 0, absent: 0, total: 0 });

    return `
<!DOCTYPE html>
<html dir="${isRTL ? "rtl" : "ltr"}" lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${l.title} - ${monthNameStr}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
      background: #f5f5f5;
    }
    .print-container {
      max-width: 1400px;
      margin: 0 auto;
      background: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 3px solid #10b981;
      padding-bottom: 20px;
    }
    .header h1 {
      color: #10b981;
      font-size: 28px;
      margin-bottom: 10px;
    }
    .header-info {
      display: flex;
      justify-content: space-between;
      margin-top: 15px;
      font-size: 14px;
      color: #666;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      font-size: 11px;
    }
    th {
      background: #10b981;
      color: white;
      padding: 8px 4px;
      text-align: ${isRTL ? "right" : "left"};
      border: 1px solid #ddd;
      font-weight: bold;
    }
    th.date-header {
      writing-mode: vertical-rl;
      text-orientation: mixed;
      min-width: 25px;
      padding: 4px 2px;
    }
    td {
      padding: 6px 4px;
      border: 1px solid #ddd;
      text-align: ${isRTL ? "right" : "left"};
    }
    tr:nth-child(even) {
      background: #f8f9fa;
    }
    .footer {
      margin-top: 30px;
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #666;
      border-top: 2px solid #ddd;
      padding-top: 20px;
    }
    .signature {
      text-align: center;
    }
    .signature-line {
      border-top: 2px solid #333;
      width: 200px;
      margin: 50px auto 10px;
    }
    .summary {
      margin-top: 20px;
      padding: 15px;
      background: #f0f9ff;
      border-radius: 8px;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
      font-weight: bold;
    }
    @media print {
      body { background: white; padding: 0; }
      .print-container { box-shadow: none; }
      table { font-size: 9px; }
      th, td { padding: 4px 2px; }
    }
  </style>
</head>
<body>
  <div class="print-container">
    <div class="header">
      <h1>${l.appName}</h1>
      <h2>${l.title}</h2>
      <div class="header-info">
        <div>${l.class}: ${classFilter || (lang === "en" ? "All Classes" : lang === "hi" ? "सभी कक्षाएं" : "تمام درجات")}</div>
        <div>${l.month}: ${monthNameStr}</div>
      </div>
    </div>
    
    <div style="overflow-x: auto;">
      <table>
        <thead>
          <tr>
            <th style="min-width: 40px;">#</th>
            <th style="min-width: 100px;">${l.rollNo}</th>
            <th style="min-width: 150px;">${l.name}</th>
            <th style="min-width: 150px;">${l.fatherName}</th>
            ${dateHeaders}
            <th style="min-width: 50px; background: #10b981;">${l.present}</th>
            <th style="min-width: 50px; background: #ef4444;">${l.absent}</th>
            <th style="min-width: 50px; background: #667eea;">${l.total}</th>
          </tr>
        </thead>
        <tbody>
          ${studentRows}
        </tbody>
        <tfoot>
          <tr style="background: #e0e7ff; font-weight: bold;">
            <td colspan="${4 + dates.length}" style="text-align: ${isRTL ? "left" : "right"}; padding-right: 10px;">${lang === "en" ? "Grand Total" : lang === "hi" ? "कुल योग" : "کل مجموعہ"}:</td>
            <td style="text-align: center; background: #10b981; color: white;">${grandTotal.present}</td>
            <td style="text-align: center; background: #ef4444; color: white;">${grandTotal.absent}</td>
            <td style="text-align: center; background: #667eea; color: white;">${grandTotal.total}</td>
          </tr>
        </tfoot>
      </table>
    </div>
    
    <div class="footer">
      <div>
        <p><strong>${l.appName}</strong></p>
        <p>${lang === "en" ? "Total Students" : lang === "hi" ? "कुल छात्र" : "کل طلباء"}: ${students.length}</p>
      </div>
      <div class="signature">
        <div class="signature-line"></div>
        <p>${l.signature}</p>
      </div>
    </div>
  </div>
</body>
</html>
    `;
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold">{t("nav.attendanceRegister")}</h1>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">{t("attendance.generateRegister") || "Generate Attendance Register"}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>{t("student.class")}</Label>
                <Select value={selectedClass || "all"} onValueChange={(value) => setSelectedClass(value === "all" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("books.allClasses")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("books.allClasses")}</SelectItem>
                    {uniqueClasses.map((cls) => (
                      <SelectItem key={cls} value={cls}>
                        {/^\d+$/.test(cls) ? `${t("student.class")} ${cls}` : cls}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t("attendance.month") || "Month"}</Label>
                <Select value={String(selectedMonth)} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => {
                      const date = new Date(selectedYear, month - 1, 1);
                      const monthName = date.toLocaleDateString(language === "ur" ? "ar-SA" : language === "hi" ? "hi-IN" : "en-US", { month: "long" });
                      return (
                        <SelectItem key={month} value={String(month)}>{monthName}</SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t("attendance.year") || "Year"}</Label>
                <Select value={String(selectedYear)} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[2020, 2021, 2022, 2023, 2024, 2025, 2026].map(year => (
                      <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <Label>{t("attendance.selectLanguage") || "Select Language"}</Label>
              <Select value={registerLanguage} onValueChange={(value: "en" | "hi" | "ur") => setRegisterLanguage(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">{t("common.english") || "English"}</SelectItem>
                  <SelectItem value="hi">{t("common.hindi") || "Hindi"}</SelectItem>
                  <SelectItem value="ur">{t("common.urdu") || "Urdu"}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Exclusion Section */}
            <div className="space-y-3 pt-4 border-t">
              <Label className="text-sm font-medium">
                {t("attendance.excludeDates") || "Exclude Dates (Holidays/Off Days)"}
              </Label>
              <div className="grid grid-cols-7 sm:grid-cols-10 gap-2 p-4 bg-gray-50 rounded-lg max-h-60 overflow-y-auto">
                {monthDates.map(date => (
                  <div key={date} className="flex items-center space-x-2">
                    <Checkbox
                      checked={excludedDates.has(date)}
                      onChange={() => handleToggleDate(date)}
                      id={`date-${date}`}
                    />
                    <Label
                      htmlFor={`date-${date}`}
                      className="text-xs cursor-pointer"
                    >
                      {date}
                    </Label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {t("attendance.excludeDatesHint") || "Select dates to exclude from the attendance register (holidays, off days, etc.)"}
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium mb-2">
                {t("cards.studentsFound") || "Students Found"}: <strong>{filteredStudents.length}</strong>
              </p>
              <p className="text-sm mb-2">
                {t("attendance.month") || "Month"}: <strong>{monthName}</strong>
              </p>
              <p className="text-sm mb-4">
                {t("attendance.totalDays") || "Total Days"}: <strong>{monthDates.length - excludedDates.size}</strong> 
                {excludedDates.size > 0 && ` (${excludedDates.size} ${t("attendance.excluded") || "excluded"})`}
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={handlePrint} className="w-full sm:w-auto">
                  <Printer className="h-4 w-4 mr-2" />
                  {t("attendance.printRegister") || "Print Attendance Register"}
                </Button>
                <Button onClick={handlePrint} variant="outline" className="w-full sm:w-auto">
                  <Download className="h-4 w-4 mr-2" />
                  {t("attendance.downloadPdf") || "Download PDF"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

