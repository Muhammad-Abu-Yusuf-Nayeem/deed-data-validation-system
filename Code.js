/**
 * Opens the HTML form.
 */
function doGet() {
  return HtmlService
    .createHtmlOutputFromFile('data entry')
    .setTitle('জমি ও দলিল রেজিষ্ট্রেশন তথ্য ফরম');
}

/**
 * Saves submitted form data to the Data sheet with optimized concurrency control.
 */
function saveData(data) {
  // Acquire a script lock to prevent race conditions from concurrent submissions
  var lock = LockService.getScriptLock();
  
  // Wait up to 3 seconds for other concurrent writes to finish
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

    // Generate formatted timestamp: REC-YYYYMMDD-HHMMSS
    const now = new Date();
    const timestamp = `REC-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
    
    // Capture the active user's email address
    const userEmail = Session.getActiveUser().getEmail() || 'Unknown / External User';

    // সাধারণ বা কমন তথ্যগুলো যা প্রতি রো-তে একই থাকবে
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

    // ১ থেকে ১০ পর্যন্ত লুপ চালিয়ে নন-এম্পটি আর.এস দাগ (rsDag) গণনা করা এবং প্রতিটির জন্য আলাদা রো তৈরি করা
    for (var i = 1; i <= 10; i++) {
      var rsDag = data['rsDag' + i] || '';

      // যদি আর.এস দাগ খালি না থাকে
      if (rsDag.trim() !== '') {
        rsDagCount++;

        var csDag = data['csDag' + i] || '';
        var saDag = data['saDag' + i] || '';
        var purchasedLand = data['purchasedLand' + i] || '';

        // বেস ডেটার সাথে নির্দিষ্ট দাগ ও জমির পরিমাণ যুক্ত করা
        var completeRowData = baseRowData.concat([
          csDag,
          saDag,
          rsDag,
          purchasedLand
        ]);
        
        sheet.appendRow(completeRowData);
      }
    }

    // যদি কোনো আর.এস দাগ পূরণ করা না থাকে
    if (rsDagCount === 0) {
      throw new_Error('অন্তত একটি আর.এস দাগ পূরণ করতে হবে।');
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
    // Always release the lock so subsequent requests can proceed
    lock.releaseLock();
  }
}