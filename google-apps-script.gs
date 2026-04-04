function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Consultations");
  var data = JSON.parse(e.postData.contents);

  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Consultations");
    sheet.appendRow([
      "Timestamp",
      "Full Name",
      "Contact Number",
      "Email Address",
      "Senior Name",
      "Age",
      "Lives Alone",
      "Conditions",
      "Relationship",
      "Residence",
      "Senior Contact",
      "Support Reason",
      "Family Details",
      "Extra Details",
      "Response Copy"
    ]);
  }

  sheet.appendRow([
    new Date(),
    data["full-name"] || "",
    data["contact-number"] || "",
    data["email-address"] || "",
    data["senior-name"] || "",
    data["senior-age"] || "",
    data["lives-alone"] || "",
    data.conditions || "",
    data.relationship || "",
    data.residence || "",
    data["senior-contact"] || "",
    data["support-reason"] || "",
    data["family-details"] || "",
    data["extra-details"] || "",
    data["response-copy"] ? "Yes" : "No"
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
