export default function Slide03Pipeline() {
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
        <span>FIG. 01 — DATA FLOW</span>
        <span style={{ borderTop: "0.1vh solid #7DD3FC", width: "10vw", display: "inline-block" }} />
        <span>|</span>
      </div>

      <div style={{ position: "absolute", top: "13vh", left: "9vw", width: "82vw", height: "74vh", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "4vh", borderBottom: "0.1vh solid rgba(125,211,252,0.3)", paddingBottom: "2vh" }}>
          <div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "4.5vw", fontWeight: 700, margin: 0, textTransform: "uppercase", letterSpacing: "-0.15vw", color: "#FFFFFF", textShadow: "0.1vw 0.1vw 0 rgba(125,211,252,0.2)" }}>
              Signal Pipeline
            </h2>
            <div style={{ fontSize: "0.85vw", color: "#7DD3FC", letterSpacing: "0.1vw", marginTop: "0.8vh" }}>DATA SET: ARCHITECTURE-OVERVIEW</div>
          </div>
          <div style={{ textAlign: "right", fontSize: "0.8vw", color: "rgba(224,242,254,0.6)", letterSpacing: "0.1vw" }}>
            <div>SPEC: E2E-FRAMEWORK</div>
            <div>STATUS: DESIGN</div>
          </div>
        </div>

        {/* Pipeline flow — horizontal */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
            {/* Step 1 */}
            <div style={{ flex: 1, border: "0.15vw solid #7DD3FC", backgroundColor: "rgba(125,211,252,0.1)", padding: "2vh 1.2vw", textAlign: "center" }}>
              <div style={{ fontSize: "0.75vw", color: "#7DD3FC", letterSpacing: "0.12vw", marginBottom: "0.8vh" }}>STEP 01</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.2vw", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.5vh" }}>IR Sensor</div>
              <div style={{ fontSize: "0.85vw", color: "rgba(224,242,254,0.7)", lineHeight: 1.4 }}>Raw single-channel satellite capture</div>
            </div>
            <div style={{ width: "2.5vw", height: "0.2vh", backgroundColor: "#7DD3FC", flexShrink: 0, position: "relative" }}>
              <div style={{ position: "absolute", right: "-0.4vw", top: "-0.5vh", fontSize: "1.2vw", color: "#7DD3FC" }}>&#x25B6;</div>
            </div>
            {/* Step 2 */}
            <div style={{ flex: 1, border: "0.15vw solid rgba(125,211,252,0.55)", backgroundColor: "rgba(125,211,252,0.05)", padding: "2vh 1.2vw", textAlign: "center" }}>
              <div style={{ fontSize: "0.75vw", color: "#7DD3FC", letterSpacing: "0.12vw", marginBottom: "0.8vh" }}>STEP 02</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.2vw", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.5vh" }}>Preprocessing</div>
              <div style={{ fontSize: "0.85vw", color: "rgba(224,242,254,0.7)", lineHeight: 1.4 }}>Noise reduction &amp; normalization</div>
            </div>
            <div style={{ width: "2.5vw", height: "0.2vh", backgroundColor: "#7DD3FC", flexShrink: 0, position: "relative" }}>
              <div style={{ position: "absolute", right: "-0.4vw", top: "-0.5vh", fontSize: "1.2vw", color: "#7DD3FC" }}>&#x25B6;</div>
            </div>
            {/* Step 3 */}
            <div style={{ flex: 1, border: "0.15vw solid rgba(125,211,252,0.55)", backgroundColor: "rgba(125,211,252,0.05)", padding: "2vh 1.2vw", textAlign: "center" }}>
              <div style={{ fontSize: "0.75vw", color: "#7DD3FC", letterSpacing: "0.12vw", marginBottom: "0.8vh" }}>STEP 03</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.2vw", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.5vh" }}>Band Decomposition</div>
              <div style={{ fontSize: "0.85vw", color: "rgba(224,242,254,0.7)", lineHeight: 1.4 }}>Spectral separation &amp; analysis</div>
            </div>
            <div style={{ width: "2.5vw", height: "0.2vh", backgroundColor: "#7DD3FC", flexShrink: 0, position: "relative" }}>
              <div style={{ position: "absolute", right: "-0.4vw", top: "-0.5vh", fontSize: "1.2vw", color: "#7DD3FC" }}>&#x25B6;</div>
            </div>
            {/* Step 4 */}
            <div style={{ flex: 1, border: "0.15vw solid rgba(125,211,252,0.55)", backgroundColor: "rgba(125,211,252,0.05)", padding: "2vh 1.2vw", textAlign: "center" }}>
              <div style={{ fontSize: "0.75vw", color: "#7DD3FC", letterSpacing: "0.12vw", marginBottom: "0.8vh" }}>STEP 04</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.2vw", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.5vh" }}>DL Colorization</div>
              <div style={{ fontSize: "0.85vw", color: "rgba(224,242,254,0.7)", lineHeight: 1.4 }}>Image-to-image translation</div>
            </div>
            <div style={{ width: "2.5vw", height: "0.2vh", backgroundColor: "#7DD3FC", flexShrink: 0, position: "relative" }}>
              <div style={{ position: "absolute", right: "-0.4vw", top: "-0.5vh", fontSize: "1.2vw", color: "#7DD3FC" }}>&#x25B6;</div>
            </div>
            {/* Step 5 */}
            <div style={{ flex: 1, border: "0.2vw solid #7DD3FC", backgroundColor: "rgba(125,211,252,0.14)", padding: "2vh 1.2vw", textAlign: "center" }}>
              <div style={{ fontSize: "0.75vw", color: "#7DD3FC", letterSpacing: "0.12vw", marginBottom: "0.8vh" }}>OUTPUT</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.2vw", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.5vh" }}>Enhanced RGB</div>
              <div style={{ fontSize: "0.85vw", color: "rgba(224,242,254,0.7)", lineHeight: 1.4 }}>Colorized high-fidelity image</div>
            </div>
          </div>

          {/* Bottom annotation */}
          <div style={{ marginTop: "4vh", display: "flex", justifyContent: "center" }}>
            <div style={{ border: "0.1vw solid rgba(125,211,252,0.3)", padding: "1.5vh 3vw", fontSize: "1vw", color: "rgba(224,242,254,0.75)", letterSpacing: "0.08vw", textAlign: "center" }}>
              End-to-end framework: IR Sensor Input &#x2192; Preprocessing &#x2192; Band Decomposition &#x2192; Deep Learning Colorization &#x2192; Enhancement &amp; Output
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "0.1vh solid rgba(125,211,252,0.3)", paddingTop: "1.5vh", marginTop: "auto" }}>
          <div style={{ fontSize: "0.8vw", color: "rgba(224,242,254,0.6)" }}>DRAWN BY: Remote Sensing Research Team</div>
          <div style={{ fontSize: "0.8vw", color: "rgba(224,242,254,0.6)" }}>DATE: June 2026</div>
          <div style={{ fontSize: "0.8vw", color: "rgba(224,242,254,0.6)" }}>SHEET: 03/09</div>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: "4vh", right: "4vw", width: "15vw", height: "8vh", border: "0.1vw solid #7DD3FC", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, borderBottom: "0.1vw solid #7DD3FC", display: "flex", alignItems: "center", paddingLeft: "0.5vw", fontSize: "0.7vw" }}>APPR: _________</div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", paddingLeft: "0.5vw", fontSize: "0.7vw" }}>SCALE: 1:100</div>
      </div>
    </div>
  );
}
