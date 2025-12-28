import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  PressableProps,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { colors, spacing, radius, typography, shadows, buttonVariants } from '@/src/constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonVariant = keyof typeof buttonVariants;
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isDisabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  haptic?: boolean;
}

const sizeStyles: Record<ButtonSize, { height: number; paddingHorizontal: number; fontSize: number }> = {
  sm: {
    height: 36,
    paddingHorizontal: spacing.md,
    fontSize: typography.sizes.sm,
  },
  md: {
    height: 48,
    paddingHorizontal: spacing.lg,
    fontSize: typography.sizes.md,
  },
  lg: {
    height: 56,
    paddingHorizontal: spacing.xl,
    fontSize: typography.sizes.lg,
  },
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  style,
  textStyle,
  haptic = true,
  onPress,
  onPressIn,
  onPressOut,
  ...props
}: ButtonProps) {
  const scale = useSharedValue(1);
  const variantStyle = buttonVariants[variant];
  const sizeStyle = sizeStyles[size];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = (e: any) => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
    onPressIn?.(e);
  };

  const handlePressOut = (e: any) => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    onPressOut?.(e);
  };

  const handlePress = (e: any) => {
    if (haptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.(e);
  };

  const isButtonDisabled = isDisabled || isLoading;

  return (
    <AnimatedPressable
      style={[
        styles.button,
        {
          height: sizeStyle.height,
          paddingHorizontal: sizeStyle.paddingHorizontal,
          backgroundColor: variantStyle.backgroundColor,
          borderColor: variantStyle.borderColor || 'transparent',
          borderWidth: variant === 'outline' ? 1.5 : 0,
          opacity: isButtonDisabled ? 0.5 : 1,
          width: fullWidth ? '100%' : undefined,
        },
        variant === 'primary' && shadows.md,
        animatedStyle,
        style,
      ]}
      disabled={isButtonDisabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variantStyle.textColor}
        />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text
            style={[
              styles.text,
              {
                fontSize: sizeStyle.fontSize,
                color: variantStyle.textColor,
                marginLeft: leftIcon ? spacing.sm : 0,
                marginRight: rightIcon ? spacing.sm : 0,
              },
              textStyle,
            ]}
          >
            {children}
          </Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Button;
