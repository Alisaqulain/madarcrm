"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
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
import { Plus, Search } from "lucide-react";
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

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold">{t("nav.bookDistribution")}</h1>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Books Inventory</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Search Books</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search books..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Filter by Class</Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Classes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Classes</SelectItem>
                    <SelectItem value="1">Class 1</SelectItem>
                    <SelectItem value="2">Class 2</SelectItem>
                    <SelectItem value="3">Class 3</SelectItem>
                    <SelectItem value="4">Class 4</SelectItem>
                    <SelectItem value="All">All Classes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">Book Name</TableHead>
                    <TableHead className="text-xs sm:text-sm">Author</TableHead>
                    <TableHead className="text-xs sm:text-sm">Class</TableHead>
                    <TableHead className="text-xs sm:text-sm">Quantity</TableHead>
                    <TableHead className="text-xs sm:text-sm">Distributed</TableHead>
                    <TableHead className="text-xs sm:text-sm">Available</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBooks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No books found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBooks.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell className="text-xs sm:text-sm">{getBookName(book)}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{book.author}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{book.class}</TableCell>
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
            <CardTitle className="text-lg sm:text-xl">Book Distribution Records</CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">Student Name</TableHead>
                    <TableHead className="text-xs sm:text-sm">Roll No</TableHead>
                    <TableHead className="text-xs sm:text-sm">Book Name</TableHead>
                    <TableHead className="text-xs sm:text-sm">Distributed Date</TableHead>
                    <TableHead className="text-xs sm:text-sm">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dummyBookDistributions.map((distribution) => {
                    const student = extendedDummyStudents.find(s => s.studentId === distribution.studentId);
                    const studentName = student ? (student.name[language] || student.name.en) : distribution.studentName;
                    return (
                      <TableRow key={distribution.id}>
                        <TableCell className="text-xs sm:text-sm">{studentName}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{distribution.studentId}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{distribution.bookName}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{new Date(distribution.distributedDate).toLocaleDateString()}</TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          <span className={`rounded-full px-2 py-1 text-xs ${
                            distribution.status === "Issued"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}>
                            {distribution.status}
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
