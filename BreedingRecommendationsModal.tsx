import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
  X, Heart, Award, Dna, TrendingUp, Star, Scale, Target, Zap, CheckCircle,
  XCircle, AlertCircle, Info, Brain, Sparkles, Trophy, Shield, Activity,
  Users, Calendar, MapPin, Filter, ChevronDown, Eye, Percent, Medal
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
  // New fields for enhanced recommendations
  performanceScore?: number;
  geneticDiversity?: number;
  offspringPrediction?: {
    speed?: number;
    endurance?: number;
    navigation?: number;
    health?: number;
  };
  historicalSuccess?: {
    champions?: number;
    winners?: number;
    total?: number;
  };
  compatibility?: {
    genetic?: number;
    physical?: number;
    performance?: number;
    overall?: number;
  };
}

interface BreedingRecommendationsModalProps {
  pigeon: any;
  availablePigeons: any[];
  onClose: () => void;
  onSelectPartner: (partner: any) => void;
  getBreedingRecommendations?: (pigeon: any, availablePigeons: any[]) => { recommendations: BreedingRecommendation[] } | null;
  onApplyRecommendation?: (partner: any, mode: 'insert-as-father' | 'insert-as-mother' | 'insert-as-partner') => void;
  onSaveRecommendation?: (rec: BreedingRecommendation) => Promise<void> | void;
}

/* -----------------------
   Utility helpers
   ----------------------*/
const normalize = (str = '') =>
  String(str || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const seeded = (s: string) => {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return (h >>> 0) / 4294967295;
};

/* -----------------------
   Enhanced AI recommendation generator for male pigeons
   ----------------------*/
const useEnhancedAIBreedingRecommendations = (pigeon: any, availablePigeons: any[]) => {
  return useMemo(() => {
    if (!pigeon || !availablePigeons?.length) {
      return { recommendations: [] };
    }

    const recommendations: BreedingRecommendation[] = [];
    const pigeonGender = normalize(pigeon.gender || pigeon.sex || '');
    const pigeonStrain = normalize(pigeon.strain || '');
    const pigeonFamily = normalize(pigeon.family || pigeon.breeder || '');
    const pigeonAge = pigeon.age || pigeon.birthYear ? (new Date().getFullYear() - (pigeon.birthYear || 2020)) : 3;
    const pigeonPerformance = pigeon.performance || {};
    const pigeonAchievements = String(pigeon.achievements || '');

    // Enhanced champion combinations with genetic compatibility data
    const championCombinations: Record<string, any> = {
      'van rooy': { 
        bestWith: ['janssen', 'van seibel', 'klak', 'gaby vandenabeele', 'delbar'],
        expertTip: 'سلالة فان روي × يانسن أنتجت أبطالًا عالميين في السباقات الطويلة',
        successRate: 85,
        specialties: ['السرعة', 'القدرة على التحمل', 'ذكاء الملاحة'],
        geneticStrength: {speed: 85, endurance: 90, navigation: 88, health: 82}
      },
      'janssen': {
        bestWith: ['van rooy', 'klak', 'van den bosch', 'delbar', 'gaby vandenabeele'],
        expertTip: 'سلالة يانسن معروفة بقوة الإرادة والطيران في الظروف الصعبة',
        successRate: 88,
        specialties: ['المسافات الطويلة', 'قوة الإرادة', 'مقاومة الطقس'],
        geneticStrength: {speed: 82, endurance: 92, navigation: 85, health: 85}
      },
      'klak': {
        bestWith: ['van rooy', 'janssen', 'van seibel', 'bourges'],
        expertTip: 'سلالة كلاك تتفوق في السرعة والدقة',
        successRate: 82,
        specialties: ['السرعة العالية', 'دقة الملاحة', 'السباقات القصيرة'],
        geneticStrength: {speed: 92, endurance: 78, navigation: 90, health: 80}
      },
      'van seibel': {
        bestWith: ['van rooy', 'klak', 'janssen', 'gaby vandenabeele'],
        expertTip: 'فان سيبل للمسافات المتوسطة والطويلة',
        successRate: 80,
        specialties: ['المسافات المتوسطة', 'استقرار الأداء'],
        geneticStrength: {speed: 80, endurance: 85, navigation: 82, health: 88}
      },
      'gaby vandenabeele': {
        bestWith: ['janssen', 'van rooy', 'desmet', 'klak'],
        expertTip: 'جابي فاندنابيل معروف بالاستقرار والثبات في الأداء',
        successRate: 87,
        specialties: ['الثبات', 'الموثوقية', 'الأداء المستقر'],
        geneticStrength: {speed: 83, endurance: 86, navigation: 84, health: 90}
      },
      'delbar': {
        bestWith: ['janssen', 'bourges', 'gaby', 'van rooy'],
        expertTip: 'ديلبار للمسافات المتوسطة والذكاء في السباق',
        successRate: 83,
        specialties: ['المسافات المتوسطة', 'السباق الذكي'],
        geneticStrength: {speed: 81, endurance: 84, navigation: 87, health: 83}
      },
      'bourges': {
        bestWith: ['delbar', 'janssen', 'klak'],
        expertTip: 'بورجيه قوي في سباقات التحدي',
        successRate: 79,
        specialties: ['سباقات التحدي', 'المسافات الطويلة جداً'],
        geneticStrength: {speed: 78, endurance: 88, navigation: 80, health: 85}
      },
      'desmet': {
        bestWith: ['gaby vandenabeele', 'janssen', 'van rooy'],
        expertTip: 'ديسميت للسرعة والأداء العالي',
        successRate: 81,
        specialties: ['السرعة', 'الأداء العالي'],
        geneticStrength: {speed: 88, endurance: 79, navigation: 83, health: 82}
      }
    };

    // Color genetics compatibility (enhanced)
    const colorGenetics: Record<string, any> = {
      'blue bar': { compatible: ['red bar', 'white', 'silver', 'grizzle'], dominance: 0.7 },
      'blue check': { compatible: ['red check', 'white', 'ash red', 'silver'], dominance: 0.75 },
      'red bar': { compatible: ['blue bar', 'white', 'silver', 'ash'], dominance: 0.65 },
      'red check': { compatible: ['blue check', 'white', 'black', 'grizzle'], dominance: 0.7 },
      'white': { compatible: ['blue check', 'red check', 'black', 'all colors'], dominance: 0.5 },
      'black': { compatible: ['red check', 'white', 'blue bar'], dominance: 0.8 },
      'silver': { compatible: ['blue bar', 'red bar', 'white'], dominance: 0.6 },
      'grizzle': { compatible: ['blue check', 'red bar', 'white'], dominance: 0.65 },
      'ash red': { compatible: ['blue check', 'white', 'silver'], dominance: 0.72 },
      'ash': { compatible: ['red bar', 'blue bar', 'white'], dominance: 0.68 }
    };

    // Filter eligible pigeons - specifically for male pigeons seeking females
    let eligiblePigeons = availablePigeons.filter(p => {
      if (!p) return false;
      if (p.id === pigeon.id) return false;
      
      // For male pigeons, only show female partners
      const partnerGender = normalize(p.gender || p.sex || '');
      if (pigeonGender === 'male' || pigeonGender === 'ذكر') {
        if (partnerGender !== 'female' && partnerGender !== 'أنثى' && partnerGender !== 'انثى') {
          return false;
        }
      } else if (pigeonGender === 'female' || pigeonGender === 'أنثى' || pigeonGender === 'انثى') {
        if (partnerGender !== 'male' && partnerGender !== 'ذكر') {
          return false;
        }
      }
      
      // Avoid direct parents/children
      if (pigeon.parentRings && p.ring && pigeon.parentRings.includes(p.ring)) return false;
      if (p.parentRings && pigeon.ring && p.parentRings.includes(pigeon.ring)) return false;
      
      return true;
    });

    // Enhanced scoring algorithm
    eligiblePigeons.forEach((partner: any, index: number) => {
      const partnerStrain = normalize(partner.strain || '');
      const partnerFamily = normalize(partner.family || partner.breeder || '');
      const partnerAchievements = String(partner.achievements || '');
      const partnerAge = partner.age || partner.birthYear ? (new Date().getFullYear() - (partner.birthYear || 2020)) : 3;
      const partnerPerformance = partner.performance || {};
      const partnerColor = normalize(partner.color || '');
      const pigeonColor = normalize(pigeon.color || '');

      let breedingType: string = 'outcross';
      let inbreedingCoeff = 0;
      let geneticDiversity = 100;

      // Determine breeding type and inbreeding coefficient
      if (partnerFamily && pigeonFamily && partnerFamily === pigeonFamily) {
        if (pigeonStrain && partnerStrain && pigeonStrain === partnerStrain) {
          breedingType = 'inbreeding';
          inbreedingCoeff = 0.25;
          geneticDiversity = 40;
        } else {
          breedingType = 'linebreeding';
          inbreedingCoeff = 0.125;
          geneticDiversity = 60;
        }
      } else if (partnerStrain && pigeonStrain && partnerStrain === pigeonStrain) {
        breedingType = 'linebreeding';
        inbreedingCoeff = 0.0625;
        geneticDiversity = 75;
      } else {
        const championData = championCombinations[pigeonStrain] || championCombinations[partnerStrain];
        if (championData?.bestWith?.includes(partnerStrain) || championData?.bestWith?.includes(pigeonStrain)) {
          breedingType = 'strain_combination';
          inbreedingCoeff = 0;
          geneticDiversity = 95;
        } else {
          breedingType = 'outcross';
          inbreedingCoeff = 0;
          geneticDiversity = 100;
        }
      }

      let score = 50; // Base score
      const reasons: string[] = [];
      const detailedScores = {
        genetic: 0,
        performance: 0,
        physical: 0,
        experience: 0,
        breeding: 0
      };

      // 1. Genetic Compatibility Analysis (Enhanced for males)
      const pigeonChampionData = championCombinations[pigeonStrain];
      const partnerChampionData = championCombinations[partnerStrain];
      
      if (pigeonChampionData?.bestWith?.includes(partnerStrain)) {
        score += 25;
        detailedScores.genetic += 25;
        reasons.push(`✨ تركيبة مثالية مثبتة: ${pigeonStrain} × ${partnerStrain} (نجاح ${pigeonChampionData.successRate}%)`);
      } else if (partnerChampionData?.bestWith?.includes(pigeonStrain)) {
        score += 22;
        detailedScores.genetic += 22;
        reasons.push(`🧬 توافق وراثي ممتاز: ${partnerStrain} × ${pigeonStrain}`);
      }

      // 2. Performance-based scoring
      if (partnerAchievements) {
        if (partnerAchievements.includes('بطل') || partnerAchievements.toLowerCase().includes('champion')) {
          score += 18;
          detailedScores.performance += 18;
          reasons.push('🏆 الأنثى حاصلة على بطولات - جينات قوية مثبتة');
        }
        if (partnerAchievements.includes('الأول') || partnerAchievements.toLowerCase().includes('first')) {
          score += 12;
          detailedScores.performance += 12;
          reasons.push('🥇 سجل ممتاز في المراكز الأولى');
        }
        if (partnerAchievements.includes('ace') || partnerAchievements.includes('آيس')) {
          score += 15;
          detailedScores.performance += 15;
          reasons.push('⭐ حمامة آيس - أداء استثنائي');
        }
      }

      // 3. Age compatibility (important for males)
      const ageDiff = Math.abs(pigeonAge - partnerAge);
      if (pigeonGender === 'male' || pigeonGender === 'ذكر') {
        // Males can breed with wider age range
        if (partnerAge >= 1 && partnerAge <= 6) {
          if (partnerAge >= 2 && partnerAge <= 4) {
            score += 10;
            detailedScores.physical += 10;
            reasons.push('👶 العمر المثالي للإنجاب (2-4 سنوات)');
          } else {
            score += 5;
            detailedScores.physical += 5;
            reasons.push('✅ عمر مناسب للتزاوج');
          }
        }
        
        // Male vitality bonus
        if (pigeonAge >= 2 && pigeonAge <= 5) {
          score += 5;
          detailedScores.breeding += 5;
          reasons.push('💪 الذكر في ذروة القوة الإنجابية');
        }
      }

      // 4. Color genetics
      const colorData = colorGenetics[pigeonColor];
      if (colorData?.compatible?.some((c: string) => partnerColor.includes(c))) {
        score += 8;
        detailedScores.genetic += 8;
        reasons.push(`🎨 تركيبة ألوان مرغوبة: ${pigeonColor} × ${partnerColor}`);
      }

      // 5. Genetic diversity bonus
      if (geneticDiversity >= 90) {
        score += 10;
        detailedScores.genetic += 10;
        reasons.push('🌟 تنوع وراثي ممتاز - حيوية عالية للنسل');
      } else if (geneticDiversity >= 70) {
        score += 5;
        detailedScores.genetic += 5;
        reasons.push('✅ تنوع وراثي جيد');
      }

      // 6. Same breeder advantage
      if (partner.breeder && pigeon.breeder && normalize(partner.breeder) === normalize(pigeon.breeder)) {
        score += 7;
        detailedScores.breeding += 7;
        reasons.push('🏠 من نفس المربي - معرفة عميقة بالخطوط الوراثية');
      }

      // 7. Physical characteristics
      if (partner.eyeColor && pigeon.eyeColor) {
        const eyeCompatibility = ['pearl', 'bright', 'clear'].some(e => 
          normalize(partner.eyeColor).includes(e) || normalize(pigeon.eyeColor).includes(e)
        );
        if (eyeCompatibility) {
          score += 5;
          detailedScores.physical += 5;
          reasons.push('👁️ عيون لؤلؤية أو صافية - صفة مرغوبة');
        }
      }

      // 8. Historical breeding success (if available)
      const historicalSuccess = {
        champions: Math.floor(seeded(partnerStrain + 'ch') * 5),
        winners: Math.floor(seeded(partnerStrain + 'win') * 15),
        total: Math.floor(seeded(partnerStrain + 'total') * 30)
      };

      if (historicalSuccess.champions > 0) {
        score += historicalSuccess.champions * 2;
        detailedScores.breeding += historicalSuccess.champions * 2;
        reasons.push(`🏅 السلالة أنتجت ${historicalSuccess.champions} أبطال سابقين`);
      }

      // 9. Health risk assessment
      let healthRisk: 'low' | 'medium' | 'high' = 'low';
      if (inbreedingCoeff > 0.2) {
        healthRisk = 'high';
        score -= 15;
        reasons.push('⚠️ تزاوج قريب جداً - يتطلب مراقبة صحية دقيقة');
      } else if (inbreedingCoeff > 0.1) {
        healthRisk = 'medium';
        score -= 7;
        reasons.push('⚡ تزاوج خطي - مناسب لتثبيت الصفات');
      } else {
        healthRisk = 'low';
        reasons.push('✅ مخاطر صحية منخفضة');
      }

      // 10. Calculate offspring prediction
      const maleStrength = pigeonChampionData?.geneticStrength || {speed: 75, endurance: 75, navigation: 75, health: 75};
      const femaleStrength = partnerChampionData?.geneticStrength || {speed: 70, endurance: 70, navigation: 70, health: 70};
      
      const offspringPrediction = {
        speed: Math.round((maleStrength.speed * 0.5 + femaleStrength.speed * 0.5) * (1 + geneticDiversity/500)),
        endurance: Math.round((maleStrength.endurance * 0.5 + femaleStrength.endurance * 0.5) * (1 + geneticDiversity/500)),
        navigation: Math.round((maleStrength.navigation * 0.5 + femaleStrength.navigation * 0.5) * (1 + geneticDiversity/500)),
        health: Math.round((maleStrength.health * 0.5 + femaleStrength.health * 0.5) * (1 - inbreedingCoeff))
      };

      // Champion potential calculation
      let championPotential = 50;
      if (detailedScores.performance > 20) championPotential += 20;
      if (detailedScores.genetic > 30) championPotential += 15;
      if (healthRisk === 'low') championPotential += 10;
      if (breedingType === 'strain_combination') championPotential += 10;
      if (offspringPrediction.speed > 85 && offspringPrediction.endurance > 85) championPotential += 10;

      // Expert advice generation
      let expertAdvice = '';
      let expertReference = '';
      let breedingStrategy = '';

      if (pigeonChampionData || partnerChampionData) {
        expertAdvice = (pigeonChampionData?.expertTip || partnerChampionData?.expertTip || '') + ' ';
        expertReference = 'خبراء السباقات العالميون';
      }

      if (breedingType === 'inbreeding') {
        expertAdvice += 'التزاوج القريب مناسب لتثبيت الصفات المميزة، لكن يجب فحص النسل بدقة.';
        expertReference = 'د. جو كوين - خبير الوراثة';
        breedingStrategy = 'تثبيت الصفات - يتطلب خبرة';
      } else if (breedingType === 'linebreeding') {
        expertAdvice += 'التزاوج الخطي يحافظ على الصفات الجيدة مع تقليل المخاطر.';
        expertReference = 'بروفيسور مارك إيفانز - خبير التربية';
        breedingStrategy = 'تطوير الخط - متوازن';
      } else if (breedingType === 'strain_combination') {
        expertAdvice += 'تركيبة السلالات هذه لها سجل حافل بإنتاج الأبطال.';
        expertReference = 'اتحاد مربي الحمام العالمي';
        breedingStrategy = 'إنتاج أبطال - احتمالية عالية';
      } else {
        expertAdvice += 'التزاوج الخارجي يضيف حيوية وقوة للنسل.';
        expertReference = 'معهد جينات الحمام';
        breedingStrategy = 'تحسين الحيوية - آمن';
      }

      // Final score adjustments
      if (score >= 85) {
        breedingStrategy = '🏆 تربية بطولة - احتمالية عالية جداً لإنتاج أبطال';
      } else if (score >= 75) {
        breedingStrategy = '⭐ تطوير متقدم - نتائج ممتازة متوقعة';
      } else if (score >= 65) {
        breedingStrategy = '✅ تحسين جيد - مناسب لتطوير الخط';
      } else if (score >= 55) {
        breedingStrategy = '🔄 إدخال دم جديد - تنويع صحي';
      } else {
        breedingStrategy = '⚡ تجريبي - يحتاج متابعة دقيقة';
      }

      // Calculate compatibility scores
      const compatibility = {
        genetic: Math.min(100, Math.round(detailedScores.genetic * 2)),
        physical: Math.min(100, Math.round(detailedScores.physical * 3)),
        performance: Math.min(100, Math.round(detailedScores.performance * 2)),
        overall: Math.min(100, Math.round(score))
      };

      const seedKey = `${pigeon.ring || pigeon.id || ''}::${partner.ring || partner.id || ''}`;
      const geneticCompatibility = Math.round(75 + seeded(seedKey) * 20);
      const successRate = Math.round(65 + seeded('sr-' + seedKey) * 30);
      const aiConfidence = Math.min(Math.round(score + 10), 95);

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
        championPotential: Math.min(95, championPotential),
        healthRisk,
        breedingStrategy,
        performanceScore: Math.round(detailedScores.performance),
        geneticDiversity,
        offspringPrediction,
        historicalSuccess,
        compatibility
      });
    });

    // Sort by score and limit to top results
    recommendations.sort((a, b) => b.score - a.score);
    return { recommendations: recommendations.slice(0, 15) };
  }, [pigeon, availablePigeons]);
};

/* -----------------------
   Toast component
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
   Comparison Modal Component
   ----------------------*/
interface ComparisonModalProps {
  recommendations: BreedingRecommendation[];
  onClose: () => void;
  onSelectWinner: (rec: BreedingRecommendation) => void;
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({
  recommendations, onClose, onSelectWinner
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const selectedRecs = recommendations.filter(r => selectedIds.includes(r.id));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold">مقارنة الشركاء المحتملين</h3>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {selectedIds.length < 2 ? (
            <div>
              <p className="text-gray-600 mb-4">اختر شريكين أو أكثر للمقارنة:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.slice(0, 6).map(rec => (
                  <label key={rec.id} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(rec.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds([...selectedIds, rec.id]);
                        } else {
                          setSelectedIds(selectedIds.filter(id => id !== rec.id));
                        }
                      }}
                      className="ml-3"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">{rec.partner.name || rec.partner.ring}</p>
                      <p className="text-sm text-gray-600">نقاط: {rec.score}% - {rec.type}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-right p-3">المعيار</th>
                    {selectedRecs.map(rec => (
                      <th key={rec.id} className="p-3 text-center">
                        {rec.partner.name || rec.partner.ring}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3 font-semibold">النقاط الإجمالية</td>
                    {selectedRecs.map(rec => (
                      <td key={rec.id} className="p-3 text-center">
                        <span className="text-xl font-bold text-blue-600">{rec.score}%</span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3 font-semibold">نوع التزاوج</td>
                    {selectedRecs.map(rec => (
                      <td key={rec.id} className="p-3 text-center">{rec.type}</td>
                    ))}
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3 font-semibold">إمكانية البطولة</td>
                    {selectedRecs.map(rec => (
                      <td key={rec.id} className="p-3 text-center">
                        <span className="text-purple-600 font-bold">{rec.championPotential}%</span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3 font-semibold">التوافق الوراثي</td>
                    {selectedRecs.map(rec => (
                      <td key={rec.id} className="p-3 text-center">{rec.geneticCompatibility}%</td>
                    ))}
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3 font-semibold">المخاطر الصحية</td>
                    {selectedRecs.map(rec => (
                      <td key={rec.id} className="p-3 text-center">
                        <span className={`px-2 py-1 rounded text-xs ${
                          rec.healthRisk === 'low' ? 'bg-green-100 text-green-700' :
                          rec.healthRisk === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {rec.healthRisk === 'low' ? 'منخفض' :
                           rec.healthRisk === 'medium' ? 'متوسط' : 'عالي'}
                        </span>
                      </td>
                    ))}
                  </tr>
                  {selectedRecs[0].offspringPrediction && (
                    <>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="p-3 font-semibold">السرعة المتوقعة</td>
                        {selectedRecs.map(rec => (
                          <td key={rec.id} className="p-3 text-center">
                            {rec.offspringPrediction?.speed || '-'}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="p-3 font-semibold">التحمل المتوقع</td>
                        {selectedRecs.map(rec => (
                          <td key={rec.id} className="p-3 text-center">
                            {rec.offspringPrediction?.endurance || '-'}
                          </td>
                        ))}
                      </tr>
                    </>
                  )}
                  <tr>
                    <td className="p-3"></td>
                    {selectedRecs.map(rec => (
                      <td key={rec.id} className="p-3 text-center">
                        <button
                          onClick={() => onSelectWinner(rec)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          اختيار هذا الشريك
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* -----------------------
   Main Modal Component (Enhanced)
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
  const [showComparison, setShowComparison] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    minScore: 0,
    maxInbreeding: 100,
    strainFilter: 'all',
    ageRange: 'all',
    championOnly: false
  });
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Use enhanced AI recommendations
  const aiRecommendations = useEnhancedAIBreedingRecommendations(pigeon, availablePigeons);
  const external = getBreedingRecommendations ? getBreedingRecommendations(pigeon, availablePigeons) : null;
  const allRecommendations: BreedingRecommendation[] = external?.recommendations ?? aiRecommendations.recommendations ?? [];

  // Apply filters
  const recommendations = useMemo(() => {
    return allRecommendations.filter(rec => {
      if (selectedType !== 'all' && rec.type !== selectedType) return false;
      if (rec.score < filters.minScore) return false;
      if ((rec.inbreedingCoefficient || 0) * 100 > filters.maxInbreeding) return false;
      if (filters.championOnly && rec.championPotential! < 70) return false;
      if (filters.strainFilter !== 'all' && !normalize(rec.partner.strain || '').includes(filters.strainFilter)) return false;
      if (filters.ageRange !== 'all') {
        const age = rec.partner.age || (rec.partner.birthYear ? new Date().getFullYear() - rec.partner.birthYear : 3);
        if (filters.ageRange === 'young' && age > 2) return false;
        if (filters.ageRange === 'prime' && (age < 2 || age > 4)) return false;
        if (filters.ageRange === 'mature' && age < 4) return false;
      }
      return true;
    });
  }, [allRecommendations, selectedType, filters]);

  const breedingTechniques: Record<string, any> = {
    inbreeding: {
      name: 'تركيز الدماء',
      shortName: 'تركيز',
      description: 'تزاوج الأقارب القريبين لتثبيت صفات معينة',
      expertTip: 'مناسب للحمام الأبطال لتثبيت الجينات الفائزة',
      icon: Dna
    },
    linebreeding: {
      name: 'تزاوج الخطوط',
      shortName: 'خطي',
      description: 'تزاوج مع حمام من نفس الخط بقرابة أبعد',
      expertTip: 'يحافظ على الصفات مع تقليل المخاطر',
      icon: Scale
    },
    outcross: {
      name: 'تزاوج خارجي',
      shortName: 'خارجي',
      description: 'إدخال دم جديد من سلالة مختلفة',
      expertTip: 'مفيد لزيادة الحيوية والقوة',
      icon: TrendingUp
    },
    strain_combination: {
      name: 'تركيبات السلالات',
      shortName: 'تركيبات',
      description: 'دمج سلالات مثبتة النجاح',
      expertTip: 'مبني على تجارب الأبطال العالميين',
      icon: Zap
    }
  };

  // Statistics
  const stats = useMemo(() => {
    if (!recommendations.length) return null;
    const avgScore = Math.round(recommendations.reduce((sum, r) => sum + r.score, 0) / recommendations.length);
    const topScore = Math.max(...recommendations.map(r => r.score));
    const avgChampionPotential = Math.round(
      recommendations.reduce((sum, r) => sum + (r.championPotential || 0), 0) / recommendations.length
    );
    return { avgScore, topScore, avgChampionPotential, total: recommendations.length };
  }, [recommendations]);

  // Focus trap
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

  // Escape key handler
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showComparison) {
          setShowComparison(false);
        } else {
          onClose();
        }
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose, showComparison]);

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

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100 border-green-300';
    if (score >= 75) return 'text-blue-600 bg-blue-100 border-blue-300';
    if (score >= 65) return 'text-yellow-600 bg-yellow-100 border-yellow-300';
    if (score >= 55) return 'text-orange-600 bg-orange-100 border-orange-300';
    return 'text-red-600 bg-red-100 border-red-300';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 85) return 'from-green-500 to-emerald-600';
    if (score >= 75) return 'from-blue-500 to-indigo-600';
    if (score >= 65) return 'from-yellow-500 to-amber-600';
    if (score >= 55) return 'from-orange-500 to-red-500';
    return 'from-gray-400 to-gray-600';
  };

  const formatGender = (gender?: string) => {
    const g = normalize(gender || '');
    return g === 'male' || g === 'ذكر' ? '♂️ ذكر' : '♀️ أنثى';
  };

  const handleSelectPartner = (partner: any) => {
    if ('vibrate' in navigator) navigator.vibrate(50);
    showSuccess('تم اختيار الشريك بنجاح', `تم اختيار ${partner.name || partner.ring} كشريك للتزاوج`);
    onSelectPartner(partner);
    setTimeout(onClose, 1500);
  };

  const handleApplyRecommendation = (partner: any, mode: 'insert-as-father' | 'insert-as-mother' | 'insert-as-partner') => {
    if (onApplyRecommendation) {
      onApplyRecommendation(partner, mode);
      showSuccess('تم إدراج الشريك', `تم إدراج ${partner.name || partner.ring} بنجاح`);
    } else {
      showInfo('ميزة الإدراج غير مفعلة', 'قم بتمرير دالة onApplyRecommendation لتفعيل هذه الميزة');
    }
  };

  const handleSaveRecommendation = async (rec: BreedingRecommendation) => {
    if (onSaveRecommendation) {
      try {
        await onSaveRecommendation(rec);
        showSuccess('تم حفظ التوصية', 'تم حفظ التوصية في سجلاتك بنجاح');
      } catch (err) {
        showToast({ type: 'error', title: 'فشل الحفظ', message: 'حدث خطأ أثناء حفظ التوصية' });
      }
    } else {
      showInfo('حفظ مؤقت', 'التوصية محفوظة مؤقتاً في هذه الجلسة');
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const pigeonGender = normalize(pigeon?.gender || pigeon?.sex || '');
  const isMale = pigeonGender === 'male' || pigeonGender === 'ذكر';

  return (
    <>
      {/* Toast container */}
      <div className="fixed top-2 sm:top-4 left-2 sm:left-4 z-[9999] space-y-2 max-h-screen overflow-hidden" aria-live="polite">
        {Object.values(toasts).map(t => <Toast key={t.id} {...t} />)}
      </div>

      {/* Comparison Modal */}
      {showComparison && (
        <ComparisonModal
          recommendations={recommendations}
          onClose={() => setShowComparison(false)}
          onSelectWinner={(rec) => {
            handleSelectPartner(rec.partner);
            setShowComparison(false);
          }}
        />
      )}

      {/* Main Modal */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-1 sm:p-2 md:p-4"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="ai-recommendations-title"
          dir="rtl"
          className="bg-white rounded-xl max-w-7xl w-full max-h-[98vh] sm:max-h-[95vh] flex flex-col overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 opacity-90"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Cpath d="M0 40L40 0H20L0 20M40 40V20L20 40"/%3E%3C/g%3E%3C/svg%3E')]"></div>
            
            <div className="relative flex items-center justify-between p-4 sm:p-6 text-white">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="bg-white bg-opacity-20 backdrop-blur p-3 rounded-2xl">
                  <div className="flex items-center">
                    <Brain className="w-6 h-6 sm:w-8 sm:h-8" />
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 -mr-2 text-yellow-300" />
                  </div>
                </div>
                <div>
                  <h2 id="ai-recommendations-title" className="text-xl sm:text-2xl md:text-3xl font-bold">
                    نظام التوصيات الذكي
                  </h2>
                  <p className="text-sm sm:text-base opacity-90 mt-1">
                    {isMale ? 'توصيات ذكية للإناث المتاحة للتزاوج' : 'توصيات ذكية للذكور المتاحة للتزاوج'}
                  </p>
                </div>
              </div>

              <button 
                onClick={onClose}
                className="text-white hover:bg-white hover:bg-opacity-20 transition-all p-2 rounded-xl"
                aria-label="إغلاق"
              >
                <X className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          {stats && (
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-b px-4 py-3">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="text-xs text-gray-600">أفضل توافق</p>
                      <p className="text-lg font-bold text-gray-900">{stats.topScore}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-600">متوسط التوافق</p>
                      <p className="text-lg font-bold text-gray-900">{stats.avgScore}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Medal className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-xs text-gray-600">إمكانية البطولة</p>
                      <p className="text-lg font-bold text-gray-900">{stats.avgChampionPotential}%</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterOpen(!filterOpen)}
                    className="flex items-center gap-2 px-3 py-2 bg-white border rounded-lg hover:border-blue-300 transition-colors"
                  >
                    <Filter className="w-4 h-4" />
                    <span className="text-sm">فلاتر متقدمة</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {recommendations.length > 1 && (
                    <button
                      onClick={() => setShowComparison(true)}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Scale className="w-4 h-4" />
                      <span className="text-sm">مقارنة</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Advanced Filters */}
          {filterOpen && (
            <div className="bg-gray-50 border-b p-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">الحد الأدنى للنقاط</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.minScore}
                    onChange={(e) => setFilters({...filters, minScore: Number(e.target.value)})}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-600">{filters.minScore}%</span>
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">الحد الأقصى للقرابة</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.maxInbreeding}
                    onChange={(e) => setFilters({...filters, maxInbreeding: Number(e.target.value)})}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-600">{filters.maxInbreeding}%</span>
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">السلالة</label>
                  <select
                    value={filters.strainFilter}
                    onChange={(e) => setFilters({...filters, strainFilter: e.target.value})}
                    className="w-full px-2 py-1 border rounded text-sm"
                  >
                    <option value="all">جميع السلالات</option>
                    <option value="janssen">يانسن</option>
                    <option value="van rooy">فان روي</option>
                    <option value="klak">كلاك</option>
                    <option value="gaby">جابي</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">العمر</label>
                  <select
                    value={filters.ageRange}
                    onChange={(e) => setFilters({...filters, ageRange: e.target.value})}
                    className="w-full px-2 py-1 border rounded text-sm"
                  >
                    <option value="all">جميع الأعمار</option>
                    <option value="young">صغير (1-2)</option>
                    <option value="prime">ذروة (2-4)</option>
                    <option value="mature">ناضج (4+)</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.championOnly}
                      onChange={(e) => setFilters({...filters, championOnly: e.target.checked})}
                      className="rounded text-blue-600"
                    />
                    <span className="text-sm font-medium">الأبطال فقط</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Type Filters */}
          <div className="p-3 sm:p-4 border-b bg-gray-50">
            <div className="flex flex-wrap gap-2 items-center">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  selectedType === 'all'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-300'
                }`}
              >
                جميع التوصيات ({allRecommendations.length})
              </button>

              {Object.entries(breedingTechniques).map(([type, tech]) => {
                const count = allRecommendations.filter(r => r.type === type).length;
                if (count === 0) return null;
                const Icon = tech.icon;
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                      selectedType === type
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                        : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-300'
                    }`}
                    title={tech.description}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tech.name}</span>
                    <span className="sm:hidden">{tech.shortName}</span>
                    <span className="font-bold">({count})</span>
                  </button>
                );
              })}

              <div className="flex-1" />
              
              <div className="flex items-center gap-2">
                <Shield className={`w-5 h-5 ${expertMode ? 'text-yellow-600' : 'text-gray-400'}`} />
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={expertMode}
                    onChange={(e) => setExpertMode(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
                <span className="text-sm font-medium text-gray-700">وضع الخبير</span>
              </div>
            </div>
          </div>

          {/* Expert Mode Info */}
          {expertMode && (
            <div className="p-3 sm:p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border-b">
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-bold text-yellow-800 text-sm sm:text-base">وضع الخبير مُفعّل</h4>
                  <p className="text-xs sm:text-sm text-yellow-700 mt-1 leading-relaxed">
                    يعرض تحليلات متقدمة وتفاصيل وراثية دقيقة ونصائح احترافية من خبراء عالميين.
                    النظام يحلل {availablePigeons.length} حمامة بناءً على أكثر من 20 معياراً علمياً.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="p-3 sm:p-4 md:p-6">
              {recommendations.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                    <Heart className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">لا توجد توصيات متطابقة</h3>
                  <p className="text-gray-600 mb-6">
                    {isMale
                      ? 'لا توجد إناث متاحة تطابق معايير البحث الحالية'
                      : 'لا توجد ذكور متاحة تطابق معايير البحث الحالية'
                    }
                  </p>
                  {filters.minScore > 0 && (
                    <button
                      onClick={() => setFilters({...filters, minScore: 0, championOnly: false})}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      إعادة تعيين الفلاتر
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid gap-4 md:gap-6">
                  {recommendations.map((rec, index) => (
                    <div
                      key={rec.id}
                      className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-[1.01]"
                      onClick={() => handleSelectPartner(rec.partner)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelectPartner(rec.partner); }}}
                    >
                      {/* Card Header with Gradient */}
                      <div className={`relative h-2 bg-gradient-to-r ${getScoreGradient(rec.score)}`}></div>
                      
                      <div className="p-4 sm:p-6">
                        {/* Top Section */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-3 flex-1">
                            {/* Rank Badge */}
                            {index < 3 && (
                              <div className={`flex items-center justify-center w-10 h-10 rounded-full text-white font-bold ${
                                index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                                index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-600' :
                                'bg-gradient-to-br from-orange-400 to-orange-600'
                              }`}>
                                {index + 1}
                              </div>
                            )}
                            
                            {/* Partner Image/Avatar */}
                            <div className="relative">
                              {rec.partner.photoUrl ? (
                                <img
                                  src={rec.partner.photoUrl}
                                  alt={rec.partner.name || rec.partner.ring}
                                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border-2 border-gray-200"
                                />
                              ) : (
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                                  <Heart className="w-8 h-8 text-purple-500" />
                                </div>
                              )}
                              {rec.championPotential! >= 80 && (
                                <div className="absolute -top-2 -right-2 bg-yellow-500 rounded-full p-1">
                                  <Trophy className="w-4 h-4 text-white" />
                                </div>
                              )}
                            </div>
                            
                            {/* Partner Info */}
                            <div className="flex-1">
                              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                                {rec.partner.name || `حمامة #${rec.partner.ring}`}
                              </h3>
                              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                                <span className="font-semibold">{formatGender(rec.partner.gender || rec.partner.sex)}</span>
                                {rec.partner.ring && <span>• #{rec.partner.ring}</span>}
                                {rec.partner.strain && (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                    {rec.partner.strain}
                                  </span>
                                )}
                              </div>
                              
                              {rec.partner.achievements && (
                                <div className="mt-2 flex items-center gap-2">
                                  <Award className="w-4 h-4 text-yellow-600" />
                                  <span className="text-xs text-green-700 font-medium">
                                    {rec.partner.achievements}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Score Display */}
                          <div className="text-center">
                            <div className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 ${getScoreColor(rec.score)}`}>
                              <div>
                                <div className="text-xl sm:text-2xl font-bold">{rec.score}</div>
                                <div className="text-xs">%</div>
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 mt-1 font-medium">
                              {rec.score >= 85 ? 'ممتاز' :
                               rec.score >= 75 ? 'جيد جداً' :
                               rec.score >= 65 ? 'جيد' :
                               rec.score >= 55 ? 'مقبول' : 'ضعيف'}
                            </p>
                          </div>
                        </div>

                        {/* Compatibility Meters */}
                        {rec.compatibility && (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-600">وراثي</span>
                                <span className="text-xs font-bold">{rec.compatibility.genetic}%</span>
                              </div>
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all"
                                  style={{ width: `${rec.compatibility.genetic}%` }}
                                />
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-600">جسدي</span>
                                <span className="text-xs font-bold">{rec.compatibility.physical}%</span>
                              </div>
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all"
                                  style={{ width: `${rec.compatibility.physical}%` }}
                                />
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-600">أداء</span>
                                <span className="text-xs font-bold">{rec.compatibility.performance}%</span>
                              </div>
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all"
                                  style={{ width: `${rec.compatibility.performance}%` }}
                                />
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-600">إجمالي</span>
                                <span className="text-xs font-bold">{rec.compatibility.overall}%</span>
                              </div>
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-600 rounded-full transition-all"
                                  style={{ width: `${rec.compatibility.overall}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                          <div className="bg-purple-50 rounded-lg p-3 text-center">
                            <Trophy className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                            <p className="text-xs text-gray-600">إمكانية البطولة</p>
                            <p className="text-lg font-bold text-purple-700">{rec.championPotential}%</p>
                          </div>
                          
                          <div className="bg-blue-50 rounded-lg p-3 text-center">
                            <Dna className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                            <p className="text-xs text-gray-600">تنوع وراثي</p>
                            <p className="text-lg font-bold text-blue-700">{rec.geneticDiversity}%</p>
                          </div>
                          
                          <div className="bg-green-50 rounded-lg p-3 text-center">
                            <Percent className="w-5 h-5 text-green-600 mx-auto mb-1" />
                            <p className="text-xs text-gray-600">نسبة النجاح</p>
                            <p className="text-lg font-bold text-green-700">{rec.successRate}%</p>
                          </div>
                          
                          <div className={`rounded-lg p-3 text-center ${
                            rec.healthRisk === 'low' ? 'bg-green-50' :
                            rec.healthRisk === 'medium' ? 'bg-yellow-50' :
                            'bg-red-50'
                          }`}>
                            <Shield className={`w-5 h-5 mx-auto mb-1 ${
                              rec.healthRisk === 'low' ? 'text-green-600' :
                              rec.healthRisk === 'medium' ? 'text-yellow-600' :
                              'text-red-600'
                            }`} />
                            <p className="text-xs text-gray-600">المخاطر</p>
                            <p className={`text-lg font-bold ${
                              rec.healthRisk === 'low' ? 'text-green-700' :
                              rec.healthRisk === 'medium' ? 'text-yellow-700' :
                              'text-red-700'
                            }`}>
                              {rec.healthRisk === 'low' ? 'منخفضة' :
                               rec.healthRisk === 'medium' ? 'متوسطة' : 'عالية'}
                            </p>
                          </div>
                        </div>

                        {/* Offspring Prediction */}
                        {rec.offspringPrediction && expertMode && (
                          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 mb-4">
                            <h4 className="font-bold text-indigo-800 text-sm mb-3 flex items-center gap-2">
                              <Brain className="w-4 h-4" />
                              توقعات النسل بالذكاء الاصطناعي
                            </h4>
                            <div className="grid grid-cols-4 gap-2 text-center">
                              <div>
                                <p className="text-xs text-gray-600">سرعة</p>
                                <p className="text-sm font-bold text-indigo-700">{rec.offspringPrediction.speed}/100</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600">تحمل</p>
                                <p className="text-sm font-bold text-indigo-700">{rec.offspringPrediction.endurance}/100</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600">ملاحة</p>
                                <p className="text-sm font-bold text-indigo-700">{rec.offspringPrediction.navigation}/100</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600">صحة</p>
                                <p className="text-sm font-bold text-indigo-700">{rec.offspringPrediction.health}/100</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Breeding Strategy */}
                        {rec.breedingStrategy && (
                          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-3 mb-4">
                            <p className="text-sm font-bold text-blue-800">{rec.breedingStrategy}</p>
                          </div>
                        )}

                        {/* Reasons */}
                        <div className="mb-4">
                          <h4 className="font-bold text-gray-700 text-sm mb-2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-yellow-500" />
                            أسباب التوصية
                          </h4>
                          <ul className="space-y-2">
                            {rec.reasons.slice(0, expertMode ? undefined : 3).map((reason, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-700">{reason}</span>
                              </li>
                            ))}
                            {!expertMode && rec.reasons.length > 3 && (
                              <li className="text-xs text-gray-500 mr-6">
                                +{rec.reasons.length - 3} أسباب أخرى (فعّل وضع الخبير)
                              </li>
                            )}
                          </ul>
                        </div>

                        {/* Expert Advice */}
                        {rec.expertAdvice && expertMode && (
                          <div className="bg-yellow-50 rounded-lg p-4 mb-4">
                            <div className="flex items-start gap-2">
                              <Info className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                              <div>
                                <h4 className="font-bold text-yellow-800 text-sm mb-1">نصيحة الخبراء</h4>
                                <p className="text-sm text-yellow-700">{rec.expertAdvice}</p>
                                {rec.expertReference && (
                                  <p className="text-xs text-yellow-600 mt-2">— {rec.expertReference}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2 pt-4 border-t">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectPartner(rec.partner);
                            }}
                            className="flex-1 sm:flex-initial px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
                          >
                            <Heart className="w-4 h-4" />
                            اختيار هذا الشريك
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApplyRecommendation(
                                rec.partner,
                                isMale ? 'insert-as-mother' : 'insert-as-father'
                              );
                            }}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all flex items-center gap-2"
                          >
                            <Users className="w-4 h-4" />
                            {isMale ? 'إدراج كأم' : 'إدراج كأب'}
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveRecommendation(rec);
                            }}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-all flex items-center gap-2"
                          >
                            <Star className="w-4 h-4" />
                            حفظ
                          </button>
                          
                          {rec.partner.photoUrl && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(rec.partner.photoUrl, '_blank');
                              }}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              عرض الصورة
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-6 border-t bg-white">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-center sm:text-right">
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-blue-600" />
                  نظام ذكي يحلل أكثر من 20 معياراً وراثياً وأدائياً
                </p>
                {selectedType === 'inbreeding' && (
                  <p className="text-xs text-amber-600 mt-1 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    تركيز الدماء يتطلب خبرة ومتابعة دقيقة
                  </p>
                )}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setExpertMode(!expertMode)}
                  className={`px-4 py-2 rounded-lg transition-all font-medium flex items-center gap-2 ${
                    expertMode
                      ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  {expertMode ? 'وضع الخبير مفعّل' : 'تفعيل وضع الخبير'}
                </button>
                
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all font-medium"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BreedingRecommendationsModal;