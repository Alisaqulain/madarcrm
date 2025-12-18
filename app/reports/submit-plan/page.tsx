"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import { useLanguageStore } from "@/store/language-store";
import { dummySubmitPlans, extendedDummyStudents } from "@/data/dummy-data";

export default function SubmitPlanPage() {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Filter submit plans
  const filteredPlans = dummySubmitPlans.filter((plan) => {
    const student = extendedDummyStudents.find(s => s.studentId === plan.studentId);
    const studentName = student ? (student.name[language] || student.name.en) : plan.studentName;
    
    const matchesSearch = !searchTerm || 
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = !filterClass || plan.class === filterClass;
    const matchesStatus = !filterStatus || plan.status === filterStatus;
    
    return matchesSearch && matchesClass && matchesStatus;
  });

  // Get subject name based on language
  const getSubjectName = (plan: typeof dummySubmitPlans[0]) => {
    if (language === "hi") return plan.subjectHi;
    if (language === "ur") return plan.subjectUr;
    return plan.subject;
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold">{t("nav.submitPlan")}</h1>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Submit Plan Records</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search by name or roll no..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Filter by Class</Label>
                <Select value={filterClass} onValueChange={setFilterClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Classes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Classes</SelectItem>
                    <SelectItem value="1">Class 1</SelectItem>
                    <SelectItem value="2">Class 2</SelectItem>
                    <SelectItem value="3">Class 3</SelectItem>
                    <SelectItem value="4">Class 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Filter by Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="Submitted">Submitted</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">Student Name</TableHead>
                    <TableHead className="text-xs sm:text-sm">Roll No</TableHead>
                    <TableHead className="text-xs sm:text-sm">Class</TableHead>
                    <TableHead className="text-xs sm:text-sm">Subject</TableHead>
                    <TableHead className="text-xs sm:text-sm">Chapter</TableHead>
                    <TableHead className="text-xs sm:text-sm">Submit Date</TableHead>
                    <TableHead className="text-xs sm:text-sm">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlans.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        No records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPlans.map((plan) => {
                      const student = extendedDummyStudents.find(s => s.studentId === plan.studentId);
                      const studentName = student ? (student.name[language] || student.name.en) : plan.studentName;
                      return (
                        <TableRow key={plan.id}>
                          <TableCell className="text-xs sm:text-sm">{studentName}</TableCell>
                          <TableCell className="text-xs sm:text-sm">{plan.studentId}</TableCell>
                          <TableCell className="text-xs sm:text-sm">{plan.class} - {plan.section}</TableCell>
                          <TableCell className="text-xs sm:text-sm">{getSubjectName(plan)}</TableCell>
                          <TableCell className="text-xs sm:text-sm">{plan.chapter}</TableCell>
                          <TableCell className="text-xs sm:text-sm">{new Date(plan.submitDate).toLocaleDateString()}</TableCell>
                          <TableCell className="text-xs sm:text-sm">
                            <span className={`rounded-full px-2 py-1 text-xs ${
                              plan.status === "Submitted"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {plan.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
