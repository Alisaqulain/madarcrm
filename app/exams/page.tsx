"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ExamsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Exams & Results</h1>
        <Card>
          <CardHeader>
            <CardTitle>Exams Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Exams and results management will be implemented here.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

