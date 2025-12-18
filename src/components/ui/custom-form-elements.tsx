import * as React from "react";
import { LucideIcon, Eye, EyeOff, X, Upload, FileText } from "lucide-react";
import { Input } from "./input";
import { Label } from "./label";
import { Textarea } from "./textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Switch } from "./switch";
import { cn } from "./utils";

// ============================================================================
// Base Field Wrapper Props
// ============================================================================

export interface BaseFieldProps {
  /** Field label text or ReactNode */
  label?: React.ReactNode;
  /** Field label HTML element ID */
  htmlFor?: string;
  /** Error message to display */
  error?: string;
  /** Helper text to display below the field */
  helperText?: string;
  /** Whether the field is required */
  required?: boolean;
  /** RTL support - if true, shows Arabic optional text */
  isRTL?: boolean;
  /** Hide optional text even when field is not required */
  hideOptional?: boolean;
  /** Custom className for the wrapper */
  className?: string;
  /** Custom className for the label */
  labelClassName?: string;
  /** Custom className for the input/select */
  inputClassName?: string;
}

// ============================================================================
// Input Field Component
// ============================================================================

export interface InputFieldProps
  extends Omit<React.ComponentProps<"input">, "className">,
    BaseFieldProps {
  /** Optional icon to display on the left (LTR) or right (RTL) */
  icon?: LucideIcon;
  /** Icon position - 'left' for LTR, 'right' for RTL (auto-adjusted based on isRTL) */
  iconPosition?: "left" | "right";
  /** Custom icon className */
  iconClassName?: string;
}

/**
 * Reusable Input Field component with icon support and RTL compatibility
 *
 * @example
 * ```tsx
 * <InputField
 *   label="Email"
 *   type="email"
 *   placeholder="your.email@example.com"
 *   icon={Mail}
 *   isRTL={false}
 *   required
 * />
 * ```
 */
export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      htmlFor,
      error,
      helperText,
      required,
      isRTL = false,
      hideOptional = false,
      icon: Icon,
      iconPosition,
      className,
      labelClassName,
      inputClassName,
      iconClassName,
      id,
      ...inputProps
    },
    ref
  ) => {
    const generatedId = React.useId();
    const fieldId = id || htmlFor || generatedId;
    const effectiveIconPosition = iconPosition || (isRTL ? "right" : "left");
    const hasIcon = !!Icon;
    const hasError = !!error;

    // Determine optional text based on isRTL
    const optionalText = isRTL ? "(اختياري)" : "(Optional)";

    // Extract ref from inputProps if it comes from react-hook-form register
    const { ref: registerRef, ...restInputProps } = inputProps as {
      ref?: React.Ref<HTMLInputElement>;
    } & typeof inputProps;

    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <Label
            htmlFor={fieldId}
            className={cn(
              "text-[#ffffff]/80",
              hasError && "text-destructive",
              labelClassName
            )}
          >
            {label}
            {required ? (
              <span className="text-red-500">*</span>
            ) : !hideOptional ? (
              <span className="opacity-50 text-xs ml-1">{optionalText}</span>
            ) : null}
          </Label>
        )}

        <div className="relative">
          {hasIcon && effectiveIconPosition === (isRTL ? "right" : "left") && (
            <Icon
              className={cn(
                "absolute top-1/2 -translate-y-1/2 w-5 h-5 text-[#ffffff]/40 pointer-events-none",
                isRTL ? "right-3" : "left-3",
                iconClassName
              )}
            />
          )}

          <Input
            ref={registerRef || ref}
            id={fieldId}
            className={cn(
              "bg-background border-[#ffcc33]/20 text-[#ffffff] placeholder:text-[#ffffff]/30 h-11",
              "focus:border-[#ffcc33]/50 focus:ring-[#ffcc33]/20",
              hasError &&
                "border-destructive focus:border-destructive focus:ring-destructive/20",
              hasIcon &&
                effectiveIconPosition === (isRTL ? "right" : "left") &&
                (isRTL ? "pr-10" : "pl-10"),
              hasIcon &&
                effectiveIconPosition === (isRTL ? "left" : "right") &&
                (isRTL ? "pl-10" : "pr-10"),
              inputClassName
            )}
            aria-invalid={hasError}
            aria-describedby={
              error
                ? `${fieldId}-error`
                : helperText
                ? `${fieldId}-helper`
                : undefined
            }
            required={required}
            {...restInputProps}
          />

          {hasIcon && effectiveIconPosition === (isRTL ? "left" : "right") && (
            <Icon
              className={cn(
                "absolute top-1/2 -translate-y-1/2 w-5 h-5 text-[#ffffff]/40 pointer-events-none",
                isRTL ? "left-3" : "right-3",
                iconClassName
              )}
            />
          )}
        </div>

        {error && (
          <p
            id={`${fieldId}-error`}
            className="text-sm text-destructive"
            role="alert"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={`${fieldId}-helper`} className="text-sm text-[#ffffff]/60">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";

// ============================================================================
// Password Field Component
// ============================================================================

export interface PasswordFieldProps
  extends Omit<React.ComponentProps<"input">, "type" | "className">,
    BaseFieldProps {
  /** Optional icon to display on the left (LTR) or right (RTL) */
  icon?: LucideIcon;
  /** Icon position - 'left' for LTR, 'right' for RTL (auto-adjusted based on isRTL) */
  iconPosition?: "left" | "right";
  /** Custom icon className */
  iconClassName?: string;
  /** Show password toggle button */
  showToggle?: boolean;
  /** Controlled show password state (if not provided, uses internal state) */
  showPassword?: boolean;
  /** Callback when show password state changes */
  onShowPasswordChange?: (show: boolean) => void;
  /** Custom className for the toggle button */
  toggleButtonClassName?: string;
}

/**
 * Reusable Password Field component with show/hide toggle and RTL compatibility
 *
 * @example
 * ```tsx
 * <PasswordField
 *   label="Password"
 *   placeholder="Enter your password"
 *   icon={Lock}
 *   isRTL={false}
 *   showToggle
 *   required
 * />
 * ```
 */
export const PasswordField = React.forwardRef<
  HTMLInputElement,
  PasswordFieldProps
>(
  (
    {
      label,
      htmlFor,
      error,
      helperText,
      required,
      isRTL = false,
      hideOptional = false,
      icon: Icon,
      iconPosition,
      className,
      labelClassName,
      inputClassName,
      iconClassName,
      toggleButtonClassName,
      showToggle = true,
      showPassword: controlledShowPassword,
      onShowPasswordChange,
      id,
      ...inputProps
    },
    ref
  ) => {
    const generatedId = React.useId();
    const fieldId = id || htmlFor || generatedId;
    const [internalShowPassword, setInternalShowPassword] =
      React.useState(false);
    const isControlled = controlledShowPassword !== undefined;
    const showPassword = isControlled
      ? controlledShowPassword
      : internalShowPassword;
    const hasIcon = !!Icon;
    const hasError = !!error;
    const effectiveIconPosition = iconPosition || (isRTL ? "right" : "left");

    // Determine optional text based on isRTL
    const optionalText = isRTL ? "(اختياري)" : "(Optional)";

    // Extract ref from inputProps if it comes from react-hook-form register
    const { ref: registerRef, ...restInputProps } = inputProps as {
      ref?: React.Ref<HTMLInputElement>;
    } & typeof inputProps;

    const handleTogglePassword = () => {
      const newValue = !showPassword;
      if (isControlled) {
        onShowPasswordChange?.(newValue);
      } else {
        setInternalShowPassword(newValue);
      }
    };

    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <Label
            htmlFor={fieldId}
            className={cn(
              "text-[#ffffff]/80",
              hasError && "text-destructive",
              labelClassName
            )}
          >
            {label}
            {required ? (
              <span className="text-red-500">*</span>
            ) : !hideOptional ? (
              <span className="opacity-50 text-xs ml-1">{optionalText}</span>
            ) : null}
          </Label>
        )}

        <div className="relative">
          {hasIcon && effectiveIconPosition === (isRTL ? "right" : "left") && (
            <Icon
              className={cn(
                "absolute top-1/2 -translate-y-1/2 w-5 h-5 text-[#ffffff]/40 pointer-events-none",
                isRTL ? "right-3" : "left-3",
                iconClassName
              )}
            />
          )}

          <Input
            ref={registerRef || ref}
            id={fieldId}
            type={showPassword ? "text" : "password"}
            className={cn(
              "bg-background border-[#ffcc33]/20 text-[#ffffff] placeholder:text-[#ffffff]/30 h-11",
              "focus:border-[#ffcc33]/50 focus:ring-[#ffcc33]/20",
              hasError &&
                "border-destructive focus:border-destructive focus:ring-destructive/20",
              // Icon padding (left side for LTR, right side for RTL)
              hasIcon &&
                effectiveIconPosition === (isRTL ? "right" : "left") &&
                (isRTL ? "pr-10" : "pl-10"),
              // Toggle padding (right side for LTR, left side for RTL)
              showToggle && (isRTL ? "pl-10" : "pr-10"),
              inputClassName
            )}
            aria-invalid={hasError}
            aria-describedby={
              error
                ? `${fieldId}-error`
                : helperText
                ? `${fieldId}-helper`
                : undefined
            }
            required={required}
            {...restInputProps}
          />

          {showToggle && (
            <button
              type="button"
              onClick={handleTogglePassword}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 text-[#ffffff]/40 hover:text-[#ffffff]/60 transition-colors",
                isRTL ? "left-3" : "right-3",
                toggleButtonClassName
              )}
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={0}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}

          {hasIcon && effectiveIconPosition === (isRTL ? "left" : "right") && (
            <Icon
              className={cn(
                "absolute top-1/2 -translate-y-1/2 w-5 h-5 text-[#ffffff]/40 pointer-events-none",
                showToggle
                  ? isRTL
                    ? "right-10"
                    : "left-10"
                  : isRTL
                  ? "right-3"
                  : "left-3",
                iconClassName
              )}
            />
          )}
        </div>

        {error && (
          <p
            id={`${fieldId}-error`}
            className="text-sm text-destructive"
            role="alert"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={`${fieldId}-helper`} className="text-sm text-[#ffffff]/60">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

PasswordField.displayName = "PasswordField";

// ============================================================================
// Select Field Component
// ============================================================================

export interface SelectFieldOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectFieldProps
  extends Omit<React.ComponentProps<typeof Select>, "className">,
    BaseFieldProps {
  /** Options for the select dropdown */
  options: SelectFieldOption[];
  /** Placeholder text */
  placeholder?: string;
  /** Optional icon to display on the left (LTR) or right (RTL) */
  icon?: LucideIcon;
  /** Icon position - 'left' for LTR, 'right' for RTL (auto-adjusted based on isRTL) */
  iconPosition?: "left" | "right";
  /** Custom icon className */
  iconClassName?: string;
  /** Custom className for SelectTrigger */
  triggerClassName?: string;
  /** Custom className for SelectContent */
  contentClassName?: string;
  /** Custom className for SelectItem */
  itemClassName?: string;
  /** Field ID */
  id?: string;
  /** Disable clear button (useful for required fields that cannot be null) */
  disableClear?: boolean;
}

/**
 * Reusable Select Field component with icon support and RTL compatibility
 *
 * @example
 * ```tsx
 * <SelectField
 *   label="Region"
 *   placeholder="Select your region"
 *   icon={MapPin}
 *   options={[
 *     { value: 'uae', label: 'UAE' },
 *     { value: 'saudi', label: 'Saudi Arabia' }
 *   ]}
 *   isRTL={false}
 * />
 * ```
 */
export const SelectField = React.forwardRef<
  React.ElementRef<typeof SelectTrigger>,
  SelectFieldProps
>(
  (
    {
      label,
      htmlFor,
      error,
      helperText,
      required,
      isRTL = false,
      hideOptional = false,
      icon: Icon,
      iconPosition,
      className,
      labelClassName,
      inputClassName,
      iconClassName,
      triggerClassName,
      contentClassName,
      itemClassName,
      options,
      placeholder,
      id,
      value,
      onValueChange,
      disableClear = false,
      ...selectProps
    },
    ref
  ) => {
    const generatedId = React.useId();
    const fieldId = id || htmlFor || generatedId;
    const hasIcon = !!Icon;
    const hasError = !!error;
    const effectiveIconPosition = iconPosition || (isRTL ? "right" : "left");

    // Determine optional text based on isRTL
    const optionalText = isRTL ? "(اختياري)" : "(Optional)";

    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <Label
            htmlFor={fieldId}
            className={cn(
              "text-[#ffffff]/80",
              hasError && "text-destructive",
              labelClassName
            )}
          >
            {label}
            {required ? (
              <span className="text-red-500">*</span>
            ) : !hideOptional ? (
              <span className="opacity-50 text-xs ml-1">{optionalText}</span>
            ) : null}
          </Label>
        )}

        <div className="relative">
          {hasIcon && effectiveIconPosition === (isRTL ? "right" : "left") && (
            <Icon
              className={cn(
                "absolute top-1/2 -translate-y-1/2 w-5 h-5 text-[#ffffff]/40 z-10 pointer-events-none",
                isRTL ? "right-3" : "left-3",
                iconClassName
              )}
            />
          )}

          <Select value={value} onValueChange={onValueChange} {...selectProps}>
            <SelectTrigger
              ref={ref}
              id={fieldId}
              size="default"
              className={cn(
                "bg-background border-[#ffcc33]/20 text-[#ffffff]",
                "h-11 data-[size=default]:!h-11",
                "!py-1 px-3",
                "focus-visible:border-[#ffcc33]/50 focus-visible:ring-[#ffcc33]/20 focus-visible:ring-[3px]",
                "hover:bg-[#0f021c]/80 transition-colors",
                '[&_svg:not([class*="text-"])]:text-[#ffffff]/40',
                hasError &&
                  "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
                hasIcon &&
                  effectiveIconPosition === (isRTL ? "right" : "left") &&
                  (isRTL ? "pr-10" : "pl-10"),
                value && (isRTL ? "pl-10" : "pr-10"), // Add padding for clear button when value exists
                triggerClassName,
                inputClassName
              )}
              aria-invalid={hasError}
              aria-describedby={
                error
                  ? `${fieldId}-error`
                  : helperText
                  ? `${fieldId}-helper`
                  : undefined
              }
            >
              <SelectValue
                className="text-[#ffffff] data-[placeholder]:text-[#ffffff]/30"
                placeholder={placeholder}
              />
            </SelectTrigger>
            <SelectContent
              className={cn(
                "bg-background border-white/10 shadow-none",
                contentClassName
              )}
            >
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className={cn(
                    "text-white focus:bg-amber-500/10 focus:text-amber-400",
                    itemClassName
                  )}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear button - shows when value exists and clear is not disabled */}
          {value && onValueChange && !disableClear && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onValueChange("");
              }}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 w-5 h-5 text-[#ffffff]/40 hover:text-[#ffffff]/60 transition-colors z-10 cursor-pointer",
                "flex items-center justify-center rounded-full hover:bg-[#ffffff]/10",
                isRTL ? "left-3" : "right-3"
              )}
              aria-label={isRTL ? "مسح" : "Clear"}
              tabIndex={0}
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {hasIcon && effectiveIconPosition === (isRTL ? "left" : "right") && (
            <Icon
              className={cn(
                "absolute top-1/2 -translate-y-1/2 w-5 h-5 text-[#ffffff]/40 z-10 pointer-events-none",
                value
                  ? isRTL
                    ? "right-10"
                    : "left-10"
                  : isRTL
                  ? "left-3"
                  : "right-3", // Adjust position if clear button exists
                iconClassName
              )}
            />
          )}
        </div>

        {error && (
          <p
            id={`${fieldId}-error`}
            className="text-sm text-destructive"
            role="alert"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={`${fieldId}-helper`} className="text-sm text-[#ffffff]/60">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

SelectField.displayName = "SelectField";

// ============================================================================
// Textarea Field Component
// ============================================================================

export interface TextareaFieldProps
  extends Omit<React.ComponentProps<"textarea">, "className">,
    BaseFieldProps {
  /** Optional icon to display on the left (LTR) or right (RTL) */
  icon?: LucideIcon;
  /** Icon position - 'left' for LTR, 'right' for RTL (auto-adjusted based on isRTL) */
  iconPosition?: "left" | "right";
  /** Custom icon className */
  iconClassName?: string;
}

/**
 * Reusable Textarea Field component with icon support and RTL compatibility
 *
 * @example
 * ```tsx
 * <TextareaField
 *   label="Bio"
 *   placeholder="Tell us about yourself..."
 *   icon={FileText}
 *   isRTL={false}
 *   required
 * />
 * ```
 */
export const TextareaField = React.forwardRef<
  HTMLTextAreaElement,
  TextareaFieldProps
>(
  (
    {
      label,
      htmlFor,
      error,
      helperText,
      required,
      isRTL = false,
      hideOptional = false,
      icon: Icon,
      iconPosition,
      className,
      labelClassName,
      inputClassName,
      iconClassName,
      id,
      ...textareaProps
    },
    ref
  ) => {
    const generatedId = React.useId();
    const fieldId = id || htmlFor || generatedId;
    const effectiveIconPosition = iconPosition || (isRTL ? "right" : "left");
    const hasIcon = !!Icon;
    const hasError = !!error;

    // Determine optional text based on isRTL
    const optionalText = isRTL ? "(اختياري)" : "(Optional)";

    // Extract ref from textareaProps if it comes from react-hook-form register
    // react-hook-form's register returns { ref, onChange, onBlur, name }
    const { ref: registerRef, ...restTextareaProps } = textareaProps as {
      ref?: React.Ref<HTMLTextAreaElement>;
      onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
      onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
      name?: string;
    } & typeof textareaProps;

    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <Label
            htmlFor={fieldId}
            className={cn(
              "text-[#ffffff]/80",
              hasError && "text-destructive",
              labelClassName
            )}
          >
            {label}
            {required ? (
              <span className="text-red-500">*</span>
            ) : !hideOptional ? (
              <span className="opacity-50 text-xs ml-1">{optionalText}</span>
            ) : null}
          </Label>
        )}

        <div className="relative">
          {hasIcon && effectiveIconPosition === (isRTL ? "right" : "left") && (
            <Icon
              className={cn(
                "absolute top-3 w-5 h-5 text-[#ffffff]/40 pointer-events-none",
                isRTL ? "right-3" : "left-3",
                iconClassName
              )}
            />
          )}

          <Textarea
            ref={registerRef || ref}
            id={fieldId}
            className={cn(
              "bg-background border-[#ffcc33]/20 text-[#ffffff] placeholder:text-[#ffffff]/30 min-h-32",
              "focus:border-[#ffcc33]/50 focus:ring-[#ffcc33]/20 resize-none",
              hasError &&
                "border-destructive focus:border-destructive focus:ring-destructive/20",
              hasIcon &&
                effectiveIconPosition === (isRTL ? "right" : "left") &&
                (isRTL ? "pr-10" : "pl-10"),
              inputClassName
            )}
            aria-invalid={hasError}
            aria-describedby={
              error
                ? `${fieldId}-error`
                : helperText
                ? `${fieldId}-helper`
                : undefined
            }
            required={required}
            {...restTextareaProps}
          />

          {hasIcon && effectiveIconPosition === (isRTL ? "left" : "right") && (
            <Icon
              className={cn(
                "absolute top-3 w-5 h-5 text-[#ffffff]/40 pointer-events-none",
                isRTL ? "left-3" : "right-3",
                iconClassName
              )}
            />
          )}
        </div>

        {error && (
          <p
            id={`${fieldId}-error`}
            className="text-sm text-destructive"
            role="alert"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={`${fieldId}-helper`} className="text-sm text-[#ffffff]/60">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

TextareaField.displayName = "TextareaField";

// ============================================================================
// File Upload Field Component
// ============================================================================

export interface FileUploadFieldProps
  extends Omit<
      React.ComponentProps<"input">,
      "type" | "className" | "value" | "onChange"
    >,
    BaseFieldProps {
  /** Optional icon to display */
  icon?: LucideIcon;
  /** Accepted file types (e.g., "image/*", ".pdf,.png,.jpg") */
  accept?: string;
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Callback when file is selected (single file mode) */
  onFileChange?: (file: File | null) => void;
  /** Callback when files are selected (multiple file mode) */
  onFilesChange?: (files: File[]) => void;
  /** Callback when preview items change */
  onPreviewChange?: (items: Array<{ id: string; url: string; name: string; file?: File | null; sourceType: "local" | "existing" }>) => void;
  /** Currently selected file (single file mode) */
  value?: File | null;
  /** Currently selected files (multiple file mode) */
  files?: File[];
  /** Initial URLs for existing files */
  initialUrls?: string[];
  /** Whether to allow multiple file selection */
  multiple?: boolean;
  /** Maximum number of files allowed (only applies when multiple=true) */
  maxFiles?: number;
  /** Custom className for upload button */
  buttonClassName?: string;
  /** Upload button text */
  buttonText?: string;
  /** Helper text showing accepted formats */
  formatText?: string;
  /** Whether to show preview inline (default: true for single, false for multiple - use ImagePreviewList separately) */
  showPreview?: boolean;
}

/**
 * Reusable File Upload Field component with preview and RTL compatibility
 *
 * @example
 * ```tsx
 * <FileUploadField
 *   label="Profile Photo"
 *   accept="image/*"
 *   maxSize={5 * 1024 * 1024} // 5MB
 *   onFileChange={(file) => setFile(file)}
 *   isRTL={false}
 * />
 * ```
 */
export const FileUploadField = React.forwardRef<
  HTMLInputElement,
  FileUploadFieldProps
>(
  (
    {
      label,
      htmlFor,
      error,
      helperText,
      required,
      isRTL = false,
      hideOptional = false,
      icon: Icon = Upload,
      className,
      labelClassName,
      buttonClassName,
      buttonText,
      formatText,
      accept,
      maxSize,
      onFileChange,
      onFilesChange,
      onPreviewChange,
      value,
      files,
      initialUrls = [],
      multiple = false,
      maxFiles,
      showPreview,
      id,
      ...inputProps
    },
    ref
  ) => {
    const generatedId = React.useId();
    const fieldId = id || htmlFor || generatedId;
    const [selectedFile, setSelectedFile] = React.useState<File | null>(
      value || null
    );
    const [selectedFiles, setSelectedFiles] = React.useState<File[]>(
      files || []
    );
    const [fileError, setFileError] = React.useState<string>("");
    const hasError = !!error || !!fileError;

    // Determine if we should show preview inline
    const shouldShowPreview = showPreview !== undefined 
      ? showPreview 
      : !multiple; // Default: show for single, hide for multiple

    // Determine optional text based on isRTL
    const optionalText = isRTL ? "(اختياري)" : "(Optional)";

    // Default button text based on language
    const defaultButtonText =
      buttonText || (isRTL ? "انقر للتحميل" : "Click to upload");

    // Default format text
    const defaultFormatText =
      formatText ||
      (isRTL ? "PDF، PNG، JPG حتى 10 ميجابايت" : "PDF, PNG, JPG up to 10MB");

    // Sync with controlled value prop (single file mode)
    React.useEffect(() => {
      if (value !== undefined && !multiple) {
        setSelectedFile(value);
      }
    }, [value, multiple]);

    // Sync with controlled files prop (multiple file mode)
    React.useEffect(() => {
      if (files !== undefined && multiple) {
        setSelectedFiles(files);
      }
    }, [files, multiple]);

    // Validate a single file
    const validateFile = (file: File): string | null => {
      // Validate file size
      if (maxSize && file.size > maxSize) {
        const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0);
        return isRTL
          ? `حجم الملف كبير جداً. الحد الأقصى ${maxSizeMB} ميجابايت`
          : `File size too large. Maximum size is ${maxSizeMB}MB`;
      }

      // Validate file type
      if (
        accept &&
        !accept.split(",").some((pattern) => {
          const trimmed = pattern.trim();
          if (trimmed.startsWith(".")) {
            return file.name.toLowerCase().endsWith(trimmed.toLowerCase());
          }
          if (trimmed.includes("/*")) {
            const baseType = trimmed.split("/")[0];
            return file.type.startsWith(baseType);
          }
          return file.type === trimmed;
        })
      ) {
        return isRTL
          ? "نوع الملف غير مدعوم"
          : "File type not supported";
      }

      return null;
    };

    // Create preview items from files
    const createPreviewItems = (fileList: File[]): Array<{ id: string; url: string; name: string; file: File; sourceType: "local" }> => {
      return fileList.map((file, index) => {
        const previewUrl = URL.createObjectURL(file);
        return {
          id: `file-${Date.now()}-${index}-${file.name}`,
          url: previewUrl,
          name: file.name,
          file,
          sourceType: "local" as const,
        };
      });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputFiles = Array.from(e.target.files || []);
      setFileError("");

      if (multiple) {
        // Multiple file mode
        let newFiles = [...selectedFiles];
        
        // Validate all new files
        for (const file of inputFiles) {
          const validationError = validateFile(file);
          if (validationError) {
            setFileError(validationError);
            e.target.value = "";
            return;
          }
        }

        // Check maxFiles limit
        if (maxFiles && newFiles.length + inputFiles.length > maxFiles) {
          const errorMsg = isRTL
            ? `يمكنك تحميل ${maxFiles} ملفات كحد أقصى`
            : `You can upload up to ${maxFiles} files`;
          setFileError(errorMsg);
          e.target.value = "";
          return;
        }

        // Add new files
        newFiles = [...newFiles, ...inputFiles];
        
        // Enforce maxFiles limit (take first N files)
        if (maxFiles && newFiles.length > maxFiles) {
          newFiles = newFiles.slice(0, maxFiles);
          const warningMsg = isRTL
            ? `تم تحديد ${maxFiles} ملفات فقط`
            : `Only ${maxFiles} files selected`;
          setFileError(warningMsg);
        }

        setSelectedFiles(newFiles);
        onFilesChange?.(newFiles);
        
        // Create preview items and notify
        const previewItems = createPreviewItems(newFiles);
        onPreviewChange?.(previewItems);
      } else {
        // Single file mode
        const file = inputFiles[0] || null;
        
        if (file) {
          const validationError = validateFile(file);
          if (validationError) {
            setFileError(validationError);
            e.target.value = "";
            return;
          }
        }

        setSelectedFile(file);
        onFileChange?.(file);
        
        // Create preview item and notify
        if (file) {
          const previewItems = createPreviewItems([file]);
          onPreviewChange?.(previewItems);
        } else {
          onPreviewChange?.([]);
        }
      }
    };

    const handleRemoveFile = (index?: number) => {
      if (multiple) {
        // Remove file at index
        const newFiles = index !== undefined 
          ? selectedFiles.filter((_, i) => i !== index)
          : [];
        setSelectedFiles(newFiles);
        onFilesChange?.(newFiles);
        
        // Cleanup blob URLs for removed files
        if (index !== undefined) {
          const removedFile = selectedFiles[index];
          if (removedFile) {
            // Note: blob URLs are cleaned up when component unmounts or when files change
            // We rely on the cleanup in useEffect
          }
        }
        
        // Update preview
        const previewItems = createPreviewItems(newFiles);
        onPreviewChange?.(previewItems);
      } else {
        setSelectedFile(null);
        setFileError("");
        onFileChange?.(null);
        onPreviewChange?.([]);
      }
      
      // Reset the input element
      const input = document.getElementById(fieldId) as HTMLInputElement;
      if (input) {
        input.value = "";
      }
    };

    // Cleanup blob URLs on unmount or when files change
    React.useEffect(() => {
      return () => {
        if (multiple) {
          // Note: blob URLs are created in createPreviewItems, but we need to track them
          // For now, we'll rely on the browser's garbage collection
          // In a production app, you might want to track blob URLs explicitly
          // The cleanup is handled by the ImagePreviewList component when items are removed
        } else if (selectedFile) {
          // Single file cleanup is handled by the preview component
        }
      };
    }, [multiple, selectedFiles, selectedFile]);

    const currentFiles = multiple ? selectedFiles : (selectedFile ? [selectedFile] : []);
    const hasFiles = currentFiles.length > 0;

    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <Label
            htmlFor={fieldId}
            className={cn(
              "text-[#ffffff]/80",
              hasError && "text-destructive",
              labelClassName
            )}
          >
            {label}
            {required ? (
              <span className="text-red-500">*</span>
            ) : !hideOptional ? (
              <span className="opacity-50 text-xs ml-1">{optionalText}</span>
            ) : null}
            {multiple && maxFiles && (
              <span className="opacity-50 text-xs ml-1">
                {isRTL ? `(حد أقصى ${maxFiles})` : `(max ${maxFiles})`}
              </span>
            )}
          </Label>
        )}

        <div className="space-y-2">
          {/* Upload Button Area */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                ref={ref}
                id={fieldId}
                type="file"
                accept={accept}
                onChange={handleFileChange}
                multiple={multiple}
                className="hidden"
                {...(hasError && { "aria-invalid": "true" })}
                aria-describedby={
                  error || fileError
                    ? `${fieldId}-error`
                    : helperText
                    ? `${fieldId}-helper`
                    : undefined
                }
                required={required && !hasFiles}
                {...inputProps}
              />
              <label
                htmlFor={fieldId}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all",
                  "bg-background border-white/10 hover:border-amber-500/50 hover:bg-amber-500/10",
                  "text-white/70 hover:text-white",
                  hasError && "border-destructive",
                  required && !hasFiles && "cursor-not-allowed opacity-50",
                  buttonClassName
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{defaultButtonText}</span>
              </label>
            </div>
            {formatText && (
              <span className="text-xs text-white/40">{defaultFormatText}</span>
            )}
          </div>

          {/* Selected File Preview (only for single file mode or when showPreview=true) */}
          {shouldShowPreview && hasFiles && (
            <div className="space-y-2">
              {currentFiles.map((file, index) => (
                <div key={`${file.name}-${index}`} className="space-y-2">
                  {/* Image Preview for image files */}
                  {file.type.startsWith("image/") && (
                    <div className="relative w-full max-w-xs mx-auto">
                      <div className="relative aspect-square rounded-lg overflow-hidden border border-white/10 bg-background">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(multiple ? index : undefined)}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors cursor-pointer"
                          aria-label={isRTL ? "إزالة الصورة" : "Remove image"}
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* File Info */}
                  <div className="p-3 rounded-lg bg-background border border-white/10 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <FileText className="w-4 h-4 text-white/60 shrink-0" />
                      <span
                        className="text-sm text-white/80 truncate"
                        title={file.name}
                      >
                        {file.name}
                      </span>
                      <span className="text-xs text-white/40 shrink-0">
                        ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                      </span>
                    </div>
                    {!file.type.startsWith("image/") && (
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(multiple ? index : undefined)}
                        className="text-white/40 hover:text-white/70 transition-colors shrink-0 cursor-pointer"
                        aria-label={isRTL ? "إزالة الملف" : "Remove file"}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* File count indicator for multiple mode */}
          {multiple && hasFiles && !shouldShowPreview && (
            <p className="text-xs text-white/60">
              {isRTL 
                ? `${currentFiles.length} ملف${currentFiles.length > 1 ? "ات" : ""} محدد${currentFiles.length > 1 ? "ة" : ""}`
                : `${currentFiles.length} file${currentFiles.length > 1 ? "s" : ""} selected`}
            </p>
          )}
        </div>

        {(error || fileError) && (
          <p
            id={`${fieldId}-error`}
            className="text-sm text-destructive"
            role="alert"
          >
            {error || fileError}
          </p>
        )}

        {helperText && !error && !fileError && (
          <p id={`${fieldId}-helper`} className="text-sm text-[#ffffff]/60">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FileUploadField.displayName = "FileUploadField";

// ============================================================================
// Switch Field Component
// ============================================================================

export interface SwitchFieldProps
  extends Omit<React.ComponentProps<typeof Switch>, "className">,
    BaseFieldProps {
  /** Optional icon to display */
  icon?: LucideIcon;
  /** Custom icon className */
  iconClassName?: string;
  /** Description text below the label */
  description?: string;
  /** Custom className for the switch wrapper */
  switchWrapperClassName?: string;
  /** Custom className for the switch component */
  switchClassName?: string;
}

/**
 * Reusable Switch Field component with label, description, and RTL compatibility
 *
 * @example
 * ```tsx
 * <SwitchField
 *   label="Email Notifications"
 *   description="Receive email notifications"
 *   icon={Mail}
 *   checked={emailNotifs}
 *   onCheckedChange={setEmailNotifs}
 *   isRTL={false}
 * />
 * ```
 */
export const SwitchField = React.forwardRef<
  React.ElementRef<typeof Switch>,
  SwitchFieldProps
>(
  (
    {
      label,
      htmlFor,
      error,
      helperText,
      isRTL = false,
      icon: Icon,
      className,
      labelClassName,
      switchWrapperClassName,
      switchClassName,
      iconClassName,
      description,
      id,
      checked,
      onCheckedChange,
      disabled,
      ...switchProps
    },
    ref
  ) => {
    const generatedId = React.useId();
    const fieldId = id || htmlFor || generatedId;
    const hasIcon = !!Icon;
    const hasError = !!error;

    return (
      <div className={cn("space-y-2", className)}>
          <div
            className={cn(
              "flex items-center justify-between p-4 bg-background/50 rounded-xl",
            isRTL ? "flex-row-reverse" : "",
            switchWrapperClassName
          )}
        >
          <div
            className={cn(
              "flex items-center gap-3 flex-1",
              isRTL ? "flex-row-reverse" : ""
            )}
          >
            {hasIcon && (
              <Icon
                className={cn("w-5 h-5 text-[#ffcc33] shrink-0", iconClassName)}
              />
            )}
            <div className={cn(isRTL ? "text-right" : "text-left", "flex-1")}>
              {label && (
                <Label
                  htmlFor={fieldId}
                  className={cn(
                    "text-[#ffffff] cursor-pointer",
                    hasError && "text-destructive",
                    labelClassName
                  )}
                >
                  {label}
                </Label>
              )}
              {description && (
                <p className="text-sm text-[#808c99] mt-1">{description}</p>
              )}
            </div>
          </div>
          <Switch
            ref={ref}
            id={fieldId}
            checked={checked}
            onCheckedChange={onCheckedChange}
            disabled={disabled}
            className={cn(switchClassName)}
            aria-invalid={hasError}
            aria-describedby={
              error
                ? `${fieldId}-error`
                : helperText
                ? `${fieldId}-helper`
                : undefined
            }
            {...switchProps}
          />
        </div>

        {error && (
          <p
            id={`${fieldId}-error`}
            className="text-sm text-destructive"
            role="alert"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={`${fieldId}-helper`} className="text-sm text-[#ffffff]/60">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

SwitchField.displayName = "SwitchField";
