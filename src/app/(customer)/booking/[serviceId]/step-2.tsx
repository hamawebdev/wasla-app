import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Banknote,
  Building2,
  CreditCard,
  MapPin,
  Plus,
  Tag,
} from 'lucide-react-native';
import * as React from 'react';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { MOCK_SERVICES } from '@/api/fixtures/services';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { BookingStepper } from '@/components/wasla/booking-stepper';

const PRIMARY = 'hsl(258, 52%, 54%)';
const PRIMARY_TINT = 'hsl(258, 45%, 96%)';
const MUTED = 'hsl(198, 15%, 45%)';
const SURFACE = '#fff';
const BORDER = 'hsl(198, 21%, 88%)';
const ON_SURFACE = 'hsl(199, 41%, 12%)';

const ADDRESSES = [
  { id: 'home', label: 'المنزل', detail: 'شارع ديدوش مراد، العاصمة، الجزائر' },
  { id: 'office', label: 'المكتب', detail: 'حي باب الزوار للأعمال، الجزائر' },
];

type PaymentMethod = 'cash' | 'gold_card' | 'bridi_mob';

const PAYMENT_METHODS: { id: PaymentMethod; label: string; Icon: typeof Banknote }[] = [
  { id: 'cash', label: 'نقداً', Icon: Banknote },
  { id: 'gold_card', label: 'البطاقة الذهبية', Icon: CreditCard },
  { id: 'bridi_mob', label: 'بريدي موب', Icon: Building2 },
];

const PLATFORM_FEE = 200;
const PROMO_DISCOUNT = 500;
const VALID_PROMO = 'WELCOME';

export default function BookingStep2() {
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();
  const { t } = useTranslation();
  const router = useRouter();

  const [details, setDetails] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(ADDRESSES[0].id);
  const [payment, setPayment] = useState<PaymentMethod>('cash');
  const [promoInput, setPromoInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoError, setPromoError] = useState<string | null>(null);

  const service = MOCK_SERVICES.find((s) => s.id === serviceId);
  const serviceCost = service?.price ?? 0;
  const total = serviceCost + PLATFORM_FEE - appliedDiscount;

  const applyPromo = () => {
    if (promoInput.trim().toUpperCase() === VALID_PROMO) {
      setAppliedDiscount(PROMO_DISCOUNT);
      setPromoError(null);
    } else {
      setAppliedDiscount(0);
      setPromoError('كود غير صالح');
    }
  };

  return (
    <Screen edges={['top']} style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <BookingStepper currentStep={2} />

        {/* Address selection */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <MapPin size={20} color={PRIMARY} />
            <Text variant="label" weight="semibold" style={styles.sectionTitle}>
              عنوان الخدمة
            </Text>
          </View>

          <View style={styles.mapThumb}>
            <MapPin size={32} color={PRIMARY} fill={PRIMARY} />
          </View>

          <View style={styles.addressList}>
            {ADDRESSES.map((addr) => {
              const isSelected = selectedAddress === addr.id;
              return (
                <Pressable
                  key={addr.id}
                  onPress={() => setSelectedAddress(addr.id)}
                  style={[styles.addressRow, isSelected && styles.addressRowSelected]}
                >
                  <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                  <View style={styles.addressInfo}>
                    <Text variant="label" weight="medium" style={styles.addressLabel}>
                      {addr.label}
                    </Text>
                    <Text variant="caption" style={styles.addressDetail}>
                      {addr.detail}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          <Button
            variant="ghost"
            label={t('booking.add_address')}
            leftIcon={<Plus size={16} color={PRIMARY} />}
            onPress={() => router.push('/location-manual')}
            size="sm"
            style={styles.addAddressBtn}
          />
        </Card>

        {/* Notes */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="label" weight="semibold" style={styles.sectionTitle}>
              ملاحظات إضافية
            </Text>
          </View>
          <TextInput
            placeholder={t('booking.details_placeholder')}
            placeholderTextColor={MUTED}
            value={details}
            onChangeText={setDetails}
            multiline
            numberOfLines={3}
            textAlign="right"
            style={styles.textarea}
          />
        </Card>

        {/* Promo code */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Tag size={20} color={PRIMARY} />
            <Text variant="label" weight="semibold" style={styles.sectionTitle}>
              كود الخصم
            </Text>
          </View>
          <View style={styles.promoRow}>
            <TextInput
              placeholder="أدخل الكود هنا"
              placeholderTextColor={MUTED}
              value={promoInput}
              onChangeText={(v) => {
                setPromoInput(v);
                if (promoError) setPromoError(null);
              }}
              textAlign="right"
              autoCapitalize="characters"
              style={styles.promoInput}
            />
            <Pressable onPress={applyPromo} style={styles.promoBtn}>
              <Text variant="label" weight="medium" style={styles.promoBtnLabel}>
                تطبيق
              </Text>
            </Pressable>
          </View>
          {promoError && (
            <Text variant="caption" style={styles.promoError}>
              {promoError}
            </Text>
          )}
          {appliedDiscount > 0 && (
            <Text variant="caption" style={styles.promoSuccess}>
              تم تطبيق الخصم
            </Text>
          )}
        </Card>

        {/* Payment method */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <CreditCard size={20} color={PRIMARY} />
            <Text variant="label" weight="semibold" style={styles.sectionTitle}>
              طريقة الدفع
            </Text>
          </View>
          <View style={styles.paymentGrid}>
            {PAYMENT_METHODS.map(({ id, label, Icon }) => {
              const isSelected = payment === id;
              return (
                <Pressable
                  key={id}
                  onPress={() => setPayment(id)}
                  style={[styles.paymentCard, isSelected && styles.paymentCardSelected]}
                >
                  <Icon size={28} color={isSelected ? PRIMARY : MUTED} />
                  <Text
                    variant="caption"
                    weight="medium"
                    style={[styles.paymentLabel, isSelected && styles.paymentLabelSelected]}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Card>

        {/* Price breakdown */}
        <Card style={[styles.section, styles.breakdownCard]}>
          <View style={styles.sectionHeader}>
            <Text variant="label" weight="semibold" style={styles.sectionTitle}>
              تفاصيل السعر
            </Text>
          </View>

          <View style={styles.breakdownRow}>
            <Text variant="body" weight="medium" style={styles.breakdownValue}>
              {serviceCost.toLocaleString('ar-DZ')} د.ج
            </Text>
            <Text variant="body" style={styles.breakdownLabel}>
              تكلفة الخدمة
            </Text>
          </View>

          <View style={styles.breakdownRow}>
            <Text variant="body" weight="medium" style={styles.breakdownValue}>
              {PLATFORM_FEE.toLocaleString('ar-DZ')} د.ج
            </Text>
            <Text variant="body" style={styles.breakdownLabel}>
              رسوم المنصة
            </Text>
          </View>

          {appliedDiscount > 0 && (
            <View style={styles.breakdownRow}>
              <Text variant="body" weight="medium" style={styles.discountValue}>
                - {appliedDiscount.toLocaleString('ar-DZ')} د.ج
              </Text>
              <Text variant="body" style={styles.discountLabel}>
                خصم (كود ترحيبي)
              </Text>
            </View>
          )}

          <View style={styles.totalRow}>
            <Text variant="heading" weight="semibold" style={styles.totalValue}>
              {total.toLocaleString('ar-DZ')} د.ج
            </Text>
            <Text variant="body" weight="semibold" style={styles.totalLabel}>
              المجموع الإجمالي
            </Text>
          </View>
        </Card>
      </ScrollView>

      {/* Sticky bottom bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarInner}>
          <View style={styles.bottomTotal}>
            <Text variant="caption" style={styles.bottomTotalLabel}>
              المجموع المطلوب
            </Text>
            <Text variant="heading" weight="semibold" style={styles.bottomTotalValue}>
              {total.toLocaleString('ar-DZ')} د.ج
            </Text>
          </View>
          <Button
            variant="primary"
            label={t('booking.confirm')}
            rightIcon={<ArrowLeft size={18} color="#fff" />}
            onPress={() => router.replace(`/(customer)/booking/${serviceId}/confirmation`)}
            style={styles.bottomBarBtn}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { paddingBottom: 0 },
  scrollContent: { padding: 20, gap: 16, paddingBottom: 120 },

  section: { gap: 12, padding: 16 },
  sectionHeader: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  sectionTitle: { color: ON_SURFACE, fontSize: 16, textAlign: 'right' },

  /* Address */
  mapThumb: {
    height: 120,
    backgroundColor: PRIMARY_TINT,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
  },
  addressList: { gap: 8 },
  addressRow: {
    flexDirection: 'row-reverse',
    gap: 12,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SURFACE,
    alignItems: 'flex-start',
  },
  addressRowSelected: {
    borderColor: PRIMARY,
    backgroundColor: PRIMARY_TINT,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  radioOuterSelected: { borderColor: PRIMARY },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PRIMARY,
  },
  addressInfo: { flex: 1, gap: 2 },
  addressLabel: { color: ON_SURFACE, textAlign: 'right' },
  addressDetail: { color: MUTED, textAlign: 'right', fontSize: 13 },
  addAddressBtn: { alignSelf: 'flex-end' },

  /* Notes */
  textarea: {
    backgroundColor: SURFACE,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 12,
    fontFamily: 'Rubik',
    fontSize: 15,
    color: ON_SURFACE,
    minHeight: 80,
    textAlignVertical: 'top',
  },

  /* Promo */
  promoRow: { flexDirection: 'row-reverse', gap: 8 },
  promoInput: {
    flex: 1,
    backgroundColor: SURFACE,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 12,
    fontFamily: 'Rubik',
    fontSize: 15,
    color: ON_SURFACE,
    height: 48,
  },
  promoBtn: {
    backgroundColor: PRIMARY_TINT,
    paddingHorizontal: 20,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoBtnLabel: { color: PRIMARY },
  promoError: { color: 'hsl(0, 84%, 60%)', textAlign: 'right', fontSize: 13 },
  promoSuccess: { color: PRIMARY, textAlign: 'right', fontSize: 13 },

  /* Payment */
  paymentGrid: { flexDirection: 'row-reverse', gap: 8 },
  paymentCard: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SURFACE,
  },
  paymentCardSelected: {
    borderColor: PRIMARY,
    backgroundColor: PRIMARY_TINT,
  },
  paymentLabel: { color: MUTED, fontSize: 13, textAlign: 'center' },
  paymentLabelSelected: { color: ON_SURFACE },

  /* Breakdown */
  breakdownCard: { borderTopWidth: 3, borderTopColor: PRIMARY },
  breakdownRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownLabel: { color: MUTED, fontSize: 14 },
  breakdownValue: { color: ON_SURFACE, fontSize: 14 },
  discountLabel: { color: PRIMARY, fontSize: 14 },
  discountValue: { color: PRIMARY, fontSize: 14 },
  totalRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingTop: 12,
    marginTop: 4,
  },
  totalLabel: { color: ON_SURFACE, fontSize: 16 },
  totalValue: { color: ON_SURFACE, fontSize: 20 },

  /* Sticky bar */
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: SURFACE,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingBottom: 20,
    paddingTop: 12,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 8,
  },
  bottomBarInner: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  bottomTotal: { gap: 2 },
  bottomTotalLabel: { color: MUTED, fontSize: 12 },
  bottomTotalValue: { color: PRIMARY, fontSize: 22 },
  bottomBarBtn: { flex: 1, maxWidth: 200 },
});
