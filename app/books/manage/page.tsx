"use client";

import { useState, useMemo } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { useLanguageStore } from "@/store/language-store";
import { dummyBooks } from "@/data/dummy-data";
import type { DummyBook } from "@/data/dummy-data";

export default function BooksManagePage() {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const [books, setBooks] = useState<DummyBook[]>(dummyBooks);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<DummyBook | null>(null);
  
  // Form state
  const [bookName, setBookName] = useState("");
  const [bookNameHi, setBookNameHi] = useState("");
  const [bookNameUr, setBookNameUr] = useState("");
  const [author, setAuthor] = useState("");
  const [bookClass, setBookClass] = useState("");
  const [quantity, setQuantity] = useState("");

  // Get unique classes
  const uniqueClasses = useMemo(() => {
    const classes = new Set(books.map(b => b.class));
    return Array.from(classes).sort();
  }, [books]);

  // Filter books
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesClass = !filterClass || book.class === filterClass || book.class === "All";
      const matchesSearch = !searchTerm || 
        book.bookName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.bookNameHi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.bookNameUr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesClass && matchesSearch;
    });
  }, [books, filterClass, searchTerm]);

  // Get book name based on language
  const getBookName = (book: DummyBook) => {
    if (language === "hi") return book.bookNameHi;
    if (language === "ur") return book.bookNameUr;
    return book.bookName;
  };

  const resetForm = () => {
    setBookName("");
    setBookNameHi("");
    setBookNameUr("");
    setAuthor("");
    setBookClass("");
    setQuantity("");
    setEditingBook(null);
  };

  const handleOpenDialog = (book?: DummyBook) => {
    if (book) {
      setEditingBook(book);
      setBookName(book.bookName);
      setBookNameHi(book.bookNameHi);
      setBookNameUr(book.bookNameUr);
      setAuthor(book.author);
      setBookClass(book.class);
      setQuantity(book.quantity.toString());
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSave = () => {
    if (!bookName || !bookNameHi || !bookNameUr || !author || !bookClass || !quantity) {
      alert(t("books.fillAllFields") || "Please fill all fields");
      return;
    }

    const quantityNum = parseInt(quantity);
    if (isNaN(quantityNum) || quantityNum < 0) {
      alert(t("books.invalidQuantity") || "Please enter a valid quantity");
      return;
    }

    if (editingBook) {
      // Update existing book
      setBooks(books.map(b => 
        b.id === editingBook.id 
          ? {
              ...b,
              bookName,
              bookNameHi,
              bookNameUr,
              author,
              class: bookClass,
              quantity: quantityNum,
              available: quantityNum - b.distributed, // Recalculate available
            }
          : b
      ));
      alert(t("books.bookUpdated") || "Book updated successfully!");
    } else {
      // Add new book
      const newId = Math.max(...books.map(b => b.id), 0) + 1;
      const newBook: DummyBook = {
        id: newId,
        bookName,
        bookNameHi,
        bookNameUr,
        author,
        class: bookClass,
        quantity: quantityNum,
        distributed: 0,
        available: quantityNum,
      };
      setBooks([...books, newBook]);
      alert(t("books.bookAdded") || "Book added successfully!");
    }

    handleCloseDialog();
  };

  const handleDelete = (id: number) => {
    if (confirm(t("common.confirmDelete") || "Are you sure you want to delete this book?")) {
      setBooks(books.filter(b => b.id !== id));
      alert(t("common.deleted") || "Book deleted successfully");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <h1 className="text-2xl sm:text-3xl font-bold">{t("books.manageBooks") || "Manage Books"}</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                {t("books.addBook") || "Add Book"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingBook ? (t("books.editBook") || "Edit Book") : (t("books.addBook") || "Add Book")}
                </DialogTitle>
                <DialogDescription>
                  {editingBook 
                    ? (t("books.editBookDescription") || "Update the book information below")
                    : (t("books.addBookDescription") || "Fill in the book information below")
                  }
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bookName">{t("books.bookName")} (English) <span className="text-red-500">*</span></Label>
                    <Input
                      id="bookName"
                      value={bookName}
                      onChange={(e) => setBookName(e.target.value)}
                      placeholder={t("books.enterBookName") || "Enter book name"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bookNameHi">{t("books.bookName")} (Hindi) <span className="text-red-500">*</span></Label>
                    <Input
                      id="bookNameHi"
                      value={bookNameHi}
                      onChange={(e) => setBookNameHi(e.target.value)}
                      placeholder={t("books.enterBookName") || "Enter book name"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bookNameUr">{t("books.bookName")} (Urdu) <span className="text-red-500">*</span></Label>
                    <Input
                      id="bookNameUr"
                      value={bookNameUr}
                      onChange={(e) => setBookNameUr(e.target.value)}
                      placeholder={t("books.enterBookName") || "Enter book name"}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="author">{t("books.author")} <span className="text-red-500">*</span></Label>
                    <Input
                      id="author"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder={t("books.enterAuthor") || "Enter author name"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="class">{t("student.class")} <span className="text-red-500">*</span></Label>
                    <Select value={bookClass} onValueChange={setBookClass}>
                      <SelectTrigger id="class">
                        <SelectValue placeholder={t("books.selectClass") || "Select class"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">{t("books.allClasses")}</SelectItem>
                        <SelectItem value="1">{t("student.class")} 1</SelectItem>
                        <SelectItem value="2">{t("student.class")} 2</SelectItem>
                        <SelectItem value="3">{t("student.class")} 3</SelectItem>
                        <SelectItem value="4">{t("student.class")} 4</SelectItem>
                        <SelectItem value="5">{t("student.class")} 5</SelectItem>
                        <SelectItem value="6">{t("student.class")} 6</SelectItem>
                        <SelectItem value="7">{t("student.class")} 7</SelectItem>
                        <SelectItem value="8">{t("student.class")} 8</SelectItem>
                        <SelectItem value="9">{t("student.class")} 9</SelectItem>
                        <SelectItem value="10">{t("student.class")} 10</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">{t("books.quantity")} <span className="text-red-500">*</span></Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder={t("books.enterQuantity") || "Enter total quantity"}
                  />
                  {editingBook && (
                    <p className="text-xs text-muted-foreground">
                      {t("books.currentDistributed") || "Currently distributed"}: {editingBook.distributed}
                    </p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleCloseDialog}>
                  {t("common.cancel") || "Cancel"}
                </Button>
                <Button onClick={handleSave}>
                  {editingBook ? (t("common.update") || "Update") : (t("common.add") || "Add")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                <Select value={filterClass || "all"} onValueChange={(value) => setFilterClass(value === "all" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("books.allClasses")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("books.allClasses")}</SelectItem>
                    {uniqueClasses.map((cls) => (
                      <SelectItem key={cls} value={cls}>
                        {cls === "All" ? t("books.allClasses") : `${t("student.class")} ${cls}`}
                      </SelectItem>
                    ))}
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
                    <TableHead className="text-right text-xs sm:text-sm">{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBooks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        {t("books.noBooksFound")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBooks.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell className="text-xs sm:text-sm">{getBookName(book)}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{book.author}</TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          {book.class === "All" ? t("books.allClasses") : `${t("student.class")} ${book.class}`}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">{book.quantity}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{book.distributed}</TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          <span className={book.available > 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                            {book.available}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1 sm:gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDialog(book)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(book.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

