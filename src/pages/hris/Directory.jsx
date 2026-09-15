import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDataStore } from "../../state/DataStore";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { Input, Select } from "../../components/ui/Field";
import { Avatar } from "../../components/ui/Misc";
import { activeEmployments, employmentDisplayName, getPosition, employmentTypeLabel } from "../../lib/selectors";

export default function Directory() {
  const { db } = useDataStore();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [location, setLocation] = useState("all");

  const locations = [...new Set(db.employments.map((e) => e.work_location).filter(Boolean))];

  const results = useMemo(() => {
    return activeEmployments(db)
      .filter((e) => location === "all" || e.work_location === location)
      .map((e) => ({ e, name: employmentDisplayName(db, e.employment_id), position: getPosition(db, e.position_id) }))
      .filter(({ name, position }) => !query || name.toLowerCase().includes(query.toLowerCase()) || position?.seat_title.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [db, query, location]);

  return (
    <div>
      <PageHeader title="Employee Directory" subtitle={`${results.length} people`} />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <Input placeholder="Search by name or title…" value={query} onChange={(e) => setQuery(e.target.value)} className="sm:max-w-sm" />
        <Select value={location} onChange={(e) => setLocation(e.target.value)} className="sm:max-w-[220px]">
          <option value="all">All locations</option>
          {locations.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {results.map(({ e, name, position }) => (
          <Link key={e.employment_id} to={`/hris/directory/${e.employment_id}`}>
            <Card className="h-full transition-colors hover:border-brand-cyan/50">
              <div className="flex items-center gap-3">
                <Avatar name={name} size={40} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--text-primary)]">{name}</p>
                  <p className="truncate text-xs text-[var(--text-secondary)]">{position?.seat_title}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span>{e.work_location}</span>
                <Badge tone={e.employment_type === "vendor" ? "violet" : "neutral"}>{employmentTypeLabel(e.employment_type)}</Badge>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
