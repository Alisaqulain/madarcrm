"use client";

import { useState, useMemo } from "react";
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
import { Utensils, Search, Settings, Plus, AlertTriangle, TrendingUp, Package, ShoppingCart } from "lucide-react";
import { useLanguageStore } from "@/store/language-store";
import { dummyKitchenItems, dummyKitchenConsumption, dummyKitchenStockIn } from "@/data/dummy-data";

export default function KitchenDashboardPage() {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Calculate dashboard stats
  const stats = useMemo(() => {
    const totalItems = dummyKitchenItems.length;
    const activeItems = dummyKitchenItems.filter(i => i.status === "Active").length;
    
    // Today's consumption
    const today = new Date().toISOString().split('T')[0];
    const todayConsumption = dummyKitchenConsumption
      .filter(c => c.date === today)
      .reduce((sum, c) => sum + c.quantity, 0);
    
    // Low stock items
    const lowStockItems = dummyKitchenItems.filter(
      item => item.status === "Active" && item.currentStock <= item.minStockLevel
    );
    
    // Total current stock value (simplified)
    const totalStockValue = dummyKitchenItems.reduce((sum, item) => sum + item.currentStock, 0);
    
    return {
      totalItems,
      activeItems,
      todayConsumption,
      lowStockCount: lowStockItems.length,
      lowStockItems,
      totalStockValue,
    };
  }, []);

  // Filter kitchen items
  const filteredItems = useMemo(() => {
    return dummyKitchenItems.filter((item) => {
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      const matchesSearch = !searchTerm || 
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemNameHi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemNameUr.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  // Get unique categories
  const uniqueCategories = Array.from(new Set(dummyKitchenItems.map(item => item.category)));

  // Get item name based on language
  const getItemName = (item: typeof dummyKitchenItems[0]) => {
    if (language === "hi") return item.itemNameHi;
    if (language === "ur") return item.itemNameUr;
    return item.itemName;
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <h1 className="text-2xl sm:text-3xl font-bold">{t("kitchen.kitchenDashboard") || "Kitchen Dashboard"}</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/kitchen/manage")}>
              <Settings className="mr-2 h-4 w-4" />
              {t("kitchen.manageItems") || "Manage Items"}
            </Button>
            <Button variant="outline" onClick={() => router.push("/kitchen/stock-in")}>
              <Plus className="mr-2 h-4 w-4" />
              {t("kitchen.addStockIn") || "Add Stock"}
            </Button>
            <Button variant="outline" onClick={() => router.push("/kitchen/consumption")}>
              <Plus className="mr-2 h-4 w-4" />
              {t("kitchen.addConsumption") || "Add Consumption"}
            </Button>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("kitchen.totalItems") || "Total Items"}</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalItems}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeItems} {t("kitchen.active") || "active"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("kitchen.todayConsumption") || "Today's Consumption"}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayConsumption.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">{t("kitchen.units") || "units consumed"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("kitchen.lowStockAlerts") || "Low Stock Alerts"}</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.lowStockCount}</div>
              <p className="text-xs text-muted-foreground">{t("kitchen.itemsNeedRestock") || "items need restock"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("kitchen.totalStock") || "Total Stock"}</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStockValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">{t("kitchen.totalUnits") || "total units"}</p>
            </CardContent>
          </Card>
        </div>

        {/* Low Stock Alerts */}
        {stats.lowStockItems.length > 0 && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2 text-yellow-800">
                <AlertTriangle className="h-5 w-5" />
                {t("kitchen.lowStockItems") || "Low Stock Items"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {stats.lowStockItems.map((item) => (
                  <div key={item.id} className="p-3 bg-white rounded-lg border border-yellow-300">
                    <div className="font-semibold text-sm">{getItemName(item)}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {t("kitchen.currentStock") || "Current"}: {item.currentStock} {item.unit} | {t("kitchen.minimum") || "Min"}: {item.minStockLevel} {item.unit}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stock Summary */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">{t("kitchen.stockSummary") || "Stock Summary"}</CardTitle>
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
                <Select value={selectedCategory || "all"} onValueChange={(value) => setSelectedCategory(value === "all" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("kitchen.allCategories") || "All Categories"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("kitchen.allCategories") || "All Categories"}</SelectItem>
                    {uniqueCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        {t("kitchen.noItemsFound") || "No items found"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredItems.map((item) => {
                      const isLowStock = item.currentStock <= item.minStockLevel;
                      const isOutOfStock = item.currentStock <= 0;
                      
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="text-xs sm:text-sm">{getItemName(item)}</TableCell>
                          <TableCell className="text-xs sm:text-sm">{item.category}</TableCell>
                          <TableCell className="text-xs sm:text-sm">{item.unit}</TableCell>
                          <TableCell className="text-xs sm:text-sm">
                            <span className={isOutOfStock ? "text-red-600 font-semibold" : isLowStock ? "text-yellow-600 font-semibold" : "text-green-600 font-semibold"}>
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
                            {isLowStock && (
                              <AlertTriangle className="inline-block h-3 w-3 ml-1 text-yellow-500" />
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
      </div>
    </DashboardLayout>
  );
}
