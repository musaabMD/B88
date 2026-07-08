"use client";

import type { ReactNode } from "react";
import { Component } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ConvexErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    const message = error.message.includes("bookmarks:list")
      ? "Backend not ready. Convex functions need to be deployed."
      : error.message;
    return { hasError: true, message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center text-foreground">
          <h1 className="mb-2 text-lg font-medium">B88</h1>
          <p className="mb-4 text-sm text-muted">{this.state.message}</p>
          <p className="text-xs text-muted">
            Run: <code className="text-foreground">npx convex dev --once</code>
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
