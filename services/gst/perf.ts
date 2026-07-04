export function gstPerfNow(): number {
  return Date.now();
}

export function gstPerfLog(phase: string, startedAtMs: number, details: Record<string, unknown> = {}): void {
  console.info("[GST PERF]", {
    phase,
    durationMs: Date.now() - startedAtMs,
    ...details,
  });
}
