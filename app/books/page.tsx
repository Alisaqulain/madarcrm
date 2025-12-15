"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BooksPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Book Distribution</h1>
        <Card>
          <CardHeader>
            <CardTitle>Book Distribution Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Book distribution management will be implemented here.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

