"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SubmitPlanPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Submit Plan</h1>
        <Card>
          <CardHeader>
            <CardTitle>Submit Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Submit plan functionality will be implemented here.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

