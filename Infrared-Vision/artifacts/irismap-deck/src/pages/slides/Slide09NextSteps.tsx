export default function Slide09NextSteps() {
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
        <span>FINAL SPEC</span>
        <span style={{ borderTop: "0.1vh solid #7DD3FC", width: "10vw", display: "inline-block" }} />
        <span>|</span>
      </div>

      <div style={{ position: "absolute", top: "18vh", left: "14vw", width: "70vw", height: "62vh", display: "flex", flexDirection: "column", justifyContent: "space-between", boxSizing: "border-box" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: "1vw", color: "#7DD3FC", letterSpacing: "0.2vw", marginBottom: "0.8vh" }}>[ IRISMAP ]</div>
            <div style={{ fontSize: "0.8vw", color: "rgba(224,242,254,0.6)", letterSpacing: "0.1vw" }}>PHASE 2 OBJECTIVES</div>
          </div>
          <div style={{ textAlign: "right", fontSize: "0.8vw", color: "rgba(224,242,254,0.6)", letterSpacing: "0.1vw" }}>
            <div style={{ marginBottom: "0.4vh" }}>ACTION REQUIRED</div>
            <div>PRIORITY: HIGH</div>
          </div>
        </div>

        {/* Phase 2 items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2.5vh" }}>
          <div style={{ display: "flex", gap: "2vw", alignItems: "flex-start" }}>
            <div style={{ border: "0.1vw solid #7DD3FC", padding: "0.5vh 0.8vw", fontSize: "0.8vw", color: "#7DD3FC", flexShrink: 0, backgroundColor: "rgba(125,211,252,0.08)" }}>P2-01</div>
            <p style={{ fontSize: "1.2vw", color: "#E0F2FE", lineHeight: 1.5, margin: 0 }}>Train on Sentinel-2 + MODIS paired dataset — &gt;50,000 tile pairs</p>
          </div>
          <div style={{ display: "flex", gap: "2vw", alignItems: "flex-start" }}>
            <div style={{ border: "0.1vw solid rgba(125,211,252,0.45)", padding: "0.5vh 0.8vw", fontSize: "0.8vw", color: "#7DD3FC", flexShrink: 0 }}>P2-02</div>
            <p style={{ fontSize: "1.2vw", color: "#E0F2FE", lineHeight: 1.5, margin: 0 }}>Integrate real-time inference via ONNX runtime on edge hardware</p>
          </div>
          <div style={{ display: "flex", gap: "2vw", alignItems: "flex-start" }}>
            <div style={{ border: "0.1vw solid rgba(125,211,252,0.45)", padding: "0.5vh 0.8vw", fontSize: "0.8vw", color: "#7DD3FC", flexShrink: 0 }}>P2-03</div>
            <p style={{ fontSize: "1.2vw", color: "#E0F2FE", lineHeight: 1.5, margin: 0 }}>Add semantic segmentation overlay for auto-labeling</p>
          </div>
          <div style={{ display: "flex", gap: "2vw", alignItems: "flex-start" }}>
            <div style={{ border: "0.1vw solid rgba(125,211,252,0.45)", padding: "0.5vh 0.8vw", fontSize: "0.8vw", color: "#7DD3FC", flexShrink: 0 }}>P2-04</div>
            <p style={{ fontSize: "1.2vw", color: "#E0F2FE", lineHeight: 1.5, margin: 0 }}>API endpoint for third-party GIS platform integration</p>
          </div>
        </div>

        {/* Status bar */}
        <div style={{ border: "0.2vw solid #7DD3FC", backgroundColor: "rgba(125,211,252,0.08)", padding: "2vh 2.5vw", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "0.8vw", color: "#7DD3FC", letterSpacing: "0.15vw", marginBottom: "0.5vh" }}>CURRENT STATUS</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "2vw", fontWeight: 700, color: "#FFFFFF" }}>PROTO-V0.9</div>
          </div>
          <div style={{ width: "0.1vw", height: "5vh", backgroundColor: "rgba(125,211,252,0.3)" }} />
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.8vw", color: "#7DD3FC", letterSpacing: "0.15vw", marginBottom: "0.5vh" }}>EVALUATION</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "2vw", fontWeight: 700, color: "#FFFFFF" }}>FIELD READY</div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "0.1vh solid rgba(125,211,252,0.3)", paddingTop: "2vh" }}>
          <div style={{ fontSize: "0.8vw", color: "rgba(224,242,254,0.6)" }}>DRAWN BY: Remote Sensing Research Team</div>
          <div style={{ fontSize: "0.8vw", color: "rgba(224,242,254,0.6)" }}>DATE: June 2026</div>
          <div style={{ fontSize: "0.8vw", color: "rgba(224,242,254,0.6)" }}>SHEET: 09/09</div>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: "4vh", right: "4vw", width: "15vw", height: "8vh", border: "0.1vw solid #7DD3FC", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, borderBottom: "0.1vw solid #7DD3FC", display: "flex", alignItems: "center", paddingLeft: "0.5vw", fontSize: "0.7vw" }}>APPR: _________</div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", paddingLeft: "0.5vw", fontSize: "0.7vw" }}>SCALE: 1:1</div>
      </div>
    </div>
  );
}
