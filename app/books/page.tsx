"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, Settings } from "lucide-react";
import { useLanguageStore } from "@/store/language-store";
import { dummyBooks, dummyBookDistributions, extendedDummyStudents } from "@/data/dummy-data";

export default function BooksPage() {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const [selectedClass, setSelectedClass] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter books
  const filteredBooks = dummyBooks.filter((book) => {
    const matchesClass = !selectedClass || book.class === selectedClass || book.class === "All";
    const matchesSearch = !searchTerm || 
      book.bookName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.bookNameHi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.bookNameUr.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesSearch;
  });

  // Get book name based on language
  const getBookName = (book: typeof dummyBooks[0]) => {
    if (language === "hi") return book.bookNameHi;
    if (language === "ur") return book.bookNameUr;
    return book.bookName;
  };

  const router = useRouter();

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <h1 className="text-2xl sm:text-3xl font-bold">{t("nav.bookDistribution")}</h1>
          <Button variant="outline" onClick={() => router.push("/books/manage")}>
            <Settings className="mr-2 h-4 w-4" />
            {t("books.manageBooks") || "Manage Books"}
          </Button>
        </div>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">{t("books.booksInventory")}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("books.searchBooks")}</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder={t("books.searchBooks")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("books.filterByClass")}</Label>
                <Select value={selectedClass || "all"} onValueChange={(value) => setSelectedClass(value === "all" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("books.allClasses")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("books.allClasses")}</SelectItem>
                    <SelectItem value="1">{t("student.class")} 1</SelectItem>
                    <SelectItem value="2">{t("student.class")} 2</SelectItem>
                    <SelectItem value="3">{t("student.class")} 3</SelectItem>
                    <SelectItem value="4">{t("student.class")} 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">{t("books.bookName")}</TableHead>
                    <TableHead className="text-xs sm:text-sm">{t("books.author")}</TableHead>
                    <TableHead className="text-xs sm:text-sm">{t("student.class")}</TableHead>
                    <TableHead className="text-xs sm:text-sm">{t("books.quantity")}</TableHead>
                    <TableHead className="text-xs sm:text-sm">{t("books.distributed")}</TableHead>
                    <TableHead className="text-xs sm:text-sm">{t("books.available")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBooks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        {t("books.noBooksFound")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBooks.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell className="text-xs sm:text-sm">{getBookName(book)}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{book.author}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{book.class === "All" ? t("books.allClasses") : `${t("student.class")} ${book.class}`}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{book.quantity}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{book.distributed}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{book.available}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">{t("books.distributionRecords")}</CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">{t("student.studentName")}</TableHead>
                    <TableHead className="text-xs sm:text-sm">{t("student.registrationNo")}</TableHead>
                    <TableHead className="text-xs sm:text-sm">{t("books.bookName")}</TableHead>
                    <TableHead className="text-xs sm:text-sm">{t("books.distributedDate")}</TableHead>
                    <TableHead className="text-xs sm:text-sm">{t("fees.status")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dummyBookDistributions.map((distribution) => {
                    const student = extendedDummyStudents.find(s => s.studentId === distribution.studentId);
                    const studentName = student ? (student.name[language] || student.name.en) : distribution.studentName;
                    const book = dummyBooks.find(b => b.id === distribution.bookId);
                    const bookName = book ? getBookName(book) : distribution.bookName;
                    const statusText = distribution.status === "Issued" ? t("books.issued") : t("books.returned");
                    return (
                      <TableRow key={distribution.id}>
                        <TableCell className="text-xs sm:text-sm">{studentName}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{distribution.studentId}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{bookName}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{new Date(distribution.distributedDate).toLocaleDateString()}</TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          <span className={`rounded-full px-2 py-1 text-xs ${
                            distribution.status === "Issued"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}>
                            {statusText}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
