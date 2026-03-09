import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Plus, Eye, Settings, Monitor, Smartphone, Layers, Code2,
    Sparkles, Package, Layout, Zap, ExternalLink, Trash2,
    Type, Image as ImageIcon, Hash, ArrowUpRight, Activity,
    CreditCard, Menu, PanelLeft, CheckSquare, Circle,
    BarChart, Table as TableIcon, Grid as GridIcon, Tag, Minus,
    Calendar, Bell, Search, User, LogOut, ChevronRight, ChevronDown,
    Play, Download, Share2, Filter, MoreHorizontal,
    Undo2, Redo2, Copy, ClipboardPaste, Lock, Unlock,
    Move, GripVertical, Palette, AlignLeft, AlignCenter, AlignRight,
    Bold, Italic, MousePointer2, Hand, ZoomIn, ZoomOut,
    ToggleLeft, Columns, Rows, FileText, Globe, Video,
    ListOrdered, Radio, Sliders, Star, Heart, MapPin
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Header from '../components/Header';
import useStore from '../store/useStore';

/* ═══════════════════════════════════════════════════════
   COMPONENT REGISTRY — All draggable components
   ═══════════════════════════════════════════════════════ */
const COMPONENTS = [
  // Layout
  { type:'Container', icon:Layout, label:'Container', cat:'Layout', color:'#6366f1',
    defaults:{ width:'100%', minHeight:'80px', padding:'20px', display:'flex', flexDirection:'column', gap:'12px', background:'rgba(255,255,255,0.02)', borderRadius:'12px', border:'1px solid rgba(255,255,255,0.08)' }, canHaveChildren:true },
  { type:'Grid', icon:GridIcon, label:'Grid', cat:'Layout', color:'#8b5cf6',
    defaults:{ width:'100%', minHeight:'80px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', padding:'16px' }, canHaveChildren:true },
  { type:'Card', icon:CreditCard, label:'Card', cat:'Layout', color:'#ec4899',
    defaults:{ width:'100%', padding:'24px', background:'rgba(15,23,42,0.8)', borderRadius:'16px', border:'1px solid rgba(255,255,255,0.08)', boxShadow:'0 8px 32px rgba(0,0,0,0.3)' }, canHaveChildren:true },
  { type:'Columns', icon:Columns, label:'2 Columns', cat:'Layout', color:'#14b8a6',
    defaults:{ width:'100%', display:'flex', gap:'16px', padding:'0' }, canHaveChildren:true },
  { type:'Hero', icon:Sparkles, label:'Hero Section', cat:'Layout', color:'#f59e0b',
    defaults:{ width:'100%', padding:'80px 40px', background:'linear-gradient(135deg, #4f46e5, #7c3aed)', borderRadius:'20px', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }, canHaveChildren:true },
  { type:'Section', icon:FileText, label:'Section', cat:'Layout', color:'#0ea5e9',
    defaults:{ width:'100%', padding:'48px 24px', display:'flex', flexDirection:'column', gap:'24px' }, canHaveChildren:true },

  // Text
  { type:'Heading', icon:Type, label:'Heading', cat:'Text', color:'#f8fafc',
    defaults:{ content:'Your Heading Here', fontSize:'32px', fontWeight:'800', color:'#ffffff', lineHeight:'1.2' } },
  { type:'Text', icon:AlignLeft, label:'Text Block', cat:'Text', color:'#94a3b8',
    defaults:{ content:'Add your paragraph text here. This is a real editable text block.', fontSize:'15px', color:'#94a3b8', lineHeight:'1.7', maxWidth:'600px' } },
  { type:'Label', icon:Tag, label:'Label', cat:'Text', color:'#22d3ee',
    defaults:{ content:'LABEL', fontSize:'11px', fontWeight:'700', color:'#22d3ee', letterSpacing:'2px', textTransform:'uppercase' } },

  // UI Elements
  { type:'Button', icon:Package, label:'Button', cat:'Elements', color:'#10b981',
    defaults:{ content:'Get Started', background:'linear-gradient(135deg, #6366f1, #a855f7)', color:'#ffffff', padding:'14px 32px', borderRadius:'12px', fontSize:'15px', fontWeight:'700', border:'none', cursor:'pointer', boxShadow:'0 4px 20px rgba(99,102,241,0.4)' } },
  { type:'Input', icon:Hash, label:'Input', cat:'Elements', color:'#f59e0b',
    defaults:{ placeholder:'Type something...', padding:'14px 18px', border:'1px solid rgba(255,255,255,0.12)', borderRadius:'10px', background:'rgba(255,255,255,0.04)', color:'#fff', width:'100%', fontSize:'14px' } },
  { type:'Textarea', icon:AlignLeft, label:'Textarea', cat:'Elements', color:'#a78bfa',
    defaults:{ placeholder:'Enter details...', padding:'14px 18px', border:'1px solid rgba(255,255,255,0.12)', borderRadius:'10px', background:'rgba(255,255,255,0.04)', color:'#fff', width:'100%', fontSize:'14px', minHeight:'100px' } },
  { type:'Image', icon:ImageIcon, label:'Image', cat:'Elements', color:'#ec4899',
    defaults:{ src:'https://images.unsplash.com/photo-1557683316-973673baf926?w=600&q=80', width:'100%', height:'220px', borderRadius:'14px', objectFit:'cover' } },
  { type:'Badge', icon:Star, label:'Badge', cat:'Elements', color:'#10b981',
    defaults:{ content:'New Feature', background:'rgba(16,185,129,0.15)', color:'#10b981', padding:'6px 14px', borderRadius:'20px', fontSize:'11px', fontWeight:'700' } },
  { type:'Divider', icon:Minus, label:'Divider', cat:'Elements', color:'#475569',
    defaults:{ width:'100%', height:'1px', background:'rgba(255,255,255,0.08)', margin:'12px 0' } },
  { type:'Toggle', icon:ToggleLeft, label:'Toggle', cat:'Elements', color:'#6366f1',
    defaults:{ label:'Enable notifications', checked:true } },
  { type:'Avatar', icon:User, label:'Avatar', cat:'Elements', color:'#f97316',
    defaults:{ size:'48px', initials:'KA', background:'linear-gradient(135deg, #f97316, #ef4444)', borderRadius:'50%' } },
  { type:'Icon', icon:Heart, label:'Icon Block', cat:'Elements', color:'#ef4444',
    defaults:{ iconName:'heart', size:'32px', color:'#ef4444' } },

  // Data Display
  { type:'Chart', icon:BarChart, label:'Bar Chart', cat:'Data', color:'#8b5cf6',
    defaults:{ height:'250px', background:'rgba(255,255,255,0.02)', borderRadius:'14px', padding:'20px', border:'1px solid rgba(255,255,255,0.06)' } },
  { type:'Table', icon:TableIcon, label:'Data Table', cat:'Data', color:'#10b981',
    defaults:{ width:'100%', background:'rgba(255,255,255,0.02)', borderRadius:'14px', border:'1px solid rgba(255,255,255,0.06)', columns:4, rows:4 } },
  { type:'StatCard', icon:Activity, label:'Stat Card', cat:'Data', color:'#3b82f6',
    defaults:{ value:'12,450', label:'Total Users', delta:'+12.5%', color:'#3b82f6' } },
  { type:'ProgressBar', icon:Sliders, label:'Progress Bar', cat:'Data', color:'#f59e0b',
    defaults:{ progress:72, color:'#6366f1', height:'8px', borderRadius:'4px', label:'Project Progress' } },

  // Navigation
  { type:'Navbar', icon:Menu, label:'Navbar', cat:'Navigation', color:'#f97316',
    defaults:{ width:'100%', background:'rgba(0,0,0,0.4)', backdropFilter:'blur(20px)', padding:'16px 24px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid rgba(255,255,255,0.06)' } },
  { type:'Footer', icon:Minus, label:'Footer', cat:'Navigation', color:'#64748b',
    defaults:{ width:'100%', background:'rgba(0,0,0,0.3)', padding:'48px 24px', borderTop:'1px solid rgba(255,255,255,0.06)' } },
  { type:'Breadcrumb', icon:ChevronRight, label:'Breadcrumb', cat:'Navigation', color:'#94a3b8',
    defaults:{ items:['Home','Products','Detail'], fontSize:'13px', color:'#94a3b8' } },
];

const CATEGORIES = ['Layout','Text','Elements','Data','Navigation'];
const SCREENS = [
  { label:'Desktop', icon:Monitor, w:'100%' },
  { label:'Tablet', icon:Layers, w:'768px' },
  { label:'Mobile', icon:Smartphone, w:'390px' },
];

/* ═══════════════════════════════════════════════════════
   UNIQUE ID GENERATOR
   ═══════════════════════════════════════════════════════ */
let _cid = 0;
const uid = () => `n_${Date.now()}_${++_cid}`;

/* ═══════════════════════════════════════════════════════
   RENDER A SINGLE COMPONENT ON CANVAS
   ═══════════════════════════════════════════════════════ */
function CanvasNode({ node, nodes, selectedId, onSelect, onDelete, onDrop, onUpdate, isPreview }) {
  const isSelected = selectedId === node.id;
  const children = nodes.filter(n => n.parentId === node.id);
  const def = COMPONENTS.find(c => c.type === node.type);
  const [dropHover, setDropHover] = React.useState(false);

  const style = {};
  Object.keys(node.props).forEach(k => {
    if (!['content','src','placeholder','label','checked','columns','rows','items','value','delta','progress','iconName','initials','size'].includes(k))
      style[k] = node.props[k];
  });

  const handleDragOver = (e) => { if (def?.canHaveChildren) { e.preventDefault(); e.stopPropagation(); setDropHover(true); }};
  const handleDragLeave = () => setDropHover(false);
  const handleDrop = (e) => { e.preventDefault(); e.stopPropagation(); setDropHover(false); onDrop(e, node.id); };

  let inner = null;
  const p = node.props;

  switch(node.type) {
    case 'Heading': inner = <div style={style}>{p.content}</div>; break;
    case 'Text': case 'Label': inner = <div style={style}>{p.content}</div>; break;
    case 'Button': inner = <button style={{...style, cursor:'pointer', border:style.border||'none', display:'inline-flex', alignItems:'center', justifyContent:'center'}}>{p.content}</button>; break;
    case 'Input': inner = <input placeholder={p.placeholder} style={{...style, outline:'none'}} readOnly={!isPreview} />; break;
    case 'Textarea': inner = <textarea placeholder={p.placeholder} style={{...style, outline:'none', resize:'vertical'}} readOnly={!isPreview} />; break;
    case 'Image': inner = <img src={p.src} style={{...style, display:'block'}} alt="content" />; break;
    case 'Badge': inner = <span style={{...style, display:'inline-flex', alignItems:'center'}}>{p.content}</span>; break;
    case 'Divider': inner = <div style={style} />; break;
    case 'Avatar': inner = (
      <div style={{width:p.size, height:p.size, borderRadius:p.borderRadius||'50%', background:p.background, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:'16px'}}>
        {p.initials}
      </div>
    ); break;
    case 'Icon': inner = <Heart size={parseInt(p.size)||32} style={{color:p.color}} />; break;
    case 'Toggle': inner = (
      <div style={{display:'flex', alignItems:'center', gap:12}}>
        <div style={{width:44, height:24, borderRadius:12, background: p.checked ? '#6366f1' : 'rgba(255,255,255,0.1)', padding:2, cursor:'pointer', transition:'all 0.2s'}}
          onClick={() => !isPreview && onUpdate(node.id,'checked',!p.checked)}>
          <div style={{width:20, height:20, borderRadius:10, background:'#fff', transform: p.checked ? 'translateX(20px)' : 'translateX(0)', transition:'all 0.2s'}} />
        </div>
        <span style={{fontSize:13, color:'#94a3b8'}}>{p.label}</span>
      </div>
    ); break;
    case 'StatCard': inner = (
      <div style={{...style, padding:style.padding||'24px'}}>
        <div style={{fontSize:11, color:'#64748b', fontWeight:600, textTransform:'uppercase', letterSpacing:1, marginBottom:8}}>{p.label}</div>
        <div style={{fontSize:32, fontWeight:800, color:'#fff', fontFamily:"'Space Grotesk',sans-serif"}}>{p.value}</div>
        <div style={{fontSize:12, color: p.delta?.startsWith('+') ? '#34d399' : '#f87171', marginTop:6, fontWeight:600}}>{p.delta} from last month</div>
      </div>
    ); break;
    case 'ProgressBar': inner = (
      <div style={{width:'100%'}}>
        {p.label && <div style={{display:'flex', justifyContent:'space-between', marginBottom:8}}><span style={{fontSize:13, color:'#94a3b8'}}>{p.label}</span><span style={{fontSize:13, color:'#fff', fontWeight:700}}>{p.progress}%</span></div>}
        <div style={{width:'100%', height:p.height||'8px', background:'rgba(255,255,255,0.08)', borderRadius:p.borderRadius||'4px', overflow:'hidden'}}>
          <div style={{width:`${p.progress}%`, height:'100%', background:`linear-gradient(90deg, ${p.color}, ${p.color}88)`, borderRadius:'inherit', transition:'width 0.6s ease'}} />
        </div>
      </div>
    ); break;
    case 'Chart': inner = (
      <div style={style}>
        <div style={{fontSize:12, fontWeight:700, color:'#94a3b8', marginBottom:16}}>Revenue Overview</div>
        <div style={{display:'flex', alignItems:'flex-end', gap:6, height:'calc(100% - 40px)'}}>
          {[45,72,38,85,62,90,55,78].map((h,i) => (
            <div key={i} style={{flex:1, display:'flex', flexDirection:'column', justifyContent:'flex-end', height:'100%'}}>
              <motion.div initial={{height:0}} animate={{height:`${h}%`}} transition={{delay:i*0.05, duration:0.5}}
                style={{background:`linear-gradient(180deg, rgba(99,102,241,0.8), rgba(99,102,241,0.3))`, borderRadius:'4px 4px 0 0', minHeight:4}} />
            </div>
          ))}
        </div>
      </div>
    ); break;
    case 'Table': inner = (
      <div style={style}>
        <div style={{display:'flex', padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.03)'}}>
          {['Name','Status','Revenue','Actions'].map((h,i) => <div key={i} style={{flex:1, fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:1}}>{h}</div>)}
        </div>
        {[['Acme Corp','Active','$12,450','...'],['TechFlow','Pending','$8,320','...'],['DataSys','Active','$15,800','...']].map((row,ri) => (
          <div key={ri} style={{display:'flex', padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)', alignItems:'center'}}>
            {row.map((cell,ci) => <div key={ci} style={{flex:1, fontSize:13, color: ci===1 ? (cell==='Active' ? '#34d399' : '#f59e0b') : '#e2e8f0', fontWeight: ci===0 ? 600 : 400}}>{ci===1 ? <span style={{background: cell==='Active' ? 'rgba(52,211,153,0.1)' : 'rgba(245,158,11,0.1)', padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:600}}>{cell}</span> : cell}</div>)}
          </div>
        ))}
      </div>
    ); break;
    case 'Navbar': inner = (
      <div style={style}>
        <div style={{display:'flex', alignItems:'center', gap:10}}>
          <div style={{width:28, height:28, borderRadius:8, background:'linear-gradient(135deg,#6366f1,#a855f7)', display:'flex', alignItems:'center', justifyContent:'center'}}><Zap size={14} color="#fff"/></div>
          <span style={{fontSize:15, fontWeight:800, color:'#fff'}}>Nexus</span>
        </div>
        <div style={{display:'flex', gap:24}}>{['Features','Pricing','Docs','Blog'].map(t => <span key={t} style={{fontSize:13, color:'#94a3b8', fontWeight:500, cursor:'pointer'}}>{t}</span>)}</div>
        <button style={{padding:'8px 20px', borderRadius:8, background:'#6366f1', color:'#fff', border:'none', fontSize:13, fontWeight:600, cursor:'pointer'}}>Sign Up</button>
      </div>
    ); break;
    case 'Footer': inner = (
      <div style={{...style, display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:32}}>
        <div><div style={{fontSize:16, fontWeight:800, color:'#fff', marginBottom:8}}>OmniForge Nexus</div><div style={{fontSize:12, color:'#64748b'}}>© 2026 All rights reserved</div></div>
        <div style={{display:'flex', gap:40}}>{['Product','Company','Legal'].map(g => (
          <div key={g}><div style={{fontSize:11, fontWeight:700, color:'#94a3b8', marginBottom:10, textTransform:'uppercase', letterSpacing:1}}>{g}</div>
            {['Link 1','Link 2','Link 3'].map(l => <div key={l} style={{fontSize:13, color:'#64748b', marginBottom:6, cursor:'pointer'}}>{l}</div>)}</div>
        ))}</div>
      </div>
    ); break;
    case 'Breadcrumb': inner = (
      <div style={{display:'flex', alignItems:'center', gap:8, fontSize:p.fontSize}}>
        {(p.items||[]).map((item,i) => <React.Fragment key={i}>{i > 0 && <ChevronRight size={12} style={{color:'#475569'}}/>}<span style={{color: i === (p.items||[]).length-1 ? '#fff' : '#64748b', fontWeight: i === (p.items||[]).length-1 ? 600 : 400}}>{item}</span></React.Fragment>)}
      </div>
    ); break;
    default:
      if (def?.canHaveChildren) {
        inner = <div style={{...style, position:'relative'}} />;
      } else {
        inner = <div style={style}>{node.type}</div>;
      }
  }

  // Container types render children inside
  if (def?.canHaveChildren) {
    const containerStyle = {...style, position:'relative', transition:'all 0.15s'};
    if (!isPreview && dropHover) { containerStyle.outline = '2px dashed #6366f1'; containerStyle.outlineOffset = '-2px'; containerStyle.background = 'rgba(99,102,241,0.06)'; }

    const containerInner = (
      <div style={containerStyle} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
        {/* Pre-built content for Hero/Navbar/Footer */}
        {node.type === 'Hero' && children.length === 0 && (
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:48, fontWeight:900, color:'#fff', marginBottom:16, lineHeight:1.1}}>Build Something Amazing</div>
            <div style={{fontSize:18, color:'rgba(255,255,255,0.75)', maxWidth:500, margin:'0 auto 32px'}}>The world's most powerful AI-native low-code platform</div>
            <div style={{display:'flex', gap:12, justifyContent:'center'}}>
              <div style={{padding:'14px 32px', background:'#fff', color:'#000', borderRadius:12, fontWeight:700, fontSize:15}}>Get Started</div>
              <div style={{padding:'14px 32px', background:'rgba(255,255,255,0.1)', color:'#fff', borderRadius:12, fontWeight:700, fontSize:15, border:'1px solid rgba(255,255,255,0.2)'}}>Learn More</div>
            </div>
          </div>
        )}
        {node.type === 'Navbar' && children.length === 0 && inner}
        {node.type === 'Footer' && children.length === 0 && inner}
        {children.map(child => <CanvasNode key={child.id} node={child} nodes={nodes} selectedId={selectedId} onSelect={onSelect} onDelete={onDelete} onDrop={onDrop} onUpdate={onUpdate} isPreview={isPreview} />)}
        {!isPreview && children.length === 0 && !['Hero','Navbar','Footer'].includes(node.type) && (
          <div style={{display:'flex', alignItems:'center', justifyContent:'center', minHeight:60, border:'1px dashed rgba(255,255,255,0.08)', borderRadius:8, color:'#334155', fontSize:11, fontWeight:600, letterSpacing:1, textTransform:'uppercase'}}>
            Drop here
          </div>
        )}
      </div>
    );
    inner = containerInner;
  }

  if (isPreview) return <div style={{display:'flex', flexDirection:'column'}}>{inner}</div>;

  return (
    <motion.div layout initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} exit={{opacity:0, scale:0.95}} transition={{duration:0.15}}
      onClick={e => { e.stopPropagation(); onSelect(node.id); }}
      style={{ position:'relative', cursor:'pointer', outline: isSelected ? '2px solid #6366f1' : '1px solid transparent', outlineOffset:2, borderRadius:4, transition:'outline 0.15s' }}
      onMouseEnter={e => { if(!isSelected) e.currentTarget.style.outline = '1px dashed rgba(99,102,241,0.4)'; }}
      onMouseLeave={e => { if(!isSelected) e.currentTarget.style.outline = '1px solid transparent'; }}>
      {isSelected && (
        <div style={{position:'absolute', top:-24, left:0, zIndex:20, display:'flex', alignItems:'center', gap:1}}>
          <div style={{background:'#6366f1', color:'#fff', fontSize:10, padding:'3px 10px', borderRadius:'6px 6px 0 0', fontWeight:700, display:'flex', alignItems:'center', gap:6}}>
            <GripVertical size={10} />{node.type}
          </div>
          <button onClick={e => { e.stopPropagation(); onDelete(node.id); }} style={{background:'#ef4444', color:'#fff', border:'none', padding:'3px 8px', borderRadius:'0 6px 0 0', cursor:'pointer', display:'flex', alignItems:'center'}}><Trash2 size={10}/></button>
        </div>
      )}
      {inner}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   PROPERTY EDITOR PANEL
   ═══════════════════════════════════════════════════════ */
function PropEditor({ node, onUpdate }) {
  if (!node) return null;
  const def = COMPONENTS.find(c => c.type === node.type);
  const p = node.props;
  const keys = Object.keys(p);

  const styleKeys = keys.filter(k => !['content','src','placeholder','label','checked','columns','rows','items','value','delta','progress','iconName','initials'].includes(k));
  const contentKeys = keys.filter(k => ['content','src','placeholder','label','value','delta','initials'].includes(k));

  return (
    <div style={{display:'flex', flexDirection:'column', gap:16}}>
      <div style={{background:'rgba(99,102,241,0.08)', border:'1px solid rgba(99,102,241,0.2)', borderRadius:10, padding:'10px 14px', textAlign:'center'}}>
        <span style={{fontSize:12, fontWeight:700, color:'#a5b4fc'}}>{node.type}</span>
        <span style={{fontSize:10, color:'#6366f1', marginLeft:8}}>#{node.id.slice(-6)}</span>
      </div>

      {contentKeys.length > 0 && (
        <div>
          <div style={{fontSize:10, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:1.5, marginBottom:10}}>Content</div>
          {contentKeys.map(k => (
            <div key={k} style={{marginBottom:10}}>
              <label style={{fontSize:10, color:'#475569', fontWeight:600, display:'block', marginBottom:4, textTransform:'capitalize'}}>{k}</label>
              {k === 'content' || k === 'src' ? (
                <textarea value={p[k]} onChange={e => onUpdate(node.id, k, e.target.value)} rows={k==='content'?2:1}
                  style={{width:'100%', background:'rgba(0,0,0,0.3)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, padding:'8px 10px', fontSize:12, color:'#e2e8f0', outline:'none', resize:'vertical', fontFamily:'inherit'}} />
              ) : (
                <input value={p[k]||''} onChange={e => onUpdate(node.id, k, e.target.value)}
                  style={{width:'100%', background:'rgba(0,0,0,0.3)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, padding:'8px 10px', fontSize:12, color:'#e2e8f0', outline:'none', fontFamily:"'JetBrains Mono',monospace"}} />
              )}
            </div>
          ))}
        </div>
      )}

      <div>
        <div style={{fontSize:10, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:1.5, marginBottom:10}}>Style</div>
        {styleKeys.map(k => (
          <div key={k} style={{marginBottom:8}}>
            <label style={{fontSize:9, color:'#475569', fontWeight:600, display:'block', marginBottom:3, fontFamily:"'JetBrains Mono',monospace"}}>{k}</label>
            <input value={p[k]||''} onChange={e => onUpdate(node.id, k, e.target.value)}
              style={{width:'100%', background:'rgba(0,0,0,0.3)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:6, padding:'6px 8px', fontSize:11, color:'#e2e8f0', outline:'none', fontFamily:"'JetBrains Mono',monospace"}} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   LAYER TREE PANEL
   ═══════════════════════════════════════════════════════ */
function LayerTree({ nodes, selectedId, onSelect }) {
  const roots = nodes.filter(n => !n.parentId);
  const renderNode = (node, depth=0) => {
    const children = nodes.filter(n => n.parentId === node.id);
    const def = COMPONENTS.find(c => c.type === node.type);
    const isSel = selectedId === node.id;
    return (
      <div key={node.id}>
        <div onClick={() => onSelect(node.id)}
          style={{display:'flex', alignItems:'center', gap:6, padding:'5px 8px', paddingLeft:8+depth*14, borderRadius:6, cursor:'pointer',
            background: isSel ? 'rgba(99,102,241,0.15)' : 'transparent', color: isSel ? '#a5b4fc' : '#64748b', fontSize:11, fontWeight:isSel?600:500, transition:'all 0.15s'}}>
          {def && <def.icon size={11} style={{color:def.color, flexShrink:0}}/>}
          <span style={{flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{node.type}</span>
          {children.length > 0 && <span style={{fontSize:9, color:'#475569'}}>{children.length}</span>}
        </div>
        {children.map(c => renderNode(c, depth+1))}
      </div>
    );
  };
  return <div style={{display:'flex', flexDirection:'column', gap:1}}>{roots.map(n => renderNode(n))}</div>;
}

/* ═══════════════════════════════════════════════════════
   MAIN APP BUILDER COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function AppBuilder() {
  const [nodes, setNodes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [view, setView] = useState('canvas');
  const [screen, setScreen] = useState('Desktop');
  const [draggedType, setDraggedType] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [searchFilter, setSearchFilter] = useState('');
  const [expandedCats, setExpandedCats] = useState(CATEGORIES.reduce((a,c) => ({...a,[c]:true}),{}));
  const [rightTab, setRightTab] = useState('props'); // props | layers

  // History
  const pushHistory = useCallback((newNodes) => {
    const h = history.slice(0, historyIdx+1);
    h.push(JSON.stringify(newNodes));
    if (h.length > 50) h.shift();
    setHistory(h);
    setHistoryIdx(h.length-1);
  },[history, historyIdx]);

  const undo = () => { if(historyIdx > 0) { setHistoryIdx(historyIdx-1); setNodes(JSON.parse(history[historyIdx-1])); }};
  const redo = () => { if(historyIdx < history.length-1) { setHistoryIdx(historyIdx+1); setNodes(JSON.parse(history[historyIdx+1])); }};

  const updateNodes = useCallback((newNodes) => { setNodes(newNodes); pushHistory(newNodes); },[pushHistory]);

  // Drag handlers
  const handleDragStart = (e, type) => { setDraggedType(type); e.dataTransfer.effectAllowed = 'copy'; };

  const handleDrop = (e, parentId=null) => {
    e.preventDefault();
    if (!draggedType) return;
    const def = COMPONENTS.find(c => c.type === draggedType);
    if (!def) return;
    const newNode = { id:uid(), type:def.type, parentId, props:{...def.defaults} };
    updateNodes([...nodes, newNode]);
    setSelectedId(newNode.id);
    setDraggedType(null);
  };

  const deleteNode = (id) => {
    const idsToRemove = new Set([id]);
    const findChildren = (pid) => { nodes.filter(n => n.parentId === pid).forEach(c => { idsToRemove.add(c.id); findChildren(c.id); }); };
    findChildren(id);
    updateNodes(nodes.filter(n => !idsToRemove.has(n.id)));
    if (selectedId === id) setSelectedId(null);
  };

  const updateProp = (id, key, val) => { updateNodes(nodes.map(n => n.id === id ? {...n, props:{...n.props, [key]:val}} : n)); };
  const duplicateNode = (id) => {
    const original = nodes.find(n => n.id === id);
    if (!original) return;
    const newNode = {...original, id:uid(), props:{...original.props}};
    updateNodes([...nodes, newNode]);
    setSelectedId(newNode.id);
    toast.success('Component duplicated');
  };

  const selectedNode = nodes.find(n => n.id === selectedId);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.key === 'z') { e.preventDefault(); undo(); }
      if (e.ctrlKey && e.key === 'y') { e.preventDefault(); redo(); }
      if (e.key === 'Delete' && selectedId) { deleteNode(selectedId); }
      if (e.ctrlKey && e.key === 'd' && selectedId) { e.preventDefault(); duplicateNode(selectedId); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  const filteredComps = COMPONENTS.filter(c => !searchFilter || c.label.toLowerCase().includes(searchFilter.toLowerCase()) || c.type.toLowerCase().includes(searchFilter.toLowerCase()));

  // Code gen
  const genCode = () => {
    const renderNode = (node, indent='    ') => {
      const p = node.props;
      const styleEntries = Object.entries(p).filter(([k]) => !['content','src','placeholder','label','checked','columns','rows','items','value','delta','progress','iconName','initials','size'].includes(k));
      const styleStr = styleEntries.map(([k,v]) => `${k}: '${v}'`).join(', ');
      const children = nodes.filter(n => n.parentId === node.id);

      if (['Container','Grid','Card','Columns','Section','Hero'].includes(node.type)) {
        const childJsx = children.map(c => renderNode(c, indent+'  ')).join('\n');
        return `${indent}<div style={{ ${styleStr} }}>\n${childJsx || `${indent}  {/* Add content */}`}\n${indent}</div>`;
      }
      if (node.type === 'Heading' || node.type === 'Text' || node.type === 'Label')
        return `${indent}<div style={{ ${styleStr} }}>${p.content}</div>`;
      if (node.type === 'Button')
        return `${indent}<button style={{ ${styleStr} }}>${p.content}</button>`;
      if (node.type === 'Input')
        return `${indent}<input placeholder="${p.placeholder}" style={{ ${styleStr} }} />`;
      if (node.type === 'Image')
        return `${indent}<img src="${p.src}" style={{ ${styleStr} }} alt="" />`;
      return `${indent}<div style={{ ${styleStr} }}>{/* ${node.type} */}</div>`;
    };

    const roots = nodes.filter(n => !n.parentId);
    let body = roots.map(n => renderNode(n)).join('\n');
    return `import React from 'react';\n\nexport default function App() {\n  return (\n    <div style={{ minHeight: '100vh', background: '#0a0a0f', padding: 24, fontFamily: "'Inter', sans-serif", color: '#fff' }}>\n      <div style={{ maxWidth: 1200, margin: '0 auto' }}>\n${body}\n      </div>\n    </div>\n  );\n}\n`;
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header title="Nexus Low-Code Builder" subtitle="World-class drag & drop — build production-ready UIs in minutes" />

      <div style={{flex:1, display:'flex', overflow:'hidden'}}>
        {/* ══ LEFT: Component Library ══ */}
        <div style={{width:240, flexShrink:0, borderRight:'1px solid rgba(0,212,255,0.08)', background:'linear-gradient(180deg, rgba(4,10,26,0.98), rgba(7,15,36,0.98))', display:'flex', flexDirection:'column', overflow:'hidden'}}>
          <div style={{padding:'12px 12px 8px'}}>
            <div style={{position:'relative'}}>
              <Search size={13} style={{position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#334155'}} />
              <input value={searchFilter} onChange={e => setSearchFilter(e.target.value)} placeholder="Search components..."
                style={{width:'100%', background:'rgba(0,0,0,0.3)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:10, padding:'9px 10px 9px 32px', fontSize:12, color:'#e2e8f0', outline:'none'}} />
            </div>
          </div>
          <div style={{flex:1, overflowY:'auto', padding:'0 8px 12px'}}>
            {CATEGORIES.map(cat => {
              const items = filteredComps.filter(c => c.cat === cat);
              if (items.length === 0) return null;
              return (
                <div key={cat} style={{marginBottom:4}}>
                  <button onClick={() => setExpandedCats(s => ({...s,[cat]:!s[cat]}))}
                    style={{display:'flex', alignItems:'center', gap:6, width:'100%', padding:'8px 6px', background:'none', border:'none', cursor:'pointer', color:'#475569', fontSize:10, fontWeight:700, letterSpacing:2, textTransform:'uppercase'}}>
                    <ChevronRight size={10} style={{transform: expandedCats[cat] ? 'rotate(90deg)' : 'none', transition:'transform 0.15s'}} />{cat}
                    <span style={{marginLeft:'auto', fontSize:9, color:'#334155'}}>{items.length}</span>
                  </button>
                  <AnimatePresence>
                    {expandedCats[cat] && (
                      <motion.div initial={{height:0, opacity:0}} animate={{height:'auto', opacity:1}} exit={{height:0, opacity:0}} transition={{duration:0.15}} style={{overflow:'hidden'}}>
                        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:4, padding:'0 2px 8px'}}>
                          {items.map(comp => (
                            <motion.div key={comp.type} draggable onDragStart={e => handleDragStart(e, comp.type)}
                              whileHover={{scale:1.03, y:-1}} whileTap={{scale:0.97}}
                              style={{display:'flex', flexDirection:'column', alignItems:'center', gap:6, padding:'12px 6px', borderRadius:10, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.04)', cursor:'grab', transition:'all 0.15s'}}
                              onMouseEnter={e => {e.currentTarget.style.borderColor='rgba(99,102,241,0.3)'; e.currentTarget.style.background='rgba(99,102,241,0.06)';}}
                              onMouseLeave={e => {e.currentTarget.style.borderColor='rgba(255,255,255,0.04)'; e.currentTarget.style.background='rgba(255,255,255,0.02)';}}>
                              <div style={{width:28, height:28, borderRadius:8, background:`${comp.color}15`, display:'flex', alignItems:'center', justifyContent:'center'}}>
                                <comp.icon size={13} style={{color:comp.color}} />
                              </div>
                              <span style={{fontSize:10, fontWeight:600, color:'#94a3b8', textAlign:'center', lineHeight:1.2}}>{comp.label}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* ══ CENTER: Canvas / Code / Preview ══ */}
        <div style={{flex:1, display:'flex', flexDirection:'column', overflow:'hidden', background:'#020408'}}>
          {/* Toolbar */}
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 16px', borderBottom:'1px solid rgba(0,212,255,0.06)', background:'rgba(4,10,26,0.9)', backdropFilter:'blur(10px)', flexShrink:0}}>
            <div style={{display:'flex', alignItems:'center', gap:8}}>
              {/* View Toggle */}
              <div style={{display:'flex', padding:3, background:'rgba(0,0,0,0.4)', borderRadius:10, border:'1px solid rgba(255,255,255,0.06)'}}>
                {[{v:'canvas',l:'Canvas'},{v:'code',l:'Code'},{v:'preview',l:'Preview'}].map(({v,l}) => (
                  <button key={v} onClick={() => setView(v)}
                    style={{padding:'6px 14px', borderRadius:8, fontSize:12, fontWeight:600, border:'none', cursor:'pointer', background: view===v ? '#6366f1' : 'transparent', color: view===v ? '#fff' : '#475569', transition:'all 0.15s', boxShadow: view===v ? '0 0 12px rgba(99,102,241,0.3)' : 'none'}}>{l}</button>
                ))}
              </div>
              <div style={{width:1, height:24, background:'rgba(255,255,255,0.06)', margin:'0 4px'}} />
              {/* Screen Size */}
              {SCREENS.map(s => (
                <button key={s.label} onClick={() => setScreen(s.label)}
                  style={{padding:6, borderRadius:8, border:'none', cursor:'pointer', background: screen===s.label ? 'rgba(99,102,241,0.15)' : 'transparent', color: screen===s.label ? '#a5b4fc' : '#475569', display:'flex', alignItems:'center', transition:'all 0.15s'}}>
                  <s.icon size={15} />
                </button>
              ))}
              <div style={{width:1, height:24, background:'rgba(255,255,255,0.06)', margin:'0 4px'}} />
              {/* Undo/Redo */}
              <button onClick={undo} style={{padding:6, borderRadius:6, border:'none', cursor:'pointer', background:'transparent', color: historyIdx > 0 ? '#94a3b8' : '#1e293b', display:'flex'}}><Undo2 size={14}/></button>
              <button onClick={redo} style={{padding:6, borderRadius:6, border:'none', cursor:'pointer', background:'transparent', color: historyIdx < history.length-1 ? '#94a3b8' : '#1e293b', display:'flex'}}><Redo2 size={14}/></button>
            </div>
            <div style={{display:'flex', alignItems:'center', gap:6}}>
              <span style={{fontSize:10, color:'#334155', fontFamily:"'JetBrains Mono', monospace"}}>{nodes.length} components</span>
              {selectedId && <button onClick={() => duplicateNode(selectedId)} style={{padding:'5px 10px', borderRadius:6, border:'1px solid rgba(255,255,255,0.06)', background:'transparent', color:'#94a3b8', fontSize:11, cursor:'pointer', display:'flex', alignItems:'center', gap:4}}><Copy size={11}/>Duplicate</button>}
              <button onClick={() => updateNodes([])} style={{padding:'5px 10px', borderRadius:6, border:'1px solid rgba(239,68,68,0.2)', background:'transparent', color:'#f87171', fontSize:11, cursor:'pointer', display:'flex', alignItems:'center', gap:4}}><Trash2 size={11}/>Clear</button>
            </div>
          </div>

          {/* Canvas */}
          {view === 'canvas' && (
            <div style={{flex:1, overflow:'auto', padding:32, display:'flex', justifyContent:'center'}} onClick={() => setSelectedId(null)}>
              <div
                style={{width:'100%', maxWidth: screen==='Mobile' ? 390 : screen==='Tablet' ? 768 : '100%', minHeight:500, border:'2px dashed rgba(255,255,255,0.06)', borderRadius:20, padding:24, position:'relative', transition:'all 0.3s', background:'rgba(0,0,0,0.2)'}}
                onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor='rgba(99,102,241,0.5)'; e.currentTarget.style.background='rgba(99,102,241,0.03)'; }}
                onDragLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.06)'; e.currentTarget.style.background='rgba(0,0,0,0.2)'; }}
                onDrop={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.06)'; e.currentTarget.style.background='rgba(0,0,0,0.2)'; handleDrop(e); }}>
                {nodes.filter(n => !n.parentId).length === 0 ? (
                  <div style={{position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', pointerEvents:'none', opacity:0.5}}>
                    <div style={{width:64, height:64, borderRadius:'50%', background:'rgba(99,102,241,0.1)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16, border:'1px solid rgba(99,102,241,0.2)'}}>
                      <Plus size={28} style={{color:'#6366f1'}} />
                    </div>
                    <div style={{fontSize:15, fontWeight:700, color:'#e2e8f0', marginBottom:4}}>Drag & Drop Components</div>
                    <div style={{fontSize:12, color:'#475569', maxWidth:300, textAlign:'center', lineHeight:1.6}}>Drag components from the left panel or use Ctrl+D to duplicate</div>
                  </div>
                ) : (
                  <div style={{display:'flex', flexDirection:'column', gap:8}}>
                    <AnimatePresence>
                      {nodes.filter(n => !n.parentId).map(node => (
                        <CanvasNode key={node.id} node={node} nodes={nodes} selectedId={selectedId} onSelect={setSelectedId} onDelete={deleteNode} onDrop={handleDrop} onUpdate={updateProp} isPreview={false} />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Code View */}
          {view === 'code' && (
            <div style={{flex:1, overflow:'auto', padding:24}}>
              <div style={{borderRadius:14, border:'1px solid rgba(255,255,255,0.06)', overflow:'hidden', background:'#0d1117'}}>
                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)', background:'rgba(0,0,0,0.3)'}}>
                  <div style={{display:'flex', alignItems:'center', gap:8}}><Code2 size={14} style={{color:'#a5b4fc'}}/><span style={{fontSize:12, fontWeight:600, color:'#94a3b8', fontFamily:"'JetBrains Mono',monospace"}}>App.jsx</span></div>
                  <span style={{fontSize:9, color:'#334155', textTransform:'uppercase', letterSpacing:2, fontWeight:700}}>Live Generated</span>
                </div>
                <pre style={{padding:24, fontSize:13, lineHeight:1.7, color:'#e2e8f0', overflow:'auto', fontFamily:"'JetBrains Mono',monospace", margin:0}}><code>{genCode()}</code></pre>
              </div>
            </div>
          )}

          {/* Preview */}
          {view === 'preview' && (
            <div style={{flex:1, overflow:'auto', padding:32, display:'flex', justifyContent:'center'}}>
              <div style={{width:'100%', maxWidth: screen==='Mobile' ? 390 : screen==='Tablet' ? 768 : '100%', borderRadius:16, overflow:'hidden', boxShadow:'0 20px 60px rgba(0,0,0,0.8)', border:'1px solid rgba(255,255,255,0.06)'}}>
                <div style={{height:36, background:'#111', display:'flex', alignItems:'center', padding:'0 14px', gap:6, borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                  <div style={{display:'flex', gap:5}}><div style={{width:10, height:10, borderRadius:'50%', background:'#ef4444'}}/><div style={{width:10, height:10, borderRadius:'50%', background:'#f59e0b'}}/><div style={{width:10, height:10, borderRadius:'50%', background:'#22c55e'}}/></div>
                  <div style={{flex:1, textAlign:'center', fontSize:10, color:'#475569', fontFamily:"'JetBrains Mono',monospace"}}>localhost:3000</div>
                </div>
                <div style={{minHeight:500, background:'#0a0a0f', padding:24}}>
                  {nodes.filter(n => !n.parentId).length === 0 ? (
                    <div style={{textAlign:'center', color:'#475569', marginTop:100, fontSize:13}}>Add components to see a live preview</div>
                  ) : (
                    <div style={{display:'flex', flexDirection:'column', gap:8}}>
                      {nodes.filter(n => !n.parentId).map(node => <CanvasNode key={node.id} node={node} nodes={nodes} selectedId={null} onSelect={()=>{}} onDelete={()=>{}} onDrop={()=>{}} onUpdate={()=>{}} isPreview={true} />)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ══ RIGHT: Properties / Layers ══ */}
        <div style={{width:260, flexShrink:0, borderLeft:'1px solid rgba(0,212,255,0.08)', background:'linear-gradient(180deg, rgba(4,10,26,0.98), rgba(7,15,36,0.98))', display:'flex', flexDirection:'column', overflow:'hidden'}}>
          <div style={{display:'flex', borderBottom:'1px solid rgba(255,255,255,0.06)', flexShrink:0}}>
            {[{id:'props', label:'Properties', icon:Settings},{id:'layers', label:'Layers', icon:Layers}].map(tab => (
              <button key={tab.id} onClick={() => setRightTab(tab.id)}
                style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'10px 0', border:'none', borderBottom: rightTab===tab.id ? '2px solid #6366f1' : '2px solid transparent', background:'transparent', color: rightTab===tab.id ? '#a5b4fc' : '#475569', fontSize:11, fontWeight:600, cursor:'pointer', transition:'all 0.15s'}}>
                <tab.icon size={12}/>{tab.label}
              </button>
            ))}
          </div>
          <div style={{flex:1, overflowY:'auto', padding:12}}>
            {rightTab === 'props' ? (
              selectedNode ? <PropEditor node={selectedNode} onUpdate={updateProp} /> : (
                <div style={{textAlign:'center', padding:'40px 16px'}}>
                  <MousePointer2 size={28} style={{color:'#1e293b', margin:'0 auto 12px'}} />
                  <div style={{fontSize:12, color:'#334155', fontWeight:600}}>Select a component</div>
                  <div style={{fontSize:11, color:'#1e293b', marginTop:4}}>Click on any element to edit</div>
                </div>
              )
            ) : (
              <div>
                <div style={{fontSize:10, fontWeight:700, color:'#475569', textTransform:'uppercase', letterSpacing:1.5, marginBottom:10, padding:'0 4px'}}>Component Tree</div>
                {nodes.length > 0 ? <LayerTree nodes={nodes} selectedId={selectedId} onSelect={setSelectedId} /> : (
                  <div style={{textAlign:'center', padding:20, color:'#1e293b', fontSize:11}}>No components yet</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
