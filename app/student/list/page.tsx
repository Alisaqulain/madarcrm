"use client";

import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Plus, Edit, Trash2, Search, Filter, X, Download } from "lucide-react";
import { exportToExcel } from "@/lib/excel-export";
import { exportToPDF } from "@/lib/pdf-export";
import { extendedDummyStudents } from "@/data/dummy-data";
import { useLanguageStore } from "@/store/language-store";
import { fetchWithLang } from "@/lib/api-client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { FileSpreadsheet, FileText } from "lucide-react";

interface Student {
  id: string;
  studentId: string;
  name: string;
  fatherName: string;
  motherName?: string;
  class: string;
  section: string;
  dob: string;
  phone: string;
  monthlyFee?: string;
}

export default function StudentListPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { language } = useLanguageStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterSection, setFilterSection] = useState("");
  const [filterDob, setFilterDob] = useState<Date | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<Record<string, boolean>>({
    registrationNo: true,
    studentName: true,
    fatherName: true,
    class: true,
    section: true,
    mobileNumber: true,
    monthlyFee: true,
  });
  const [emptyColumns, setEmptyColumns] = useState<string>("0");
  const [emptyColumnNames, setEmptyColumnNames] = useState<string>("");
  const [exportClassFilter, setExportClassFilter] = useState<string>("all");
  const [exportFormat, setExportFormat] = useState<"excel" | "pdf">("excel");

  // Fetch students from API
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchWithLang("/api/students", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }

      const result = await response.json();
      
      // Handle API response format: { success: true, data: [...], message: "..." }
      let studentsData: Student[] = [];
      if (result.success && result.data) {
        studentsData = result.data;
      } else if (Array.isArray(result)) {
        studentsData = result;
      } else if (result.data && Array.isArray(result.data)) {
        studentsData = result.data;
      }
      
      // Map API students to our format
      const apiStudents: Student[] = studentsData.map((student: any) => ({
        id: student.id || student._id,
        studentId: student.studentId,
        name: student.name || "",
        fatherName: student.fatherName || "",
        motherName: student.motherName,
        class: student.class || "",
        section: student.section || "",
        dob: student.dob || "",
        phone: student.phone || "",
        monthlyFee: "1000",
      }));
      
      // Combine with dummy data for demo mode
      const dummyStudents: Student[] = extendedDummyStudents.map((student, index) => ({
        id: `dummy-${index}`,
        studentId: student.studentId,
        name: student.name[language] || student.name.en,
        fatherName: student.fatherName[language] || student.fatherName.en,
        motherName: student.motherName?.[language] || student.motherName?.en,
        class: student.class,
        section: student.section,
        dob: student.dob,
        phone: student.phone,
        monthlyFee: "1000",
      }));

      // Combine API students with dummy students, prioritizing API data
      const allStudents = [...apiStudents, ...dummyStudents];
      
      // Remove duplicates based on studentId (API data takes priority)
      const uniqueStudents = Array.from(
        new Map(allStudents.map(s => [s.studentId, s])).values()
      );

      setStudents(uniqueStudents);
    } catch (err: any) {
      console.error("Error fetching students:", err);
      setError(err.message || "Failed to load students");
      // Fallback to dummy data on error
      const dummyStudents: Student[] = extendedDummyStudents.map((student, index) => ({
        id: `dummy-${index}`,
        studentId: student.studentId,
        name: student.name[language] || student.name.en,
        fatherName: student.fatherName[language] || student.fatherName.en,
        motherName: student.motherName?.[language] || student.motherName?.en,
        class: student.class,
        section: student.section,
        dob: student.dob,
        phone: student.phone,
        monthlyFee: "1000",
      }));
      setStudents(dummyStudents);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [language]); // Re-fetch when language changes

  // Refresh when component mounts (e.g., when returning from add page)
  useEffect(() => {
    // Check if we should refresh (e.g., from URL params or sessionStorage)
    const shouldRefresh = sessionStorage.getItem('refreshStudentList');
    if (shouldRefresh === 'true') {
      fetchStudents();
      sessionStorage.removeItem('refreshStudentList');
    }
  }, []);

  // Get unique classes and sections for filters
  const uniqueClasses = useMemo(() => {
    const classes = new Set(students.map(s => s.class));
    return Array.from(classes).sort();
  }, [students]);

  const uniqueSections = useMemo(() => {
    const sections = new Set(students.map(s => s.section));
    return Array.from(sections).sort();
  }, [students]);

  // Format students for display
  const formattedStudents = useMemo(() => {
    return students.map((student) => {
      // Format class name - if it's a number, add "Class" prefix, otherwise use as is
      let classDisplay = student.class;
      if (/^\d+$/.test(student.class)) {
        // It's a number, add class label
        classDisplay = `${t("student.class")} ${student.class}`;
      }
      
      return {
        id: student.id,
        registrationNo: student.studentId,
        studentName: student.name,
        fatherName: student.fatherName,
        class: classDisplay,
        classRaw: student.class, // Keep raw class for filtering
        section: student.section,
        mobileNumber: student.phone,
        monthlyFee: student.monthlyFee || "1000",
        dob: student.dob,
      };
    });
  }, [students, t]);

  const filteredStudents = useMemo(() => {
    return formattedStudents.filter((student) => {
      // Text search
      const matchesSearch = !searchTerm || 
        student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.registrationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.fatherName.toLowerCase().includes(searchTerm.toLowerCase());

      // Class filter
      const matchesClass = !filterClass || student.classRaw === filterClass;

      // Section filter
      const matchesSection = !filterSection || student.section === filterSection;

      // DOB filter (if provided, match year and month)
      let matchesDob = true;
      if (filterDob) {
        const filterYear = filterDob.getFullYear();
        const filterMonth = filterDob.getMonth();
        const studentDob = new Date(student.dob);
        matchesDob = studentDob.getFullYear() === filterYear && 
                     studentDob.getMonth() === filterMonth;
      }

      return matchesSearch && matchesClass && matchesSection && matchesDob;
    });
  }, [formattedStudents, searchTerm, filterClass, filterSection, filterDob]);

  const handleEdit = (id: string | number) => {
    router.push(`/student/update/${id}`);
  };

  const handleDelete = async (id: string | number) => {
    if (confirm(t("common.confirmDelete"))) {
      try {
        const response = await fetchWithLang(`/api/students/${id}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (response.ok) {
          // Remove from local state
          setStudents(students.filter(s => s.id !== id));
          alert(t("common.deleted") || "Student deleted successfully");
        } else {
          const result = await response.json();
          alert(result.message || "Failed to delete student");
        }
      } catch (err: any) {
        console.error("Error deleting student:", err);
        alert(err.message || "Failed to delete student");
      }
    }
  };

  // Column definitions with labels
  const columnDefinitions = [
    { key: "registrationNo", label: t("student.registrationNo") || "Registration No" },
    { key: "studentName", label: t("student.studentName") || "Student Name" },
    { key: "fatherName", label: t("student.fatherName") || "Father Name" },
    { key: "class", label: t("student.class") || "Class" },
    { key: "section", label: t("student.section") || "Section" },
    { key: "mobileNumber", label: t("student.mobileNumber") || "Mobile Number" },
    { key: "monthlyFee", label: t("student.monthlyFees") || "Monthly Fees" },
  ];

  // Get students filtered by export class filter
  const getExportStudents = () => {
    if (exportClassFilter === "all") {
      return filteredStudents;
    }
    return filteredStudents.filter(s => s.classRaw === exportClassFilter);
  };

  const handleExport = () => {
    // Get selected columns in order
    const selectedCols = columnDefinitions.filter(col => selectedColumns[col.key]);
    
    // Validate that at least one column is selected
    if (selectedCols.length === 0) {
      alert(t("common.selectAtLeastOneColumn") || "Please select at least one column to export");
      return;
    }
    
    // Get students to export (filtered by class if selected)
    const studentsToExport = getExportStudents();
    
    if (studentsToExport.length === 0) {
      alert(t("common.noStudentsToExport") || "No students found to export");
      return;
    }
    
    // Build export data with only selected columns
    const exportData = studentsToExport.map((student) => {
      const row: Record<string, string> = {};
      selectedCols.forEach(col => {
        if (col.key === "monthlyFee") {
          row[col.label] = `₹${student.monthlyFee}`;
        } else {
          row[col.label] = String(student[col.key as keyof typeof student] || "");
        }
      });
      
      // Add empty columns with custom names
      const emptyColCount = parseInt(emptyColumns) || 0;
      if (emptyColCount > 0) {
        // Parse column names (comma-separated or use default names)
        const columnNames = emptyColumnNames
          .split(',')
          .map(name => name.trim())
          .filter(name => name.length > 0);
        
        for (let i = 1; i <= emptyColCount; i++) {
          // Use custom name if available, otherwise use default
          const columnName = columnNames[i - 1] || `Empty ${i}`;
          row[columnName] = "";
        }
      }
      
      return row;
    });
    
    const dateStr = new Date().toISOString().split('T')[0];
    const classStr = exportClassFilter !== "all" ? `-${exportClassFilter}` : "";
    const filename = `students-export${classStr}-${dateStr}`;
    
    if (exportFormat === "pdf") {
      const title = exportClassFilter !== "all" 
        ? `${t("student.list")} - ${t("student.class")} ${exportClassFilter}`
        : t("student.list");
      exportToPDF(exportData, filename, title);
    } else {
      exportToExcel(exportData, filename);
    }
    
    setShowExportDialog(false);
  };

  const handleColumnToggle = (columnKey: string) => {
    setSelectedColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <h1 className="text-2xl sm:text-3xl font-bold">{t("student.list")}</h1>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Download className="mr-2 h-4 w-4" />
                  {t("common.exportExcel") || "Export Excel"}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{t("common.customExport") || "Custom Export"}</DialogTitle>
                  <DialogDescription>
                    {t("common.selectColumnsExport") || "Select columns to export and add empty columns if needed"}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="export-format">
                      {t("common.exportFormat") || "Export Format"}
                    </Label>
                    <Select value={exportFormat} onValueChange={(value: "excel" | "pdf") => setExportFormat(value)}>
                      <SelectTrigger id="export-format" className="w-full">
                        <SelectValue placeholder={t("common.selectFormat") || "Select Format"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excel">
                          {t("common.excel") || "Excel"}
                        </SelectItem>
                        <SelectItem value="pdf">
                          {t("common.pdf") || "PDF"}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="export-class">
                      {t("common.filterByClass") || "Filter by Class"}
                    </Label>
                    <Select value={exportClassFilter} onValueChange={setExportClassFilter}>
                      <SelectTrigger id="export-class">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("books.allClasses") || "All Classes"}</SelectItem>
                        {uniqueClasses.map((cls) => (
                          <SelectItem key={cls} value={cls}>
                            {/^\d+$/.test(cls) ? `${t("student.class")} ${cls}` : cls}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      {t("common.selectColumns") || "Select Columns"}
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      {columnDefinitions.map((col) => (
                        <div key={col.key} className="flex items-center space-x-2">
                          <Checkbox
                            checked={selectedColumns[col.key]}
                            onChange={() => handleColumnToggle(col.key)}
                            id={`col-${col.key}`}
                          />
                          <Label
                            htmlFor={`col-${col.key}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {col.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="empty-columns">
                      {t("common.emptyColumns") || "Number of Empty Columns"}
                    </Label>
                    <Input
                      id="empty-columns"
                      type="number"
                      min="0"
                      value={emptyColumns}
                      onChange={(e) => {
                        setEmptyColumns(e.target.value);
                        // Clear column names if count is set to 0
                        if (parseInt(e.target.value) === 0) {
                          setEmptyColumnNames("");
                        }
                      }}
                      placeholder="0"
                    />
                    <p className="text-xs text-muted-foreground">
                      {t("common.emptyColumnsHint") || "Enter how many empty columns you want to add"}
                    </p>
                  </div>
                  {parseInt(emptyColumns) > 0 && (
                    <div className="space-y-2">
                      <Label htmlFor="empty-column-names">
                        {t("common.emptyColumnNames") || "Empty Column Names (Optional)"}
                      </Label>
                      <Input
                        id="empty-column-names"
                        type="text"
                        value={emptyColumnNames}
                        onChange={(e) => setEmptyColumnNames(e.target.value)}
                        placeholder={t("common.emptyColumnNamesPlaceholder") || "Column1, Column2, Column3 (comma-separated)"}
                      />
                      <p className="text-xs text-muted-foreground">
                        {t("common.emptyColumnNamesHint") || "Enter custom names for empty columns separated by commas. If not provided, default names (Empty 1, Empty 2, etc.) will be used."}
                      </p>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowExportDialog(false)}
                  >
                    {t("common.cancel") || "Cancel"}
                  </Button>
                  <Button onClick={handleExport}>
                    {exportFormat === "pdf" ? (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        {t("common.exportPDF") || "Export PDF"}
                      </>
                    ) : (
                      <>
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        {t("common.exportExcel") || "Export Excel"}
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button onClick={() => router.push("/student/add")} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              {t("student.add")}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder={t("common.search")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 text-sm sm:text-base"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  {t("common.filter") || "Filter"}
                </Button>
              </div>

              {showFilters && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
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
                          <SelectItem key={sec} value={sec}>
                            {sec}
                          </SelectItem>
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
                      type="button"
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
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            {loading ? (
              <div className="p-8 text-center">
                <p>{t("common.loading") || "Loading..."}</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">
                <p>{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  className="mt-4"
                  variant="outline"
                >
                  {t("common.retry") || "Retry"}
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">{t("student.registrationNo")}</TableHead>
                    <TableHead className="text-xs sm:text-sm">{t("student.studentName")}</TableHead>
                    <TableHead className="text-xs sm:text-sm">{t("student.fatherName")}</TableHead>
                    <TableHead className="text-xs sm:text-sm">{t("student.class")}</TableHead>
                    <TableHead className="text-xs sm:text-sm">{t("student.section")}</TableHead>
                    <TableHead className="text-xs sm:text-sm">{t("student.mobileNumber")}</TableHead>
                    <TableHead className="text-xs sm:text-sm">{t("student.monthlyFees")}</TableHead>
                    <TableHead className="text-right text-xs sm:text-sm">{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        {t("common.noStudentsFound")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="text-xs sm:text-sm">{student.registrationNo}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{student.studentName}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{student.fatherName}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{student.class}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{student.section}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{student.mobileNumber}</TableCell>
                        <TableCell className="text-xs sm:text-sm">₹{student.monthlyFee}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1 sm:gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(student.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(student.id)}
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
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

