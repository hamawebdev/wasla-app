import { useRouter } from 'expo-router';
import { MapPin, MoreVertical, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronBack } from '@/components/ui/directional-icon';
import { Text } from '@/components/ui/text';
import { EmptyState } from '@/components/ui/empty-state';
import {
  useAddresses,
  useDeleteAddress,
  useSetDefaultAddress,
} from '@/api/services/use-addresses';
import type { Address } from '@/api/types';
import { rowDirection, textAlignStart } from '@/lib/rtl';

const LABEL_KEYS: Record<string, string> = {
  home: 'addresses.label_home',
  work: 'addresses.label_work',
  other: 'addresses.label_other',
};

const FOREGROUND = 'hsl(199, 41%, 12%)';
const PRIMARY = 'hsl(258, 52%, 54%)';
const MUTED = 'hsl(198, 15%, 45%)';
const BG = 'hsl(180, 25%, 98%)';
const BORDER = 'hsl(198, 21%, 88%)';

function AddressCard({
  address,
  onSetDefault,
  onDelete,
}: {
  address: Address;
  onSetDefault: () => void;
  onDelete: () => void;
}) {
  const { t } = useTranslation();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Badge
            label={LABEL_KEYS[address.label] ? t(LABEL_KEYS[address.label]) : address.labelText}
            variant={address.label === 'home' ? 'primary' : 'accent'}
          />
          {address.isDefault && (
            <Badge label={t('addresses.default')} variant="success" />
          )}
        </View>

        <Pressable
          onPress={() => setMenuVisible(true)}
          hitSlop={12}
          style={styles.moreBtn}
        >
          <MoreVertical size={20} color={MUTED} />
        </Pressable>
      </View>

      <View style={styles.cardBody}>
        <MapPin size={16} color={PRIMARY} />
        <Text variant="body" style={styles.addressText}>
          {address.fullAddress}
        </Text>
      </View>

      {address.notes && (
        <Text variant="caption" style={styles.notes}>{address.notes}</Text>
      )}

      {/* Inline menu modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.menuBackdrop} onPress={() => setMenuVisible(false)} />
        <View style={styles.menuSheet}>
          {!address.isDefault && (
            <Pressable
              style={styles.menuRow}
              onPress={() => { setMenuVisible(false); onSetDefault(); }}
            >
              <Text variant="body" style={{ color: FOREGROUND, textAlign: textAlignStart }}>
                {t('addresses.set_default')}
              </Text>
            </Pressable>
          )}
          <Pressable
            style={styles.menuRow}
            onPress={() => {
              setMenuVisible(false);
              Alert.alert(
                t('addresses.delete'),
                t('addresses.delete_confirm'),
                [
                  { text: t('common.cancel'), style: 'cancel' },
                  { text: t('common.delete'), style: 'destructive', onPress: onDelete },
                ],
              );
            }}
          >
            <View style={{ flexDirection: rowDirection, alignItems: 'center', gap: 8 }}>
              <Trash2 size={16} color="hsl(0, 84%, 60%)" />
              <Text variant="body" style={{ color: 'hsl(0, 84%, 60%)', textAlign: textAlignStart }}>
                {t('addresses.delete')}
              </Text>
            </View>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

export default function AddressesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: addresses = [], isLoading } = useAddresses();
  const setDefault = useSetDefaultAddress();
  const deleteAddr = useDeleteAddress();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Top App Bar */}
      <View style={styles.appBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <ChevronBack size={24} color={FOREGROUND} />
        </Pressable>
        <Text variant="heading" weight="semibold" style={styles.appBarTitle}>
          {t('addresses.title')}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          isLoading ? null : (
            <EmptyState
              illustration={<MapPin size={64} color="hsl(198, 21%, 88%)" />}
              title={t('addresses.empty_title')}
              body={t('addresses.empty_body')}
              cta={{ label: t('addresses.add'), onPress: () => router.push('/(shared)/addresses/new') }}
            />
          )
        }
        renderItem={({ item }) => (
          <AddressCard
            address={item}
            onSetDefault={() => setDefault.mutate(item.id)}
            onDelete={() => deleteAddr.mutate(item.id)}
          />
        )}
        ListFooterComponent={
          addresses.length > 0 ? (
            <Button
              variant="outline"
              label={`+ ${t('addresses.add')}`}
              onPress={() => router.push('/(shared)/addresses/new')}
              style={styles.addBtn}
            />
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  appBar: {
    flexDirection: rowDirection,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  backBtn: { padding: 4 },
  appBarTitle: { color: FOREGROUND, fontSize: 18 },
  list: { padding: 16, gap: 12, flexGrow: 1 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 10,
    shadowColor: 'hsl(196, 22%, 10%)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: rowDirection,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeaderLeft: {
    flexDirection: rowDirection,
    gap: 8,
    alignItems: 'center',
  },
  moreBtn: { padding: 4 },
  cardBody: {
    flexDirection: rowDirection,
    alignItems: 'flex-start',
    gap: 8,
  },
  addressText: { flex: 1, color: FOREGROUND, textAlign: textAlignStart },
  notes: { color: MUTED, textAlign: textAlignStart },
  addBtn: { marginTop: 8, marginHorizontal: 0 },
  menuBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  menuSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    gap: 4,
  },
  menuRow: {
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
});
