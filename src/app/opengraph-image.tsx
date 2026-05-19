import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "bornworks — Software House Indonesia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "linear-gradient(135deg, #FEF3C7 0%, #FFFFFF 40%, #FFF7E6 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Background accent circles */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(245,158,11,0.12)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-60px",
            left: "-60px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(245,158,11,0.08)",
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "18px",
              background: "rgba(245,158,11,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderLeft: "4px solid #F59E0B",
                borderTop: "4px solid #F59E0B",
                transform: "rotate(45deg) translate(4px, 4px)",
              }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <span style={{ fontSize: "48px", fontWeight: 800, color: "#111827" }}>born</span>
            <span style={{ fontSize: "48px", fontWeight: 800, color: "#F59E0B" }}>works</span>
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: "52px",
            fontWeight: 800,
            color: "#111827",
            textAlign: "center",
            lineHeight: 1.15,
            maxWidth: "860px",
            marginBottom: "24px",
          }}
        >
          Software House Indonesia
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "26px",
            color: "#6B7280",
            textAlign: "center",
            maxWidth: "700px",
            lineHeight: 1.5,
            marginBottom: "48px",
          }}
        >
          Web App · Mobile App · SaaS — dari ide sampai launch
        </div>

        {/* Badges */}
        <div style={{ display: "flex", gap: "16px" }}>
          {["Next.js", "Flutter", "Laravel", "TypeScript"].map((tech) => (
            <div
              key={tech}
              style={{
                background: "rgba(245,158,11,0.1)",
                border: "1px solid rgba(245,158,11,0.3)",
                borderRadius: "100px",
                padding: "10px 24px",
                fontSize: "18px",
                fontWeight: 600,
                color: "#D97706",
              }}
            >
              {tech}
            </div>
          ))}
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: "36px",
            fontSize: "20px",
            color: "#9CA3AF",
            fontWeight: 500,
          }}
        >
          bornworks.id
        </div>
      </div>
    ),
    { ...size }
  );
}
