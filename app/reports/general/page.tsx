"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GeneralListPrintPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">General List Print</h1>
        <Card>
          <CardHeader>
            <CardTitle>General List Print</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              General list printing functionality will be implemented here.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

