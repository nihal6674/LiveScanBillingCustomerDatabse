# LiveScanBillingCustomerDatabse
The warnings section proactively flags billing risks like unbilled services, suspended customers, and missed exports, so nothing slips through the cracks.


In billing systems:

DOJ/FBI fees change

Discounts come and go

Special cases appear

With admin-managed fees:

Admin adds a new fee

Disables old one

No code changes

No data corruption



TO DO IN PRODUCTION


src/controllers/auth.controller.js
res.clearCookie("token", {
    httpOnly: true,
    secure: false,      // true in production (HTTPS)
    sameSite: "lax",
  });



| Endpoint                               | Role  | Result          |
| -------------------------------------- | ----- | --------------- |
| `GET /api/organizations`               | ADMIN | ✅ All orgs      |
| `POST /api/organizations`              | ADMIN | ✅               |
| `PATCH /api/organizations/:id/suspend` | ADMIN | ✅               |
| `GET /api/organizations/staff`         | STAFF | ✅ Active only   |
| `GET /api/organizations`               | STAFF | ❌ Access denied |




FEES

Test Endpoints
🔹 Admin – Create Fee
POST /api/fees
Authorization: Bearer <ADMIN_JWT>
{
  "label": "DOJ – Standard",
  "amount": 32
}

🔹 Admin – Disable Fee
PATCH /api/fees/:id/active
Authorization: Bearer <ADMIN_JWT>

🔹 Staff – Get Dropdown Values
GET /api/fees/staff
Authorization: Bearer <STAFF_JWT>


Response:

[
  { "_id": "...", "label": "DOJ – Standard", "amount": 32 },
  { "_id": "...", "label": "FBI – Reduced", "amount": 17 }
]



SERVICE RECORD




Invoice numbers are system-generated, unique, and tied to the export batch, ensuring:

No duplicate invoice numbers

Safe re-exports

Clear traceability between invoices and exports

The customer name can include both the organization and service description as requested, without affecting invoice grouping.