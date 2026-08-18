# 📊 My Daily Tracker - Project Overview & Technical Documentation

> **ระบบบันทึกรายรับ-รายจ่ายประจำวันสไตล์ Google Sheets Dark Theme**
> รองรับหลายสกุลเงิน (Multi-Currency), อัปเดตข้อมูลขึ้น Google Sheets แบบ Real-Time อัตโนมัติ, สร้างแท็บชีทตามเดือนให้อัตโนมัติ และรองรับการทำงานแบบ Offline PWA

---

## 📖 1. ภาพรวมโครงการ (Executive Summary)

**My Daily Tracker** เป็นเว็บแอปพลิเคชันรูปแบบ **Progressive Web App (PWA)** ที่ถูกออกแบบมาเพื่อการบันทึกรายรับ-รายจ่ายประจำวัน โดยเฉพาะสำหรับผู้ใช้งานที่ต้องการบริหารจัดการหลายสกุลเงินพร้อมกัน (เช่น เงินบาท `THB`, สกุลเงินในเกม `WIP`, `MAYG`) 

ตัวแอปถูกดีไซน์ด้วยธีม **Google Sheets Dark Mode** เพื่อความคุ้นเคย มีความสวยงาม ใช้งานง่าย รวดเร็ว และสามารถซิงค์ข้อมูลกับ **Google Sheets** ส่วนตัวได้แบบ Real-Time ผ่าน Google Apps Script โดยไม่มีค่าใช้จ่ายเซิร์ฟเวอร์ใดๆ

---

## 🛠️ 2. เทคโนโลยีที่ใช้ (Tech Stack & Architecture)

- **Frontend Core:** HTML5, Vanilla JavaScript (ES6+), Vanilla CSS3 (Custom Design System, CSS Variables, Flexbox & Grid)
- **UI Theme:** Google Sheets Dark Mode (`#0F9D58` Accent, `#1a1a1f` Panel, Gridlines `rgba(255,255,255,0.08)`)
- **Data Persistence (Offline-First):** HTML5 `localStorage` บันทึกข้อมูลในเครื่องทันทีแม้ไม่มีอินเทอร์เน็ต
- **PWA Integration:** Web App Manifest (`manifest.json`) + Service Worker (`sw.js`) รองรับการติดตั้งลงบนหน้าจอโทรศัพท์มือถือและคอมพิวเตอร์
- **Cloud Backend Sync:** Google Apps Script Web App Endpoint (`doGet`) รับคำขอผ่านเทคนิค **Image Beacon (GET Request)** เพื่อก้าวข้ามข้อจำกัด CORS และการแปลง `POST` เป็น `GET` ของเบราว์เซอร์

---

## ✨ 3. คุณสมบัติเด่นของระบบ (Core Features Breakdown)

### 3.1 Google Sheets Dark UI & Formula Bar (`fx`)
- **Top Bar:** แสดงชื่อไฟล์ `MyDailyTracker.xlsx`, สถานะการเชื่อมต่อ Cloud (`Synced to Google Sheets` / `Saved to Local Storage`), ปุ่มตั้งค่าเงินตั้งต้น, ปุ่ม Cloud Sync และปุ่ม Copy Clipboard
- **Formula Bar (`fx`):** แถบป้อนข้อมูลแนวยาวสไตล์ช่องสูตร Excel/Sheets กรอกจำนวนเงิน, เลือกสกุลเงิน และระบุคำอธิบาย พร้อมปุ่มกด `+ Income` และ `- Expense`

### 3.2 ระบบบริหารจัดการหลายสกุลเงิน (Multi-Currency Accounting)
- รองรับการตั้งค่า **เงินตั้งต้น (Initial Balances)** แยกตามสกุลเงิน
- คำนวณ **เงินคงเหลือปัจจุบัน (Remaining Balances)** ของแต่ละสกุลเงินแยกกันอย่างเด็ดขาด โดยไม่นำตัวเลขคนละสกุลเงินมาบวกกันโดยตรง
- แสดงชิปสรุปยอดเงินคงเหลือสะสม (Account Remaining Balances) บน แถบ Toolbar ด้านบน

### 3.3 ตารางสเปรดชีต (Spreadsheet Grid Table)
- หัวคอลัมน์มาตรฐานสไตล์สเปรดชีต `A` ถึง `G`:
  - **`A: DATE`** - วันที่บันทึกรายการ
  - **`B: TIME`** - เวลาบันทึกรายการ
  - **`C: TYPE`** - ประเภทรายการ (INCOME / EXPENSE)
  - **`D: AMOUNT`** - จำนวนเงิน (แสดงสีเขียว `+` สำหรับรายรับ, สีแดง `-` สำหรับรายจ่าย)
  - **`E: CURRENCY`** - สกุลเงิน (`THB`, `WIP`, ฯลฯ)
  - **`F: DESCRIPTION`** - รายละเอียดคำอธิบาย
  - **`G: BALANCE`** - ยอดเงินคงเหลือสะสมในบัญชี ณ รายการนั้นๆ
- ลำดับแถวตัวเลขด้านซ้าย `1, 2, 3...` พร้อมปุ่มลบรายการ (Delete Row)

### 3.4 ระบบแจ้งเตือนโมเดิร์น (Custom Toast Notifications)
- แทนที่ป๊อปอัป Alert เชยๆ ของเบราว์เซอร์ด้วย **Toast Notification Banner** สไลด์ลอยอย่างนุ่มนวลจากมุมบนขวา
- แสดงสีและไอคอนตามสถานะ: 🟢 **Success** (สำเร็จ), 🔵 **Info** (ข้อมูล/คัดลอก), 🔴 **Error** (ข้อผิดพลาด)

### 3.5 ตัวกรองชื่อเดือนและปี (Month & Year Filter)
- ตัวกรองที่มุมขวาบน (`📅 กรกฎาคม 2026`) ดึงรายการเดือนและปีที่มีบันทึกสร้างเป็นตัวเลือกให้อัตโนมัติ
- เมื่อสลับเดือน: ตารางสเปรดชีต, การ์ดสรุปยอดรายรับ-รายจ่าย และ กราฟใน Dashboard จะกรองแสดงเฉพาะข้อมูลของเดือนที่เลือกทันที

### 3.6 แท็บชีทสรุปสถิติ (📊 Dashboard Sheet)
- **Accounts Summary (Initial vs Remaining):** ตารางการ์ดสรุปเปรียบเทียบเงินตั้งต้น, รวมรายรับ, รวมรายจ่าย และเงินคงเหลือปัจจุบัน
- **Period Stats Overview:** สรุปจำนวนรายการและเวลาบันทึกล่าสุด
- **Income vs Expense Breakdown Bar Charts:** กราฟแท่งเปรียบเทียบสัดส่วนรายรับและรายจ่ายแยกตามสกุลเงิน
- **Activity Log Stats:** สถิติจำนวนวันที่บันทึกทั้งหมดและจำนวนบันทึกทั้งหมด

### 3.7 รูปแบบการคัดลอกลง Clipboard สำหรับเกมเมอร์ (Thai Game Clipboard Formatter)
- ฟอร์แมตข้อความที่ถูกออกแบบมาเป็นพิเศษเพื่อคัดลอกนำไปแปะสรุปในกลุ่มหรือบันทึกประจำวัน:
  ```text
  ###### [Day_Number]. เงินที่ได้จากเกม [Income_List]/ = รวมเงินรายวันทีได้จากเกม +[Total_Income] THB = เสียเงินวันนี้ -[Expense_List]/ = รวมทั้งวันวันนี้ [Net_Today] THB = รวมเงินเก่าทั้งหมดใน บช [Grand_Total] THB
  ```

### 3.8 การตรวจสอบและป้องกันวันค้าง (Smart Auto-Reset / Missing Days)
- ระบบตรวจสอบวันล็อกอินล่าสุด หากพบว่ามีวันที่ไม่ได้เข้าใช้งาน ระบบจะสร้างบันทึกยอด `0` สำหรับวันที่ขาดไปให้อัตโนมัติ เพื่อรักษาความต่อเนื่องของข้อมูลวันในรายงาน

---

## ☁️ 4. การเชื่อมต่อ Google Sheets (Google Apps Script Integration)

การเชื่อมต่อใช้ **Google Apps Script** เป็นตัวกลางในการเขียนข้อมูลลงใน Google Sheet ของผู้ใช้โดยตรง โดยมีคุณสมบัติพิเศษดังนี้:

1. **Auto Create Monthly Sheet Tabs:** เมื่อขึ้นเดือนใหม่ ระบบจะสร้างแท็บ New Sheet ด้านล่างให้อัตโนมัติ (เช่น แท็บ `กรกฎาคม 2026`, `สิงหาคม 2026`)
2. **Deduplication (ป้องกันแถวซ้ำ):** ระบบจะสแกนตรวจสอบข้อมูลก่อนเขียนลงตาราง หากรายการซ้ำจะข้ามให้อัตโนมัติ
3. **Auto Column Resizing:** ขยายความกว้างช่อง Description ตามความยาวข้อความให้อัตโนมัติ
5. **Two-Way Sync & Import (ดึงข้อมูลกลับเข้าเว็บ):** รองรับ `action=get_all` เพื่อดึงข้อมูลทุก Sheet กลับมาแสดงผลบนเว็บเบราว์เซอร์อัตโนมัติ พร้อมระบบ JSONP และ Direct Paste สำรอง

### 📜 โค้ดฉบับสมบูรณ์สำหรับ Google Apps Script:

```javascript
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    if (!e || !e.parameter) {
      return ContentService.createTextOutput("Tracker API Ready!");
    }
    
    // 1. ADD SINGLE TRANSACTION
    if (e.parameter.action === "add") {
      var timestamp = e.parameter.timestamp;
      var sheet = getMonthlySheet(ss, timestamp);
      
      var amount = Number(e.parameter.amount);
      var currency = e.parameter.currency;
      var type = e.parameter.type;
      var tag = e.parameter.tag || "";
      var date = e.parameter.date;
      var balance = e.parameter.balance ? Number(e.parameter.balance) : "";
      var d = new Date(Number(timestamp) || Date.now());
      var timeStr = d.toLocaleTimeString();
      
      if (!isDuplicateRow(sheet, date, timeStr, type, amount, currency, tag)) {
        sheet.appendRow([date, timeStr, type, amount, currency, tag, balance]);
        var lastRow = sheet.getLastRow();
        styleRow(sheet, lastRow, type);
        sheet.autoResizeColumns(1, 7);
      }
      return ContentService.createTextOutput("SUCCESS");
    } 
    // 2. SYNC ALL / CHUNK
    else if (e.parameter.action === "sync_chunk" || e.parameter.action === "sync_all") {
      var isFirst = e.parameter.is_first === "1";
      var txList = [];
      if (e.parameter.payload) {
        txList = JSON.parse(e.parameter.payload);
      }
      
      var txByMonth = {};
      txList.forEach(function(tx) {
        if (!tx.isDummy) {
          var d = new Date(tx.timestamp || Date.now());
          var months = [
            "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
            "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
          ];
          var sheetName = months[d.getMonth()] + " " + d.getFullYear();
          if (!txByMonth[sheetName]) txByMonth[sheetName] = [];
          txByMonth[sheetName].push(tx);
        }
      });
      
      for (var sheetName in txByMonth) {
        var sheet = ss.getSheetByName(sheetName);
        if (!sheet) {
          sheet = ss.insertSheet(sheetName);
        }
        
        if (isFirst) {
          sheet.clear();
          sheet.appendRow(["Date", "Time", "Type", "Amount", "Currency", "Description", "Balance"]);
          var headerRange = sheet.getRange(1, 1, 1, 7);
          headerRange.setBackground("#0F9D58")
                     .setFontColor("#FFFFFF")
                     .setFontWeight("bold")
                     .setHorizontalAlignment("center");
          sheet.setRowHeight(1, 35);
        }
        
        var list = txByMonth[sheetName];
        list.forEach(function(tx) {
          var d = new Date(tx.timestamp);
          var timeStr = d.toLocaleTimeString();
          var amount = Number(tx.amount);
          var tag = tx.tag || "";
          var balance = tx.runningBalance !== undefined ? Number(tx.runningBalance) : "";
          
          sheet.appendRow([tx.date, timeStr, tx.type, amount, tx.currency, tag, balance]);
          var r = sheet.getLastRow();
          styleRow(sheet, r, tx.type);
        });
        sheet.autoResizeColumns(1, 7);
      }
      
      return ContentService.createTextOutput("SUCCESS SYNC");
    }
    // 3. GET ALL TRANSACTIONS (IMPORT TO WEB APP)
    else if (e.parameter.action === "get_all") {
      var sheets = ss.getSheets();
      var allTransactions = [];
      
      sheets.forEach(function(sheet) {
        var lastRow = sheet.getLastRow();
        if (lastRow > 1) {
          var values = sheet.getRange(2, 1, lastRow - 1, 7).getValues();
          for (var i = 0; i < values.length; i++) {
            var row = values[i];
            var dateVal = row[0];
            var timeVal = row[1];
            var typeVal = row[2];
            var amountVal = row[3];
            var currVal = row[4];
            var tagVal = row[5];
            
            if (dateVal && amountVal !== "" && !isNaN(Number(amountVal))) {
              var formattedDate = "";
              if (dateVal instanceof Date) {
                var y = dateVal.getFullYear();
                var m = String(dateVal.getMonth() + 1).padStart(2, '0');
                var day = String(dateVal.getDate()).padStart(2, '0');
                formattedDate = y + "-" + m + "-" + day;
              } else {
                formattedDate = String(dateVal).trim();
              }
              
              allTransactions.push({
                date: formattedDate,
                time: String(timeVal || ""),
                type: String(typeVal || "income").toLowerCase(),
                amount: Number(amountVal),
                currency: String(currVal || "THB").toUpperCase(),
                tag: String(tagVal || "")
              });
            }
          }
        }
      });
      
      var responseObj = {
        status: "success",
        count: allTransactions.length,
        transactions: allTransactions
      };
      
      var callback = e.parameter.callback;
      if (callback) {
        return ContentService.createTextOutput(callback + "(" + JSON.stringify(responseObj) + ")")
          .setMimeType(ContentService.MimeType.JAVASCRIPT);
      } else {
        return ContentService.createTextOutput(JSON.stringify(responseObj))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    return ContentService.createTextOutput("Tracker API Ready!");
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function isDuplicateRow(sheet, date, timeStr, type, amount, currency, tag) {
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return false;
  
  var data = sheet.getRange(2, 1, lastRow - 1, 7).getValues();
  for (var i = 0; i < data.length; i++) {
    var r = data[i];
    if (r[0] && String(r[0]) === String(date) && 
        String(r[1]) === String(timeStr) && 
        String(r[2]) === String(type) && 
        Number(r[3]) === Number(amount) && 
        String(r[4]) === String(currency) && 
        String(r[5]) === String(tag)) {
      return true;
    }
  }
  return false;
}

function getMonthlySheet(ss, timestamp) {
  var d = new Date(Number(timestamp) || Date.now());
  var months = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];
  var sheetName = months[d.getMonth()] + " " + d.getFullYear();
  
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(["Date", "Time", "Type", "Amount", "Currency", "Description", "Balance"]);
    var headerRange = sheet.getRange(1, 1, 1, 7);
    headerRange.setBackground("#0F9D58")
               .setFontColor("#FFFFFF")
               .setFontWeight("bold")
               .setHorizontalAlignment("center");
    sheet.setRowHeight(1, 35);
  }
  return sheet;
}

function styleRow(sheet, rowNum, type) {
  var range = sheet.getRange(rowNum, 1, 1, 7);
  sheet.setRowHeight(rowNum, 28);
  range.setVerticalAlignment("middle");
  
  if (type === "income") {
    range.setBackground("#E8F5E9");
    sheet.getRange(rowNum, 3).setFontColor("#2E7D32").setFontWeight("bold");
    sheet.getRange(rowNum, 4).setFontColor("#1B5E20").setFontWeight("bold");
  } else {
    range.setBackground("#FFEBEE");
    sheet.getRange(rowNum, 3).setFontColor("#C62828").setFontWeight("bold");
    sheet.getRange(rowNum, 4).setFontColor("#B71C1C").setFontWeight("bold");
  }
  sheet.getRange(rowNum, 7).setFontWeight("bold").setFontColor("#0F9D58");
}

function doPost(e) {
  return doGet(e);
}
```

---

## 📁 5. โครงสร้างไฟล์ในโปรเจกต์ (File Structure)

```text
MyDailyTracker/
├── index.html            # โครงสร้างหน้าเว็บ UI (Google Sheets Dark Theme)
├── style.css             # ระบบดีไซน์ ตารางสเปรดชีต Toast และ Responsive Layout
├── script.js             # การจัดการ State, สกุลเงิน, สถิติ, Filter และ Sync Engine
├── manifest.json         # PWA Manifest (ไอคอน และคอนฟิกการติดตั้งลงเครื่อง)
├── sw.js                 # Service Worker ออฟไลน์แคชชิ่ง
└── PROJECT_OVERVIEW.md   # เอกสารสรุปรายละเอียดโปรเจกต์ (ไฟล์นี้)
```

---

## 🔑 6. โครงสร้างคีย์ข้อมูล (Data Schema - LocalStorage)

| Key | Type | คำอธิบาย |
|---|---|---|
| `tracker_initialBalances` | `Object` | ออบเจกต์เก็บยอดเงินตั้งต้น e.g. `{"THB": 10000, "WIP": 500}` |
| `tracker_transactions` | `Array<Object>` | อาร์เรย์เก็บประวัติรายการทั้งหมด `[{id, date, timestamp, type, currency, tag, amount}]` |
| `tracker_lastLoginDate` | `String` | วันที่เข้าใช้งานล่าสุด e.g. `"2026-07-29"` |
| `tracker_googleSheetUrl` | `String` | Web App URL จาก Google Apps Script |
| `tracker_isSeeded` | `String` | ฟลายก์ระบุว่าได้สร้างข้อมูลตัวอย่างเริ่มต้นแล้วหรือยัง (`"true"`) ป้องกันการ re-seed ข้อมูลที่ลบไปแล้ว |

---

## 🚀 7. ขั้นตอนการติดตั้งใช้งาน (User Deployment Guide)

1. **เปิดตาราง Google Sheets** ของคุณ
2. ไปที่เมนู **ส่วนขยาย (Extensions) > Apps Script**
3. ลบโค้ดเดิมออก แล้วนำโค้ด Apps Script ด้านบนไปวางแทนที่
4. กด **บันทึก (Save 💾)**
5. กดปุ่มสีน้ำเงิน **Deploy > Manage deployments** 
6. กดรูปดินสอ **Edit ✏️** -> เลือก **Version: New version** -> กด **Deploy**
7. ก๊อปปี้ **Web App URL** มาวางในปุ่ม **📊 Cloud Sync** ในหน้าเว็บของเรา แล้วกด **Save URL**
8. กดปุ่ม **⚡ Sync All Data Now** เพื่อซิงค์ข้อมูลเข้าสู่ Google Sheets อย่างสมบูรณ์!

---

*สร้างสรรค์และพัฒนาโดยทีม Antigravity AI* 🚀
