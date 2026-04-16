const Dashboard = () => {
  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome to the protected dashboard! Token verified.</p>
      <div style={{ marginTop: "2rem" }}>
        <h3>Quick Stats</h3>
        <div style={{ display: "flex", gap: "1rem" }}>
          <div style={{ padding: "1rem", border: "1px solid #ccc", flex: 1 }}>
            Orders: 42
          </div>
          <div style={{ padding: "1rem", border: "1px solid #ccc", flex: 1 }}>
            Revenue: $12,450
          </div>
          <div style={{ padding: "1rem", border: "1px solid #ccc", flex: 1 }}>
            Customers: 128
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
