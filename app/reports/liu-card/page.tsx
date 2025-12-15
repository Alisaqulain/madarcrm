"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrintLiuCardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Print LIU Card</h1>
        <Card>
          <CardHeader>
            <CardTitle>Print LIU Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              LIU card printing functionality will be implemented here.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

