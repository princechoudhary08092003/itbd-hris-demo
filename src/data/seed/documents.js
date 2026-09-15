function isoDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}
function isoDaysAhead(n) {
  return isoDaysAgo(-n);
}

// owner_type: person | employment | movement_request | pip_case
export const documents = [
  { document_id: "DOC-001", owner_type: "employment", owner_id: "EMY-P024-01", document_type: "government_id", file_name: "olivia_martinez_id.pdf", uploaded_on: isoDaysAgo(4), is_immutable: false },
  { document_id: "DOC-002", owner_type: "employment", owner_id: "EMY-P024-01", document_type: "signed_offer_letter", file_name: "olivia_martinez_offer.pdf", uploaded_on: isoDaysAgo(6), is_immutable: true },
  { document_id: "DOC-003", owner_type: "employment", owner_id: "EMY-P024-01", document_type: "education_certificate", file_name: "olivia_martinez_degree.pdf", uploaded_on: isoDaysAgo(3), is_immutable: false },
  { document_id: "DOC-004", owner_type: "employment", owner_id: "EMY-P011-01", document_type: "work_visa", file_name: "noah_becker_visa.pdf", uploaded_on: "2022-02-10", is_immutable: true, expiry_date: isoDaysAhead(45) },
  { document_id: "DOC-005", owner_type: "employment", owner_id: "EMY-P008-01", document_type: "work_permit", file_name: "hannah_kim_permit.pdf", uploaded_on: "2020-01-05", is_immutable: true, expiry_date: isoDaysAhead(210) },
  { document_id: "DOC-006", owner_type: "employment", owner_id: "EMY-P023-01", document_type: "vendor_agreement", file_name: "deepak_verma_sow.pdf", uploaded_on: "2025-01-02", is_immutable: true, expiry_date: isoDaysAhead(12) },
  { document_id: "DOC-007", owner_type: "person", owner_id: "P005", document_type: "national_id", file_name: "priya_nair_id.pdf", uploaded_on: "2019-02-20", is_immutable: true },
];

export const assets = [
  { asset_id: "AST-001", employment_id: "EMY-P013-01", asset_type: "laptop", issued_date: "2023-01-09", returned_date: null, status: "issued" },
  { asset_id: "AST-002", employment_id: "EMY-P013-01", asset_type: "badge", issued_date: "2023-01-09", returned_date: null, status: "issued" },
  { asset_id: "AST-003", employment_id: "EMY-P005-01", asset_type: "laptop", issued_date: "2019-03-01", returned_date: "2022-06-27", status: "returned" },
  { asset_id: "AST-004", employment_id: "EMY-P005-03", asset_type: "laptop", issued_date: "2025-02-03", returned_date: null, status: "issued" },
  { asset_id: "AST-005", employment_id: "EMY-P022-01", asset_type: "laptop", issued_date: "2022-10-24", returned_date: null, status: "issued" },
  { asset_id: "AST-006", employment_id: "EMY-P022-01", asset_type: "sim", issued_date: "2022-10-24", returned_date: null, status: "issued" },
  { asset_id: "AST-007", employment_id: "EMY-P023-01", asset_type: "badge", issued_date: "2025-01-06", returned_date: null, status: "issued" },
];
