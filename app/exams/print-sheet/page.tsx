"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Download, Search, Filter, X, Printer } from "lucide-react";
import { useLanguageStore } from "@/store/language-store";
import { extendedDummyStudents } from "@/data/dummy-data";
import type { DummyStudent } from "@/data/dummy-students";

type Student = DummyStudent;

export default function ExamSheetPrintPage() {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const [rollNumber, setRollNumber] = useState("");
  const [student, setStudent] = useState<Student | null>(null);
  const [error, setError] = useState("");
  const [sheetLanguage, setSheetLanguage] = useState<"en" | "hi" | "ur">(language);
  const [examName, setExamName] = useState("");
  const [examDate, setExamDate] = useState<Date | undefined>(new Date());

  // Bulk print states
  const [showBulkPrint, setShowBulkPrint] = useState(false);
  const [filterClass, setFilterClass] = useState("");
  const [filterSection, setFilterSection] = useState("");

  // Get unique classes and sections
  const uniqueClasses = useMemo(() => {
    const classes = new Set(extendedDummyStudents.map(s => s.class));
    return Array.from(classes).sort();
  }, []);

  const uniqueSections = useMemo(() => {
    const sections = new Set(extendedDummyStudents.map(s => s.section));
    return Array.from(sections).sort();
  }, []);

  // Filter students for bulk print
  const filteredStudents = useMemo(() => {
    let filtered = extendedDummyStudents;

    if (filterClass) {
      filtered = filtered.filter(s => s.class === filterClass);
    }

    if (filterSection) {
      filtered = filtered.filter(s => s.section === filterSection);
    }

    return filtered;
  }, [filterClass, filterSection]);

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

  const generateSheetHtml = (student: Student, lang: "en" | "hi" | "ur") => {
    const getLabels = (lang: "en" | "hi" | "ur") => ({
      en: {
        appName: "Nizam-e-Taleem",
        examSheet: "Examination Sheet",
        rollNumber: "Roll Number",
        name: "Name",
        fatherName: "Father's Name",
        class: "Class",
        section: "Section",
        examName: "Exam Name",
        date: "Date",
        subject: "Subject",
        question: "Question",
        marks: "Marks",
        total: "Total",
        signature: "Student's Signature",
        invigilator: "Invigilator's Signature"
      },
      hi: {
        appName: "निजाम-ए-तालीम",
        examSheet: "परीक्षा पत्र",
        rollNumber: "रोल नंबर",
        name: "नाम",
        fatherName: "पिता का नाम",
        class: "कक्षा",
        section: "अनुभाग",
        examName: "परीक्षा का नाम",
        date: "तारीख",
        subject: "विषय",
        question: "प्रश्न",
        marks: "अंक",
        total: "कुल",
        signature: "छात्र के हस्ताक्षर",
        invigilator: "निरीक्षक के हस्ताक्षर"
      },
      ur: {
        appName: "نظام تعلیم",
        examSheet: "امتحانی شیٹ",
        rollNumber: "رول نمبر",
        name: "نام",
        fatherName: "والد کا نام",
        class: "درجہ",
        section: "سیکشن",
        examName: "امتحان کا نام",
        date: "تاریخ",
        subject: "مضمون",
        question: "سوال",
        marks: "نمبرات",
        total: "کل",
        signature: "طالب علم کے دستخط",
        invigilator: "نگران کے دستخط"
      }
    })[lang];

    const l = getLabels(lang);
    const studentName = student.name[lang] || student.name.en;
    const fatherName = student.fatherName[lang] || student.fatherName.en;
    const examDateStr = examDate ? new Date(examDate).toLocaleDateString(lang === "ur" ? "ar-SA" : lang === "hi" ? "hi-IN" : "en-US") : "";

    const sheetStyle = `
      .sheet-container {
        width: 210mm;
        min-height: 297mm;
        margin: 0 auto;
        padding: 20mm;
        background: white;
        font-family: 'Arial', sans-serif;
        ${lang === "ur" ? "direction: rtl; text-align: right;" : "direction: ltr; text-align: left;"}
      }
      .header {
        text-align: center;
        border-bottom: 3px solid #000;
        padding-bottom: 10px;
        margin-bottom: 20px;
      }
      .header h1 {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 5px;
      }
      .header h2 {
        font-size: 18px;
        font-weight: normal;
      }
      .student-info {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        margin-bottom: 30px;
        padding: 15px;
        border: 1px solid #ccc;
        border-radius: 5px;
      }
      .info-item {
        display: flex;
        ${lang === "ur" ? "flex-direction: row-reverse;" : ""}
        gap: 10px;
      }
      .info-label {
        font-weight: bold;
        min-width: 100px;
      }
      .info-value {
        flex: 1;
        border-bottom: 1px solid #000;
        padding-bottom: 2px;
      }
      .questions-section {
        margin-top: 30px;
      }
      .question-row {
        display: flex;
        ${lang === "ur" ? "flex-direction: row-reverse;" : ""}
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        border-bottom: 1px solid #ddd;
        margin-bottom: 10px;
      }
      .question-number {
        font-weight: bold;
        min-width: 50px;
      }
      .question-space {
        flex: 1;
        min-height: 100px;
        border: 1px solid #ccc;
        margin: 0 20px;
        padding: 10px;
      }
      .question-marks {
        min-width: 60px;
        text-align: center;
        font-weight: bold;
      }
      .footer {
        margin-top: 50px;
        display: flex;
        justify-content: space-between;
        ${lang === "ur" ? "flex-direction: row-reverse;" : ""}
      }
      .signature-box {
        text-align: center;
        width: 200px;
      }
      .signature-line {
        border-top: 1px solid #000;
        margin-top: 50px;
        margin-bottom: 5px;
      }
      @media print {
        .sheet-container {
          margin: 0;
          padding: 15mm;
        }
        .question-space {
          min-height: 80px;
        }
      }
    `;

    return `
<!DOCTYPE html>
<html dir="${lang === "ur" ? "rtl" : "ltr"}" lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${l.examSheet} - ${studentName}</title>
  <style>${sheetStyle}</style>
</head>
<body>
  <div class="sheet-container">
    <div class="header">
      <h1>${l.appName}</h1>
      <h2>${l.examSheet}</h2>
    </div>

    <div class="student-info">
      <div class="info-item">
        <span class="info-label">${l.rollNumber}:</span>
        <span class="info-value">${student.studentId}</span>
      </div>
      <div class="info-item">
        <span class="info-label">${l.name}:</span>
        <span class="info-value">${studentName}</span>
      </div>
      <div class="info-item">
        <span class="info-label">${l.fatherName}:</span>
        <span class="info-value">${fatherName}</span>
      </div>
      <div class="info-item">
        <span class="info-label">${l.class}:</span>
        <span class="info-value">${student.class} - ${student.section}</span>
      </div>
      <div class="info-item">
        <span class="info-label">${l.examName}:</span>
        <span class="info-value">${examName || "________________"}</span>
      </div>
      <div class="info-item">
        <span class="info-label">${l.date}:</span>
        <span class="info-value">${examDateStr}</span>
      </div>
    </div>

    <div class="questions-section">
      <h3 style="margin-bottom: 20px; font-size: 16px;">${l.question}s:</h3>
      ${Array.from({ length: 10 }, (_, i) => `
        <div class="question-row">
          <div class="question-number">Q${i + 1}</div>
          <div class="question-space"></div>
          <div class="question-marks">[${l.marks}]</div>
        </div>
      `).join("")}
    </div>

    <div class="footer">
      <div class="signature-box">
        <div class="signature-line"></div>
        <p>${l.signature}</p>
      </div>
      <div class="signature-box">
        <div class="signature-line"></div>
        <p>${l.invigilator}</p>
      </div>
    </div>
  </div>
</body>
</html>
    `;
  };

  const handlePrint = (studentsToPrint: Student[]) => {
    if (studentsToPrint.length === 0) {
      alert(t("cards.noStudentsFound") || "No students found to print.");
      return;
    }

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      let allSheetsHtml = `
        <!DOCTYPE html>
        <html dir="${sheetLanguage === "ur" ? "rtl" : "ltr"}" lang="${sheetLanguage}">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${t("exams.examSheet") || "Exam Sheets"}</title>
          <style>
            @page { size: A4; margin: 0; }
            body { margin: 0; padding: 0; }
            .page-break { page-break-after: always; }
          </style>
        </head>
        <body>
      `;

      studentsToPrint.forEach((student, index) => {
        allSheetsHtml += generateSheetHtml(student, sheetLanguage);
        if (index < studentsToPrint.length - 1) {
          allSheetsHtml += '<div class="page-break"></div>';
        }
      });

      allSheetsHtml += `
        </body>
        </html>
      `;

      printWindow.document.write(allSheetsHtml);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold">{t("exams.examSheet") || "Exam Sheet Print"}</h1>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">{t("exams.generateExamSheet") || "Generate Exam Sheet"}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("exams.selectLanguage") || "Select Language"}</Label>
                <Select value={sheetLanguage} onValueChange={(value: "en" | "hi" | "ur") => setSheetLanguage(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">{t("common.english")}</SelectItem>
                    <SelectItem value="hi">{t("common.hindi")}</SelectItem>
                    <SelectItem value="ur">{t("common.urdu")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="examName">{t("exams.examName") || "Exam Name"}</Label>
                <Input
                  id="examName"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  placeholder={t("exams.enterExamName") || "Enter exam name"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="examDate">{t("exams.examDate") || "Exam Date"}</Label>
                <DatePicker
                  date={examDate}
                  onDateChange={setExamDate}
                />
              </div>
            </div>

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
                <Button onClick={() => handlePrint([student])} className="w-full">
                  <Printer className="h-4 w-4 mr-2" />
                  {t("exams.printSheet") || "Print Sheet"}
                </Button>
              </div>
            )}

            <Button
              variant="outline"
              onClick={() => setShowBulkPrint(!showBulkPrint)}
              className="w-full mt-4"
            >
              {showBulkPrint ? (
                <>
                  <X className="h-4 w-4 mr-2" />
                  {t("exams.hideBulkPrint") || "Hide Bulk Print"}
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  {t("exams.bulkPrint") || "Bulk Print"}
                </>
              )}
            </Button>

            {showBulkPrint && (
              <div className="mt-4 space-y-4 border-t pt-4">
                <h3 className="text-lg font-semibold">{t("exams.bulkPrint")}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bulk-class">{t("student.class")}</Label>
                    <Select value={filterClass || "all"} onValueChange={(value) => setFilterClass(value === "all" ? "" : value)}>
                      <SelectTrigger id="bulk-class">
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
                    <Label htmlFor="bulk-section">{t("student.section")}</Label>
                    <Select value={filterSection || "all"} onValueChange={(value) => setFilterSection(value === "all" ? "" : value)}>
                      <SelectTrigger id="bulk-section">
                        <SelectValue placeholder={t("common.allSections")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("common.allSections")}</SelectItem>
                        {uniqueSections.map((sec) => (
                          <SelectItem key={sec} value={sec}>{sec}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm">
                    <strong>{t("cards.studentsFound")}:</strong> {filteredStudents.length}
                  </p>
                </div>
                <Button onClick={() => handlePrint(filteredStudents)} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  {t("exams.printAll") || "Print All Sheets"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

