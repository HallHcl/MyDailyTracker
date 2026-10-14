# 📊 MyDailyTracker

> **เว็บแอปพลิเคชันบันทึกรายรับ-รายจ่ายประจำวันสไตล์ Google Sheets Dark Theme**  
> ซิงค์ข้อมูล Real-Time 100% ผ่าน **Google Firebase Firestore**, รองรับหลายบัญชีธนาคาร (**Multi-Bank/Multi-Account** เพิ่ม/เปลี่ยนชื่อ/ลบได้อิสระ), บริหารได้หลายสกุลเงิน (**Multi-Currency**), และรองรับการติดตั้งใช้งานแบบ **Offline PWA**

🌐 **ใช้งานออนไลน์ได้ทันที (Live App):** [https://hallhcl.github.io/MyDailyTracker/](https://hallhcl.github.io/MyDailyTracker/)

---

## ✨ ไฮไลต์ฟีเจอร์เด่น (Key Features)

### ☁️ 1. Real-Time Cloud Sync 100% (Firebase Firestore)
- ข้อมูลบันทึกและซิงค์ผ่าน **Google Firebase Firestore** แบบ Real-Time อัตโนมัติทันที
- เปิดพร้อมกันหลายอุปกรณ์ (คอมพิวเตอร์, โน้ตบุ๊ก, แท็บเล็ต, มือถือ) ข้อมูลจะอัปเดตตรงกันทันทีโดยไม่ต้องกดรีเฟรชหน้าเว็บ
- ทำงานบน **Firebase Spark Plan (ฟรีถาวรตลอดชีพ)** ไม่ต้องผูกบัตรเครดิต

### 🏦 2. Dynamic Bank Accounts Management (ระบบจัดการบัญชีธนาคาร)
- **เพิ่ม Bank ใหม่ (`+ เพิ่ม`):** สร้างบัญชีใหม่ได้ไม่จำกัด (เช่น `SCB`, `KBank`, `BBL`, `เงินสด`)
- **เปลี่ยนชื่อ Bank (`✏️`):** แก้ไขชื่อบัญชีได้ตลอดเวลา ซิงค์ชื่อใหม่ข้ามอุปกรณ์ทันที
- **ลบ Bank (`🗑️`):** ลบบัญชีที่ไม่ต้องการ พร้อมระบบ Modal ยืนยันความปลอดภัย (มีระบบป้องกันไม่ให้ลบบัญชีสุดท้าย)
- **แยกข้อมูลเด็ดขาด:** เงินตั้งต้น (Initial Balances), ประวัติรายการรับ-จ่าย (Transactions), และยอดคงเหลือถูกแยกตามบัญชี ไม่ปะปนกัน

### 📊 3. Dual Views: Dashboard Sheet & Tracker Sheet
- **Dashboard Sheet:** แสดงสรุปสถิติภาพรวม, ตารางเปรียบเทียบเงินตั้งต้น vs คงเหลือ, กราฟแท่งเปรียบเทียบสัดส่วนรายรับ-รายจ่าย (Income vs Expense), และบันทึกประวัติสรุปรายวัน (Daily Breakdown แบบแบ่งหน้า 5 วัน/หน้า)
- **Tracker Sheet:** ตารางสเปรดชีตแสดงรายการธุรกรรมแบบละเอียดสไตล์ Google Sheets คอลัมน์ A ถึง G พร้อมระบบแบ่งหน้า (11 รายการ/หน้า) และระบบค้นหาแบบ Real-Time

### 💰 4. Multi-Currency Accounting
- รองรับการบันทึกหลายสกุลเงินพร้อมกัน (เช่น เงินบาท `THB`, สกุลเงินในเกม `WIP`, `MAYG`, หรือคริปโต)
- คำนวณและแสดงยอดเงินคงเหลือสะสม (Remaining Balances) ของแต่ละสกุลเงินแยกกันอย่างถูกต้อง

### 📱 5. Progressive Web App (Offline-First PWA)
- ติดตั้งลงบนหน้าจอสมาร์ตโฟน (iOS / Android) และเดสก์ท็อป (Chrome / Edge / Windows) ได้เหมือนแอปพลิเคชันทั่วไป
- ใช้งานได้แม้ในขณะที่ไม่มีอินเทอร์เน็ต ผ่าน Service Worker แคชชิ่งและ LocalStorage สำรอง

### 📋 6. Gamer & Daily Clipboard Formatter
- ปุ่มคลิกเดียวคัดลอกสรุปยอดเงินประจำวันลง Clipboard ในรูปแบบข้อความพร้อมส่งลงกลุ่มหรือแชตได้ทันที

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Frontend:** HTML5, Vanilla JavaScript (ES6+), Vanilla CSS3 (Custom Design System, Flexbox, CSS Grid)
- **Design Theme:** Google Sheets Dark Theme (`#0F9D58` Accent, `#1a1a1f` Panel, Custom Monospace/Inter Typography)
- **Cloud Database:** Google Firebase Cloud Firestore (SDK Compat v10.8.0, Multi-device Real-Time Listener)
- **Offline & Storage:** Firestore Persistence Caching, HTML5 LocalStorage Fallback, Cache API
- **Application Framework:** Progressive Web App (Service Worker `sw.js`, Web App Manifest `manifest.json`)
- **Hosting:** GitHub Pages

---

## 🚀 การเริ่มต้นใช้งาน (Getting Started)

### วิธีที่ 1: เข้าใช้งานผ่านเว็บเบราว์เซอร์
เข้าใช้งานผ่าน URL: [https://hallhcl.github.io/MyDailyTracker/](https://hallhcl.github.io/MyDailyTracker/)

### วิธีที่ 2: รันในเครื่อง (Local Development)
1. Clone repository นี้:
   ```bash
   git clone https://github.com/HallHcl/MyDailyTracker.git
   ```
2. เปิดไฟล์ **`money.html`** บนเว็บเบราว์เซอร์ใดก็ได้ โดยไม่ต้องติดตั้ง Node.js หรือเซิร์ฟเวอร์เพิ่มเติม

---

## 📄 เอกสารประกอบเพิ่มเติม (Documentation)
อ่านรายละเอียดเชิงลึกเกี่ยวกับสถาปัตยกรรมระบบ, โครงสร้างฐานข้อมูล Firestore และคู่มือการพัฒนาระบบได้ที่ [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)
