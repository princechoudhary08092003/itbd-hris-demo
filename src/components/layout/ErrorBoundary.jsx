import { Component } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";

// A safety net so a crash on one page renders a recoverable message instead
// of a blank screen — does not change behavior on any page that renders
// successfully.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidUpdate(prevProps) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="mx-auto mt-10 max-w-md text-center">
          <p className="text-sm font-semibold text-[var(--text-primary)]">Something went wrong loading this page</p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">Try going back, or head to the dashboard.</p>
          <div className="mt-4 flex justify-center gap-2">
            <Button variant="secondary" onClick={() => window.history.back()}>Go Back</Button>
            <Button onClick={() => (window.location.href = "/")}>Dashboard</Button>
          </div>
        </Card>
      );
    }
    return this.props.children;
  }
}
