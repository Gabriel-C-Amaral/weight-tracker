import { Redis } from "@upstash/redis";
const kv = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});
import { NextResponse } from "next/server";

const INITIAL_GABRIEL = [
  { date: "21/11/25", gabriel: 90.90 }, { date: "22/11/25", gabriel: 90.55 },
  { date: "23/11/25", gabriel: 90.70 }, { date: "24/11/25", gabriel: 90.70 },
  { date: "25/11/25", gabriel: 90.10 }, { date: "26/11/25", gabriel: 90.10 },
  { date: "27/11/25", gabriel: 90.50 }, { date: "28/11/25", gabriel: 89.95 },
  { date: "02/12/25", gabriel: 89.85 }, { date: "03/12/25", gabriel: 89.40 },
  { date: "04/12/25", gabriel: 89.80 }, { date: "05/12/25", gabriel: 89.90 },
  { date: "06/12/25", gabriel: 89.40 }, { date: "08/12/25", gabriel: 89.30 },
  { date: "09/12/25", gabriel: 89.15 }, { date: "10/12/25", gabriel: 89.30 },
  { date: "11/12/25", gabriel: 89.25 }, { date: "12/12/25", gabriel: 88.85 },
  { date: "13/12/25", gabriel: 88.50 }, { date: "14/12/25", gabriel: 88.05 },
  { date: "15/12/25", gabriel: 88.50 }, { date: "17/12/25", gabriel: 88.25 },
  { date: "18/12/25", gabriel: 88.05 }, { date: "19/12/25", gabriel: 87.85 },
  { date: "20/12/25", gabriel: 87.25 }, { date: "21/12/25", gabriel: 87.35 },
  { date: "22/12/25", gabriel: 87.30 }, { date: "23/12/25", gabriel: 87.10 },
  { date: "24/12/25", gabriel: 86.90 }, { date: "25/12/25", gabriel: 86.85 },
  { date: "26/12/25", gabriel: 86.55 }, { date: "29/12/25", gabriel: 86.25 },
  { date: "30/12/25", gabriel: 86.45 }, { date: "31/12/25", gabriel: 86.25 },
  { date: "01/01/26", gabriel: 86.00 }, { date: "05/01/26", gabriel: 86.10 },
  { date: "06/01/26", gabriel: 85.85 }, { date: "07/01/26", gabriel: 85.40 },
  { date: "08/01/26", gabriel: 85.20 }, { date: "09/01/26", gabriel: 85.35 },
  { date: "10/01/26", gabriel: 84.75 }, { date: "11/01/26", gabriel: 84.55 },
  { date: "12/01/26", gabriel: 84.80 }, { date: "13/01/26", gabriel: 84.55 },
  { date: "14/01/26", gabriel: 84.65 }, { date: "18/01/26", gabriel: 83.50 },
  { date: "19/01/26", gabriel: 83.60 }, { date: "20/01/26", gabriel: 84.00 },
  { date: "21/01/26", gabriel: 84.00 }, { date: "22/01/26", gabriel: 83.65 },
  { date: "23/01/26", gabriel: 83.75 }, { date: "24/01/26", gabriel: 83.40 },
  { date: "25/01/26", gabriel: 83.40 }, { date: "26/01/26", gabriel: 83.40 },
  { date: "27/01/26", gabriel: 83.25 }, { date: "28/01/26", gabriel: 83.10 },
  { date: "29/01/26", gabriel: 82.90 }, { date: "30/01/26", gabriel: 82.85 },
  { date: "31/01/26", gabriel: 82.85 }, { date: "01/02/26", gabriel: 82.80 },
  { date: "02/02/26", gabriel: 82.60 }, { date: "03/02/26", gabriel: 83.35 },
  { date: "04/02/26", gabriel: 83.15 }, { date: "05/02/26", gabriel: 82.70 },
  { date: "06/02/26", gabriel: 82.45 }, { date: "07/02/26", gabriel: 82.25 },
  { date: "08/02/26", gabriel: 82.30 }, { date: "09/02/26", gabriel: 82.60 },
  { date: "10/02/26", gabriel: 81.85 }, { date: "11/02/26", gabriel: 81.15 },
  { date: "12/02/26", gabriel: 81.75 }, { date: "13/02/26", gabriel: 82.00 },
  { date: "14/02/26", gabriel: 81.25 }, { date: "15/02/26", gabriel: 81.40 },
  { date: "16/02/26", gabriel: 81.15 }, { date: "17/02/26", gabriel: 81.25 },
  { date: "18/02/26", gabriel: 80.95 }, { date: "19/02/26", gabriel: 81.45 },
  { date: "20/02/26", gabriel: 82.15 }, { date: "21/02/26", gabriel: 81.45 },
  { date: "22/02/26", gabriel: 81.65 }, { date: "23/02/26", gabriel: 81.35 },
  { date: "24/02/26", gabriel: 81.10 }, { date: "25/02/26", gabriel: 80.65 },
  { date: "26/02/26", gabriel: 80.55 }, { date: "27/02/26", gabriel: 80.25 },
  { date: "28/02/26", gabriel: 80.50 }, { date: "01/03/26", gabriel: 80.65 },
  { date: "02/03/26", gabriel: 79.95 }, { date: "03/03/26", gabriel: 80.00 },
];

const INITIAL_MELISSA = [
  { date: "21/11/25", melissa: 100.20 }, { date: "22/11/25", melissa: 100.90 },
  { date: "23/11/25", melissa: 100.90 }, { date: "24/11/25", melissa: 100.55 },
  { date: "25/11/25", melissa: 100.70 }, { date: "26/11/25", melissa: 100.65 },
  { date: "27/11/25", melissa: 100.50 }, { date: "01/12/25", melissa: 99.40 },
  { date: "02/12/25", melissa: 99.80 },  { date: "03/12/25", melissa: 98.60 },
  { date: "04/12/25", melissa: 99.15 },  { date: "05/12/25", melissa: 99.10 },
  { date: "06/12/25", melissa: 98.95 },  { date: "08/12/25", melissa: 98.90 },
  { date: "09/12/25", melissa: 99.05 },  { date: "10/12/25", melissa: 98.75 },
  { date: "11/12/25", melissa: 97.90 },  { date: "12/12/25", melissa: 98.10 },
  { date: "13/12/25", melissa: 97.70 },  { date: "14/12/25", melissa: 97.85 },
  { date: "15/12/25", melissa: 98.10 },  { date: "16/12/25", melissa: 97.60 },
  { date: "17/12/25", melissa: 97.45 },  { date: "18/12/25", melissa: 97.00 },
  { date: "19/12/25", melissa: 96.90 },  { date: "20/12/25", melissa: 96.80 },
  { date: "21/12/25", melissa: 97.00 },  { date: "22/12/25", melissa: 96.90 },
  { date: "23/12/25", melissa: 96.75 },  { date: "24/12/25", melissa: 97.15 },
  { date: "25/12/25", melissa: 97.30 },  { date: "26/12/25", melissa: 96.85 },
  { date: "29/12/25", melissa: 96.55 },  { date: "30/12/25", melissa: 96.20 },
  { date: "31/12/25", melissa: 96.05 },  { date: "01/01/26", melissa: 96.30 },
  { date: "05/01/26", melissa: 95.35 },  { date: "06/01/26", melissa: 95.35 },
  { date: "07/01/26", melissa: 95.05 },  { date: "08/01/26", melissa: 95.05 },
  { date: "09/01/26", melissa: 95.10 },  { date: "10/01/26", melissa: 95.20 },
  { date: "11/01/26", melissa: 94.50 },  { date: "12/01/26", melissa: 94.80 },
  { date: "13/01/26", melissa: 94.30 },  { date: "14/01/26", melissa: 94.45 },
  { date: "15/01/26", melissa: 94.45 },  { date: "16/01/26", melissa: 94.30 },
  { date: "17/01/26", melissa: 94.30 },  { date: "18/01/26", melissa: 94.30 },
  { date: "19/01/26", melissa: 94.15 },  { date: "20/01/26", melissa: 94.35 },
  { date: "21/01/26", melissa: 94.35 },  { date: "22/01/26", melissa: 94.25 },
  { date: "23/01/26", melissa: 94.20 },  { date: "24/01/26", melissa: 94.05 },
  { date: "25/01/26", melissa: 93.70 },  { date: "26/01/26", melissa: 93.35 },
  { date: "27/01/26", melissa: 93.70 },  { date: "28/01/26", melissa: 94.05 },
  { date: "29/01/26", melissa: 92.90 },  { date: "30/01/26", melissa: 92.90 },
  { date: "31/01/26", melissa: 93.00 },  { date: "01/02/26", melissa: 92.20 },
  { date: "02/02/26", melissa: 93.00 },  { date: "03/02/26", melissa: 92.90 },
  { date: "04/02/26", melissa: 94.20 },  { date: "05/02/26", melissa: 93.45 },
  { date: "07/02/26", melissa: 93.15 },  { date: "08/02/26", melissa: 93.25 },
  { date: "09/02/26", melissa: 93.40 },  { date: "10/02/26", melissa: 93.25 },
  { date: "11/02/26", melissa: 92.55 },  { date: "12/02/26", melissa: 92.90 },
  { date: "13/02/26", melissa: 92.30 },  { date: "14/02/26", melissa: 92.15 },
  { date: "15/02/26", melissa: 92.30 },  { date: "16/02/26", melissa: 92.40 },
  { date: "17/02/26", melissa: 92.45 },  { date: "18/02/26", melissa: 91.95 },
  { date: "19/02/26", melissa: 91.85 },  { date: "20/02/26", melissa: 91.70 },
  { date: "21/02/26", melissa: 91.70 },  { date: "22/02/26", melissa: 92.00 },
  { date: "23/02/26", melissa: 91.95 },  { date: "24/02/26", melissa: 91.95 },
  { date: "25/02/26", melissa: 91.55 },  { date: "26/02/26", melissa: 91.20 },
  { date: "27/02/26", melissa: 91.20 },  { date: "28/02/26", melissa: 91.20 },
  { date: "01/03/26", melissa: 91.05 },  { date: "02/03/26", melissa: 90.95 },
  { date: "03/03/26", melissa: 91.10 },
];

function parseDate(str) {
  const [d, m, y] = str.split("/").map(Number);
  return new Date(2000 + y, m - 1, d);
}

function sortByDate(arr) {
  return [...arr].sort((a, b) => parseDate(a.date) - parseDate(b.date));
}

// GET /api/weights — returns { gabriel: [...], melissa: [...] }
export async function GET() {
  try {
    const gabriel = await kv.get("wt-gabriel") ?? INITIAL_GABRIEL;
    const melissa = await kv.get("wt-melissa") ?? INITIAL_MELISSA;
    return NextResponse.json({ gabriel, melissa });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ gabriel: INITIAL_GABRIEL, melissa: INITIAL_MELISSA });
  }
}

// POST /api/weights — body: { person: "gabriel"|"melissa", date: "DD/MM/YY", weight: number }
export async function POST(req) {
  try {
    const { person, date, weight } = await req.json();

    if (!["gabriel", "melissa"].includes(person)) {
      return NextResponse.json({ error: "Invalid person" }, { status: 400 });
    }
    if (!date || typeof weight !== "number" || weight < 30 || weight > 300) {
      return NextResponse.json({ error: "Invalid date or weight" }, { status: 400 });
    }

    const key = person === "gabriel" ? "wt-gabriel" : "wt-melissa";
    const field = person;
    const current = await kv.get(key) ?? (person === "gabriel" ? INITIAL_GABRIEL : INITIAL_MELISSA);

    // Replace if date exists, otherwise add
    const updated = sortByDate([
      ...current.filter(d => d.date !== date),
      { date, [field]: weight },
    ]);

    await kv.set(key, updated);
    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
