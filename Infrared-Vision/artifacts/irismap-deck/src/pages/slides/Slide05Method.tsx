export default function Slide05Method() {
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
        <span>ELEVATION D</span>
        <span style={{ borderTop: "0.1vh solid #7DD3FC", width: "10vw", display: "inline-block" }} />
        <span>|</span>
      </div>

      <div style={{ position: "absolute", top: "13vh", left: "9vw", width: "82vw", height: "74vh", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3.5vh", borderBottom: "0.1vh solid rgba(125,211,252,0.3)", paddingBottom: "2vh" }}>
          <div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "4.5vw", fontWeight: 700, margin: 0, textTransform: "uppercase", letterSpacing: "-0.15vw", color: "#FFFFFF", textShadow: "0.1vw 0.1vw 0 rgba(125,211,252,0.2)" }}>
              Colorization Method
            </h2>
            <div style={{ fontSize: "0.85vw", color: "#7DD3FC", letterSpacing: "0.1vw", marginTop: "0.8vh" }}>SPEC: IMAGE-TO-IMAGE TRANSLATION</div>
          </div>
          <div style={{ textAlign: "right", fontSize: "0.8vw", color: "rgba(224,242,254,0.6)", letterSpacing: "0.1vw" }}>
            <div>MODEL: PAIRED-DATASET</div>
            <div>STATUS: PROTO</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "4vw", flex: 1 }}>
          {/* Left: approach bullets */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2.5vh" }}>
            <div style={{ fontSize: "1vw", color: "#7DD3FC", letterSpacing: "0.1vw", marginBottom: "0.5vh" }}>
              CORE APPROACH: Paired IR / RGB satellite dataset training
            </div>
            <div style={{ position: "relative", paddingLeft: "2vw" }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: "0.25vw", height: "100%", backgroundColor: "#7DD3FC" }} />
              <div style={{ fontSize: "0.8vw", color: "#7DD3FC", marginBottom: "0.3vh", letterSpacing: "0.1vw" }}>INPUT</div>
              <p style={{ fontSize: "1.1vw", color: "#E0F2FE", lineHeight: 1.5, margin: 0 }}>Single-channel 8-bit or 16-bit IR raster</p>
            </div>
            <div style={{ position: "relative", paddingLeft: "2vw" }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: "0.25vw", height: "100%", backgroundColor: "rgba(125,211,252,0.45)" }} />
              <div style={{ fontSize: "0.8vw", color: "#7DD3FC", marginBottom: "0.3vh", letterSpacing: "0.1vw" }}>OUTPUT</div>
              <p style={{ fontSize: "1.1vw", color: "#E0F2FE", lineHeight: 1.5, margin: 0 }}>3-channel colorized RGB with semantic coherence</p>
            </div>
            <div style={{ position: "relative", paddingLeft: "2vw" }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: "0.25vw", height: "100%", backgroundColor: "rgba(125,211,252,0.45)" }} />
              <div style={{ fontSize: "0.8vw", color: "#7DD3FC", marginBottom: "0.3vh", letterSpacing: "0.1vw" }}>ENHANCEMENT</div>
              <p style={{ fontSize: "1.1vw", color: "#E0F2FE", lineHeight: 1.5, margin: 0 }}>Contrast normalization + adaptive histogram equalization</p>
            </div>
            <div style={{ position: "relative", paddingLeft: "2vw" }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: "0.25vw", height: "100%", backgroundColor: "rgba(125,211,252,0.45)" }} />
              <div style={{ fontSize: "0.8vw", color: "#7DD3FC", marginBottom: "0.3vh", letterSpacing: "0.1vw" }}>INFERENCE</div>
              <p style={{ fontSize: "1.1vw", color: "#E0F2FE", lineHeight: 1.5, margin: 0 }}>Real-time CSS-filter proxy for prototype demonstration</p>
            </div>
          </div>

          {/* Right: I/O diagram */}
          <div style={{ width: "33vw", border: "0.1vw solid rgba(125,211,252,0.3)", backgroundColor: "rgba(15,37,55,0.7)", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: 0, padding: "0.8vw", borderBottom: "0.1vw solid rgba(125,211,252,0.3)", borderRight: "0.1vw solid rgba(125,211,252,0.3)", fontSize: "0.75vw", color: "#7DD3FC" }}>DIAGRAM B.1</div>
            <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5vh", paddingTop: "3vh" }}>
              {/* Input */}
              <div style={{ border: "0.1vw solid rgba(125,211,252,0.5)", padding: "1vh 3vw", fontSize: "0.9vw", color: "rgba(224,242,254,0.8)", letterSpacing: "0.08vw", backgroundColor: "rgba(125,211,252,0.04)", textAlign: "center" }}>
                <div style={{ fontSize: "0.7vw", color: "#7DD3FC", marginBottom: "0.3vh" }}>INPUT</div>
                <div>IR Raster (1-ch)</div>
              </div>
              <div style={{ width: "0.1vw", height: "2vh", backgroundColor: "#7DD3FC" }} />
              {/* Model */}
              <div style={{ border: "0.2vw solid #7DD3FC", padding: "1.5vh 3vw", fontSize: "1vw", color: "#FFFFFF", letterSpacing: "0.08vw", backgroundColor: "rgba(125,211,252,0.1)", textAlign: "center" }}>
                <div style={{ fontSize: "0.7vw", color: "#7DD3FC", marginBottom: "0.3vh" }}>MODEL</div>
                <div>Img2Img GAN / UNet</div>
              </div>
              <div style={{ width: "0.1vw", height: "2vh", backgroundColor: "#7DD3FC" }} />
              {/* Enhancement */}
              <div style={{ border: "0.1vw solid rgba(125,211,252,0.5)", padding: "1vh 3vw", fontSize: "0.9vw", color: "rgba(224,242,254,0.8)", letterSpacing: "0.08vw", backgroundColor: "rgba(125,211,252,0.04)", textAlign: "center" }}>
                <div style={{ fontSize: "0.7vw", color: "#7DD3FC", marginBottom: "0.3vh" }}>ENHANCEMENT</div>
                <div>CLAHE + Normalization</div>
              </div>
              <div style={{ width: "0.1vw", height: "2vh", backgroundColor: "#7DD3FC" }} />
              {/* Output */}
              <div style={{ border: "0.2vw solid #7DD3FC", padding: "1vh 3vw", fontSize: "0.9vw", color: "#FFFFFF", letterSpacing: "0.08vw", backgroundColor: "rgba(125,211,252,0.1)", textAlign: "center" }}>
                <div style={{ fontSize: "0.7vw", color: "#7DD3FC", marginBottom: "0.3vh" }}>OUTPUT</div>
                <div>Colorized RGB (3-ch)</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "0.1vh solid rgba(125,211,252,0.3)", paddingTop: "1.5vh", marginTop: "auto" }}>
          <div style={{ fontSize: "0.8vw", color: "rgba(224,242,254,0.6)" }}>DRAWN BY: Remote Sensing Research Team</div>
          <div style={{ fontSize: "0.8vw", color: "rgba(224,242,254,0.6)" }}>DATE: June 2026</div>
          <div style={{ fontSize: "0.8vw", color: "rgba(224,242,254,0.6)" }}>SHEET: 05/09</div>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: "4vh", right: "4vw", width: "15vw", height: "8vh", border: "0.1vw solid #7DD3FC", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, borderBottom: "0.1vw solid #7DD3FC", display: "flex", alignItems: "center", paddingLeft: "0.5vw", fontSize: "0.7vw" }}>APPR: _________</div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", paddingLeft: "0.5vw", fontSize: "0.7vw" }}>SCALE: NTS</div>
      </div>
    </div>
  );
}
