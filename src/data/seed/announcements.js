function isoDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export const announcements = [
  { announcement_id: "ANN-01", title: "Q3 all-hands recap and Q4 priorities", posted_on: isoDaysAgo(2), posted_by: "Arjun Mehta", body: "Thank you to everyone who joined the Q3 all-hands. Recording and slides are on the Policy Hub. Q4 priorities: platform reliability, EU delivery ramp-up, and the HRIS rollout." },
  { announcement_id: "ANN-02", title: "New comp-off policy effective this cycle", posted_on: isoDaysAgo(9), posted_by: "Fatima Al-Sayed", body: "Comp-off earned on a holiday or week-off must now be redeemed within 60 days of approval. See Policy Hub for the full policy." },
  { announcement_id: "ANN-03", title: "Founders Day thank-you", posted_on: isoDaysAgo(17), posted_by: "Fatima Al-Sayed", body: "Thank you to the support team who covered client incidents over the Founders Day holiday — comp-off has been credited." },
];

// A queue of pending manager approvals, surfaced on the "Awaiting my action" dashboard widget.
// These are derived live from leave_requests / comp_offs / movement_requests in the data store,
// this file only seeds the underlying records (see dataStore.js selectors).
