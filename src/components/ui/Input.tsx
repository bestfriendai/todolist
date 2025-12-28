import React, { useState, forwardRef } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  Pressable,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, radius, typography, inputVariants } from '@/src/constants/theme';

const AnimatedView = Animated.createAnimatedComponent(View);

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      isPassword = false,
      containerStyle,
      inputStyle,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const focusProgress = useSharedValue(0);

    const variant = error ? inputVariants.error : inputVariants.default;

    const handleFocus = (e: any) => {
      setIsFocused(true);
      focusProgress.value = withTiming(1, { duration: 200 });
      onFocus?.(e);
    };

    const handleBlur = (e: any) => {
      setIsFocused(false);
      focusProgress.value = withTiming(0, { duration: 200 });
      onBlur?.(e);
    };

    const animatedContainerStyle = useAnimatedStyle(() => {
      const borderColor = interpolateColor(
        focusProgress.value,
        [0, 1],
        [variant.borderColor, variant.focusBorderColor]
      );

      return {
        borderColor,
      };
    });

    const togglePasswordVisibility = () => {
      setIsPasswordVisible(!isPasswordVisible);
    };

    return (
      <View style={[styles.wrapper, containerStyle]}>
        {label && <Text style={styles.label}>{label}</Text>}

        <AnimatedView style={[styles.container, animatedContainerStyle]}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

          <TextInput
            ref={ref}
            style={[
              styles.input,
              {
                paddingLeft: leftIcon ? 0 : spacing.lg,
                paddingRight: rightIcon || isPassword ? 0 : spacing.lg,
              },
              inputStyle,
            ]}
            placeholderTextColor={variant.placeholderColor}
            onFocus={handleFocus}
            onBlur={handleBlur}
            secureTextEntry={isPassword && !isPasswordVisible}
            {...props}
          />

          {isPassword && (
            <Pressable
              onPress={togglePasswordVisibility}
              style={styles.rightIcon}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={colors.gray[400]}
              />
            </Pressable>
          )}

          {rightIcon && !isPassword && (
            <View style={styles.rightIcon}>{rightIcon}</View>
          )}
        </AnimatedView>

        {(error || hint) && (
          <Text style={[styles.helperText, error ? styles.errorText : styles.hintText]}>
            {error || hint}
          </Text>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: '500',
    color: colors.gray[300],
    marginBottom: spacing.xs,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[900],
    borderWidth: 1.5,
    borderRadius: radius.lg,
    minHeight: 52,
  },
  leftIcon: {
    paddingLeft: spacing.lg,
    paddingRight: spacing.sm,
  },
  rightIcon: {
    paddingRight: spacing.lg,
    paddingLeft: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: typography.sizes.md,
    color: colors.white,
    paddingVertical: spacing.md,
  },
  helperText: {
    fontSize: typography.sizes.xs,
    marginTop: spacing.xs,
  },
  errorText: {
    color: colors.error.main,
  },
  hintText: {
    color: colors.gray[500],
  },
});

export default Input;
