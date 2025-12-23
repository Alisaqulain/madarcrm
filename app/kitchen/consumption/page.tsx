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
import { Plus, Search, Edit, Trash2, AlertTriangle } from "lucide-react";
import { useLanguageStore } from "@/store/language-store";
import { dummyKitchenItems, dummyKitchenConsumption } from "@/data/dummy-data";
import type { DummyKitchenItem, DummyKitchenConsumption } from "@/data/dummy-data";

export default function KitchenConsumptionPage() {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const [consumptionRecords, setConsumptionRecords] = useState<DummyKitchenConsumption[]>(dummyKitchenConsumption);
  const [items] = useState<DummyKitchenItem[]>(dummyKitchenItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DummyKitchenConsumption | null>(null);
  
  // Form state
  const [selectedItemId, setSelectedItemId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [remarks, setRemarks] = useState("");

  // Filter records
  const filteredRecords = useMemo(() => {
    return consumptionRecords.filter((record) => {
      const matchesDate = !filterDate || record.date === filterDate;
      const matchesSearch = !searchTerm || 
        record.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (record.remarks && record.remarks.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesDate && matchesSearch;
    });
  }, [consumptionRecords, filterDate, searchTerm]);

  // Get item name based on language
  const getItemName = (item: DummyKitchenItem) => {
    if (language === "hi") return item.itemNameHi;
    if (language === "ur") return item.itemNameUr;
    return item.itemName;
  };

  // Check stock status
  const getStockStatus = (itemId: number, quantity: number) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return null;
    
    const remainingAfter = item.currentStock - quantity;
    
    if (remainingAfter < 0) {
      return { type: "error", message: t("kitchen.outOfStock") || "Out of Stock" };
    } else if (remainingAfter < item.minStockLevel) {
      return { type: "warning", message: t("kitchen.lowStock") || "Low Stock" };
    }
    return null;
  };

  const resetForm = () => {
    setSelectedItemId("");
    setQuantity("");
    setDate(new Date());
    setRemarks("");
    setEditingRecord(null);
  };

  const handleOpenDialog = (record?: DummyKitchenConsumption) => {
    if (record) {
      setEditingRecord(record);
      setSelectedItemId(String(record.itemId));
      setQuantity(String(record.quantity));
      setDate(new Date(record.date));
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
    if (!selectedItemId || !quantity || !date) {
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

    // Check stock availability
    if (item.currentStock < quantityNum) {
      alert(t("kitchen.insufficientStock") || `Insufficient stock. Available: ${item.currentStock} ${item.unit}`);
      return;
    }

    if (editingRecord) {
      // Update existing record
      setConsumptionRecords(consumptionRecords.map(r => 
        r.id === editingRecord.id 
          ? {
              ...r,
              itemId: parseInt(selectedItemId),
              itemName: item.itemName,
              quantity: quantityNum,
              unit: item.unit,
              date: date.toISOString().split('T')[0],
              remarks: remarks || undefined,
            }
          : r
      ));
      alert(t("kitchen.recordUpdated") || "Record updated successfully!");
    } else {
      // Add new record
      const newId = Math.max(...consumptionRecords.map(r => r.id), 0) + 1;
      const newRecord: DummyKitchenConsumption = {
        id: newId,
        date: date.toISOString().split('T')[0],
        itemId: parseInt(selectedItemId),
        itemName: item.itemName,
        quantity: quantityNum,
        unit: item.unit,
        remarks: remarks || undefined,
      };
      setConsumptionRecords([...consumptionRecords, newRecord]);
      
      // Update item stock (in real app, this would be handled by backend)
      // item.currentStock -= quantityNum;
      // item.totalConsumed += quantityNum;
      
      alert(t("kitchen.consumptionAdded") || "Consumption recorded successfully!");
    }

    handleCloseDialog();
  };

  const handleDelete = (id: number) => {
    if (confirm(t("common.confirmDelete") || "Are you sure you want to delete this record?")) {
      setConsumptionRecords(consumptionRecords.filter(r => r.id !== id));
      alert(t("common.deleted") || "Record deleted successfully");
    }
  };

  // Get selected item for stock check
  const selectedItem = selectedItemId ? items.find(i => i.id === parseInt(selectedItemId)) : null;
  const stockWarning = selectedItem && quantity ? getStockStatus(selectedItem.id, parseFloat(quantity) || 0) : null;

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <h1 className="text-2xl sm:text-3xl font-bold">{t("kitchen.dailyConsumption") || "Daily Consumption Entry"}</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                {t("kitchen.addConsumption") || "Add Consumption"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingRecord ? (t("kitchen.editConsumption") || "Edit Consumption") : (t("kitchen.addConsumption") || "Add Consumption")}
                </DialogTitle>
                <DialogDescription>
                  {editingRecord 
                    ? (t("kitchen.editConsumptionDescription") || "Update the consumption entry below")
                    : (t("kitchen.addConsumptionDescription") || "Record daily kitchen consumption. Example: If Rice stock is 50kg and you use 10kg today, enter 10kg. Stock will automatically reduce to 40kg.")
                  }
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">{t("kitchen.date") || "Date"} <span className="text-red-500">*</span></Label>
                    <DatePicker
                      date={date}
                      onDateChange={setDate}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="item">{t("kitchen.itemName")} <span className="text-red-500">*</span></Label>
                    <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                      <SelectTrigger id="item">
                        <SelectValue placeholder={t("kitchen.selectItem") || "Select Item"} />
                      </SelectTrigger>
                      <SelectContent>
                        {items.filter(i => i.status === "Active").map((item) => (
                          <SelectItem key={item.id} value={String(item.id)}>
                            {getItemName(item)} ({item.currentStock} {item.unit} {t("kitchen.available") || "available"})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
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
                  {selectedItem && (
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>
                        <strong>{t("kitchen.currentStock") || "Current Stock"}:</strong> {selectedItem.currentStock} {selectedItem.unit}
                      </p>
                      <p className="text-blue-600">
                        {t("kitchen.stockAfterConsumption") || "After consumption, stock will be"}: {selectedItem.currentStock - (parseFloat(quantity) || 0)} {selectedItem.unit}
                      </p>
                    </div>
                  )}
                  {stockWarning && (
                    <div className={`flex items-center gap-2 p-2 rounded text-xs ${
                      stockWarning.type === "error" ? "bg-red-50 text-red-800" : "bg-yellow-50 text-yellow-800"
                    }`}>
                      <AlertTriangle className="h-4 w-4" />
                      {stockWarning.message}
                    </div>
                  )}
                </div>

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
                <Button onClick={handleSave} disabled={!!stockWarning && stockWarning.type === "error"}>
                  {editingRecord ? (t("common.update") || "Update") : (t("common.add") || "Add")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">{t("kitchen.consumptionRecords") || "Consumption Records"}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("common.search")}</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder={t("kitchen.searchConsumption") || "Search by item or remarks..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("kitchen.filterByDate") || "Filter by Date"}</Label>
                <Input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">{t("kitchen.date") || "Date"}</TableHead>
                    <TableHead className="text-xs sm:text-sm">{t("kitchen.itemName") || "Item Name"}</TableHead>
                    <TableHead className="text-xs sm:text-sm">{t("kitchen.quantity") || "Quantity"}</TableHead>
                    <TableHead className="text-xs sm:text-sm">{t("kitchen.remarks") || "Remarks"}</TableHead>
                    <TableHead className="text-right text-xs sm:text-sm">{t("common.actions") || "Actions"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        {t("kitchen.noRecordsFound") || "No records found"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRecords.map((record) => {
                      const stockStatus = getStockStatus(record.itemId, record.quantity);
                      return (
                        <TableRow key={record.id}>
                          <TableCell className="text-xs sm:text-sm">{new Date(record.date).toLocaleDateString()}</TableCell>
                          <TableCell className="text-xs sm:text-sm">{record.itemName}</TableCell>
                          <TableCell className="text-xs sm:text-sm">
                            <div className="flex items-center gap-2">
                              {record.quantity} {record.unit}
                              {stockStatus && (
                                <AlertTriangle className={`h-3 w-3 ${
                                  stockStatus.type === "error" ? "text-red-500" : "text-yellow-500"
                                }`} />
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm">{record.remarks || "-"}</TableCell>
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
                      );
                    })
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

