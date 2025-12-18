"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Download, Search, Printer } from "lucide-react";
import { useLanguageStore } from "@/store/language-store";
import { dummyStudents, DummyStudent } from "@/data/dummy-students";

type Student = DummyStudent;

export default function PrintLiuCardPage() {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const [rollNumber, setRollNumber] = useState("");
  const [student, setStudent] = useState<Student | null>(null);
  const [error, setError] = useState("");

  const handleSearch = () => {
    setError("");
    setStudent(null);
    
    if (!rollNumber.trim()) {
      setError("Please enter a roll number");
      return;
    }

    const found = dummyStudents.find(
      (s) => s.studentId.toLowerCase() === rollNumber.trim().toLowerCase()
    );

    if (found) {
      setStudent(found);
    } else {
      setError("Student not found with this roll number");
    }
  };

  const handlePrint = () => {
    if (!student) return;

    const liuCardHtml = generateLiuCardHtml(student, language);
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(liuCardHtml);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  const handleDownload = () => {
    if (!student) return;
    handlePrint(); // For now, same as print
  };

  const generateLiuCardHtml = (student: Student, lang: "en" | "hi" | "ur") => {
    const name = student.name[lang] || student.name.en;
    const fatherName = student.fatherName[lang] || student.fatherName.en;
    const address = student.address[lang] || student.address.en;
    const dob = new Date(student.dob).toLocaleDateString();
    const admissionDate = new Date(student.admissionDate).toLocaleDateString();

    return `
<!DOCTYPE html>
<html dir="${lang === "ur" ? "rtl" : "ltr"}" lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LIU Card - ${name}</title>
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
    .liu-card {
      width: 380px;
      height: 520px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      border-radius: 12px;
      padding: 25px;
      color: white;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      position: relative;
      overflow: hidden;
    }
    .liu-card::before {
      content: '';
      position: absolute;
      top: -30%;
      right: -30%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
    }
    .liu-header {
      text-align: center;
      margin-bottom: 20px;
      position: relative;
      z-index: 1;
      border-bottom: 2px solid rgba(255,255,255,0.3);
      padding-bottom: 15px;
    }
    .liu-header h1 {
      font-size: 26px;
      font-weight: bold;
      margin-bottom: 5px;
      text-transform: uppercase;
    }
    .liu-header h2 {
      font-size: 16px;
      opacity: 0.95;
      font-weight: normal;
    }
    .liu-photo-section {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
      position: relative;
      z-index: 1;
    }
    .liu-photo {
      width: 100px;
      height: 120px;
      background: rgba(255,255,255,0.2);
      border: 3px solid white;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      flex-shrink: 0;
    }
    .liu-basic-info {
      flex: 1;
    }
    .liu-info-item {
      margin-bottom: 10px;
    }
    .liu-info-label {
      font-size: 11px;
      opacity: 0.85;
      margin-bottom: 3px;
    }
    .liu-info-value {
      font-size: 14px;
      font-weight: bold;
    }
    .liu-details {
      background: rgba(255,255,255,0.1);
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 15px;
      position: relative;
      z-index: 1;
    }
    .liu-detail-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      border-bottom: 1px solid rgba(255,255,255,0.2);
    }
    .liu-detail-row:last-child {
      border-bottom: none;
    }
    .liu-detail-label {
      font-size: 12px;
      opacity: 0.9;
    }
    .liu-detail-value {
      font-size: 12px;
      font-weight: 600;
      text-align: ${lang === "ur" ? "left" : "right"};
    }
    .liu-footer {
      text-align: center;
      margin-top: 15px;
      font-size: 10px;
      opacity: 0.8;
      position: relative;
      z-index: 1;
    }
    .liu-signature {
      margin-top: 20px;
      text-align: center;
      position: relative;
      z-index: 1;
    }
    .liu-signature-line {
      border-top: 2px solid white;
      width: 180px;
      margin: 30px auto 5px;
    }
    @media print {
      body {
        background: white;
        padding: 0;
      }
      .liu-card {
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="liu-card">
    <div class="liu-header">
      <h1>Nizam-e-Taleem</h1>
      <h2>Library & Information Unit Card</h2>
    </div>
    
    <div class="liu-photo-section">
      <div class="liu-photo">Photo</div>
      <div class="liu-basic-info">
        <div class="liu-info-item">
          <div class="liu-info-label">Roll Number</div>
          <div class="liu-info-value">${student.studentId}</div>
        </div>
        <div class="liu-info-item">
          <div class="liu-info-label">Name</div>
          <div class="liu-info-value">${name}</div>
        </div>
        <div class="liu-info-item">
          <div class="liu-info-label">Class</div>
          <div class="liu-info-value">${student.class} - ${student.section}</div>
        </div>
      </div>
    </div>
    
    <div class="liu-details">
      <div class="liu-detail-row">
        <span class="liu-detail-label">Father's Name:</span>
        <span class="liu-detail-value">${fatherName}</span>
      </div>
      <div class="liu-detail-row">
        <span class="liu-detail-label">Date of Birth:</span>
        <span class="liu-detail-value">${dob}</span>
      </div>
      <div class="liu-detail-row">
        <span class="liu-detail-label">Admission Date:</span>
        <span class="liu-detail-value">${admissionDate}</span>
      </div>
      <div class="liu-detail-row">
        <span class="liu-detail-label">Phone:</span>
        <span class="liu-detail-value">${student.phone}</span>
      </div>
      <div class="liu-detail-row">
        <span class="liu-detail-label">Address:</span>
        <span class="liu-detail-value">${address}</span>
      </div>
    </div>
    
    <div class="liu-signature">
      <div class="liu-signature-line"></div>
      <p style="font-size: 11px;">Librarian's Signature</p>
    </div>
    
    <div class="liu-footer">
      <p>This card is the property of Nizam-e-Taleem Library</p>
    </div>
  </div>
</body>
</html>
    `;
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold">{t("nav.printLiuCard")}</h1>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Generate LIU Card</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rollNumber">Roll Number / Student ID</Label>
              <div className="flex gap-2">
                <Input
                  id="rollNumber"
                  placeholder="Enter roll number (e.g., NET001)"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-1"
                />
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
            </div>

            {student && (
              <div className="mt-6 space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Student Found:</h3>
                  <p><strong>Name:</strong> {student.name[language] || student.name.en}</p>
                  <p><strong>Roll No:</strong> {student.studentId}</p>
                  <p><strong>Class:</strong> {student.class} - {student.section}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button onClick={handlePrint} className="w-full sm:w-auto">
                    <Printer className="h-4 w-4 mr-2" />
                    Print LIU Card
                  </Button>
                  <Button onClick={handleDownload} variant="outline" className="w-full sm:w-auto">
                    <Download className="h-4 w-4 mr-2" />
                    Download
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
