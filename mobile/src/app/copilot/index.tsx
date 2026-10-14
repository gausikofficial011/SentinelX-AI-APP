import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/constants/theme';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { useCopilotStore } from '@/store/copilotStore';

export default function CopilotScreen() {
  const router = useRouter();
  const { messages, isThinking, quickPrompts, sendMessage } = useCopilotStore();
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 150);
  }, [messages, isThinking]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isThinking) return;

    setInputText('');
    await sendMessage(text);
  };

  const handleActionPill = (action: string) => {
    if (action === 'open_fir') {
      router.push('/citizen/fir-status');
    } else if (action === 'view_guidelines') {
      sendMessage('Explain the legal rights of a citizen when filing an FIR');
    } else if (action === 'view_hotspots') {
      router.push('/analyst/hotspots');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header matching screen #9 */}
      <View style={styles.copilotHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.botAvatar}>
            <Text style={styles.botEmoji}>🤖</Text>
          </View>
          <View>
            <Text style={styles.copilotTitle}>AI Police Copilot</Text>
            <View style={styles.onlineRow}>
              <View style={styles.greenDot} />
              <Text style={styles.onlineText}>Online</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.infoBtn}>
          <Text style={styles.infoIcon}>ⓘ</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.chatScroll}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <View
                key={msg.id}
                style={[styles.msgWrapper, isUser ? styles.msgWrapperUser : styles.msgWrapperBot]}
              >
                {!isUser && (
                  <View style={styles.smallBotAvatar}>
                    <Text style={{ fontSize: 13 }}>🤖</Text>
                  </View>
                )}

                <View style={styles.bubbleCol}>
                  <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
                    <Text style={[styles.bubbleText, isUser ? styles.userText : styles.botText]}>
                      {msg.text}
                    </Text>

                    {/* Sources citation */}
                    {msg.sources && msg.sources.length > 0 && (
                      <View style={styles.sourcesBox}>
                        <Text style={styles.sourcesTitle}>GROUNDED STATUTES & TELEMETRY:</Text>
                        {msg.sources.map((s, idx) => (
                          <Text key={idx} style={styles.sourceItem}>
                            • {s.type} (Confidence: {Math.round(s.confidence * 100)}%)
                          </Text>
                        ))}
                      </View>
                    )}
                  </View>

                  {/* Action pills matching screen #9 */}
                  {msg.actionPills && msg.actionPills.length > 0 && (
                    <View style={styles.actionPillsRow}>
                      {msg.actionPills.map((pill) => (
                        <TouchableOpacity
                          key={pill.label}
                          style={styles.actionPillBtn}
                          onPress={() => handleActionPill(pill.action)}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.actionPillText}>{pill.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  <Text style={[styles.timeLabel, isUser ? styles.timeRight : styles.timeLeft]}>
                    {msg.timestamp}
                  </Text>
                </View>
              </View>
            );
          })}

          {/* Thinking / Neural Processing Indicator */}
          {isThinking && (
            <View style={[styles.msgWrapper, styles.msgWrapperBot]}>
              <View style={styles.smallBotAvatar}>
                <Text style={{ fontSize: 13 }}>🤖</Text>
              </View>
              <View style={[styles.bubble, styles.botBubble, styles.thinkingBubble]}>
                <ActivityIndicator size="small" color={Colors.cyan} />
                <Text style={styles.thinkingText}>Synthesizing legal codes & incident telemetry...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick Prompts Carousel */}
        <View style={styles.quickPromptsWrap}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickScroll}>
            {quickPrompts.map((prompt) => (
              <TouchableOpacity
                key={prompt}
                style={styles.promptChip}
                onPress={() => handleSend(prompt)}
                activeOpacity={0.75}
              >
                <Text style={styles.promptText}>{prompt}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Input Bar matching screen #9 */}
        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.attachBtn}>
            <Text style={styles.attachIcon}>📎</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your question..."
            placeholderTextColor={Colors.textDim}
            onSubmitEditing={() => handleSend()}
          />

          <TouchableOpacity
            style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
            onPress={() => handleSend()}
            disabled={!inputText.trim() || isThinking}
            activeOpacity={0.8}
          >
            <Text style={styles.sendIcon}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  copilotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  botAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.cyanGlow,
    borderWidth: 1.5,
    borderColor: Colors.cyan,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  botEmoji: {
    fontSize: 20,
  },
  copilotTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: Typography.weights.bold,
  },
  onlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
    marginRight: 5,
  },
  onlineText: {
    color: Colors.success,
    fontSize: 11,
    fontWeight: Typography.weights.semibold,
  },
  infoBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoIcon: {
    color: Colors.textDim,
    fontSize: 15,
  },
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  msgWrapper: {
    flexDirection: 'row',
    marginVertical: 2,
  },
  msgWrapperUser: {
    justifyContent: 'flex-end',
  },
  msgWrapperBot: {
    justifyContent: 'flex-start',
  },
  smallBotAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.cyan,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
    marginTop: 4,
  },
  bubbleCol: {
    maxWidth: '82%',
  },
  bubble: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
  },
  userBubble: {
    backgroundColor: '#0284C7',
    borderBottomRightRadius: Radius.xs,
  },
  botBubble: {
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderBottomLeftRadius: Radius.xs,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: '#FFF',
    fontWeight: Typography.weights.medium,
  },
  botText: {
    color: Colors.text,
  },
  sourcesBox: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  sourcesTitle: {
    color: Colors.cyan,
    fontSize: 10,
    fontWeight: Typography.weights.heavy,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  sourceItem: {
    color: Colors.textDim,
    fontSize: 11,
  },
  actionPillsRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  actionPillBtn: {
    backgroundColor: Colors.cyanGlow,
    borderColor: Colors.cyan,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.pill,
  },
  actionPillText: {
    color: Colors.cyan,
    fontSize: 12,
    fontWeight: Typography.weights.bold,
  },
  timeLabel: {
    color: Colors.textDim,
    fontSize: 10,
    marginTop: 3,
  },
  timeRight: {
    textAlign: 'right',
  },
  timeLeft: {
    textAlign: 'left',
  },
  thinkingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  thinkingText: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  quickPromptsWrap: {
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.backgroundSecondary,
  },
  quickScroll: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.xs,
  },
  promptChip: {
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Radius.pill,
  },
  promptText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: Typography.weights.medium,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.backgroundSecondary,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  attachBtn: {
    padding: Spacing.sm,
  },
  attachIcon: {
    fontSize: 18,
    color: Colors.textDim,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    height: 42,
    color: Colors.text,
    fontSize: 14,
    marginHorizontal: Spacing.xs,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.glowBlue,
  },
  sendBtnDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    shadowOpacity: 0,
    elevation: 0,
  },
  sendIcon: {
    color: '#FFF',
    fontSize: 14,
  },
});
