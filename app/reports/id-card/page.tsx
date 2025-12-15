"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrintIdCardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Print ID Card</h1>
        <Card>
          <CardHeader>
            <CardTitle>Print ID Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              ID card printing functionality will be implemented here.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

