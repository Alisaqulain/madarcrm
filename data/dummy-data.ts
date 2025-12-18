import { DummyStudent, dummyStudents } from "./dummy-students";

// Extended dummy students (add more if needed)
export const extendedDummyStudents: DummyStudent[] = [
  ...dummyStudents,
  {
    studentId: "NET006",
    name: { en: "Yusuf Ahmed", hi: "यूसुफ अहमद", ur: "یوسف احمد" },
    fatherName: { en: "Ahmed Khan", hi: "अहमद खान", ur: "احمد خان" },
    motherName: { en: "Amina Khan", hi: "अमीना खान", ur: "امینہ خان" },
    class: "3",
    section: "B",
    dob: "2008-06-10",
    address: { en: "House No. 111, Street 8, Chennai", hi: "मकान नंबर 111, स्ट्रीट 8, चेन्नई", ur: "مکان نمبر 111، سڑک 8، چینائی" },
    phone: "9876543215",
    admissionDate: "2022-04-01",
    status: "Active",
  },
  {
    studentId: "NET007",
    name: { en: "Fatima Sheikh", hi: "फातिमा शेख", ur: "فاطمہ شیخ" },
    fatherName: { en: "Sheikh Mohammed", hi: "शेख मोहम्मद", ur: "شیخ محمد" },
    motherName: { en: "Khadija Sheikh", hi: "खदीजा शेख", ur: "خدیجہ شیخ" },
    class: "1",
    section: "C",
    dob: "2011-09-15",
    address: { en: "House No. 222, Street 12, Kolkata", hi: "मकान नंबर 222, स्ट्रीट 12, कोलकाता", ur: "مکان نمبر 222، سڑک 12، کولکتہ" },
    phone: "9876543216",
    admissionDate: "2023-04-01",
    status: "Active",
  },
  {
    studentId: "NET008",
    name: { en: "Ibrahim Ali", hi: "इब्राहिम अली", ur: "ابراہیم علی" },
    fatherName: { en: "Ali Hassan", hi: "अली हसन", ur: "علی حسن" },
    motherName: { en: "Safiya Ali", hi: "सफिया अली", ur: "صفیہ علی" },
    class: "2",
    section: "C",
    dob: "2010-02-28",
    address: { en: "House No. 333, Street 18, Pune", hi: "मकान नंबर 333, स्ट्रीट 18, पुणे", ur: "مکان نمبر 333، سڑک 18، پونے" },
    phone: "9876543217",
    admissionDate: "2023-04-01",
    status: "Active",
  },
  {
    studentId: "NET009",
    name: { en: "Maryam Khan", hi: "मरियम खान", ur: "مریم خان" },
    fatherName: { en: "Khan Saeed", hi: "खान सईद", ur: "خان سعید" },
    motherName: { en: "Ayesha Khan", hi: "आयशा खान", ur: "عائشہ خان" },
    class: "4",
    section: "A",
    dob: "2007-11-20",
    address: { en: "House No. 444, Street 22, Jaipur", hi: "मकान नंबर 444, स्ट्रीट 22, जयपुर", ur: "مکان نمبر 444، سڑک 22، جے پور" },
    phone: "9876543218",
    admissionDate: "2021-04-01",
    status: "Active",
  },
  {
    studentId: "NET010",
    name: { en: "Abdul Rahman", hi: "अब्दुल रहमान", ur: "عبدالرحمن" },
    fatherName: { en: "Rahman Ali", hi: "रहमान अली", ur: "رحمن علی" },
    motherName: { en: "Zainab Rahman", hi: "ज़ैनब रहमान", ur: "زینب رحمن" },
    class: "3",
    section: "C",
    dob: "2008-12-05",
    address: { en: "House No. 555, Street 30, Ahmedabad", hi: "मकान नंबर 555, स्ट्रीट 30, अहमदाबाद", ur: "مکان نمبر 555، سڑک 30، احمدآباد" },
    phone: "9876543219",
    admissionDate: "2022-04-01",
    status: "Active",
  },
];

// Dummy Fees Data
export interface DummyFee {
  id: number;
  studentId: string;
  studentName: string;
  month: number;
  monthName: string;
  year: number;
  amount: number;
  status: "paid" | "pending";
  paymentDate?: string;
}

export const dummyFees: DummyFee[] = [
  // NET001 fees
  { id: 1, studentId: "NET001", studentName: "Ahmed Ali", month: 1, monthName: "January", year: 2024, amount: 1000, status: "paid", paymentDate: "2024-01-05" },
  { id: 2, studentId: "NET001", studentName: "Ahmed Ali", month: 2, monthName: "February", year: 2024, amount: 1000, status: "paid", paymentDate: "2024-02-05" },
  { id: 3, studentId: "NET001", studentName: "Ahmed Ali", month: 3, monthName: "March", year: 2024, amount: 1000, status: "pending" },
  // NET002 fees
  { id: 4, studentId: "NET002", studentName: "Hassan Khan", month: 1, monthName: "January", year: 2024, amount: 1200, status: "paid", paymentDate: "2024-01-06" },
  { id: 5, studentId: "NET002", studentName: "Hassan Khan", month: 2, monthName: "February", year: 2024, amount: 1200, status: "pending" },
  // NET003 fees
  { id: 6, studentId: "NET003", studentName: "Zainab Fatima", month: 1, monthName: "January", year: 2024, amount: 1000, status: "paid", paymentDate: "2024-01-07" },
  { id: 7, studentId: "NET003", studentName: "Zainab Fatima", month: 2, monthName: "February", year: 2024, amount: 1000, status: "paid", paymentDate: "2024-02-08" },
  { id: 8, studentId: "NET003", studentName: "Zainab Fatima", month: 3, monthName: "March", year: 2024, amount: 1000, status: "pending" },
  // NET004 fees
  { id: 9, studentId: "NET004", studentName: "Omar Hussain", month: 1, monthName: "January", year: 2024, amount: 1500, status: "paid", paymentDate: "2024-01-10" },
  { id: 10, studentId: "NET004", studentName: "Omar Hussain", month: 2, monthName: "February", year: 2024, amount: 1500, status: "pending" },
  // NET005 fees
  { id: 11, studentId: "NET005", studentName: "Amina Sheikh", month: 1, monthName: "January", year: 2024, amount: 1200, status: "paid", paymentDate: "2024-01-12" },
];

// Dummy Attendance Data
export interface DummyAttendance {
  id: number;
  studentId: string;
  studentName: string;
  class: string;
  section: string;
  date: string;
  status: "Present" | "Absent";
  remarks?: string;
}

const generateAttendanceData = (): DummyAttendance[] => {
  const attendance: DummyAttendance[] = [];
  const students = extendedDummyStudents.slice(0, 5); // First 5 students
  const today = new Date();
  let id = 1;

  // Generate attendance for last 30 days
  for (let day = 0; day < 30; day++) {
    const date = new Date(today);
    date.setDate(date.getDate() - day);
    const dateStr = date.toISOString().split('T')[0];

    students.forEach((student) => {
      const isPresent = Math.random() > 0.15; // 85% attendance rate
      attendance.push({
        id: id++,
        studentId: student.studentId,
        studentName: student.name.en,
        class: student.class,
        section: student.section,
        date: dateStr,
        status: isPresent ? "Present" : "Absent",
        remarks: isPresent ? undefined : "Sick",
      });
    });
  }

  return attendance;
};

export const dummyAttendance = generateAttendanceData();

// Dummy Books Data
export interface DummyBook {
  id: number;
  bookName: string;
  bookNameHi: string;
  bookNameUr: string;
  author: string;
  class: string;
  quantity: number;
  distributed: number;
  available: number;
}

export const dummyBooks: DummyBook[] = [
  { id: 1, bookName: "Quran - Part 1", bookNameHi: "कुरान - भाग 1", bookNameUr: "قرآن - حصہ 1", author: "Standard", class: "1", quantity: 50, distributed: 35, available: 15 },
  { id: 2, bookName: "Quran - Part 2", bookNameHi: "कुरान - भाग 2", bookNameUr: "قرآن - حصہ 2", author: "Standard", class: "2", quantity: 45, distributed: 30, available: 15 },
  { id: 3, bookName: "Hadith Collection", bookNameHi: "हदीस संग्रह", bookNameUr: "حدیث مجموعہ", author: "Standard", class: "3", quantity: 40, distributed: 25, available: 15 },
  { id: 4, bookName: "Arabic Grammar", bookNameHi: "अरबी व्याकरण", bookNameUr: "عربی گرامر", author: "Standard", class: "2", quantity: 50, distributed: 32, available: 18 },
  { id: 5, bookName: "Urdu Reader", bookNameHi: "उर्दू रीडर", bookNameUr: "اردو ریڈر", author: "Standard", class: "1", quantity: 55, distributed: 38, available: 17 },
  { id: 6, bookName: "Mathematics", bookNameHi: "गणित", bookNameUr: "ریاضی", author: "Standard", class: "All", quantity: 100, distributed: 75, available: 25 },
  { id: 7, bookName: "Science", bookNameHi: "विज्ञान", bookNameUr: "سائنس", author: "Standard", class: "All", quantity: 100, distributed: 70, available: 30 },
];

// Dummy Book Distribution
export interface DummyBookDistribution {
  id: number;
  studentId: string;
  studentName: string;
  bookId: number;
  bookName: string;
  distributedDate: string;
  returnDate?: string;
  status: "Issued" | "Returned";
}

export const dummyBookDistributions: DummyBookDistribution[] = [
  { id: 1, studentId: "NET001", studentName: "Ahmed Ali", bookId: 1, bookName: "Quran - Part 1", distributedDate: "2024-01-15", status: "Issued" },
  { id: 2, studentId: "NET001", studentName: "Ahmed Ali", bookId: 5, bookName: "Urdu Reader", distributedDate: "2024-01-15", status: "Issued" },
  { id: 3, studentId: "NET002", studentName: "Hassan Khan", bookId: 2, bookName: "Quran - Part 2", distributedDate: "2024-01-16", status: "Issued" },
  { id: 4, studentId: "NET002", studentName: "Hassan Khan", bookId: 4, bookName: "Arabic Grammar", distributedDate: "2024-01-16", status: "Issued" },
  { id: 5, studentId: "NET003", studentName: "Zainab Fatima", bookId: 1, bookName: "Quran - Part 1", distributedDate: "2024-01-17", status: "Issued" },
  { id: 6, studentId: "NET004", studentName: "Omar Hussain", bookId: 3, bookName: "Hadith Collection", distributedDate: "2024-01-18", status: "Issued" },
  { id: 7, studentId: "NET005", studentName: "Amina Sheikh", bookId: 2, bookName: "Quran - Part 2", distributedDate: "2024-01-19", status: "Issued" },
];

// Dummy Submit Plan Data
export interface DummySubmitPlan {
  id: number;
  studentId: string;
  studentName: string;
  class: string;
  section: string;
  subject: string;
  subjectHi: string;
  subjectUr: string;
  chapter: string;
  submitDate: string;
  status: "Submitted" | "Pending";
}

export const dummySubmitPlans: DummySubmitPlan[] = [
  { id: 1, studentId: "NET001", studentName: "Ahmed Ali", class: "1", section: "A", subject: "Quran", subjectHi: "कुरान", subjectUr: "قرآن", chapter: "Chapter 1-5", submitDate: "2024-01-20", status: "Submitted" },
  { id: 2, studentId: "NET001", studentName: "Ahmed Ali", class: "1", section: "A", subject: "Arabic", subjectHi: "अरबी", subjectUr: "عربی", chapter: "Chapter 1-3", submitDate: "2024-01-22", status: "Submitted" },
  { id: 3, studentId: "NET002", studentName: "Hassan Khan", class: "2", section: "B", subject: "Quran", subjectHi: "कुरान", subjectUr: "قرآن", chapter: "Chapter 6-10", submitDate: "2024-01-21", status: "Submitted" },
  { id: 4, studentId: "NET002", studentName: "Hassan Khan", class: "2", section: "B", subject: "Hadith", subjectHi: "हदीस", subjectUr: "حدیث", chapter: "Chapter 1-2", submitDate: "2024-01-23", status: "Pending" },
  { id: 5, studentId: "NET003", studentName: "Zainab Fatima", class: "1", section: "B", subject: "Quran", subjectHi: "कुरान", subjectUr: "قرآن", chapter: "Chapter 1-4", submitDate: "2024-01-20", status: "Submitted" },
  { id: 6, studentId: "NET004", studentName: "Omar Hussain", class: "3", section: "A", subject: "Hadith", subjectHi: "हदीस", subjectUr: "حدیث", chapter: "Chapter 3-5", submitDate: "2024-01-24", status: "Submitted" },
  { id: 7, studentId: "NET005", studentName: "Amina Sheikh", class: "2", section: "A", subject: "Arabic", subjectHi: "अरबी", subjectUr: "عربی", chapter: "Chapter 4-6", submitDate: "2024-01-25", status: "Pending" },
];



