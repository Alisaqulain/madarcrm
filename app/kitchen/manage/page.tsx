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
import { Plus, Edit, Trash2, Search, AlertTriangle } from "lucide-react";
import { useLanguageStore } from "@/store/language-store";
import { dummyKitchenItems } from "@/data/dummy-data";
import type { DummyKitchenItem } from "@/data/dummy-data";

export default function KitchenManagePage() {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const [items, setItems] = useState<DummyKitchenItem[]>(dummyKitchenItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DummyKitchenItem | null>(null);
  
  // Form state
  const [itemName, setItemName] = useState("");
  const [itemNameHi, setItemNameHi] = useState("");
  const [itemNameUr, setItemNameUr] = useState("");
  const [category, setCategory] = useState("");
  const [unit, setUnit] = useState("");
  const [openingStock, setOpeningStock] = useState("");
  const [minStockLevel, setMinStockLevel] = useState("");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");

  // Get unique categories
  const uniqueCategories = useMemo(() => {
    const categories = new Set(items.map(i => i.category));
    return Array.from(categories).sort();
  }, [items]);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = !filterCategory || item.category === filterCategory;
      const matchesSearch = !searchTerm || 
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemNameHi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemNameUr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [items, filterCategory, searchTerm]);

  // Get item name based on language
  const getItemName = (item: DummyKitchenItem) => {
    if (language === "hi") return item.itemNameHi;
    if (language === "ur") return item.itemNameUr;
    return item.itemName;
  };

  const resetForm = () => {
    setItemName("");
    setItemNameHi("");
    setItemNameUr("");
    setCategory("");
    setUnit("");
    setOpeningStock("");
    setMinStockLevel("");
    setStatus("Active");
    setEditingItem(null);
  };

  const handleOpenDialog = (item?: DummyKitchenItem) => {
    if (item) {
      setEditingItem(item);
      setItemName(item.itemName);
      setItemNameHi(item.itemNameHi);
      setItemNameUr(item.itemNameUr);
      setCategory(item.category);
      setUnit(item.unit);
      setOpeningStock(item.openingStock.toString());
      setMinStockLevel(item.minStockLevel.toString());
      setStatus(item.status);
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
    if (!itemName || !itemNameHi || !itemNameUr || !category || !unit || !openingStock || !minStockLevel) {
      alert(t("kitchen.fillAllFields") || "Please fill all fields");
      return;
    }

    const openingStockNum = parseFloat(openingStock);
    const minStockNum = parseFloat(minStockLevel);
    
    if (isNaN(openingStockNum) || openingStockNum < 0) {
      alert(t("kitchen.invalidQuantity") || "Please enter a valid opening stock");
      return;
    }
    
    if (isNaN(minStockNum) || minStockNum < 0) {
      alert(t("kitchen.invalidMinStock") || "Please enter a valid minimum stock level");
      return;
    }

    if (editingItem) {
      // Update existing item
      setItems(items.map(i => 
        i.id === editingItem.id 
          ? {
              ...i,
              itemName,
              itemNameHi,
              itemNameUr,
              category,
              unit,
              openingStock: openingStockNum,
              currentStock: openingStockNum, // Reset current stock to opening stock when editing
              minStockLevel: minStockNum,
              status,
            }
          : i
      ));
      alert(t("kitchen.itemUpdated") || "Item updated successfully!");
    } else {
      // Add new item
      const newId = Math.max(...items.map(i => i.id), 0) + 1;
      const newItem: DummyKitchenItem = {
        id: newId,
        itemName,
        itemNameHi,
        itemNameUr,
        category,
        unit,
        openingStock: openingStockNum,
        currentStock: openingStockNum,
        minStockLevel: minStockNum,
        status,
        totalPurchased: 0,
        totalConsumed: 0,
      };
      setItems([...items, newItem]);
      alert(t("kitchen.itemAdded") || "Item added successfully!");
    }

    handleCloseDialog();
  };

  const handleDelete = (id: number) => {
    if (confirm(t("common.confirmDelete") || "Are you sure you want to delete this item?")) {
      setItems(items.filter(i => i.id !== id));
      alert(t("common.deleted") || "Item deleted successfully");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <h1 className="text-2xl sm:text-3xl font-bold">{t("kitchen.manageItems") || "Manage Kitchen Items"}</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                {t("kitchen.addItem") || "Add Item"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? (t("kitchen.editItem") || "Edit Item") : (t("kitchen.addItem") || "Add Item")}
                </DialogTitle>
                <DialogDescription>
                  {editingItem 
                    ? (t("kitchen.editItemDescription") || "Update the item information below")
                    : (t("kitchen.addItemDescription") || "Fill in the item information below")
                  }
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="itemName">{t("kitchen.itemName")} (English) <span className="text-red-500">*</span></Label>
                    <Input
                      id="itemName"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      placeholder={t("kitchen.enterItemName") || "Enter item name"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="itemNameHi">{t("kitchen.itemName")} (Hindi) <span className="text-red-500">*</span></Label>
                    <Input
                      id="itemNameHi"
                      value={itemNameHi}
                      onChange={(e) => setItemNameHi(e.target.value)}
                      placeholder={t("kitchen.enterItemName") || "Enter item name"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="itemNameUr">{t("kitchen.itemName")} (Urdu) <span className="text-red-500">*</span></Label>
                    <Input
                      id="itemNameUr"
                      value={itemNameUr}
                      onChange={(e) => setItemNameUr(e.target.value)}
                      placeholder={t("kitchen.enterItemName") || "Enter item name"}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">{t("kitchen.category")} <span className="text-red-500">*</span></Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder={t("kitchen.selectCategory") || "Select category"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Grain">{t("kitchen.grain") || "Grain"}</SelectItem>
                        <SelectItem value="Pulse">{t("kitchen.pulse") || "Pulse"}</SelectItem>
                        <SelectItem value="Oil">{t("kitchen.oil") || "Oil"}</SelectItem>
                        <SelectItem value="Spice">{t("kitchen.spice") || "Spice"}</SelectItem>
                        <SelectItem value="Sweetener">{t("kitchen.sweetener") || "Sweetener"}</SelectItem>
                        <SelectItem value="Beverage">{t("kitchen.beverage") || "Beverage"}</SelectItem>
                        <SelectItem value="Vegetable">{t("kitchen.vegetable") || "Vegetable"}</SelectItem>
                        <SelectItem value="Other">{t("kitchen.other") || "Other"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">{t("kitchen.unit")} <span className="text-red-500">*</span></Label>
                    <Select value={unit} onValueChange={setUnit}>
                      <SelectTrigger id="unit">
                        <SelectValue placeholder={t("kitchen.selectUnit") || "Select unit"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">{t("kitchen.kg") || "kg"}</SelectItem>
                        <SelectItem value="gram">{t("kitchen.gram") || "gram"}</SelectItem>
                        <SelectItem value="liter">{t("kitchen.liter") || "liter"}</SelectItem>
                        <SelectItem value="ml">{t("kitchen.ml") || "ml"}</SelectItem>
                        <SelectItem value="piece">{t("kitchen.piece") || "piece"}</SelectItem>
                        <SelectItem value="packet">{t("kitchen.packet") || "packet"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="openingStock">{t("kitchen.openingStock") || "Opening Stock"} <span className="text-red-500">*</span></Label>
                    <Input
                      id="openingStock"
                      type="number"
                      min="0"
                      step="0.01"
                      value={openingStock}
                      onChange={(e) => setOpeningStock(e.target.value)}
                      placeholder={t("kitchen.enterOpeningStock") || "Enter opening stock"}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minStockLevel">{t("kitchen.minimumStockLevel") || "Minimum Stock Level"} <span className="text-red-500">*</span></Label>
                    <Input
                      id="minStockLevel"
                      type="number"
                      min="0"
                      step="0.01"
                      value={minStockLevel}
                      onChange={(e) => setMinStockLevel(e.target.value)}
                      placeholder={t("kitchen.enterMinStock") || "Enter minimum stock level for alerts"}
                    />
                    <p className="text-xs text-muted-foreground">
                      {t("kitchen.minStockHint") || "System will alert when stock falls below this level"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">{t("kitchen.status") || "Status"} <span className="text-red-500">*</span></Label>
                    <Select value={status} onValueChange={(value) => setStatus(value as "Active" | "Inactive")}>
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">{t("kitchen.active") || "Active"}</SelectItem>
                        <SelectItem value="Inactive">{t("kitchen.inactive") || "Inactive"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {editingItem && (
                  <div className="p-3 bg-blue-50 rounded-lg text-sm">
                    <p className="font-semibold mb-1">{t("kitchen.currentStockInfo") || "Current Stock Information"}:</p>
                    <p>{t("kitchen.currentStock") || "Current Stock"}: {editingItem.currentStock} {editingItem.unit}</p>
                    <p>{t("kitchen.totalPurchased") || "Total Purchased"}: {editingItem.totalPurchased} {editingItem.unit}</p>
                    <p>{t("kitchen.totalConsumed") || "Total Consumed"}: {editingItem.totalConsumed} {editingItem.unit}</p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleCloseDialog}>
                  {t("common.cancel") || "Cancel"}
                </Button>
                <Button onClick={handleSave}>
                  {editingItem ? (t("common.update") || "Update") : (t("common.add") || "Add")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">{t("kitchen.itemsInventory") || "Items Inventory"}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("kitchen.searchItems") || "Search Items"}</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder={t("kitchen.searchItems") || "Search Items"}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("kitchen.filterByCategory") || "Filter by Category"}</Label>
                <Select value={filterCategory || "all"} onValueChange={(value) => setFilterCategory(value === "all" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("kitchen.allCategories") || "All Categories"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("kitchen.allCategories") || "All Categories"}</SelectItem>
                    {uniqueCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
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
                    <TableHead className="text-xs sm:text-sm">{t("kitchen.itemName") || "Item Name"}</TableHead>
                    <TableHead className="text-xs sm:text-sm">{t("kitchen.category") || "Category"}</TableHead>
                    <TableHead className="text-xs sm:text-sm">{t("kitchen.unit") || "Unit"}</TableHead>
                    <TableHead className="text-xs sm:text-sm">{t("kitchen.currentStock") || "Current Stock"}</TableHead>
                    <TableHead className="text-xs sm:text-sm">{t("kitchen.minimumStock") || "Min Stock"}</TableHead>
                    <TableHead className="text-xs sm:text-sm">{t("kitchen.status") || "Status"}</TableHead>
                    <TableHead className="text-right text-xs sm:text-sm">{t("common.actions") || "Actions"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        {t("kitchen.noItemsFound") || "No items found"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-xs sm:text-sm">{getItemName(item)}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{item.category}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{item.unit}</TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          <span className={item.currentStock > item.minStockLevel ? "text-green-600 font-semibold" : item.currentStock > 0 ? "text-yellow-600 font-semibold" : "text-red-600 font-semibold"}>
                            {item.currentStock}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">{item.minStockLevel}</TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          <span className={`rounded-full px-2 py-1 text-xs ${
                            item.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {item.status}
                          </span>
                          {item.currentStock <= item.minStockLevel && item.status === "Active" && (
                            <AlertTriangle className="inline-block h-3 w-3 ml-1 text-yellow-500" />
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1 sm:gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDialog(item)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(item.id)}
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

