import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <Card className="mx-auto mt-10 max-w-md text-center">
      <p className="text-sm font-semibold text-[var(--text-primary)]">Page not found</p>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">This screen doesn't exist, or the link is out of date.</p>
      <div className="mt-4 flex justify-center gap-2">
        <Button variant="secondary" onClick={() => window.history.back()}>Go Back</Button>
        <Link to="/"><Button>Dashboard</Button></Link>
      </div>
    </Card>
  );
}
