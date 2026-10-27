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
import { useTheme } from '@/components/ThemeProvider';

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
  const { isDark } = useTheme();
  const [selectedNodeId, setSelectedNodeId] = useState<string>('cctv-edge');

  const nodes: Record<string, NodeDetail> = {
    'cctv-edge': {
      id: 'cctv-edge',
      nameAr: 'كاميرات المراقبة الذكية 4K ColorVu',
      nameEn: '4K ColorVu AI IP Cameras',
      categoryAr: 'الطرفيات الميدانية (Edge Devices)',
      categoryEn: 'Field Edge Devices',
      protocol: 'RTSP, RTP, H.265+, TCP/IP',
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
      protocol: 'Wiegand / RS-485 / TCP/IP Encrypted',
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
      nameAr: 'كوابل الألياف الضوئية Armored Fiber 10Gbps',
      nameEn: 'Armored 10Gbps Optical Fiber Backbone',
      categoryAr: 'طبقة التوزيع والشبكة (Core Layer)',
      categoryEn: 'Core Distribution Layer',
      protocol: '10GBASE-LR Single Mode, 1310nm SFP+',
      throughput: '10,000 Mbps Ultra-low Latency',
      descriptionAr: 'مسارات كابلات فايبر مدرعة تربط بين المباني وغرف الاتصالات الرئيسية، منيعة ضد التشويش الكهرومغناطيسي وفقدان الإشارة.',
      descriptionEn: 'Heavy-duty armored single-mode fiber connecting main data centers, immune to EMI interference and extreme temperatures.',
      specs: ['Single-Mode 9/125um Core', 'Zero Electrical Interference (EMI)', 'Corning Certified Optical Glass'],
    },
    'nvr-storage': {
      id: 'nvr-storage',
      nameAr: 'وحدات التسجيل الشبكي NVR & Storage RAID',
      nameEn: 'Enterprise NVR & RAID 6 SAN Storage',
      categoryAr: 'الأمان والتطبيقات (Security & ERP Hub)',
      categoryEn: 'Security & ERP Hub Layer',
      protocol: 'iSCSI, SMB 3.0, RAID 5/6 Fault Tolerance',
      throughput: '64 Channels Real-time Rec + Hot Spare',
      descriptionAr: 'سيرفرات تسجيل عملاقة بمصفوفة أقراص متكررة تضمن عدم ضياع ثانية واحدة من التسجيلات حتى في حال تعطل أحد الأقراص.',
      descriptionEn: 'Dual-controller recording chassis with enterprise hard drives for continuous 60-day footage retention and zero-drop recording.',
      specs: ['Hot-Swappable HDD Trays', 'Redundant Power Supplies (1+1)', 'Encrypted Video Export with Watermark'],
    },
    'firewall-utm': {
      id: 'firewall-utm',
      nameAr: 'الجدار الناري الموحد UTM & VPN Gateway',
      nameEn: 'Next-Gen UTM Firewall & IPS Gateway',
      categoryAr: 'الأمان والتطبيقات (Security & ERP Hub)',
      categoryEn: 'Security & ERP Hub Layer',
      protocol: 'IPsec / SSL VPN, IPS, Deep Packet Inspection',
      throughput: '4 Gbps Threat Protection Throughput',
      descriptionAr: 'بوابة الحماية السيبرانية من الاختراقات، تتيح للمديرين متابعة الكاميرات والأنظمة من خارج الشركة عبر نفق VPN آمن ومشفر.',
      descriptionEn: 'Unified threat management providing strict intrusion prevention, geo-blocking, and bank-grade remote mobile tunneling.',
      specs: ['Hardware-Accelerated IPsec VPN', 'Real-time Botnet & DDoS Shield', 'Dual WAN Automated Failover'],
    },
    'cloud-erp': {
      id: 'cloud-erp',
      nameAr: 'منظومة Odoo ERP وتطبيقات الإدارة السحابية',
      nameEn: 'Odoo ERP Cloud Hub & ETA e-Invoice',
      categoryAr: 'الأمان والتطبيقات (Security & ERP Hub)',
      categoryEn: 'Security & ERP Hub Layer',
      protocol: 'RESTful API, GraphQL, WebSockets, TLS 1.3',
      throughput: 'Real-time Synchronized Ledger',
      descriptionAr: 'منصة سحابية تدير المخازن، الحسابات، طلبات الصيانة، والربط المعتمد مع بوابة مصلحة الضرائب المصرية (ETA).',
      descriptionEn: 'Scalable cloud ERP coordinating warehouse inventory, financials, and live Egyptian Tax Authority e-Invoicing.',
      specs: ['ETA Egyptian Tax API Integration', 'Native iOS/Android App Sync', 'Daily Offsite Automated Backups'],
    },
  };

  const selectedNode = nodes[selectedNodeId] || nodes['cctv-edge'];

  return (
    <section 
      id="architecture" 
      className={`py-24 relative border-t transition-colors duration-300 ${
        isDark 
          ? 'bg-[#071120] border-white/5 cyber-grid' 
          : 'bg-[#F8FAFC] border-slate-200 cyber-grid'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div 
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold mb-4 border ${
              isDark 
                ? 'bg-[#10233D] border-[#00F2FE]/25 text-[#00F2FE]' 
                : 'bg-sky-50 border-sky-200 text-[#0284C7]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{data.architecture.badge}</span>
          </div>

          <h2 
            className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            <span>{isAr ? 'الهندسة المتكاملة' : 'Unified Technology'}</span>{' '}
            <span className={isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}>
              {isAr ? 'للبنية التحتية' : 'Architecture'}
            </span>
          </h2>

          <p 
            className={`text-base sm:text-lg mt-4 leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            {data.architecture.subtitle}
          </p>

          <p 
            className={`text-xs mt-2 font-mono flex items-center justify-center gap-1.5 font-bold ${
              isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>{data.architecture.tip}</span>
          </p>
        </div>

        {/* Interactive Schematic Diagram & Inspector */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Interactive Flow Columns (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Layer 1: Edge Devices */}
            <div 
              className={`rounded-2xl p-5 border backdrop-blur-md ${
                isDark 
                  ? 'bg-[#0B1A2F]/90 border-white/10' 
                  : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div 
                className={`flex items-center justify-between mb-3 text-xs font-mono font-bold ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-500" />
                  {isAr ? 'المستوى 1: الطرفيات الميدانية والأنظمة الأمنية' : 'Level 1: Edge Field & Security Devices'}
                </span>
                <span className={isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}>INPUT NODES</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedNodeId('cctv-edge')}
                  className={`p-4 rounded-xl text-start transition-all border flex items-center gap-3.5 cursor-pointer ${
                    selectedNodeId === 'cctv-edge'
                      ? isDark
                        ? 'bg-[#152C4D] border-[#00F2FE] shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                        : 'bg-sky-50 border-[#0284C7] ring-2 ring-[#0284C7]/20 shadow-sm'
                      : isDark
                        ? 'bg-[#10233D]/70 border-white/5 hover:border-[#00F2FE]/40'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div 
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                      isDark 
                        ? 'bg-[#071120] border-[#00F2FE]/30 text-[#00F2FE]' 
                        : 'bg-white border-sky-200 text-[#0284C7] shadow-sm'
                    }`}
                  >
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 
                      className={`text-sm font-bold leading-tight ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {isAr ? 'كاميرات 4K ColorVu AI' : '4K ColorVu AI CCTV'}
                    </h4>
                    <p 
                      className={`text-[11px] mt-0.5 ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      {isAr ? 'مراقبة محيطية وكشف تسلل' : 'Perimeter Intrusion Optics'}
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedNodeId('access-edge')}
                  className={`p-4 rounded-xl text-start transition-all border flex items-center gap-3.5 cursor-pointer ${
                    selectedNodeId === 'access-edge'
                      ? isDark
                        ? 'bg-[#152C4D] border-[#00F2FE] shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                        : 'bg-sky-50 border-[#0284C7] ring-2 ring-[#0284C7]/20 shadow-sm'
                      : isDark
                        ? 'bg-[#10233D]/70 border-white/5 hover:border-[#00F2FE]/40'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div 
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                      isDark 
                        ? 'bg-[#071120] border-[#00F2FE]/30 text-[#00F2FE]' 
                        : 'bg-white border-sky-200 text-[#0284C7] shadow-sm'
                    }`}
                  >
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 
                      className={`text-sm font-bold leading-tight ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {isAr ? 'بوابات المرور وبصمة الوجه' : 'Speed Gates & Biometrics'}
                    </h4>
                    <p 
                      className={`text-[11px] mt-0.5 ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      {isAr ? 'تحكم بالصلاحيات والحضور' : 'Access Control & Time/Attendance'}
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Connecting Visual Cable */}
            <div className="flex items-center justify-center">
              <div className="h-6 w-0.5 bg-gradient-to-b from-[#0284C7] to-cyan-400 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              </div>
            </div>

            {/* Layer 2: Core Distribution & Fiber */}
            <div 
              className={`rounded-2xl p-5 border backdrop-blur-md ${
                isDark 
                  ? 'bg-[#0B1A2F]/90 border-white/10' 
                  : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div 
                className={`flex items-center justify-between mb-3 text-xs font-mono font-bold ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-500" />
                  {isAr ? 'المستوى 2: التوزيع والشبكة الفائقة' : 'Level 2: Core Distribution & Fiber Backbone'}
                </span>
                <span className={isDark ? 'text-cyan-400' : 'text-[#0284C7]'}>TRANSPORT LAYER</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedNodeId('core-switch')}
                  className={`p-4 rounded-xl text-start transition-all border flex items-center gap-3.5 cursor-pointer ${
                    selectedNodeId === 'core-switch'
                      ? isDark
                        ? 'bg-[#152C4D] border-[#00F2FE] shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                        : 'bg-sky-50 border-[#0284C7] ring-2 ring-[#0284C7]/20 shadow-sm'
                      : isDark
                        ? 'bg-[#10233D]/70 border-white/5 hover:border-[#00F2FE]/40'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div 
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                      isDark 
                        ? 'bg-[#071120] border-[#00F2FE]/30 text-[#00F2FE]' 
                        : 'bg-white border-sky-200 text-[#0284C7] shadow-sm'
                    }`}
                  >
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 
                      className={`text-sm font-bold leading-tight ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {isAr ? 'سويتشات Cisco PoE+ المركزية' : 'Cisco PoE+ Core Switches'}
                    </h4>
                    <p 
                      className={`text-[11px] mt-0.5 ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      {isAr ? 'تقسيم VLAN وتغذية كهربائية' : 'VLAN Security & Power Over Ethernet'}
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedNodeId('fiber-backbone')}
                  className={`p-4 rounded-xl text-start transition-all border flex items-center gap-3.5 cursor-pointer ${
                    selectedNodeId === 'fiber-backbone'
                      ? isDark
                        ? 'bg-[#152C4D] border-[#00F2FE] shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                        : 'bg-sky-50 border-[#0284C7] ring-2 ring-[#0284C7]/20 shadow-sm'
                      : isDark
                        ? 'bg-[#10233D]/70 border-white/5 hover:border-[#00F2FE]/40'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div 
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                      isDark 
                        ? 'bg-[#071120] border-[#00F2FE]/30 text-[#00F2FE]' 
                        : 'bg-white border-sky-200 text-[#0284C7] shadow-sm'
                    }`}
                  >
                    <Wifi className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 
                      className={`text-sm font-bold leading-tight ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {isAr ? 'شبكة الألياف الضوئية 10Gbps' : '10Gbps Fiber Trunkline'}
                    </h4>
                    <p 
                      className={`text-[11px] mt-0.5 ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      {isAr ? 'نقل فائق السرعة ومقاوم للتداخل' : 'Armored Zero-Loss High-Speed Trunk'}
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Connecting Visual Cable */}
            <div className="flex items-center justify-center">
              <div className="h-6 w-0.5 bg-gradient-to-b from-[#0284C7] to-emerald-400" />
            </div>

            {/* Layer 3: Storage, Firewall & Cloud ERP */}
            <div 
              className={`rounded-2xl p-5 border backdrop-blur-md ${
                isDark 
                  ? 'bg-[#0B1A2F]/90 border-white/10' 
                  : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div 
                className={`flex items-center justify-between mb-3 text-xs font-mono font-bold ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {isAr ? 'المستوى 3: التخزين والأمان والتطبيقات السحابية' : 'Level 3: Storage, Security & Cloud ERP'}
                </span>
                <span className="text-emerald-500 font-bold">ENTERPRISE HUB</span>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setSelectedNodeId('nvr-storage')}
                  className={`p-3.5 rounded-xl text-start transition-all border flex flex-col gap-2 cursor-pointer ${
                    selectedNodeId === 'nvr-storage'
                      ? isDark
                        ? 'bg-[#152C4D] border-[#00F2FE] shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                        : 'bg-sky-50 border-[#0284C7] ring-2 ring-[#0284C7]/20 shadow-sm'
                      : isDark
                        ? 'bg-[#10233D]/70 border-white/5 hover:border-[#00F2FE]/40'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div 
                    className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                      isDark 
                        ? 'bg-[#071120] border-[#00F2FE]/30 text-[#00F2FE]' 
                        : 'bg-white border-sky-200 text-[#0284C7] shadow-sm'
                    }`}
                  >
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 
                      className={`text-xs font-bold leading-tight ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {isAr ? 'سيرفر NVR RAID 6' : 'NVR RAID 6 Storage'}
                    </h4>
                    <p 
                      className={`text-[10px] mt-0.5 ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      {isAr ? 'تخزين مشفر آمن' : 'Dual Drive Redundancy'}
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedNodeId('firewall-utm')}
                  className={`p-3.5 rounded-xl text-start transition-all border flex flex-col gap-2 cursor-pointer ${
                    selectedNodeId === 'firewall-utm'
                      ? isDark
                        ? 'bg-[#152C4D] border-[#00F2FE] shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                        : 'bg-sky-50 border-[#0284C7] ring-2 ring-[#0284C7]/20 shadow-sm'
                      : isDark
                        ? 'bg-[#10233D]/70 border-white/5 hover:border-[#00F2FE]/40'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div 
                    className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                      isDark 
                        ? 'bg-[#071120] border-[#00F2FE]/30 text-[#00F2FE]' 
                        : 'bg-white border-sky-200 text-[#0284C7] shadow-sm'
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 
                      className={`text-xs font-bold leading-tight ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {isAr ? 'الجدار الناري UTM' : 'Next-Gen Firewall'}
                    </h4>
                    <p 
                      className={`text-[10px] mt-0.5 ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      {isAr ? 'حماية من الهجمات و VPN' : 'VPN & Threat Defense'}
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedNodeId('cloud-erp')}
                  className={`p-3.5 rounded-xl text-start transition-all border flex flex-col gap-2 cursor-pointer ${
                    selectedNodeId === 'cloud-erp'
                      ? isDark
                        ? 'bg-[#152C4D] border-[#00F2FE] shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                        : 'bg-sky-50 border-[#0284C7] ring-2 ring-[#0284C7]/20 shadow-sm'
                      : isDark
                        ? 'bg-[#10233D]/70 border-white/5 hover:border-[#00F2FE]/40'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div 
                    className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                      isDark 
                        ? 'bg-[#071120] border-[#00F2FE]/30 text-[#00F2FE]' 
                        : 'bg-white border-sky-200 text-[#0284C7] shadow-sm'
                    }`}
                  >
                    <Cloud className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 
                      className={`text-xs font-bold leading-tight ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {isAr ? 'منظومة Odoo ERP' : 'Odoo ERP & ETA Tax'}
                    </h4>
                    <p 
                      className={`text-[10px] mt-0.5 ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      {isAr ? 'الفاتورة وتطبيقات الجوال' : 'Egyptian Tax API & Apps'}
                    </p>
                  </div>
                </button>
              </div>
            </div>

          </div>

          {/* Node Inspector Sidebar (4 Cols) */}
          <div className="lg:col-span-4 sticky top-24">
            <div 
              className={`rounded-2xl p-6 shadow-xl border backdrop-blur-xl ${
                isDark 
                  ? 'bg-gradient-to-b from-[#10233D] to-[#0A1A2F] border-[#00F2FE]/30' 
                  : 'bg-white border-slate-200 shadow-[0_4px_30px_rgba(15,23,42,0.08)]'
              }`}
            >
              <div 
                className={`flex items-center justify-between pb-3 border-b mb-4 ${
                  isDark ? 'border-white/10' : 'border-slate-100'
                }`}
              >
                <span 
                  className={`text-[11px] font-mono uppercase font-bold tracking-wider ${
                    isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'
                  }`}
                >
                  NODE SPECIFICATION
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="space-y-4">
                <div>
                  <span 
                    className={`text-[10px] font-mono uppercase font-semibold ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    {isAr ? selectedNode.categoryAr : selectedNode.categoryEn}
                  </span>
                  <h3 
                    className={`text-lg font-bold mt-0.5 leading-snug ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {isAr ? selectedNode.nameAr : selectedNode.nameEn}
                  </h3>
                </div>

                <p 
                  className={`text-xs leading-relaxed ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {isAr ? selectedNode.descriptionAr : selectedNode.descriptionEn}
                </p>

                {/* Technical Protocol & Throughput Box */}
                <div 
                  className={`space-y-2.5 p-3.5 rounded-xl font-mono text-xs border ${
                    isDark 
                      ? 'bg-[#071120] border-white/5' 
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div>
                    <span 
                      className={`text-[10px] block uppercase font-medium ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      {isAr ? 'البروتوكولات المدعومة:' : 'Protocols:'}
                    </span>
                    <span 
                      className={`font-bold text-[11px] ${
                        isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'
                      }`}
                    >
                      {selectedNode.protocol}
                    </span>
                  </div>
                  <div>
                    <span 
                      className={`text-[10px] block uppercase font-medium ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      {isAr ? 'سعة ومعدل النقل:' : 'Throughput / Speed:'}
                    </span>
                    <span 
                      className={`font-bold text-[11px] ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {selectedNode.throughput}
                    </span>
                  </div>
                </div>

                {/* Specific Engineering Checklist */}
                <div>
                  <h4 
                    className={`text-xs font-bold mb-2 ${
                      isDark ? 'text-slate-200' : 'text-slate-800'
                    }`}
                  >
                    {isAr ? 'المعايير الهندسية المنفذة:' : 'Implemented Engineering Standards:'}
                  </h4>
                  <div className="space-y-1.5">
                    {selectedNode.specs.map((sp, idx) => (
                      <div 
                        key={idx} 
                        className={`flex items-center gap-2 text-xs font-medium ${
                          isDark ? 'text-slate-300' : 'text-slate-700'
                        }`}
                      >
                        <CheckCircle2 
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'
                          }`} 
                        />
                        <span>{sp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Action */}
                <button
                  onClick={onOpenConsultation}
                  className={`w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer shadow-md ${
                    isDark
                      ? 'bg-gradient-to-r from-[#00F2FE] to-[#0284C7] text-[#071120] hover:shadow-[0_0_20px_rgba(0,242,254,0.4)]'
                      : 'bg-[#0284C7] hover:bg-[#0369A1] text-white'
                  }`}
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
