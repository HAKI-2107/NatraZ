export default function Slide02Problem() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{
        backgroundColor: "#0F2537",
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.1) 0.1vh, transparent 0.1vh), linear-gradient(90deg, rgba(255,255,255,0.1) 0.1vw, transparent 0.1vw), linear-gradient(rgba(255,255,255,0.05) 0.05vh, transparent 0.05vh), linear-gradient(90deg, rgba(255,255,255,0.05) 0.05vw, transparent 0.05vw)",
        backgroundSize: "5vw 5vw, 5vw 5vw, 1vw 1vw, 1vw 1vw",
        fontFamily: "'DM Mono', monospace",
        color: "#E0F2FE",
      }}
    >
      {/* Border frame */}
      <div style={{ position: "absolute", top: "2vh", left: "2vw", right: "2vw", bottom: "2vh", border: "0.2vw solid #7DD3FC", boxSizing: "border-box" }}>
        <div style={{ position: "absolute", top: "1vh", left: "1vw", right: "1vw", bottom: "1vh", border: "0.1vw dashed rgba(125,211,252,0.5)", boxSizing: "border-box" }} />
      </div>

      {/* Crosshairs */}
      <div style={{ position: "absolute", top: "10vh", left: "10vw", width: "2vw", height: "0.1vh", backgroundColor: "#7DD3FC" }} />
      <div style={{ position: "absolute", top: "9vw", left: "10.95vw", width: "0.1vw", height: "2vw", backgroundColor: "#7DD3FC" }} />
      <div style={{ position: "absolute", bottom: "10vh", right: "10vw", width: "2vw", height: "0.1vh", backgroundColor: "#7DD3FC" }} />
      <div style={{ position: "absolute", bottom: "9vw", right: "10.95vw", width: "0.1vw", height: "2vw", backgroundColor: "#7DD3FC" }} />

      {/* Top marker */}
      <div style={{ position: "absolute", top: "4vh", left: "50vw", transform: "translateX(-50%)", fontSize: "0.8vw", color: "#7DD3FC", display: "flex", alignItems: "center", gap: "1vw" }}>
        <span>|</span>
        <span style={{ borderTop: "0.1vh solid #7DD3FC", width: "10vw", display: "inline-block" }} />
        <span>ELEVATION B</span>
        <span style={{ borderTop: "0.1vh solid #7DD3FC", width: "10vw", display: "inline-block" }} />
        <span>|</span>
      </div>

      {/* Content area */}
      <div style={{ position: "absolute", top: "13vh", left: "9vw", width: "82vw", height: "74vh", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
        {/* Heading */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3.5vh", borderBottom: "0.1vh solid rgba(125,211,252,0.3)", paddingBottom: "2vh" }}>
          <div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "4.5vw", fontWeight: 700, margin: 0, textTransform: "uppercase", letterSpacing: "-0.15vw", color: "#FFFFFF", textShadow: "0.1vw 0.1vw 0 rgba(125,211,252,0.2)" }}>
              The Problem
            </h2>
            <div style={{ fontSize: "0.85vw", color: "#7DD3FC", letterSpacing: "0.1vw", marginTop: "0.8vh" }}>FIG. 01 — SENSOR LIMITATIONS</div>
          </div>
          <div style={{ textAlign: "right", fontSize: "0.8vw", color: "rgba(224,242,254,0.6)", letterSpacing: "0.1vw" }}>
            <div>SPEC: SENSOR-IR</div>
            <div>STATUS: ACTIVE</div>
          </div>
        </div>

        {/* Two-column layout */}
        <div style={{ display: "flex", gap: "5vw", flex: 1 }}>
          {/* Left: bullet points */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2.8vh" }}>
            <div style={{ position: "relative", paddingLeft: "2vw" }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: "0.25vw", height: "100%", backgroundColor: "#7DD3FC" }} />
              <div style={{ fontSize: "0.85vw", color: "#7DD3FC", marginBottom: "0.4vh", letterSpacing: "0.1vw" }}>01 — ACQUISITION</div>
              <p style={{ fontSize: "1.2vw", color: "#E0F2FE", lineHeight: 1.5, margin: 0 }}>IR sensors capture data at night and through cloud cover — visible-spectrum cameras cannot</p>
            </div>
            <div style={{ position: "relative", paddingLeft: "2vw" }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: "0.25vw", height: "100%", backgroundColor: "rgba(125,211,252,0.45)" }} />
              <div style={{ fontSize: "0.85vw", color: "#7DD3FC", marginBottom: "0.4vh", letterSpacing: "0.1vw" }}>02 — IMAGE QUALITY</div>
              <p style={{ fontSize: "1.2vw", color: "#E0F2FE", lineHeight: 1.5, margin: 0 }}>Raw IR imagery is monochrome, low-contrast, and texturally flat</p>
            </div>
            <div style={{ position: "relative", paddingLeft: "2vw" }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: "0.25vw", height: "100%", backgroundColor: "rgba(125,211,252,0.45)" }} />
              <div style={{ fontSize: "0.85vw", color: "#7DD3FC", marginBottom: "0.4vh", letterSpacing: "0.1vw" }}>03 — HUMAN ANALYSIS</div>
              <p style={{ fontSize: "1.2vw", color: "#E0F2FE", lineHeight: 1.5, margin: 0 }}>Human analysts struggle to identify vehicles, buildings, roads, and vegetation</p>
            </div>
            <div style={{ position: "relative", paddingLeft: "2vw" }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: "0.25vw", height: "100%", backgroundColor: "rgba(125,211,252,0.45)" }} />
              <div style={{ fontSize: "0.85vw", color: "#7DD3FC", marginBottom: "0.4vh", letterSpacing: "0.1vw" }}>04 — AUTOMATION</div>
              <p style={{ fontSize: "1.2vw", color: "#E0F2FE", lineHeight: 1.5, margin: 0 }}>CV models trained on RGB data fail on grayscale IR inputs</p>
            </div>
          </div>

          {/* Right: schematic diagram */}
          <div style={{ width: "30vw", position: "relative", border: "0.1vw solid rgba(125,211,252,0.3)", backgroundColor: "rgba(15,37,55,0.7)" }}>
            <div style={{ position: "absolute", top: 0, left: 0, padding: "0.8vw", borderBottom: "0.1vw solid rgba(125,211,252,0.3)", borderRight: "0.1vw solid rgba(125,211,252,0.3)", fontSize: "0.75vw", color: "#7DD3FC" }}>DIAGRAM A.1</div>
            <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5vh", paddingTop: "3vh" }}>
              {/* Satellite box */}
              <div style={{ border: "0.15vw solid #7DD3FC", padding: "1vh 2vw", fontSize: "1vw", color: "#FFFFFF", letterSpacing: "0.1vw", backgroundColor: "rgba(125,211,252,0.08)" }}>SATELLITE SENSOR</div>
              <div style={{ width: "0.1vw", height: "2.5vh", backgroundColor: "#7DD3FC" }} />
              {/* IR data box */}
              <div style={{ border: "0.15vw solid rgba(125,211,252,0.6)", padding: "1vh 2vw", fontSize: "1vw", color: "#E0F2FE", letterSpacing: "0.1vw", backgroundColor: "rgba(125,211,252,0.04)" }}>IR RASTER DATA</div>
              <div style={{ width: "0.1vw", height: "2.5vh", backgroundColor: "rgba(125,211,252,0.5)" }} />
              {/* Problem box */}
              <div style={{ border: "0.15vw solid rgba(125,211,252,0.35)", padding: "1.2vh 2vw", fontSize: "0.9vw", color: "rgba(224,242,254,0.7)", letterSpacing: "0.08vw", textAlign: "center", backgroundColor: "rgba(15,37,55,0.5)" }}>
                <div>MONOCHROME</div>
                <div style={{ marginTop: "0.3vh" }}>LOW CONTRAST</div>
                <div style={{ marginTop: "0.3vh" }}>NO TEXTURE</div>
              </div>
              <div style={{ fontSize: "0.75vw", color: "rgba(125,211,252,0.6)", marginTop: "0.5vh", letterSpacing: "0.08vw" }}>UNINTERPRETABLE OUTPUT</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "0.1vh solid rgba(125,211,252,0.3)", paddingTop: "1.5vh", marginTop: "auto" }}>
          <div style={{ fontSize: "0.8vw", color: "rgba(224,242,254,0.6)" }}>DRAWN BY: Remote Sensing Research Team</div>
          <div style={{ fontSize: "0.8vw", color: "rgba(224,242,254,0.6)" }}>DATE: June 2026</div>
          <div style={{ fontSize: "0.8vw", color: "rgba(224,242,254,0.6)" }}>SHEET: 02/09</div>
        </div>
      </div>

      {/* Title block BR */}
      <div style={{ position: "absolute", bottom: "4vh", right: "4vw", width: "15vw", height: "8vh", border: "0.1vw solid #7DD3FC", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, borderBottom: "0.1vw solid #7DD3FC", display: "flex", alignItems: "center", paddingLeft: "0.5vw", fontSize: "0.7vw" }}>APPR: _________</div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", paddingLeft: "0.5vw", fontSize: "0.7vw" }}>SCALE: NTS</div>
      </div>
    </div>
  );
}
