/**
 * Comprehensive Demo Data Generator for Madarsa CRM
 * Generates realistic Islamic/Madarsa-style dummy data in Urdu, English, and Hindi
 */

import mongoose from 'mongoose';
import { Student } from '@/models/Student';
import { Admin } from '@/models/Admin';
import { Attendance } from '@/models/Attendance';
import { Fee } from '@/models/Fee';
import { Tenant } from '@/models/Tenant';
import bcrypt from 'bcryptjs';

// Islamic/Madarsa names in multiple languages
const islamicNames = {
  en: [
    'Muhammad Ali', 'Ahmed Hassan', 'Ibrahim Khan', 'Yusuf Ahmad', 'Hamza Malik',
    'Omar Farooq', 'Hassan Raza', 'Ali Akbar', 'Fatima Zahra', 'Ayesha Siddiqua',
    'Khadija Begum', 'Zainab Ali', 'Maryam Khan', 'Amina Sheikh', 'Safiya Ahmed',
    'Abdullah Rahman', 'Zakariya Hussain', 'Ismail Shah', 'Yaqub Ali', 'Haroon Raza',
    'Musa Khan', 'Isa Ahmad', 'Dawud Malik', 'Sulaiman Sheikh', 'Ilyas Hussain',
    'Yunus Ali', 'Ayyub Khan', 'Dhul-Kifl Ahmad', 'Idris Shah', 'Nuh Malik',
    'Hud Sheikh', 'Salih Khan', 'Shuayb Ali', 'Lut Ahmad', 'Ishaq Shah',
    'Yusuf Khan', 'Binyamin Malik', 'Harun Sheikh', 'Uzair Ali', 'Luqman Ahmad',
    'Khalid bin Walid', 'Umar Farooq', 'Usman Ghani', 'Ali Murtaza', 'Hassan Mujtaba',
    'Hussain Shahid', 'Abbas Alamdar', 'Zainul Abidin', 'Muhammad Baqir', 'Jafar Sadiq',
    'Musa Kazim', 'Ali Raza', 'Muhammad Taqi', 'Ali Naqi', 'Hassan Askari',
    'Muhammad Mahdi', 'Abdul Qadir', 'Ahmad Raza', 'Muhammad Shafi', 'Ibrahim Desai'
  ],
  hi: [
    'मुहम्मद अली', 'अहमद हसन', 'इब्राहिम खान', 'यूसुफ अहमद', 'हम्ज़ा मलिक',
    'उमर फारूक', 'हसन रज़ा', 'अली अकबर', 'फातिमा ज़हरा', 'आयशा सिद्दीकी',
    'खदीजा बेगम', 'ज़ैनब अली', 'मरियम खान', 'अमीना शेख', 'सफिया अहमद',
    'अब्दुल्लाह रहमान', 'ज़कारिया हुसैन', 'इस्माईल शाह', 'याकूब अली', 'हारून रज़ा',
    'मूसा खान', 'ईसा अहमद', 'दाऊद मलिक', 'सुलेमान शेख', 'इल्यास हुसैन',
    'यूनुस अली', 'अय्यूब खान', 'धुल-किफ्ल अहमद', 'इदरीस शाह', 'नूह मलिक',
    'हूद शेख', 'सालेह खान', 'शुआयब अली', 'लूत अहमद', 'इसहाक शाह',
    'यूसुफ खान', 'बिन्यामिन मलिक', 'हारून शेख', 'उज़ैर अली', 'लुकमान अहमद',
    'खालिद बिन वलीद', 'उमर फारूक', 'उस्मान ग़नी', 'अली मुर्तज़ा', 'हसन मुजतबा',
    'हुसैन शहीद', 'अब्बास आलमदार', 'ज़ैनुल आबिदीन', 'मुहम्मद बाक़िर', 'जाफ़र सादिक़',
    'मूसा काज़िम', 'अली रज़ा', 'मुहम्मद तक़ी', 'अली नक़ी', 'हसन अस्करी',
    'मुहम्मद महदी', 'अब्दुल कादिर', 'अहमद रज़ा', 'मुहम्मद शफ़ी', 'इब्राहिम देसाई'
  ],
  ur: [
    'محمد علی', 'احمد حسن', 'ابراہیم خان', 'یوسف احمد', 'حمزہ ملک',
    'عمر فاروق', 'حسن رضا', 'علی اکبر', 'فاطمہ زہرا', 'عائشہ صدیقہ',
    'خدیجہ بیگم', 'زینب علی', 'مریم خان', 'امینہ شیخ', 'صفیہ احمد',
    'عبداللہ رحمان', 'زکریا حسین', 'اسماعیل شاہ', 'یعقوب علی', 'ہارون رضا',
    'موسیٰ خان', 'عیسیٰ احمد', 'داؤد ملک', 'سلیمان شیخ', 'الیاس حسین',
    'یونس علی', 'ایوب خان', 'ذوالکفل احمد', 'ادریس شاہ', 'نوح ملک',
    'ہود شیخ', 'صالح خان', 'شعیب علی', 'لوط احمد', 'اسحاق شاہ',
    'یوسف خان', 'بنیامین ملک', 'ہارون شیخ', 'عزیر علی', 'لقمان احمد',
    'خالد بن ولید', 'عمر فاروق', 'عثمان غنی', 'علی مرتضیٰ', 'حسن مجتبیٰ',
    'حسین شہید', 'عباس علمدار', 'زین العابدین', 'محمد باقر', 'جعفر صادق',
    'موسیٰ کاظم', 'علی رضا', 'محمد تقی', 'علی نقی', 'حسن عسکری',
    'محمد مہدی', 'عبدالقادر', 'احمد رضا', 'محمد شفیع', 'ابراہیم ڈیسائی'
  ]
};

const fatherNames = {
  en: [
    'Abdul Rahman', 'Muhammad Hussain', 'Ahmed Ali', 'Ibrahim Khan', 'Yusuf Ahmad',
    'Hamza Malik', 'Omar Farooq', 'Hassan Raza', 'Ali Akbar', 'Zakariya Hussain',
    'Ismail Shah', 'Yaqub Ali', 'Haroon Raza', 'Musa Khan', 'Isa Ahmad',
    'Dawud Malik', 'Sulaiman Sheikh', 'Ilyas Hussain', 'Yunus Ali', 'Ayyub Khan'
  ],
  hi: [
    'अब्दुल रहमान', 'मुहम्मद हुसैन', 'अहमद अली', 'इब्राहिम खान', 'यूसुफ अहमद',
    'हम्ज़ा मलिक', 'उमर फारूक', 'हसन रज़ा', 'अली अकबर', 'ज़कारिया हुसैन',
    'इस्माईल शाह', 'याकूब अली', 'हारून रज़ा', 'मूसा खान', 'ईसा अहमद',
    'दाऊद मलिक', 'सुलेमान शेख', 'इल्यास हुसैन', 'यूनुस अली', 'अय्यूब खान'
  ],
  ur: [
    'عبدالرحمن', 'محمد حسین', 'احمد علی', 'ابراہیم خان', 'یوسف احمد',
    'حمزہ ملک', 'عمر فاروق', 'حسن رضا', 'علی اکبر', 'زکریا حسین',
    'اسماعیل شاہ', 'یعقوب علی', 'ہارون رضا', 'موسیٰ خان', 'عیسیٰ احمد',
    'داؤد ملک', 'سلیمان شیخ', 'الیاس حسین', 'یونس علی', 'ایوب خان'
  ]
};

const classes = ['Hifz', 'Aalim', 'Qari', 'Dars-e-Nizami', 'Primary', 'Secondary', 'Class 1', 'Class 2', 'Class 3', 'Class 4'];
const sections = ['A', 'B', 'C'];
const cities = {
  en: ['Delhi', 'Mumbai', 'Hyderabad', 'Lucknow', 'Bhopal', 'Jaipur', 'Ahmedabad', 'Kolkata', 'Chennai', 'Bangalore'],
  hi: ['दिल्ली', 'मुंबई', 'हैदराबाद', 'लखनऊ', 'भोपाल', 'जयपुर', 'अहमदाबाद', 'कोलकाता', 'चेन्नई', 'बैंगलोर'],
  ur: ['دہلی', 'ممبئی', 'حیدرآباد', 'لکھنؤ', 'بھوپال', 'جے پور', 'احمدآباد', 'کولکتہ', 'چنائی', 'بنگلور']
};

const states = {
  en: ['Uttar Pradesh', 'Maharashtra', 'Delhi', 'Madhya Pradesh', 'Rajasthan', 'Gujarat', 'West Bengal', 'Tamil Nadu', 'Karnataka', 'Telangana'],
  hi: ['उत्तर प्रदेश', 'महाराष्ट्र', 'दिल्ली', 'मध्य प्रदेश', 'राजस्थान', 'गुजरात', 'पश्चिम बंगाल', 'तमिल नाडु', 'कर्नाटक', 'तेलंगाना'],
  ur: ['اتر پردیش', 'مہاراشٹر', 'دہلی', 'مدھیہ پردیش', 'راجستھان', 'گجرات', 'مغربی بنگال', 'تامل ناڈو', 'کرناٹک', 'تلنگانہ']
};

export async function generateDemoData(tenantId: mongoose.Types.ObjectId) {
  try {
    console.log('🚀 Starting demo data generation for tenant:', tenantId);

    // Generate 75-100 students
    const studentCount = Math.floor(Math.random() * 26) + 75; // 75-100
    const students = [];
    
    for (let i = 0; i < studentCount; i++) {
      const nameIndex = Math.floor(Math.random() * islamicNames.en.length);
      const fatherIndex = Math.floor(Math.random() * fatherNames.en.length);
      const classIndex = Math.floor(Math.random() * classes.length);
      const sectionIndex = Math.floor(Math.random() * sections.length);
      const cityIndex = Math.floor(Math.random() * cities.en.length);
      const stateIndex = Math.floor(Math.random() * states.en.length);
      
      const year = 2020 + Math.floor(Math.random() * 5);
      const month = Math.floor(Math.random() * 12);
      const day = Math.floor(Math.random() * 28) + 1;
      const dob = new Date(year, month, day);
      
      const admissionYear = 2022 + Math.floor(Math.random() * 3);
      const admissionMonth = Math.floor(Math.random() * 12);
      const admissionDay = Math.floor(Math.random() * 28) + 1;
      const admissionDate = new Date(admissionYear, admissionMonth, admissionDay);
      
      const phone = `9${Math.floor(Math.random() * 9000000000) + 1000000000}`;
      
      const studentId = `NET${String(i + 1).padStart(4, '0')}`;
      
      const address = {
        en: `${Math.floor(Math.random() * 100) + 1} Street, ${cities.en[cityIndex]}, ${states.en[stateIndex]}`,
        hi: `${Math.floor(Math.random() * 100) + 1} सड़क, ${cities.hi[cityIndex]}, ${states.hi[stateIndex]}`,
        ur: `${Math.floor(Math.random() * 100) + 1} گلی، ${cities.ur[cityIndex]}, ${states.ur[stateIndex]}`
      };
      
      students.push({
        studentId,
        name: {
          en: islamicNames.en[nameIndex],
          hi: islamicNames.hi[nameIndex],
          ur: islamicNames.ur[nameIndex]
        },
        fatherName: {
          en: fatherNames.en[fatherIndex],
          hi: fatherNames.hi[fatherIndex],
          ur: fatherNames.ur[fatherIndex]
        },
        motherName: {
          en: `Fatima ${fatherNames.en[fatherIndex]}`,
          hi: `फातिमा ${fatherNames.hi[fatherIndex]}`,
          ur: `فاطمہ ${fatherNames.ur[fatherIndex]}`
        },
        class: classes[classIndex],
        section: sections[sectionIndex],
        dob,
        address,
        phone,
        admissionDate,
        status: Math.random() > 0.1 ? 'Active' : 'Inactive',
        tenantId,
        isDemoData: true
      });
    }
    
    // Insert students
    await Student.insertMany(students);
    console.log(`✅ Created ${students.length} demo students`);

    // Generate 10-15 teachers
    const teacherCount = Math.floor(Math.random() * 6) + 10; // 10-15
    const teachers = [];
    const teacherRoles = ['teacher', 'teacher', 'teacher', 'accountant', 'admin'];
    const subjects = ['Quran', 'Hadith', 'Fiqh', 'Arabic', 'Urdu', 'English', 'Mathematics', 'Science'];
    
    for (let i = 0; i < teacherCount; i++) {
      const nameIndex = Math.floor(Math.random() * islamicNames.en.length);
      const role = teacherRoles[Math.floor(Math.random() * teacherRoles.length)];
      const username = `teacher${i + 1}`;
      const email = `${username}@demo.madrasa.com`;
      const password = await bcrypt.hash('demo123', 10);
      
      teachers.push({
        username,
        email,
        password,
        role: role === 'teacher' ? 'teacher' : role === 'accountant' ? 'accountant' : 'admin',
        name: islamicNames.en[nameIndex],
        tenantId,
        isSuperAdmin: false,
        permissions: []
      });
    }
    
    await Admin.insertMany(teachers);
    console.log(`✅ Created ${teachers.length} demo teachers/staff`);

    // Generate attendance records (last 3 months)
    const attendanceRecords = [];
    const today = new Date();
    
    for (let monthOffset = 0; monthOffset < 3; monthOffset++) {
      const date = new Date(today.getFullYear(), today.getMonth() - monthOffset, 1);
      const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
      
      for (let day = 1; day <= daysInMonth; day++) {
        const attendanceDate = new Date(date.getFullYear(), date.getMonth(), day);
        // Skip weekends (Saturday = 6, Sunday = 0)
        if (attendanceDate.getDay() === 0 || attendanceDate.getDay() === 6) continue;
        
        // Random 80-95% attendance rate
        const presentCount = Math.floor(students.length * (0.80 + Math.random() * 0.15));
        const selectedStudents = students.sort(() => 0.5 - Math.random()).slice(0, presentCount);
        
        for (const student of selectedStudents) {
          attendanceRecords.push({
            studentId: student.studentId,
            date: attendanceDate,
            status: 'Present',
            remarks: { en: '', hi: '', ur: '' },
            tenantId,
            isDemoData: true
          });
        }
        
        // Add absent records for remaining students
        const absentStudents = students.filter(s => !selectedStudents.includes(s));
        for (const student of absentStudents.slice(0, Math.min(5, absentStudents.length))) {
          attendanceRecords.push({
            studentId: student.studentId,
            date: attendanceDate,
            status: 'Absent',
            remarks: { en: 'Sick', hi: 'बीमार', ur: 'بیمار' },
            tenantId,
            isDemoData: true
          });
        }
      }
    }
    
    await Attendance.insertMany(attendanceRecords);
    console.log(`✅ Created ${attendanceRecords.length} demo attendance records`);

    // Generate fee records (last 6 months)
    const feeRecords = [];
    for (let monthOffset = 0; monthOffset < 6; monthOffset++) {
      const date = new Date(today.getFullYear(), today.getMonth() - monthOffset, 1);
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();
      
      for (const student of students) {
        const isPaid = Math.random() > 0.3; // 70% paid rate
        const amount = 500 + Math.floor(Math.random() * 1500); // ₹500-2000
        
        feeRecords.push({
          studentId: student.studentId,
          month,
          year,
          amount,
          paidAmount: isPaid ? amount : 0,
          dueAmount: isPaid ? 0 : amount,
          status: isPaid ? 'paid' : 'pending',
          paymentDate: isPaid ? new Date(date.getFullYear(), date.getMonth(), Math.floor(Math.random() * 28) + 1) : undefined,
          tenantId,
          isDemoData: true
        });
      }
    }
    
    await Fee.insertMany(feeRecords);
    console.log(`✅ Created ${feeRecords.length} demo fee records`);

    // Update tenant demo data loaded flag
    await Tenant.findByIdAndUpdate(tenantId, { demoDataLoaded: true });
    
    console.log('🎉 Demo data generation completed successfully!');
    return {
      students: students.length,
      teachers: teachers.length,
      attendance: attendanceRecords.length,
      fees: feeRecords.length
    };
  } catch (error) {
    console.error('❌ Error generating demo data:', error);
    throw error;
  }
}

export async function clearDemoData(tenantId: mongoose.Types.ObjectId) {
  try {
    console.log('🗑️ Clearing demo data for tenant:', tenantId);
    
    await Student.deleteMany({ tenantId, isDemoData: true });
    await Attendance.deleteMany({ tenantId, isDemoData: true });
    await Fee.deleteMany({ tenantId, isDemoData: true });
    await Admin.deleteMany({ tenantId, isSuperAdmin: false, role: { $ne: 'super_admin' } });
    
    await Tenant.findByIdAndUpdate(tenantId, { demoDataLoaded: false });
    
    console.log('✅ Demo data cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing demo data:', error);
    throw error;
  }
}

