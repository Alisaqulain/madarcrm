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

interface ExamResult {
  studentId: string;
  studentName: string;
  fatherName: string;
  class: string;
  section: string;
  subjects: {
    name: string;
    marksObtained: number;
    totalMarks: number;
    grade: string;
  }[];
  totalMarks: number;
  percentage: number;
  overallGrade: string;
  rank: number;
}

// Generate dummy exam results
const generateExamResult = (student: DummyStudent, lang: "en" | "hi" | "ur"): ExamResult => {
  const subjects = [
    { name: lang === "en" ? "Quran" : lang === "hi" ? "कुरान" : "قرآن", total: 100 },
    { name: lang === "en" ? "Hadith" : lang === "hi" ? "हदीस" : "حدیث", total: 100 },
    { name: lang === "en" ? "Arabic" : lang === "hi" ? "अरबी" : "عربی", total: 100 },
    { name: lang === "en" ? "Urdu" : lang === "hi" ? "उर्दू" : "اردو", total: 100 },
    { name: lang === "en" ? "Mathematics" : lang === "hi" ? "गणित" : "ریاضی", total: 100 },
    { name: lang === "en" ? "Science" : lang === "hi" ? "विज्ञान" : "سائنس", total: 100 },
  ];

  const subjectsWithMarks = subjects.map((subject) => {
    const marks = Math.floor(Math.random() * 30) + 70; // Random marks between 70-100
    let grade = "A+";
    if (marks < 90) grade = "A";
    if (marks < 80) grade = "B+";
    if (marks < 70) grade = "B";
    
    return {
      name: subject.name,
      marksObtained: marks,
      totalMarks: subject.total,
      grade,
    };
  });

  const totalMarks = subjectsWithMarks.reduce((sum, s) => sum + s.marksObtained, 0);
  const percentage = (totalMarks / (subjects.length * 100)) * 100;
  
  let overallGrade = "A+";
  if (percentage < 90) overallGrade = "A";
  if (percentage < 80) overallGrade = "B+";
  if (percentage < 70) overallGrade = "B";
  if (percentage < 60) overallGrade = "C";

  return {
    studentId: student.studentId,
    studentName: student.name[lang] || student.name.en,
    fatherName: student.fatherName[lang] || student.fatherName.en,
    class: student.class,
    section: student.section,
    subjects: subjectsWithMarks,
    totalMarks,
    percentage: Math.round(percentage * 100) / 100,
    overallGrade,
    rank: Math.floor(Math.random() * 20) + 1,
  };
};

export default function ExamsPage() {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const [rollNumber, setRollNumber] = useState("");
  const [result, setResult] = useState<ExamResult | null>(null);
  const [error, setError] = useState("");

  const handleSearch = () => {
    setError("");
    setResult(null);
    
    if (!rollNumber.trim()) {
      setError(t("cards.pleaseEnterRollNumber"));
      return;
    }

    const found = extendedDummyStudents.find(
      (s) => s.studentId.toLowerCase() === rollNumber.trim().toLowerCase()
    );

    if (found) {
      const examResult = generateExamResult(found, language);
      setResult(examResult);
    } else {
      setError(t("cards.studentNotFound"));
    }
  };

  const handleDownload = () => {
    if (!result) return;

    const resultHtml = generateResultHtml(result, language);
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(resultHtml);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  const generateResultHtml = (result: ExamResult, lang: "en" | "hi" | "ur") => {
    const currentDate = new Date().toLocaleDateString();
    const academicYear = "2024-25";
    
    const labels = {
      en: {
        appName: "Nizam-e-Taleem",
        title: "Examination Result",
        studentName: "Student Name",
        fatherName: "Father's Name",
        class: "Class",
        section: "Section",
        rollNo: "Roll Number",
        subject: "Subject",
        marks: "Marks",
        grade: "Grade",
        total: "Total",
        percentage: "Percentage",
        overallGrade: "Overall Grade",
        rank: "Rank",
        date: "Date",
        academicYear: "Academic Year",
        signature: "Principal's Signature",
      },
      hi: {
        appName: "निजाम-ए-तालीम",
        title: "परीक्षा परिणाम",
        studentName: "छात्र का नाम",
        fatherName: "पिता का नाम",
        class: "कक्षा",
        section: "अनुभाग",
        rollNo: "रोल नंबर",
        subject: "विषय",
        marks: "अंक",
        grade: "ग्रेड",
        total: "कुल",
        percentage: "प्रतिशत",
        overallGrade: "समग्र ग्रेड",
        rank: "रैंक",
        date: "तारीख",
        academicYear: "शैक्षणिक वर्ष",
        signature: "प्रधानाचार्य के हस्ताक्षर",
      },
      ur: {
        appName: "نظام تعلیم",
        title: "امتحانی نتیجہ",
        studentName: "نام طالب علم",
        fatherName: "والد کا نام",
        class: "درجہ",
        section: "سیکشن",
        rollNo: "رول نمبر",
        subject: "مضمون",
        marks: "نمبرات",
        grade: "گریڈ",
        total: "کل",
        percentage: "فیصد",
        overallGrade: "مجموعی گریڈ",
        rank: "درجہ",
        date: "تاریخ",
        academicYear: "تعلیمی سال",
        signature: "پرنسپل کے دستخط",
      },
    };

    const l = labels[lang];

    return `
<!DOCTYPE html>
<html dir="${lang === "ur" ? "rtl" : "ltr"}" lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${l.title} - ${result.studentName}</title>
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
    .result-card {
      max-width: 800px;
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
    .header h2 {
      color: #333;
      font-size: 20px;
      font-weight: normal;
    }
    .student-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 30px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    .info-item {
      display: flex;
      justify-content: space-between;
    }
    .info-label {
      font-weight: bold;
      color: #666;
    }
    .info-value {
      color: #333;
    }
    .table-container {
      margin-bottom: 30px;
      overflow-x: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th {
      background: #667eea;
      color: white;
      padding: 12px;
      text-align: ${lang === "ur" ? "right" : "left"};
    }
    td {
      padding: 10px 12px;
      border-bottom: 1px solid #ddd;
      text-align: ${lang === "ur" ? "right" : "left"};
    }
    tr:hover {
      background: #f8f9fa;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      margin-bottom: 30px;
    }
    .summary-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }
    .summary-label {
      font-size: 12px;
      opacity: 0.9;
      margin-bottom: 5px;
    }
    .summary-value {
      font-size: 24px;
      font-weight: bold;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #ddd;
    }
    .signature {
      text-align: center;
    }
    .signature-line {
      border-top: 2px solid #333;
      width: 200px;
      margin: 50px auto 10px;
    }
    @media print {
      body {
        background: white;
        padding: 0;
      }
      .result-card {
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="result-card">
    <div class="header">
      <h1>${l.appName}</h1>
      <h2>${l.title}</h2>
    </div>
    
    <div class="student-info">
      <div class="info-item">
        <span class="info-label">${l.studentName}:</span>
        <span class="info-value">${result.studentName}</span>
      </div>
      <div class="info-item">
        <span class="info-label">${l.fatherName}:</span>
        <span class="info-value">${result.fatherName}</span>
      </div>
      <div class="info-item">
        <span class="info-label">${l.rollNo}:</span>
        <span class="info-value">${result.studentId}</span>
      </div>
      <div class="info-item">
        <span class="info-label">${l.class}:</span>
        <span class="info-value">${result.class} - ${result.section}</span>
      </div>
      <div class="info-item">
        <span class="info-label">${l.academicYear}:</span>
        <span class="info-value">${academicYear}</span>
      </div>
      <div class="info-item">
        <span class="info-label">${l.date}:</span>
        <span class="info-value">${currentDate}</span>
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>${l.subject}</th>
            <th>${l.marks}</th>
            <th>${l.grade}</th>
          </tr>
        </thead>
        <tbody>
          ${result.subjects.map(
            (subject) => `
            <tr>
              <td>${subject.name}</td>
              <td>${subject.marksObtained} / ${subject.totalMarks}</td>
              <td><strong>${subject.grade}</strong></td>
            </tr>
          `
          ).join("")}
        </tbody>
      </table>
    </div>

    <div class="summary">
      <div class="summary-card">
        <div class="summary-label">${l.total}</div>
        <div class="summary-value">${result.totalMarks}</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">${l.percentage}</div>
        <div class="summary-value">${result.percentage}%</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">${l.overallGrade}</div>
        <div class="summary-value">${result.overallGrade}</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">${l.rank}</div>
        <div class="summary-value">#${result.rank}</div>
      </div>
    </div>

    <div class="footer">
      <div>
        <p><strong>${l.date}:</strong> ${currentDate}</p>
      </div>
      <div class="signature">
        <div class="signature-line"></div>
        <p><strong>${l.signature}</strong></p>
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
        <h1 className="text-2xl sm:text-3xl font-bold">{t("nav.examsResults")}</h1>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Generate Exam Result</CardTitle>
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

            {result && (
              <div className="mt-6 space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">{t("nav.examsResults")}:</h3>
                  <p><strong>{t("cards.name")}:</strong> {result.studentName}</p>
                  <p><strong>{t("cards.rollNo")}:</strong> {result.studentId}</p>
                  <p><strong>{t("student.class")}:</strong> {result.class} - {result.section}</p>
                  <p><strong>Total Marks:</strong> {result.totalMarks}</p>
                  <p><strong>Percentage:</strong> {result.percentage}%</p>
                  <p><strong>Grade:</strong> {result.overallGrade}</p>
                  <p><strong>Rank:</strong> #{result.rank}</p>
                </div>
                <Button onClick={handleDownload} className="w-full sm:w-auto">
                  <Download className="h-4 w-4 mr-2" />
                  {t("cards.downloadPdf")} & {t("general.printList")}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
