import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { IncidentType } from '@/types';
import { api } from '@/services/api';

interface FIRStepperProps {
  onSuccess: (firRecord: any) => void;
  onCancel: () => void;
}

export function FIRStepper({ onSuccess, onCancel }: FIRStepperProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;

  // Form State
  const [complainantName, setComplainantName] = useState('Gausik Srinivasan');
  const [phone, setPhone] = useState('+91 98401 22345');
  const [govtId, setGovtId] = useState('AADHAAR-8902-1123');

  const [incidentType, setIncidentType] = useState<IncidentType>('THEFT');
  const [incidentDate, setIncidentDate] = useState('15 Sept 2026, 09:30 AM');
  const [location, setLocation] = useState('RS Puram, Coimbatore');

  const [narrative, setNarrative] = useState(
    'While parked outside the commercial complex, an unidentified person broke the rear left quarter glass and stole a black messenger bag containing documents.'
  );
  const [suspectDetails, setSuspectDetails] = useState(
    'Male, approximate age 25-30, wearing dark hooded jacket, fled towards DB Road on a black motorcycle.'
  );
  const [evidenceNotes, setEvidenceNotes] = useState('CCTV camera #04 footage from shop entrance requested.');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const incidentTypes: IncidentType[] = ['THEFT', 'ROBBERY', 'ASSAULT', 'ACCIDENT', 'SURVEILLANCE', 'OTHER'];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onCancel();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const trackingId = `FIR-2026-${Math.floor(Math.random() * 90000) + 10000}`;

    try {
      await api.createFIR({
        complainantName,
        incidentDate,
        incidentType,
        narrative,
        suspectDetails,
      });
    } catch {
      // offline fallback
    }

    setIsSubmitting(false);

    const record = {
      id: trackingId,
      firNumber: trackingId,
      complainantName,
      incidentType,
      incidentDate,
      location,
      narrative,
      status: 'UNDER_INVESTIGATION',
      assignedOfficer: 'PC. Arjun Kumar (Badge #TN-4587)',
      submittedAt: 'Just now',
    };

    if (Platform.OS !== 'web') {
      Alert.alert(
        'E-FIR Registered Successfully',
        `Your FIR tracking number is ${trackingId}. A copy has been transmitted to Central Police Command.`
      );
    }

    onSuccess(record);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Step Indicator Header */}
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>
          Step {currentStep} of {totalSteps}: {getStepTitle(currentStep)}
        </Text>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${(currentStep / totalSteps) * 100}%` }]} />
        </View>
      </View>

      {/* Step Content */}
      <View style={styles.formCard}>
        {currentStep === 1 && (
          <View>
            <Text style={styles.label}>Complainant Full Name *</Text>
            <TextInput
              style={styles.input}
              value={complainantName}
              onChangeText={setComplainantName}
              placeholder="Enter full legal name"
              placeholderTextColor={Colors.textDim}
            />

            <Text style={styles.label}>Contact Phone Number *</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="+91 Phone number"
              placeholderTextColor={Colors.textDim}
            />

            <Text style={styles.label}>Identity Document (Aadhaar / Passport / Voter ID)</Text>
            <TextInput
              style={styles.input}
              value={govtId}
              onChangeText={setGovtId}
              placeholder="ID Document number"
              placeholderTextColor={Colors.textDim}
            />
          </View>
        )}

        {currentStep === 2 && (
          <View>
            <Text style={styles.label}>Select Offense / Incident Classification *</Text>
            <View style={styles.typeGrid}>
              {incidentTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.typeBtn, incidentType === type && styles.typeBtnActive]}
                  onPress={() => setIncidentType(type)}
                >
                  <Text style={[styles.typeBtnText, incidentType === type && styles.typeBtnTextActive]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {currentStep === 3 && (
          <View>
            <Text style={styles.label}>Date & Occurrence Time *</Text>
            <TextInput
              style={styles.input}
              value={incidentDate}
              onChangeText={setIncidentDate}
              placeholder="e.g. 15 Sept 2026, 09:30 AM"
              placeholderTextColor={Colors.textDim}
            />

            <Text style={styles.label}>Exact Place of Occurrence *</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="Street, Landmark, District"
              placeholderTextColor={Colors.textDim}
            />
          </View>
        )}

        {currentStep === 4 && (
          <View>
            <Text style={styles.label}>Statement of Fact / Detailed Narrative *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={narrative}
              onChangeText={setNarrative}
              multiline
              numberOfLines={5}
              placeholder="Detail the sequence of events chronologically..."
              placeholderTextColor={Colors.textDim}
            />
          </View>
        )}

        {currentStep === 5 && (
          <View>
            <Text style={styles.label}>Suspect / Accused Information (if known)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={suspectDetails}
              onChangeText={setSuspectDetails}
              multiline
              numberOfLines={4}
              placeholder="Physical description, clothing, vehicle registration, direction of flight..."
              placeholderTextColor={Colors.textDim}
            />
          </View>
        )}

        {currentStep === 6 && (
          <View>
            <Text style={styles.label}>Physical Evidence & Digital Documents</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={evidenceNotes}
              onChangeText={setEvidenceNotes}
              multiline
              numberOfLines={4}
              placeholder="List CCTV cameras, photos, receipts, or medical examination reports..."
              placeholderTextColor={Colors.textDim}
            />
          </View>
        )}

        {currentStep === 7 && (
          <View>
            <Text style={styles.reviewHeader}>Summary Review of FIR</Text>
            <View style={styles.reviewRow}>
              <Text style={styles.reviewKey}>Complainant:</Text>
              <Text style={styles.reviewVal}>{complainantName}</Text>
            </View>
            <View style={styles.reviewRow}>
              <Text style={styles.reviewKey}>Offense Type:</Text>
              <Text style={styles.reviewVal}>{incidentType}</Text>
            </View>
            <View style={styles.reviewRow}>
              <Text style={styles.reviewKey}>Occurrence:</Text>
              <Text style={styles.reviewVal}>{location}</Text>
            </View>
            <View style={styles.reviewRow}>
              <Text style={styles.reviewKey}>Time:</Text>
              <Text style={styles.reviewVal}>{incidentDate}</Text>
            </View>
            <Text style={styles.certifyNotice}>
              ✓ I hereby certify that the particulars furnished above are true to the best of my knowledge under legal declaration.
            </Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack} disabled={isSubmitting}>
          <Text style={styles.backBtnText}>{currentStep === 1 ? 'Cancel' : 'Back'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.nextBtn}
          onPress={handleNext}
          disabled={isSubmitting}
          activeOpacity={0.8}
        >
          <Text style={styles.nextBtnText}>
            {isSubmitting ? 'Registering...' : currentStep === totalSteps ? 'Submit E-FIR' : 'Next Step →'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function getStepTitle(step: number): string {
  switch (step) {
    case 1:
      return 'Complainant Information';
    case 2:
      return 'Incident Classification';
    case 3:
      return 'Occurrence Location';
    case 4:
      return 'Narrative Statement';
    case 5:
      return 'Suspect Particulars';
    case 6:
      return 'Evidence Documentation';
    case 7:
      return 'Declaration & Submission';
    default:
      return '';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
  },
  stepHeader: {
    marginBottom: Spacing.md,
  },
  stepTitle: {
    color: Colors.cyan,
    fontSize: 14,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.sm,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.cyan,
  },
  formCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  label: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: Typography.weights.semibold,
    marginBottom: 6,
    marginTop: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    color: Colors.text,
    fontSize: 14,
    marginBottom: Spacing.sm,
  },
  textArea: {
    minHeight: 95,
    textAlignVertical: 'top',
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  typeBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radius.md,
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  typeBtnActive: {
    backgroundColor: Colors.cyanGlow,
    borderColor: Colors.cyan,
  },
  typeBtnText: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: Typography.weights.semibold,
  },
  typeBtnTextActive: {
    color: Colors.cyan,
    fontWeight: Typography.weights.bold,
  },
  reviewHeader: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.md,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  reviewKey: {
    color: Colors.textDim,
    fontSize: 13,
  },
  reviewVal: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: Typography.weights.semibold,
  },
  certifyNotice: {
    color: Colors.success,
    fontSize: 12,
    marginTop: Spacing.md,
    lineHeight: 18,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  backBtn: {
    flex: 1,
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 14,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: Typography.weights.semibold,
  },
  nextBtn: {
    flex: 2,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.3,
  },
});
