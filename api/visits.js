const counterName = "porfolio-visits";

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Content-Type", "application/json; charset=utf-8");

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const host = request.headers["x-forwarded-host"] || request.headers.host;
  const origin = request.headers.origin;
  let originHost;
  try {
    originHost = new URL(origin).host;
  } catch {
    return response.status(403).json({ error: "Forbidden" });
  }
  if (originHost !== host) {
    return response.status(403).json({ error: "Forbidden" });
  }

  const workspace = process.env.COUNTERAPI_WORKSPACE;
  const token = process.env.COUNTERAPI_TOKEN;
  if (!workspace || !token) {
    console.error("Visit counter is missing its CounterAPI environment configuration.");
    return response.status(503).json({ error: "Visit counter is not configured" });
  }

  try {
    const counterUrl = new URL(
      `/v2/${encodeURIComponent(workspace)}/${counterName}/up`,
      "https://api.counterapi.dev",
    );
    const counterResponse = await fetch(counterUrl, {
      headers: { Authorization: token, Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });

    if (!counterResponse.ok) {
      console.error(`CounterAPI returned status ${counterResponse.status}.`);
      return response.status(502).json({ error: "Unable to update visit count" });
    }

    const result = await counterResponse.json();
    const rawValue = result?.value ?? result?.data?.value;
    const value =
      typeof rawValue === "number"
        ? rawValue
        : typeof rawValue === "string" && /^\d+$/.test(rawValue)
          ? Number(rawValue)
          : NaN;

    if (!Number.isSafeInteger(value) || value < 0) {
      console.error("CounterAPI returned an invalid visit count.", {
        responseKeys: Object.keys(result ?? {}),
        dataKeys: Object.keys(result?.data ?? {}),
        valueType: typeof rawValue,
      });
      return response.status(502).json({ error: "Unable to update visit count" });
    }

    return response.status(200).json({ value });
  } catch (error) {
    console.error("CounterAPI visit update failed.", error);
    return response.status(502).json({ error: "Unable to update visit count" });
  }
}
