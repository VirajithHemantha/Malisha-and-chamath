1. Open the Google Sheet:
   https://docs.google.com/spreadsheets/d/1g8kllbbrl7LYF9vzs41TLCSPBVEeGYGBXohBkM_S8KE/edit
2. Open Extensions > Apps Script.
3. Replace the script content with the code from google-apps-script/code.gs and save.
4. Select the `setup` function in the toolbar and click Run. Approve the permission prompt.
   This creates the RSVP and Wishes tabs with their headers.
5. Click Deploy > New deployment.
6. Select type: Web app.
7. Execute as: Me.
8. Who has access: Anyone.
9. Deploy and copy the Web App URL (it ends in /exec).
10. Paste the URL into SCRIPT_URL at the top of src/lib/sheets.ts.

Notes:
- If you update the Apps Script code later, use Deploy > Manage deployments > Edit > New version
  so the URL stays the same.
- RSVPs go to the RSVP tab (Timestamp, Full Name, Guests, Dietary Notes).
- Wishes go to the Wishes tab (Timestamp, Name, Message).
- The tabs are also created automatically on the first submission if they are missing.
