import { motion } from 'motion/react';
import { TrendingUp, BarChart3, DollarSign, TrendingDown } from 'lucide-react';
import { Badge } from '../../ui/badge';
import { useLanguage } from '@/contexts/useLanguage';

const content = {
  en: {
    title: "Market Insights",
    subtitle: "Latest trends in the MENA art market",
    trending: "Trending",
    avgPrice: "Avg Price",
    growth: "Growth",
    insights: [
      {
        id: 1,
        category: "Contemporary Art",
        trend: "up",
        percentage: "+18%",
        avgPrice: "$4,200",
        description: "Growing demand for contemporary Gulf artists"
      },
      {
        id: 2,
        category: "Digital Art",
        trend: "up",
        percentage: "+32%",
        avgPrice: "$2,800",
        description: "Digital art market expanding rapidly"
      },
      {
        id: 3,
        category: "Photography",
        trend: "neutral",
        percentage: "+5%",
        avgPrice: "$1,500",
        description: "Steady interest in documentary photography"
      },
      {
        id: 4,
        category: "Sculpture",
        trend: "down",
        percentage: "-3%",
        avgPrice: "$8,900",
        description: "Temporary dip in sculptural works"
      }
    ]
  },
  ar: {
    title: "رؤى السوق",
    subtitle: "أحدث الاتجاهات في سوق الفن في منطقة الشرق الأوسط",
    trending: "رائج",
    avgPrice: "متوسط السعر",
    growth: "النمو",
    insights: [
      {
        id: 1,
        category: "الفن المعاصر",
        trend: "up",
        percentage: "+18%",
        avgPrice: "$4,200",
        description: "طلب متزايد على الفنانين الخليجيين المعاصرين"
      },
      {
        id: 2,
        category: "الفن الرقمي",
        trend: "up",
        percentage: "+32%",
        avgPrice: "$2,800",
        description: "سوق الفن الرقمي يتوسع بسرعة"
      },
      {
        id: 3,
        category: "التصوير الفوتوغرافي",
        trend: "neutral",
        percentage: "+5%",
        avgPrice: "$1,500",
        description: "اهتمام ثابت بالتصوير الوثائقي"
      },
      {
        id: 4,
        category: "النحت",
        trend: "down",
        percentage: "-3%",
        avgPrice: "$8,900",
        description: "انخفاض مؤقت في الأعمال النحتية"
      }
    ]
  }
};

export function MarketInsights() {
  const { language } = useLanguage();
  const t = content[language];
  const isRTL = language === 'ar';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6 border border-[#45e3d3]/20"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className={`flex items-center gap-3 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#45e3d3] to-[#3bc4b5] flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-[#020e27]" />
        </div>
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h2 className="text-2xl text-[#ffffff]">{t.title}</h2>
          <p className="text-sm text-[#808c99]">{t.subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {t.insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ x: isRTL ? -5 : 5 }}
            className="bg-[#0f021c] rounded-xl p-4 border border-[#4e4e4e78] hover:border-[#45e3d3]/30 transition-all"
          >
            <div className={`flex items-start justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h3 className="text-[#ffffff] mb-1">{insight.category}</h3>
                <p className="text-xs text-[#808c99]">{insight.description}</p>
              </div>
              <div className={`flex items-center gap-1 ${
                insight.trend === 'up' 
                  ? 'text-[#45e3d3]' 
                  : insight.trend === 'down'
                  ? 'text-[#f87171]'
                  : 'text-[#ffcc33]'
              }`}>
                {insight.trend === 'up' ? (
                  <TrendingUp className="w-5 h-5" />
                ) : insight.trend === 'down' ? (
                  <TrendingDown className="w-5 h-5" />
                ) : (
                  <BarChart3 className="w-5 h-5" />
                )}
              </div>
            </div>

            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <DollarSign className="w-4 h-4 text-[#808c99]" />
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <p className="text-xs text-[#808c99]">{t.avgPrice}</p>
                  <p className="text-[#ffcc33]">{insight.avgPrice}</p>
                </div>
              </div>
              <div className="flex-1" />
              <Badge className={`${
                insight.trend === 'up'
                  ? 'bg-[#45e3d3]/20 text-[#45e3d3] border-[#45e3d3]/30'
                  : insight.trend === 'down'
                  ? 'bg-[#f87171]/20 text-[#f87171] border-[#f87171]/30'
                  : 'bg-[#ffcc33]/20 text-[#ffcc33] border-[#ffcc33]/30'
              }`}>
                {insight.percentage}
              </Badge>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

