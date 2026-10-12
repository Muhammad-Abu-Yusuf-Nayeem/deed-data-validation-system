# Deed Data Validation System

A web-based data-entry workflow for capturing land purchase deed
information in a structured format using **Google Apps Script** and
**Google Sheets**.

The project is intended to reduce inconsistent data entry, make deed
dates unambiguous, support concurrent submissions, and establish a
review-and-approval process before records are treated as clean data.

## Current workflow

1.  A user enters deed and land information through a web form.
2.  Dropdowns provide standardized choices for fields such as mouza,
    thana, deed type, and grantee company.
3.  The form submits the data to Google Apps Script.
4.  The backend validates basic requirements and writes a separate row
    for each non-empty RS dag to the `Data` sheet.
5.  A submission timestamp and the active user's email (when available)
    are recorded with the data.

## Planned review workflow

The next development stage is to add a deed analyst review process:

1.  An analyst reviews and corrects submitted records.
2.  The analyst marks a record as approved using a checkbox.
3.  Approved records are transferred to a separate clean-data sheet only
    when the required conditions are satisfied.
4.  The transfer process should prevent duplicate transfers and preserve
    traceability between submitted and approved records.

**Note:** The analyst review, approval checkbox, and conditional
transfer are planned features; they are not implemented in the current
code yet.

## Technology stack

-   HTML
-   CSS and Tailwind CSS
-   JavaScript
-   Google Apps Script
-   Google Sheets
-   Git and GitHub

## Repository structure

``` text
deed-data-validation-system/
├── Code.gs
├── data entry.html
├── README.md
└── .gitignore
```

The HTML filename must remain consistent with the filename used by
`HtmlService.createHtmlOutputFromFile()` in `Code.gs`.

## Setup

1.  Create or select a Google Spreadsheet and add a sheet named `Data`.
2.  Open **Extensions → Apps Script** from that spreadsheet.
3.  Add the backend code to `Code.gs`.
4.  Add the form HTML as a file named `data entry` in the Apps Script
    project (Apps Script HTML filenames are referenced without the
    `.html` extension).
5.  Deploy the project as a web app with the appropriate access settings
    for your organization.
6.  Test submissions with non-sensitive sample data before using real
    records.

## Data handling and traceability

The current implementation is designed to record:

-   A generated submission reference
-   Submission timestamp
-   Active user's email, when available
-   File and location details
-   Deed details and khatian references
-   Donor, grantee, and intermediary details
-   CS, SA, and RS dag references
-   Purchased land area

The backend writes one row per non-empty RS dag, repeating the common
deed information for each row.

## Security

-   `.clasp.json` is intentionally excluded from Git using `.gitignore`.
-   Do not commit real deed records, personal information,
    company-confidential data, credentials, or access tokens.
-   Restrict spreadsheet and web-app access to authorized users.
-   Test how user identity is captured under the chosen Google Apps
    Script deployment and access settings; the active user's email may
    not be available in every deployment context.

## Project status

**Status:** Initial web-form data capture implemented; analyst review
and approved-data transfer planned.

This repository is an evolving internal-workflow and portfolio project.
Validate the application with test data and review access controls
before production use.
