import BottomNav from "../ui/BottomNav";

function MainLayout({ title, children, showBack = false, onBack, rightAction }) {
  return (
    <div style={wrapperStyle}>
      <div style={phoneStyle}>
        <header style={headerStyle}>
          <div style={headerLeftStyle}>
            {showBack ? (
              <button onClick={onBack} style={backButtonStyle}>
                ←
              </button>
            ) : null}
            <h1 style={titleStyle}>{title}</h1>
          </div>

          {rightAction ? <div>{rightAction}</div> : <div style={{ width: 32 }} />}
        </header>

        <main style={contentStyle}>{children}</main>

        <BottomNav />
      </div>
    </div>
  );
}

const wrapperStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  background: "#1f1f1f",
  padding: "0",
};

const phoneStyle = {
  width: "100%",
  maxWidth: 390,
  minHeight: "100vh",
  background: "#061736",
  color: "#fff",
  display: "flex",
  flexDirection: "column",
  position: "relative",
};

const headerStyle = {
  height: 72,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 16px",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
};

const headerLeftStyle = {
  display: "flex",
  alignItems: "center",
  gap: 12,
};

const backButtonStyle = {
  width: 32,
  height: 32,
  border: "none",
  background: "transparent",
  color: "#fff",
  fontSize: 24,
};

const titleStyle = {
  margin: 0,
  fontSize: 28,
  fontWeight: 700,
};

const contentStyle = {
  flex: 1,
  padding: "16px",
  paddingBottom: "92px",
};

export default MainLayout;