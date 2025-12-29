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

export default function LiuCardGeneratorPage() {
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
    const liuCardHtml = generateLiuCardHtml(student, frontLanguage, backLanguage);
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(liuCardHtml);
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

    const allCardsHtml = generateBulkLiuCardsHtml(filteredStudents, frontLanguage, backLanguage);
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(allCardsHtml);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  const generateLiuCardHtml = (student: Student, frontLang: "en" | "hi" | "ur", backLang: "en" | "hi" | "ur") => {
    const frontName = student.name[frontLang] || student.name.en;
    const frontFatherName = student.fatherName[frontLang] || student.fatherName.en;
    const backName = student.name[backLang] || student.name.en;
    const backFatherName = student.fatherName[backLang] || student.fatherName.en;
    const backAddress = student.address[backLang] || student.address.en;
    
    const frontDob = new Date(student.dob).toLocaleDateString(frontLang === "ur" ? "ar-SA" : frontLang === "hi" ? "hi-IN" : "en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const backDob = new Date(student.dob).toLocaleDateString(backLang === "ur" ? "ar-SA" : backLang === "hi" ? "hi-IN" : "en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    
    const admissionDate = new Date(student.admissionDate);
    const validityYear = new Date().getFullYear() + 1;
    const validityDate = `May ${validityYear}`;

    // Default madarsa info (can be customized)
    const madarsaName = "MADRASA ISLAMIA JAMIA ANWARIA";
    const madarsaAddress = "Amber Colony, Distt. Demo (U.P.)";

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LIU Card - ${frontName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: Arial, sans-serif;
      background: white;
      padding: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .card-wrapper {
      width: 85.6mm;
      height: 53.98mm;
      background: white;
      border: 1px solid #ddd;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      position: relative;
      overflow: hidden;
    }
    .card-top-banner {
      background: #22c55e;
      color: white;
      padding: 8px 12px;
      text-align: center;
      position: relative;
    }
    .card-top-banner .logo {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      width: 30px;
      height: 30px;
      background: white;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }
    .card-top-banner h1 {
      font-size: 11px;
      font-weight: bold;
      margin: 0;
      line-height: 1.2;
    }
    .card-top-banner p {
      font-size: 8px;
      margin: 2px 0 0 0;
      opacity: 0.95;
    }
    .card-content {
      padding: 10px 12px;
      display: flex;
      gap: 10px;
      height: calc(100% - 100px);
    }
    .card-left {
      flex-shrink: 0;
    }
    .card-photo {
      width: 70px;
      height: 85px;
      border: 2px solid #22c55e;
      border-radius: 4px;
      background: #f3f4f6;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .card-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .card-photo-placeholder {
      font-size: 8px;
      color: #6b7280;
      text-align: center;
      padding: 5px;
    }
    .card-right {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .card-field {
      font-size: 8px;
      line-height: 1.3;
    }
    .card-field-label {
      color: #4b5563;
      font-weight: 500;
      display: inline-block;
      min-width: 65px;
    }
    .card-field-value {
      color: #111827;
      font-weight: 600;
    }
    .card-bottom-banner {
      background: #22c55e;
      color: white;
      padding: 6px 12px;
      text-align: center;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
    }
    .card-bottom-banner p {
      font-size: 8px;
      margin: 0;
      font-weight: 500;
    }
    .card-signature {
      position: absolute;
      bottom: 25px;
      right: 12px;
      font-size: 7px;
      color: #6b7280;
      font-style: italic;
    }
    @media print {
      body {
        padding: 0;
        margin: 0;
      }
      .card-wrapper {
        margin: 0;
        box-shadow: none;
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="card-wrapper">
    <!-- Top Banner -->
    <div class="card-top-banner">
      <div class="logo">🕌</div>
      <h1>${madarsaName}</h1>
      <p>${madarsaAddress}</p>
    </div>

    <!-- Card Content -->
    <div class="card-content">
      <div class="card-left">
        <div class="card-photo">
          ${student.photo ? `<img src="${student.photo}" alt="Student Photo" />` : '<div class="card-photo-placeholder">Photo</div>'}
        </div>
      </div>
      <div class="card-right">
        <div class="card-field">
          <span class="card-field-label">Admission No.</span>
          <span class="card-field-value">${student.studentId}</span>
        </div>
        <div class="card-field">
          <span class="card-field-label">Student Name</span>
          <span class="card-field-value">${frontName}</span>
        </div>
        <div class="card-field">
          <span class="card-field-label">Father Name</span>
          <span class="card-field-value">${frontFatherName}</span>
        </div>
        <div class="card-field">
          <span class="card-field-label">D.O.B.</span>
          <span class="card-field-value">${frontDob}</span>
        </div>
        <div class="card-field">
          <span class="card-field-label">Class</span>
          <span class="card-field-value">${student.class} - ${student.section}</span>
        </div>
        <div class="card-field">
          <span class="card-field-label">Mobile No.</span>
          <span class="card-field-value">${student.phone}</span>
        </div>
        <div class="card-field">
          <span class="card-field-label">Full Address</span>
          <span class="card-field-value">${student.address[frontLang] || student.address.en}</span>
        </div>
      </div>
    </div>

    <!-- Bottom Banner -->
    <div class="card-bottom-banner">
      <p>Validity Upto ${validityDate}</p>
    </div>

    <!-- Signature Area -->
    <div class="card-signature">
      <div style="border-top: 1px solid #9ca3af; width: 80px; margin-bottom: 2px;"></div>
      <div style="font-size: 6px; color: #9ca3af;">Authority Signature</div>
    </div>
  </div>
</body>
</html>
    `;
  };

  const generateBulkLiuCardsHtml = (students: Student[], frontLang: "en" | "hi" | "ur", backLang: "en" | "hi" | "ur") => {
    const validityYear = new Date().getFullYear() + 1;
    const validityDate = `May ${validityYear}`;
    const madarsaName = "MADRASA ISLAMIA JAMIA ANWARIA";
    const madarsaAddress = "Amber Colony, Distt. Demo (U.P.)";

    const cardsHtml = students.map(student => {
      const frontName = student.name[frontLang] || student.name.en;
      const frontFatherName = student.fatherName[frontLang] || student.fatherName.en;
      
      const frontDob = new Date(student.dob).toLocaleDateString(frontLang === "ur" ? "ar-SA" : frontLang === "hi" ? "hi-IN" : "en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      return `
  <div class="card-wrapper">
    <div class="card-top-banner">
      <div class="logo">🕌</div>
      <h1>${madarsaName}</h1>
      <p>${madarsaAddress}</p>
    </div>
    <div class="card-content">
      <div class="card-left">
        <div class="card-photo">
          ${student.photo ? `<img src="${student.photo}" alt="Student Photo" />` : '<div class="card-photo-placeholder">Photo</div>'}
        </div>
      </div>
      <div class="card-right">
        <div class="card-field">
          <span class="card-field-label">Admission No.</span>
          <span class="card-field-value">${student.studentId}</span>
        </div>
        <div class="card-field">
          <span class="card-field-label">Student Name</span>
          <span class="card-field-value">${frontName}</span>
        </div>
        <div class="card-field">
          <span class="card-field-label">Father Name</span>
          <span class="card-field-value">${frontFatherName}</span>
        </div>
        <div class="card-field">
          <span class="card-field-label">D.O.B.</span>
          <span class="card-field-value">${frontDob}</span>
        </div>
        <div class="card-field">
          <span class="card-field-label">Class</span>
          <span class="card-field-value">${student.class} - ${student.section}</span>
        </div>
        <div class="card-field">
          <span class="card-field-label">Mobile No.</span>
          <span class="card-field-value">${student.phone}</span>
        </div>
        <div class="card-field">
          <span class="card-field-label">Full Address</span>
          <span class="card-field-value">${student.address[frontLang] || student.address.en}</span>
        </div>
      </div>
    </div>
    <div class="card-bottom-banner">
      <p>Validity Upto ${validityDate}</p>
    </div>
    <div class="card-signature">
      <div style="border-top: 1px solid #9ca3af; width: 80px; margin-bottom: 2px;"></div>
      <div style="font-size: 6px; color: #9ca3af;">Authority Signature</div>
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
  <title>Bulk LIU Cards</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: Arial, sans-serif;
      background: white;
      padding: 20px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(85.6mm, 1fr));
      gap: 20px;
      justify-items: center;
    }
    .card-wrapper {
      width: 85.6mm;
      height: 53.98mm;
      background: white;
      border: 1px solid #ddd;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      position: relative;
      overflow: hidden;
      page-break-inside: avoid;
    }
    .card-top-banner {
      background: #22c55e;
      color: white;
      padding: 8px 12px;
      text-align: center;
      position: relative;
    }
    .card-top-banner .logo {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      width: 30px;
      height: 30px;
      background: white;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }
    .card-top-banner h1 {
      font-size: 11px;
      font-weight: bold;
      margin: 0;
      line-height: 1.2;
    }
    .card-top-banner p {
      font-size: 8px;
      margin: 2px 0 0 0;
      opacity: 0.95;
    }
    .card-content {
      padding: 10px 12px;
      display: flex;
      gap: 10px;
      height: calc(100% - 100px);
    }
    .card-left {
      flex-shrink: 0;
    }
    .card-photo {
      width: 70px;
      height: 85px;
      border: 2px solid #22c55e;
      border-radius: 4px;
      background: #f3f4f6;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .card-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .card-photo-placeholder {
      font-size: 8px;
      color: #6b7280;
      text-align: center;
      padding: 5px;
    }
    .card-right {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .card-field {
      font-size: 8px;
      line-height: 1.3;
    }
    .card-field-label {
      color: #4b5563;
      font-weight: 500;
      display: inline-block;
      min-width: 65px;
    }
    .card-field-value {
      color: #111827;
      font-weight: 600;
    }
    .card-bottom-banner {
      background: #22c55e;
      color: white;
      padding: 6px 12px;
      text-align: center;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
    }
    .card-bottom-banner p {
      font-size: 8px;
      margin: 0;
      font-weight: 500;
    }
    .card-signature {
      position: absolute;
      bottom: 25px;
      right: 12px;
      font-size: 7px;
      color: #6b7280;
      font-style: italic;
    }
    @media print {
      body {
        padding: 10px;
        margin: 0;
      }
      .card-wrapper {
        margin: 0;
        box-shadow: none;
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  ${cardsHtml}
</body>
</html>
    `;
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold">{t("nav.liuCardGenerator")}</h1>
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
              <CardTitle className="text-lg sm:text-xl">{t("cards.bulkDownload") || "Bulk Download LIU Cards"}</CardTitle>
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
            <CardTitle className="text-lg sm:text-xl">{t("cards.generateLiuCard") || "Generate LIU Card"}</CardTitle>
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
                    {t("nav.liuCardGenerator")}
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
