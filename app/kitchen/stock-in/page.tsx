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
import { DatePicker } from "@/components/ui/date-picker";
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
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { useLanguageStore } from "@/store/language-store";
import { dummyKitchenItems, dummyKitchenStockIn } from "@/data/dummy-data";
import type { DummyKitchenItem, DummyKitchenStockIn } from "@/data/dummy-data";

export default function KitchenStockInPage() {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const [stockInRecords, setStockInRecords] = useState<DummyKitchenStockIn[]>(dummyKitchenStockIn);
  const [items] = useState<DummyKitchenItem[]>(dummyKitchenItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSource, setFilterSource] = useState<"all" | "Purchase" | "Donation">("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DummyKitchenStockIn | null>(null);
  
  // Form state
  const [selectedItemId, setSelectedItemId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [source, setSource] = useState<"Purchase" | "Donation">("Purchase");
  const [vendorDonorName, setVendorDonorName] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [billNumber, setBillNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");

  // Filter records
  const filteredRecords = useMemo(() => {
    return stockInRecords.filter((record) => {
      const matchesSource = filterSource === "all" || record.source === filterSource;
      const matchesSearch = !searchTerm || 
        record.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.vendorDonorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (record.billNumber && record.billNumber.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSource && matchesSearch;
    });
  }, [stockInRecords, filterSource, searchTerm]);

  // Get item name based on language
  const getItemName = (item: DummyKitchenItem) => {
    if (language === "hi") return item.itemNameHi;
    if (language === "ur") return item.itemNameUr;
    return item.itemName;
  };

  const resetForm = () => {
    setSelectedItemId("");
    setQuantity("");
    setSource("Purchase");
    setVendorDonorName("");
    setDate(new Date());
    setBillNumber("");
    setAmount("");
    setRemarks("");
    setEditingRecord(null);
  };

  const handleOpenDialog = (record?: DummyKitchenStockIn) => {
    if (record) {
      setEditingRecord(record);
      setSelectedItemId(String(record.itemId));
      setQuantity(String(record.quantity));
      setSource(record.source);
      setVendorDonorName(record.vendorDonorName);
      setDate(new Date(record.date));
      setBillNumber(record.billNumber || "");
      setAmount(record.amount ? String(record.amount) : "");
      setRemarks(record.remarks || "");
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
    if (!selectedItemId || !quantity || !vendorDonorName || !date) {
      alert(t("kitchen.fillAllFields") || "Please fill all required fields");
      return;
    }

    const quantityNum = parseFloat(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      alert(t("kitchen.invalidQuantity") || "Please enter a valid quantity");
      return;
    }

    const item = items.find(i => i.id === parseInt(selectedItemId));
    if (!item) {
      alert(t("kitchen.invalidItem") || "Invalid item selection");
      return;
    }

    if (editingRecord) {
      // Update existing record
      setStockInRecords(stockInRecords.map(r => 
        r.id === editingRecord.id 
          ? {
              ...r,
              itemId: parseInt(selectedItemId),
              itemName: item.itemName,
              quantity: quantityNum,
              unit: item.unit,
              source,
              vendorDonorName,
              date: date.toISOString().split('T')[0],
              billNumber: billNumber || undefined,
              amount: amount ? parseFloat(amount) : undefined,
              remarks: remarks || undefined,
            }
          : r
      ));
      alert(t("kitchen.recordUpdated") || "Record updated successfully!");
    } else {
      // Add new record
      const newId = Math.max(...stockInRecords.map(r => r.id), 0) + 1;
      const newRecord: DummyKitchenStockIn = {
        id: newId,
        itemId: parseInt(selectedItemId),
        itemName: item.itemName,
        quantity: quantityNum,
        unit: item.unit,
        source,
        vendorDonorName,
        date: date.toISOString().split('T')[0],
        billNumber: billNumber || undefined,
        amount: amount ? parseFloat(amount) : undefined,
        remarks: remarks || undefined,
      };
      setStockInRecords([...stockInRecords, newRecord]);
      
      // Update item stock
      // In real app, this would be handled by backend
      alert(t("kitchen.stockAdded") || "Stock added successfully!");
    }

    handleCloseDialog();
  };

  const handleDelete = (id: number) => {
    if (confirm(t("common.confirmDelete") || "Are you sure you want to delete this record?")) {
      setStockInRecords(stockInRecords.filter(r => r.id !== id));
      alert(t("common.deleted") || "Record deleted successfully");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <h1 className="text-2xl sm:text-3xl font-bold">{t("kitchen.stockIn") || "Stock In (Purchase/Donation)"}</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                {t("kitchen.addStockIn") || "Add Stock In"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingRecord ? (t("kitchen.editStockIn") || "Edit Stock In") : (t("kitchen.addStockIn") || "Add Stock In")}
                </DialogTitle>
                <DialogDescription>
                  {editingRecord 
                    ? (t("kitchen.editStockInDescription") || "Update the stock entry below")
                    : (t("kitchen.addStockInDescription") || "Add new stock entry (Purchase or Donation)")
                  }
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="item">{t("kitchen.itemName")} <span className="text-red-500">*</span></Label>
                    <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                      <SelectTrigger id="item">
                        <SelectValue placeholder={t("kitchen.selectItem") || "Select Item"} />
                      </SelectTrigger>
                      <SelectContent>
                        {items.filter(i => i.status === "Active").map((item) => (
                          <SelectItem key={item.id} value={String(item.id)}>
                            {getItemName(item)} ({item.unit})
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
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder={t("kitchen.enterQuantity") || "Enter quantity"}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="source">{t("kitchen.source") || "Source"} <span className="text-red-500">*</span></Label>
                    <Select value={source} onValueChange={(value) => setSource(value as "Purchase" | "Donation")}>
                      <SelectTrigger id="source">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Purchase">{t("kitchen.purchase") || "Purchase"}</SelectItem>
                        <SelectItem value="Donation">{t("kitchen.donation") || "Donation"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vendorDonor">{source === "Purchase" ? (t("kitchen.vendorName") || "Vendor Name") : (t("kitchen.donorName") || "Donor Name")} <span className="text-red-500">*</span></Label>
                    <Input
                      id="vendorDonor"
                      value={vendorDonorName}
                      onChange={(e) => setVendorDonorName(e.target.value)}
                      placeholder={source === "Purchase" ? (t("kitchen.enterVendorName") || "Enter vendor name") : (t("kitchen.enterDonorName") || "Enter donor name")}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">{t("kitchen.date") || "Date"} <span className="text-red-500">*</span></Label>
                    <DatePicker
                      date={date}
                      onDateChange={setDate}
                    />
                  </div>

                  {source === "Purchase" && (
                    <div className="space-y-2">
                      <Label htmlFor="billNumber">{t("kitchen.billNumber") || "Bill Number"}</Label>
                      <Input
                        id="billNumber"
                        value={billNumber}
                        onChange={(e) => setBillNumber(e.target.value)}
                        placeholder={t("kitchen.enterBillNumber") || "Enter bill number"}
                      />
                    </div>
                  )}
                </div>

                {source === "Purchase" && (
                  <div className="space-y-2">
                    <Label htmlFor="amount">{t("kitchen.amount") || "Amount"}</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder={t("kitchen.enterAmount") || "Enter amount"}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="remarks">{t("kitchen.remarks") || "Remarks"}</Label>
                  <Input
                    id="remarks"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder={t("kitchen.enterRemarks") || "Enter remarks (optional)"}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleCloseDialog}>
                  {t("common.cancel") || "Cancel"}
                </Button>
                <Button onClick={handleSave}>
                  {editingRecord ? (t("common.update") || "Update") : (t("common.add") || "Add")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">{t("kitchen.stockInRecords") || "Stock In Records"}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("common.search")}</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder={t("kitchen.searchStockIn") || "Search by item, vendor, or bill number..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("kitchen.filterBySource") || "Filter by Source"}</Label>
                <Select value={filterSource} onValueChange={(value: "all" | "Purchase" | "Donation") => setFilterSource(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("kitchen.allSources") || "All Sources"}</SelectItem>
                    <SelectItem value="Purchase">{t("kitchen.purchase") || "Purchase"}</SelectItem>
                    <SelectItem value="Donation">{t("kitchen.donation") || "Donation"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">{t("kitchen.date") || "Date"}</TableHead>
                    <TableHead className="text-xs sm:text-sm">{t("kitchen.itemName") || "Item Name"}</TableHead>
                    <TableHead className="text-xs sm:text-sm">{t("kitchen.quantity") || "Quantity"}</TableHead>
                    <TableHead className="text-xs sm:text-sm">{t("kitchen.source") || "Source"}</TableHead>
                    <TableHead className="text-xs sm:text-sm">{t("kitchen.vendorDonor") || "Vendor/Donor"}</TableHead>
                    <TableHead className="text-xs sm:text-sm">{t("kitchen.amount") || "Amount"}</TableHead>
                    <TableHead className="text-right text-xs sm:text-sm">{t("common.actions") || "Actions"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        {t("kitchen.noRecordsFound") || "No records found"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="text-xs sm:text-sm">{new Date(record.date).toLocaleDateString()}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{record.itemName}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{record.quantity} {record.unit}</TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          <span className={`rounded-full px-2 py-1 text-xs ${
                            record.source === "Purchase"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}>
                            {record.source}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">{record.vendorDonorName}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{record.amount ? `₹${record.amount}` : "-"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1 sm:gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDialog(record)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(record.id)}
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



