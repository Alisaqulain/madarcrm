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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Save, Plus, CheckCircle, XCircle, FileText, Printer } from "lucide-react";
import { useLanguageStore } from "@/store/language-store";
import { extendedDummyStudents, dummyBooks } from "@/data/dummy-data";
import type { DummyStudent } from "@/data/dummy-students";

type Student = DummyStudent;

interface StudentMarks {
  studentId: string;
  studentName: string;
  rollNo: string;
  marks: number[];
  totalMarks: number;
  percentage: number;
  grade: string;
  status: "Pass" | "Fail";
}

interface ExamResult {
  examName: string;
  examDate: Date;
  className: string;
  examBook: string;
  numberOfPapers: number;
  marksPerPaper: number;
  passingMarks: number;
  students: StudentMarks[];
}

export default function ExamsPage() {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const [activeTab, setActiveTab] = useState<"entry" | "print">("entry");
  
  // Exam configuration
  const [className, setClassName] = useState("");
  const [examDate, setExamDate] = useState<Date | undefined>(new Date());
  const [examBook, setExamBook] = useState("");
  const [numberOfPapers, setNumberOfPapers] = useState("1");
  const [marksPerPaper, setMarksPerPaper] = useState("100");
  const [passingMarks, setPassingMarks] = useState("33");
  
  // Student marks
  const [studentMarks, setStudentMarks] = useState<Record<string, number[]>>({});
  const [examResults, setExamResults] = useState<ExamResult | null>(null);

  // Get unique classes
  const uniqueClasses = useMemo(() => {
    const classes = new Set(extendedDummyStudents.map(s => s.class));
    return Array.from(classes).sort();
  }, []);

  // Get books for exam selection
  const examBooks = useMemo(() => {
    return dummyBooks.map(book => ({
      id: book.id,
      name: language === "hi" ? book.bookNameHi : language === "ur" ? book.bookNameUr : book.bookName,
      class: book.class,
    }));
  }, [language]);

  // Filter students by class
  const classStudents = useMemo(() => {
    if (!className) return [];
    return extendedDummyStudents
      .filter(s => s.class === className)
      .map(s => ({
        id: s.studentId,
        name: s.name[language] || s.name.en,
        rollNo: s.studentId,
        class: s.class,
        section: s.section,
      }));
  }, [className, language]);

  // Initialize marks for students when class or number of papers changes
  useMemo(() => {
    if (classStudents.length > 0 && numberOfPapers) {
      const numPapers = parseInt(numberOfPapers) || 1;
      const newMarks: Record<string, number[]> = {};
      classStudents.forEach(student => {
        if (!studentMarks[student.id]) {
          newMarks[student.id] = Array(numPapers).fill(0);
        } else {
          // Adjust array length if number of papers changed
          const currentMarks = studentMarks[student.id];
          if (currentMarks.length !== numPapers) {
            newMarks[student.id] = Array(numPapers).fill(0).map((_, i) => 
              currentMarks[i] || 0
            );
          }
        }
      });
      if (Object.keys(newMarks).length > 0) {
        setStudentMarks(prev => ({ ...prev, ...newMarks }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classStudents, numberOfPapers]);

  // Calculate results
  const calculateResults = (): ExamResult | null => {
    if (!className || !examDate || !examBook || !numberOfPapers || classStudents.length === 0) {
      return null;
    }

    const numPapers = parseInt(numberOfPapers) || 1;
    const marksPer = parseInt(marksPerPaper) || 100;
    const passing = parseInt(passingMarks) || 33;

    const students: StudentMarks[] = classStudents.map(student => {
      const marks = studentMarks[student.id] || Array(numPapers).fill(0);
      const totalMarks = marks.reduce((sum, m) => sum + m, 0);
      const maxMarks = numPapers * marksPer;
      const percentage = maxMarks > 0 ? (totalMarks / maxMarks) * 100 : 0;
      
      // Calculate grade
      let grade = "F";
      if (percentage >= 90) grade = "A+";
      else if (percentage >= 80) grade = "A";
      else if (percentage >= 70) grade = "B+";
      else if (percentage >= 60) grade = "B";
      else if (percentage >= 50) grade = "C";
      else if (percentage >= 40) grade = "D";
      else if (percentage >= passing) grade = "E";

      const status: "Pass" | "Fail" = totalMarks >= (numPapers * passing) ? "Pass" : "Fail";

      return {
        studentId: student.id,
        studentName: student.name,
        rollNo: student.rollNo,
        marks: [...marks],
        totalMarks,
        percentage: Math.round(percentage * 100) / 100,
        grade,
        status,
      };
    });

    // Sort by total marks (descending) for ranking
    students.sort((a, b) => b.totalMarks - a.totalMarks);
    students.forEach((student, index) => {
      (student as any).rank = index + 1;
    });

    const selectedBook = examBooks.find(b => String(b.id) === examBook);
    const bookName = selectedBook?.name || examBook;

    return {
      examName: bookName,
      examDate: examDate,
      className,
      examBook: bookName,
      numberOfPapers: numPapers,
      marksPerPaper: marksPer,
      passingMarks: passing,
      students,
    };
  };

  const handleMarksChange = (studentId: string, paperIndex: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    setStudentMarks(prev => {
      const current = prev[studentId] || Array(parseInt(numberOfPapers) || 1).fill(0);
      const updated = [...current];
      updated[paperIndex] = Math.max(0, Math.min(numValue, parseFloat(marksPerPaper) || 100));
      return { ...prev, [studentId]: updated };
    });
  };

  const handleGenerateResults = () => {
    if (!className) {
      alert(t("exams.pleaseSelectClass") || "Please select a class");
      return;
    }
    if (!examDate) {
      alert(t("exams.pleaseSelectExamDate") || "Please select exam date");
      return;
    }
    if (!examBook) {
      alert(t("exams.pleaseSelectExamBook") || "Please select exam book");
      return;
    }
    
    const results = calculateResults();
    if (results) {
      setExamResults(results);
    }
  };

  const handleSaveResults = () => {
    if (!examResults) return;
    alert(t("exams.resultsSaved") || "Exam results saved successfully!");
    // Here you would save to database
  };

  const generateResultHtml = (result: ExamResult, lang: "en" | "hi" | "ur") => {
    const labels = {
      en: {
        appName: "Nizam-e-Taleem",
        title: "Examination Result",
        examName: "Exam Name",
        examDate: "Exam Date",
        className: "Class",
        rollNo: "Roll No",
        studentName: "Student Name",
        paper: "Paper",
        marks: "Marks",
        total: "Total",
        percentage: "Percentage",
        grade: "Grade",
        status: "Status",
        rank: "Rank",
        pass: "Pass",
        fail: "Fail",
        signature: "Principal's Signature",
      },
      hi: {
        appName: "निजाम-ए-तालीम",
        title: "परीक्षा परिणाम",
        examName: "परीक्षा का नाम",
        examDate: "परीक्षा की तारीख",
        className: "कक्षा",
        rollNo: "रोल नंबर",
        studentName: "छात्र का नाम",
        paper: "पेपर",
        marks: "अंक",
        total: "कुल",
        percentage: "प्रतिशत",
        grade: "ग्रेड",
        status: "स्थिति",
        rank: "रैंक",
        pass: "उत्तीर्ण",
        fail: "अनुत्तीर्ण",
        signature: "प्रधानाचार्य के हस्ताक्षर",
      },
      ur: {
        appName: "نظام تعلیم",
        title: "امتحانی نتیجہ",
        examName: "امتحان کا نام",
        examDate: "امتحان کی تاریخ",
        className: "درجہ",
        rollNo: "رول نمبر",
        studentName: "طالب علم کا نام",
        paper: "پیپر",
        marks: "نمبرات",
        total: "کل",
        percentage: "فیصد",
        grade: "گریڈ",
        status: "حالت",
        rank: "درجہ",
        pass: "پاس",
        fail: "فیل",
        signature: "پرنسپل کے دستخط",
      },
    }[lang];

    const l = labels;
    const dateStr = result.examDate.toLocaleDateString(lang === "ur" ? "ar-SA" : lang === "hi" ? "hi-IN" : "en-US");

    return `
<!DOCTYPE html>
<html dir="${lang === "ur" ? "rtl" : "ltr"}" lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${l.title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
      background: #f5f5f5;
    }
    .result-card {
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
    .header h2 {
      color: #333;
      font-size: 20px;
      font-weight: normal;
    }
    .exam-info {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin-bottom: 30px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    .info-item {
      display: flex;
      flex-direction: column;
      ${lang === "ur" ? "text-align: right;" : "text-align: left;"}
    }
    .info-label {
      font-weight: bold;
      color: #666;
      font-size: 12px;
      margin-bottom: 5px;
    }
    .info-value {
      color: #333;
      font-size: 16px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th {
      background: #667eea;
      color: white;
      padding: 12px 8px;
      text-align: ${lang === "ur" ? "right" : "left"};
      font-size: 12px;
      border: 1px solid #ddd;
    }
    td {
      padding: 10px 8px;
      border: 1px solid #ddd;
      text-align: ${lang === "ur" ? "right" : "left"};
      font-size: 12px;
    }
    tr:nth-child(even) {
      background: #f8f9fa;
    }
    .pass { color: #10b981; font-weight: bold; }
    .fail { color: #ef4444; font-weight: bold; }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #ddd;
      text-align: center;
    }
    .signature-line {
      border-top: 2px solid #333;
      width: 200px;
      margin: 50px auto 10px;
    }
    @media print {
      body { background: white; padding: 0; }
      .result-card { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="result-card">
    <div class="header">
      <h1>${l.appName}</h1>
      <h2>${l.title}</h2>
    </div>
    
    <div class="exam-info">
      <div class="info-item">
        <span class="info-label">${l.examName}</span>
        <span class="info-value">${result.examName}</span>
      </div>
      <div class="info-item">
        <span class="info-label">${l.examDate}</span>
        <span class="info-value">${dateStr}</span>
      </div>
      <div class="info-item">
        <span class="info-label">${l.className}</span>
        <span class="info-value">${result.className}</span>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>${l.rank}</th>
          <th>${l.rollNo}</th>
          <th>${l.studentName}</th>
          ${Array.from({ length: result.numberOfPapers }, (_, i) => 
            `<th>${l.paper} ${i + 1}</th>`
          ).join("")}
          <th>${l.total}</th>
          <th>${l.percentage}</th>
          <th>${l.grade}</th>
          <th>${l.status}</th>
        </tr>
      </thead>
      <tbody>
        ${result.students.map((student, idx) => `
          <tr>
            <td>#${(student as any).rank || idx + 1}</td>
            <td>${student.rollNo}</td>
            <td>${student.studentName}</td>
            ${student.marks.map(m => `<td>${m}</td>`).join("")}
            <td><strong>${student.totalMarks} / ${result.numberOfPapers * result.marksPerPaper}</strong></td>
            <td>${student.percentage}%</td>
            <td><strong>${student.grade}</strong></td>
            <td class="${student.status === "Pass" ? "pass" : "fail"}">${student.status === "Pass" ? l.pass : l.fail}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>

    <div class="footer">
      <div class="signature-line"></div>
      <p><strong>${l.signature}</strong></p>
    </div>
  </div>
</body>
</html>
    `;
  };

  const handlePrintResults = () => {
    if (!examResults) return;
    const resultHtml = generateResultHtml(examResults, language);
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(resultHtml);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  // Print Result States
  const [printRollNumber, setPrintRollNumber] = useState("");
  const [printResult, setPrintResult] = useState<ExamResult | null>(null);
  const [printError, setPrintError] = useState("");
  const [bulkPrintClass, setBulkPrintClass] = useState("");
  const [bulkPrintResults, setBulkPrintResults] = useState<ExamResult[]>([]);

  const handlePrintSearch = () => {
    setPrintError("");
    setPrintResult(null);
    
    if (!printRollNumber.trim()) {
      setPrintError(t("cards.pleaseEnterRollNumber"));
      return;
    }

    const found = extendedDummyStudents.find(
      (s) => s.studentId.toLowerCase() === printRollNumber.trim().toLowerCase()
    );

    if (found) {
      const sampleResult: ExamResult = {
        examName: "Sample Exam",
        examDate: new Date(),
        className: found.class,
        examBook: "Quran - Part 1",
        numberOfPapers: 1,
        marksPerPaper: 100,
        passingMarks: 33,
        students: [{
          studentId: found.studentId,
          studentName: found.name[language] || found.name.en,
          rollNo: found.studentId,
          marks: [85],
          totalMarks: 85,
          percentage: 85,
          grade: "A",
          status: "Pass",
        }],
      };
      setPrintResult(sampleResult);
    } else {
      setPrintError(t("cards.studentNotFound"));
    }
  };

  const handleBulkPrint = () => {
    if (!bulkPrintClass) {
      alert(t("exams.pleaseSelectClass") || "Please select a class");
      return;
    }

    const classStudents = extendedDummyStudents.filter(s => s.class === bulkPrintClass);
    if (classStudents.length === 0) {
      alert(t("exams.noStudentsInClass") || "No students found in this class");
      return;
    }

    const results: ExamResult[] = classStudents.map(student => {
      const marks = [Math.floor(Math.random() * 30) + 70];
      const totalMarks = marks.reduce((sum, m) => sum + m, 0);
      const percentage = totalMarks;
      
      let grade = "F";
      if (percentage >= 90) grade = "A+";
      else if (percentage >= 80) grade = "A";
      else if (percentage >= 70) grade = "B+";
      else if (percentage >= 60) grade = "B";
      else if (percentage >= 50) grade = "C";
      else if (percentage >= 40) grade = "D";
      else if (percentage >= 33) grade = "E";

      return {
        examName: "Sample Exam",
        examDate: new Date(),
        className: student.class,
        examBook: "Quran - Part 1",
        numberOfPapers: 1,
        marksPerPaper: 100,
        passingMarks: 33,
        students: [{
          studentId: student.studentId,
          studentName: student.name[language] || student.name.en,
          rollNo: student.studentId,
          marks: marks,
          totalMarks: totalMarks,
          percentage: percentage,
          grade: grade,
          status: totalMarks >= 33 ? "Pass" : "Fail",
        }],
      };
    });

    results.forEach(result => {
      result.students.sort((a, b) => b.totalMarks - a.totalMarks);
      result.students.forEach((student, idx) => {
        (student as any).rank = idx + 1;
      });
    });

    setBulkPrintResults(results);
  };

  const handlePrintSingleResult = (result: ExamResult) => {
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

  const handlePrintBulkResults = () => {
    if (bulkPrintResults.length === 0) {
      alert(t("exams.noResultsToPrint") || "No results to print");
      return;
    }

    let allResultsHtml = `
      <!DOCTYPE html>
      <html dir="${language === "ur" ? "rtl" : "ltr"}" lang="${language}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${t("exams.examResults")}</title>
        <style>
          @page { size: A4; margin: 0; }
          body { margin: 0; padding: 0; }
          .page-break { page-break-after: always; }
        </style>
      </head>
      <body>
    `;

    bulkPrintResults.forEach((result, index) => {
      allResultsHtml += generateResultHtml(result, language);
      if (index < bulkPrintResults.length - 1) {
        allResultsHtml += '<div class="page-break"></div>';
      }
    });

    allResultsHtml += `
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(allResultsHtml);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold">{t("exams.examResults") || "Exam Results"}</h1>

        {/* Tabs */}
        <div className="flex gap-2 border-b">
          <Button
            variant={activeTab === "entry" ? "default" : "ghost"}
            onClick={() => setActiveTab("entry")}
            className="rounded-b-none"
          >
            <FileText className="h-4 w-4 mr-2" />
            {t("exams.enterMarks") || "Enter Marks"}
          </Button>
          <Button
            variant={activeTab === "print" ? "default" : "ghost"}
            onClick={() => setActiveTab("print")}
            className="rounded-b-none"
          >
            <Printer className="h-4 w-4 mr-2" />
            {t("exams.printResults") || "Print Results"}
          </Button>
        </div>

        {/* Enter Marks Tab */}
        {activeTab === "entry" && (
          <>
        {/* Exam Configuration */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">{t("exams.examConfiguration") || "Exam Configuration"}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="className">{t("student.class")} <span className="text-red-500">*</span></Label>
                <Select value={className} onValueChange={setClassName}>
                  <SelectTrigger id="className">
                    <SelectValue placeholder={t("exams.selectClass") || "Select Class"} />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueClasses.map((cls) => (
                      <SelectItem key={cls} value={cls}>
                        {/^\d+$/.test(cls) ? `${t("student.class")} ${cls}` : cls}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="examDate">{t("exams.examDate")} <span className="text-red-500">*</span></Label>
                <DatePicker
                  date={examDate}
                  onDateChange={setExamDate}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="examBook">{t("exams.examBook") || "Exam Book/Subject"} <span className="text-red-500">*</span></Label>
                <Select value={examBook} onValueChange={setExamBook}>
                  <SelectTrigger id="examBook">
                    <SelectValue placeholder={t("exams.selectExamBook") || "Select Exam Book"} />
                  </SelectTrigger>
                  <SelectContent>
                    {examBooks.map((book) => (
                      <SelectItem key={book.id} value={String(book.id)}>
                        {book.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="numberOfPapers">{t("exams.numberOfPapers") || "Number of Papers"} <span className="text-red-500">*</span></Label>
                <Input
                  id="numberOfPapers"
                  type="number"
                  min="1"
                  max="10"
                  value={numberOfPapers}
                  onChange={(e) => setNumberOfPapers(e.target.value)}
                  placeholder="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="marksPerPaper">{t("exams.marksPerPaper") || "Marks per Paper"} <span className="text-red-500">*</span></Label>
                <Input
                  id="marksPerPaper"
                  type="number"
                  min="1"
                  value={marksPerPaper}
                  onChange={(e) => setMarksPerPaper(e.target.value)}
                  placeholder="100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="passingMarks">{t("exams.passingMarks") || "Passing Marks"} <span className="text-red-500">*</span></Label>
                <Input
                  id="passingMarks"
                  type="number"
                  min="0"
                  value={passingMarks}
                  onChange={(e) => setPassingMarks(e.target.value)}
                  placeholder="33"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Marks Entry */}
        {className && classStudents.length > 0 && (
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">{t("exams.enterMarks") || "Enter Marks"}</CardTitle>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm">{t("student.registrationNo")}</TableHead>
                      <TableHead className="text-xs sm:text-sm">{t("student.studentName")}</TableHead>
                      {Array.from({ length: parseInt(numberOfPapers) || 1 }, (_, i) => (
                        <TableHead key={i} className="text-xs sm:text-sm text-center">
                          {t("exams.paper") || "Paper"} {i + 1} ({marksPerPaper})
                        </TableHead>
                      ))}
                      <TableHead className="text-xs sm:text-sm text-center">{t("exams.total") || "Total"}</TableHead>
                      <TableHead className="text-xs sm:text-sm text-center">{t("exams.percentage") || "%"}</TableHead>
                      <TableHead className="text-xs sm:text-sm text-center">{t("exams.grade") || "Grade"}</TableHead>
                      <TableHead className="text-xs sm:text-sm text-center">{t("exams.status") || "Status"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classStudents.map((student) => {
                      const marks = studentMarks[student.id] || Array(parseInt(numberOfPapers) || 1).fill(0);
                      const totalMarks = marks.reduce((sum, m) => sum + m, 0);
                      const maxMarks = (parseInt(numberOfPapers) || 1) * (parseInt(marksPerPaper) || 100);
                      const percentage = maxMarks > 0 ? (totalMarks / maxMarks) * 100 : 0;
                      
                      let grade = "F";
                      if (percentage >= 90) grade = "A+";
                      else if (percentage >= 80) grade = "A";
                      else if (percentage >= 70) grade = "B+";
                      else if (percentage >= 60) grade = "B";
                      else if (percentage >= 50) grade = "C";
                      else if (percentage >= 40) grade = "D";
                      else if (percentage >= parseInt(passingMarks)) grade = "E";

                      const passing = parseInt(passingMarks) || 33;
                      const status = totalMarks >= ((parseInt(numberOfPapers) || 1) * passing) ? "Pass" : "Fail";

                      return (
                        <TableRow key={student.id}>
                          <TableCell className="text-xs sm:text-sm">{student.rollNo}</TableCell>
                          <TableCell className="text-xs sm:text-sm">{student.name}</TableCell>
                          {marks.map((mark, index) => (
                            <TableCell key={index} className="text-center">
                              <Input
                                type="number"
                                min="0"
                                max={marksPerPaper}
                                value={mark || ""}
                                onChange={(e) => handleMarksChange(student.id, index, e.target.value)}
                                className="w-20 text-center"
                              />
                            </TableCell>
                          ))}
                          <TableCell className="text-xs sm:text-sm text-center font-semibold">
                            {totalMarks} / {maxMarks}
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm text-center">
                            {Math.round(percentage * 100) / 100}%
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm text-center font-semibold">
                            {grade}
                          </TableCell>
                          <TableCell className="text-center">
                            {status === "Pass" ? (
                              <span className="inline-flex items-center text-green-600">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                {t("exams.pass") || "Pass"}
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-red-600">
                                <XCircle className="h-4 w-4 mr-1" />
                                {t("exams.fail") || "Fail"}
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        {className && classStudents.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={handleGenerateResults} className="flex-1">
              <Plus className="h-4 w-4 mr-2" />
              {t("exams.generateResults") || "Generate Results"}
            </Button>
            {examResults && (
              <>
                <Button onClick={handleSaveResults} variant="outline" className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  {t("exams.saveResults") || "Save Results"}
                </Button>
                <Button onClick={handlePrintResults} variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  {t("exams.printResults") || "Print Results"}
                </Button>
              </>
            )}
          </div>
        )}

        {/* Results Preview */}
        {examResults && (
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">{t("exams.resultsPreview") || "Results Preview"}</CardTitle>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm">{t("exams.rank") || "Rank"}</TableHead>
                      <TableHead className="text-xs sm:text-sm">{t("student.registrationNo")}</TableHead>
                      <TableHead className="text-xs sm:text-sm">{t("student.studentName")}</TableHead>
                      {Array.from({ length: examResults.numberOfPapers }, (_, i) => (
                        <TableHead key={i} className="text-xs sm:text-sm text-center">
                          {t("exams.paper") || "Paper"} {i + 1}
                        </TableHead>
                      ))}
                      <TableHead className="text-xs sm:text-sm text-center">{t("exams.total") || "Total"}</TableHead>
                      <TableHead className="text-xs sm:text-sm text-center">{t("exams.percentage") || "%"}</TableHead>
                      <TableHead className="text-xs sm:text-sm text-center">{t("exams.grade") || "Grade"}</TableHead>
                      <TableHead className="text-xs sm:text-sm text-center">{t("exams.status") || "Status"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {examResults.students.map((student, idx) => (
                      <TableRow key={student.studentId}>
                        <TableCell className="text-xs sm:text-sm">#{(student as any).rank || idx + 1}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{student.rollNo}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{student.studentName}</TableCell>
                        {student.marks.map((mark, i) => (
                          <TableCell key={i} className="text-xs sm:text-sm text-center">{mark}</TableCell>
                        ))}
                        <TableCell className="text-xs sm:text-sm text-center font-semibold">
                          {student.totalMarks} / {examResults.numberOfPapers * examResults.marksPerPaper}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm text-center">{student.percentage}%</TableCell>
                        <TableCell className="text-xs sm:text-sm text-center font-semibold">{student.grade}</TableCell>
                        <TableCell className="text-center">
                          {student.status === "Pass" ? (
                            <span className="inline-flex items-center text-green-600 font-semibold">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              {t("exams.pass") || "Pass"}
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-red-600 font-semibold">
                              <XCircle className="h-4 w-4 mr-1" />
                              {t("exams.fail") || "Fail"}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
        </>
        )}

        {/* Print Results Tab */}
        {activeTab === "print" && (
          <div className="space-y-4 sm:space-y-6">
            {/* Single Print */}
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">{t("exams.printSingleResult") || "Print Single Result"}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="printRollNumber">{t("cards.rollNumber")}</Label>
                  <div className="flex gap-2">
                    <Input
                      id="printRollNumber"
                      placeholder={t("cards.enterRollNumber")}
                      value={printRollNumber}
                      onChange={(e) => setPrintRollNumber(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handlePrintSearch()}
                      className="flex-1"
                    />
                    <Button onClick={handlePrintSearch}>
                      <FileText className="h-4 w-4 mr-2" />
                      {t("common.search")}
                    </Button>
                  </div>
                  {printError && (
                    <p className="text-sm text-red-500">{printError}</p>
                  )}
                </div>

                {printResult && (
                  <div className="mt-6 space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold mb-2">{t("cards.studentFound")}:</h3>
                      <p><strong>{t("cards.name")}:</strong> {printResult.students[0]?.studentName}</p>
                      <p><strong>{t("cards.rollNo")}:</strong> {printResult.students[0]?.rollNo}</p>
                      <p><strong>{t("student.class")}:</strong> {printResult.className}</p>
                      <p><strong>{t("exams.total")}:</strong> {printResult.students[0]?.totalMarks} / {printResult.numberOfPapers * printResult.marksPerPaper}</p>
                      <p><strong>{t("exams.percentage")}:</strong> {printResult.students[0]?.percentage}%</p>
                      <p><strong>{t("exams.grade")}:</strong> {printResult.students[0]?.grade}</p>
                    </div>
                    <Button onClick={() => handlePrintSingleResult(printResult)} className="w-full sm:w-auto">
                      <Printer className="h-4 w-4 mr-2" />
                      {t("exams.printResult") || "Print Result"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bulk Print */}
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">{t("exams.printBulkResults") || "Print Bulk Results"}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bulkPrintClass">{t("student.class")} <span className="text-red-500">*</span></Label>
                  <Select value={bulkPrintClass} onValueChange={setBulkPrintClass}>
                    <SelectTrigger id="bulkPrintClass">
                      <SelectValue placeholder={t("exams.selectClass") || "Select Class"} />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueClasses.map((cls) => (
                        <SelectItem key={cls} value={cls}>
                          {/^\d+$/.test(cls) ? `${t("student.class")} ${cls}` : cls}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleBulkPrint} className="w-full sm:w-auto">
                  <FileText className="h-4 w-4 mr-2" />
                  {t("exams.generateBulkResults") || "Generate Bulk Results"}
                </Button>

                {bulkPrintResults.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium">
                        <strong>{t("exams.studentsFound") || "Students Found"}:</strong> {bulkPrintResults.length}
                      </p>
                    </div>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs sm:text-sm">{t("exams.rank") || "Rank"}</TableHead>
                            <TableHead className="text-xs sm:text-sm">{t("student.registrationNo")}</TableHead>
                            <TableHead className="text-xs sm:text-sm">{t("student.studentName")}</TableHead>
                            <TableHead className="text-xs sm:text-sm text-center">{t("exams.total")}</TableHead>
                            <TableHead className="text-xs sm:text-sm text-center">{t("exams.percentage")}</TableHead>
                            <TableHead className="text-xs sm:text-sm text-center">{t("exams.grade")}</TableHead>
                            <TableHead className="text-xs sm:text-sm text-center">{t("exams.status")}</TableHead>
                            <TableHead className="text-xs sm:text-sm text-center">{t("common.actions")}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bulkPrintResults.map((result, idx) => {
                            const student = result.students[0];
                            return (
                              <TableRow key={result.students[0]?.studentId || idx}>
                                <TableCell className="text-xs sm:text-sm">#{(student as any)?.rank || idx + 1}</TableCell>
                                <TableCell className="text-xs sm:text-sm">{student?.rollNo}</TableCell>
                                <TableCell className="text-xs sm:text-sm">{student?.studentName}</TableCell>
                                <TableCell className="text-xs sm:text-sm text-center">
                                  {student?.totalMarks} / {result.numberOfPapers * result.marksPerPaper}
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm text-center">{student?.percentage}%</TableCell>
                                <TableCell className="text-xs sm:text-sm text-center font-semibold">{student?.grade}</TableCell>
                                <TableCell className="text-center">
                                  {student?.status === "Pass" ? (
                                    <span className="inline-flex items-center text-green-600">
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      {t("exams.pass") || "Pass"}
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center text-red-600">
                                      <XCircle className="h-4 w-4 mr-1" />
                                      {t("exams.fail") || "Fail"}
                                    </span>
                                  )}
                                </TableCell>
                                <TableCell className="text-center">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePrintSingleResult(result)}
                                    className="h-8"
                                  >
                                    <Printer className="h-3 w-3 mr-1" />
                                    {t("exams.print") || "Print"}
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                    <Button onClick={handlePrintBulkResults} className="w-full sm:w-auto">
                      <Printer className="h-4 w-4 mr-2" />
                      {t("exams.printAllResults") || "Print All Results"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
