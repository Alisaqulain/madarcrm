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

export default function ExamSignaturePrintPage() {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const [rollNumber, setRollNumber] = useState("");
  const [student, setStudent] = useState<Student | null>(null);
  const [error, setError] = useState("");
  const [signatureLanguage, setSignatureLanguage] = useState<"en" | "hi" | "ur">(language);
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

  const generateSignatureHtml = (student: Student, lang: "en" | "hi" | "ur") => {
    const getLabels = (lang: "en" | "hi" | "ur") => ({
      en: {
        appName: "Nizam-e-Taleem",
        signatureSlip: "Examination Signature Slip",
        rollNumber: "Roll Number",
        name: "Name",
        fatherName: "Father's Name",
        class: "Class",
        section: "Section",
        examName: "Exam Name",
        date: "Date",
        studentSignature: "Student's Signature",
        parentSignature: "Parent's/Guardian's Signature",
        principalSignature: "Principal's Signature",
        note: "Note: This slip must be signed and submitted before the examination."
      },
      hi: {
        appName: "निजाम-ए-तालीम",
        signatureSlip: "परीक्षा हस्ताक्षर पर्ची",
        rollNumber: "रोल नंबर",
        name: "नाम",
        fatherName: "पिता का नाम",
        class: "कक्षा",
        section: "अनुभाग",
        examName: "परीक्षा का नाम",
        date: "तारीख",
        studentSignature: "छात्र के हस्ताक्षर",
        parentSignature: "अभिभावक/संरक्षक के हस्ताक्षर",
        principalSignature: "प्रधानाचार्य के हस्ताक्षर",
        note: "नोट: यह पर्ची परीक्षा से पहले हस्ताक्षरित और जमा की जानी चाहिए।"
      },
      ur: {
        appName: "نظام تعلیم",
        signatureSlip: "امتحانی دستخط کی پرس",
        rollNumber: "رول نمبر",
        name: "نام",
        fatherName: "والد کا نام",
        class: "درجہ",
        section: "سیکشن",
        examName: "امتحان کا نام",
        date: "تاریخ",
        studentSignature: "طالب علم کے دستخط",
        parentSignature: "والدین/سرپرست کے دستخط",
        principalSignature: "پرنسپل کے دستخط",
        note: "نوٹ: یہ پرس امتحان سے پہلے دستخط کی جانی چاہیے اور جمع کرانی چاہیے۔"
      }
    })[lang];

    const l = getLabels(lang);
    const studentName = student.name[lang] || student.name.en;
    const fatherName = student.fatherName[lang] || student.fatherName.en;
    const examDateStr = examDate ? new Date(examDate).toLocaleDateString(lang === "ur" ? "ar-SA" : lang === "hi" ? "hi-IN" : "en-US") : "";

    const signatureStyle = `
      .signature-container {
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
        margin-bottom: 30px;
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
        margin-bottom: 40px;
        padding: 20px;
        border: 2px solid #000;
        border-radius: 5px;
      }
      .info-row {
        display: flex;
        ${lang === "ur" ? "flex-direction: row-reverse;" : ""}
        justify-content: space-between;
        padding: 10px 0;
        border-bottom: 1px solid #ddd;
      }
      .info-row:last-child {
        border-bottom: none;
      }
      .info-label {
        font-weight: bold;
        min-width: 150px;
      }
      .info-value {
        flex: 1;
        text-align: ${lang === "ur" ? "right" : "left"};
      }
      .signatures-section {
        margin-top: 50px;
      }
      .signature-box {
        margin-bottom: 40px;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 5px;
      }
      .signature-label {
        font-weight: bold;
        margin-bottom: 10px;
        font-size: 14px;
      }
      .signature-line {
        border-top: 2px solid #000;
        margin-top: 60px;
        margin-bottom: 5px;
      }
      .signature-name {
        text-align: center;
        font-size: 12px;
        color: #666;
      }
      .note {
        margin-top: 30px;
        padding: 15px;
        background: #f0f0f0;
        border-left: 4px solid #000;
        ${lang === "ur" ? "border-right: 4px solid #000; border-left: none;" : ""}
        font-size: 12px;
        font-style: italic;
      }
      @media print {
        .signature-container {
          margin: 0;
          padding: 15mm;
        }
      }
    `;

    return `
<!DOCTYPE html>
<html dir="${lang === "ur" ? "rtl" : "ltr"}" lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${l.signatureSlip} - ${studentName}</title>
  <style>${signatureStyle}</style>
</head>
<body>
  <div class="signature-container">
    <div class="header">
      <h1>${l.appName}</h1>
      <h2>${l.signatureSlip}</h2>
    </div>

    <div class="student-info">
      <div class="info-row">
        <span class="info-label">${l.rollNumber}:</span>
        <span class="info-value">${student.studentId}</span>
      </div>
      <div class="info-row">
        <span class="info-label">${l.name}:</span>
        <span class="info-value">${studentName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">${l.fatherName}:</span>
        <span class="info-value">${fatherName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">${l.class}:</span>
        <span class="info-value">${student.class} - ${student.section}</span>
      </div>
      <div class="info-row">
        <span class="info-label">${l.examName}:</span>
        <span class="info-value">${examName || "________________"}</span>
      </div>
      <div class="info-row">
        <span class="info-label">${l.date}:</span>
        <span class="info-value">${examDateStr}</span>
      </div>
    </div>

    <div class="signatures-section">
      <div class="signature-box">
        <div class="signature-label">${l.studentSignature}</div>
        <div class="signature-line"></div>
        <div class="signature-name">${studentName}</div>
      </div>

      <div class="signature-box">
        <div class="signature-label">${l.parentSignature}</div>
        <div class="signature-line"></div>
        <div class="signature-name">${fatherName}</div>
      </div>

      <div class="signature-box">
        <div class="signature-label">${l.principalSignature}</div>
        <div class="signature-line"></div>
        <div class="signature-name"></div>
      </div>
    </div>

    <div class="note">
      ${l.note}
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
      let allSignaturesHtml = `
        <!DOCTYPE html>
        <html dir="${signatureLanguage === "ur" ? "rtl" : "ltr"}" lang="${signatureLanguage}">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${t("exams.signatureSlip") || "Signature Slips"}</title>
          <style>
            @page { size: A4; margin: 0; }
            body { margin: 0; padding: 0; }
            .page-break { page-break-after: always; }
          </style>
        </head>
        <body>
      `;

      studentsToPrint.forEach((student, index) => {
        allSignaturesHtml += generateSignatureHtml(student, signatureLanguage);
        if (index < studentsToPrint.length - 1) {
          allSignaturesHtml += '<div class="page-break"></div>';
        }
      });

      allSignaturesHtml += `
        </body>
        </html>
      `;

      printWindow.document.write(allSignaturesHtml);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold">{t("exams.signatureSlip") || "Exam Signature Slip Print"}</h1>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">{t("exams.generateSignatureSlip") || "Generate Signature Slip"}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("exams.selectLanguage") || "Select Language"}</Label>
                <Select value={signatureLanguage} onValueChange={(value: "en" | "hi" | "ur") => setSignatureLanguage(value)}>
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
                  {t("exams.printSignatureSlip") || "Print Signature Slip"}
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
                  {t("exams.printAll") || "Print All Signature Slips"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

