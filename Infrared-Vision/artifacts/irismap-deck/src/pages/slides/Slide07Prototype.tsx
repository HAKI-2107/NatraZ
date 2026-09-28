export default function Slide07Prototype() {
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
      <div style={{ position: "absolute", top: "2vh", left: "2vw", right: "2vw", bottom: "2vh", border: "0.2vw solid #7DD3FC", boxSizing: "border-box" }}>
        <div style={{ position: "absolute", top: "1vh", left: "1vw", right: "1vw", bottom: "1vh", border: "0.1vw dashed rgba(125,211,252,0.5)", boxSizing: "border-box" }} />
      </div>

      <div style={{ position: "absolute", top: "10vh", left: "10vw", width: "2vw", height: "0.1vh", backgroundColor: "#7DD3FC" }} />
      <div style={{ position: "absolute", top: "9vw", left: "10.95vw", width: "0.1vw", height: "2vw", backgroundColor: "#7DD3FC" }} />
      <div style={{ position: "absolute", bottom: "10vh", right: "10vw", width: "2vw", height: "0.1vh", backgroundColor: "#7DD3FC" }} />
      <div style={{ position: "absolute", bottom: "9vw", right: "10.95vw", width: "0.1vw", height: "2vw", backgroundColor: "#7DD3FC" }} />

      <div style={{ position: "absolute", top: "4vh", left: "50vw", transform: "translateX(-50%)", fontSize: "0.8vw", color: "#7DD3FC", display: "flex", alignItems: "center", gap: "1vw" }}>
        <span>|</span>
        <span style={{ borderTop: "0.1vh solid #7DD3FC", width: "10vw", display: "inline-block" }} />
        <span>ELEVATION E</span>
        <span style={{ borderTop: "0.1vh solid #7DD3FC", width: "10vw", display: "inline-block" }} />
        <span>|</span>
      </div>

      <div style={{ position: "absolute", top: "13vh", left: "9vw", width: "82vw", height: "74vh", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3.5vh", borderBottom: "0.1vh solid rgba(125,211,252,0.3)", paddingBottom: "2vh" }}>
          <div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "4.5vw", fontWeight: 700, margin: 0, textTransform: "uppercase", letterSpacing: "-0.15vw", color: "#FFFFFF", textShadow: "0.1vw 0.1vw 0 rgba(125,211,252,0.2)" }}>
              Prototype: IrisMap
            </h2>
            <div style={{ fontSize: "0.85vw", color: "#7DD3FC", letterSpacing: "0.1vw", marginTop: "0.8vh" }}>SPEC: INTERACTIVE WEB DEMO — PROTO-V0.9</div>
          </div>
          <div style={{ textAlign: "right", fontSize: "0.8vw", color: "rgba(224,242,254,0.6)", letterSpacing: "0.1vw" }}>
            <div>STATUS: FIELD READY</div>
            <div>PRIORITY: HIGH</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "4vw", flex: 1 }}>
          {/* Left: feature list */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2.2vh" }}>
            <div style={{ position: "relative", paddingLeft: "2vw" }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: "0.25vw", height: "100%", backgroundColor: "#7DD3FC" }} />
              <div style={{ fontSize: "0.8vw", color: "#7DD3FC", marginBottom: "0.3vh", letterSpacing: "0.1vw" }}>MAP ENGINE</div>
              <p style={{ fontSize: "1.1vw", color: "#E0F2FE", lineHeight: 1.5, margin: 0 }}>Real ESRI satellite tile layer — Hyderabad, India (17.36N, 78.78E)</p>
            </div>
            <div style={{ position: "relative", paddingLeft: "2vw" }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: "0.25vw", height: "100%", backgroundColor: "rgba(125,211,252,0.45)" }} />
              <div style={{ fontSize: "0.8vw", color: "#7DD3FC", marginBottom: "0.3vh", letterSpacing: "0.1vw" }}>BAND SWITCHING</div>
              <p style={{ fontSize: "1.1vw", color: "#E0F2FE", lineHeight: 1.5, margin: 0 }}>Live 6-mode switching with CSS-filter simulation</p>
            </div>
            <div style={{ position: "relative", paddingLeft: "2vw" }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: "0.25vw", height: "100%", backgroundColor: "rgba(125,211,252,0.45)" }} />
              <div style={{ fontSize: "0.8vw", color: "#7DD3FC", marginBottom: "0.3vh", letterSpacing: "0.1vw" }}>ENHANCEMENT</div>
              <p style={{ fontSize: "1.1vw", color: "#E0F2FE", lineHeight: 1.5, margin: 0 }}>Real-time sliders: contrast, brightness, saturation</p>
            </div>
            <div style={{ position: "relative", paddingLeft: "2vw" }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: "0.25vw", height: "100%", backgroundColor: "rgba(125,211,252,0.45)" }} />
              <div style={{ fontSize: "0.8vw", color: "#7DD3FC", marginBottom: "0.3vh", letterSpacing: "0.1vw" }}>COMPARISON</div>
              <p style={{ fontSize: "1.1vw", color: "#E0F2FE", lineHeight: 1.5, margin: 0 }}>Split-screen Before / After with draggable divider</p>
            </div>
            <div style={{ position: "relative", paddingLeft: "2vw" }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: "0.25vw", height: "100%", backgroundColor: "rgba(125,211,252,0.45)" }} />
              <div style={{ fontSize: "0.8vw", color: "#7DD3FC", marginBottom: "0.3vh", letterSpacing: "0.1vw" }}>LUT PALETTE</div>
              <p style={{ fontSize: "1.1vw", color: "#E0F2FE", lineHeight: 1.5, margin: 0 }}>Viridis, Inferno, Plasma, Magma, Jet presets</p>
            </div>
          </div>

          {/* Right: mock UI wireframe */}
          <div style={{ width: "34vw", border: "0.1vw solid rgba(125,211,252,0.3)", backgroundColor: "rgba(10,15,30,0.8)", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: 0, padding: "0.8vw", borderBottom: "0.1vw solid rgba(125,211,252,0.3)", borderRight: "0.1vw solid rgba(125,211,252,0.3)", fontSize: "0.75vw", color: "#7DD3FC" }}>UI WIREFRAME</div>
            {/* Mock nav bar */}
            <div style={{ marginTop: "3.5vh", padding: "1vh 1.5vw", borderBottom: "0.1vw solid rgba(125,211,252,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "0.85vw", color: "#7DD3FC", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}>[ IRISMAP ]</div>
              <div style={{ fontSize: "0.7vw", color: "rgba(224,242,254,0.4)", border: "0.1vw solid rgba(125,211,252,0.2)", padding: "0.3vh 0.8vw" }}>SEARCH COORDS...</div>
            </div>
            {/* Mock map area */}
            <div style={{ margin: "1vh 1.5vw", height: "16vh", backgroundColor: "rgba(125,211,252,0.04)", border: "0.1vw solid rgba(125,211,252,0.15)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: "0.75vw", color: "rgba(125,211,252,0.4)", letterSpacing: "0.08vw" }}>MAP TILE LAYER</div>
              {/* Crosshair */}
              <div style={{ position: "absolute", top: "50%", left: "50%", width: "1vw", height: "0.1vh", backgroundColor: "#7DD3FC", transform: "translateX(-50%)" }} />
              <div style={{ position: "absolute", top: "50%", left: "50%", width: "0.1vw", height: "2vh", backgroundColor: "#7DD3FC", transform: "translate(-50%, -50%)" }} />
            </div>
            {/* Mock control panel */}
            <div style={{ padding: "0 1.5vw", display: "flex", flexDirection: "column", gap: "0.8vh" }}>
              <div style={{ fontSize: "0.65vw", color: "#7DD3FC", letterSpacing: "0.1vw" }}>BAND MODE</div>
              <div style={{ display: "flex", gap: "0.5vw" }}>
                <div style={{ flex: 1, border: "0.1vw solid #7DD3FC", backgroundColor: "rgba(125,211,252,0.12)", padding: "0.4vh 0.3vw", fontSize: "0.6vw", textAlign: "center", color: "#FFFFFF" }}>IR</div>
                <div style={{ flex: 1, border: "0.1vw solid rgba(125,211,252,0.3)", padding: "0.4vh 0.3vw", fontSize: "0.6vw", textAlign: "center", color: "rgba(224,242,254,0.5)" }}>RGB</div>
                <div style={{ flex: 1, border: "0.1vw solid rgba(125,211,252,0.3)", padding: "0.4vh 0.3vw", fontSize: "0.6vw", textAlign: "center", color: "rgba(224,242,254,0.5)" }}>SWIR</div>
                <div style={{ flex: 1, border: "0.1vw solid rgba(125,211,252,0.3)", padding: "0.4vh 0.3vw", fontSize: "0.6vw", textAlign: "center", color: "rgba(224,242,254,0.5)" }}>TIR</div>
                <div style={{ flex: 1, border: "0.1vw solid rgba(125,211,252,0.3)", padding: "0.4vh 0.3vw", fontSize: "0.6vw", textAlign: "center", color: "rgba(224,242,254,0.5)" }}>AI</div>
              </div>
              <div style={{ fontSize: "0.65vw", color: "#7DD3FC", letterSpacing: "0.1vw", marginTop: "0.5vh" }}>CONTRAST ————————— 1.0x</div>
              <div style={{ fontSize: "0.65vw", color: "#7DD3FC", letterSpacing: "0.1vw" }}>BRIGHTNESS ————————— 1.0x</div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "0.1vh solid rgba(125,211,252,0.3)", paddingTop: "1.5vh", marginTop: "auto" }}>
          <div style={{ fontSize: "0.8vw", color: "rgba(224,242,254,0.6)" }}>DRAWN BY: Remote Sensing Research Team</div>
          <div style={{ fontSize: "0.8vw", color: "rgba(224,242,254,0.6)" }}>DATE: June 2026</div>
          <div style={{ fontSize: "0.8vw", color: "rgba(224,242,254,0.6)" }}>SHEET: 07/09</div>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: "4vh", right: "4vw", width: "15vw", height: "8vh", border: "0.1vw solid #7DD3FC", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, borderBottom: "0.1vw solid #7DD3FC", display: "flex", alignItems: "center", paddingLeft: "0.5vw", fontSize: "0.7vw" }}>APPR: _________</div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", paddingLeft: "0.5vw", fontSize: "0.7vw" }}>SCALE: 1:1</div>
      </div>
    </div>
  );
}
