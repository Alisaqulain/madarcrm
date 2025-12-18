"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Download, Search } from "lucide-react";
import { useLanguageStore } from "@/store/language-store";
import { extendedDummyStudents } from "@/data/dummy-data";
import type { DummyStudent } from "@/data/dummy-students";

type Student = DummyStudent;

export default function PrintIdCardPage() {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const [rollNumber, setRollNumber] = useState("");
  const [student, setStudent] = useState<Student | null>(null);
  const [error, setError] = useState("");

  const handleSearch = () => {
    setError("");
    setStudent(null);
    
    if (!rollNumber.trim()) {
      setError(t("cards.pleaseEnterRollNumber"));
      return;
    }

    const found = extendedDummyStudents.find(
      (s) => s.studentId.toLowerCase() === rollNumber.trim().toLowerCase()
    );

    if (found) {
      setStudent(found);
    } else {
      setError(t("cards.studentNotFound"));
    }
  };

  const handleDownload = () => {
    if (!student) return;

    const idCardHtml = generateIdCardHtml(student, language);
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(idCardHtml);
      printWindow.document.close();
      // Use setTimeout to ensure content is loaded before printing
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  const handleDownloadPDF = () => {
    if (!student) return;
    handleDownload(); // For now, same as print. Can be enhanced with PDF library later
  };

  const generateIdCardHtml = (student: Student, lang: "en" | "hi" | "ur") => {
    const name = student.name[lang] || student.name.en;
    const fatherName = student.fatherName[lang] || student.fatherName.en;
    const address = student.address[lang] || student.address.en;
    const dob = new Date(student.dob).toLocaleDateString(lang === "ur" ? "ar-SA" : lang === "hi" ? "hi-IN" : "en-US");
    const admissionDate = new Date(student.admissionDate).toLocaleDateString(lang === "ur" ? "ar-SA" : lang === "hi" ? "hi-IN" : "en-US");
    
    const labels = {
      en: {
        appName: "Nizam-e-Taleem",
        title: "Student Identity Card",
        rollNo: "Roll No:",
        class: "Class:",
        name: "Name:",
        fatherName: "Father's Name:",
        dob: "DOB:",
        phone: "Phone:",
        footer: "This card is the property of Nizam-e-Taleem"
      },
      hi: {
        appName: "निजाम-ए-तालीम",
        title: "छात्र पहचान पत्र",
        rollNo: "रोल नंबर:",
        class: "कक्षा:",
        name: "नाम:",
        fatherName: "पिता का नाम:",
        dob: "जन्म तिथि:",
        phone: "फोन:",
        footer: "यह कार्ड निजाम-ए-तालीम की संपत्ति है"
      },
      ur: {
        appName: "نظام تعلیم",
        title: "طالب علم شناختی کارڈ",
        rollNo: "رول نمبر:",
        class: "درجہ:",
        name: "نام:",
        fatherName: "والد کا نام:",
        dob: "تاریخ ولادت:",
        phone: "فون:",
        footer: "یہ کارڈ نظام تعلیم کی ملکیت ہے"
      }
    };
    
    const l = labels[lang];

    return `
<!DOCTYPE html>
<html dir="${lang === "ur" ? "rtl" : "ltr"}" lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ID Card - ${name}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #f5f5f5;
      padding: 20px;
    }
    .id-card {
      width: 400px;
      height: 250px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 15px;
      padding: 20px;
      color: white;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      position: relative;
      overflow: hidden;
    }
    .id-card::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    }
    .id-header {
      text-align: center;
      margin-bottom: 15px;
      position: relative;
      z-index: 1;
    }
    .id-header h2 {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .id-header p {
      font-size: 12px;
      opacity: 0.9;
    }
    .id-content {
      display: flex;
      justify-content: space-between;
      position: relative;
      z-index: 1;
    }
    .id-left {
      flex: 1;
    }
    .id-right {
      text-align: ${lang === "ur" ? "left" : "right"};
      flex: 1;
    }
    .id-field {
      margin-bottom: 8px;
      font-size: 12px;
    }
    .id-label {
      font-size: 10px;
      opacity: 0.8;
      margin-bottom: 2px;
    }
    .id-value {
      font-weight: bold;
      font-size: 13px;
    }
    .id-photo {
      width: 80px;
      height: 80px;
      background: rgba(255,255,255,0.2);
      border: 2px solid white;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      margin-bottom: 10px;
    }
    .id-footer {
      text-align: center;
      margin-top: 15px;
      font-size: 10px;
      opacity: 0.8;
      position: relative;
      z-index: 1;
    }
    @media print {
      body {
        background: white;
        padding: 0;
      }
      .id-card {
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="id-card">
    <div class="id-header">
      <h2>${l.appName}</h2>
      <p>${l.title}</p>
    </div>
    <div class="id-content">
      <div class="id-left">
        <div class="id-photo">${lang === "ur" ? "تصویر" : lang === "hi" ? "फोटो" : "Photo"}</div>
        <div class="id-field">
          <div class="id-label">${l.rollNo}</div>
          <div class="id-value">${student.studentId}</div>
        </div>
        <div class="id-field">
          <div class="id-label">${l.class}</div>
          <div class="id-value">${student.class} - ${student.section}</div>
        </div>
      </div>
      <div class="id-right">
        <div class="id-field">
          <div class="id-label">${l.name}</div>
          <div class="id-value">${name}</div>
        </div>
        <div class="id-field">
          <div class="id-label">${l.fatherName}</div>
          <div class="id-value">${fatherName}</div>
        </div>
        <div class="id-field">
          <div class="id-label">${l.dob}</div>
          <div class="id-value">${dob}</div>
        </div>
        <div class="id-field">
          <div class="id-label">${l.phone}</div>
          <div class="id-value">${student.phone}</div>
        </div>
      </div>
    </div>
    <div class="id-footer">
      <p>${l.footer}</p>
    </div>
  </div>
</body>
</html>
    `;
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold">{t("nav.printIdCard")}</h1>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">{t("cards.generateIdCard")}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rollNumber">{t("cards.rollNumber")}</Label>
              <div className="flex gap-2">
                <Input
                  id="rollNumber"
                  placeholder={t("cards.enterRollNumber")}
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-1"
                />
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4 mr-2" />
                  {t("common.search")}
                </Button>
              </div>
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
            </div>

            {student && (
              <div className="mt-6 space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">{t("cards.studentFound")}:</h3>
                  <p><strong>{t("cards.name")}:</strong> {student.name[language] || student.name.en}</p>
                  <p><strong>{t("cards.rollNo")}:</strong> {student.studentId}</p>
                  <p><strong>{t("student.class")}:</strong> {student.class} - {student.section}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button onClick={handleDownload} className="w-full sm:w-auto">
                    <Download className="h-4 w-4 mr-2" />
                    {t("cards.printIdCard")}
                  </Button>
                  <Button onClick={handleDownloadPDF} variant="outline" className="w-full sm:w-auto">
                    <Download className="h-4 w-4 mr-2" />
                    {t("cards.downloadPdf")}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
