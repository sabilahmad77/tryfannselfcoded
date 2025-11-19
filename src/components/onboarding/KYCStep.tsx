import { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Upload, FileText, CheckCircle, ArrowRight, ChevronLeft, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import type { OnboardingData } from './OnboardingFlow';

interface KYCStepProps {
  language: 'en' | 'ar';
  onNext: (data: Record<string, unknown>) => void;
  onBack?: () => void;
  data: OnboardingData;
}

export function KYCStep({ language, onNext, onBack }: KYCStepProps) {
  const [formData, setFormData] = useState({
    idType: '',
    idNumber: '',
    dateOfBirth: '',
    nationality: '',
    address: '',
    city: '',
    postalCode: '',
    idDocument: null as File | null,
    proofOfAddress: null as File | null,
  });

  const [acceptedCompliance, setAcceptedCompliance] = useState(false);

  const isRTL = language === 'ar';

  const t = {
    en: {
      title: 'Identity Verification',
      subtitle: 'Required for KYC compliance and platform security',
      notice: {
        title: 'Why do we need this?',
        points: [
          'Regulatory compliance in MENA/GCC region',
          'Prevent fraud and ensure platform security',
          'Enable high-value transactions',
          'Protect all community members',
        ],
      },
      idType: {
        label: 'ID Type',
        placeholder: 'Select ID type',
        options: [
          { value: 'passport', label: 'Passport' },
          { value: 'national_id', label: 'National ID' },
          { value: 'emirates_id', label: 'Emirates ID' },
          { value: 'iqama', label: 'Iqama (Saudi Residency)' },
          { value: 'drivers_license', label: 'Driver\'s License' },
        ],
      },
      idNumber: 'ID Number',
      idNumberPlaceholder: 'Enter your ID number',
      dateOfBirth: 'Date of Birth',
      nationality: {
        label: 'Nationality',
        placeholder: 'Select your nationality',
      },
      address: 'Street Address',
      addressPlaceholder: 'Your residential address',
      city: 'City',
      cityPlaceholder: 'Your city',
      postalCode: 'Postal Code',
      postalCodePlaceholder: 'Postal/ZIP code',
      documents: {
        title: 'Upload Documents',
        idDocument: {
          label: 'Government-issued ID',
          desc: 'Clear photo or scan of your ID (front and back)',
        },
        proofOfAddress: {
          label: 'Proof of Address',
          desc: 'Utility bill or bank statement (not older than 3 months)',
        },
        uploadButton: 'Click to upload',
        formats: 'PDF, PNG, JPG up to 10MB',
      },
      compliance: {
        title: 'Data Privacy & Compliance',
        text: 'I consent to the processing of my personal data for KYC verification purposes and understand that my information will be stored securely in accordance with GDPR and local regulations.',
      },
      security: {
        title: 'Your data is secure',
        features: [
          'End-to-end encryption',
          'GDPR compliant',
          'Secure storage',
          'Never shared',
        ],
      },
      skipForNow: 'Skip for now (Limited access)',
      back: 'Back',
      continue: 'Verify & Continue',
    },
    ar: {
      title: 'التحقق من الهوية',
      subtitle: 'مطلوب للامتثال لمعرفة العميل وأمان المنصة',
      notice: {
        title: 'لماذا نحتاج هذا؟',
        points: [
          'الامتثال التنظيمي في منطقة الشرق الأوسط وشمال أفريقيا ودول مجلس التعاون الخليجي',
          'منع الاحتيال وضمان أمن المنصة',
          'تمكين المعاملات عالية القيمة',
          'حماية جميع أعضاء المجتمع',
        ],
      },
      idType: {
        label: 'نوع الهوية',
        placeholder: 'اختر نوع الهوية',
        options: [
          { value: 'passport', label: 'جواز السفر' },
          { value: 'national_id', label: 'الهوية الوطنية' },
          { value: 'emirates_id', label: 'الهوية الإماراتية' },
          { value: 'iqama', label: 'الإقامة (السعودية)' },
          { value: 'drivers_license', label: 'رخصة القيادة' },
        ],
      },
      idNumber: 'رقم الهوية',
      idNumberPlaceholder: 'أدخل رقم هويتك',
      dateOfBirth: 'تاريخ الميلاد',
      nationality: {
        label: 'الجنسية',
        placeholder: 'اختر جنسيتك',
      },
      address: 'عنوان الشارع',
      addressPlaceholder: 'عنوان سكنك',
      city: 'المدينة',
      cityPlaceholder: 'مدينتك',
      postalCode: 'الرمز البريدي',
      postalCodePlaceholder: 'الرمز البريدي',
      documents: {
        title: 'تحميل المستندات',
        idDocument: {
          label: 'هوية صادرة عن الحكومة',
          desc: 'صورة واضحة أو مسح ضوئي لهويتك (الأمام والخلف)',
        },
        proofOfAddress: {
          label: 'إثبات العنوان',
          desc: 'فاتورة المرافق أو كشف حساب بنكي (لا يزيد عمره عن 3 أشهر)',
        },
        uploadButton: 'انقر للتحميل',
        formats: 'PDF، PNG، JPG حتى 10 ميجابايت',
      },
      compliance: {
        title: 'خصوصية البيانات والامتثال',
        text: 'أوافق على معالجة بياناتي الشخصية لأغراض التحقق من معرفة العميل وأفهم أن معلوماتي ستُخزن بشكل آمن وفقاً للائحة العامة لحماية البيانات (GDPR) واللوائح المحلية.',
      },
      security: {
        title: 'بياناتك آمنة',
        features: [
          'تشفير من طرف إلى طرف',
          'متوافق مع GDPR',
          'تخزين آمن',
          'لن يتم مشاركتها أبداً',
        ],
      },
      skipForNow: 'تخطي الآن (وصول محدود)',
      back: 'رجوع',
      continue: 'التحقق والمتابعة',
    },
  };

  const content = t[language];

  const handleSubmit = () => {
    if (!acceptedCompliance) return;
    onNext(formData);
  };

  const handleSkip = () => {
    onNext({ skipped: true });
  };

  return (
    <div className="glass border border-white/10 rounded-3xl p-8 md:p-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center">
            <Shield className="w-8 h-8 text-amber-400" />
          </div>
          <h2 className="text-3xl text-white mb-2">{content.title}</h2>
          <p className="text-white/60">{content.subtitle}</p>
        </motion.div>

        {/* Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 p-6 rounded-xl bg-blue-500/10 border border-blue-500/30"
        >
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
            <h3 className="text-blue-400">{content.notice.title}</h3>
          </div>
          <ul className="space-y-2 ml-8">
            {content.notice.points.map((point, index) => (
              <li key={index} className="text-white/60 text-sm flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <div className="space-y-6">
          {/* ID Type & Number */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <Label className="text-white/80">{content.idType.label}</Label>
              <Select value={formData.idType} onValueChange={(value: string) => setFormData({ ...formData, idType: value })}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white h-12">
                  <SelectValue placeholder={content.idType.placeholder} />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a24] border-white/10">
                  {content.idType.options.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-white focus:bg-amber-500/10">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <Label htmlFor="idNumber" className="text-white/80">{content.idNumber}</Label>
              <Input
                id="idNumber"
                value={formData.idNumber}
                onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                placeholder={content.idNumberPlaceholder}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12 focus:border-amber-500/50 focus:ring-amber-500/20"
              />
            </motion.div>
          </div>

          {/* Date of Birth & Nationality */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <Label htmlFor="dateOfBirth" className="text-white/80">{content.dateOfBirth}</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="bg-white/5 border-white/10 text-white h-12 focus:border-amber-500/50 focus:ring-amber-500/20"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-2"
            >
              <Label className="text-white/80">{content.nationality.label}</Label>
              <Input
                value={formData.nationality}
                onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                placeholder={content.nationality.placeholder}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12 focus:border-amber-500/50 focus:ring-amber-500/20"
              />
            </motion.div>
          </div>

          {/* Address */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-2"
          >
            <Label htmlFor="address" className="text-white/80">{content.address}</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder={content.addressPlaceholder}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12 focus:border-amber-500/50 focus:ring-amber-500/20"
            />
          </motion.div>

          {/* City & Postal Code */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-2"
            >
              <Label htmlFor="city" className="text-white/80">{content.city}</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder={content.cityPlaceholder}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12 focus:border-amber-500/50 focus:ring-amber-500/20"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-2"
            >
              <Label htmlFor="postalCode" className="text-white/80">{content.postalCode}</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                placeholder={content.postalCodePlaceholder}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12 focus:border-amber-500/50 focus:ring-amber-500/20"
              />
            </motion.div>
          </div>

          {/* Document Uploads */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="space-y-4"
          >
            <h3 className="text-white text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              {content.documents.title}
            </h3>

            {/* ID Document */}
            <div className="p-6 rounded-xl glass border border-white/10">
              <Label className="text-white/80 mb-2 block">{content.documents.idDocument.label}</Label>
              <p className="text-white/50 text-sm mb-4">{content.documents.idDocument.desc}</p>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="border-amber-500/30 hover:border-amber-500/50 hover:bg-amber-500/10 text-white/70 hover:text-white"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {content.documents.uploadButton}
                </Button>
                <span className="text-xs text-white/40">{content.documents.formats}</span>
              </div>
            </div>

            {/* Proof of Address */}
            <div className="p-6 rounded-xl glass border border-white/10">
              <Label className="text-white/80 mb-2 block">{content.documents.proofOfAddress.label}</Label>
              <p className="text-white/50 text-sm mb-4">{content.documents.proofOfAddress.desc}</p>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="border-amber-500/30 hover:border-amber-500/50 hover:bg-amber-500/10 text-white/70 hover:text-white"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {content.documents.uploadButton}
                </Button>
                <span className="text-xs text-white/40">{content.documents.formats}</span>
              </div>
            </div>
          </motion.div>

          {/* Security Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="p-6 rounded-xl bg-green-500/10 border border-green-500/30"
          >
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-green-400" />
              <h3 className="text-green-400">{content.security.title}</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {content.security.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-white/60 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Compliance Checkbox */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="p-6 rounded-xl glass border border-white/10"
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="compliance"
                checked={acceptedCompliance}
                onChange={(e) => setAcceptedCompliance(e.target.checked)}
                aria-labelledby="compliance-label"
                title={content.compliance.title}
                className="mt-1 w-5 h-5 rounded border-white/20 bg-white/5 checked:bg-amber-500 checked:border-amber-500"
              />
              <div>
                <Label htmlFor="compliance" className="text-white/80 cursor-pointer mb-1 block">
                  {content.compliance.title}
                </Label>
                <p className="text-white/60 text-sm leading-relaxed">{content.compliance.text}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="space-y-4 pt-8"
        >
          <div className="flex gap-4">
            {onBack && (
              <Button
                type="button"
                onClick={onBack}
                variant="outline"
                className="flex-1 h-12 border-white/20 hover:border-amber-500/50 hover:bg-amber-500/10 text-white/70 hover:text-white"
              >
                <ChevronLeft className={`w-5 h-5 mr-2 ${isRTL ? 'rotate-180' : ''}`} />
                {content.back}
              </Button>
            )}
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!acceptedCompliance}
              className="flex-1 h-12 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 text-black shadow-lg shadow-amber-500/50 group relative overflow-hidden disabled:opacity-50"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {content.continue}
                <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
              </span>
            </Button>
          </div>

          <Button
            type="button"
            onClick={handleSkip}
            variant="ghost"
            className="w-full text-white/50 hover:text-white/70 hover:bg-transparent"
          >
            {content.skipForNow}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
