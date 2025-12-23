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
import { Download, Search, Filter, X } from "lucide-react";
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
  
  // Bulk download states
  const [showBulkDownload, setShowBulkDownload] = useState(false);
  const [filterClass, setFilterClass] = useState("");
  const [filterSection, setFilterSection] = useState("");
  const [filterDob, setFilterDob] = useState<Date | undefined>(undefined);
  const [frontLanguage, setFrontLanguage] = useState<"en" | "hi" | "ur">("en");
  const [backLanguage, setBackLanguage] = useState<"en" | "hi" | "ur">("ur");

  // Get unique classes and sections
  const uniqueClasses = useMemo(() => {
    const classes = new Set(extendedDummyStudents.map(s => s.class));
    return Array.from(classes).sort();
  }, []);

  const uniqueSections = useMemo(() => {
    const sections = new Set(extendedDummyStudents.map(s => s.section));
    return Array.from(sections).sort();
  }, []);

  // Filter students for bulk download
  const filteredStudents = useMemo(() => {
    let filtered = extendedDummyStudents;
    
    if (filterClass) {
      filtered = filtered.filter(s => s.class === filterClass);
    }
    
    if (filterSection) {
      filtered = filtered.filter(s => s.section === filterSection);
    }
    
    if (filterDob) {
      const filterYear = filterDob.getFullYear();
      const filterMonth = filterDob.getMonth();
      filtered = filtered.filter(s => {
        const studentDob = new Date(s.dob);
        return studentDob.getFullYear() === filterYear && 
               studentDob.getMonth() === filterMonth;
      });
    }
    
    return filtered;
  }, [filterClass, filterSection, filterDob]);

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
    const idCardHtml = generateIdCardHtml(student, frontLanguage, backLanguage);
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(idCardHtml);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  const handleBulkDownload = () => {
    if (filteredStudents.length === 0) {
      alert(t("cards.noStudentsFound") || "No students found to download");
      return;
    }

    const allCardsHtml = generateBulkIdCardsHtml(filteredStudents, frontLanguage, backLanguage);
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(allCardsHtml);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  const generateIdCardHtml = (student: Student, frontLang: "en" | "hi" | "ur", backLang: "en" | "hi" | "ur") => {
    const frontName = student.name[frontLang] || student.name.en;
    const frontFatherName = student.fatherName[frontLang] || student.fatherName.en;
    const backName = student.name[backLang] || student.name.en;
    const backFatherName = student.fatherName[backLang] || student.fatherName.en;
    const backAddress = student.address[backLang] || student.address.en;
    
    const frontLabels = getLabels(frontLang);
    const backLabels = getLabels(backLang);
    
    const frontDob = new Date(student.dob).toLocaleDateString(frontLang === "ur" ? "ar-SA" : frontLang === "hi" ? "hi-IN" : "en-US");
    const backDob = new Date(student.dob).toLocaleDateString(backLang === "ur" ? "ar-SA" : backLang === "hi" ? "hi-IN" : "en-US");

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ID Card - ${frontName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: Arial, sans-serif;
      display: flex;
      gap: 20px;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #f5f5f5;
      padding: 20px;
    }
    .card-container {
      display: flex;
      gap: 20px;
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
      text-align: ${frontLang === "ur" ? "left" : "right"};
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
      overflow: hidden;
    }
    .id-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .id-footer {
      text-align: center;
      margin-top: 15px;
      font-size: 10px;
      opacity: 0.8;
      position: relative;
      z-index: 1;
    }
    .back-card {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }
    .back-content {
      padding: 15px;
    }
    .back-field {
      margin-bottom: 10px;
      font-size: 12px;
    }
    @media print {
      body { background: white; padding: 0; }
      .id-card { box-shadow: none; page-break-inside: avoid; }
      .card-container { page-break-after: always; }
    }
  </style>
</head>
<body>
  <div class="card-container">
    <!-- Front Side -->
    <div class="id-card">
      <div class="id-header">
        <h2>${frontLabels.appName}</h2>
        <p>${frontLabels.title}</p>
      </div>
      <div class="id-content">
        <div class="id-left">
          <div class="id-photo">
            ${student.photo 
              ? `<img src="${student.photo}" alt="Student Photo" />`
              : `<span>${frontLang === "ur" ? "تصویر" : frontLang === "hi" ? "फोटो" : "Photo"}</span>`
            }
          </div>
          <div class="id-field">
            <div class="id-label">${frontLabels.rollNo}</div>
            <div class="id-value">${student.studentId}</div>
          </div>
          <div class="id-field">
            <div class="id-label">${frontLabels.class}</div>
            <div class="id-value">${student.class} - ${student.section}</div>
          </div>
        </div>
        <div class="id-right">
          <div class="id-field">
            <div class="id-label">${frontLabels.name}</div>
            <div class="id-value">${frontName}</div>
          </div>
          <div class="id-field">
            <div class="id-label">${frontLabels.fatherName}</div>
            <div class="id-value">${frontFatherName}</div>
          </div>
          <div class="id-field">
            <div class="id-label">${frontLabels.dob}</div>
            <div class="id-value">${frontDob}</div>
          </div>
          <div class="id-field">
            <div class="id-label">${frontLabels.phone}</div>
            <div class="id-value">${student.phone}</div>
          </div>
        </div>
      </div>
      <div class="id-footer">
        <p>${frontLabels.footer}</p>
      </div>
    </div>
    
    <!-- Back Side -->
    <div class="id-card back-card">
      <div class="id-header">
        <h2>${backLabels.appName}</h2>
        <p>${backLabels.title}</p>
      </div>
      <div class="back-content" dir="${backLang === "ur" ? "rtl" : "ltr"}">
        <div class="back-field">
          <div class="id-label">${backLabels.name}</div>
          <div class="id-value">${backName}</div>
        </div>
        <div class="back-field">
          <div class="id-label">${backLabels.fatherName}</div>
          <div class="id-value">${backFatherName}</div>
        </div>
        <div class="back-field">
          <div class="id-label">${backLabels.address || "Address"}</div>
          <div class="id-value">${backAddress}</div>
        </div>
        <div class="back-field">
          <div class="id-label">${backLabels.dob}</div>
          <div class="id-value">${backDob}</div>
        </div>
        <div class="id-footer">
          <p>${backLabels.footer}</p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
    `;
  };

  const generateBulkIdCardsHtml = (students: Student[], frontLang: "en" | "hi" | "ur", backLang: "en" | "hi" | "ur") => {
    const cardsHtml = students.map(student => {
      const frontName = student.name[frontLang] || student.name.en;
      const frontFatherName = student.fatherName[frontLang] || student.fatherName.en;
      const backName = student.name[backLang] || student.name.en;
      const backFatherName = student.fatherName[backLang] || student.fatherName.en;
      const backAddress = student.address[backLang] || student.address.en;
      
      const frontLabels = getLabels(frontLang);
      const backLabels = getLabels(backLang);
      
      const frontDob = new Date(student.dob).toLocaleDateString(frontLang === "ur" ? "ar-SA" : frontLang === "hi" ? "hi-IN" : "en-US");
      const backDob = new Date(student.dob).toLocaleDateString(backLang === "ur" ? "ar-SA" : backLang === "hi" ? "hi-IN" : "en-US");

      return `
  <div class="card-container">
    <div class="id-card">
      <div class="id-header">
        <h2>${frontLabels.appName}</h2>
        <p>${frontLabels.title}</p>
      </div>
      <div class="id-content">
        <div class="id-left">
          <div class="id-photo">${frontLang === "ur" ? "تصویر" : frontLang === "hi" ? "फोटो" : "Photo"}</div>
          <div class="id-field">
            <div class="id-label">${frontLabels.rollNo}</div>
            <div class="id-value">${student.studentId}</div>
          </div>
          <div class="id-field">
            <div class="id-label">${frontLabels.class}</div>
            <div class="id-value">${student.class} - ${student.section}</div>
          </div>
        </div>
        <div class="id-right">
          <div class="id-field">
            <div class="id-label">${frontLabels.name}</div>
            <div class="id-value">${frontName}</div>
          </div>
          <div class="id-field">
            <div class="id-label">${frontLabels.fatherName}</div>
            <div class="id-value">${frontFatherName}</div>
          </div>
          <div class="id-field">
            <div class="id-label">${frontLabels.dob}</div>
            <div class="id-value">${frontDob}</div>
          </div>
          <div class="id-field">
            <div class="id-label">${frontLabels.phone}</div>
            <div class="id-value">${student.phone}</div>
          </div>
        </div>
      </div>
      <div class="id-footer">
        <p>${frontLabels.footer}</p>
      </div>
    </div>
    
    <div class="id-card back-card">
      <div class="id-header">
        <h2>${backLabels.appName}</h2>
        <p>${backLabels.title}</p>
      </div>
      <div class="back-content" dir="${backLang === "ur" ? "rtl" : "ltr"}">
        <div class="back-field">
          <div class="id-label">${backLabels.name}</div>
          <div class="id-value">${backName}</div>
        </div>
        <div class="back-field">
          <div class="id-label">${backLabels.fatherName}</div>
          <div class="id-value">${backFatherName}</div>
        </div>
        <div class="back-field">
          <div class="id-label">${backLabels.address || "Address"}</div>
          <div class="id-value">${backAddress}</div>
        </div>
        <div class="back-field">
          <div class="id-label">${backLabels.dob}</div>
          <div class="id-value">${backDob}</div>
        </div>
        <div class="id-footer">
          <p>${backLabels.footer}</p>
        </div>
      </div>
    </div>
  </div>
      `;
    }).join('');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bulk ID Cards</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: Arial, sans-serif;
      background: #f5f5f5;
      padding: 20px;
    }
    .card-container {
      display: flex;
      gap: 20px;
      margin-bottom: 30px;
      justify-content: center;
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
      text-align: right;
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
      overflow: hidden;
    }
    .id-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .id-footer {
      text-align: center;
      margin-top: 15px;
      font-size: 10px;
      opacity: 0.8;
      position: relative;
      z-index: 1;
    }
    .back-card {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }
    .back-content {
      padding: 15px;
    }
    .back-field {
      margin-bottom: 10px;
      font-size: 12px;
    }
    @media print {
      body { background: white; padding: 0; }
      .id-card { box-shadow: none; page-break-inside: avoid; }
      .card-container { page-break-after: always; }
    }
  </style>
</head>
<body>
  ${cardsHtml}
</body>
</html>
    `;
  };

  const getLabels = (lang: "en" | "hi" | "ur") => {
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
        address: "Address:",
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
        address: "पता:",
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
        address: "پتا:",
        footer: "یہ کارڈ نظام تعلیم کی ملکیت ہے"
      }
    };
    return labels[lang];
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold">{t("nav.printIdCard")}</h1>
          <Button
            onClick={() => setShowBulkDownload(!showBulkDownload)}
            variant={showBulkDownload ? "default" : "outline"}
          >
            <Filter className="h-4 w-4 mr-2" />
            {showBulkDownload ? t("cards.hideBulkDownload") || "Hide Bulk Download" : t("cards.bulkDownload") || "Bulk Download"}
          </Button>
        </div>

        {/* Bulk Download Section */}
        {showBulkDownload && (
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">{t("cards.bulkDownload") || "Bulk Download ID Cards"}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>{t("student.class")}</Label>
                  <Select value={filterClass || "all"} onValueChange={(value) => setFilterClass(value === "all" ? "" : value)}>
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
                  <Label>{t("student.section")}</Label>
                  <Select value={filterSection || "all"} onValueChange={(value) => setFilterSection(value === "all" ? "" : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("books.allClasses")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("books.allClasses")}</SelectItem>
                      {uniqueSections.map((sec) => (
                        <SelectItem key={sec} value={sec}>{sec}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t("student.dateOfBirth")}</Label>
                  <DatePicker
                    date={filterDob}
                    onDateChange={setFilterDob}
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilterClass("");
                      setFilterSection("");
                      setFilterDob(undefined);
                    }}
                    className="w-full"
                  >
                    <X className="h-4 w-4 mr-2" />
                    {t("common.reset")}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label>{t("cards.frontLanguage") || "Front Side Language"}</Label>
                  <Select value={frontLanguage} onValueChange={(value: "en" | "hi" | "ur") => setFrontLanguage(value)}>
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

                <div className="space-y-2">
                  <Label>{t("cards.backLanguage") || "Back Side Language"}</Label>
                  <Select value={backLanguage} onValueChange={(value: "en" | "hi" | "ur") => setBackLanguage(value)}>
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
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium mb-2">
                  {t("cards.studentsFound") || "Students Found"}: <strong>{filteredStudents.length}</strong>
                </p>
                {filteredStudents.length > 0 && (
                  <Button onClick={handleBulkDownload} className="w-full sm:w-auto">
                    <Download className="h-4 w-4 mr-2" />
                    {t("cards.downloadAll") || `Download All ${filteredStudents.length} Cards`}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Single Card Search */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">{t("cards.generateIdCard")}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("cards.frontLanguage") || "Front Side Language"}</Label>
                <Select value={frontLanguage} onValueChange={(value: "en" | "hi" | "ur") => setFrontLanguage(value)}>
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

              <div className="space-y-2">
                <Label>{t("cards.backLanguage") || "Back Side Language"}</Label>
                <Select value={backLanguage} onValueChange={(value: "en" | "hi" | "ur") => setBackLanguage(value)}>
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
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button onClick={handleDownload} className="w-full sm:w-auto">
                    <Download className="h-4 w-4 mr-2" />
                    {t("cards.printIdCard")}
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
