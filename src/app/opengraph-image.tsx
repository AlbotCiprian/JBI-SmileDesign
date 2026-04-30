import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "JBI Smile Design — Clinică stomatologică în Chișinău";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#0B1F3A",
          backgroundImage:
            "radial-gradient(circle at 90% 10%, rgba(22,135,255,0.45) 0%, transparent 50%), radial-gradient(circle at 10% 90%, rgba(216,195,165,0.25) 0%, transparent 50%)",
          padding: "70px 80px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 14,
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0B1F3A",
              fontWeight: 800,
              fontSize: 28,
              letterSpacing: -1,
            }}
          >
            JBI
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#D8C3A5",
            }}
          >
            Smile Design
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 80,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 920,
            }}
          >
            Zâmbetul tău,{" "}
            <span style={{ color: "#1687FF" }}>creat cu grijă</span>
          </div>
          <div
            style={{
              fontSize: 32,
              color: "rgba(255,255,255,0.75)",
              maxWidth: 880,
              lineHeight: 1.3,
            }}
          >
            Clinică stomatologică modernă în Chișinău · RO / EN / RU
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            fontSize: 24,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          <div>📍 Grenoble 257, Chișinău</div>
          <div>📞 +373 601 18 991</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
