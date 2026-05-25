import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = "HonoredCompanies";

  if (!token || !baseId) {
    console.warn("[honored-companies] Airtable env not set");
    return NextResponse.json(
      { ok: false, message: "Configuration error" },
      { status: 500 }
    );
  }

  try {
    const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}?sort[0][field]=Order&sort[0][direction]=asc`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 }, // Cache 5 minutes
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[honored-companies] Airtable error:", res.status, text);
      return NextResponse.json(
        { ok: false, message: "Failed to fetch data" },
        { status: 500 }
      );
    }

    const data = await res.json();

    // Transform to simpler format for frontend
    const companies = data.records.map((record: {
      id: string;
      fields: {
        Name?: string;
        ProfileUrl?: string;
        JobsUrl?: string;
        Order?: number;
      };
    }) => ({
      id: record.id,
      name: record.fields.Name || "",
      profileUrl: record.fields.ProfileUrl || "#",
      jobsUrl: record.fields.JobsUrl || "#",
      order: record.fields.Order || 0,
    }));

    return NextResponse.json({
      ok: true,
      companies,
      total: companies.length,
    });
  } catch (error) {
    console.error("[honored-companies] Error:", error);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}
