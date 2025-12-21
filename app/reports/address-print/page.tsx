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

export default function AddressPrintPage() {
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
  const [addressLanguage, setAddressLanguage] = useState<"en" | "hi" | "ur">(language);

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

  const handleSinglePrint = () => {
    if (!student) return;
    const addressHtml = generateAddressHtml([student], addressLanguage);
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(addressHtml);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  const handleBulkPrint = () => {
    if (filteredStudents.length === 0) {
      alert(t("cards.noStudentsFound") || "No students found to print");
      return;
    }

    const addressHtml = generateAddressHtml(filteredStudents, addressLanguage);
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(addressHtml);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  const generateAddressHtml = (students: Student[], lang: "en" | "hi" | "ur") => {
    const labels = {
      en: {
        title: "Courier Address Label",
        appName: "Nizam-e-Taleem",
        to: "To:",
        name: "Name:",
        address: "Address:",
        phone: "Phone:",
        class: "Class:",
        rollNo: "Roll No:"
      },
      hi: {
        title: "कूरियर पता लेबल",
        appName: "निजाम-ए-तालीम",
        to: "को:",
        name: "नाम:",
        address: "पता:",
        phone: "फोन:",
        class: "कक्षा:",
        rollNo: "रोल नंबर:"
      },
      ur: {
        title: "کورئیر ایڈریس لیبل",
        appName: "نظام تعلیم",
        to: "کو:",
        name: "نام:",
        address: "پتا:",
        phone: "فون:",
        class: "درجہ:",
        rollNo: "رول نمبر:"
      }
    };
    
    const l = labels[lang];
    const isRTL = lang === "ur";

    const addressLabels = students.map((student, index) => {
      const name = student.name[lang] || student.name.en;
      const address = student.address[lang] || student.address.en;
      
      return `
        <div class="address-label">
          <div class="label-header">
            <strong>${l.to}</strong>
          </div>
          <div class="label-content">
            <div class="label-field">
              <span class="label-key">${l.name}</span>
              <span class="label-value">${name}</span>
            </div>
            <div class="label-field">
              <span class="label-key">${l.rollNo}</span>
              <span class="label-value">${student.studentId}</span>
            </div>
            <div class="label-field">
              <span class="label-key">${l.class}</span>
              <span class="label-value">${student.class} - ${student.section}</span>
            </div>
            <div class="label-field full-width">
              <span class="label-key">${l.address}</span>
              <span class="label-value">${address}</span>
            </div>
            <div class="label-field">
              <span class="label-key">${l.phone}</span>
              <span class="label-value">${student.phone}</span>
            </div>
          </div>
          <div class="label-footer">
            <span>${l.appName}</span>
          </div>
        </div>
      `;
    }).join('');

    return `
<!DOCTYPE html>
<html dir="${isRTL ? "rtl" : "ltr"}" lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${l.title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: Arial, sans-serif;
      background: #f5f5f5;
      padding: 20px;
    }
    .print-container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      padding: 20px;
    }
    .address-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-top: 20px;
    }
    .address-label {
      border: 2px solid #333;
      padding: 15px;
      min-height: 200px;
      display: flex;
      flex-direction: column;
      page-break-inside: avoid;
      background: white;
    }
    .label-header {
      border-bottom: 1px solid #333;
      padding-bottom: 8px;
      margin-bottom: 10px;
      font-size: 14px;
    }
    .label-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .label-field {
      display: flex;
      gap: 8px;
      font-size: 12px;
    }
    .label-field.full-width {
      flex-direction: column;
    }
    .label-key {
      font-weight: bold;
      min-width: 60px;
    }
    .label-value {
      flex: 1;
    }
    .label-footer {
      border-top: 1px solid #333;
      padding-top: 8px;
      margin-top: 10px;
      text-align: center;
      font-size: 11px;
      color: #666;
    }
    @media print {
      body { background: white; padding: 0; }
      .address-label { 
        box-shadow: none;
        border: 2px solid #000;
      }
      .address-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      @page {
        margin: 10mm;
      }
    }
  </style>
</head>
<body>
  <div class="print-container">
    <h1 style="text-align: center; margin-bottom: 20px;">${l.title}</h1>
    <div class="address-grid">
      ${addressLabels}
    </div>
  </div>
</body>
</html>
    `;
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold">{t("nav.addressPrint") || "Address Print (Courier Receipt)"}</h1>
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
              <CardTitle className="text-lg sm:text-xl">{t("address.bulkPrint") || "Bulk Print Address Labels"}</CardTitle>
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

              <div className="space-y-2 pt-4 border-t">
                <Label>{t("address.selectLanguage") || "Select Language"}</Label>
                <Select value={addressLanguage} onValueChange={(value: "en" | "hi" | "ur") => setAddressLanguage(value)}>
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

              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium mb-2">
                  {t("cards.studentsFound") || "Students Found"}: <strong>{filteredStudents.length}</strong>
                </p>
                {filteredStudents.length > 0 && (
                  <Button onClick={handleBulkPrint} className="w-full sm:w-auto">
                    <Printer className="h-4 w-4 mr-2" />
                    {t("address.printAll") || `Print All ${filteredStudents.length} Address Labels`}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Single Address Search */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">{t("address.generateAddressLabel") || "Generate Address Label"}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="space-y-2">
              <Label>{t("address.selectLanguage") || "Select Language"}</Label>
              <Select value={addressLanguage} onValueChange={(value: "en" | "hi" | "ur") => setAddressLanguage(value)}>
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
                  <p><strong>{t("student.address")}:</strong> {student.address[language] || student.address.en}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button onClick={handleSinglePrint} className="w-full sm:w-auto">
                    <Printer className="h-4 w-4 mr-2" />
                    {t("address.printSingle") || "Print Address Label"}
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

