'use client';

import { useMemo, useState } from 'react';
import {
  connectSepoliaWallet,
  signWorkChainLogin
} from '../lib/blockchain/ethereum';
import {
  registerWalletOnChain,
  checkWalletRegistration
} from '../lib/blockchain/contract';

type Credential = { title: string; issuer: string; year: string; hash: string; status: string };
type Worker = { id: string; name: string; role: string; location: string; rating: number; clients: number; verified: number; available: boolean; skills: string[] };

const credentials: Credential[] = [
  { title: 'Web Development Certificate', issuer: 'Davao Tech Institute', year: '2025', hash: '0x8f2a...91c4', status: 'Verified on-chain' },
  { title: 'React Professional Training', issuer: 'CodeLab Academy', year: '2024', hash: '0x72be...aa18', status: 'Verified on-chain' },
  { title: 'UI/UX Fundamentals', issuer: 'Design Guild PH', year: '2024', hash: '0x1d39...7e02', status: 'Verified on-chain' }
];

const workers: Worker[] = [
  { id: 'WC-1042', name: 'Alex Rivera', role: 'Full-Stack Developer', location: 'Zamboanga Sibugay', rating: 4.9, clients: 18, verified: 6, available: true, skills: ['Next.js', 'Node.js', 'PostgreSQL'] },
  { id: 'WC-1187', name: 'Mika Santos', role: 'UI/UX Designer', location: 'Davao City', rating: 4.8, clients: 12, verified: 5, available: true, skills: ['Figma', 'UX Research', 'Branding'] },
  { id: 'WC-1271', name: 'Daniel Cruz', role: 'Mobile Developer', location: 'Cebu City', rating: 4.7, clients: 9, verified: 4, available: false, skills: ['Flutter', 'Kotlin', 'Firebase'] }
];

function Badge({ children, green = false }: { children: React.ReactNode; green?: boolean }) {
  return <span className={`badge ${green ? 'green' : ''}`}>{children}</span>;
}

export default function Home() {
  const [tab, setTab] = useState<'home'|'workers'|'profile'|'agency'>('home');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Worker | null>(null);
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [contractOpen, setContractOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [walletLoggedIn, setWalletLoggedIn] = useState(false);
  const [walletRegistered, setWalletRegistered] = useState(false);
  const [walletBusy, setWalletBusy] = useState(false);

  const handleWalletLogin = async () => {
    setWalletBusy(true);
    try {
      const result = await signWorkChainLogin();
      setWalletAddress(result.address);
      setWalletLoggedIn(true);

      try {
        setWalletRegistered(await checkWalletRegistration(result.address));
      } catch {
        setWalletRegistered(false);
      }

      notify('Ethereum Sepolia wallet connected');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Wallet connection failed';
      notify(message);
    } finally {
      setWalletBusy(false);
    }
  };

  const handleRegisterWallet = async () => {
    setWalletBusy(true);
    try {
      const receipt = await registerWalletOnChain();
      setWalletRegistered(true);
      notify(`Wallet registered on Sepolia · ${receipt.hash.slice(0, 10)}...`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Blockchain transaction failed';
      notify(message);
    } finally {
      setWalletBusy(false);
    }
  };

  const filtered = useMemo(() => workers.filter(w => `${w.name} ${w.role} ${w.skills.join(' ')}`.toLowerCase().includes(query.toLowerCase())), [query]);
  const notify = (message: string) => { setToast(message); setTimeout(() => setToast(''), 2400); };

  return <main>
    <header className="topbar">
      <button className="brand" onClick={() => setTab('home')}><span className="logo">W</span><span>Work<span>Chain</span></span></button>
      <nav>
        {([['home','Home'],['workers','Find Workers'],['profile','My Profile'],['agency','Agency Panel']] as const).map(([key,label]) => <button key={key} className={tab===key?'active':''} onClick={() => setTab(key)}>{label}</button>)}
      </nav>
      <div className="walletArea">
        {!walletLoggedIn ? (
          <button className="walletButton" onClick={handleWalletLogin} disabled={walletBusy}>
            <span className="dot"></span>
            {walletBusy ? 'Connecting...' : 'Connect MetaMask'}
          </button>
        ) : (
          <div className="wallet">
            <span className="dot"></span>
            <span>Sepolia</span>
            <b>{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</b>
            {!walletRegistered && (
              <button className="walletRegister" onClick={handleRegisterWallet} disabled={walletBusy}>
                {walletBusy ? 'Confirm...' : 'Register'}
              </button>
            )}
            {walletRegistered && <span className="registered">✓ On-chain</span>}
          </div>
        )}
      </div>
    </header>

    {tab === 'home' && <section className="hero page">
      <div className="heroCopy"><Badge green>BLOCKCHAIN-VERIFIED WORK EXPERIENCE</Badge><h1>Find people you can <em>trust.</em></h1><p>WorkChain lets workers build a verifiable history of skills, certificates, clients, and contracts—anchored to a blockchain.</p><div className="actions"><button className="primary" onClick={() => setTab('workers')}>Find verified workers →</button><button className="secondary" onClick={() => setTab('profile')}>Build my profile</button></div><div className="trustRow"><span>✓ Tamper-evident credentials</span><span>✓ QR verification</span><span>✓ Contract history</span></div></div>
      <div className="profileCard"><div className="cardTop"><span>VERIFIED WORKER</span><span className="check">✓</span></div><div className="avatar">AR</div><h3>Alex Rivera</h3><p>Full-Stack Developer</p><div className="stats"><div><b>18</b><small>Clients</small></div><div><b>6</b><small>Credentials</small></div><div><b>4.9</b><small>Rating</small></div></div><div className="chain"><span>●</span><div><b>Credential #WC-1042</b><small>Verified on blockchain · 2 days ago</small></div></div><button className="wide" onClick={() => setVerifyOpen(true)}>Scan / Verify QR</button></div>
    </section>}

    {tab === 'workers' && <section className="page"><div className="sectionHead"><div><Badge green>CLIENT MODE</Badge><h2>Find verified workers</h2><p>Search by skills, experience, or worker ID.</p></div><button className="secondary" onClick={() => notify('Search filters opened')}>＋ Filters</button></div><input className="search" placeholder="Search developers, designers, skills..." value={query} onChange={e=>setQuery(e.target.value)} /><div className="workerGrid">{filtered.map(w => <article className="worker" key={w.id}><div className="workerAvatar">{w.name.split(' ').map(x=>x[0]).join('')}</div><div className="workerMain"><div className="workerTitle"><h3>{w.name}</h3><Badge green>✓ Verified</Badge></div><p>{w.role} · {w.location}</p><div className="skills">{w.skills.map(s=><span key={s}>{s}</span>)}</div><div className="workerStats"><b>★ {w.rating}</b><span>{w.clients} clients</span><span>{w.verified} verified credentials</span><span className={w.available?'available':''}>{w.available?'Available':'Busy'}</span></div></div><button className="view" onClick={()=>setSelected(w)}>View profile</button></article>)}</div></section>}

    {tab === 'profile' && <section className="page"><div className="sectionHead"><div><Badge green>WORKER PROFILE</Badge><h2>My verified work history</h2><p>Your profile is editable, while verified evidence is anchored to the blockchain.</p></div><button className="primary" onClick={()=>notify('Credential upload dialog opened')}>＋ Add credential</button></div><div className="profileLayout"><div className="panel identity"><div className="bigAvatar">AR</div><h3>Alex Rivera</h3><p>Full-Stack Developer</p><Badge green>✓ Identity verified</Badge><hr/><div><small>Worker ID</small><b>WC-1042</b></div><div><small>Clients completed</small><b>18</b></div><div><small>Public verification</small><button className="link" onClick={()=>setVerifyOpen(true)}>Open QR</button></div></div><div className="panel"><h3>Blockchain credentials</h3><p className="muted">Only the proof/hash is stored on-chain; the original certificate can remain securely stored off-chain.</p>{credentials.map(c=><div className="credential" key={c.title}><div className="certIcon">✓</div><div className="certInfo"><b>{c.title}</b><span>{c.issuer} · {c.year}</span><small>{c.hash} · {c.status}</small></div><button className="iconBtn" onClick={()=>setVerifyOpen(true)}>QR</button></div>)}</div></div></section>}

    {tab === 'agency' && <section className="page"><div className="sectionHead"><div><Badge>AGENCY ADMIN</Badge><h2>Agency Panel</h2><p>View registered workers without changing their personal verification records.</p></div><button className="secondary" onClick={()=>notify('Worker application review opened')}>Review applications</button></div><div className="agencyBanner"><div><b>BrightPath Staffing Agency</b><p>Agency ID: AG-0098 · 42 registered workers</p></div><Badge green>✓ Agency verified</Badge></div><div className="panel"><div className="tableHead"><b>Worker</b><b>Role</b><b>Credentials</b><b>Contract</b><b>Status</b></div>{workers.map(w=><div className="tableRow" key={w.id}><div><b>{w.name}</b><small>{w.id}</small></div><span>{w.role}</span><span>{w.verified} verified</span><button className="contract" onClick={()=>{setSelected(w);setContractOpen(true)}}>View contract</button><Badge green>Active</Badge></div>)}</div><p className="note">🔒 Agency accounts have read-only access to worker verification data. Workers control their credentials and can approve contract relationships.</p></section>}

    {selected && <div className="modalBackdrop" onClick={()=>setSelected(null)}><div className="modal" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setSelected(null)}>×</button><div className="modalAvatar">{selected.name.split(' ').map(x=>x[0]).join('')}</div><h2>{selected.name}</h2><p>{selected.role} · {selected.location}</p><div className="modalStats"><b>★ {selected.rating}<small>Rating</small></b><b>{selected.clients}<small>Clients</small></b><b>{selected.verified}<small>Credentials</small></b></div><h4>Skills</h4><div className="skills">{selected.skills.map(s=><span key={s}>{s}</span>)}</div><div className="verifyBox"><b>✓ Blockchain verified</b><small>Worker ID {selected.id} · credential proofs available</small></div><div className="actions"><button className="primary" onClick={()=>setContractOpen(true)}>Propose contract</button><button className="secondary" onClick={()=>setVerifyOpen(true)}>Verify QR</button></div></div></div>}

    {verifyOpen && <div className="modalBackdrop" onClick={()=>setVerifyOpen(false)}><div className="modal qrModal" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setVerifyOpen(false)}>×</button><Badge green>PUBLIC VERIFICATION</Badge><h2>Verify WorkChain Record</h2><div className="qr">▦<div>QR</div></div><p>Scan this code to verify the worker and credential proofs recorded on the WorkChain network.</p><div className="hash"><small>Blockchain proof</small><b>0x8f2a91c4...7e02</b></div><button className="primary wide" onClick={()=>notify('Verification successful')}>✓ Verification successful</button></div></div>}

    {contractOpen && <div className="modalBackdrop" onClick={()=>setContractOpen(false)}><div className="modal" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setContractOpen(false)}>×</button><Badge>SMART CONTRACT PREVIEW</Badge><h2>Work Agreement</h2><div className="contractLines"><div><span>Worker</span><b>{selected?.name || 'Alex Rivera'}</b></div><div><span>Client / Agency</span><b>BrightPath Staffing Agency</b></div><div><span>Contract status</span><Badge green>Pending approval</Badge></div><div><span>Proof</span><b>Contract hash generated on approval</b></div></div><p className="muted">This prototype demonstrates the contract workflow. The WorkChain Registry is a real Ethereum Sepolia smart contract; the work agreement shown here remains a prototype workflow.</p><div className="verifyBox"><b>Ethereum Sepolia</b><small>{walletLoggedIn ? 'Wallet connected and ready for blockchain actions.' : 'Connect MetaMask to use blockchain actions.'}</small></div><button className="primary wide" onClick={()=>{setContractOpen(false);notify('Contract proposal created')}}>Create contract proposal</button></div></div>}

    {toast && <div className="toast">✓ {toast}</div>}
    <footer>WorkChain prototype · Blockchain-based work experience verification · Demo data only</footer>
  </main>;
}
