"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Printer, Download } from "lucide-react";
import { useLanguageStore } from "@/store/language-store";
import { extendedDummyStudents } from "@/data/dummy-data";

export default function GeneralListPrintPage() {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const [selectedClass, setSelectedClass] = useState("");

  // Filter students by class
  const filteredStudents = selectedClass
    ? extendedDummyStudents.filter(s => s.class === selectedClass)
    : extendedDummyStudents;

  const handlePrint = () => {
    const printHtml = generatePrintHtml(filteredStudents, language, selectedClass);
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printHtml);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  const generatePrintHtml = (students: typeof extendedDummyStudents, lang: "en" | "hi" | "ur", classFilter: string) => {
    const currentDate = new Date().toLocaleDateString();
    const title = lang === "en" ? "Student General List" : lang === "hi" ? "छात्र सामान्य सूची" : "طالب علم کی عمومی فہرست";
    const classLabel = lang === "en" ? "Class" : lang === "hi" ? "कक्षा" : "درجہ";
    const allClasses = lang === "en" ? "All Classes" : lang === "hi" ? "सभी कक्षाएं" : "تمام درجات";
    const appName = lang === "en" ? "Nizam-e-Taleem" : lang === "hi" ? "निजाम-ए-तालीम" : "نظام تعلیم";

    return `
<!DOCTYPE html>
<html dir="${lang === "ur" ? "rtl" : "ltr"}" lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
      background: #f5f5f5;
    }
    .print-container {
      max-width: 1000px;
      margin: 0 auto;
      background: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 3px solid #667eea;
      padding-bottom: 20px;
    }
    .header h1 {
      color: #667eea;
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
    }
    th {
      background: #667eea;
      color: white;
      padding: 12px;
      text-align: ${lang === "ur" ? "right" : "left"};
      border: 1px solid #ddd;
    }
    td {
      padding: 10px 12px;
      border: 1px solid #ddd;
      text-align: ${lang === "ur" ? "right" : "left"};
    }
    tr:nth-child(even) {
      background: #f8f9fa;
    }
    .footer {
      margin-top: 30px;
      text-align: center;
      font-size: 12px;
      color: #666;
      border-top: 2px solid #ddd;
      padding-top: 20px;
    }
    @media print {
      body {
        background: white;
        padding: 0;
      }
      .print-container {
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="print-container">
    <div class="header">
      <h1>${appName}</h1>
      <h2>${title}</h2>
      <div class="header-info">
        <div>${classLabel}: ${classFilter || allClasses}</div>
        <div>Date: ${currentDate}</div>
      </div>
    </div>
    
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>${lang === "en" ? "Roll No" : lang === "hi" ? "रोल नंबर" : "رول نمبر"}</th>
          <th>${lang === "en" ? "Name" : lang === "hi" ? "नाम" : "نام"}</th>
          <th>${lang === "en" ? "Father's Name" : lang === "hi" ? "पिता का नाम" : "والد کا نام"}</th>
          <th>${lang === "en" ? "Class" : lang === "hi" ? "कक्षा" : "درجہ"}</th>
          <th>${lang === "en" ? "Section" : lang === "hi" ? "अनुभाग" : "سیکشن"}</th>
          <th>${lang === "en" ? "Phone" : lang === "hi" ? "फोन" : "فون"}</th>
        </tr>
      </thead>
      <tbody>
        ${students.map((student, index) => {
          const name = student.name[lang] || student.name.en;
          const fatherName = student.fatherName[lang] || student.fatherName.en;
          return `
          <tr>
            <td>${index + 1}</td>
            <td>${student.studentId}</td>
            <td>${name}</td>
            <td>${fatherName}</td>
            <td>${student.class}</td>
            <td>${student.section}</td>
            <td>${student.phone}</td>
          </tr>
        `;
        }).join("")}
      </tbody>
    </table>
    
    <div class="footer">
      <p>Total Students: ${students.length}</p>
      <p>Generated on ${currentDate} - ${appName}</p>
    </div>
  </div>
</body>
</html>
    `;
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold">{t("nav.generalListPrint")}</h1>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Generate General Student List</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="space-y-2">
              <Label>{t("general.filterByClassOptional")}</Label>
              <Select value={selectedClass || "all"} onValueChange={(value) => setSelectedClass(value === "all" ? "" : value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t("books.allClasses")} />
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

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm">
                <strong>{t("general.totalStudents")}:</strong> {filteredStudents.length}
                {selectedClass && ` (${t("student.class")} ${selectedClass})`}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handlePrint} className="w-full sm:w-auto">
                <Printer className="h-4 w-4 mr-2" />
                {t("general.printList")}
              </Button>
              <Button onClick={handlePrint} variant="outline" className="w-full sm:w-auto">
                <Download className="h-4 w-4 mr-2" />
                {t("general.downloadPdf")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
