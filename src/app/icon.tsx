import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F59E0B",
          borderRadius: "8px",
          color: "#0a0e1a",
          fontSize: "26px",
          fontWeight: 800,
          fontFamily: "sans-serif",
          lineHeight: 1,
        }}
      >
        ↑
      </div>
    ),
    { ...size }
  );
}
