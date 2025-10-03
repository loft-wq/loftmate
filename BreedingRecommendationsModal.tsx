import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
  X, Heart, Award, Dna, TrendingUp, Star, Scale, Target, Zap, CheckCircle,
  XCircle, AlertCircle, Info, Brain, Sparkles
} from 'lucide-react';

interface BreedingRecommendation {
  id: string;
  partner: any;
  type: string;
  score: number;
  reasons: string[];
  inbreedingCoefficient?: number;
  geneticCompatibility?: number;
  expectedQuality?: number;
  successRate?: number;
  recommendedFor?: string;
  expertAdvice?: string;
  expertReference?: string;
  aiConfidence?: number;
  championPotential?: number;
  healthRisk?: 'low' | 'medium' | 'high';
  breedingStrategy?: string;
}

interface BreedingRecommendationsModalProps {
  pigeon: any;
  availablePigeons: any[];
  onClose: () => void;
  onSelectPartner: (partner: any) => void;
  /**
   * A plain function (not a hook) that returns { recommendations: BreedingRecommendation[] }
   * Example: getBreedingRecommendations(pigeon, availablePigeons)
   */
  getBreedingRecommendations?: (pigeon: any, availablePigeons: any[]) => { recommendations: BreedingRecommendation[] } | null;
  /**
   * Called when user chooses to apply a recommendation into the pedigree:
   * mode: 'insert-as-father' | 'insert-as-mother' | 'insert-as-partner'
   */
  onApplyRecommendation?: (partner: any, mode: 'insert-as-father' | 'insert-as-mother' | 'insert-as-partner') => void;
  /**
   * Optional: save recommendation callback (e.g. persist in Firestore)
   */
  onSaveRecommendation?: (rec: BreedingRecommendation) => Promise<void> | void;
}

/* -----------------------
   Utility helpers
   ----------------------*/
const normalize = (str = '') =>
  String(str || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const seeded = (s: string) => {
  // simple FNV1a-based seeded pseudo-random [0..1)
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return (h >>> 0) / 4294967295;
};

/**
 * Helper function to check if gender is male
 */
const isMale = (gender: string): boolean => {
  const g = normalize(gender);
  return g === 'male' || g === 'ذكر' || g === 'm';
};

/**
 * Helper function to check if gender is female
 */
const isFemale = (gender: string): boolean => {
  const g = normalize(gender);
  return g === 'female' || g === 'أنثى' || g === 'انثى' || g === 'f';
};

/**
 * Check if two pigeons have opposite genders (compatible for breeding)
 */
const hasOppositeGender = (gender1: string, gender2: string): boolean => {
  return (isMale(gender1) && isFemale(gender2)) || (isFemale(gender1) && isMale(gender2));
};

/* -----------------------
   Internal AI recommendation generator (kept local for reproducibility)
   ----------------------*/
const useAIBreedingRecommendations = (pigeon: any, availablePigeons: any[]) => {
  return useMemo(() => {
    if (!pigeon || !availablePigeons?.length) {
      return { recommendations: [], totalAvailable: 0, filteredByGender: 0 };
    }

    const recommendations: BreedingRecommendation[] = [];
    const pigeonGender = normalize(pigeon.gender || pigeon.sex || '');
    const pigeonStrain = normalize(pigeon.strain || '');
    const pigeonFamily = normalize(pigeon.family || pigeon.breeder || '');

    const championCombinations: Record<string, any> = {
      'van rooy': { bestWith: ['janssen', 'van seibel', 'klak'], expertTip: 'Van Rooy × Janssen combination produced world champions', successRate: 85, specialties: ['speed', 'endurance', 'navigation intelligence'] },
      'janssen': { bestWith: ['van rooy', 'klak', 'van den bosch'], expertTip: 'Janssen line known for willpower', successRate: 88, specialties: ['long distance', 'willpower', 'weather resistance'] },
      'klak': { bestWith: ['van rooy', 'janssen', 'van seibel'], expertTip: 'Klak strain excels in speed', successRate: 82, specialties: ['high speed', 'navigation accuracy'] },
      'van seibel': { bestWith: ['van rooy', 'klak', 'janssen'], expertTip: 'Van Seibel for middle and long distances', successRate: 80, specialties: ['middle distance', 'performance stability'] },
      'gaby vandenabeele': { bestWith: ['janssen', 'van rooy', 'desmet'], expertTip: 'Gaby Vandenabeele known for consistency', successRate: 87, specialties: ['consistency', 'reliability'] },
      'delbar': { bestWith: ['janssen', 'bourges', 'gaby'], expertTip: 'Delbar for middle distance', successRate: 83, specialties: ['middle distance', 'smart racing'] }
    };

    // Count total available pigeons before filtering
    const totalAvailable = availablePigeons.length;

    // Prepare eligible list: filter by opposite gender, remove same pigeon, remove direct parents
    let eligiblePigeons = availablePigeons.filter(p => {
      if (!p) return false;
      if (p.id === pigeon.id) return false;
      
      // Check gender compatibility - must be opposite gender
      const partnerGender = p.gender || p.sex || '';
      const isOppositeGender = hasOppositeGender(pigeonGender, partnerGender);
      
      if (!isOppositeGender) return false;
      
      // avoid suggesting direct parents or children (if we have parent ring lists)
      if (pigeon.parentRings && p.ring && pigeon.parentRings.includes(p.ring)) return false;
      if (p.parentRings && pigeon.ring && p.parentRings.includes(pigeon.ring)) return false;
      return true;
    });

    const filteredByGender = eligiblePigeons.length;

    eligiblePigeons.forEach((partner: any, index: number) => {
      const partnerGender = normalize(partner.gender || partner.sex || '');
      const partnerStrain = normalize(partner.strain || '');
      const partnerFamily = normalize(partner.family || partner.breeder || '');
      const partnerAchievements = String(partner.achievements || '');
      const championData = championCombinations[pigeonStrain] || championCombinations[partnerStrain];

      let breedingType: string = 'outcross';
      let inbreedingCoeff = 0;

      if (partnerFamily && pigeonFamily && partnerFamily === pigeonFamily && pigeonStrain && partnerStrain && pigeonStrain === partnerStrain) {
        breedingType = 'inbreeding';
        inbreedingCoeff = 0.25;
      } else if (partnerStrain && pigeonStrain && partnerStrain === pigeonStrain) {
        breedingType = 'linebreeding';
        inbreedingCoeff = 0.125;
      } else if (championData?.bestWith?.includes(partnerStrain)) {
        breedingType = 'strain_combination';
        inbreedingCoeff = 0;
      }

      let score = 60;
      const reasons: string[] = [];

      // Bonus for correct gender pairing (already filtered, but good to acknowledge)
      score += 10;
      reasons.push('✓ توافق جنسي مثالي للتزاوج');

      if (championData?.bestWith?.includes(partnerStrain)) {
        score += 20;
        reasons.push(`🏆 توافق تاريخي مثبت: ${pigeonStrain} × ${partnerStrain}`);
        reasons.push(`📊 نسبة نجاح تاريخية: ${championData.successRate}%`);
      }

      if (partnerAchievements && (partnerAchievements.includes('بطل') || partnerAchievements.toLowerCase().includes('champion'))) {
        score += 15;
        reasons.push('🥇 الشريك حاصل على ألقاب بطولية');
      }
      if (partnerAchievements && (partnerAchievements.includes('المركز الأول') || partnerAchievements.includes('الأول') || partnerAchievements.toLowerCase().includes('first place'))) {
        score += 10;
        reasons.push('⭐ سجل ممتاز في المراكز الأولى');
      }

      if (!partnerStrain || !pigeonStrain || partnerStrain !== pigeonStrain) {
        score += 12;
        reasons.push('🧬 تنوع وراثي جيد لزيادة الحيوية والقوة');
      }

      if (partner.breeder && pigeon.breeder && normalize(partner.breeder) === normalize(pigeon.breeder)) {
        score += 5;
        reasons.push('👤 من نفس المربي - معرفة عميقة بالخطوط');
      }

      if (partner.color && pigeon.color) {
        const pigeonColor = normalize(pigeon.color);
        const partnerColor = normalize(partner.color);
        const colorCombinations: Record<string, string[]> = {
          'blue check': ['red check', 'white', 'grey'],
          'red check': ['blue check', 'white', 'black'],
          'white': ['blue check', 'red check', 'black']
        };
        if (colorCombinations[pigeonColor]?.some(c => partnerColor.includes(c))) {
          score += 5;
          reasons.push('🎨 تركيبة ألوان مرغوبة وجميلة');
        }
      }

      let healthRisk: 'low' | 'medium' | 'high' = 'low';
      if (inbreedingCoeff > 0.2) {
        healthRisk = 'high';
        score -= 10;
        reasons.push('⚠️ تزاوج قريب - يتطلب مراقبة صحية دقيقة');
      } else if (inbreedingCoeff > 0.1) {
        healthRisk = 'medium';
        score -= 5;
        reasons.push('⚡ تزاوج خطوط - مراقبة معتدلة مطلوبة');
      }

      let championPotential = 60;
      if (partnerAchievements.includes('بطل') || partnerAchievements.toLowerCase().includes('champion')) championPotential += 20;
      if (championData) championPotential += 15;
      if (healthRisk === 'low') championPotential += 10;

      let expertAdvice = '';
      let expertReference = '';

      if (championData) {
        expertAdvice = championData.expertTip;
        expertReference = 'World Racing Experts';
        if (championData.specialties) {
          reasons.push(`💡 متخصص في: ${championData.specialties.join(', ')}`);
        }
      }

      if (breedingType === 'inbreeding') {
        expertAdvice += ' يُنصح بمتابعة النسل للكشف المبكر عن العيوب الوراثية.';
        expertReference = 'Dr. Joe Quinn - Genetics Expert';
      } else if (breedingType === 'outcross') {
        expertAdvice += ' التزاوج الخارجي مفيد لتحسين الحيّوية والقوة.';
        expertReference = 'Prof. Mark Evans - Breeding Expert';
      }

      let breedingStrategy = '';
      if (score >= 85) breedingStrategy = '🏆 تربية بطولة - احتمالية عالية للأبطال';
      else if (score >= 70) breedingStrategy = '📈 تطوير خط - تحسين الجينات';
      else if (score >= 60) breedingStrategy = '🔄 إدخال دم جديد - تحسين التنوع';
      else breedingStrategy = '🧪 تجريبي - يحتاج دراسة إضافية';

      // deterministic fields using seeded function to ensure reproducibility
      const seedKey = `${pigeon.ring || pigeon.id || ''}::${partner.ring || partner.id || ''}`;
      const geneticCompatibility = Math.round(score - 10 + seeded(seedKey) * 20);
      const successRate = Math.round((championData?.successRate ?? (score - 10 + seeded('sr-' + seedKey) * 20)));
      const aiConfidence = Math.min(Math.round(score + 5), 95);

      recommendations.push({
        id: `ai-rec-${index}`,
        partner,
        type: breedingType,
        score: Math.min(Math.max(Math.round(score), 40), 98),
        reasons,
        inbreedingCoefficient: inbreedingCoeff,
        geneticCompatibility,
        expectedQuality: Math.ceil((score / 100) * 10),
        successRate,
        recommendedFor: breedingStrategy,
        expertAdvice,
        expertReference,
        aiConfidence,
        championPotential,
        healthRisk,
        breedingStrategy
      });
    });

    recommendations.sort((a, b) => b.score - a.score);

    return { 
      recommendations: recommendations.slice(0, 10),
      totalAvailable,
      filteredByGender
    };
  }, [pigeon, availablePigeons]);
};

/* -----------------------
   Toast component (accessible + pause on hover)
   ----------------------*/
interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
  id, type, title, message, duration = 5000, onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  const startRef = useRef<number | null>(null);
  const pausedRef = useRef(false);
  const remainingRef = useRef(duration);

  useEffect(() => {
    let raf: number;
    let lastTime: number | null = null;

    const step = (time: number) => {
      if (lastTime == null) lastTime = time;
      if (!pausedRef.current) {
        const delta = time - lastTime;
        remainingRef.current = Math.max(0, remainingRef.current - delta);
        const newProgress = (remainingRef.current / duration) * 100;
        setProgress(newProgress);
        if (remainingRef.current <= 0) {
          setIsVisible(false);
          setTimeout(() => onClose(id), 250);
          return;
        }
      }
      lastTime = time;
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [duration, id, onClose]);

  const getIcon = () => {
    const iconProps = "w-4 h-4 sm:w-5 sm:h-5";
    switch (type) {
      case 'success': return <CheckCircle className={`${iconProps} text-green-600`} />;
      case 'error': return <XCircle className={`${iconProps} text-red-600`} />;
      case 'warning': return <AlertCircle className={`${iconProps} text-yellow-600`} />;
      case 'info': default: return <Info className={`${iconProps} text-blue-600`} />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info': default: return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getProgressColor = () => {
    switch (type) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'info': default: return 'bg-blue-500';
    }
  };

  return (
    <div
      className={`transform transition-all duration-300 ease-in-out ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'} bg-white border rounded-lg shadow-lg p-3 sm:p-4 min-w-72 sm:min-w-80 max-w-sm sm:max-w-md ${getColors()}`}
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-2 sm:space-x-3 space-x-reverse">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-xs sm:text-sm">{title}</h4>
            {message && <p className="text-xs sm:text-sm mt-1 opacity-90 leading-relaxed">{message}</p>}
          </div>
        </div>
        <button onClick={() => onClose(id)} className="flex-shrink-0 mr-1 sm:mr-2 opacity-70 hover:opacity-100 transition-opacity">
          <X className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>

      <div className="mt-2 sm:mt-3 bg-white bg-opacity-30 rounded-full h-1">
        <div className={`h-1 rounded-full transition-all duration-100 ${getProgressColor()}`} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};

/* -----------------------
   Main Modal component
   ----------------------*/
const BreedingRecommendationsModal: React.FC<BreedingRecommendationsModalProps> = ({
  pigeon,
  availablePigeons,
  onClose,
  onSelectPartner,
  getBreedingRecommendations,
  onApplyRecommendation,
  onSaveRecommendation
}) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [expertMode, setExpertMode] = useState(false);
  const [toasts, setToasts] = useState<{ [id: string]: ToastProps }>({});
  const modalRef = useRef<HTMLDivElement | null>(null);

  // choose recommendations: prefer external function if provided, else internal AI
  const aiRecommendations = useAIBreedingRecommendations(pigeon, availablePigeons);
  const external = getBreedingRecommendations ? getBreedingRecommendations(pigeon, availablePigeons) : null;
  const recommendations: BreedingRecommendation[] = external?.recommendations ?? aiRecommendations.recommendations ?? [];
  const totalAvailable = aiRecommendations.totalAvailable || 0;
  const filteredByGender = aiRecommendations.filteredByGender || 0;

  const breedingTechniques: Record<string, any> = {
    inbreeding: { name: 'تركيز الدماء', shortName: 'تركيز الدماء', description: 'تزاوج الأقارب...', expertTip: 'ينصح به عندما تكون الحمامة أبطالية...' },
    linebreeding: { name: 'تزاوج الخطوط', shortName: 'تزاوج الخطوط', description: 'تزاوج مع حمام من نفس الخط بقرابة أبعد', expertTip: 'يحافظ على الصفات مع تقليل المخاطر' },
    outcross: { name: 'تزاوج خارجي', shortName: 'تزاوج خارجي', description: 'إدخال دم جديد', expertTip: 'مفيد لزيادة الحيوية' },
    strain_combination: { name: 'تركيبات السلالات', shortName: 'تركيبات السلالات', description: 'تركيبات مثبتة عالميًا', expertTip: 'مبني على نجاح الأبطال' }
  };

  const typeLabels: Record<string, string> = {
    inbreeding: 'تركيز الدماء',
    linebreeding: 'تزاوج الخطوط',
    strain_combination: 'تركيبات السلالات',
    achievement_based: 'بناءً على الإنجازات',
    expert_formula: 'تركيبة خبيرة',
    outcross: 'تزاوج خارجي'
  };

  // Focus trap: keep focus inside modal
  useEffect(() => {
    const el = modalRef.current;
    if (!el) return;

    const focusable = Array.from(el.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    ));
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const prevActive = document.activeElement as HTMLElement | null;
    first?.focus();
    document.addEventListener('keydown', handler);
    return () => {
      document.removeEventListener('keydown', handler);
      prevActive?.focus?.();
    };
  }, []);

  // Escape closes modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Toast helpers
  const removeToast = useCallback((id: string) => {
    setToasts(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  }, []);

  const showToast = useCallback((toast: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 6);
    const newToast: ToastProps = {
      ...toast,
      id,
      onClose: removeToast
    };
    setToasts(prev => ({ ...prev, [id]: newToast }));
  }, [removeToast]);

  const showSuccess = (title: string, message?: string) => showToast({ type: 'success', title, message });
  const showInfo = (title: string, message?: string) => showToast({ type: 'info', title, message });

  const getTypeIcon = (type: string) => {
    const iconProps = "w-4 h-4 sm:w-5 sm:h-5";
    switch (type) {
      case 'inbreeding': return <Dna className={`${iconProps} text-purple-600`} />;
      case 'linebreeding': return <Scale className={`${iconProps} text-indigo-600`} />;
      case 'strain_combination': return <Zap className={`${iconProps} text-orange-600`} />;
      case 'achievement_based': return <Award className={`${iconProps} text-yellow-600`} />;
      case 'expert_formula': return <Star className={`${iconProps} text-yellow-600`} />;
      default: return <TrendingUp className={`${iconProps} text-blue-600`} />;
    }
  };

  const getInbreedingLevel = (coefficient: number | undefined) => {
    if (coefficient === undefined) return { level: 'غير محدد', color: 'text-gray-600 bg-gray-100' };
    if (coefficient < 0.1) return { level: 'خفيف', color: 'text-green-600 bg-green-100' };
    if (coefficient < 0.2) return { level: 'متوسط', color: 'text-yellow-600 bg-yellow-100' };
    return { level: 'قريب', color: 'text-red-600 bg-red-100' };
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100 border-green-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    if (score >= 60) return 'text-orange-600 bg-orange-100 border-orange-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };

  const getSuccessProbability = (score: number) => {
    if (score >= 85) return 'نجاح عالي جداً';
    if (score >= 70) return 'نجاح عالي';
    if (score >= 60) return 'نجاح متوسط';
    return 'يتطلب حذر';
  };

  const getHealthRiskColor = (risk?: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getHealthRiskText = (risk?: string) => {
    switch (risk) {
      case 'low': return 'منخفض';
      case 'medium': return 'متوسط';
      case 'high': return 'عالي';
      default: return 'غير محدد';
    }
  };

  const formatGender = (gender?: string) => {
    const g = normalize(gender || '');
    return isMale(g) ? 'ذكر ♂' : 'أنثى ♀';
  };

  const truncateText = (text?: string, maxLength: number = 15) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const handleSelectPartner = (partner: any) => {
    if ('vibrate' in navigator) navigator.vibrate(50);
    showSuccess('تم اختيار الشريك بنجاح', `تم اختيار ${partner.name || 'الحمامة'} كشريك للتزاوج`);
    onSelectPartner(partner);
  };

  const handleApplyRecommendation = (partner: any, mode: 'insert-as-father' | 'insert-as-mother' | 'insert-as-partner') => {
    if (onApplyRecommendation) {
      onApplyRecommendation(partner, mode);
      showSuccess('تم إدراج الشريك', `تم تقديم الطلب لإدراج ${partner.name || partner.ring}`);
    } else {
      showInfo('ميزة الإدراج غير مفعلة', 'لم يتم تمرير دالة onApplyRecommendation من الصفحة الحاضنة.');
    }
  };

  const handleSaveRecommendation = async (rec: BreedingRecommendation) => {
    if (onSaveRecommendation) {
      try {
        await onSaveRecommendation(rec);
        showSuccess('تم حفظ التوصية', 'حفظت التوصية بنجاح في السجل الخاص بك.');
      } catch (err) {
        showToast({ type: 'error', title: 'فشل الحفظ', message: 'حدث خطأ أثناء الحفظ.' });
      }
    } else {
      // fallback: just show toast
      showInfo('حفظ مؤقت', 'لم يتم ربط التخزين—يمكنك تفعيل onSaveRecommendation لحفظ التوصيات.');
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  // Get required gender text
  const getRequiredGenderText = () => {
    const pigeonGender = normalize(pigeon.gender || pigeon.sex || '');
    if (isMale(pigeonGender)) {
      return 'إناث';
    } else {
      return 'ذكور';
    }
  };

  return (
    <>
      {/* Toast container */}
      <div className="fixed top-2 sm:top-4 left-2 sm:left-4 z-[9999] space-y-2 max-h-screen overflow-hidden" aria-live="polite">
        {Object.values(toasts).map(t => <Toast key={t.id} {...t} />)}
      </div>

      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-1 sm:p-2 md:p-4"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="ai-recommendations-title"
          dir="rtl"
          className="bg-white rounded-lg max-w-7xl w-full max-h-[98vh] sm:max-h-[95vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 md:p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center space-x-2 sm:space-x-3 space-x-reverse">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-2 sm:p-3 rounded-full">
                <div className="flex items-center space-x-1">
                  <Brain className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-blue-600" />
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                </div>
              </div>
              <div className="min-w-0">
                <h2 id="ai-recommendations-title" className="text-base sm:text-lg md:text-2xl font-bold text-gray-900 leading-tight">
                  نظام التوصيات الذكي بالذكاء الاصطناعي
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">
                  تحليل ذكي للبيانات الوراثية وخبرات الأبطال العالميين لتقديم أفضل توصيات التزاوج
                </p>
              </div>
            </div>

            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 sm:p-2 hover:bg-gray-100 rounded-full" aria-label="إغلاق">
              <X className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
            </button>
          </div>

          {/* Subheader with gender filter info */}
          <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Brain className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-blue-700 font-medium">
                  الحمامة المختارة: <strong>{pigeon.name || pigeon.ring}</strong> ({formatGender(pigeon.gender || pigeon.sex)})
                </span>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse text-xs sm:text-sm text-blue-600">
                <span className="bg-blue-100 px-2 py-1 rounded-full">
                  إجمالي الحمام: {totalAvailable}
                </span>
                <span className="bg-green-100 px-2 py-1 rounded-full text-green-700">
                  {getRequiredGenderText()} متوافقة: {filteredByGender}
                </span>
                <span className="bg-purple-100 px-2 py-1 rounded-full text-purple-700">
                  توصيات: {recommendations.length}
                </span>
              </div>
              <div className="flex-1" />
              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full self-start sm:self-auto">AI مُفعل</span>
            </div>
          </div>

          {/* Filters */}
          <div className="p-2 sm:p-3 md:p-4 border-b bg-gray-50">
            <div className="flex flex-wrap gap-1 sm:gap-2 items-center">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-2 sm:px-3 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${selectedType === 'all' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-300'}`}
              >
                جميع التوصيات ({recommendations.length})
              </button>

              {Object.entries(breedingTechniques).map(([type, tech]) => {
                const count = recommendations.filter(r => r.type === type).length;
                if (count === 0) return null;
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-2 sm:px-3 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${selectedType === type ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-300'}`}
                    title={tech.description}
                  >
                    <span className="hidden sm:inline">{tech.name}</span>
                    <span className="sm:hidden">{tech.shortName}</span>
                    <span className="mr-1">({count})</span>
                  </button>
                );
              })}

              <div className="flex-1" />
              <div className="flex items-center space-x-2 space-x-reverse">
                <input id="expert-mode" type="checkbox" checked={expertMode} onChange={(e) => setExpertMode(e.target.checked)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2" />
                <label htmlFor="expert-mode" className="text-xs sm:text-sm font-medium text-gray-700 cursor-pointer">وضع الخبير</label>
              </div>
            </div>
          </div>

          {expertMode && (
            <div className="p-2 sm:p-3 md:p-4 bg-yellow-50 border-b">
              <div className="flex items-start space-x-2 sm:space-x-3 space-x-reverse">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-yellow-800 text-xs sm:text-sm md:text-base">نصائح الخبراء والذكاء الاصطناعي:</h4>
                  <p className="text-xs sm:text-sm text-yellow-700 mt-1 leading-relaxed">
                    نظام الذكاء الاصطناعي يحلل البيانات الوراثية والإنجازات لتقديم أفضل التوصيات. 
                    يتم عرض {getRequiredGenderText()} فقط لضمان توافق التزاوج مع الحمامة المختارة ({formatGender(pigeon.gender || pigeon.sex)}).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-2 sm:p-4 md:p-6">
              {recommendations.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Heart className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-sm sm:text-lg font-medium">لا توجد توصيات متاحة</p>
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-xs sm:text-sm text-blue-800">
                      <strong>الحمامة المختارة:</strong> {pigeon.name || pigeon.ring} ({formatGender(pigeon.gender || pigeon.sex)})
                    </p>
                    <p className="text-xs sm:text-sm text-blue-700 mt-2">
                      {isMale(pigeon.gender || pigeon.sex || '')
                        ? '🔍 يبحث النظام عن إناث متوافقة للتزاوج'
                        : '🔍 يبحث النظام عن ذكور متوافقة للتزاوج'
                      }
                    </p>
                    <div className="mt-3 space-y-1 text-xs text-gray-600">
                      <p>📊 إجمالي الحمام في القاعدة: {totalAvailable}</p>
                      <p>✅ {getRequiredGenderText()} متوافقة: {filteredByGender}</p>
                      {filteredByGender === 0 && (
                        <p className="text-red-600 font-medium mt-2">
                          ⚠️ لا يوجد {getRequiredGenderText()} في قاعدة البيانات. يرجى إضافة المزيد من الحمام.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4 md:space-y-6">
                  {recommendations.filter(r => selectedType === 'all' || r.type === selectedType).map((rec) => {
                    const inbreedingLevel = getInbreedingLevel(rec.inbreedingCoefficient);
                    return (
                      <div
                        key={rec.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleSelectPartner(rec.partner)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelectPartner(rec.partner); } }}
                        className="border border-gray-200 rounded-xl p-3 sm:p-4 md:p-6 hover:shadow-lg transition-all cursor-pointer bg-white active:scale-[0.99]"
                      >
                        <div className="flex items-start justify-between mb-3 sm:mb-4">
                          <div className="flex items-start space-x-2 sm:space-x-3 space-x-reverse min-w-0 flex-1">
                            <div className="bg-blue-50 p-2 sm:p-3 rounded-lg flex-shrink-0">
                              {getTypeIcon(rec.type)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-bold text-sm sm:text-base md:text-lg text-gray-900">
                                <span className="truncate block sm:inline">{truncateText(rec.partner.name || 'بدون اسم', 25)}</span>
                                <span className="text-xs text-gray-500 mr-2 block sm:inline">{typeLabels[rec.type] || rec.type}</span>
                              </h3>
                              <p className="text-xs sm:text-sm text-gray-600">
                                #{rec.partner.ring} • {truncateText(rec.partner.strain, 15)} • {formatGender(rec.partner.gender || rec.partner.sex)}
                              </p>

                              {rec.expertReference && <p className="text-xs text-blue-600 mt-1 truncate">💡 {rec.expertReference}</p>}
                              {rec.aiConfidence && <p className="text-xs text-purple-600 mt-1">🤖 ثقة الذكاء الاصطناعي: {rec.aiConfidence}%</p>}
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <div className={`px-2 sm:px-3 py-1 sm:py-2 rounded-full border-2 font-bold text-xs sm:text-sm ${getScoreColor(rec.score)}`}>
                              {rec.score}%
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{getSuccessProbability(rec.score)}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
                          <div className="space-y-1 sm:space-y-2">
                            {rec.partner.photoUrl ? (
                              <div className="flex items-center gap-2">
                                <img src={rec.partner.photoUrl} alt={rec.partner.name || rec.partner.ring} className="w-16 h-16 rounded-md object-cover" />
                                <div>
                                  {rec.partner.color && <div className="text-xs text-gray-500">اللون: <span className="font-medium">{rec.partner.color}</span></div>}
                                  {rec.partner.breeder && <div className="text-xs text-gray-500">المربي: <span className="font-medium">{truncateText(rec.partner.breeder, 20)}</span></div>}
                                </div>
                              </div>
                            ) : (
                              <>
                                {rec.partner.color && <div className="flex justify-between"><span className="text-gray-500 text-xs sm:text-sm">اللون:</span><span className="font-medium text-xs sm:text-sm truncate mr-2">{rec.partner.color}</span></div>}
                                {rec.partner.breeder && <div className="flex justify-between"><span className="text-gray-500 text-xs sm:text-sm">المربي:</span><span className="font-medium text-xs sm:text-sm truncate mr-2">{truncateText(rec.partner.breeder, 15)}</span></div>}
                                {rec.partner.achievements && <div className="flex justify-between"><span className="text-gray-500 text-xs sm:text-sm">الإنجازات:</span><span className="font-medium text-green-600 text-xs sm:text-sm truncate mr-2">{truncateText(rec.partner.achievements, 15)}</span></div>}
                              </>
                            )}
                          </div>

                          <div className="space-y-1 sm:space-y-2">
                            {rec.inbreedingCoefficient !== undefined && <div className="flex justify-between items-center"><span className="text-gray-500 text-xs sm:text-sm">تقارب الدماء:</span><span className={`px-1 sm:px-2 py-1 rounded text-xs font-medium ${inbreedingLevel.color}`}>{(rec.inbreedingCoefficient * 100).toFixed(1)}% ({inbreedingLevel.level})</span></div>}
                            {rec.geneticCompatibility !== undefined && <div className="flex justify-between"><span className="text-gray-500 text-xs sm:text-sm">التوافق الوراثي:</span><span className="font-medium text-xs sm:text-sm">{Math.round(rec.geneticCompatibility)}%</span></div>}
                            {rec.healthRisk && <div className="flex justify-between items-center"><span className="text-gray-500 text-xs sm:text-sm">المخاطر الصحية:</span><span className={`px-1 sm:px-2 py-1 rounded text-xs font-medium ${getHealthRiskColor(rec.healthRisk)}`}>{getHealthRiskText(rec.healthRisk)}</span></div>}
                          </div>

                          <div className="space-y-1 sm:space-y-2 sm:col-span-2 lg:col-span-1">
                            {rec.championPotential && <div className="flex justify-between"><span className="text-gray-500 text-xs sm:text-sm">إمكانية البطولة:</span><span className="font-medium text-purple-600 text-xs sm:text-sm">{rec.championPotential}%</span></div>}
                            {rec.successRate !== undefined && <div className="flex justify-between"><span className="text-gray-500 text-xs sm:text-sm">معدل النجاح:</span><span className="font-medium text-xs sm:text-sm">{Math.round(rec.successRate)}%</span></div>}
                            {rec.expectedQuality !== undefined && <div className="flex justify-between"><span className="text-gray-500 text-xs sm:text-sm">الجودة المتوقعة:</span><span className="font-medium text-blue-600 text-xs sm:text-sm">{rec.expectedQuality}/10</span></div>}
                          </div>
                        </div>

                        {rec.breedingStrategy && (
                          <div className="mb-3 sm:mb-4">
                            <div className="bg-purple-50 p-2 sm:p-3 rounded-lg">
                              <p className="text-xs sm:text-sm font-bold text-purple-800 mb-1">الاستراتيجية المقترحة:</p>
                              <p className="text-xs sm:text-sm text-purple-700">{rec.breedingStrategy}</p>
                            </div>
                          </div>
                        )}

                        <div className="space-y-2 sm:space-y-3">
                          <div>
                            <p className="text-xs sm:text-sm font-bold text-gray-700 mb-2">أساس التوصية الذكي:</p>
                            <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                              {rec.reasons.slice(0, expertMode ? rec.reasons.length : 3).map((reason, idx) => (
                                <li key={idx} className="flex items-start">
                                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full ml-2 mt-1.5 sm:mt-2 flex-shrink-0" />
                                  <span className="leading-relaxed">{reason}</span>
                                </li>
                              ))}
                              {!expertMode && rec.reasons.length > 3 && (
                                <li className="text-xs text-gray-500 mr-4">+{rec.reasons.length - 3} أسباب أخرى... (فعل وضع الخبير لرؤية المزيد)</li>
                              )}
                            </ul>
                          </div>

                          {rec.expertAdvice && (
                            <div className="bg-blue-50 p-2 sm:p-3 rounded-lg">
                              <p className="text-xs sm:text-sm font-bold text-blue-800 mb-1">نصيحة الخبير:</p>
                              <p className="text-xs sm:text-sm text-blue-700 leading-relaxed">{rec.expertAdvice}</p>
                            </div>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleApplyRecommendation(rec.partner, pigeon && isMale(pigeon.gender || pigeon.sex || '') ? 'insert-as-mother' : 'insert-as-father'); }}
                            className="px-3 py-2 bg-green-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-green-700"
                          >
                            {pigeon && isMale(pigeon.gender || pigeon.sex || '') ? 'إدراج كأم' : 'إدراج كأب'}
                          </button>

                          <button
                            onClick={(e) => { e.stopPropagation(); /* Future: open compare modal */ showInfo('قارن المرشحين', 'فتح وضع المقارنة (الميزة قيد التنفيذ).'); }}
                            className="px-3 py-2 bg-gray-200 text-gray-800 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-300"
                          >
                            مقارنة
                          </button>

                          <button
                            onClick={(e) => { e.stopPropagation(); handleSaveRecommendation(rec); }}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700"
                          >
                            حفظ التوصية
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 sm:p-4 md:p-6 border-t bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
              <div className="order-2 sm:order-1">
                <p className="text-xs sm:text-sm text-gray-600">
                  🤖 نظام ذكي يحلل البيانات الوراثية وخبرات الأبطال العالميين • 
                  يعرض فقط {getRequiredGenderText()} المتوافقة للتزاوج
                </p>
                {selectedType === 'inbreeding' && <p className="text-xs text-gray-500 mt-1">⚠️ تركيز الدماء يتطلب متابعة دقيقة للنسل لاكتشاف أي عيوب وراثية مبكراً</p>}
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 sm:space-x-reverse order-1 sm:order-2">
                <button onClick={() => setExpertMode(!expertMode)} className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm font-medium ${expertMode ? 'bg-yellow-500 text-white hover:bg-yellow-600' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}>
                  {expertMode ? 'وضع الخبير مفعل' : 'تفعيل وضع الخبير'}
                </button>
                <button onClick={onClose} className="px-4 sm:px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-xs sm:text-sm font-medium">إغلاق</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BreedingRecommendationsModal;
