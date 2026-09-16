function isoDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

// Historical signatures — deliberately sparse for POL-ATT-014 (the new
// Remote Work & Attendance Policy) so the demo has real people left to sign.
export const policyAcknowledgments = [
  { ack_id: "ACK-001", document_id: "POL-CONDUCT-001", employment_id: "EMY-P007-01", signature_name: "Chloe Bennett", signed_at: isoDaysAgo(200), signature_data_url: null },
  { ack_id: "ACK-002", document_id: "POL-CONDUCT-001", employment_id: "EMY-P012-01", signature_name: "Grace Oyelaran", signed_at: isoDaysAgo(195), signature_data_url: null },
  { ack_id: "ACK-003", document_id: "POL-CONDUCT-001", employment_id: "EMY-P017-01", signature_name: "Ben Thompson", signed_at: isoDaysAgo(210), signature_data_url: null },
  { ack_id: "ACK-004", document_id: "POL-NDA-007", employment_id: "EMY-P007-01", signature_name: "Chloe Bennett", signed_at: isoDaysAgo(198), signature_data_url: null },
  { ack_id: "ACK-005", document_id: "POL-NDA-007", employment_id: "EMY-P017-01", signature_name: "Ben Thompson", signed_at: isoDaysAgo(208), signature_data_url: null },
];
