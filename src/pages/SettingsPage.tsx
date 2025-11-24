import { useState } from "react";
import { motion } from "motion/react";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Lock,
  Globe,
  Eye,
  Shield,
  Smartphone,
  Mail,
  Moon,
  Languages,
  ChevronRight,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/useLanguage";

const content = {
  en: {
    settings: "Settings",
    account: "Account",
    notifications: "Notifications",
    privacy: "Privacy & Security",
    preferences: "Preferences",
    // Account
    accountInfo: "Account Information",
    fullName: "Full Name",
    email: "Email Address",
    phone: "Phone Number",
    username: "Username",
    changePassword: "Change Password",
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
    updateAccount: "Update Account",
    deleteAccount: "Delete Account",
    deleteWarning: "This action cannot be undone",
    // Notifications
    emailNotifications: "Email Notifications",
    pushNotifications: "Push Notifications",
    notifyReferrals: "Referral Updates",
    notifyReferralsDesc: "Get notified when someone uses your referral link",
    notifyRewards: "Reward Milestones",
    notifyRewardsDesc: "Receive updates on points and tier progression",
    notifyArtwork: "New Artwork Alerts",
    notifyArtworkDesc: "Be informed about new artworks from followed artists",
    notifyMessages: "Messages & Comments",
    notifyMessagesDesc: "Notifications for direct messages and comments",
    // Privacy
    privacySettings: "Privacy Settings",
    profileVisibility: "Profile Visibility",
    publicProfile: "Public Profile",
    privateProfile: "Private Profile",
    showEmail: "Show Email on Profile",
    showPhone: "Show Phone on Profile",
    showLocation: "Show Location on Profile",
    twoFactor: "Two-Factor Authentication",
    twoFactorDesc: "Add an extra layer of security to your account",
    enable2FA: "Enable 2FA",
    sessions: "Active Sessions",
    viewSessions: "View All Sessions",
    // Preferences
    language: "Language",
    english: "English",
    arabic: "العربية",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    auto: "Auto",
    timezone: "Timezone",
    currency: "Preferred Currency",
    // Messages
    saveSuccess: "Settings saved successfully!",
    passwordChanged: "Password changed successfully!",
    error: "Something went wrong. Please try again.",
  },
  ar: {
    settings: "الإعدادات",
    account: "الحساب",
    notifications: "الإشعارات",
    privacy: "الخصوصية والأمان",
    preferences: "التفضيلات",
    // Account
    accountInfo: "معلومات الحساب",
    fullName: "الاسم الكامل",
    email: "البريد الإلكتروني",
    phone: "رقم الهاتف",
    username: "اسم المستخدم",
    changePassword: "تغيير كلمة المرور",
    currentPassword: "كلمة المرور الحالية",
    newPassword: "كلمة المرور الجديدة",
    confirmPassword: "تأكيد كلمة المرور",
    updateAccount: "تحديث الحساب",
    deleteAccount: "حذف الحساب",
    deleteWarning: "لا يمكن التراجع عن هذا الإجراء",
    // Notifications
    emailNotifications: "إشعارات البريد الإلكتروني",
    pushNotifications: "الإشعارات الفورية",
    notifyReferrals: "تحديثات الإحالة",
    notifyReferralsDesc:
      "احصل على إشعار عندما يستخدم شخص ما رابط الإحالة الخاص بك",
    notifyRewards: "معالم المكافآت",
    notifyRewardsDesc: "تلقي تحديثات حول النقاط وتقدم المستوى",
    notifyArtwork: "تنبيهات الأعمال الفنية الجديدة",
    notifyArtworkDesc:
      "كن على اطلاع بالأعمال الفنية الجديدة من الفنانين المتابعين",
    notifyMessages: "الرسائل والتعليقات",
    notifyMessagesDesc: "إشعارات للرسائل المباشرة والتعليقات",
    // Privacy
    privacySettings: "إعدادات الخصوصية",
    profileVisibility: "رؤية الملف الشخصي",
    publicProfile: "ملف عام",
    privateProfile: "ملف خاص",
    showEmail: "إظهار البريد الإلكتروني في الملف الشخصي",
    showPhone: "إظهار الهاتف في الملف الشخصي",
    showLocation: "إظهار الموقع في الملف الشخصي",
    twoFactor: "المصادقة الثنائية",
    twoFactorDesc: "أضف طبقة أمان إضافية لحسابك",
    enable2FA: "تفعيل المصادقة الثنائية",
    sessions: "الجلسات النشطة",
    viewSessions: "عرض جميع الجلسات",
    // Preferences
    language: "اللغة",
    english: "English",
    arabic: "العربية",
    theme: "المظهر",
    light: "فاتح",
    dark: "داكن",
    auto: "تلقائي",
    timezone: "المنطقة الزمنية",
    currency: "العملة المفضلة",
    // Messages
    saveSuccess: "تم حفظ الإعدادات بنجاح!",
    passwordChanged: "تم تغيير كلمة المرور بنجاح!",
    error: "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
  },
};

export function SettingsPage() {
  const { language, setLanguage } = useLanguage();
  const t = content[language];
  const isRTL = language === "ar";

  // State for form fields
  const [fullName, setFullName] = useState("Sarah Al-Mansouri");
  const [email, setEmail] = useState("sarah@example.com");
  const [phone, setPhone] = useState("+971 50 123 4567");
  const [username, setUsername] = useState("@sarahart");

  // State for toggles
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [notifyReferrals, setNotifyReferrals] = useState(true);
  const [notifyRewards, setNotifyRewards] = useState(true);
  const [notifyArtwork, setNotifyArtwork] = useState(false);
  const [notifyMessages, setNotifyMessages] = useState(true);
  const [profilePublic, setProfilePublic] = useState(true);
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [showLocation, setShowLocation] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  const handleSaveAccount = () => {
    toast.success(t.saveSuccess);
  };

  const handleChangePassword = () => {
    toast.success(t.passwordChanged);
  };

  const handleLanguageChange = (newLanguage: "en" | "ar") => {
    setLanguage(newLanguage);
    toast.success(t.saveSuccess);
  };

  return (
    <DashboardLayout currentPage="settings">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mb-8 ${isRTL ? "text-right" : "text-left"}`}
      >
        <div
          className={`flex items-center gap-3 mb-2 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-[#d4af37] to-[#14b8a6] rounded-xl flex items-center justify-center">
            <SettingsIcon className="w-6 h-6 text-[#0f172a]" />
          </div>
          <h1 className="text-4xl text-[#fef3c7]">{t.settings}</h1>
        </div>
        <p className="text-[#cbd5e1]">
          {language === "en"
            ? "Manage your account settings and preferences"
            : "إدارة إعدادات حسابك وتفضيلاتك"}
        </p>
      </motion.div>

      {/* Settings Tabs */}
      <Tabs
        defaultValue="account"
        className="w-full"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <TabsList className="glass border border-[#334155] mb-6">
          <TabsTrigger value="account">
            <User className="w-4 h-4 mr-2" />
            {t.account}
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            {t.notifications}
          </TabsTrigger>
          <TabsTrigger value="privacy">
            <Lock className="w-4 h-4 mr-2" />
            {t.privacy}
          </TabsTrigger>
          <TabsTrigger value="preferences">
            <Globe className="w-4 h-4 mr-2" />
            {t.preferences}
          </TabsTrigger>
        </TabsList>

        {/* Account Tab */}
        <TabsContent value="account">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6"
          >
            <h2
              className={`text-2xl text-[#fef3c7] mb-6 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t.accountInfo}
            </h2>

            <div className="space-y-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={isRTL ? "text-right" : "text-left"}>
                  <Label htmlFor="fullName" className="text-[#cbd5e1]">
                    {t.fullName}
                  </Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-2 bg-[#1e293b] border-[#334155] text-[#fef3c7] focus:border-[#d4af37]"
                  />
                </div>

                <div className={isRTL ? "text-right" : "text-left"}>
                  <Label htmlFor="username" className="text-[#cbd5e1]">
                    {t.username}
                  </Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-2 bg-[#1e293b] border-[#334155] text-[#fef3c7] focus:border-[#d4af37]"
                  />
                </div>

                <div className={isRTL ? "text-right" : "text-left"}>
                  <Label htmlFor="email" className="text-[#cbd5e1]">
                    {t.email}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 bg-[#1e293b] border-[#334155] text-[#fef3c7] focus:border-[#d4af37]"
                  />
                </div>

                <div className={isRTL ? "text-right" : "text-left"}>
                  <Label htmlFor="phone" className="text-[#cbd5e1]">
                    {t.phone}
                  </Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-2 bg-[#1e293b] border-[#334155] text-[#fef3c7] focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <Button
                onClick={handleSaveAccount}
                className="bg-gradient-to-r from-[#d4af37] to-[#14b8a6] hover:from-[#14b8a6] hover:to-[#d4af37] text-[#0f172a]"
              >
                {t.updateAccount}
              </Button>
            </div>

            <Separator className="my-8 bg-[#334155]" />

            {/* Change Password Section */}
            <h3
              className={`text-xl text-[#fef3c7] mb-6 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t.changePassword}
            </h3>

            <div className="space-y-4 mb-6">
              <div className={isRTL ? "text-right" : "text-left"}>
                <Label htmlFor="currentPassword" className="text-[#cbd5e1]">
                  {t.currentPassword}
                </Label>
                <Input
                  id="currentPassword"
                  type="password"
                  className="mt-2 bg-[#1e293b] border-[#334155] text-[#fef3c7] focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={isRTL ? "text-right" : "text-left"}>
                  <Label htmlFor="newPassword" className="text-[#cbd5e1]">
                    {t.newPassword}
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    className="mt-2 bg-[#1e293b] border-[#334155] text-[#fef3c7] focus:border-[#d4af37]"
                  />
                </div>

                <div className={isRTL ? "text-right" : "text-left"}>
                  <Label htmlFor="confirmPassword" className="text-[#cbd5e1]">
                    {t.confirmPassword}
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    className="mt-2 bg-[#1e293b] border-[#334155] text-[#fef3c7] focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <Button
                onClick={handleChangePassword}
                variant="outline"
                className="border-[#14b8a6] text-[#14b8a6] hover:bg-[#14b8a6]/10"
              >
                {t.changePassword}
              </Button>
            </div>

            <Separator className="my-8 bg-[#334155]" />

            {/* Delete Account */}
            <div
              className={`p-4 bg-destructive/10 border border-destructive/30 rounded-xl ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              <h4 className="text-destructive mb-2">{t.deleteAccount}</h4>
              <p className="text-sm text-[#cbd5e1] mb-4">{t.deleteWarning}</p>
              <Button variant="destructive" size="sm">
                {t.deleteAccount}
              </Button>
            </div>
          </motion.div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6"
          >
            <div className="space-y-6">
              {/* Email Notifications */}
              <div
                className={`flex items-center justify-between p-4 bg-[#1e293b]/50 rounded-xl ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`flex items-center gap-3 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <Mail className="w-5 h-5 text-[#d4af37]" />
                  <div className={isRTL ? "text-right" : "text-left"}>
                    <p className="text-[#fef3c7]">{t.emailNotifications}</p>
                  </div>
                </div>
                <Switch
                  checked={emailNotifs}
                  onCheckedChange={setEmailNotifs}
                />
              </div>

              {/* Push Notifications */}
              <div
                className={`flex items-center justify-between p-4 bg-[#1e293b]/50 rounded-xl ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`flex items-center gap-3 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-[#14b8a6]" />
                  <div className={isRTL ? "text-right" : "text-left"}>
                    <p className="text-[#fef3c7]">{t.pushNotifications}</p>
                  </div>
                </div>
                <Switch checked={pushNotifs} onCheckedChange={setPushNotifs} />
              </div>

              <Separator className="bg-[#334155]" />

              {/* Specific Notification Settings */}
              <div
                className={`flex items-center justify-between p-4 bg-[#1e293b]/30 rounded-xl ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <div className={isRTL ? "text-right" : "text-left"}>
                  <p className="text-[#fef3c7]">{t.notifyReferrals}</p>
                  <p className="text-sm text-[#cbd5e1]">
                    {t.notifyReferralsDesc}
                  </p>
                </div>
                <Switch
                  checked={notifyReferrals}
                  onCheckedChange={setNotifyReferrals}
                />
              </div>

              <div
                className={`flex items-center justify-between p-4 bg-[#1e293b]/30 rounded-xl ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <div className={isRTL ? "text-right" : "text-left"}>
                  <p className="text-[#fef3c7]">{t.notifyRewards}</p>
                  <p className="text-sm text-[#cbd5e1]">
                    {t.notifyRewardsDesc}
                  </p>
                </div>
                <Switch
                  checked={notifyRewards}
                  onCheckedChange={setNotifyRewards}
                />
              </div>

              <div
                className={`flex items-center justify-between p-4 bg-[#1e293b]/30 rounded-xl ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <div className={isRTL ? "text-right" : "text-left"}>
                  <p className="text-[#fef3c7]">{t.notifyArtwork}</p>
                  <p className="text-sm text-[#cbd5e1]">
                    {t.notifyArtworkDesc}
                  </p>
                </div>
                <Switch
                  checked={notifyArtwork}
                  onCheckedChange={setNotifyArtwork}
                />
              </div>

              <div
                className={`flex items-center justify-between p-4 bg-[#1e293b]/30 rounded-xl ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <div className={isRTL ? "text-right" : "text-left"}>
                  <p className="text-[#fef3c7]">{t.notifyMessages}</p>
                  <p className="text-sm text-[#cbd5e1]">
                    {t.notifyMessagesDesc}
                  </p>
                </div>
                <Switch
                  checked={notifyMessages}
                  onCheckedChange={setNotifyMessages}
                />
              </div>
            </div>
          </motion.div>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6"
          >
            <h2
              className={`text-2xl text-[#fef3c7] mb-6 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t.privacySettings}
            </h2>

            <div className="space-y-6">
              {/* Profile Visibility */}
              <div
                className={`flex items-center justify-between p-4 bg-[#1e293b]/50 rounded-xl ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`flex items-center gap-3 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <Eye className="w-5 h-5 text-[#d4af37]" />
                  <div className={isRTL ? "text-right" : "text-left"}>
                    <p className="text-[#fef3c7]">{t.profileVisibility}</p>
                    <p className="text-sm text-[#cbd5e1]">
                      {profilePublic ? t.publicProfile : t.privateProfile}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={profilePublic}
                  onCheckedChange={setProfilePublic}
                />
              </div>

              <Separator className="bg-[#334155]" />

              {/* Privacy Toggles */}
              <div
                className={`flex items-center justify-between p-4 bg-[#1e293b]/30 rounded-xl ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <div className={isRTL ? "text-right" : "text-left"}>
                  <p className="text-[#fef3c7]">{t.showEmail}</p>
                </div>
                <Switch checked={showEmail} onCheckedChange={setShowEmail} />
              </div>

              <div
                className={`flex items-center justify-between p-4 bg-[#1e293b]/30 rounded-xl ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <div className={isRTL ? "text-right" : "text-left"}>
                  <p className="text-[#fef3c7]">{t.showPhone}</p>
                </div>
                <Switch checked={showPhone} onCheckedChange={setShowPhone} />
              </div>

              <div
                className={`flex items-center justify-between p-4 bg-[#1e293b]/30 rounded-xl ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <div className={isRTL ? "text-right" : "text-left"}>
                  <p className="text-[#fef3c7]">{t.showLocation}</p>
                </div>
                <Switch
                  checked={showLocation}
                  onCheckedChange={setShowLocation}
                />
              </div>

              <Separator className="bg-[#334155]" />

              {/* Two-Factor Authentication */}
              <div
                className={`p-4 bg-gradient-to-br from-[#14b8a6]/20 to-[#0ea5e9]/20 border border-[#14b8a6]/30 rounded-xl ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`flex items-center gap-3 mb-3 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <Shield className="w-6 h-6 text-[#14b8a6]" />
                  <div>
                    <h3 className="text-[#fef3c7]">{t.twoFactor}</h3>
                    <p className="text-sm text-[#cbd5e1]">{t.twoFactorDesc}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="border-[#14b8a6] text-[#14b8a6] hover:bg-[#14b8a6]/10"
                  onClick={() => setTwoFactor(!twoFactor)}
                >
                  {twoFactor ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      {language === "en" ? "Enabled" : "مفعّل"}
                    </>
                  ) : (
                    <>{t.enable2FA}</>
                  )}
                </Button>
              </div>

              {/* Active Sessions */}
              <div
                className={`p-4 bg-[#1e293b]/50 rounded-xl ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                <h3 className="text-[#fef3c7] mb-2">{t.sessions}</h3>
                <p className="text-sm text-[#cbd5e1] mb-4">
                  {language === "en"
                    ? "Manage devices where you're logged in"
                    : "إدارة الأجهزة التي قمت بتسجيل الدخول منها"}
                </p>
                <Button
                  variant="outline"
                  className="border-[#334155] text-[#cbd5e1]"
                >
                  {t.viewSessions}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6"
          >
            <div className="space-y-6">
              {/* Language */}
              <div className={isRTL ? "text-right" : "text-left"}>
                <Label className="text-[#cbd5e1] mb-2 flex items-center gap-2">
                  <Languages className="w-5 h-5 text-[#d4af37]" />
                  {t.language}
                </Label>
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="bg-[#1e293b] border-[#334155] text-[#fef3c7]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">{t.english}</SelectItem>
                    <SelectItem value="ar">{t.arabic}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Theme */}
              <div className={isRTL ? "text-right" : "text-left"}>
                <Label className="text-[#cbd5e1] mb-2 flex items-center gap-2">
                  <Moon className="w-5 h-5 text-[#14b8a6]" />
                  {t.theme}
                </Label>
                <Select defaultValue="dark">
                  <SelectTrigger className="bg-[#1e293b] border-[#334155] text-[#fef3c7]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">{t.light}</SelectItem>
                    <SelectItem value="dark">{t.dark}</SelectItem>
                    <SelectItem value="auto">{t.auto}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Timezone */}
              <div className={isRTL ? "text-right" : "text-left"}>
                <Label className="text-[#cbd5e1] mb-2 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#8b5cf6]" />
                  {t.timezone}
                </Label>
                <Select defaultValue="dubai">
                  <SelectTrigger className="bg-[#1e293b] border-[#334155] text-[#fef3c7]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dubai">Dubai (UTC+4)</SelectItem>
                    <SelectItem value="riyadh">Riyadh (UTC+3)</SelectItem>
                    <SelectItem value="cairo">Cairo (UTC+2)</SelectItem>
                    <SelectItem value="london">London (UTC+0)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Currency */}
              <div className={isRTL ? "text-right" : "text-left"}>
                <Label className="text-[#cbd5e1] mb-2 flex items-center gap-2">
                  <span className="text-[#0ea5e9]">💰</span>
                  {t.currency}
                </Label>
                <Select defaultValue="aed">
                  <SelectTrigger className="bg-[#1e293b] border-[#334155] text-[#fef3c7]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aed">AED (د.إ)</SelectItem>
                    <SelectItem value="sar">SAR (ر.س)</SelectItem>
                    <SelectItem value="usd">USD ($)</SelectItem>
                    <SelectItem value="eur">EUR (€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={() => toast.success(t.saveSuccess)}
                className="bg-gradient-to-r from-[#d4af37] to-[#14b8a6] hover:from-[#14b8a6] hover:to-[#d4af37] text-[#0f172a] w-full md:w-auto"
              >
                {language === "en" ? "Save Preferences" : "حفظ التفضيلات"}
              </Button>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
