"use client";

import { useTranslation } from "react-i18next";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { extendedDummyStudents, dummyFees, dummyAttendance } from "@/data/dummy-data";

export default function Home() {
  const { t } = useTranslation();
  
  // Calculate statistics from dummy data
  const totalStudents = extendedDummyStudents.length;
  const totalFees = dummyFees.reduce((sum, fee) => sum + fee.amount, 0);
  const paidFees = dummyFees.filter(f => f.status === "paid").reduce((sum, fee) => sum + fee.amount, 0);
  const pendingFees = dummyFees.filter(f => f.status === "pending").length;
  
  // Today's attendance
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = dummyAttendance.filter(a => a.date === today);
  const presentToday = todayAttendance.filter(a => a.status === "Present").length;
  const attendancePercentage = todayAttendance.length > 0 
    ? Math.round((presentToday / todayAttendance.length) * 100) 
    : 0;

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
              <div className="text-2xl font-bold">{attendancePercentage}%</div>
              <p className="text-xs text-muted-foreground">{presentToday}/{todayAttendance.length} {t("attendance.present")}</p>
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

