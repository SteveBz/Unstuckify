import { useState, useEffect } from "react";
import { storage } from "./storage.js";

const EDGY = {
  Identity:     { hex: "#4CAF50", light: "#E8F5E9", border: "#4CAF50", text: "#2E7D32" },
  Architecture: { hex: "#2196F3", light: "#E3F2FD", border: "#2196F3", text: "#1565C0" },
  Experience:   { hex: "#E91E63", light: "#FCE4EC", border: "#E91E63", text: "#880E4F" },
  Organisation: { hex: "#00BCD4", light: "#E0F7FA", border: "#00BCD4", text: "#00838F" },
  Brand:        { hex: "#FF9800", light: "#FFF3E0", border: "#FF9800", text: "#E65100" },
  Product:      { hex: "#9C27B0", light: "#F3E5F5", border: "#9C27B0", text: "#6A1B9A" },
};
const FALLBACK = { hex: "#94A3B8", light: "#F1F5F9", border: "#94A3B8", text: "#475569" };
const ec = z => EDGY[z] || FALLBACK;

const ZONE_DESC = {
  Identity:     "Purpose, Story, Culture — why the enterprise exists",
  Experience:   "Tasks, Journeys, Channels — what people experience",
  Architecture: "Capabilities, Processes, Assets — how it works",
  Organisation: "People, decisions, ways of working",
  Product:      "What is made and delivered for people",
  Brand:        "Reputation, image, perception",
};
const ALL_ZONES = ["Identity","Experience","Architecture","Organisation","Product","Brand"];

const CX = { Identity: 210, Architecture: 350, Experience: 280 };
const CY = { Identity: 160, Architecture: 160, Experience: 275 };
const CR = 105;
const INT_POS = { Organisation:{x:280,y:128}, Brand:{x:193,y:248}, Product:{x:367,y:248} };

function VennCanvas({ zoneData, pertinent, reframedZones, activeZone }) {
  const icons = {
    Identity: (cx,cy,col) => <g key="i-id"><circle cx={cx-8} cy={cy} r={14} fill="none" stroke={col} strokeWidth={2.5}/><circle cx={cx+10} cy={cy+12} r={8} fill="none" stroke={col} strokeWidth={2.5}/></g>,
    Architecture: (cx,cy,col) => <g key="i-ar"><polygon points={`${cx},${cy-16} ${cx-14},${cy+10} ${cx+14},${cy+10}`} fill="none" stroke={col} strokeWidth={2.5}/><line x1={cx-14} y1={cy+10} x2={cx+14} y2={cy+10} stroke={col} strokeWidth={2.5}/></g>,
    Experience: (cx,cy,col) => <g key="i-ex"><path d={`M${cx},${cy+14} C${cx-20},${cy} ${cx-22},${cy-18} ${cx},${cy-8} C${cx+22},${cy-18} ${cx+20},${cy} ${cx},${cy+14}Z`} fill="none" stroke={col} strokeWidth={2.5}/></g>,
  };
  const intIcons = {
    Organisation: (cx,cy,col) => <g key="i-org"><path d={`M${cx},${cy-8} L${cx-7},${cy+6} L${cx+7},${cy+6}Z`} fill="none" stroke={col} strokeWidth={2}/></g>,
    Brand: (cx,cy,col) => <g key="i-br"><circle cx={cx} cy={cy} r={7} fill="none" stroke={col} strokeWidth={2}/>{[0,60,120,180,240,300].map(a=>{const r=a*Math.PI/180;return <line key={a} x1={cx+7*Math.cos(r)} y1={cy+7*Math.sin(r)} x2={cx+11*Math.cos(r)} y2={cy+11*Math.sin(r)} stroke={col} strokeWidth={2}/>})}</g>,
    Product: (cx,cy,col) => <g key="i-pr"><rect x={cx-7} y={cy-7} width={14} height={14} fill="none" stroke={col} strokeWidth={2}/><line x1={cx} y1={cy-7} x2={cx-4} y2={cy-13} stroke={col} strokeWidth={2}/><line x1={cx} y1={cy-7} x2={cx+6} y2={cy-11} stroke={col} strokeWidth={2}/><line x1={cx+7} y1={cy-3} x2={cx+13} y2={cy-7} stroke={col} strokeWidth={2}/></g>,
  };
  return (
    <svg viewBox="0 0 560 410" style={{width:"100%",height:"auto"}}>
      {["Identity","Architecture","Experience"].map(z=>{
        const c=ec(z), isActive=activeZone===z, isPertinent=pertinent.includes(z), isReframed=reframedZones.includes(z), isInactive=!isPertinent&&!isReframed;
        return <circle key={z} cx={CX[z]} cy={CY[z]} r={CR} fill={c.hex} fillOpacity={isActive?0.80:isPertinent?0.65:isReframed?0.35:0.08} stroke={isInactive?"#CBD5E1":c.hex} strokeWidth={isActive?6:isPertinent?4:isReframed?2:1} strokeDasharray={isReframed?"7,4":"none"}/>;
      })}
      <defs>
        <clipPath id="cl-id"><circle cx={CX.Identity} cy={CY.Identity} r={CR}/></clipPath>
        <clipPath id="cl-ar"><circle cx={CX.Architecture} cy={CY.Architecture} r={CR}/></clipPath>
      </defs>
      <circle cx={CX.Architecture} cy={CY.Architecture} r={CR} clipPath="url(#cl-id)" fill={EDGY.Organisation.hex} fillOpacity={0.85} style={{pointerEvents:"none"}}/>
      <circle cx={CX.Experience} cy={CY.Experience} r={CR} clipPath="url(#cl-id)" fill={EDGY.Brand.hex} fillOpacity={0.85} style={{pointerEvents:"none"}}/>
      <circle cx={CX.Experience} cy={CY.Experience} r={CR} clipPath="url(#cl-ar)" fill={EDGY.Product.hex} fillOpacity={0.85} style={{pointerEvents:"none"}}/>
      {icons.Identity(CX.Identity-18,CY.Identity+10,"rgba(255,255,255,0.85)")}
      {icons.Architecture(CX.Architecture+18,CY.Architecture+10,"rgba(255,255,255,0.85)")}
      {icons.Experience(CX.Experience,CY.Experience+28,"rgba(255,255,255,0.85)")}
      {intIcons.Organisation(INT_POS.Organisation.x,INT_POS.Organisation.y-14,"rgba(255,255,255,0.9)")}
      {intIcons.Brand(INT_POS.Brand.x-2,INT_POS.Brand.y+2,"rgba(255,255,255,0.9)")}
      {intIcons.Product(INT_POS.Product.x+2,INT_POS.Product.y+2,"rgba(255,255,255,0.9)")}
      {[["Identity",CX.Identity-30,CY.Identity+36],["Architecture",CX.Architecture+22,CY.Architecture+36],["Experience",CX.Experience,CY.Experience+60]].map(([z,lx,ly])=>
        <text key={z} x={lx} y={ly} textAnchor="middle" style={{fontSize:13,fontWeight:700,fill:"white",filter:"drop-shadow(0 1px 2px rgba(0,0,0,0.4))"}}>{z}</text>)}
      {[["Organisation",INT_POS.Organisation.x,INT_POS.Organisation.y+10],["Brand",INT_POS.Brand.x-2,INT_POS.Brand.y+22],["Product",INT_POS.Product.x+2,INT_POS.Product.y+22]].map(([z,lx,ly])=>
        <text key={z} x={lx} y={ly} textAnchor="middle" style={{fontSize:10,fontWeight:700,fill:"white",filter:"drop-shadow(0 1px 2px rgba(0,0,0,0.3))"}}>{z}</text>)}
      {Object.entries(zoneData).map(([zone,items])=>{
        if(!items?.length) return null;
        const off={Identity:{x:CX.Identity-70,y:CY.Identity-30},Architecture:{x:CX.Architecture+20,y:CY.Architecture-30},Experience:{x:CX.Experience-45,y:CY.Experience+88},Organisation:{x:INT_POS.Organisation.x-30,y:INT_POS.Organisation.y-28},Brand:{x:INT_POS.Brand.x-58,y:INT_POS.Brand.y+38},Product:{x:INT_POS.Product.x-10,y:INT_POS.Product.y+38}}[zone];
        if(!off) return null;
        return items.slice(0,2).map((item,i)=><text key={`${zone}-${i}`} x={off.x} y={off.y+i*13} style={{fontSize:8,fill:"white",fontStyle:"italic",filter:"drop-shadow(0 1px 1px rgba(0,0,0,0.5))"}}>• {item.length>22?item.slice(0,20)+"…":item}</text>);
      })}
      <circle cx={28} cy={390} r={7} fill="#4CAF50" fillOpacity={0.65} stroke="#4CAF50" strokeWidth={4}/>
      <text x={42} y={394} style={{fontSize:9,fill:"#64748B"}}>Original framing</text>
      <circle cx={148} cy={390} r={7} fill="#9C27B0" fillOpacity={0.35} stroke="#9C27B0" strokeWidth={2} strokeDasharray="5,3"/>
      <text x={162} y={394} style={{fontSize:9,fill:"#64748B"}}>Reframed</text>
      <circle cx={232} cy={390} r={7} fill="none" stroke="#CBD5E1" strokeWidth={1}/>
      <text x={246} y={394} style={{fontSize:9,fill:"#64748B"}}>Not activated</text>
    </svg>
  );
}

const PHASES_LABEL = { input:"Describing", reframe_intro:"Framing", reframe:"Reframing", done:"Complete" };

export default function App() {
  const [phase, setPhase] = useState("home");
  const [challenge, setChallenge] = useState({ title:"", description:"" });
  const [zoneData, setZoneData] = useState({});
  const [decomposition, setDecomposition] = useState(null);
  const [pertinent, setPertinent] = useState([]);
  const [framingQuestions, setFramingQuestions] = useState({});
  const [framingAnswers, setFramingAnswers] = useState({});
  const [reframeQueue, setReframeQueue] = useState([]);
  const [currentZone, setCurrentZone] = useState(null);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentAnswers, setCurrentAnswers] = useState(["","",""]);
  const [narrative, setNarrative] = useState("");
  const [summary, setSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [allInsights, setAllInsights] = useState({});
  const [reframedZones, setReframedZones] = useState([]);
  const [showReport, setShowReport] = useState(false);
  const [reportSections, setReportSections] = useState(null);
  const [savedChallenges, setSavedChallenges] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => { loadAllChallenges(); }, []);

  async function loadAllChallenges() {
    try {
      const result = await storage.list("challenge:");
      const items = [];
      for (const key of (result?.keys || [])) {
        try {
          const r = await storage.get(key);
          if (r?.value) items.push(r.value);
        } catch(e) {}
      }
      items.sort((a,b) => b.savedAt - a.savedAt);
      setSavedChallenges(items);
    } catch(e) {}
  }

  async function saveChallenge(overrideState = {}) {
    const id = currentId || `challenge:${Date.now()}`;
    const data = {
      id, savedAt: Date.now(),
      challenge, zoneData, decomposition, pertinent,
      framingQuestions, framingAnswers, reframeQueue,
      allInsights, reframedZones, narrative, summary,
      phase: overrideState.phase || phase,
      ...overrideState,
    };
    try {
      await storage.set(id, data);
      if (!currentId) setCurrentId(id);
      setSaveStatus("Saved ✓");
      setTimeout(() => setSaveStatus(""), 2000);
      await loadAllChallenges();
    } catch(e) { setSaveStatus("Save failed"); }
  }

  async function loadChallenge(item) {
    setChallenge(item.challenge || { title:"", description:"" });
    setZoneData(item.zoneData || {});
    setDecomposition(item.decomposition || null);
    setPertinent(item.pertinent || []);
    setFramingQuestions(item.framingQuestions || {});
    setFramingAnswers(item.framingAnswers || {});
    setReframeQueue(item.reframeQueue || []);
    setAllInsights(item.allInsights || {});
    setReframedZones(item.reframedZones || []);
    setNarrative(item.narrative || "");
    setSummary(item.summary || "");
    setCurrentId(item.id);
    setPhase(item.phase || "input");
    setCurrentZone(null); setCurrentQuestions([]); setCurrentAnswers(["","",""]);
  }

  async function deleteChallenge(id, e) {
    e.stopPropagation();
    try {
      await storage.delete(id);
      await loadAllChallenges();
      if (currentId === id) reset();
    } catch(e) {}
  }

async function callClaude(messages, system) {
  const res = await fetch("/.netlify/functions/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, system }),
  });
  const data = await res.json();
  
  // Handle error responses
  if (data.error) {
    throw new Error(data.error);
  }
  
  // Safety check before reading content
  if (!data.content || !Array.isArray(data.content)) {
    throw new Error("Unexpected response: " + JSON.stringify(data));
  }
  
  return data.content.map(b => b.text || "").join("");
}

  async function handleDecompose() {
    if (!challenge.title.trim() || !challenge.description.trim()) return;
    setPhase("decomposing"); setLoading(true); setLoadingMsg("Decomposing challenge through EDGY lenses…");
    const system = `You are an expert Enterprise Architect using the EDGY framework. EDGY has 3 Facets: Identity, Experience, Architecture. And 3 Intersections: Organisation, Product, Brand. Respond ONLY in valid JSON. No markdown.`;
    const prompt = `Decompose this enterprise challenge into EDGY zones.
Challenge: "${challenge.title}"
Description: "${challenge.description}"
Select only 2-4 genuinely pertinent zones. Return JSON:
{
  "zones": { "ZoneName": ["element1","element2"] },
  "priority_order": ["ZoneName1","ZoneName2"],
  "framing_questions": { "ZoneName": ["How might I ...","How might I ..."] },
  "summary": "2-sentence framing of the challenge through EDGY"
}
Zone elements: 1-3 bullets max 8 words each. All questions must start with "How might I...".`;
    try {
      const raw = await callClaude([{role:"user",content:prompt}], system);
      const parsed = JSON.parse(raw.replace(/```json|```/g,"").trim());
      const order = (parsed.priority_order||[]).filter(z=>ALL_ZONES.includes(z));
      const newZoneData = parsed.zones||{};
      const newDecomp = {...parsed, priority_order:order};
      const newFQ = parsed.framing_questions||{};
      const blanks = {}; order.forEach(z=>{blanks[z]=["",""];});
      const newQueue = ALL_ZONES.filter(z=>!order.includes(z));
      setZoneData(newZoneData); setDecomposition(newDecomp); setPertinent(order);
      setFramingQuestions(newFQ); setFramingAnswers(blanks); setReframeQueue(newQueue);
      setPhase("reframe_intro");
      const id = `challenge:${Date.now()}`;
      setCurrentId(id);
      await storage.set(id, { id, savedAt:Date.now(), challenge, zoneData:newZoneData, decomposition:newDecomp, pertinent:order, framingQuestions:newFQ, framingAnswers:blanks, reframeQueue:newQueue, allInsights:{}, reframedZones:[], narrative:"", summary:"", phase:"reframe_intro" });
      await loadAllChallenges();
    } catch(e) { setLoadingMsg("Error — please try again."); setPhase("input"); }
    setLoading(false);
  }

  function handleFramingAnswer(zone, idx, val) {
    setFramingAnswers(prev => { const c={...prev,[zone]:[...(prev[zone]||["",""])]};c[zone][idx]=val;return c; });
  }

  async function startReframe() {
    const initialInsights = {};
    pertinent.forEach(z => { const qs=framingQuestions[z]||[], as=framingAnswers[z]||[]; initialInsights[z]=qs.map((q,i)=>`Q: ${q}\nA: ${as[i]||"(no answer)"}`).join("\n"); });
    setAllInsights(initialInsights); setPhase("reframe");
    await saveChallenge({ phase:"reframe", allInsights:initialInsights });
    await loadNextZone(reframeQueue, 0, initialInsights);
  }

  async function loadNextZone(queue, idx, insights) {
    if (idx >= queue.length) { await generateNarrative(insights); return; }
    const zone = queue[idx];
    setCurrentZone(zone); setCurrentAnswers(["","",""]);
    setLoading(true); setLoadingMsg(`Preparing questions for ${zone}…`);
    const prevCtx = Object.entries(insights).map(([z,a])=>`${z}: ${a}`).join("\n");
    const prompt = `Challenge: "${challenge.title}" — ${challenge.description}
Original framing zones: ${JSON.stringify(pertinent)}
Zone to reframe: ${zone} — ${ZONE_DESC[zone]||""}
${prevCtx?`Previous insights:\n${prevCtx}`:""}
"${zone}" was NOT in the original framing. Generate 2-3 "How might I..." questions using this zone as a blind-spot lens.
Every question MUST start with "How might I...".
Return JSON: { "questions": ["How might I ...","How might I ..."] }`;
    try {
      const raw = await callClaude([{role:"user",content:prompt}], `You are an EDGY Enterprise Design coach. Respond ONLY in valid JSON. No markdown.`);
      const parsed = JSON.parse(raw.replace(/```json|```/g,"").trim());
      setCurrentQuestions(parsed.questions||[]);
    } catch(e) { setCurrentQuestions(["How might I reframe this from a different angle?","How might I uncover hidden assumptions here?"]); }
    setLoading(false);
  }

  async function handleZoneSubmit() {
    if (!currentZone) return;
    const answerText = currentQuestions.map((q,i)=>`Q: ${q}\nA: ${currentAnswers[i]||"(no answer)"}`).join("\n");
    const newInsights = {...allInsights,[currentZone]:answerText};
    const newReframed = [...reframedZones, currentZone];
    setAllInsights(newInsights); setReframedZones(newReframed);
    setLoading(true); setLoadingMsg(`Updating canvas for ${currentZone}…`);
    let newZoneData = zoneData;
    try {
      const raw = await callClaude([{role:"user",content:`Based on these reframe answers for "${currentZone}", generate 2 short insight bullets (max 8 words each).\nAnswers: ${answerText}\nReturn: { "insights": ["insight1","insight2"] }`}], `You are an EDGY expert. Respond ONLY in valid JSON.`);
      const parsed = JSON.parse(raw.replace(/```json|```/g,"").trim());
      newZoneData = {...zoneData,[currentZone]:parsed.insights||[]};
      setZoneData(newZoneData);
    } catch(e) {}
    setLoading(false);
    await saveChallenge({ allInsights:newInsights, reframedZones:newReframed, zoneData:newZoneData });
    const idx = reframeQueue.indexOf(currentZone);
    await loadNextZone(reframeQueue, idx+1, newInsights);
  }

  async function generateNarrative(insights) {
    setPhase("generating"); setLoading(true); setLoadingMsg("Synthesising solution narrative…");
    const insightText = Object.entries(insights).map(([z,a])=>`=== ${z} ===\n${a}`).join("\n\n");
    let newNarrative = "";
    try {
      newNarrative = await callClaude([{role:"user",content:`Challenge: "${challenge.title}"\nDescription: "${challenge.description}"\nOriginal framing zones: ${pertinent.join(", ")}\nAll reframe insights:\n${insightText}\nWrite a coherent solution narrative (4-5 paragraphs):\n1. Restate the challenge as reframed through EDGY\n2. Key insights from original framing zones\n3. New perspectives from reframe zones\n4. Coherent path forward\nBe specific and actionable.`}], `You are a senior Enterprise Architect and EDGY practitioner.`);
      setNarrative(newNarrative);
    } catch(e) { newNarrative="Error generating narrative."; setNarrative(newNarrative); }
    setPhase("done"); setLoading(false);
    await saveChallenge({ narrative:newNarrative, phase:"done", allInsights:insights });
  }

  async function generateSummary() {
    setLoadingSummary(true);
    try {
      const raw = await callClaude([{role:"user",content:`Based on this solution narrative, produce a concise executive summary with two clearly labelled sections:\n\n1. KEY INSIGHTS — 3 to 5 bullet points capturing the most important reframe insights across the EDGY zones.\n2. PRIORITY ACTIONS — 3 to 5 bullet points listing the most important actions to take, each starting with a strong action verb.\n\nKeep each bullet to 1-2 sentences maximum. Be specific and actionable.\n\nNarrative:\n${narrative}`}], `You are a senior Enterprise Architect and EDGY practitioner. Write clearly and concisely for a senior leadership audience.`);
      setSummary(raw);
      await saveChallenge({ summary:raw });
    } catch(e) { setSummary("Error generating summary."); }
    setLoadingSummary(false);
  }

  function generatePDF() {
    const zoneColor = z=>({Identity:"#4CAF50",Architecture:"#2196F3",Experience:"#E91E63",Organisation:"#00BCD4",Brand:"#FF9800",Product:"#9C27B0"}[z]||"#64748B");
    const reframeZoneList = ALL_ZONES.filter(z=>!pertinent.includes(z));
    const date = new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"});
    const buildZone = (zone,questions,answers,elements)=>({zone,col:zoneColor(zone),desc:ZONE_DESC[zone]||"",elements:elements||[],qa:(questions||[]).map((q,i)=>({q,a:(answers||[])[i]||""}))});
    const framingData = pertinent.map(z=>buildZone(z,framingQuestions[z],framingAnswers[z],decomposition?.zones?.[z]));
    const reframeData = reframeZoneList.map(z=>{const insight=allInsights[z];const qs=[],as=[];if(insight)insight.split("\n").forEach((l,i,arr)=>{if(l.startsWith("Q:")){qs.push(l.slice(2).trim());as.push((arr[i+1]||"").replace(/^A:\s*/,""));}});return buildZone(z,qs.length?qs:["Not yet explored"],as,[]);});
    setReportSections({ framingData, reframeData, date });
    setShowReport(true);
  }

  function downloadReport() {
    const zoneColor = z=>({Identity:"#4CAF50",Architecture:"#2196F3",Experience:"#E91E63",Organisation:"#00BCD4",Brand:"#FF9800",Product:"#9C27B0"}[z]||"#64748B");
    const reframeZoneList = ALL_ZONES.filter(z=>!pertinent.includes(z));
    const date = new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"});
    const zBH=(zone,questions,answers,elements)=>{const col=zoneColor(zone);const el=(elements||[]).map(e=>`<li>${e}</li>`).join("");const qa=(questions||[]).map((q,i)=>`<div class="qa"><div class="q" style="color:${col}">${q}</div><div class="a">${(answers||[])[i]||"<em>No answer provided</em>"}</div></div>`).join("");return `<div class="zone" style="border-left:4px solid ${col}"><span class="zt" style="background:${col}">${zone}</span><div class="zd">${ZONE_DESC[zone]||""}</div>${el?`<ul>${el}</ul>`:""}${qa}</div>`;};
    const fH=pertinent.map(z=>zBH(z,framingQuestions[z],framingAnswers[z],decomposition?.zones?.[z])).join("");
    const rH=reframeZoneList.map(z=>{const ins=allInsights[z];const qs=[],as=[];if(ins)ins.split("\n").forEach((l,i,arr)=>{if(l.startsWith("Q:")){qs.push(l.slice(2).trim());as.push((arr[i+1]||"").replace(/^A:\s*/,""));}});return zBH(z,qs.length?qs:["Not yet explored"],as,[]);}).join("");
    const sH=summary?`<div class="sumbox"><div class="sumtitle">⚡ Key Insights &amp; Actions</div><div style="white-space:pre-wrap">${summary}</div></div>`:"";
    const nH=(narrative||"").split("\n\n").map(p=>`<p>${p}</p>`).join("");
    const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Unstuckify Report</title><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;color:#1e293b;font-size:11pt;background:#fff}.cover{padding:70px 60px;background:#f8fafc;border-left:16px solid #4CAF50;page-break-after:always;min-height:100vh}.stripe span{display:inline-block;width:28px;height:6px}h1{font-size:26pt;margin:28px 0 8px;line-height:1.2}.ct{font-size:15pt;font-style:italic;color:#334155;margin:16px 0 8px}.cd{font-size:11pt;color:#64748b;line-height:1.7;max-width:480px}.meta{margin-top:36px;font-size:9pt;color:#94a3b8}.sec{padding:50px 60px;page-break-before:always}.sh{display:flex;align-items:center;gap:12px;margin-bottom:22px;padding-left:14px}.sn{width:26px;height:26px;border-radius:50%;color:#fff;font-weight:700;font-size:11pt;display:flex;align-items:center;justify-content:center;flex-shrink:0}.sh h2{font-size:15pt;color:#1e293b}.summ{background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:12px 14px;margin-bottom:18px;font-size:10.5pt;color:#475569;line-height:1.7}.sumbox{background:#f0fdf4;border:1px solid #4CAF50;border-left:4px solid #4CAF50;border-radius:6px;padding:12px 14px;margin-bottom:18px;font-size:10.5pt;color:#334155;line-height:1.8}.sumtitle{font-weight:700;color:#2e7d32;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px;font-size:10pt}.zone{background:#fafafa;border-radius:6px;padding:12px 14px;margin-bottom:14px;page-break-inside:avoid}.zt{display:inline-block;color:#fff;font-size:9.5pt;font-weight:700;padding:2px 10px;border-radius:4px;margin-bottom:5px;text-transform:uppercase;letter-spacing:.5px}.zd{font-size:9pt;color:#94a3b8;margin-bottom:7px}ul{padding-left:16px;margin-bottom:8px}li{font-size:9.5pt;color:#64748b;margin-bottom:2px}.qa{margin-bottom:9px}.q{font-size:10pt;font-weight:700;font-style:italic;margin-bottom:3px;line-height:1.5}.a{font-size:10pt;color:#475569;line-height:1.6;padding-left:10px;border-left:2px solid #e2e8f0}p{font-size:11pt;color:#334155;line-height:1.9;margin-bottom:13px}.foot{padding:14px 60px 30px;border-top:1px solid #e2e8f0;font-size:8pt;color:#94a3b8;margin-top:30px}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}.cover{page-break-after:always;min-height:auto}.sec{page-break-before:always}.zone{page-break-inside:avoid}}</style></head><body><div class="cover"><div class="stripe">${["#4CAF50","#2196F3","#E91E63","#00BCD4","#FF9800","#9C27B0"].map(c=>`<span style="background:${c}"></span>`).join("")}</div><h1>Unstuckify<br>Workbench Report</h1><div class="ct">${challenge.title}</div><div class="cd">${challenge.description}</div><div class="meta">Generated: ${date}<br>Inspired by the EDGY framework by Intersection Group · intersection.group</div></div><div class="sec"><div class="sh" style="border-left:5px solid #4CAF50"><div class="sn" style="background:#4CAF50">1</div><h2>Initial EDGY Framing</h2></div><div class="summ">${decomposition?.summary||""}</div>${fH}</div><div class="sec"><div class="sh" style="border-left:5px solid #9C27B0"><div class="sn" style="background:#9C27B0">2</div><h2>Reframing — Blind Spot Zones</h2></div>${rH}</div><div class="sec"><div class="sh" style="border-left:5px solid #2196F3"><div class="sn" style="background:#2196F3">3</div><h2>Solution Narrative</h2></div>${sH}${nH}</div><div class="foot">Unstuckify Workbench · Inspired by the EDGY Framework by Intersection Group</div></body></html>`;
    const blob=new Blob([html],{type:"text/html"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`Unstuckify-Report-${challenge.title.replace(/\s+/g,"-").slice(0,40)}.html`;document.body.appendChild(a);a.click();document.body.removeChild(a);setTimeout(()=>URL.revokeObjectURL(url),10000);
  }

  function reset() {
    setPhase("home"); setChallenge({title:"",description:""}); setZoneData({}); setDecomposition(null); setPertinent([]);
    setFramingQuestions({}); setFramingAnswers({}); setReframeQueue([]); setCurrentZone(null); setCurrentQuestions([]);
    setCurrentAnswers(["","",""]); setNarrative(""); setSummary(""); setAllInsights({}); setReframedZones([]);
    setShowReport(false); setReportSections(null); setCurrentId(null);
  }

  const progress = reframeQueue.length>0?(reframedZones.length/reframeQueue.length)*100:0;
  const inp = {width:"100%",background:"#fff",border:"1px solid #CBD5E1",borderRadius:8,padding:"9px 12px",color:"#1E293B",fontSize:13,boxSizing:"border-box"};
  const lbl = {fontSize:11,color:"#64748B",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:1};

  return (
    <div style={{display:"flex",height:"100vh",fontFamily:"'Inter',sans-serif",overflow:"hidden"}}>
      <div style={{width:"50%",borderRight:"1px solid #CBD5E1",display:"flex",flexDirection:"column",overflow:"hidden",background:"#F8FAFC"}}>
        <div style={{padding:"14px 20px",borderBottom:"1px solid #E2E8F0",background:"#fff"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <svg width="38" height="38" viewBox="0 0 38 38">
                {(()=>{const cx=19,cy=19,r=13,arcs=[{color:"#4CAF50",start:-90,end:20},{color:"#2196F3",start:40,end:150},{color:"#E91E63",start:170,end:280}],toRad=d=>d*Math.PI/180,pt=d=>[cx+r*Math.cos(toRad(d)),cy+r*Math.sin(toRad(d))];return arcs.map(({color,start,end})=>{const[x1,y1]=pt(start),[x2,y2]=pt(end),fwd=toRad(end),perp=toRad(end+90),ah=5,aw=3,tip=[x2+ah/2*Math.cos(fwd),y2+ah/2*Math.sin(fwd)],b1=[x2-ah/2*Math.cos(fwd)+aw*Math.cos(perp),y2-ah/2*Math.sin(fwd)+aw*Math.sin(perp)],b2=[x2-ah/2*Math.cos(fwd)-aw*Math.cos(perp),y2-ah/2*Math.sin(fwd)-aw*Math.sin(perp)];return(<g key={color}><path d={`M${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2}`} fill="none" stroke={color} strokeWidth="3" strokeLinecap="butt"/><polygon points={`${tip[0]},${tip[1]} ${b1[0]},${b1[1]} ${b2[0]},${b2[1]}`} fill={color}/></g>);});})()}
              </svg>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:"#334155",letterSpacing:2,textTransform:"uppercase"}}>Unstuckify Workbench</div>
                <div style={{fontSize:10,color:"#CBD5E1",marginTop:1}}>Inspired by the <a href="https://intersection.group/enterprise-design/enterprise-design-with-edgy/" target="_blank" rel="noopener noreferrer" style={{color:"#4CAF50",textDecoration:"none",fontWeight:600}}>EDGY framework</a> by Intersection Group</div>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              {saveStatus && <span style={{fontSize:11,color:"#4CAF50",fontWeight:600}}>{saveStatus}</span>}
              {phase !== "home" && <button onClick={reset} style={{fontSize:11,color:"#64748B",background:"#fff",border:"1px solid #CBD5E1",borderRadius:6,padding:"5px 10px",cursor:"pointer"}}>☰ My Challenges</button>}
            </div>
          </div>
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}}>
          {phase === "home" && (
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <div style={{fontSize:14,fontWeight:600,color:"#1E293B"}}>My Challenges</div>
                <button onClick={()=>setPhase("input")} style={{padding:"8px 16px",background:"linear-gradient(135deg,#4CAF50,#2196F3)",border:"none",borderRadius:8,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer"}}>+ New Challenge</button>
              </div>
              {savedChallenges.length === 0 ? (
                <div style={{textAlign:"center",padding:"40px 20px",color:"#94A3B8"}}>
                  <div style={{fontSize:36,marginBottom:12}}>⬡</div>
                  <div style={{fontSize:13,marginBottom:8}}>No saved challenges yet</div>
                  <div style={{fontSize:11}}>Click <strong>+ New Challenge</strong> to get started</div>
                </div>
              ) : savedChallenges.map(item=>{
                const statusColor = item.phase==="done"?"#4CAF50":item.phase==="reframe"?"#9C27B0":"#2196F3";
                const d = new Date(item.savedAt);
                return (
                  <div key={item.id} onClick={()=>loadChallenge(item)}
                    style={{background:"#fff",border:"1px solid #E2E8F0",borderLeft:`3px solid ${statusColor}`,borderRadius:8,padding:"12px 14px",marginBottom:10,cursor:"pointer"}}
                    onMouseEnter={e=>e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.08)"}
                    onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div style={{flex:1,marginRight:10}}>
                        <div style={{fontSize:12,fontWeight:700,color:"#1E293B",marginBottom:3,lineHeight:1.4}}>{item.challenge?.title||"Untitled"}</div>
                        <div style={{fontSize:10,color:"#94A3B8",lineHeight:1.4}}>{(item.challenge?.description||"").slice(0,80)}{(item.challenge?.description||"").length>80?"…":""}</div>
                      </div>
                      <button onClick={e=>deleteChallenge(item.id,e)} style={{background:"none",border:"none",color:"#CBD5E1",cursor:"pointer",fontSize:16,lineHeight:1,flexShrink:0,padding:"0 2px"}}
                        onMouseEnter={e=>e.target.style.color="#E91E63"} onMouseLeave={e=>e.target.style.color="#CBD5E1"}>✕</button>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginTop:8}}>
                      <span style={{fontSize:10,fontWeight:600,color:statusColor,background:`${statusColor}18`,padding:"2px 8px",borderRadius:10}}>{PHASES_LABEL[item.phase]||item.phase}</span>
                      {(item.pertinent||[]).map(z=><span key={z} style={{width:8,height:8,borderRadius:"50%",background:ec(z).hex,display:"inline-block"}}/>)}
                      <span style={{fontSize:9,color:"#CBD5E1",marginLeft:"auto"}}>{d.toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})} · {d.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {phase === "input" && (
            <div>
              <div style={{fontSize:14,fontWeight:600,color:"#1E293B",marginBottom:16}}>Describe your challenge</div>
              <div style={{marginBottom:12}}>
                <label style={lbl}>Challenge Title</label>
                <div style={{fontSize:11,color:"#94A3B8",marginBottom:6,fontStyle:"italic"}}>Frame your challenge as a question — <span style={{fontWeight:700,color:"#4CAF50"}}>"How might I . . ."</span></div>
                <input value={challenge.title} onChange={e=>setChallenge(p=>({...p,title:e.target.value}))} placeholder="How might I . . ." style={inp}/>
              </div>
              <div style={{marginBottom:16}}>
                <label style={lbl}>Challenge Description</label>
                <div style={{fontSize:11,color:"#94A3B8",marginBottom:6,lineHeight:1.6}}>
                  Describe the challenge and the <span style={{fontWeight:700,color:"#2196F3"}}>outcomes you expect</span> from solving it. For example:
                  <ul style={{margin:"5px 0 0 14px",color:"#94A3B8"}}>
                    <li><em>"Customers complete onboarding in under 5 minutes"</em></li>
                    <li><em>"Teams adopt the new process within 90 days"</em></li>
                    <li><em>"Revenue from digital channels increases by 20%"</em></li>
                  </ul>
                </div>
                <textarea value={challenge.description} onChange={e=>setChallenge(p=>({...p,description:e.target.value}))} placeholder="Describe what's happening, who's affected, what you've tried — and what success looks like when this challenge is solved..." rows={7} style={{...inp,resize:"vertical"}}/>
              </div>
              <button onClick={handleDecompose} disabled={!challenge.title.trim()||!challenge.description.trim()}
                style={{width:"100%",padding:"12px",background:challenge.title&&challenge.description?"linear-gradient(135deg,#E63946,#2196F3)":"#E2E8F0",border:"none",borderRadius:8,color:challenge.title&&challenge.description?"#fff":"#94A3B8",fontSize:13,fontWeight:600,cursor:challenge.title&&challenge.description?"pointer":"default"}}>
                Decompose with EDGY →
              </button>
            </div>
          )}

          {phase === "decomposing" && <div style={{textAlign:"center",padding:"40px 0",color:"#4CAF50",fontSize:14}}><div style={{fontSize:32,marginBottom:12}}>⬡</div>{loadingMsg}</div>}

          {phase === "reframe_intro" && decomposition && (
            <div>
              <div style={{fontSize:14,fontWeight:600,color:"#1E293B",marginBottom:6}}>Initial EDGY Framing</div>
              <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:8,padding:12,marginBottom:16,fontSize:12,color:"#475569",lineHeight:1.7}}>{decomposition.summary}</div>
              <div style={{fontSize:11,color:"#64748B",textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>Explore each pertinent zone</div>
              {(decomposition.priority_order||[]).map((z,i)=>{
                const c=ec(z),qs=framingQuestions[z]||[],as=framingAnswers[z]||["",""];
                return (
                  <div key={z} style={{background:"#fff",border:`1px solid ${c.border}`,borderLeft:`3px solid ${c.hex}`,borderRadius:8,padding:"12px 14px",marginBottom:12}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                      <div style={{width:20,height:20,borderRadius:"50%",background:c.hex,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#fff",fontWeight:700}}>{i+1}</div>
                      <span style={{fontSize:12,fontWeight:700,color:c.text}}>{z}</span>
                      <span style={{fontSize:10,color:"#94A3B8"}}>— {ZONE_DESC[z]||""}</span>
                    </div>
                    {qs.map((q,qi)=>(
                      <div key={qi} style={{marginBottom:10}}>
                        <label style={{fontSize:12,color:"#334155",display:"block",marginBottom:5,fontStyle:"italic",lineHeight:1.5}}>{q}</label>
                        <textarea value={as[qi]||""} onChange={e=>handleFramingAnswer(z,qi,e.target.value)} rows={2} placeholder="Your thoughts..." style={{...inp,fontSize:12,resize:"vertical"}}/>
                      </div>
                    ))}
                  </div>
                );
              })}
              <div style={{marginBottom:10,fontSize:11,color:"#94A3B8"}}>Reframing will explore blind spots → <span style={{fontWeight:600}}>{ALL_ZONES.filter(z=>!pertinent.includes(z)).join(", ")}</span></div>
              <button onClick={startReframe} style={{width:"100%",padding:"12px",background:"linear-gradient(135deg,#4CAF50,#2196F3)",border:"none",borderRadius:8,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer"}}>Begin Reframing →</button>
            </div>
          )}

          {phase === "reframe" && (
            <div>
              <div style={{marginBottom:16}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:11,color:"#64748B",textTransform:"uppercase",letterSpacing:1}}>Reframe Progress</span>
                  <span style={{fontSize:11,color:"#64748B"}}>{reframedZones.length}/{reframeQueue.length} zones</span>
                </div>
                <div style={{height:4,background:"#E2E8F0",borderRadius:2}}>
                  <div style={{height:4,background:"linear-gradient(90deg,#4CAF50,#9C27B0,#2196F3)",borderRadius:2,width:`${progress}%`,transition:"width 0.5s"}}/>
                </div>
              </div>
              {loading && <div style={{textAlign:"center",padding:"30px 0",color:"#9C27B0",fontSize:13}}>{loadingMsg}</div>}
              {!loading && currentZone && EDGY[currentZone] && (()=>{
                const c=ec(currentZone);
                return (
                  <div>
                    <div style={{background:"#fff",border:`1px solid ${c.border}`,borderLeft:`3px solid ${c.hex}`,borderRadius:8,padding:"10px 14px",marginBottom:16}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{width:8,height:8,borderRadius:"50%",background:c.hex}}/>
                        <span style={{fontSize:13,fontWeight:700,color:c.text}}>{currentZone}</span>
                        <span style={{fontSize:10,color:"#94A3B8"}}>— Blind spot perspective</span>
                      </div>
                      <div style={{fontSize:11,color:"#94A3B8",marginTop:3}}>{ZONE_DESC[currentZone]||""}</div>
                    </div>
                    {currentQuestions.map((q,i)=>(
                      <div key={i} style={{marginBottom:14}}>
                        <label style={{fontSize:12,color:"#334155",display:"block",marginBottom:6,lineHeight:1.6,fontStyle:"italic"}}>{q}</label>
                        <textarea value={currentAnswers[i]} onChange={e=>{const a=[...currentAnswers];a[i]=e.target.value;setCurrentAnswers(a);}} rows={3} placeholder="Your answer..." style={{...inp,resize:"vertical",fontSize:12}}/>
                      </div>
                    ))}
                    <button onClick={handleZoneSubmit} style={{width:"100%",padding:"11px",background:c.hex,border:"none",borderRadius:8,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer"}}>
                      {reframedZones.length+1<reframeQueue.length?"Next Zone →":"Generate Solution Narrative →"}
                    </button>
                  </div>
                );
              })()}
            </div>
          )}

          {phase === "generating" && <div style={{textAlign:"center",padding:"40px 0",color:"#2196F3",fontSize:14}}><div style={{fontSize:32,marginBottom:12}}>✦</div>{loadingMsg}</div>}

          {phase === "done" && (
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{fontSize:14,fontWeight:600,color:"#1E293B"}}>Solution Narrative</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  <button onClick={generateSummary} disabled={loadingSummary} style={{fontSize:11,color:"#fff",background:"linear-gradient(135deg,#4CAF50,#2196F3)",border:"none",borderRadius:6,padding:"5px 12px",cursor:loadingSummary?"default":"pointer",fontWeight:600,opacity:loadingSummary?0.7:1}}>{loadingSummary?"Summarising…":"⚡ Key Insights & Actions"}</button>
                  <button onClick={generatePDF} style={{fontSize:11,color:"#fff",background:"linear-gradient(135deg,#E63946,#2196F3)",border:"none",borderRadius:6,padding:"5px 12px",cursor:"pointer",fontWeight:600}}>⬇ Export Report</button>
                </div>
              </div>
              {summary && (
                <div style={{background:"#F0FDF4",border:"1px solid #4CAF50",borderLeft:"4px solid #4CAF50",borderRadius:8,padding:"14px 16px",marginBottom:14}}>
                  <div style={{fontSize:12,fontWeight:700,color:"#2E7D32",marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>⚡ Key Insights & Actions</div>
                  <div style={{fontSize:12,color:"#334155",lineHeight:1.8,whiteSpace:"pre-wrap"}}>{summary}</div>
                </div>
              )}
              <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:8,padding:16,fontSize:12,color:"#334155",lineHeight:1.9,whiteSpace:"pre-wrap"}}>{narrative}</div>
            </div>
          )}
        </div>
      </div>

      <div style={{width:"50%",display:"flex",flexDirection:"column",background:"#fff",overflow:"hidden"}}>
        <div style={{padding:"14px 20px",borderBottom:"1px solid #E2E8F0"}}>
          <div style={{fontSize:11,color:"#94A3B8",textTransform:"uppercase",letterSpacing:1}}>Unstuckify Canvas</div>
        </div>
        <div style={{flex:1,padding:"16px",overflowY:"auto",display:"flex",flexDirection:"column",gap:12}}>
          <VennCanvas zoneData={zoneData} pertinent={pertinent} reframedZones={reframedZones} activeZone={phase==="reframe"&&!loading?currentZone:null}/>
          {Object.keys(zoneData).length>0 && (
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
              {[...pertinent,...reframedZones].filter(z=>EDGY[z]).map(zone=>{
                const items=zoneData[zone]||[],c=ec(zone),isReframed=reframedZones.includes(zone);
                return (
                  <div key={zone} style={{background:c.light,borderRadius:6,padding:"8px 10px",border:`1px solid ${c.border}44`,borderLeft:`3px solid ${c.hex}`}}>
                    <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:4}}>
                      <div style={{width:6,height:6,borderRadius:"50%",background:c.hex}}/>
                      <span style={{fontSize:10,fontWeight:700,color:c.text,textTransform:"uppercase",letterSpacing:0.5}}>{zone}</span>
                      {isReframed?<span style={{marginLeft:"auto",fontSize:9,color:"#4CAF50",fontWeight:600}}>✓ reframed</span>:<span style={{marginLeft:"auto",fontSize:9,color:"#FF9800",fontWeight:600}}>● original</span>}
                    </div>
                    {items.map((it,i)=><div key={i} style={{fontSize:10,color:c.text,lineHeight:1.5}}>• {it}</div>)}
                  </div>
                );
              })}
            </div>
          )}
          {Object.keys(zoneData).length===0 && (
            <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:"#CBD5E1",fontSize:12,gap:8,minHeight:200}}>
              <div style={{fontSize:36}}>⬡</div>
              <div>Canvas will populate after decomposition</div>
            </div>
          )}
        </div>
      </div>

      {showReport && reportSections && (()=>{
        const {framingData,reframeData,date}=reportSections;
        const ZB=({zone,col,desc,elements,qa})=>(
          <div style={{background:"#FAFAFA",borderLeft:`4px solid ${col}`,borderRadius:6,padding:"12px 14px",marginBottom:14}}>
            <div style={{display:"inline-block",background:col,color:"#fff",fontSize:10,fontWeight:700,padding:"2px 10px",borderRadius:4,marginBottom:5,textTransform:"uppercase",letterSpacing:0.5}}>{zone}</div>
            <div style={{fontSize:9,color:"#94A3B8",marginBottom:6}}>{desc}</div>
            {elements.length>0&&<ul style={{paddingLeft:16,marginBottom:8}}>{elements.map((e,i)=><li key={i} style={{fontSize:10,color:"#64748B",marginBottom:2}}>{e}</li>)}</ul>}
            {qa.map((item,i)=>(
              <div key={i} style={{marginBottom:8}}>
                <div style={{fontSize:10,fontWeight:700,fontStyle:"italic",color:col,marginBottom:3,lineHeight:1.5}}>{item.q}</div>
                <div style={{fontSize:10,color:"#475569",lineHeight:1.6,paddingLeft:10,borderLeft:"2px solid #E2E8F0"}}>{item.a||<em>No answer provided</em>}</div>
              </div>
            ))}
          </div>
        );
        const SH=({num,title,col})=>(<div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20,paddingLeft:14,borderLeft:`5px solid ${col}`}}><div style={{width:26,height:26,borderRadius:"50%",background:col,color:"#fff",fontSize:11,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{num}</div><h2 style={{fontSize:16,color:"#1E293B",margin:0}}>{title}</h2></div>);
        return (
          <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,zIndex:9999,display:"flex",flexDirection:"column",background:"#fff",fontFamily:"Arial,sans-serif"}}>
            <div style={{background:"#1E293B",color:"#fff",padding:"10px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
              <span style={{fontSize:13}}>📄 <strong>Unstuckify Report</strong> — Download, open in browser, then Ctrl+P / ⌘+P → Save as PDF</span>
              <div style={{display:"flex",gap:10}}>
                <button onClick={downloadReport} style={{background:"#4CAF50",color:"#fff",border:"none",padding:"6px 16px",borderRadius:6,cursor:"pointer",fontSize:13,fontWeight:600}}>⬇ Download HTML Report</button>
                <button onClick={()=>setShowReport(false)} style={{background:"#E91E63",color:"#fff",border:"none",padding:"6px 14px",borderRadius:6,cursor:"pointer",fontSize:13,fontWeight:600}}>✕ Close</button>
              </div>
            </div>
            <div style={{flex:1,overflowY:"auto",background:"#F1F5F9",padding:"20px"}}>
              <div style={{background:"#F8FAFC",borderLeft:"16px solid #4CAF50",padding:"50px",marginBottom:20}}>
                <div style={{display:"flex",gap:0,marginBottom:28}}>{["#4CAF50","#2196F3","#E91E63","#00BCD4","#FF9800","#9C27B0"].map(c=><span key={c} style={{display:"inline-block",width:26,height:6,background:c}}/>)}</div>
                <h1 style={{fontSize:26,color:"#1E293B",lineHeight:1.2,marginBottom:8}}>Unstuckify<br/>Workbench Report</h1>
                <div style={{fontSize:15,color:"#334155",fontStyle:"italic",margin:"14px 0 8px"}}>{challenge.title}</div>
                <div style={{fontSize:11,color:"#64748B",lineHeight:1.7,maxWidth:480}}>{challenge.description}</div>
                <div style={{marginTop:32,fontSize:9,color:"#94A3B8"}}>Generated: {date} · Inspired by the EDGY framework by Intersection Group</div>
              </div>
              <div style={{background:"#fff",borderRadius:8,padding:"40px 50px",marginBottom:20}}><SH num="1" title="Initial EDGY Framing" col="#4CAF50"/>{decomposition?.summary&&<div style={{background:"#F8FAFC",border:"1px solid #E2E8F0",borderRadius:6,padding:"12px 14px",marginBottom:18,fontSize:11,color:"#475569",lineHeight:1.7}}>{decomposition.summary}</div>}{framingData.map(d=><ZB key={d.zone} {...d}/>)}</div>
              <div style={{background:"#fff",borderRadius:8,padding:"40px 50px",marginBottom:20}}><SH num="2" title="Reframing — Blind Spot Zones" col="#9C27B0"/>{reframeData.map(d=><ZB key={d.zone} {...d}/>)}</div>
              <div style={{background:"#fff",borderRadius:8,padding:"40px 50px",marginBottom:20}}>
                <SH num="3" title="Solution Narrative" col="#2196F3"/>
                {summary&&<div style={{background:"#F0FDF4",border:"1px solid #4CAF50",borderLeft:"4px solid #4CAF50",borderRadius:6,padding:"12px 14px",marginBottom:18}}><div style={{fontSize:11,fontWeight:700,color:"#2E7D32",marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>⚡ Key Insights & Actions</div><div style={{fontSize:11,color:"#334155",lineHeight:1.8,whiteSpace:"pre-wrap"}}>{summary}</div></div>}
                {(narrative||"").split("\n\n").map((p,i)=><p key={i} style={{fontSize:11,color:"#334155",lineHeight:1.9,marginBottom:14}}>{p}</p>)}
              </div>
              <div style={{textAlign:"center",fontSize:9,color:"#94A3B8",padding:"10px 0 30px"}}>Unstuckify Workbench · Inspired by the EDGY Framework by Intersection Group</div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}