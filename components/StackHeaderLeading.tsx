import { HeaderBackButton } from '@react-navigation/elements';
import { View, StyleSheet } from 'react-native';

import { HeaderBrand } from '@/components/HeaderBrand';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

type Props = {
  /** Props forwarded from React Navigation’s `headerLeft`. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigationProps: any;
};

export function StackHeaderLeading({ navigationProps }: Props) {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];

  return (
    <View style={styles.wrap}>
      <HeaderBackButton {...navigationProps} tintColor={c.text} displayMode="minimal" />
      <HeaderBrand compact />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    marginRight: 8,
  },
});
