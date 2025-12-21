"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, Database, Trash2, RotateCcw } from "lucide-react";
import { useLanguageStore } from "@/store/language-store";

interface DemoModeToggleProps {
  tenantId: string;
}

export function DemoModeToggle({ tenantId }: DemoModeToggleProps) {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const [demoMode, setDemoMode] = useState(false);
  const [demoDataLoaded, setDemoDataLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchDemoStatus();
  }, [tenantId]);

  const fetchDemoStatus = async () => {
    try {
      const response = await fetch(`/api/tenant/demo?tenantId=${tenantId}`);
      const data = await response.json();
      if (response.ok) {
        setDemoMode(data.demoMode || false);
        setDemoDataLoaded(data.demoDataLoaded || false);
      }
    } catch (error) {
      console.error("Error fetching demo status:", error);
    }
  };

  const handleToggle = async (enabled: boolean) => {
    setLoading(true);
    try {
      const response = await fetch("/api/tenant/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId,
          action: enabled ? "enable" : "disable",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setDemoMode(enabled);
        if (enabled && !demoDataLoaded) {
          setDemoDataLoaded(true);
        }
      } else {
        alert(data.error || "Failed to toggle demo mode");
      }
    } catch (error) {
      console.error("Error toggling demo mode:", error);
      alert("Failed to toggle demo mode");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: string) => {
    setActionLoading(action);
    try {
      const response = await fetch("/api/tenant/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId, action }),
      });

      const data = await response.json();
      if (response.ok) {
        if (action === "clear") {
          setDemoDataLoaded(false);
        } else if (action === "load" || action === "reset") {
          setDemoDataLoaded(true);
        }
        alert(data.message || "Action completed successfully");
        await fetchDemoStatus();
      } else {
        alert(data.error || "Action failed");
      }
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
      alert(`Failed to ${action} demo data`);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-blue-600" />
          {language === "ur" ? "ڈیمو موڈ" : language === "hi" ? "डेमो मोड" : "Demo Mode"}
        </CardTitle>
        <CardDescription>
          {language === "ur"
            ? "پریزنٹیشن اور ٹیسٹنگ کے لیے ڈمی ڈیٹا کو چالو/بند کریں"
            : language === "hi"
            ? "प्रस्तुति और परीक्षण के लिए डमी डेटा सक्षम/अक्षम करें"
            : "Enable/disable dummy data for presentations and testing"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="demo-mode" className="text-base font-semibold">
              {language === "ur"
                ? "ڈیمو موڈ"
                : language === "hi"
                ? "डेमो मोड"
                : "Demo Mode"}
            </Label>
            <p className="text-sm text-muted-foreground">
              {demoMode
                ? language === "ur"
                  ? "فعال - تمام ڈیٹا ڈمی ڈیٹا ہے"
                  : language === "hi"
                  ? "सक्रिय - सभी डेटा डमी डेटा है"
                  : "Active - All data is demo data"
                : language === "ur"
                ? "غیر فعال - حقیقی ڈیٹا استعمال ہو رہا ہے"
                : language === "hi"
                ? "निष्क्रिय - वास्तविक डेटा उपयोग में है"
                : "Inactive - Real data is being used"}
            </p>
          </div>
          <Switch
            id="demo-mode"
            checked={demoMode}
            onCheckedChange={handleToggle}
            disabled={loading}
          />
        </div>

        {demoDataLoaded && (
          <div className="rounded-lg bg-green-50 p-3 border border-green-200">
            <p className="text-sm text-green-800 font-medium">
              {language === "ur"
                ? "✅ ڈمی ڈیٹا لوڈ ہو چکا ہے"
                : language === "hi"
                ? "✅ डमी डेटा लोड हो गया है"
                : "✅ Demo data loaded"}
            </p>
            <p className="text-xs text-green-600 mt-1">
              {language === "ur"
                ? "75-100 طلباء، 10-15 اساتذہ، حاضری، فیس، اور دیگر ریکارڈز"
                : language === "hi"
                ? "75-100 छात्र, 10-15 शिक्षक, उपस्थिति, शुल्क, और अन्य रिकॉर्ड"
                : "75-100 students, 10-15 teachers, attendance, fees, and other records"}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t">
          {!demoDataLoaded ? (
            <Button
              onClick={() => handleAction("load")}
              disabled={actionLoading !== null}
              variant="outline"
              className="flex-1"
            >
              {actionLoading === "load" ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Database className="h-4 w-4 mr-2" />
              )}
              {language === "ur"
                ? "ڈمی ڈیٹا لوڈ کریں"
                : language === "hi"
                ? "डमी डेटा लोड करें"
                : "Load Demo Data"}
            </Button>
          ) : (
            <>
              <Button
                onClick={() => handleAction("reset")}
                disabled={actionLoading !== null}
                variant="outline"
                className="flex-1"
              >
                {actionLoading === "reset" ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RotateCcw className="h-4 w-4 mr-2" />
                )}
                {language === "ur"
                  ? "ری سیٹ ڈیٹا"
                  : language === "hi"
                  ? "डेटा रीसेट करें"
                  : "Reset Data"}
              </Button>
              <Button
                onClick={() => {
                  if (
                    confirm(
                      language === "ur"
                        ? "کیا آپ واقعی تمام ڈمی ڈیٹا حذف کرنا چاہتے ہیں؟"
                        : language === "hi"
                        ? "क्या आप वाकई सभी डमी डेटा हटाना चाहते हैं?"
                        : "Are you sure you want to delete all demo data?"
                    )
                  ) {
                    handleAction("clear");
                  }
                }}
                disabled={actionLoading !== null}
                variant="destructive"
                className="flex-1"
              >
                {actionLoading === "clear" ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                {language === "ur"
                  ? "ڈیٹا حذف کریں"
                  : language === "hi"
                  ? "डेटा हटाएं"
                  : "Clear Data"}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

