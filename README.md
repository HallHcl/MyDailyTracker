# 📊 MyDailyTracker

ระบบบันทึกรายรับ-รายจ่ายประจำวันสไตล์ **Google Sheets Dark Theme** 
รองรับหลายสกุลเงิน (Multi-Currency), อัปเดตข้อมูลขึ้น Google Sheets แบบ Real-Time อัตโนมัติ, ติ๊กเลือกหลายรายการลบพร้อมกัน และรองรับการทำงานแบบ Offline PWA

---

## ✨ Features
- **Google Sheets Dark UI**: อินเทอร์เฟซมืดสวยงาม ใช้งานง่าย คุ้นเคย รวดเร็ว
- **Multi-Currency Management**: บริหารจัดการหลายสกุลเงินพร้อมกัน (`THB`, `WIP`, ฯลฯ) แยกยอดเงินคงเหลือสะสมอย่างเด็ดขาด
- **Multi-Select & Bulk Delete**: เลือกหลายรายการพร้อมกัน และยืนยันการลบอย่างปลอดภัยด้วยการพิมพ์ `delete`
- **Google Sheets Two-Way Cloud Sync**: ซิงค์ข้อมูลเข้า Google Sheets แบบ Real-Time และกด **📥 Import Data** ดึงประวัติทั้งหมดกลับเข้าเว็บได้ในคลิกเดียว
- **Direct Paste Import**: รองรับการ Copy ตารางจาก Google Sheets มาวาง (Ctrl+V) เพื่อนำเข้าข้อมูลได้ทันที
- **Offline PWA Support**: ทำงานได้เต็มรูปแบบแม้ไม่มีอินเทอร์เน็ต และรองรับการติดตั้งลงบนสมาร์ตโฟนและเดสก์ท็อป

---

## 🛠️ Tech Stack
- HTML5, Vanilla JavaScript (ES6+), Vanilla CSS3 (Custom Design System)
- LocalStorage (Offline-First Data Persistence)
- Service Worker & PWA Manifest (`sw.js`, `manifest.json`)
- Google Apps Script (Web App API Endpoint)

---

## 🚀 Quick Start
1. Clone repository นี้:
   ```bash
   git clone https://github.com/HallHcl/MyDailyTracker.git
   ```
2. เปิดไฟล์ `index.html` บนเว็บเบราว์เซอร์ได้ทันทีโดยไม่ต้องติดตั้งเอนจินเพิ่มเติม!
