import { useRouter } from 'expo-router';
import { Megaphone, Plus, X } from 'lucide-react-native';
import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';

const PRIMARY = 'hsl(258, 52%, 54%)';
const FOREGROUND = 'hsl(199, 41%, 12%)';
const MUTED = 'hsl(198, 15%, 45%)';

interface Props {
  visible: boolean;
  onClose: () => void;
}

interface ActionRowProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}

function ActionRow({ icon, label, onPress }: ActionRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      accessibilityRole="button"
    >
      <View style={styles.rowIcon}>{icon}</View>
      <Text variant="body" weight="medium" style={styles.rowLabel}>
        {label}
      </Text>
    </Pressable>
  );
}

export function ProviderActionSheet({ visible, onClose }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleAddService = () => {
    onClose();
    router.push('/(provider)/services/new');
  };

  const handlePromote = () => {
    onClose();
    router.push('/(provider)/promote');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 24) }]}>
        {/* Handle */}
        <View style={styles.handle} />

        {/* Title */}
        <View style={styles.header}>
          <Text variant="heading" weight="semibold" style={styles.title}>
            إضافة جديد
          </Text>
          <Pressable onPress={onClose} hitSlop={12} style={styles.closeBtn}>
            <X size={20} color={MUTED} />
          </Pressable>
        </View>

        <ActionRow
          icon={<Plus size={22} color={PRIMARY} />}
          label="خدمة جديدة"
          onPress={handleAddService}
        />
        <ActionRow
          icon={<Megaphone size={22} color={PRIMARY} />}
          label="عرض ترويجي"
          onPress={handlePromote}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'hsl(198, 21%, 88%)',
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    color: FOREGROUND,
  },
  closeBtn: {
    padding: 4,
  },
  row: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  pressed: {
    backgroundColor: 'hsl(258, 45%, 96%)',
  },
  rowIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'hsl(258, 45%, 96%)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    color: FOREGROUND,
    flex: 1,
    textAlign: 'right',
  },
});
