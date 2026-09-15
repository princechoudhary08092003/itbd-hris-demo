export function buildPositionTree(db) {
  const byParent = new Map();
  for (const p of db.positions) {
    const key = p.reports_to_position_id ?? "ROOT";
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key).push(p);
  }

  function occupant(position) {
    return db.employments.find((e) => e.position_id === position.position_id && (e.employment_status === "active" || e.employment_status === "notice" || e.employment_status === "on_leave")) ?? null;
  }

  function node(position) {
    return {
      position,
      occupant: occupant(position),
      children: (byParent.get(position.position_id) ?? []).map(node),
    };
  }

  return (byParent.get("ROOT") ?? []).map(node);
}
