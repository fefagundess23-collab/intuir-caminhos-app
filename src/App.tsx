import React, { useState, useEffect } from 'react';
import {
  AppTab,
  Practice,
  UserStateOption,
  QuickNeedOption,
  PostPracticeState,
  UserProgressData,
} from './types';
import { PRACTICES, USER_STATE_OPTIONS } from './data/practicesData';
import { storageService } from './services/storageService';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { HomeScreen } from './screens/HomeScreen';
import { JourneyScreen } from './screens/JourneyScreen';
import { QuickNeedScreen } from './screens/QuickNeedScreen';
import { LibraryScreen } from './screens/LibraryScreen';
import { PracticeRecommendationModal } from './screens/PracticeRecommendationModal';
import { GuidedPlayerScreen } from './screens/GuidedPlayerScreen';
import { PostPracticeScreen } from './screens/PostPracticeScreen';
import { ConclusionScreen } from './screens/ConclusionScreen';
import { BottomNavigation } from './components/BottomNavigation';
import { TopAppBar } from './components/TopAppBar';
import { OfflineIndicator } from './components/OfflineIndicator';

type ScreenMode = 'welcome' | 'main' | 'player' | 'post_practice' | 'conclusion';

export default function App() {
  const [progress, setProgress] = useState<UserProgressData>(() =>
    storageService.getProgress()
  );

  // Screen state
  const [screenMode, setScreenMode] = useState<ScreenMode>(() =>
    progress.hasSeenWelcome ? 'main' : 'welcome'
  );

  // Tab state inside 'main' screen
  const [currentTab, setCurrentTab] = useState<AppTab>('inicio');

  // Currently selected practice for player or recommendation
  const [activePractice, setActivePractice] = useState<Practice | null>(null);

  // Recommendation modal state
  const [isRecommendationOpen, setIsRecommendationOpen] = useState(false);
  const [selectedStateOption, setSelectedStateOption] = useState<UserStateOption | undefined>(
    undefined
  );
  const [customRecommendationKicker, setCustomRecommendationKicker] = useState<string | undefined>(
    undefined
  );
  const [customRecommendationMessage, setCustomRecommendationMessage] = useState<
    string | undefined
  >(undefined);

  // Refresh progress state from storage
  const reloadProgress = () => {
    setProgress(storageService.getProgress());
  };

  // Start from welcome screen
  const handleStartFromWelcome = () => {
    const updated = storageService.setSeenWelcome(true);
    setProgress(updated);
    setScreenMode('main');
  };

  // User taps one of 6 states on Home screen
  const handleSelectUserState = (option: UserStateOption) => {
    const recPractice =
      PRACTICES.find((p) => p.id === option.recommendedPracticeId) || PRACTICES[0];
    setActivePractice(recPractice);
    setSelectedStateOption(option);
    setCustomRecommendationKicker(undefined);
    setCustomRecommendationMessage(undefined);
    setIsRecommendationOpen(true);
  };

  // User selects an option in "Preciso Agora"
  const handleSelectQuickNeed = (
    option: QuickNeedOption,
    recommendedPractice: Practice
  ) => {
    setActivePractice(recommendedPractice);
    setSelectedStateOption(undefined);
    setCustomRecommendationKicker(option.label.toUpperCase() + '?');
    setCustomRecommendationMessage(option.explanation);
    setIsRecommendationOpen(true);
  };

  // Direct start from journey or library
  const handleSelectPracticeDirect = (practice: Practice) => {
    setActivePractice(practice);
    setScreenMode('player');
  };

  // Start practice from recommendation modal
  const handleStartRecommendedPractice = (practice: Practice) => {
    setIsRecommendationOpen(false);
    setActivePractice(practice);
    setScreenMode('player');
  };

  // From recommendation modal: Explore other practices
  const handleExploreOtherPractices = () => {
    setIsRecommendationOpen(false);
    setCurrentTab('praticas');
  };

  // Player completed practice or user clicked finish
  const handleFinishPractice = () => {
    setScreenMode('post_practice');
  };

  // Cancel player without saving
  const handleCancelPlayer = () => {
    setScreenMode('main');
    setActivePractice(null);
  };

  // Save post-practice reflection
  const handleSavePostPractice = (
    feelingAfter: PostPracticeState,
    feelingLabel: string,
    note?: string
  ) => {
    if (!activePractice) return;

    const updated = storageService.markPracticeCompleted({
      practiceId: activePractice.id,
      dayNumber: activePractice.dayNumber,
      practiceTitle: activePractice.title,
      feelingAfter,
      feelingLabel,
      note,
    });

    setProgress(updated);
    setScreenMode('conclusion');
  };

  // From conclusion screen
  const handleGoHome = () => {
    setScreenMode('main');
    setCurrentTab('inicio');
    setActivePractice(null);
  };

  const handleGoJourney = () => {
    setScreenMode('main');
    setCurrentTab('percurso');
    setActivePractice(null);
  };

  // Toggle favorite
  const handleToggleFavorite = (practiceId: string) => {
    const updated = storageService.toggleFavorite(practiceId);
    setProgress(updated);
  };

  // Render view
  return (
    <div className="min-h-screen bg-[#EFECE6] flex justify-center items-stretch sm:py-6 sm:px-4">
      <OfflineIndicator />

      {/* Mobile-first centered app shell */}
      <div className="w-full max-w-md bg-[#F7F5F0] min-h-screen sm:min-h-[844px] sm:max-h-[920px] sm:rounded-[36px] shadow-2xl flex flex-col relative overflow-hidden border border-[#EDE7DC]/90">
        {screenMode === 'welcome' && (
          <WelcomeScreen onStart={handleStartFromWelcome} />
        )}

        {screenMode === 'player' && activePractice && (
          <GuidedPlayerScreen
            practice={activePractice}
            onFinish={handleFinishPractice}
            onCancel={handleCancelPlayer}
          />
        )}

        {screenMode === 'post_practice' && activePractice && (
          <PostPracticeScreen
            practice={activePractice}
            onSave={handleSavePostPractice}
          />
        )}

        {screenMode === 'conclusion' && (
          <ConclusionScreen
            progress={progress}
            onGoHome={handleGoHome}
            onGoJourney={handleGoJourney}
          />
        )}

        {screenMode === 'main' && (
          <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
            <TopAppBar completedCount={progress.completedPracticesCount} />

            <main className="flex-1 px-5 pt-4">
              {currentTab === 'inicio' && (
                <HomeScreen
                  progress={progress}
                  onSelectState={handleSelectUserState}
                  onStartPractice={handleSelectPracticeDirect}
                  onGoToJourney={() => setCurrentTab('percurso')}
                />
              )}

              {currentTab === 'percurso' && (
                <JourneyScreen
                  progress={progress}
                  onSelectPractice={handleSelectPracticeDirect}
                />
              )}

              {currentTab === 'preciso_agora' && (
                <QuickNeedScreen onSelectOption={handleSelectQuickNeed} />
              )}

              {currentTab === 'praticas' && (
                <LibraryScreen
                  progress={progress}
                  onSelectPractice={handleSelectPracticeDirect}
                  onToggleFavorite={handleToggleFavorite}
                />
              )}
            </main>

            <BottomNavigation
              currentTab={currentTab}
              onSelectTab={(tab) => setCurrentTab(tab)}
            />
          </div>
        )}

        {/* Recommendation Modal */}
        {isRecommendationOpen && activePractice && (
          <PracticeRecommendationModal
            practice={activePractice}
            stateOption={selectedStateOption}
            customLeadKicker={customRecommendationKicker}
            customLeadMessage={customRecommendationMessage}
            onClose={() => setIsRecommendationOpen(false)}
            onStartPractice={handleStartRecommendedPractice}
            onExploreOther={handleExploreOtherPractices}
          />
        )}
      </div>
    </div>
  );
}
