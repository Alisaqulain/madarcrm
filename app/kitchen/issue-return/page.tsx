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
import { Search, Utensils, Package, Plus } from "lucide-react";
import { useLanguageStore } from "@/store/language-store";
import { dummyKitchenItems, dummyKitchenDistributions, extendedDummyStudents } from "@/data/dummy-data";
import type { DummyKitchenItem, DummyKitchenDistribution } from "@/data/dummy-data";

export default function KitchenIssueReturnPage() {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const [activeTab, setActiveTab] = useState<"issue" | "return">("issue");
  const [rollNumber, setRollNumber] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [issueDate, setIssueDate] = useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "Issued" | "Returned">("all");
  
  // State management for items and distributions
  const [items, setItems] = useState<DummyKitchenItem[]>(dummyKitchenItems);
  const [distributions, setDistributions] = useState<DummyKitchenDistribution[]>(dummyKitchenDistributions);

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

  // Get items with current state
  const availableItems = useMemo(() => {
    return items.map(item => ({
      id: item.id,
      name: language === "hi" ? item.itemNameHi : language === "ur" ? item.itemNameUr : item.itemName,
      category: item.category,
      unit: item.unit,
      available: item.currentStock,
      itemData: item,
    }));
  }, [items, language]);

  // Filter distributions
  const filteredDistributions = useMemo(() => {
    let filtered = distributions;
    
    if (filterStatus !== "all") {
      filtered = filtered.filter(d => d.status === filterStatus);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(d => {
        const student = extendedDummyStudents.find(s => s.studentId === d.studentId);
        const studentName = student ? (student.name[language] || student.name.en) : d.studentName;
        
        return studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.itemName.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
    
    return filtered;
  }, [distributions, filterStatus, searchTerm, language]);

  const handleSearchStudent = () => {
    if (!rollNumber.trim()) {
      alert(t("kitchen.pleaseEnterRollNumber") || "Please enter a roll number");
      return;
    }
    
    const searchTerm = rollNumber.trim();
    const searchTermLower = searchTerm.toLowerCase();
    
    let found = students.find(s => s.rollNo.toLowerCase() === searchTermLower);
    
    if (!found) {
      if (/^\d+$/.test(searchTerm)) {
        const padded4 = `NET${searchTerm.padStart(4, '0')}`;
        const padded3 = `NET${searchTerm.padStart(3, '0')}`;
        const paddedFull = `NET${searchTerm}`;
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
      
      if (!found && searchTermLower.startsWith('net')) {
        const withoutPrefix = searchTermLower.replace(/^net/, '');
        found = students.find(s => {
          const rollLower = s.rollNo.toLowerCase();
          return rollLower.replace(/^net/, '') === withoutPrefix ||
                 rollLower === searchTermLower;
        });
      }
    }
    
    if (found) {
      setSelectedStudent(found);
    } else {
      alert(t("cards.studentNotFound") || `Student not found with roll number: ${rollNumber}`);
      setSelectedStudent(null);
    }
  };

  const handleIssueItem = () => {
    if (!selectedStudent) {
      alert(t("kitchen.pleaseSelectStudent") || "Please search and select a student first");
      return;
    }
    
    if (!selectedItem) {
      alert(t("kitchen.pleaseSelectItem") || "Please select an item");
      return;
    }

    if (!quantity || parseFloat(quantity) <= 0) {
      alert(t("kitchen.pleaseEnterQuantity") || "Please enter a valid quantity");
      return;
    }
    
    const finalIssueDate = issueDate || new Date();
    
    const itemId = parseInt(selectedItem);
    if (isNaN(itemId)) {
      alert(t("kitchen.invalidItem") || "Invalid item selection");
      return;
    }
    
    const itemData = items.find(i => i.id === itemId);
    if (!itemData || itemData.currentStock < parseFloat(quantity)) {
      alert(t("kitchen.itemNotAvailable") || "Item is not available in sufficient quantity");
      return;
    }
    
    const newDistributionId = Math.max(...distributions.map(d => d.id), 0) + 1;
    const newDistribution: DummyKitchenDistribution = {
      id: newDistributionId,
      studentId: selectedStudent.rollNo,
      studentName: selectedStudent.name,
      itemId: itemId,
      itemName: itemData.itemName,
      quantity: parseFloat(quantity),
      unit: itemData.unit,
      distributedDate: finalIssueDate.toISOString().split('T')[0],
      status: "Issued",
    };
    
    setDistributions(prev => [...prev, newDistribution]);
    setItems(prev => prev.map(i =>
      i.id === itemId
        ? { 
            ...i, 
            currentStock: i.currentStock - parseFloat(quantity),
            totalConsumed: (i.totalConsumed || 0) + parseFloat(quantity)
          }
        : i
    ));
    
    alert(t("kitchen.itemIssuedSuccess") || "Item issued successfully!");
    setSelectedStudent(null);
    setSelectedItem("");
    setQuantity("");
    setRollNumber("");
    setIssueDate(new Date());
  };

  const handleReturnItem = (distributionId: number) => {
    if (confirm(t("kitchen.confirmReturn") || "Are you sure you want to return this item?")) {
      const distribution = distributions.find(d => d.id === distributionId);
      if (!distribution) return;
      
      setDistributions(distributions.map(d => 
        d.id === distributionId
          ? {
              ...d,
              status: "Returned" as const,
              returnDate: new Date().toISOString().split('T')[0],
            }
          : d
      ));
      
      setItems(items.map(i =>
        i.id === distribution.itemId
          ? {
              ...i,
              currentStock: i.currentStock + distribution.quantity,
              totalConsumed: Math.max(0, (i.totalConsumed || 0) - distribution.quantity),
            }
          : i
      ));
      
      alert(t("kitchen.itemReturnedSuccess") || "Item returned successfully!");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold">{t("kitchen.issueReturn") || "Kitchen Issue & Return"}</h1>

        {/* Tabs */}
        <div className="flex gap-2 border-b">
          <Button
            variant={activeTab === "issue" ? "default" : "ghost"}
            onClick={() => setActiveTab("issue")}
            className="rounded-b-none"
          >
            <Utensils className="h-4 w-4 mr-2" />
            {t("kitchen.issueItem") || "Issue Item"}
          </Button>
          <Button
            variant={activeTab === "return" ? "default" : "ghost"}
            onClick={() => setActiveTab("return")}
            className="rounded-b-none"
          >
            <Package className="h-4 w-4 mr-2" />
            {t("kitchen.returnItem") || "Return Item"}
          </Button>
        </div>

        {/* Issue Item Section */}
        {activeTab === "issue" && (
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">{t("kitchen.issueItem") || "Issue Item"}</CardTitle>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="item">{t("kitchen.itemName")} <span className="text-red-500">*</span></Label>
                  <Select value={selectedItem} onValueChange={setSelectedItem}>
                    <SelectTrigger id="item">
                      <SelectValue placeholder={t("kitchen.selectItem") || "Select Item"} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableItems.filter(i => i.available > 0).map((item) => (
                        <SelectItem key={item.id} value={String(item.id)}>
                          {item.name} ({t("kitchen.available")}: {item.available} {item.unit})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">{t("kitchen.quantity")} <span className="text-red-500">*</span></Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder={t("kitchen.enterQuantity") || "Enter quantity"}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="issueDate">{t("kitchen.issueDate") || "Issue Date"} <span className="text-red-500">*</span></Label>
                <DatePicker
                  date={issueDate}
                  onDateChange={(date) => {
                    setIssueDate(date || new Date());
                  }}
                />
              </div>

              <div className="space-y-2">
                <Button 
                  onClick={handleIssueItem}
                  className="w-full sm:w-auto"
                  disabled={!selectedStudent || !selectedItem || !quantity}
                  type="button"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t("kitchen.issueItem") || "Issue Item"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Return Item / Records Section */}
        {activeTab === "return" && (
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">{t("kitchen.distributionRecords") || "Distribution Records"}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("common.search")}</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder={t("kitchen.searchByStudentOrItem") || "Search by student or item..."}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t("kitchen.filterByStatus") || "Filter by Status"}</Label>
                  <Select value={filterStatus} onValueChange={(value: "all" | "Issued" | "Returned") => setFilterStatus(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("kitchen.allStatus") || "All Status"}</SelectItem>
                      <SelectItem value="Issued">{t("kitchen.issued") || "Issued"}</SelectItem>
                      <SelectItem value="Returned">{t("kitchen.returned") || "Returned"}</SelectItem>
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
                      <TableHead className="text-xs sm:text-sm">{t("kitchen.itemName")}</TableHead>
                      <TableHead className="text-xs sm:text-sm">{t("kitchen.quantity")}</TableHead>
                      <TableHead className="text-xs sm:text-sm">{t("kitchen.issueDate") || "Issue Date"}</TableHead>
                      <TableHead className="text-xs sm:text-sm">{t("kitchen.returnDate") || "Return Date"}</TableHead>
                      <TableHead className="text-xs sm:text-sm">{t("fees.status")}</TableHead>
                      <TableHead className="text-right text-xs sm:text-sm">{t("common.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDistributions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center">
                          {t("kitchen.noRecordsFound") || "No records found"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDistributions.map((distribution) => {
                        const student = extendedDummyStudents.find(s => s.studentId === distribution.studentId);
                        const studentName = student ? (student.name[language] || student.name.en) : distribution.studentName;
                        const statusText = distribution.status === "Issued" ? t("kitchen.issued") || "Issued" : t("kitchen.returned") || "Returned";
                        
                        return (
                          <TableRow key={distribution.id}>
                            <TableCell className="text-xs sm:text-sm">{studentName}</TableCell>
                            <TableCell className="text-xs sm:text-sm">{distribution.studentId}</TableCell>
                            <TableCell className="text-xs sm:text-sm">{distribution.itemName}</TableCell>
                            <TableCell className="text-xs sm:text-sm">{distribution.quantity} {distribution.unit}</TableCell>
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
                                  onClick={() => handleReturnItem(distribution.id)}
                                  className="h-8"
                                >
                                  {t("kitchen.returnItem") || "Return"}
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

