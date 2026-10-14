'use client';

import React, { useState } from 'react';
import { 
  Camera, 
  Lock, 
  Server, 
  ShieldAlert, 
  Database, 
  Cloud, 
  Wifi, 
  CheckCircle2, 
  Info,
  Layers,
  Sparkles
} from 'lucide-react';
import { SiteLanguageData } from '@/lib/content';

interface NetworkVisualizerProps {
  lang: 'ar' | 'en';
  data: SiteLanguageData;
  onOpenConsultation: () => void;
}

interface NodeDetail {
  id: string;
  nameAr: string;
  nameEn: string;
  categoryAr: string;
  categoryEn: string;
  protocol: string;
  throughput: string;
  descriptionAr: string;
  descriptionEn: string;
  specs: string[];
}

export default function NetworkVisualizer({ lang, data, onOpenConsultation }: NetworkVisualizerProps) {
  const isAr = lang === 'ar';
  const [selectedNodeId, setSelectedNodeId] = useState<string>('cctv-edge');

  const nodes: Record<string, NodeDetail> = {
    'cctv-edge': {
      id: 'cctv-edge',
      nameAr: 'كاميرات المراقبة الذكية 4K ColorVu',
      nameEn: '4K ColorVu AI IP Cameras',
      categoryAr: 'الطرفيات الميدانية (Edge Devices)',
      categoryEn: 'Field Edge Devices',
      protocol: 'ONVIF Profile S/T, RTSP, H.265+',
      throughput: '8 Mbps per Stream (4K @ 25fps)',
      descriptionAr: 'كاميرات رقمية خارجية وداخلية مزودة بحساسات كشف الحركة، قراءة اللوحات (LPR)، ورؤية ليلية ملونة 24 ساعة.',
      descriptionEn: 'High-definition optical sensors with edge AI algorithms for object classification and Full-Color low light clarity.',
      specs: ['IP67 Weatherproof rating', 'PoE 802.3af/at Power', 'AI Tripwire & Intrusion Alarm'],
    },
    'access-edge': {
      id: 'access-edge',
      nameAr: 'بوابات المرور السريعة والبصمة البيومترية',
      nameEn: 'Biometric Turnstiles & Speed Gates',
      categoryAr: 'الطرفيات الميدانية (Edge Devices)',
      categoryEn: 'Field Edge Devices',
      protocol: 'Wiegand / OSDP / TCP/IP Encrypted',
      throughput: 'Sub-second Verification (<200ms)',
      descriptionAr: 'بوابات زجاجية آلية ومستشعرات بصمة الوجه والكروت الذكية RFID المربوطة بسيرفر الصلاحيات والرواتب.',
      descriptionEn: 'Motorized pedestrian turnstiles and facial recognition terminals synchronized with central HR and attendance servers.',
      specs: ['Fire Alarm Emergency Auto-Open Interlock', 'Anti-Tailgating Sensors', 'Contactless NFC & QR Verification'],
    },
    'core-switch': {
      id: 'core-switch',
      nameAr: 'سويتشات التوزيع المركزية Cisco PoE+',
      nameEn: 'Cisco PoE+ Enterprise Core Switches',
      categoryAr: 'طبقة التوزيع والشبكة (Core Layer)',
      categoryEn: 'Core Distribution Layer',
      protocol: '802.3at PoE+, 802.1Q VLAN, LACP, SNMPv3',
      throughput: '128 Gbps Switching Capacity',
      descriptionAr: 'سويتشات مدارة بالكامل توفر تغذية كهربائية عالية عبر كابلات الشبكة، مع عزل أمني لحركة المرور (VLAN Segmentation).',
      descriptionEn: 'Managed enterprise switches delivering clean inline PoE power with strict VLAN isolation for voice, video, and corporate data.',
      specs: ['VLAN Separation (CCTV vs Corporate)', 'Link Aggregation Redundancy', 'Surge & Electrostatic Protection'],
    },
    'fiber-backbone': {
      id: 'fiber-backbone',
      nameAr: 'عمود الألياف الضوئية الرئيسي (Fiber Backbone)',
      nameEn: 'Multi-Gigabit Fiber Optic Backbone',
      categoryAr: 'طبقة التوزيع والشبكة (Core Layer)',
      categoryEn: 'Core Distribution Layer',
      protocol: '10GBASE-LR / 40GBASE-SR4 Single/Multi-mode',
      throughput: '10 Gbps to 40 Gbps Ultra Low Latency',
      descriptionAr: 'خطوط كابلات فايبر بصرية مصفحة تربط بين المباني والكبائن المختلفة دون أي فقد للإشارة أو تأثر بالمجالات الكهربائية.',
      descriptionEn: 'Armored fiber optic trunks interconnecting campus server racks with zero electromagnetic noise and ultra-fast throughput.',
      specs: ['Armored rodent-resistant jackets', 'Fusion Spliced with < 0.05dB loss', '15-Year Infrastructure Warranty'],
    },
    'nvr-storage': {
      id: 'nvr-storage',
      nameAr: 'سيرفر التسجيل والتخزين المركزي NVR RAID 6',
      nameEn: 'Centralized NVR & RAID 6 Enterprise Storage',
      categoryAr: 'التخزين والتحليل (Storage & Compute)',
      categoryEn: 'Storage & Compute Layer',
      protocol: 'iSCSI, NFS, RAID 6 Redundancy',
      throughput: '640 Mbps Concurrent Ingest',
      descriptionAr: 'أجهزة تسجيل شبكية بمصفوفات هارد ديسك مراقبة معتمدة تضمن عدم ضياع ثانية واحدة حتى في حال تعطل قرصين بالكامل.',
      descriptionEn: 'High-density video recording servers with dual redundant power supplies and dual-drive failure recovery.',
      specs: ['60-90 Days Video Retention', 'Hot-Swappable Enterprise Drives', 'Automated Daily Health Alerts'],
    },
    'firewall-utm': {
      id: 'firewall-utm',
      nameAr: 'الجدار الناري الموحد والتحكم السيبراني',
      nameEn: 'Unified Threat Management (UTM) & Next-Gen Firewall',
      categoryAr: 'الحماية السيبرانية (Security Gateway)',
      categoryEn: 'Cybersecurity Gateway',
      protocol: 'IPsec VPN, SSL Inspection, Zero Trust',
      throughput: '5 Gbps Threat Prevention Engine',
      descriptionAr: 'حماية متقدمة ضد هجمات حجب الخدمة واختراق شبكة الكاميرات مع توفير أنفاق VPN مشفرة للربط الآمن للمديرين.',
      descriptionEn: 'Advanced intrusion defense isolating IoT and surveillance traffic with zero-trust encrypted VPN links for executives.',
      specs: ['Hardware DDoS Filtering', 'Encrypted TLS 1.3 Remote Access', 'Multi-WAN Failover Support'],
    },
    'cloud-erp': {
      id: 'cloud-erp',
      nameAr: 'منظومة ERP وتطبيقات الجوال السحابية',
      nameEn: 'Cloud ERP & Mobile Apps Ecosystem',
      categoryAr: 'طبقة الأعمال السحابية (Enterprise Cloud)',
      categoryEn: 'Enterprise Cloud Layer',
      protocol: 'RESTful API, GraphQL, WebSockets, TLS 1.3',
      throughput: 'Real-time Synchronized Ledger',
      descriptionAr: 'منصة سحابية تدير المخازن، الحسابات، طلبات الصيانة، والربط المعتمد مع بوابة مصلحة الضرائب المصرية (ETA).',
      descriptionEn: 'Scalable cloud ERP coordinating warehouse inventory, financials, and live Egyptian Tax Authority e-Invoicing.',
      specs: ['ETA Egyptian Tax API Integration', 'Native iOS/Android App Sync', 'Daily Offsite Automated Backups'],
    },
  };

  const selectedNode = nodes[selectedNodeId] || nodes['cctv-edge'];

  return (
    <section id="architecture" className="py-24 relative bg-[#071120] border-t border-white/5 cyber-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10233D] border border-[#00F2FE]/25 text-xs font-semibold text-[#00F2FE] mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span>{data.architecture.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            <span>{isAr ? 'الهندسة المتكاملة' : 'Unified Technology'}</span>{' '}
            <span className="text-[#00F2FE]">{isAr ? 'للبنية التحتية' : 'Architecture'}</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg mt-4 leading-relaxed">
            {data.architecture.subtitle}
          </p>

          <p className="text-xs text-[#00F2FE] mt-2 font-mono flex items-center justify-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            <span>{data.architecture.tip}</span>
          </p>
        </div>

        {/* Interactive Schematic Diagram & Inspector */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Interactive Flow Columns (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Layer 1: Edge Devices */}
            <div className="rounded-2xl bg-[#0B1A2F]/90 border border-white/10 p-5 backdrop-blur-md">
              <div className="flex items-center justify-between mb-3 text-xs font-mono font-bold text-slate-400">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00F2FE]" />
                  {isAr ? 'المستوى 1: الطرفيات الميدانية والأنظمة الأمنية' : 'Level 1: Edge Field & Security Devices'}
                </span>
                <span className="text-[#00F2FE]">INPUT NODES</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedNodeId('cctv-edge')}
                  className={`p-4 rounded-xl text-start transition-all border flex items-center gap-3.5 ${
                    selectedNodeId === 'cctv-edge'
                      ? 'bg-[#152C4D] border-[#00F2FE] shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                      : 'bg-[#10233D]/70 border-white/5 hover:border-[#00F2FE]/40'
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-[#071120] border border-[#00F2FE]/30 flex items-center justify-center text-[#00F2FE] shrink-0">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">
                      {isAr ? 'كاميرات 4K ColorVu AI' : '4K ColorVu AI CCTV'}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {isAr ? 'مراقبة محيطية وكشف تسلل' : 'Perimeter Intrusion Optics'}
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedNodeId('access-edge')}
                  className={`p-4 rounded-xl text-start transition-all border flex items-center gap-3.5 ${
                    selectedNodeId === 'access-edge'
                      ? 'bg-[#152C4D] border-[#00F2FE] shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                      : 'bg-[#10233D]/70 border-white/5 hover:border-[#00F2FE]/40'
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-[#071120] border border-[#00F2FE]/30 flex items-center justify-center text-[#00F2FE] shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">
                      {isAr ? 'بوابات المرور وبصمة الوجه' : 'Speed Gates & Biometrics'}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {isAr ? 'تحكم بالصلاحيات والحضور' : 'Access Control & Time/Attendance'}
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Connecting Visual Cable */}
            <div className="flex items-center justify-center">
              <div className="h-6 w-0.5 bg-gradient-to-b from-[#00F2FE] to-[#0284C7] relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#00F2FE] animate-ping" />
              </div>
            </div>

            {/* Layer 2: Core Distribution & Fiber */}
            <div className="rounded-2xl bg-[#0B1A2F]/90 border border-white/10 p-5 backdrop-blur-md">
              <div className="flex items-center justify-between mb-3 text-xs font-mono font-bold text-slate-400">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  {isAr ? 'المستوى 2: التوزيع والشبكة الفائقة' : 'Level 2: Core Distribution & Fiber Backbone'}
                </span>
                <span className="text-cyan-400">TRANSPORT LAYER</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedNodeId('core-switch')}
                  className={`p-4 rounded-xl text-start transition-all border flex items-center gap-3.5 ${
                    selectedNodeId === 'core-switch'
                      ? 'bg-[#152C4D] border-[#00F2FE] shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                      : 'bg-[#10233D]/70 border-white/5 hover:border-[#00F2FE]/40'
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-[#071120] border border-[#00F2FE]/30 flex items-center justify-center text-[#00F2FE] shrink-0">
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">
                      {isAr ? 'سويتشات Cisco PoE+ المركزية' : 'Cisco PoE+ Core Switches'}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {isAr ? 'تقسيم VLAN وتغذية كهربائية' : 'VLAN Security & Power Over Ethernet'}
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedNodeId('fiber-backbone')}
                  className={`p-4 rounded-xl text-start transition-all border flex items-center gap-3.5 ${
                    selectedNodeId === 'fiber-backbone'
                      ? 'bg-[#152C4D] border-[#00F2FE] shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                      : 'bg-[#10233D]/70 border-white/5 hover:border-[#00F2FE]/40'
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-[#071120] border border-[#00F2FE]/30 flex items-center justify-center text-[#00F2FE] shrink-0">
                    <Wifi className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">
                      {isAr ? 'شبكة الألياف الضوئية 10Gbps' : '10Gbps Fiber Trunkline'}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {isAr ? 'نقل فائق السرعة ومقاوم للتداخل' : 'Armored Zero-Loss High-Speed Trunk'}
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Connecting Visual Cable */}
            <div className="flex items-center justify-center">
              <div className="h-6 w-0.5 bg-gradient-to-b from-[#0284C7] to-[#00F2FE]" />
            </div>

            {/* Layer 3: Storage, Firewall & Cloud ERP */}
            <div className="rounded-2xl bg-[#0B1A2F]/90 border border-white/10 p-5 backdrop-blur-md">
              <div className="flex items-center justify-between mb-3 text-xs font-mono font-bold text-slate-400">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  {isAr ? 'المستوى 3: التخزين والأمان والتطبيقات السحابية' : 'Level 3: Storage, Security & Cloud ERP'}
                </span>
                <span className="text-emerald-400">ENTERPRISE HUB</span>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setSelectedNodeId('nvr-storage')}
                  className={`p-3.5 rounded-xl text-start transition-all border flex flex-col gap-2 ${
                    selectedNodeId === 'nvr-storage'
                      ? 'bg-[#152C4D] border-[#00F2FE] shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                      : 'bg-[#10233D]/70 border-white/5 hover:border-[#00F2FE]/40'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#071120] border border-[#00F2FE]/30 flex items-center justify-center text-[#00F2FE]">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">
                      {isAr ? 'سيرفر NVR RAID 6' : 'NVR RAID 6 Storage'}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {isAr ? 'تخزين مشفر آمن' : 'Dual Drive Redundancy'}
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedNodeId('firewall-utm')}
                  className={`p-3.5 rounded-xl text-start transition-all border flex flex-col gap-2 ${
                    selectedNodeId === 'firewall-utm'
                      ? 'bg-[#152C4D] border-[#00F2FE] shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                      : 'bg-[#10233D]/70 border-white/5 hover:border-[#00F2FE]/40'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#071120] border border-[#00F2FE]/30 flex items-center justify-center text-[#00F2FE]">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">
                      {isAr ? 'الجدار الناري UTM' : 'Next-Gen Firewall'}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {isAr ? 'حماية من الهجمات و VPN' : 'VPN & Threat Defense'}
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedNodeId('cloud-erp')}
                  className={`p-3.5 rounded-xl text-start transition-all border flex flex-col gap-2 ${
                    selectedNodeId === 'cloud-erp'
                      ? 'bg-[#152C4D] border-[#00F2FE] shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                      : 'bg-[#10233D]/70 border-white/5 hover:border-[#00F2FE]/40'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#071120] border border-[#00F2FE]/30 flex items-center justify-center text-[#00F2FE]">
                    <Cloud className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">
                      {isAr ? 'منظومة Odoo ERP' : 'Odoo ERP & ETA Tax'}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {isAr ? 'الفاتورة وتطبيقات الجوال' : 'Egyptian Tax API & Apps'}
                    </p>
                  </div>
                </button>
              </div>
            </div>

          </div>

          {/* Node Inspector Sidebar (4 Cols) */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="rounded-2xl bg-gradient-to-b from-[#10233D] to-[#0A1A2F] border border-[#00F2FE]/30 p-6 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <span className="text-[11px] font-mono text-[#00F2FE] uppercase font-bold tracking-wider">
                  NODE SPECIFICATION
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    {isAr ? selectedNode.categoryAr : selectedNode.categoryEn}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5 leading-snug">
                    {isAr ? selectedNode.nameAr : selectedNode.nameEn}
                  </h3>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {isAr ? selectedNode.descriptionAr : selectedNode.descriptionEn}
                </p>

                {/* Technical Protocol & Throughput Box */}
                <div className="space-y-2.5 p-3.5 rounded-xl bg-[#071120] border border-white/5 font-mono text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block uppercase">
                      {isAr ? 'البروتوكولات المدعومة:' : 'Protocols:'}
                    </span>
                    <span className="text-[#00F2FE] font-bold text-[11px]">
                      {selectedNode.protocol}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block uppercase">
                      {isAr ? 'سعة ومعدل النقل:' : 'Throughput / Speed:'}
                    </span>
                    <span className="text-white font-bold text-[11px]">
                      {selectedNode.throughput}
                    </span>
                  </div>
                </div>

                {/* Specific Engineering Checklist */}
                <div>
                  <h4 className="text-xs font-bold text-slate-200 mb-2">
                    {isAr ? 'المعايير الهندسية المنفذة:' : 'Implemented Engineering Standards:'}
                  </h4>
                  <div className="space-y-1.5">
                    {selectedNode.specs.map((sp, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00F2FE] shrink-0" />
                        <span>{sp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Action */}
                <button
                  onClick={onOpenConsultation}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00F2FE] to-[#0284C7] text-[#071120] font-bold text-xs shadow-[0_0_15px_rgba(0,242,254,0.3)] hover:shadow-[0_0_20px_rgba(0,242,254,0.5)] transition-all flex items-center justify-center gap-2 mt-4"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isAr ? 'طلب معاينة لتصميم هذه المعمارية' : 'Consult on this Architecture'}</span>
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
