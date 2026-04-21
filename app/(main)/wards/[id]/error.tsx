"use client";

export default function WardDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="card mt-6 text-center">
      <p className="font-medium text-ink">エラーが発生しました</p>
      <p className="mt-2 text-sm text-ink-muted">{error.message}</p>
      {error.digest && (
        <p className="mt-1 font-mono text-xs text-ink-soft">digest: {error.digest}</p>
      )}
      <button onClick={reset} className="btn-secondary mt-4">
        再試行
      </button>
    </div>
  );
}
