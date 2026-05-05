import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { Feather } from '@expo/vector-icons';


type FeatherName = React.ComponentProps<typeof Feather>['name'];

interface AuthFieldProps extends TextInputProps {
  label: string;
  icon?: FeatherName;
}

export function AuthField({ label, icon, ...props}: AuthFieldProps) {

  return(
    <View className="gap-1.5">

      <Text className="text[10px] font-sans-bold uppercase tracking-[1.2px] text-brand-gold/80">
      {label}
      </Text>

      <View className="flex-row items-center rounded-xl border border-brand-gold/20 bg-white/5 px-4">
      {icon && (
        <Feather
        name={icon}
        size={16}
        color="rgba(197,160,89,0.7)"
        style={{ marginRight: 10}}
        />

      )}
      <TextInput 
      className="flex-1 py-4 text[15px] text-white font-sans"
      placeholder="rgba(255,255,255,0.3)"
      {...props}
      />

      </View>


    </View>

  );
}


