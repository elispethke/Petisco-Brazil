import React from 'react';
import { Pressable, Text, View, Image } from 'react-native';
import { useTransition } from 'react';
import { useTranslation } from 'react-i18next';

interface GoogleButtonProps {
    onPress: () => void;
    disabled?: boolean;
}

export function GoogleButton({ onPress, disabled }: GoogleButtonProps) {
    const { t } = useTranslation();
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            className={`mt-2 rounded-xl border border-gray-300 bg-white py-4 ${disabled ?
                'opacity-50' : 'active:opacity-80'
                }`}
        >
            <View className="flex-row items.center justify-center gap-3">

                <Image
                    source={{
                        uri: 'https://developers.google.com/identity/images/g-logo.png',
                    }}
                    className="h-5 w-5"
                    resizeMode="contain"
                />
                <Text className="text-[15px]  font-sans-medium text-gray-800">
                    {t('auth.login.google')}

                </Text>

            </View>

        </Pressable>
    );
}