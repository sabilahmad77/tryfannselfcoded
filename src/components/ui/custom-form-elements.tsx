import * as React from 'react';
import { LucideIcon, Eye, EyeOff } from 'lucide-react';
import { Input } from './input';
import { Label } from './label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { cn } from './utils';

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
  /** RTL support */
  isRTL?: boolean;
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

export interface InputFieldProps extends Omit<React.ComponentProps<'input'>, 'className'>, BaseFieldProps {
  /** Optional icon to display on the left (LTR) or right (RTL) */
  icon?: LucideIcon;
  /** Icon position - 'left' for LTR, 'right' for RTL (auto-adjusted based on isRTL) */
  iconPosition?: 'left' | 'right';
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
    const effectiveIconPosition = iconPosition || (isRTL ? 'right' : 'left');
    const hasIcon = !!Icon;
    const hasError = !!error;

    return (
      <div className={cn('space-y-2', className)}>
        {label && (
          <Label
            htmlFor={fieldId}
            className={cn(
              'text-[#fef3c7]/80',
              hasError && 'text-destructive',
              labelClassName
            )}
          >
            {label}
            {required && <span className="text-red-500">*</span>}
          </Label>
        )}

        <div className="relative">
          {hasIcon && effectiveIconPosition === (isRTL ? 'right' : 'left') && (
            <Icon
              className={cn(
                'absolute top-1/2 -translate-y-1/2 w-5 h-5 text-[#fef3c7]/40 pointer-events-none',
                isRTL ? 'right-3' : 'left-3',
                iconClassName
              )}
            />
          )}

          <Input
            ref={ref}
            id={fieldId}
            className={cn(
              'bg-[#fef3c7]/5 border-[#d4af37]/20 text-[#fef3c7] placeholder:text-[#fef3c7]/30 h-11',
              'focus:border-[#d4af37]/50 focus:ring-[#d4af37]/20',
              hasError && 'border-destructive focus:border-destructive focus:ring-destructive/20',
              hasIcon && effectiveIconPosition === (isRTL ? 'right' : 'left') && (isRTL ? 'pr-10' : 'pl-10'),
              hasIcon && effectiveIconPosition === (isRTL ? 'left' : 'right') && (isRTL ? 'pl-10' : 'pr-10'),
              inputClassName
            )}
            aria-invalid={hasError}
            aria-describedby={
              error ? `${fieldId}-error` : helperText ? `${fieldId}-helper` : undefined
            }
            required={required}
            {...inputProps}
          />

          {hasIcon && effectiveIconPosition === (isRTL ? 'left' : 'right') && (
            <Icon
              className={cn(
                'absolute top-1/2 -translate-y-1/2 w-5 h-5 text-[#fef3c7]/40 pointer-events-none',
                isRTL ? 'left-3' : 'right-3',
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
          <p
            id={`${fieldId}-helper`}
            className="text-sm text-[#fef3c7]/60"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';

// ============================================================================
// Password Field Component
// ============================================================================

export interface PasswordFieldProps extends Omit<React.ComponentProps<'input'>, 'type' | 'className'>, BaseFieldProps {
  /** Optional icon to display on the left (LTR) or right (RTL) */
  icon?: LucideIcon;
  /** Icon position - 'left' for LTR, 'right' for RTL (auto-adjusted based on isRTL) */
  iconPosition?: 'left' | 'right';
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
export const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
  (
    {
      label,
      htmlFor,
      error,
      helperText,
      required,
      isRTL = false,
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
    const [internalShowPassword, setInternalShowPassword] = React.useState(false);
    const isControlled = controlledShowPassword !== undefined;
    const showPassword = isControlled ? controlledShowPassword : internalShowPassword;
    const hasIcon = !!Icon;
    const hasError = !!error;
    const effectiveIconPosition = iconPosition || (isRTL ? 'right' : 'left');

    const handleTogglePassword = () => {
      const newValue = !showPassword;
      if (isControlled) {
        onShowPasswordChange?.(newValue);
      } else {
        setInternalShowPassword(newValue);
      }
    };

    return (
      <div className={cn('space-y-2', className)}>
        {label && (
          <Label
            htmlFor={fieldId}
            className={cn(
              'text-[#fef3c7]/80',
              hasError && 'text-destructive',
              labelClassName
            )}
          >
            {label}
            {required && <span className="text-red-500">*</span>}
          </Label>
        )}

        <div className="relative">
          {hasIcon && effectiveIconPosition === (isRTL ? 'right' : 'left') && (
            <Icon
              className={cn(
                'absolute top-1/2 -translate-y-1/2 w-5 h-5 text-[#fef3c7]/40 pointer-events-none',
                isRTL ? 'right-3' : 'left-3',
                iconClassName
              )}
            />
          )}

          <Input
            ref={ref}
            id={fieldId}
            type={showPassword ? 'text' : 'password'}
            className={cn(
              'bg-[#fef3c7]/5 border-[#d4af37]/20 text-[#fef3c7] placeholder:text-[#fef3c7]/30 h-11',
              'focus:border-[#d4af37]/50 focus:ring-[#d4af37]/20',
              hasError && 'border-destructive focus:border-destructive focus:ring-destructive/20',
              // Icon padding (left side for LTR, right side for RTL)
              hasIcon && effectiveIconPosition === (isRTL ? 'right' : 'left') && (isRTL ? 'pr-10' : 'pl-10'),
              // Toggle padding (right side for LTR, left side for RTL)
              showToggle && (isRTL ? 'pl-10' : 'pr-10'),
              inputClassName
            )}
            aria-invalid={hasError}
            aria-describedby={
              error ? `${fieldId}-error` : helperText ? `${fieldId}-helper` : undefined
            }
            required={required}
            {...inputProps}
          />

          {showToggle && (
            <button
              type="button"
              onClick={handleTogglePassword}
              className={cn(
                'absolute top-1/2 -translate-y-1/2 text-[#fef3c7]/40 hover:text-[#fef3c7]/60 transition-colors',
                isRTL ? 'left-3' : 'right-3',
                toggleButtonClassName
              )}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={0}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}

          {hasIcon && effectiveIconPosition === (isRTL ? 'left' : 'right') && (
            <Icon
              className={cn(
                'absolute top-1/2 -translate-y-1/2 w-5 h-5 text-[#fef3c7]/40 pointer-events-none',
                showToggle ? (isRTL ? 'right-10' : 'left-10') : (isRTL ? 'right-3' : 'left-3'),
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
          <p
            id={`${fieldId}-helper`}
            className="text-sm text-[#fef3c7]/60"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

PasswordField.displayName = 'PasswordField';

// ============================================================================
// Select Field Component
// ============================================================================

export interface SelectFieldOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectFieldProps extends Omit<React.ComponentProps<typeof Select>, 'className'>, BaseFieldProps {
  /** Options for the select dropdown */
  options: SelectFieldOption[];
  /** Placeholder text */
  placeholder?: string;
  /** Optional icon to display on the left (LTR) or right (RTL) */
  icon?: LucideIcon;
  /** Icon position - 'left' for LTR, 'right' for RTL (auto-adjusted based on isRTL) */
  iconPosition?: 'left' | 'right';
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
      ...selectProps
    },
    ref
  ) => {
    const generatedId = React.useId();
    const fieldId = id || htmlFor || generatedId;
    const hasIcon = !!Icon;
    const hasError = !!error;
    const effectiveIconPosition = iconPosition || (isRTL ? 'right' : 'left');

    return (
      <div className={cn('space-y-2', className)}>
        {label && (
          <Label
            htmlFor={fieldId}
            className={cn(
              'text-[#fef3c7]/80',
              hasError && 'text-destructive',
              labelClassName
            )}
          >
            {label}
            {required && <span className="text-red-500">*</span>}
          </Label>
        )}

        <div className="relative">
          {hasIcon && effectiveIconPosition === (isRTL ? 'right' : 'left') && (
            <Icon
              className={cn(
                'absolute top-1/2 -translate-y-1/2 w-5 h-5 text-[#fef3c7]/40 z-10 pointer-events-none',
                isRTL ? 'right-3' : 'left-3',
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
                'bg-[#fef3c7]/5 border-[#d4af37]/20 text-[#fef3c7]',
                'h-11 data-[size=default]:!h-11',
                '!py-1 px-3',
                'data-[placeholder]:text-[#fef3c7]/30',
                'focus-visible:border-[#d4af37]/50 focus-visible:ring-[#d4af37]/20 focus-visible:ring-[3px]',
                'hover:bg-[#fef3c7]/10 transition-[color,box-shadow]',
                '[&_svg:not([class*="text-"])]:text-[#fef3c7]/40',
                '[&_[data-slot=select-value]]:text-[#fef3c7]',
                '[&_[data-slot=select-value][data-placeholder]]:text-[#fef3c7]/30',
                hasError && 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20',
                hasIcon && effectiveIconPosition === (isRTL ? 'right' : 'left') && (isRTL ? 'pr-10' : 'pl-10'),
                triggerClassName,
                inputClassName
              )}
              aria-invalid={hasError}
              aria-describedby={
                error ? `${fieldId}-error` : helperText ? `${fieldId}-helper` : undefined
              }
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className={cn('bg-[#1a1a24] border-white/10', contentClassName)}>
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className={cn(
                    'text-white focus:bg-amber-500/10 focus:text-amber-400',
                    itemClassName
                  )}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasIcon && effectiveIconPosition === (isRTL ? 'left' : 'right') && (
            <Icon
              className={cn(
                'absolute top-1/2 -translate-y-1/2 w-5 h-5 text-[#fef3c7]/40 z-10 pointer-events-none',
                isRTL ? 'left-3' : 'right-3',
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
          <p
            id={`${fieldId}-helper`}
            className="text-sm text-[#fef3c7]/60"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

SelectField.displayName = 'SelectField';

