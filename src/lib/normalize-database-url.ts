const SSL_MODES_REQUIRING_NORMALIZATION = new Set([
  "prefer",
  "require",
  "verify-ca",
]);

export function normalizeDatabaseUrl(connectionString: string): string {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(connectionString);
  } catch {
    return connectionString;
  }

  const sslMode = parsedUrl.searchParams.get("sslmode")?.toLowerCase();

  if (!sslMode || !SSL_MODES_REQUIRING_NORMALIZATION.has(sslMode)) {
    return connectionString;
  }

  if (parsedUrl.searchParams.get("uselibpqcompat") === "true") {
    return connectionString;
  }

  parsedUrl.searchParams.set("sslmode", "verify-full");

  return parsedUrl.toString();
}
