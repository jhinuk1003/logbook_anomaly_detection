import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    return NextResponse.json({
      status: "DISPATCHED",
      channel: payload.channel || "SLACK",
      incidentId: payload.incident_id || `INC-1888-${Date.now().toString().slice(-4)}`,
      receivedAt: new Date().toISOString(),
      galvanicConfirmation: "TELEGRAM ACKNOWLEDGED BY UPSTREAM STATION",
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "ERROR", message: error.message || "Failed to dispatch telegraph notification." },
      { status: 500 }
    );
  }
}
