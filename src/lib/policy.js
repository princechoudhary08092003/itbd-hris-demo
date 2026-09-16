function slugify(text) {
  return text
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .join("-");
}

let seq = 100;

/**
 * Stands in for an AI drafting assistant: takes a plain-language topic and a
 * few key points, and returns a standard-formatted policy — the same
 * Purpose / Scope / Policy Statement / Procedure / Responsibilities shape
 * every ITBD policy follows, so anything drafted here reads consistently
 * with the rest of the Policy Hub.
 */
export function generateSopDraft(topic, rawPoints) {
  const points = rawPoints
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => (/[.!?]$/.test(p) ? p : `${p}.`));

  seq += 1;
  return {
    document_id: `POL-${slugify(topic)}-${seq}`,
    title: topic,
    category: "Custom",
    version: "0.1 (Draft)",
    points: points.length > 0 ? points : ["No key points were provided — add at least one before saving."],
    sections: {
      purpose: `This policy defines ITBD's standard for ${topic.toLowerCase()}, so expectations are consistent and auditable across every team and location.`,
      scope: "Applies to all active employment records — employee, vendor, and contractor — unless a specific exclusion is noted below.",
      procedure: "Day-to-day application of this policy follows the points above; exceptions must be approved by the relevant manager and logged with People & HR.",
      responsibilities: "Employees are responsible for following this policy. Managers are responsible for reviewing exceptions. People & HR owns this document and any updates to it.",
    },
  };
}
