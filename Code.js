/**
 * Opens the HTML form.
 */
function doGet() {
  return HtmlService
    .createHtmlOutputFromFile('data entry')
    .setTitle('জমি ও দলিল রেজিষ্ট্রেশন তথ্য ফরম');
}

/**
 * Verify Google Login using Active User Email and 'Users' Sheet
 */
function verifyGoogleLogin() {
  try {
    // ব্রাউজারে বর্তমানে যে গুগল অ্যাকাউন্ট দিয়ে লগইন করা আছে তার ইমেইল সংগ্রহ করা
    var userEmail = Session.getActiveUser().getEmail();

    if (!userEmail) {
      return {
        success: false,
        message: "আপনার গুগল অ্যাকাউন্ট সনাক্ত করা যায়নি। দয়া করে ব্রাউজারে লগইন করুন।"
      };
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Users');

    if (!sheet) {
      return {
        success: false,
        message: "'Users' নামের কোনো শিট পাওয়া যায়নি।"
      };
    }

    const data = sheet.getDataRange().getValues();
    var isAuthorized = false;

    // Users শিটের কলাম B (Index 1) হলো Email
    for (var i = 1; i < data.length; i++) {
      var sheetEmail = String(data[i][1]).trim().toLowerCase();

      if (sheetEmail === userEmail.toLowerCase()) {
        isAuthorized = true;
        break;
      }
    }

    if (isAuthorized) {
      return {
        success: true,
        message: "লগইন সফল হয়েছে।"
      };
    } else {
      return {
        success: false,
        message: "এই ইমেইলটি (" + userEmail + ") ডেটা এন্ট্রি করার জন্য অনুমোদিত নয়।"
      };
    }

  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "লগইন যাচাই করতে সমস্যা হয়েছে: " + error.message
    };
  }
}

/**
 * Saves submitted form data to the Data sheet with optimized concurrency control.
 */
function saveData(data) {
  var lock = LockService.getScriptLock();
  
  try {
    var hasLock = lock.tryLock(3000); 
    if (!hasLock) {
      throw new Error('সার্ভারে এই মুহূর্তে অতিরিক্ত চাপ রয়েছে। অনুগ্রহ করে এক মুহূর্ত পর আবার চেষ্টা করুন।');
    }

    if (!data) {
      throw new Error('কোনো ডাটা পাওয়া যায়নি।');
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Data');

    if (!sheet) {
      throw new Error('Data নামে কোনো sheet পাওয়া যায়নি।');
    }

    if (!data.recordId) {
      throw new Error('Record ID পাওয়া যায়নি।');
    }

    const now = new Date();
    const timestamp = `REC-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
    
    // ডাটা সেভ করার সময় অটো ইউজারের আসল ইমেইল রেকর্ড হবে
    const userEmail = Session.getActiveUser().getEmail() || 'Web User';

    const baseRowData = [
      timestamp,
      userEmail,
      data.oldFileNo || '',
      data.newFileNo || '',
      data.mouza || '',
      data.thana || '',
      data.deedType || '',
      data.granteeCode || '',
      data.deedNo || '',
      data.deedDate || '',
      data.csKhatian || '',
      data.saKhatian || '',
      data.rsKhatian || '',
      data.mutationCase || '',
      data.mutationKhatian || '',
      data.donor || '',
      data.grantee || '',
      data.medium || ''
    ];

    var rsDagCount = 0;

    for (var i = 1; i <= 10; i++) {
      var rsDag = data['rsDag' + i] || '';

      if (rsDag.trim() !== '') {
        rsDagCount++;

        var csDag = data['csDag' + i] || '';
        var saDag = data['saDag' + i] || '';
        var purchasedLand = data['purchasedLand' + i] || '';

        var completeRowData = baseRowData.concat([
          csDag,
          saDag,
          rsDag,
          purchasedLand
        ]);
        
        sheet.appendRow(completeRowData);
      }
    }

    if (rsDagCount === 0) {
      throw new Error('অন্তت একটি আর.এস দাগ পূরণ করতে হবে।');
    }

    return {
      success: true,
      message: rsDagCount + 'টি দাগের তথ্য সফলভাবে সংরক্ষণ করা হয়েছে।'
    };

  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: error.message
    };
  } finally {
    lock.releaseLock();
  }
}