export default function Slide01Title() {
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
      {/* Outer border */}
      <div
        style={{
          position: "absolute",
          top: "2vh", left: "2vw", right: "2vw", bottom: "2vh",
          border: "0.2vw solid #7DD3FC",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "1vh", left: "1vw", right: "1vw", bottom: "1vh",
            border: "0.1vw dashed rgba(125,211,252,0.5)",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Crosshairs TL */}
      <div style={{ position: "absolute", top: "10vh", left: "10vw", width: "2vw", height: "0.1vh", backgroundColor: "#7DD3FC" }} />
      <div style={{ position: "absolute", top: "9vw", left: "10.95vw", width: "0.1vw", height: "2vw", backgroundColor: "#7DD3FC" }} />
      {/* Crosshairs BR */}
      <div style={{ position: "absolute", bottom: "10vh", right: "10vw", width: "2vw", height: "0.1vh", backgroundColor: "#7DD3FC" }} />
      <div style={{ position: "absolute", bottom: "9vw", right: "10.95vw", width: "0.1vw", height: "2vw", backgroundColor: "#7DD3FC" }} />

      {/* Top dimension marker */}
      <div style={{ position: "absolute", top: "4vh", left: "50vw", transform: "translateX(-50%)", fontSize: "0.8vw", color: "#7DD3FC", display: "flex", alignItems: "center", gap: "1vw" }}>
        <span>|</span>
        <span style={{ borderTop: "0.1vh solid #7DD3FC", width: "10vw", display: "inline-block" }} />
        <span>PROJECT NO. IR-2026</span>
        <span style={{ borderTop: "0.1vh solid #7DD3FC", width: "10vw", display: "inline-block" }} />
        <span>|</span>
      </div>

      {/* Side dimension marker */}
      <div style={{ position: "absolute", top: "50vh", right: "3vw", transform: "translateY(-50%) rotate(90deg)", fontSize: "0.8vw", color: "#7DD3FC", display: "flex", alignItems: "center", gap: "1vw" }}>
        <span>|</span>
        <span style={{ borderTop: "0.1vh solid #7DD3FC", width: "12vw", display: "inline-block" }} />
        <span>SECT. A</span>
        <span style={{ borderTop: "0.1vh solid #7DD3FC", width: "12vw", display: "inline-block" }} />
        <span>|</span>
      </div>

      {/* Main content */}
      <div
        style={{
          position: "absolute",
          top: "18vh", left: "14vw",
          width: "70vw", height: "64vh",
          display: "flex", flexDirection: "column",
          justifyContent: "space-between",
          boxSizing: "border-box",
        }}
      >
        {/* Header row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: "1vw", color: "#7DD3FC", letterSpacing: "0.2vw", marginBottom: "1vh" }}>[ IRISMAP ]</div>
            <div style={{ fontSize: "0.8vw", color: "rgba(224,242,254,0.6)", letterSpacing: "0.1vw" }}>REMOTE SENSING RESEARCH TEAM</div>
          </div>
          <div style={{ textAlign: "right", fontSize: "0.8vw", color: "rgba(224,242,254,0.6)", letterSpacing: "0.1vw" }}>
            <div style={{ marginBottom: "0.5vh" }}>STATUS: PROTO-V0.9</div>
            <div>REV: 01</div>
          </div>
        </div>

        {/* Hero title */}
        <div style={{ position: "relative" }}>
          {/* Annotation lines */}
          <div style={{ position: "absolute", left: "-4vw", top: "4vh", width: "3vw", height: "0.1vh", backgroundColor: "#7DD3FC" }} />
          <div style={{ position: "absolute", left: "-4vw", top: "4vh", width: "0.1vw", height: "8vh", backgroundColor: "#7DD3FC" }} />

          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "9vw",
              fontWeight: 700,
              lineHeight: 0.88,
              margin: "0 0 2.5vh 0",
              textTransform: "uppercase",
              letterSpacing: "-0.3vw",
              color: "#FFFFFF",
              textShadow: "0.2vw 0.2vw 0 rgba(125,211,252,0.15)",
              textWrap: "balance",
            }}
          >
            IRIS
            <span style={{ color: "#7DD3FC" }}>MAP</span>
          </h1>

          <div style={{ display: "flex", alignItems: "flex-start", gap: "1.5vw" }}>
            <div style={{ width: "2vw", height: "0.2vh", backgroundColor: "#7DD3FC", marginTop: "1.2vh", flexShrink: 0 }} />
            <p style={{ fontSize: "1.4vw", lineHeight: 1.55, color: "#E0F2FE", margin: 0, maxWidth: "42vw" }}>
              Infrared Satellite Image Colorization &amp; Enhancement for Improved Object Interpretation
            </p>
          </div>
        </div>

        {/* Footer row */}
        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "0.1vh solid rgba(125,211,252,0.3)", paddingTop: "2vh" }}>
          <div style={{ fontSize: "0.8vw", color: "rgba(224,242,254,0.6)" }}>DRAWN BY: Remote Sensing Research Team</div>
          <div style={{ fontSize: "0.8vw", color: "rgba(224,242,254,0.6)" }}>DATE: June 2026</div>
          <div style={{ fontSize: "0.8vw", color: "rgba(224,242,254,0.6)" }}>SHEET: 01/09</div>
        </div>
      </div>

      {/* Bottom-right title block */}
      <div style={{ position: "absolute", bottom: "4vh", right: "4vw", width: "15vw", height: "8vh", border: "0.1vw solid #7DD3FC", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, borderBottom: "0.1vw solid #7DD3FC", display: "flex", alignItems: "center", paddingLeft: "0.5vw", fontSize: "0.7vw" }}>APPR: _________</div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", paddingLeft: "0.5vw", fontSize: "0.7vw" }}>SCALE: NTS</div>
      </div>
    </div>
  );
}
