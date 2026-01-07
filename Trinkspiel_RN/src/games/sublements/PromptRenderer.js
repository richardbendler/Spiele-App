import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Question from './Question';
import { appStyles } from '../../../styles';
import { replaceHashtagsWithoutDuplicates } from './AdjustParamShape';
import {
  pickRandomPlayer,
  pickMultiplePlayers,
  pickNeighborTargets,
  splitIntoTeams,
  formatPlayerList,
  computeDrinkAmount,
  renderTemplateText,
} from './promptMechanics';

const localize = (value, language) => {
  if (typeof value === 'string') {
    return value;
  }
  if (value && typeof value === 'object') {
    const resolved = value[language];
    if (typeof resolved === 'string') {
      return resolved;
    }
    const fallback = value.de || value.en;
    return typeof fallback === 'string' ? fallback : '';
  }
  return '';
};

const PromptRenderer = ({
  prompt,
  language,
  players,
  settings,
  defaultText,
  requireDrinkingPlayers,
}) => {
  const payload = prompt?.metadata?.customPayload;
  const promptId = prompt?.id ?? prompt?.question_id ?? 0;
  const allPlayers = Array.isArray(players) ? players : [];
  const drinkersOnly = useMemo(() => {
    if (!Array.isArray(players)) {
      return [];
    }
    return players.filter((entry) => entry?.drinks !== false);
  }, [players]);
  const effectivePlayers = useMemo(() => {
    if (!requireDrinkingPlayers) {
      return allPlayers;
    }
    return drinkersOnly.length > 0 ? drinkersOnly : allPlayers;
  }, [allPlayers, drinkersOnly, requireDrinkingPlayers]);

  if (!payload || !payload.type) {
    const safeText = typeof defaultText === 'string' ? defaultText : '';
    const displayedText = replaceHashtagsWithoutDuplicates(safeText, {
      requireDrinkingPlayers,
      players: effectivePlayers,
      language,
    });
    return <Question question={displayedText} />;
  }

  switch (payload.type) {
    case 'truthOrDare':
      return (
        <TruthOrDareCard
          payload={payload}
          language={language}
          players={effectivePlayers}
          promptId={promptId}
          requireDrinkingPlayers={requireDrinkingPlayers}
        />
      );
    case 'hiddenReveal':
      return <HiddenRevealCard payload={payload} promptId={promptId} language={language} />;
    case 'timer':
      return (
        <TimerCard
          payload={payload}
          language={language}
          players={effectivePlayers}
          promptId={promptId}
          settings={settings}
          requireDrinkingPlayers={requireDrinkingPlayers}
        />
      );
    case 'vote':
      return <VoteCard payload={payload} language={language} />;
    case 'buttern':
      return (
        <ButternCard
          payload={payload}
          language={language}
          players={effectivePlayers}
          settings={settings}
          promptId={promptId}
          requireDrinkingPlayers={requireDrinkingPlayers}
        />
      );
    case 'targetedAction':
      return (
        <TargetedActionCard
          payload={payload}
          language={language}
          players={effectivePlayers}
          settings={settings}
          promptId={promptId}
          requireDrinkingPlayers={requireDrinkingPlayers}
        />
      );
    case 'teamChallenge':
      return (
        <TeamChallengeCard
          payload={payload}
          language={language}
          players={effectivePlayers}
          promptId={promptId}
          requireDrinkingPlayers={requireDrinkingPlayers}
        />
      );
    case 'virus':
      return <VirusCard payload={payload} language={language} />;
    default: {
      const fallbackText =
        localize(payload.text, language) ||
        (typeof defaultText === 'string' ? defaultText : '');
      const displayedText = replaceHashtagsWithoutDuplicates(fallbackText, {
        requireDrinkingPlayers,
        players: effectivePlayers,
        language,
      });
      return <Question question={displayedText} />;
    }
  }
};

const TruthOrDareCard = ({
  payload,
  language,
  players,
  promptId,
  requireDrinkingPlayers = false,
}) => {
  const [choice, setChoice] = useState(null);
  useEffect(() => setChoice(null), [promptId]);

  const target = useMemo(
    () => pickRandomPlayer(players, language, { requireDrinker: requireDrinkingPlayers }),
    [players, language, promptId, requireDrinkingPlayers],
  );

  const variables = { target: target.name };
  const defaultPreface =
    language === 'de' ? '{{target}} ist dran. Wahrheit oder Pflicht?' : '{{target}} is up. Truth or dare?';
  const preface = renderTemplateText(localize(payload.preface, language) || defaultPreface, variables);
  const truthText = renderTemplateText(localize(payload.truth, language) || '', variables);
  const dareText = renderTemplateText(localize(payload.dare, language) || '', variables);
  const truthLabel = localize(payload.truthLabel, language) || (language === 'de' ? 'Wahrheit' : 'Truth');
  const dareLabel = localize(payload.dareLabel, language) || (language === 'de' ? 'Pflicht' : 'Dare');

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.prefaceText}>{preface}</Text>
      <View style={styles.choiceRow}>
        <TouchableOpacity
          style={[styles.choiceButton, choice === 'truth' && styles.choiceButtonActive]}
          onPress={() => setChoice('truth')}
        >
          <Text style={styles.choiceLabel}>{truthLabel}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.choiceButton, choice === 'dare' && styles.choiceButtonActive]}
          onPress={() => setChoice('dare')}
        >
          <Text style={styles.choiceLabel}>{dareLabel}</Text>
        </TouchableOpacity>
      </View>
      {choice ? (
        <Question question={choice === 'truth' ? truthText : dareText} />
      ) : (
        <Text style={styles.helperText}>
          {language === 'de'
            ? 'Tippt auf eine Variante, um die Aufgabe aufzudecken.'
            : 'Tap a variant to reveal the prompt.'}
        </Text>
      )}
    </View>
  );
};

const HiddenRevealCard = ({ payload, promptId, language }) => {
  const sections = Array.isArray(payload.sections) ? payload.sections : [];
  const initialRevealed = useMemo(
    () =>
      new Set(
        sections
          .map((section, index) => ({ id: section.id ?? index, hidden: section.hidden }))
          .filter((entry) => entry.hidden === false)
          .map((entry) => entry.id),
      ),
    [sections],
  );
  const [revealed, setRevealed] = useState(initialRevealed);

  useEffect(() => {
    setRevealed(
      new Set(
        sections
          .map((section, index) => ({ id: section.id ?? index, hidden: section.hidden }))
          .filter((entry) => entry.hidden === false)
          .map((entry) => entry.id),
      ),
    );
  }, [promptId, sections]);

  if (sections.length === 0) {
    return null;
  }

  return (
    <View style={styles.cardContainer}>
      {sections.map((section, index) => {
        const id = section.id ?? index;
        const isHidden = section.hidden !== false && !revealed.has(id);
        return (
          <View key={id} style={styles.sectionContainer}>
            {section.label ? (
              <Text style={styles.sectionLabel}>{localize(section.label, language)}</Text>
            ) : null}
            {isHidden ? (
              <TouchableOpacity
                style={styles.revealButton}
                onPress={() =>
                  setRevealed((prev) => {
                    const next = new Set(prev);
                    next.add(id);
                    return next;
                  })
                }
              >
                <Text style={styles.revealLabel}>
                  {localize(section.revealLabel, language) || (language === 'de' ? 'Aufdecken' : 'Reveal')}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.sectionBody}>{localize(section.text, language)}</Text>
            )}
          </View>
        );
      })}
    </View>
  );
};

const TimerCard = ({
  payload,
  language,
  players,
  promptId,
  settings,
  requireDrinkingPlayers = false,
}) => {
  const duration = Math.max(5, Number(payload.durationSeconds) || 30);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setTimeLeft(duration);
    setRunning(false);
    setFinished(false);
    setCount(0);
  }, [duration, promptId]);

  useEffect(() => {
    if (!running) {
      return undefined;
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setRunning(false);
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running]);

  const requiresTarget = payload.targetMode === 'single';
  const target = useMemo(() => {
    if (!requiresTarget) {
      return null;
    }
    return pickRandomPlayer(players, language, { requireDrinker: requireDrinkingPlayers });
  }, [players, language, requiresTarget, promptId, requireDrinkingPlayers]);

  const targetName = target?.name || (language === 'de' ? 'jemand' : 'someone');

  const description = renderTemplateText(localize(payload.text, language) || '', {
    target: targetName,
  });

  const startLabel =
    running && payload.mode === 'counter'
      ? language === 'de'
        ? 'Läuft...'
        : 'Running...'
      : language === 'de'
        ? 'Timer starten'
        : 'Start timer';

  const handleStart = () => {
    setFinished(false);
    setCount(0);
    setTimeLeft(duration);
    setRunning(true);
  };

  const counterEnabled = payload.mode === 'counter';
  const counterHint =
    localize(payload.counterHint, language) ||
    (language === 'de'
      ? 'Jedes Mal, wenn ihr die Aufgabe schafft, tippt auf +1.'
      : 'Tap +1 every time you complete the action.');

  return (
    <View style={styles.cardContainer}>
      {description ? <Text style={styles.prefaceText}>{description}</Text> : null}
      <Text style={styles.timerValue}>{timeLeft.toString().padStart(2, '0')} s</Text>
      <TouchableOpacity
        style={[styles.choiceButton, running && styles.choiceButtonActive]}
        onPress={handleStart}
      >
        <Text style={styles.choiceLabel}>{startLabel}</Text>
      </TouchableOpacity>
      {counterEnabled ? (
        <>
          <Text style={styles.helperText}>{counterHint}</Text>
          <TouchableOpacity
            style={styles.counterButton}
            disabled={!running}
            onPress={() => setCount((prev) => prev + 1)}
          >
            <Text style={styles.counterLabel}>+1</Text>
          </TouchableOpacity>
          <Text style={styles.counterValue}>
            {language === 'de' ? 'Erfolge:' : 'Successes:'} {count}
          </Text>
        </>
      ) : null}
      {finished ? (
        <Text style={styles.helperText}>
          {localize(payload.successText, language) ||
            (language === 'de' ? 'Zeit vorbei!' : 'Time is up!')}
        </Text>
      ) : null}
    </View>
  );
};

const VoteCard = ({ payload, language }) => {
  const promptText =
    localize(payload.prompt, language) ||
    (language === 'de'
      ? 'Stimmt geheim ab. Die Minderheit trinkt die Strafe.'
      : 'Take a secret vote. The minority drinks.');
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.prefaceText}>{promptText}</Text>
      {payload.penalty ? (
        <Text style={styles.highlightText}>{localize(payload.penalty, language)}</Text>
      ) : null}
    </View>
  );
};

const ButternCard = ({
  payload,
  language,
  players,
  settings,
  promptId,
  requireDrinkingPlayers = false,
}) => {
  const { topicBuckets = [] } = payload;
  const desired = typeof settings?.desiredDrunkenness === 'number' ? settings.desiredDrunkenness : 5;
  const selectedBucket =
    topicBuckets.find(
      (bucket) =>
        typeof bucket.min === 'number' &&
        typeof bucket.max === 'number' &&
        desired >= bucket.min &&
        desired <= bucket.max,
    ) || topicBuckets[0];

  const topic = useMemo(() => {
    if (!selectedBucket || !Array.isArray(selectedBucket.topics)) {
      return '';
    }
    const list = selectedBucket.topics;
    if (list.length === 0) {
      return '';
    }
    const index = Math.floor(Math.random() * list.length);
    const entry = list[index];
    if (typeof entry === 'string') {
      return entry;
    }
    return localize(entry, language);
  }, [selectedBucket, promptId]);

  const target = useMemo(
    () => pickRandomPlayer(players, language, { requireDrinker: requireDrinkingPlayers }),
    [players, language, promptId, requireDrinkingPlayers],
  );

  const reward = payload.rewardPerCorrect || 1;

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.prefaceText}>
        {language === 'de'
          ? `Buttern-Runde für ${target.name}`
          : `\"Butter\" round for ${target.name}`}
      </Text>
      {selectedBucket?.label ? (
        <Text style={styles.helperText}>{localize(selectedBucket.label, language)}</Text>
      ) : null}
      <Text style={styles.highlightText}>
        {language === 'de' ? 'Thema:' : 'Topic:'} {topic || '—'}
      </Text>
      <Text style={styles.helperText}>
        {language === 'de'
          ? `Für jede richtige Antwort darf ${target.name} ${reward} Schluck verteilen.`
          : `For every correct answer, ${target.name} hands out ${reward} sips.`}
      </Text>
    </View>
  );
};

const TargetedActionCard = ({
  payload,
  language,
  players,
  settings,
  promptId,
  requireDrinkingPlayers = false,
}) => {
  const targetConfig = payload.target || { mode: 'single' };
  const [resolved, setResolved] = useState({});

  useEffect(() => {
    const next = {};
    switch (targetConfig.mode) {
      case 'subset': {
        const minCount = targetConfig.countRange?.[0] ?? targetConfig.count ?? 1;
        const maxCount = targetConfig.countRange?.[1] ?? targetConfig.count ?? minCount;
        const lower = Math.max(1, Math.min(minCount, maxCount));
        const upper = Math.max(lower, maxCount);
        const count =
          lower === upper ? lower : lower + Math.floor(Math.random() * (upper - lower + 1));
        const selection = pickMultiplePlayers(players, language, count, {
          requireDrinker: targetConfig.requireDrinker ?? requireDrinkingPlayers,
        });
        next.targetList = formatPlayerList(selection.names, language);
        next.names = selection.names;
        break;
      }
      case 'neighbor': {
        const neighbors = pickNeighborTargets(players, language);
        next.anchor = neighbors.anchor;
        next.left = neighbors.left;
        next.right = neighbors.right;
        break;
      }
      case 'single':
      default: {
        const single = pickRandomPlayer(players, language, {
          requireDrinker: targetConfig.requireDrinker ?? requireDrinkingPlayers,
        });
        next.target = single.name;
        break;
      }
    }
    setResolved(next);
  }, [players, language, targetConfig, promptId, requireDrinkingPlayers]);

  const amount = payload.drinkScaling
    ? computeDrinkAmount(settings, payload.drinkScaling, language)
    : null;

  const templateVariables = {
    target: resolved.target,
    targetList: resolved.targetList,
    anchor: resolved.anchor,
    left: resolved.left,
    right: resolved.right,
    amount: amount?.value,
    amountLabel: amount?.label,
  };

  const finalText = renderTemplateText(localize(payload.template, language) || '', templateVariables);

  return (
    <View style={styles.cardContainer}>
      <Question question={finalText} />
    </View>
  );
};

const TeamChallengeCard = ({ payload, language, players, promptId }) => {
  const teams = useMemo(() => splitIntoTeams(players), [players, promptId]);
  const [showChallenge, setShowChallenge] = useState(false);

  useEffect(() => {
    setShowChallenge(false);
  }, [promptId]);

  if (!teams) {
    return (
      <View style={styles.cardContainer}>
        <Text style={styles.helperText}>
          {language === 'de'
            ? 'Mindestens zwei Spieler*innen notwendig.'
            : 'Need at least two players.'}
        </Text>
      </View>
    );
  }

  const [teamA, teamB] = teams;
  const teamALabel = formatPlayerList(teamA.map((p) => p.name), language);
  const teamBLabel = formatPlayerList(teamB.map((p) => p.name), language);

  const challengeText = renderTemplateText(localize(payload.challengeText, language) || '', {
    teamA: teamALabel,
    teamB: teamBLabel,
  });

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.sectionLabel}>{language === 'de' ? 'Team A' : 'Team A'}</Text>
      <Text style={styles.sectionBody}>{teamALabel}</Text>
      <Text style={styles.sectionLabel}>{language === 'de' ? 'Team B' : 'Team B'}</Text>
      <Text style={styles.sectionBody}>{teamBLabel}</Text>
      {showChallenge ? (
        <Text style={styles.prefaceText}>{challengeText}</Text>
      ) : (
        <TouchableOpacity
          style={styles.revealButton}
          onPress={() => setShowChallenge(true)}
        >
          <Text style={styles.revealLabel}>
            {localize(payload.revealLabel, language) ||
              (language === 'de' ? 'Challenge anzeigen' : 'Show challenge')}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const VirusCard = ({ payload, language }) => {
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.virusTitle}>
        {localize(payload.title, language) || (language === 'de' ? 'Virus!' : 'Virus!')}
      </Text>
      <Text style={styles.prefaceText}>{localize(payload.rule, language)}</Text>
      {payload.penalty ? (
        <Text style={styles.highlightText}>{localize(payload.penalty, language)}</Text>
      ) : null}
      {payload.durationHint ? (
        <Text style={styles.helperText}>{localize(payload.durationHint, language)}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 8,
  },
  prefaceText: {
    ...appStyles.onlyTextBasedGameText,
    fontSize: 24,
    padding: 12,
  },
  helperText: {
    fontFamily: 'Quicksand_300Light',
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    fontSize: 16,
    paddingHorizontal: 12,
  },
  choiceRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
  },
  choiceButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 6,
  },
  choiceButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  choiceLabel: {
    fontFamily: 'Quicksand_300Bold',
    fontSize: 16,
    color: '#fff',
  },
  helperHint: {
    fontFamily: 'Quicksand_300Light',
    color: '#fff',
  },
  sectionContainer: {
    width: '100%',
    paddingVertical: 4,
    alignItems: 'center',
  },
  sectionLabel: {
    fontFamily: 'Quicksand_300Bold',
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    marginBottom: 4,
  },
  sectionBody: {
    fontFamily: 'Quicksand_300Light',
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  revealButton: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginTop: 8,
  },
  revealLabel: {
    fontFamily: 'Quicksand_300Bold',
    color: '#fff',
    fontSize: 15,
  },
  timerValue: {
    fontFamily: 'Quicksand_300Bold',
    color: '#fff',
    fontSize: 42,
  },
  counterButton: {
    borderRadius: 32,
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  counterLabel: {
    fontFamily: 'Quicksand_300Bold',
    color: '#fff',
    fontSize: 20,
  },
  counterValue: {
    fontFamily: 'Quicksand_300Light',
    color: '#fff',
    fontSize: 18,
  },
  highlightText: {
    fontFamily: 'Quicksand_300Bold',
    color: '#FFD700',
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  virusTitle: {
    fontFamily: 'Quicksand_300Bold',
    fontSize: 28,
    color: '#FF6347',
  },
});

export default PromptRenderer;
