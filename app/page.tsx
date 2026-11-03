"use client";

import { useState } from "react";
import {
  ArrowDownLeft, ArrowUpRight, ArrowLeftRight, Bell, ChevronDown, CircleHelp,
  CreditCard, Download, Globe2, LayoutDashboard, LifeBuoy, Search, Settings,
  ShieldCheck, Wallet, Users, Activity, Menu, X
} from "lucide-react";

const transactions = [
  { id: "TX-20481", name: "Amara Okello", route: "United Kingdom → Uganda", method: "Bank transfer", amount: "€850.00", status: "Completed", date: "03 Nov 2026" },
  { id: "TX-20480", name: "Daniel Mwangi", route: "United States → Kenya", method: "Card", amount: "$420.00", status: "Processing", date: "03 Nov 2026" },
  { id: "TX-20479", name: "Sarah Nansubuga", route: "Uganda → Germany", method: "Mobile money", amount: "UGX 1,200,000", status: "Review", date: "02 Nov 2026" },
  { id: "TX-20478", name: "Peter Mushi", route: "Canada → Tanzania", method: "Bank transfer", amount: "C$600.00", status: "Completed", date: "02 Nov 2026" }
];

const nav = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Transactions", icon: ArrowLeftRight },
  { label: "Balances", icon: Wallet },
  { label: "Recipients", icon: Users },
  { label: "Payment methods", icon: CreditCard },
  { label: "Compliance", icon: ShieldCheck }
];

export default function Home() {
  const [active, setActive] = useState("Overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [amount, setAmount] = useState("500");
  const [currency, setCurrency] = useState("EUR");
  const [destination, setDestination] = useState("UG");
  const [notice, setNotice] = useState("");

  function requestQuote(e: React.FormEvent) {
    e.preventDefault();
    setNotice("Quote preview only. Connect a licensed payment partner and live FX source before accepting real funds.");
  }

  return (
    <main className="shell">
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="brand"><div className="brand-mark"><Globe2 size={21}/></div><span>orbit<span className="brand-light">pay</span></span><button className="mobile-close" onClick={() => setMenuOpen(false)}><X/></button></div>
        <div className="workspace"><span className="workspace-dot"/> Platform workspace <ChevronDown size={14}/></div>
        <div className="nav-label">WORKSPACE</div>
        {nav.map(item => <button key={item.label} onClick={() => {setActive(item.label);setMenuOpen(false)}} className={`nav-item ${active===item.label?"selected":""}`}><item.icon size={18}/>{item.label}</button>)}
        <div className="nav-label lower">MANAGE</div>
        <button className="nav-item" onClick={() => setActive("Developers")}><Activity size={18}/> Developers</button>
        <button className="nav-item" onClick={() => setActive("Settings")}><Settings size={18}/> Settings</button>
        <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><LifeBuoy size={18}/></div><b>Need a hand?</b><span>Visit the help centre for guidance.</span><button onClick={() => setNotice("Help centre will be connected during product setup.")}>Get support <span>↗</span></button></div><div className="profile"><div className="avatar">OP</div><div><b>Operator account</b><span>Workspace owner</span></div><ChevronDown size={15}/></div></div>
      </aside>

      <section className="main">
        <header className="topbar">
          <button className="hamburger" onClick={() => setMenuOpen(true)}><Menu/></button>
          <div className="crumb">Workspace <span>/</span> <b>{active}</b></div>
          <div className="top-actions"><button className="icon-btn" aria-label="Search"><Search size={18}/></button><button className="icon-btn" aria-label="Notifications"><Bell size={18}/><i/></button><div className="top-avatar">OP</div></div>
        </header>

        <div className="content">
          <div className="welcome-row"><div><div className="eyebrow">TUESDAY, 03 NOVEMBER 2026</div><h1>{active === "Overview" ? "Good morning" : active}</h1><p className="subhead">Here’s what’s happening across your payment operations.</p></div><div className="welcome-actions"><button className="outline-btn" onClick={() => setNotice("Reports become available when live transaction data is connected.")}><Download size={16}/> Export report</button><button className="primary-btn" onClick={() => setShowTransfer(true)}><ArrowUpRight size={17}/> Create transfer</button></div></div>

          <div className="notice"><div className="notice-icon"><ShieldCheck size={18}/></div><div><b>Development workspace</b><span>This is the application foundation. No real money is accepted, stored, converted or paid out yet.</span></div><span className="notice-tag">TEST ENVIRONMENT</span></div>

          <div className="stat-grid">
            <div className="stat-card"><div className="stat-top"><span>Transaction volume</span><span className="stat-icon purple"><ArrowLeftRight size={17}/></span></div><div className="stat-value">—</div><div className="stat-foot">Connect a provider to load live volume</div></div>
            <div className="stat-card"><div className="stat-top"><span>Successful transfers</span><span className="stat-icon green"><ArrowDownLeft size={17}/></span></div><div className="stat-value">—</div><div className="stat-foot">Live reporting not connected</div></div>
            <div className="stat-card"><div className="stat-top"><span>Platform fees</span><span className="stat-icon orange"><Wallet size={17}/></span></div><div className="stat-value">—</div><div className="stat-foot">Sender-paid fee engine to be configured</div></div>
            <div className="stat-card"><div className="stat-top"><span>Active corridors</span><span className="stat-icon blue"><Globe2 size={17}/></span></div><div className="stat-value">0</div><div className="stat-foot">No live payout corridors enabled</div></div>
          </div>

          <div className="section-heading"><div><h2>Recent transactions</h2><p>Sample layout — not live customer transactions.</p></div><button className="text-btn" onClick={() => setActive("Transactions")}>View all <span>→</span></button></div>
          <div className="table-wrap"><table><thead><tr><th>REFERENCE</th><th>CUSTOMER / ROUTE</th><th>PAYMENT METHOD</th><th>AMOUNT</th><th>STATUS</th><th>DATE</th></tr></thead><tbody>{transactions.map(t=><tr key={t.id}><td className="ref">{t.id}</td><td><b>{t.name}</b><span className="route">{t.route}</span></td><td>{t.method}</td><td className="amount">{t.amount}</td><td><span className={`status ${t.status.toLowerCase()}`}><i/>{t.status}</span></td><td className="date">{t.date}</td></tr>)}</tbody></table></div>

          <div className="bottom-grid"><div className="panel"><div className="panel-head"><div><h3>Transfer corridors</h3><p>Markets planned for the first rollout</p></div><Globe2 size={19}/></div><div className="corridor"><div className="flags">🇬🇧 <span>→</span> 🇺🇬</div><div><b>United Kingdom to Uganda</b><span>Planned corridor</span></div><em>Not live</em></div><div className="corridor"><div className="flags">🇺🇸 <span>→</span> 🇰🇪</div><div><b>United States to Kenya</b><span>Planned corridor</span></div><em>Not live</em></div><div className="corridor"><div className="flags">🇪🇺 <span>→</span> 🇹🇿</div><div><b>Europe to Tanzania</b><span>Planned corridor</span></div><em>Not live</em></div></div>
          <div className="panel fee-panel"><div className="panel-head"><div><h3>Sender-paid pricing</h3><p>Illustrative pricing controls</p></div><CreditCard size={19}/></div><div className="fee-row"><span>Payment processing</span><b>Provider-dependent</b></div><div className="fee-row"><span>Platform fee</span><b>Admin configurable</b></div><div className="fee-row"><span>FX margin</span><b>Admin configurable</b></div><div className="fee-row"><span>Recipient deduction</span><b className="zero">None by design</b></div><div className="fee-note"><CircleHelp size={15}/> Final fee is disclosed to sender before confirmation.</div></div></div>
          {notice && <div className="toast" role="status">{notice}<button onClick={()=>setNotice("")}>×</button></div>}
        </div>
        <footer>© 2026 OrbitPay workspace <span>Secure infrastructure foundation · Test environment</span></footer>
      </section>

      {showTransfer && <div className="modal-backdrop" onClick={()=>setShowTransfer(false)}><div className="modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setShowTransfer(false)}>×</button><div className="modal-kicker">TRANSFER QUOTE</div><h2>Estimate a transfer</h2><p>Preview the sender-paid checkout structure. This does not initiate a payment.</p><form onSubmit={requestQuote}><label>Sender amount</label><div className="amount-input"><input value={amount} onChange={e=>setAmount(e.target.value)} type="number" min="1" required/><select value={currency} onChange={e=>setCurrency(e.target.value)}><option>EUR</option><option>USD</option><option>GBP</option><option>CAD</option></select></div><label>Destination country</label><select className="full-select" value={destination} onChange={e=>setDestination(e.target.value)}><option value="UG">Uganda (UGX)</option><option value="KE">Kenya (KES)</option><option value="TZ">Tanzania (TZS)</option><option value="RW">Rwanda (RWF)</option></select><div className="quote-disclaimer">A live exchange rate, provider fee and payout cost must be supplied before a binding quote can be shown.</div><button className="primary-btn full" type="submit">Preview quote <ArrowUpRight size={16}/></button>{notice && <div className="inline-notice">{notice}</div>}</form></div></div>}
    </main>
  );
}
