import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { ImageResponse } from "next/og";

export const alt = "bornworks — where products are born";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const font = (path: string) =>
  readFile(fileURLToPath(new URL(path, import.meta.url)));

export default async function OgImage() {
  const [bold, medium] = await Promise.all([
    font("./_og/SpaceGrotesk-700.ttf"),
    font("./_og/SpaceGrotesk-500.ttf"),
  ]);

  const AMBER = "#F59E0B";
  const INK = "#F7F8FB";
  const MUTED = "#8A93A6";
  const HAIRLINE = "#1E2740";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "68px 72px",
          background: "#070A14",
          fontFamily: "Space Grotesk",
          position: "relative",
        }}
      >
        {/* Signature: oversized up-chevron echoing the logo, bleeding off the right */}
        <div
          style={{
            position: "absolute",
            right: "62px",
            top: "232px",
            width: "300px",
            height: "300px",
            borderLeft: `30px solid ${AMBER}`,
            borderTop: `30px solid ${AMBER}`,
            transform: "rotate(45deg)",
          }}
        />

        {/* Top row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "rgba(245,158,11,0.14)",
              }}
            >
              <div
                style={{
                  width: "18px",
                  height: "18px",
                  borderLeft: `5px solid ${AMBER}`,
                  borderTop: `5px solid ${AMBER}`,
                  transform: "rotate(45deg) translate(3px, 3px)",
                }}
              />
            </div>
            <div style={{ display: "flex", fontSize: "30px", fontWeight: 700 }}>
              <span style={{ color: INK }}>born</span>
              <span style={{ color: AMBER }}>works</span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: "18px",
              fontWeight: 500,
              letterSpacing: "4px",
              color: MUTED,
            }}
          >
            SOFTWARE STUDIO — INDONESIA
          </div>
        </div>

        {/* Headline + descriptor */}
        <div style={{ display: "flex", flexDirection: "column", zIndex: 10 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: "104px",
              fontWeight: 700,
              lineHeight: 0.96,
              letterSpacing: "-4px",
              color: INK,
            }}
          >
            <div style={{ display: "flex" }}>Where products</div>
            <div style={{ display: "flex" }}>
              <span>are</span>
              <span style={{ color: AMBER, marginLeft: "0.3em" }}>born.</span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "30px",
              fontSize: "29px",
              fontWeight: 500,
              color: MUTED,
            }}
          >
            Web · Mobile · SaaS — dari ide sampai launch
          </div>
        </div>

        {/* Meta baseline */}
        <div style={{ display: "flex", flexDirection: "column", zIndex: 10 }}>
          <div
            style={{ display: "flex", height: "1px", background: HAIRLINE, marginBottom: "22px" }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "21px",
              fontWeight: 500,
            }}
          >
            <span style={{ color: INK }}>bornworks.biz.id</span>
            <span style={{ color: MUTED }}>Next.js · Flutter · Laravel · TypeScript</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Space Grotesk", data: bold, weight: 700, style: "normal" },
        { name: "Space Grotesk", data: medium, weight: 500, style: "normal" },
      ],
    }
  );
}
