/**
 * Generate at least 50 students per class
 * Creates comprehensive dummy student data for all classes
 */

import { DummyStudent } from "./dummy-students";

// Islamic names pool (expanded)
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
    'Muhammad Mahdi', 'Abdul Qadir', 'Ahmad Raza', 'Muhammad Shafi', 'Ibrahim Desai',
    'Abdul Aziz', 'Muhammad Yusuf', 'Hassan Ali', 'Hussain Ali', 'Abbas Ali',
    'Muhammad Hamza', 'Ali Hamza', 'Yusuf Hamza', 'Ibrahim Hamza', 'Ahmed Hamza',
    'Fatima Ali', 'Ayesha Ali', 'Khadija Ali', 'Zainab Fatima', 'Maryam Fatima',
    'Amina Fatima', 'Safiya Fatima', 'Hafsa Ali', 'Umm Kulthum', 'Ruqayyah Ali',
    'Muhammad Hashim', 'Ali Hashim', 'Hassan Hashim', 'Hussain Hashim', 'Abbas Hashim',
    'Muhammad Jafar', 'Ali Jafar', 'Hassan Jafar', 'Hussain Jafar', 'Abbas Jafar',
    'Muhammad Musa', 'Ali Musa', 'Hassan Musa', 'Hussain Musa', 'Abbas Musa',
    'Muhammad Ridha', 'Ali Ridha', 'Hassan Ridha', 'Hussain Ridha', 'Abbas Ridha',
    'Muhammad Jawad', 'Ali Jawad', 'Hassan Jawad', 'Hussain Jawad', 'Abbas Jawad',
    'Muhammad Hadi', 'Ali Hadi', 'Hassan Hadi', 'Hussain Hadi', 'Abbas Hadi',
    'Muhammad Askari', 'Ali Askari', 'Hassan Askari', 'Hussain Askari', 'Abbas Askari'
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
    'मुहम्मद महदी', 'अब्दुल कादिर', 'अहमद रज़ा', 'मुहम्मद शफ़ी', 'इब्राहिम देसाई',
    'अब्दुल अज़ीज़', 'मुहम्मद यूसुफ', 'हसन अली', 'हुसैन अली', 'अब्बास अली',
    'मुहम्मद हम्ज़ा', 'अली हम्ज़ा', 'यूसुफ हम्ज़ा', 'इब्राहिम हम्ज़ा', 'अहमद हम्ज़ा',
    'फातिमा अली', 'आयशा अली', 'खदीजा अली', 'ज़ैनब फातिमा', 'मरियम फातिमा',
    'अमीना फातिमा', 'सफिया फातिमा', 'हफ़्सा अली', 'उम्म कुलसूम', 'रुकय्या अली',
    'मुहम्मद हाशिम', 'अली हाशिम', 'हसन हाशिम', 'हुसैन हाशिम', 'अब्बास हाशिम',
    'मुहम्मद जाफ़र', 'अली जाफ़र', 'हसन जाफ़र', 'हुसैन जाफ़र', 'अब्बास जाफ़र',
    'मुहम्मद मूसा', 'अली मूसा', 'हसन मूसा', 'हुसैन मूसा', 'अब्बास मूसा',
    'मुहम्मद रिधा', 'अली रिधा', 'हसन रिधा', 'हुसैन रिधा', 'अब्बास रिधा',
    'मुहम्मद जवाद', 'अली जवाद', 'हसन जवाद', 'हुसैन जवाद', 'अब्बास जवाद',
    'मुहम्मद हादी', 'अली हादी', 'हसन हादी', 'हुसैन हादी', 'अब्बास हादी',
    'मुहम्मद अस्करी', 'अली अस्करी', 'हसन अस्करी', 'हुसैन अस्करी', 'अब्बास अस्करी'
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
    'محمد مہدی', 'عبدالقادر', 'احمد رضا', 'محمد شفیع', 'ابراہیم ڈیسائی',
    'عبدالعزیز', 'محمد یوسف', 'حسن علی', 'حسین علی', 'عباس علی',
    'محمد حمزہ', 'علی حمزہ', 'یوسف حمزہ', 'ابراہیم حمزہ', 'احمد حمزہ',
    'فاطمہ علی', 'عائشہ علی', 'خدیجہ علی', 'زینب فاطمہ', 'مریم فاطمہ',
    'امینہ فاطمہ', 'صفیہ فاطمہ', 'حفصہ علی', 'ام کلثوم', 'رقیہ علی',
    'محمد ہاشم', 'علی ہاشم', 'حسن ہاشم', 'حسین ہاشم', 'عباس ہاشم',
    'محمد جعفر', 'علی جعفر', 'حسن جعفر', 'حسین جعفر', 'عباس جعفر',
    'محمد موسیٰ', 'علی موسیٰ', 'حسن موسیٰ', 'حسین موسیٰ', 'عباس موسیٰ',
    'محمد رضا', 'علی رضا', 'حسن رضا', 'حسین رضا', 'عباس رضا',
    'محمد جواد', 'علی جواد', 'حسن جواد', 'حسین جواد', 'عباس جواد',
    'محمد ہادی', 'علی ہادی', 'حسن ہادی', 'حسین ہادی', 'عباس ہادی',
    'محمد عسکری', 'علی عسکری', 'حسن عسکری', 'حسین عسکری', 'عباس عسکری'
  ]
};

const fatherNames = {
  en: [
    'Abdul Rahman', 'Muhammad Hussain', 'Ahmed Ali', 'Ibrahim Khan', 'Yusuf Ahmad',
    'Hamza Malik', 'Omar Farooq', 'Hassan Raza', 'Ali Akbar', 'Zakariya Hussain',
    'Ismail Shah', 'Yaqub Ali', 'Haroon Raza', 'Musa Khan', 'Isa Ahmad',
    'Dawud Malik', 'Sulaiman Sheikh', 'Ilyas Hussain', 'Yunus Ali', 'Ayyub Khan',
    'Abdul Aziz', 'Muhammad Yusuf', 'Hassan Ali', 'Hussain Ali', 'Abbas Ali',
    'Muhammad Hamza', 'Ali Hamza', 'Yusuf Hamza', 'Ibrahim Hamza', 'Ahmed Hamza',
    'Muhammad Hashim', 'Ali Hashim', 'Hassan Hashim', 'Hussain Hashim', 'Abbas Hashim',
    'Muhammad Jafar', 'Ali Jafar', 'Hassan Jafar', 'Hussain Jafar', 'Abbas Jafar',
    'Muhammad Musa', 'Ali Musa', 'Hassan Musa', 'Hussain Musa', 'Abbas Musa'
  ],
  hi: [
    'अब्दुल रहमान', 'मुहम्मद हुसैन', 'अहमद अली', 'इब्राहिम खान', 'यूसुफ अहमद',
    'हम्ज़ा मलिक', 'उमर फारूक', 'हसन रज़ा', 'अली अकबर', 'ज़कारिया हुसैन',
    'इस्माईल शाह', 'याकूब अली', 'हारून रज़ा', 'मूसा खान', 'ईसा अहमद',
    'दाऊद मलिक', 'सुलेमान शेख', 'इल्यास हुसैन', 'यूनुस अली', 'अय्यूब खान',
    'अब्दुल अज़ीज़', 'मुहम्मद यूसुफ', 'हसन अली', 'हुसैन अली', 'अब्बास अली',
    'मुहम्मद हम्ज़ा', 'अली हम्ज़ा', 'यूसुफ हम्ज़ा', 'इब्राहिम हम्ज़ा', 'अहमद हम्ज़ा',
    'मुहम्मद हाशिम', 'अली हाशिम', 'हसन हाशिम', 'हुसैन हाशिम', 'अब्बास हाशिम',
    'मुहम्मद जाफ़र', 'अली जाफ़र', 'हसन जाफ़र', 'हुसैन जाफ़र', 'अब्बास जाफ़र',
    'मुहम्मद मूसा', 'अली मूसा', 'हसन मूसा', 'हुसैन मूसा', 'अब्बास मूसा'
  ],
  ur: [
    'عبدالرحمن', 'محمد حسین', 'احمد علی', 'ابراہیم خان', 'یوسف احمد',
    'حمزہ ملک', 'عمر فاروق', 'حسن رضا', 'علی اکبر', 'زکریا حسین',
    'اسماعیل شاہ', 'یعقوب علی', 'ہارون رضا', 'موسیٰ خان', 'عیسیٰ احمد',
    'داؤد ملک', 'سلیمان شیخ', 'الیاس حسین', 'یونس علی', 'ایوب خان',
    'عبدالعزیز', 'محمد یوسف', 'حسن علی', 'حسین علی', 'عباس علی',
    'محمد حمزہ', 'علی حمزہ', 'یوسف حمزہ', 'ابراہیم حمزہ', 'احمد حمزہ',
    'محمد ہاشم', 'علی ہاشم', 'حسن ہاشم', 'حسین ہاشم', 'عباس ہاشم',
    'محمد جعفر', 'علی جعفر', 'حسن جعفر', 'حسین جعفر', 'عباس جعفر',
    'محمد موسیٰ', 'علی موسیٰ', 'حسن موسیٰ', 'حسین موسیٰ', 'عباس موسیٰ'
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

// Deterministic random function
const seededRandom = (seed: number) => {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
};

export function generateStudentsByClass(): DummyStudent[] {
  const students: DummyStudent[] = [];
  let studentIdCounter = 1;
  let nameIndex = 0;
  let fatherIndex = 0;

  // Generate at least 50 students per class
  classes.forEach((className) => {
    const studentsPerClass = 50 + Math.floor(seededRandom(className.charCodeAt(0) * 100)() * 10); // 50-60 per class
    const studentsPerSection = Math.ceil(studentsPerClass / sections.length);

    sections.forEach((section, sectionIndex) => {
      const studentsInSection = sectionIndex === sections.length - 1 
        ? studentsPerClass - (studentsPerSection * (sections.length - 1))
        : studentsPerSection;

      for (let i = 0; i < studentsInSection; i++) {
        const studentId = `NET${String(studentIdCounter).padStart(4, '0')}`;
        const random = seededRandom(studentIdCounter * 1000);
        
        // Cycle through names
        const nameIdx = nameIndex % islamicNames.en.length;
        const fatherIdx = fatherIndex % fatherNames.en.length;
        nameIndex++;
        fatherIndex++;
        
        const cityIdx = Math.floor(random() * cities.en.length);
        const stateIdx = Math.floor(random() * states.en.length);
        
        // Generate dates
        const birthYear = 2005 + Math.floor(random() * 10); // 2005-2014
        const birthMonth = Math.floor(random() * 12);
        const birthDay = Math.floor(random() * 28) + 1;
        const dob = `${birthYear}-${String(birthMonth + 1).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`;
        
        const admissionYear = 2020 + Math.floor(random() * 4); // 2020-2023
        const admissionMonth = Math.floor(random() * 12);
        const admissionDay = Math.floor(random() * 28) + 1;
        const admissionDate = `${admissionYear}-${String(admissionMonth + 1).padStart(2, '0')}-${String(admissionDay).padStart(2, '0')}`;
        
        const phone = `9${Math.floor(random() * 9000000000) + 1000000000}`;
        const houseNumber = Math.floor(random() * 500) + 1;
        const streetNumber = Math.floor(random() * 50) + 1;
        
        students.push({
          studentId,
          name: {
            en: islamicNames.en[nameIdx],
            hi: islamicNames.hi[nameIdx],
            ur: islamicNames.ur[nameIdx]
          },
          fatherName: {
            en: fatherNames.en[fatherIdx],
            hi: fatherNames.hi[fatherIdx],
            ur: fatherNames.ur[fatherIdx]
          },
          motherName: {
            en: `Fatima ${fatherNames.en[fatherIdx]}`,
            hi: `फातिमा ${fatherNames.hi[fatherIdx]}`,
            ur: `فاطمہ ${fatherNames.ur[fatherIdx]}`
          },
          class: className,
          section: section,
          dob: dob,
          address: {
            en: `House No. ${houseNumber}, Street ${streetNumber}, ${cities.en[cityIdx]}, ${states.en[stateIdx]}`,
            hi: `मकान नंबर ${houseNumber}, स्ट्रीट ${streetNumber}, ${cities.hi[cityIdx]}, ${states.hi[stateIdx]}`,
            ur: `مکان نمبر ${houseNumber}، سڑک ${streetNumber}، ${cities.ur[cityIdx]}، ${states.ur[stateIdx]}`
          },
          phone: phone,
          admissionDate: admissionDate,
          status: random() > 0.1 ? 'Active' : 'Inactive'
        });
        
        studentIdCounter++;
      }
    });
  });

  return students;
}

