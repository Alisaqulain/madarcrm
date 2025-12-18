"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { extendedDummyStudents, dummyFees, dummyAttendance } from "@/data/dummy-data";

export default function Home() {
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
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Welcome to Nizam-e-Taleem CRM</p>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground">Active students</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Fees Collected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{paidFees.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Out of ₹{totalFees.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendancePercentage}%</div>
              <p className="text-xs text-muted-foreground">{presentToday}/{todayAttendance.length} present</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingFees}</div>
              <p className="text-xs text-muted-foreground">Unpaid fees</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

