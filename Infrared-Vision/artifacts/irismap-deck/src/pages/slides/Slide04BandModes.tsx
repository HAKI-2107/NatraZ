export default function Slide04BandModes() {
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
        <span>ELEVATION C</span>
        <span style={{ borderTop: "0.1vh solid #7DD3FC", width: "10vw", display: "inline-block" }} />
        <span>|</span>
      </div>

      <div style={{ position: "absolute", top: "13vh", left: "9vw", width: "82vw", height: "74vh", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3vh", borderBottom: "0.1vh solid rgba(125,211,252,0.3)", paddingBottom: "2vh" }}>
          <div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "4.5vw", fontWeight: 700, margin: 0, textTransform: "uppercase", letterSpacing: "-0.15vw", color: "#FFFFFF", textShadow: "0.1vw 0.1vw 0 rgba(125,211,252,0.2)" }}>
              Band Composite Modes
            </h2>
            <div style={{ fontSize: "0.85vw", color: "#7DD3FC", letterSpacing: "0.1vw", marginTop: "0.8vh" }}>DATA SET: 6 SPECTRAL MODES — SINGLE SENSOR SOURCE</div>
          </div>
          <div style={{ textAlign: "right", fontSize: "0.8vw", color: "rgba(224,242,254,0.6)", letterSpacing: "0.1vw" }}>
            <div>VAR: MULTI-SPECTRAL</div>
            <div>UNITS: REFLECTANCE</div>
          </div>
        </div>

        {/* 6 mode cards in 3x2 */}
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gridTemplateRows: "1fr 1fr", gap: "1.5vh 2vw" }}>
          <div style={{ border: "0.2vw solid #7DD3FC", backgroundColor: "rgba(125,211,252,0.08)", padding: "1.5vh 1.5vw" }}>
            <div style={{ fontSize: "0.75vw", color: "#7DD3FC", letterSpacing: "0.12vw", marginBottom: "0.6vh" }}>MODE 01</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.3vw", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.4vh" }}>Natural Color</div>
            <div style={{ fontSize: "0.85vw", color: "rgba(224,242,254,0.7)" }}>RGB baseline — standard true-color composite</div>
          </div>
          <div style={{ border: "0.1vw solid rgba(125,211,252,0.45)", backgroundColor: "rgba(125,211,252,0.04)", padding: "1.5vh 1.5vw" }}>
            <div style={{ fontSize: "0.75vw", color: "#7DD3FC", letterSpacing: "0.12vw", marginBottom: "0.6vh" }}>MODE 02</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.3vw", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.4vh" }}>IR Grayscale</div>
            <div style={{ fontSize: "0.85vw", color: "rgba(224,242,254,0.7)" }}>Raw sensor output — monochrome IR</div>
          </div>
          <div style={{ border: "0.1vw solid rgba(125,211,252,0.45)", backgroundColor: "rgba(125,211,252,0.04)", padding: "1.5vh 1.5vw" }}>
            <div style={{ fontSize: "0.75vw", color: "#7DD3FC", letterSpacing: "0.12vw", marginBottom: "0.6vh" }}>MODE 03</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.3vw", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.4vh" }}>False Color IR</div>
            <div style={{ fontSize: "0.85vw", color: "rgba(224,242,254,0.7)" }}>NIR-R-G composite — vegetation mapping</div>
          </div>
          <div style={{ border: "0.1vw solid rgba(125,211,252,0.45)", backgroundColor: "rgba(125,211,252,0.04)", padding: "1.5vh 1.5vw" }}>
            <div style={{ fontSize: "0.75vw", color: "#7DD3FC", letterSpacing: "0.12vw", marginBottom: "0.6vh" }}>MODE 04</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.3vw", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.4vh" }}>SWIR Composite</div>
            <div style={{ fontSize: "0.85vw", color: "rgba(224,242,254,0.7)" }}>Short-wave IR — urban structure detection</div>
          </div>
          <div style={{ border: "0.1vw solid rgba(125,211,252,0.45)", backgroundColor: "rgba(125,211,252,0.04)", padding: "1.5vh 1.5vw" }}>
            <div style={{ fontSize: "0.75vw", color: "#7DD3FC", letterSpacing: "0.12vw", marginBottom: "0.6vh" }}>MODE 05</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.3vw", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.4vh" }}>Thermal IR</div>
            <div style={{ fontSize: "0.85vw", color: "rgba(224,242,254,0.7)" }}>Heat signature analysis — night vision</div>
          </div>
          <div style={{ border: "0.2vw solid #7DD3FC", backgroundColor: "rgba(125,211,252,0.1)", padding: "1.5vh 1.5vw" }}>
            <div style={{ fontSize: "0.75vw", color: "#7DD3FC", letterSpacing: "0.12vw", marginBottom: "0.6vh" }}>MODE 06 — OUTPUT</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.3vw", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.4vh" }}>AI-Enhanced</div>
            <div style={{ fontSize: "0.85vw", color: "rgba(224,242,254,0.7)" }}>ML colorization output — full RGB</div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "0.1vh solid rgba(125,211,252,0.3)", paddingTop: "1.5vh", marginTop: "1.5vh" }}>
          <div style={{ fontSize: "0.8vw", color: "rgba(224,242,254,0.6)" }}>DRAWN BY: Remote Sensing Research Team</div>
          <div style={{ fontSize: "0.8vw", color: "rgba(224,242,254,0.6)" }}>DATE: June 2026</div>
          <div style={{ fontSize: "0.8vw", color: "rgba(224,242,254,0.6)" }}>SHEET: 04/09</div>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: "4vh", right: "4vw", width: "15vw", height: "8vh", border: "0.1vw solid #7DD3FC", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, borderBottom: "0.1vw solid #7DD3FC", display: "flex", alignItems: "center", paddingLeft: "0.5vw", fontSize: "0.7vw" }}>APPR: _________</div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", paddingLeft: "0.5vw", fontSize: "0.7vw" }}>SCALE: NTS</div>
      </div>
    </div>
  );
}
