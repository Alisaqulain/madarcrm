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
import { Search, BookOpen, BookCheck, Plus } from "lucide-react";
import { useLanguageStore } from "@/store/language-store";
import { dummyBooks, dummyBookDistributions, extendedDummyStudents } from "@/data/dummy-data";
import type { DummyBook, DummyBookDistribution } from "@/data/dummy-data";

export default function BooksIssueReturnPage() {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const [activeTab, setActiveTab] = useState<"issue" | "return">("issue");
  const [rollNumber, setRollNumber] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedBook, setSelectedBook] = useState("");
  const [issueDate, setIssueDate] = useState<Date | undefined>(new Date());
  const [returnDate, setReturnDate] = useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "Issued" | "Returned">("all");
  
  // State management for books and distributions
  const [books, setBooks] = useState<DummyBook[]>(dummyBooks);
  const [distributions, setDistributions] = useState<DummyBookDistribution[]>(dummyBookDistributions);

  // Get students
  const students = useMemo(() => {
    return extendedDummyStudents.map(s => ({
      id: s.studentId,
      name: s.name[language] || s.name.en,
      rollNo: s.studentId,
      class: s.class,
      section: s.section,
    }));
  }, [language]);

  // Get books with current state
  const availableBooks = useMemo(() => {
    return books.map(book => ({
      id: book.id,
      name: language === "hi" ? book.bookNameHi : language === "ur" ? book.bookNameUr : book.bookName,
      author: book.author,
      available: book.available,
      bookData: book,
    }));
  }, [books, language]);

  // Filter book distributions
  const filteredDistributions = useMemo(() => {
    let filtered = distributions;
    
    if (filterStatus !== "all") {
      filtered = filtered.filter(d => d.status === filterStatus);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(d => {
        const student = extendedDummyStudents.find(s => s.studentId === d.studentId);
        const studentName = student ? (student.name[language] || student.name.en) : d.studentName;
        const book = books.find(b => b.id === d.bookId);
        const bookName = book ? (language === "hi" ? book.bookNameHi : language === "ur" ? book.bookNameUr : book.bookName) : d.bookName;
        
        return studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bookName.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
    
    return filtered;
  }, [distributions, filterStatus, searchTerm, language, books]);

  const handleSearchStudent = () => {
    if (!rollNumber.trim()) {
      alert(t("books.pleaseEnterRollNumber") || "Please enter a roll number");
      return;
    }
    
    const searchTerm = rollNumber.trim();
    const searchTermLower = searchTerm.toLowerCase();
    
    // Try exact match first (case-insensitive)
    let found = students.find(s => s.rollNo.toLowerCase() === searchTermLower);
    
    // If not found, try flexible matching (handle formats like 20250001, NET001, etc.)
    if (!found) {
      // If user entered a number without NET prefix, try adding NET prefix
      if (/^\d+$/.test(searchTerm)) {
        // Try with NET prefix and different padding formats
        const padded4 = `NET${searchTerm.padStart(4, '0')}`; // NET0001 format
        const padded3 = `NET${searchTerm.padStart(3, '0')}`; // NET001 format
        const paddedFull = `NET${searchTerm}`; // NET20250001 format
        // If it's 8 digits, try last 4 digits as NET0001
        const last4Digits = searchTerm.length >= 4 ? searchTerm.slice(-4) : searchTerm;
        const paddedLast4 = `NET${last4Digits.padStart(4, '0')}`;
        
        found = students.find(s => {
          const rollUpper = s.rollNo.toUpperCase();
          return rollUpper === padded4 || 
                 rollUpper === padded3 || 
                 rollUpper === paddedFull ||
                 rollUpper === paddedLast4;
        });
      }
      
      // Also try if user entered NET prefix but we need to match without it
      if (!found && searchTermLower.startsWith('net')) {
        const withoutPrefix = searchTermLower.replace(/^net/, '');
        found = students.find(s => {
          const rollLower = s.rollNo.toLowerCase();
          return rollLower.replace(/^net/, '') === withoutPrefix || 
                 rollLower === searchTermLower;
        });
      }
      
      // Try partial match (contains) as last resort
      if (!found) {
        found = students.find(s => {
          const rollLower = s.rollNo.toLowerCase();
          return rollLower.includes(searchTermLower) || searchTermLower.includes(rollLower);
        });
      }
    }
    
    if (found) {
      setSelectedStudent(found);
      console.log("Student found:", found);
    } else {
      const errorMsg = t("cards.studentNotFound") || `Student not found with roll number: ${rollNumber}`;
      const formatHint = "\n\nPlease try formats like:\n- NET001\n- NET0001\n- 1 (will search for NET0001)\n- 001 (will search for NET0001)";
      alert(errorMsg + formatHint);
      setSelectedStudent(null);
    }
  };

  const handleIssueBook = () => {
    console.log("Issue button clicked", { selectedStudent, selectedBook, issueDate });
    
    if (!selectedStudent) {
      alert(t("books.pleaseSelectStudent") || "Please search and select a student first");
      return;
    }
    
    if (!selectedBook) {
      alert(t("books.pleaseSelectBook") || "Please select a book");
      return;
    }
    
    // Use today's date if no date is selected
    const finalIssueDate = issueDate || new Date();
    
    if (!finalIssueDate) {
      alert(t("books.pleaseSelectDate") || "Please select an issue date");
      return;
    }
    
    const bookId = parseInt(selectedBook);
    if (isNaN(bookId)) {
      alert(t("books.invalidBook") || "Invalid book selection");
      return;
    }
    
    const bookData = books.find(b => b.id === bookId);
    if (!bookData) {
      alert(t("books.bookNotFound") || "Book not found");
      return;
    }
    
    if (bookData.available <= 0) {
      alert(t("books.bookNotAvailable") || "Book is not available");
      return;
    }
    
    try {
      // Create new distribution record
      const distributionIds = distributions.length > 0 ? distributions.map(d => d.id) : [0];
      const newDistributionId = Math.max(...distributionIds, 0) + 1;
      
      const newDistribution: DummyBookDistribution = {
        id: newDistributionId,
        studentId: selectedStudent.rollNo,
        studentName: selectedStudent.name,
        bookId: bookId,
        bookName: bookData.bookName,
        distributedDate: finalIssueDate.toISOString().split('T')[0],
        status: "Issued",
      };
      
      // Update distributions
      setDistributions(prev => [...prev, newDistribution]);
      
      // Update book availability
      setBooks(prev => prev.map(b => 
        b.id === bookId
          ? {
              ...b,
              distributed: b.distributed + 1,
              available: Math.max(0, b.available - 1),
            }
          : b
      ));
      
      alert(t("books.bookIssuedSuccess") || "Book issued successfully!");
      
      // Reset form
      setSelectedStudent(null);
      setSelectedBook("");
      setRollNumber("");
      setIssueDate(new Date());
    } catch (error) {
      console.error("Error issuing book:", error);
      alert(t("books.errorIssuingBook") || "An error occurred while issuing the book. Please try again.");
    }
  };

  const handleReturnBook = (distributionId: number) => {
    if (confirm(t("books.confirmReturn") || "Are you sure you want to return this book?")) {
      const distribution = distributions.find(d => d.id === distributionId);
      if (!distribution) return;
      
      // Update distribution status
      setDistributions(distributions.map(d => 
        d.id === distributionId
          ? {
              ...d,
              status: "Returned" as const,
              returnDate: new Date().toISOString().split('T')[0],
            }
          : d
      ));
      
      // Update book availability
      setBooks(books.map(b => 
        b.id === distribution.bookId
          ? {
              ...b,
              distributed: Math.max(0, b.distributed - 1),
              available: b.available + 1,
            }
          : b
      ));
      
      alert(t("books.bookReturnedSuccess") || "Book returned successfully!");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold">{t("books.issueReturn") || "Book Issue & Return"}</h1>

        {/* Tabs */}
        <div className="flex gap-2 border-b">
          <Button
            variant={activeTab === "issue" ? "default" : "ghost"}
            onClick={() => setActiveTab("issue")}
            className="rounded-b-none"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            {t("books.issueBook") || "Issue Book"}
          </Button>
          <Button
            variant={activeTab === "return" ? "default" : "ghost"}
            onClick={() => setActiveTab("return")}
            className="rounded-b-none"
          >
            <BookCheck className="h-4 w-4 mr-2" />
            {t("books.returnBook") || "Return Book"}
          </Button>
        </div>

        {/* Issue Book Section */}
        {activeTab === "issue" && (
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">{t("books.issueBook") || "Issue Book"}</CardTitle>
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
                    onKeyPress={(e) => e.key === "Enter" && handleSearchStudent()}
                    className="flex-1"
                  />
                  <Button onClick={handleSearchStudent}>
                    <Search className="h-4 w-4 mr-2" />
                    {t("common.search")}
                  </Button>
                </div>
              </div>

              {selectedStudent && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-semibold mb-2 text-green-800">{t("cards.studentFound")}:</h3>
                  <p><strong>{t("cards.name")}:</strong> {selectedStudent.name}</p>
                  <p><strong>{t("cards.rollNo")}:</strong> {selectedStudent.rollNo}</p>
                  <p><strong>{t("student.class")}:</strong> {selectedStudent.class} - {selectedStudent.section}</p>
                </div>
              )}
              
              {!selectedStudent && rollNumber && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    {t("books.studentNotSelected") || "Please click the Search button to find the student"}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="book">{t("books.bookName")} <span className="text-red-500">*</span></Label>
                  <Select value={selectedBook} onValueChange={setSelectedBook}>
                    <SelectTrigger id="book">
                      <SelectValue placeholder={t("books.selectBook") || "Select Book"} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableBooks.filter(b => b.available > 0).map((book) => (
                        <SelectItem key={book.id} value={String(book.id)}>
                          {book.name} ({t("books.available")}: {book.available})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issueDate">{t("books.issueDate") || "Issue Date"} <span className="text-red-500">*</span></Label>
                  <DatePicker
                    date={issueDate}
                    onDateChange={(date) => {
                      setIssueDate(date || new Date());
                    }}
                    placeholder={t("books.selectIssueDate") || "Select issue date (defaults to today)"}
                  />
                  {!issueDate && (
                    <p className="text-xs text-muted-foreground">
                      {t("books.dateWillDefaultToToday") || "If not selected, today's date will be used"}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
              <Button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleIssueBook();
                }}
                className="w-full sm:w-auto"
                disabled={!selectedStudent || !selectedBook}
                type="button"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t("books.issueBook") || "Issue Book"}
              </Button>
                {(!selectedStudent || !selectedBook) && (
                  <p className="text-xs text-muted-foreground">
                    {!selectedStudent && <span className="text-red-500">• {t("books.pleaseSelectStudent") || "Please search and select a student"}</span>}
                    {selectedStudent && !selectedBook && <span className="text-red-500">• {t("books.pleaseSelectBook") || "Please select a book"}</span>}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Return Book / Records Section */}
        {activeTab === "return" && (
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">{t("books.distributionRecords")}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("common.search")}</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder={t("books.searchByStudentOrBook") || "Search by student or book..."}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t("books.filterByStatus") || "Filter by Status"}</Label>
                  <Select value={filterStatus} onValueChange={(value: "all" | "Issued" | "Returned") => setFilterStatus(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("books.allStatus") || "All Status"}</SelectItem>
                      <SelectItem value="Issued">{t("books.issued")}</SelectItem>
                      <SelectItem value="Returned">{t("books.returned")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm">{t("cards.name")}</TableHead>
                      <TableHead className="text-xs sm:text-sm">{t("cards.rollNo")}</TableHead>
                      <TableHead className="text-xs sm:text-sm">{t("books.bookName")}</TableHead>
                      <TableHead className="text-xs sm:text-sm">{t("books.issueDate") || "Issue Date"}</TableHead>
                      <TableHead className="text-xs sm:text-sm">{t("books.returnDate") || "Return Date"}</TableHead>
                      <TableHead className="text-xs sm:text-sm">{t("books.status")}</TableHead>
                      <TableHead className="text-right text-xs sm:text-sm">{t("common.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDistributions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          {t("books.noRecordsFound") || "No records found"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDistributions.map((distribution) => {
                        const student = extendedDummyStudents.find(s => s.studentId === distribution.studentId);
                        const studentName = student ? (student.name[language] || student.name.en) : distribution.studentName;
                        const book = books.find(b => b.id === distribution.bookId);
                        const bookName = book ? (language === "hi" ? book.bookNameHi : language === "ur" ? book.bookNameUr : book.bookName) : distribution.bookName;
                        const statusText = distribution.status === "Issued" ? t("books.issued") : t("books.returned");
                        
                        return (
                          <TableRow key={distribution.id}>
                            <TableCell className="text-xs sm:text-sm">{studentName}</TableCell>
                            <TableCell className="text-xs sm:text-sm">{distribution.studentId}</TableCell>
                            <TableCell className="text-xs sm:text-sm">{bookName}</TableCell>
                            <TableCell className="text-xs sm:text-sm">
                              {new Date(distribution.distributedDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-xs sm:text-sm">
                              {distribution.returnDate ? new Date(distribution.returnDate).toLocaleDateString() : "-"}
                            </TableCell>
                            <TableCell className="text-xs sm:text-sm">
                              <span className={`rounded-full px-2 py-1 text-xs ${
                                distribution.status === "Issued"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                              }`}>
                                {statusText}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              {distribution.status === "Issued" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleReturnBook(distribution.id)}
                                  className="h-8"
                                >
                                  {t("books.returnBook") || "Return"}
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

