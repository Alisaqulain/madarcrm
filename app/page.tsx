"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { extendedDummyStudents, dummyFees, dummyAttendance } from "@/data/dummy-data";

export default function Home() {
  const { t } = useTranslation();
  const [attendanceStats, setAttendanceStats] = useState({ percentage: 0, present: 0, total: 0 });
  const [mounted, setMounted] = useState(false);
  
  // Calculate statistics from dummy data (static, no hydration issues)
  const totalStudents = extendedDummyStudents.length;
  const totalFees = dummyFees.reduce((sum, fee) => sum + fee.amount, 0);
  const paidFees = dummyFees.filter(f => f.status === "paid").reduce((sum, fee) => sum + fee.amount, 0);
  const pendingFees = dummyFees.filter(f => f.status === "pending").length;
  
  // Calculate attendance on client side only to avoid hydration mismatch
  // Use the most recent date from dummy data (which is deterministic)
  useEffect(() => {
    setMounted(true);
    // Get the most recent date from dummy attendance data
    const dates = dummyAttendance.map(a => a.date).sort().reverse();
    const mostRecentDate = dates[0] || new Date().toISOString().split('T')[0];
    
    const recentAttendance = dummyAttendance.filter(a => a.date === mostRecentDate);
    const presentCount = recentAttendance.filter(a => a.status === "Present").length;
    const attendancePercentage = recentAttendance.length > 0 
      ? Math.round((presentCount / recentAttendance.length) * 100) 
      : 0;
    
    setAttendanceStats({
      percentage: attendancePercentage,
      present: presentCount,
      total: recentAttendance.length
    });
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{t("nav.dashboard")}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">{t("dashboard.welcome")}</p>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("dashboard.totalStudents")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground">{t("dashboard.activeStudents")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("dashboard.totalFeesCollected")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{paidFees.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{t("dashboard.outOf")} ₹{totalFees.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("dashboard.attendanceToday")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mounted ? attendanceStats.percentage : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                {mounted ? `${attendanceStats.present}/${attendanceStats.total}` : "0/0"} {t("attendance.present")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("dashboard.pendingPayments")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingFees}</div>
              <p className="text-xs text-muted-foreground">{t("dashboard.unpaidFees")}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

