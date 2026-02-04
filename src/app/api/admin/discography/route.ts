import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "src/constants/taylor_discography.json");
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

export async function GET() {
    try {
        const data = fs.readFileSync(DATA_PATH, "utf-8");
        return NextResponse.json(JSON.parse(data));
    } catch (e) {
        return NextResponse.json({ error: "No se pudo leer la discografía" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const token = request.headers.get("x-admin-token");
        if (!ADMIN_TOKEN || token !== ADMIN_TOKEN) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const body = await request.json();
        const data = fs.readFileSync(DATA_PATH, "utf-8");
        const albums = JSON.parse(data);
        albums.push(body);
        fs.writeFileSync(DATA_PATH, JSON.stringify(albums, null, 2), "utf-8");
        return NextResponse.json({ ok: true });
    } catch (e) {
        return NextResponse.json({ error: "No se pudo actualizar" }, { status: 500 });
    }
}
