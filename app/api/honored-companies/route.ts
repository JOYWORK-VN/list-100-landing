import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Force dynamic rendering - không dùng cache
export const dynamic = "force-dynamic";

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
    // Không sort ở Airtable - sort bằng JS sau khi nhận data
    const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
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

    // Log fields để debug
    console.log("[honored-companies] Raw fields sample:", data.records?.[0]?.fields);

    // Transform và sort bằng JS - lấy tất cả field name để sort
    const companies = data.records
      .filter((record: { fields: Record<string, unknown> }) => record.fields.Name)
      .map((record: { id: string; fields: Record<string, unknown> }) => {
        const fields = record.fields;
        // Tìm field order - thử nhiều tên khác nhau
        let order = 0;
        if (fields.Order !== undefined) order = Number(fields.Order) || 0;
        else if (fields["#Order"] !== undefined) order = Number(fields["#Order"]) || 0;
        else if (fields.order !== undefined) order = Number(fields.order) || 0;

        return {
          id: record.id,
          name: String(fields.Name || ""),
          profileUrl: String(fields.ProfileUrl || fields.profileUrl || ""),
          jobsUrl: String(fields.JobsUrl || fields.jobsUrl || ""),
          order,
        };
      })
      // Sort theo order giảm dần (DN mới nhất lên đầu)
      .sort((a: { order: number }, b: { order: number }) => b.order - a.order);

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
