import React, { useState, useEffect, Suspense, lazy, useCallback } from 'react';
import { ActiveDesktopTab, GlobalViewMode, ScriptType } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { PwaInstallPrompt } from './components/PwaInstallPrompt';
import type { AdminTab } from './components/AdminMasterStudio';

// Lazy-loaded feature modules for instant startup & buttery smooth tab switching
const DictionaryModule = lazy(() => import('./components/DictionaryModule').then(m => ({ default: m.DictionaryModule })));
const LearnModule = lazy(() => import('./components/LearnModule').then(m => ({ default: m.LearnModule })));
const TranslatorModule = lazy(() => import('./components/TranslatorModule').then(m => ({ default: m.TranslatorModule })));
const DailyVocabQuiz = lazy(() => import('./components/DailyVocabQuiz').then(m => ({ default: m.DailyVocabQuiz })));
const SantaliPhrasebook = lazy(() => import('./components/SantaliPhrasebook').then(m => ({ default: m.SantaliPhrasebook })));
const SantaliFlashcards = lazy(() => import('./components/SantaliFlashcards').then(m => ({ default: m.SantaliFlashcards })));
const CalligraphyStudio = lazy(() => import('./components/CalligraphyStudio').then(m => ({ default: m.CalligraphyStudio })));
const KudumProverbs = lazy(() => import('./components/KudumProverbs').then(m => ({ default: m.KudumProverbs })));
const CulturalCalendar = lazy(() => import('./components/CulturalCalendar').then(m => ({ default: m.CulturalCalendar })));
const SantaliWordleGame = lazy(() => import('./components/SantaliWordleGame').then(m => ({ default: m.SantaliWordleGame })));
const FolkStoriesPlayer = lazy(() => import('./components/FolkStoriesPlayer').then(m => ({ default: m.FolkStoriesPlayer })));
const PronunciationCoach = lazy(() => import('./components/PronunciationCoach').then(m => ({ default: m.PronunciationCoach })));
const TextSpeakerReader = lazy(() => import('./components/TextSpeakerReader').then(m => ({ default: m.TextSpeakerReader })));
const SantaliInstrumentsPad = lazy(() => import('./components/SantaliInstrumentsPad').then(m => ({ default: m.SantaliInstrumentsPad })));
const SantaliFamilyTree = lazy(() => import('./components/SantaliFamilyTree').then(m => ({ default: m.SantaliFamilyTree })));
const SantaliKidsJukebox = lazy(() => import('./components/SantaliKidsJukebox').then(m => ({ default: m.SantaliKidsJukebox })));
const SantaliClockNumbers = lazy(() => import('./components/SantaliClockNumbers').then(m => ({ default: m.SantaliClockNumbers })));
const SantaliClansDirectory = lazy(() => import('./components/SantaliClansDirectory').then(m => ({ default: m.SantaliClansDirectory })));
const AdivasiFloraWorksheet = lazy(() => import('./components/AdivasiFloraWorksheet').then(m => ({ default: m.AdivasiFloraWorksheet })));
const MajhiParganaSystem = lazy(() => import('./components/MajhiParganaSystem').then(m => ({ default: m.MajhiParganaSystem })));
const SantaliGrammarBuilder = lazy(() => import('./components/SantaliGrammarBuilder').then(m => ({ default: m.SantaliGrammarBuilder })));
const SantaliGreetingMaker = lazy(() => import('./components/SantaliGreetingMaker').then(m => ({ default: m.SantaliGreetingMaker })));
const SantaliHerbalRemedies = lazy(() => import('./components/SantaliHerbalRemedies').then(m => ({ default: m.SantaliHerbalRemedies })));
const SantaliCreationMyth = lazy(() => import('./components/SantaliCreationMyth').then(m => ({ default: m.SantaliCreationMyth })));
const SantaliDancesTop10 = lazy(() => import('./components/SantaliDancesTop10').then(m => ({ default: m.SantaliDancesTop10 })));
const SantaliBongaBuruTop15 = lazy(() => import('./components/SantaliBongaBuruTop15').then(m => ({ default: m.SantaliBongaBuruTop15 })));
const SantaliAttireOrnaments = lazy(() => import('./components/SantaliAttireOrnaments').then(m => ({ default: m.SantaliAttireOrnaments })));
const SantaliMarriageBapla = lazy(() => import('./components/SantaliMarriageBapla').then(m => ({ default: m.SantaliMarriageBapla })));
const SanthalHulHeroes = lazy(() => import('./components/SanthalHulHeroes').then(m => ({ default: m.SanthalHulHeroes })));
const SantaliCuisineRecipes = lazy(() => import('./components/SantaliCuisineRecipes').then(m => ({ default: m.SantaliCuisineRecipes })));
const SantaliTraditionalSports = lazy(() => import('./components/SantaliTraditionalSports').then(m => ({ default: m.SantaliTraditionalSports })));
const SantaliFolkSongsArchive = lazy(() => import('./components/SantaliFolkSongsArchive').then(m => ({ default: m.SantaliFolkSongsArchive })));
const SantaliPilgrimageSites = lazy(() => import('./components/SantaliPilgrimageSites').then(m => ({ default: m.SantaliPilgrimageSites })));
const SantaliLifeRites = lazy(() => import('./components/SantaliLifeRites').then(m => ({ default: m.SantaliLifeRites })));
const SohraiMuralArt = lazy(() => import('./components/SohraiMuralArt').then(m => ({ default: m.SohraiMuralArt })));
const SantaliProverbsBhenta = lazy(() => import('./components/SantaliProverbsBhenta').then(m => ({ default: m.SantaliProverbsBhenta })));
const SantaliAgriSeasons = lazy(() => import('./components/SantaliAgriSeasons').then(m => ({ default: m.SantaliAgriSeasons })));
const SantaliTraditionalMeasures = lazy(() => import('./components/SantaliTraditionalMeasures').then(m => ({ default: m.SantaliTraditionalMeasures })));
const SantaliArchitecture = lazy(() => import('./components/SantaliArchitecture').then(m => ({ default: m.SantaliArchitecture })));
const SantaliHistoricalGarhs = lazy(() => import('./components/SantaliHistoricalGarhs').then(m => ({ default: m.SantaliHistoricalGarhs })));
const SantaliPuppetryTheater = lazy(() => import('./components/SantaliPuppetryTheater').then(m => ({ default: m.SantaliPuppetryTheater })));
const SantaliAstronomySkyLore = lazy(() => import('./components/SantaliAstronomySkyLore').then(m => ({ default: m.SantaliAstronomySkyLore })));
const SantaliSendraLobir = lazy(() => import('./components/SantaliSendraLobir').then(m => ({ default: m.SantaliSendraLobir })));
const SantaliDhokraArt = lazy(() => import('./components/SantaliDhokraArt').then(m => ({ default: m.SantaliDhokraArt })));
const SantaliWaterHarvesting = lazy(() => import('./components/SantaliWaterHarvesting').then(m => ({ default: m.SantaliWaterHarvesting })));
const SantaliHandloomWeaving = lazy(() => import('./components/SantaliHandloomWeaving').then(m => ({ default: m.SantaliHandloomWeaving })));
const SantaliLivestockKhuntau = lazy(() => import('./components/SantaliLivestockKhuntau').then(m => ({ default: m.SantaliLivestockKhuntau })));
const SantaliWoodcraftCarpentry = lazy(() => import('./components/SantaliWoodcraftCarpentry').then(m => ({ default: m.SantaliWoodcraftCarpentry })));
const SantaliBambooCraft = lazy(() => import('./components/SantaliBambooCraft').then(m => ({ default: m.SantaliBambooCraft })));
const SantaliPhoneticsLab = lazy(() => import('./components/SantaliPhoneticsLab').then(m => ({ default: m.SantaliPhoneticsLab })));
const SantaliBabyNamesDirectory = lazy(() => import('./components/SantaliBabyNamesDirectory').then(m => ({ default: m.SantaliBabyNamesDirectory })));
const SantaliOrnamentsJewellery = lazy(() => import('./components/SantaliOrnamentsJewellery').then(m => ({ default: m.SantaliOrnamentsJewellery })));
const SantaliBlacksmithyIronCraft = lazy(() => import('./components/SantaliBlacksmithyIronCraft').then(m => ({ default: m.SantaliBlacksmithyIronCraft })));
const SantaliSeasonsWeatherLore = lazy(() => import('./components/SantaliSeasonsWeatherLore').then(m => ({ default: m.SantaliSeasonsWeatherLore })));
const SantaliIdiomsMenkatha = lazy(() => import('./components/SantaliIdiomsMenkatha').then(m => ({ default: m.SantaliIdiomsMenkatha })));
const SantaliTraditionalHerbalDrinks = lazy(() => import('./components/SantaliTraditionalHerbalDrinks').then(m => ({ default: m.SantaliTraditionalHerbalDrinks })));
const SantaliArcheryGameSimulator = lazy(() => import('./components/SantaliArcheryGameSimulator').then(m => ({ default: m.SantaliArcheryGameSimulator })));
const SantaliTraditionalCuisine = lazy(() => import('./components/SantaliTraditionalCuisine').then(m => ({ default: m.SantaliTraditionalCuisine })));
const SantaliMarriageLifeRituals = lazy(() => import('./components/SantaliMarriageLifeRituals').then(m => ({ default: m.SantaliMarriageLifeRituals })));
const SantaliRiddlesKudumGame = lazy(() => import('./components/SantaliRiddlesKudumGame').then(m => ({ default: m.SantaliRiddlesKudumGame })));
const SantaliSacredPilgrimages = lazy(() => import('./components/SantaliSacredPilgrimages').then(m => ({ default: m.SantaliSacredPilgrimages })));
const SantaliSpokenDialogues = lazy(() => import('./components/SantaliSpokenDialogues').then(m => ({ default: m.SantaliSpokenDialogues })));
const SantaliFormalLetterTemplates = lazy(() => import('./components/SantaliFormalLetterTemplates').then(m => ({ default: m.SantaliFormalLetterTemplates })));
const SantaliIllustratedFolkTales = lazy(() => import('./components/SantaliIllustratedFolkTales').then(m => ({ default: m.SantaliIllustratedFolkTales })));
const SantaliFavoritesNotebook = lazy(() => import('./components/SantaliFavoritesNotebook').then(m => ({ default: m.SantaliFavoritesNotebook })));
const SantaliProficiencyCertificate = lazy(() => import('./components/SantaliProficiencyCertificate').then(m => ({ default: m.SantaliProficiencyCertificate })));
const SantaliSocialCardStudio = lazy(() => import('./components/SantaliSocialCardStudio').then(m => ({ default: m.SantaliSocialCardStudio })));
const SantaliLunarCalendarClock = lazy(() => import('./components/SantaliLunarCalendarClock').then(m => ({ default: m.SantaliLunarCalendarClock })));
const SantaliSerengKaraoke = lazy(() => import('./components/SantaliSerengKaraoke').then(m => ({ default: m.SantaliSerengKaraoke })));
const SantaliVillageTour = lazy(() => import('./components/SantaliVillageTour').then(m => ({ default: m.SantaliVillageTour })));
const SantaliWildFoodsNutrition = lazy(() => import('./components/SantaliWildFoodsNutrition').then(m => ({ default: m.SantaliWildFoodsNutrition })));
const SantaliFolkRadio = lazy(() => import('./components/SantaliFolkRadio').then(m => ({ default: m.SantaliFolkRadio })));
const SantaliEthnoMedicine = lazy(() => import('./components/SantaliEthnoMedicine').then(m => ({ default: m.SantaliEthnoMedicine })));
const SantaliMultiScriptConverter = lazy(() => import('./components/SantaliMultiScriptConverter').then(m => ({ default: m.SantaliMultiScriptConverter })));
const SantaliKidsSoundboard = lazy(() => import('./components/SantaliKidsSoundboard').then(m => ({ default: m.SantaliKidsSoundboard })));
const SantaliWallpaperStudio = lazy(() => import('./components/SantaliWallpaperStudio').then(m => ({ default: m.SantaliWallpaperStudio })));
const SantaliClanGenealogy = lazy(() => import('./components/SantaliClanGenealogy').then(m => ({ default: m.SantaliClanGenealogy })));
const SantaliHaatBarterSimulator = lazy(() => import('./components/SantaliHaatBarterSimulator').then(m => ({ default: m.SantaliHaatBarterSimulator })));
const SantaliBaplaChantsStudio = lazy(() => import('./components/SantaliBaplaChantsStudio').then(m => ({ default: m.SantaliBaplaChantsStudio })));
const SantaliBirdLoreEthnoOrnithology = lazy(() => import('./components/SantaliBirdLoreEthnoOrnithology').then(m => ({ default: m.SantaliBirdLoreEthnoOrnithology })));
const SantaliGodnaBodyArt = lazy(() => import('./components/SantaliGodnaBodyArt').then(m => ({ default: m.SantaliGodnaBodyArt })));
const SantaliIndigenousSeedsHeirloom = lazy(() => import('./components/SantaliIndigenousSeedsHeirloom').then(m => ({ default: m.SantaliIndigenousSeedsHeirloom })));
const SantaliGreetingsEtiquetteSimulator = lazy(() => import('./components/SantaliGreetingsEtiquetteSimulator').then(m => ({ default: m.SantaliGreetingsEtiquetteSimulator })));
const SantaliInstrumentsOrchestra = lazy(() => import('./components/SantaliInstrumentsOrchestra').then(m => ({ default: m.SantaliInstrumentsOrchestra })));
const SantaliBoneSettingHealing = lazy(() => import('./components/SantaliBoneSettingHealing').then(m => ({ default: m.SantaliBoneSettingHealing })));
const SantaliLoBirCourtSimulator = lazy(() => import('./components/SantaliLoBirCourtSimulator').then(m => ({ default: m.SantaliLoBirCourtSimulator })));
const SantaliOlChikiPenmanshipWorkbook = lazy(() => import('./components/SantaliOlChikiPenmanshipWorkbook').then(m => ({ default: m.SantaliOlChikiPenmanshipWorkbook })));
const SantaliHandiFermentationLore = lazy(() => import('./components/SantaliHandiFermentationLore').then(m => ({ default: m.SantaliHandiFermentationLore })));
const SantaliIpilConstellationsAstronomy = lazy(() => import('./components/SantaliIpilConstellationsAstronomy').then(m => ({ default: m.SantaliIpilConstellationsAstronomy })));
const SantaliNahelDhenkiCraft = lazy(() => import('./components/SantaliNahelDhenkiCraft').then(m => ({ default: m.SantaliNahelDhenkiCraft })));
const SantaliIndigenousSportsKati = lazy(() => import('./components/SantaliIndigenousSportsKati').then(m => ({ default: m.SantaliIndigenousSportsKati })));
const SantaliTraditionalFishingCraft = lazy(() => import('./components/SantaliTraditionalFishingCraft').then(m => ({ default: m.SantaliTraditionalFishingCraft })));
const SantaliNaturalPigmentsCraft = lazy(() => import('./components/SantaliNaturalPigmentsCraft').then(m => ({ default: m.SantaliNaturalPigmentsCraft })));
const SantaliBanamTamakLuthier = lazy(() => import('./components/SantaliBanamTamakLuthier').then(m => ({ default: m.SantaliBanamTamakLuthier })));
const SantaliJaherGroveEcology = lazy(() => import('./components/SantaliJaherGroveEcology').then(m => ({ default: m.SantaliJaherGroveEcology })));
const SantaliCustomaryOathsJustice = lazy(() => import('./components/SantaliCustomaryOathsJustice').then(m => ({ default: m.SantaliCustomaryOathsJustice })));
const SantaliSasandiriMegalithicLore = lazy(() => import('./components/SantaliSasandiriMegalithicLore').then(m => ({ default: m.SantaliSasandiriMegalithicLore })));
const SantaliIndigenousMathGeometry = lazy(() => import('./components/SantaliIndigenousMathGeometry').then(m => ({ default: m.SantaliIndigenousMathGeometry })));
const SantaliWildHoneyHarvesting = lazy(() => import('./components/SantaliWildHoneyHarvesting').then(m => ({ default: m.SantaliWildHoneyHarvesting })));
const SantaliAnimalBehaviorOmens = lazy(() => import('./components/SantaliAnimalBehaviorOmens').then(m => ({ default: m.SantaliAnimalBehaviorOmens })));
const SantaliTextileDyesBlockPrint = lazy(() => import('./components/SantaliTextileDyesBlockPrint').then(m => ({ default: m.SantaliTextileDyesBlockPrint })));
const SantaliMidwiferyCareLore = lazy(() => import('./components/SantaliMidwiferyCareLore').then(m => ({ default: m.SantaliMidwiferyCareLore })));
const SantaliUniversalTextReader = lazy(() => import('./components/SantaliUniversalTextReader').then(m => ({ default: m.SantaliUniversalTextReader })));
const SantaliKaramBintiEpic = lazy(() => import('./components/SantaliKaramBintiEpic').then(m => ({ default: m.SantaliKaramBintiEpic })));
const SantaliEpigraphyNumismatics = lazy(() => import('./components/SantaliEpigraphyNumismatics').then(m => ({ default: m.SantaliEpigraphyNumismatics })));
const SantaliIllustratedComicsReader = lazy(() => import('./components/SantaliIllustratedComicsReader').then(m => ({ default: m.SantaliIllustratedComicsReader })));
const SantaliVerbConjugator = lazy(() => import('./components/SantaliVerbConjugator').then(m => ({ default: m.SantaliVerbConjugator })));
const SantaliLiteraryArchives = lazy(() => import('./components/SantaliLiteraryArchives').then(m => ({ default: m.SantaliLiteraryArchives })));
const SantaliBullockCartCraft = lazy(() => import('./components/SantaliBullockCartCraft').then(m => ({ default: m.SantaliBullockCartCraft })));
const SantaliTerracottaPottery = lazy(() => import('./components/SantaliTerracottaPottery').then(m => ({ default: m.SantaliTerracottaPottery })));
const SantaliFiberMatCraft = lazy(() => import('./components/SantaliFiberMatCraft').then(m => ({ default: m.SantaliFiberMatCraft })));
const SantaliLivestockEthnoVet = lazy(() => import('./components/SantaliLivestockEthnoVet').then(m => ({ default: m.SantaliLivestockEthnoVet })));
const SantaliMuhuratAlmanac = lazy(() => import('./components/SantaliMuhuratAlmanac').then(m => ({ default: m.SantaliMuhuratAlmanac })));
const SantaliSptPesaRights = lazy(() => import('./components/SantaliSptPesaRights').then(m => ({ default: m.SantaliSptPesaRights })));
const SantaliRegionalDialects = lazy(() => import('./components/SantaliRegionalDialects').then(m => ({ default: m.SantaliRegionalDialects })));
const SantaliAnchoringSpeechKit = lazy(() => import('./components/SantaliAnchoringSpeechKit').then(m => ({ default: m.SantaliAnchoringSpeechKit })));
const SantaliTasarSericulture = lazy(() => import('./components/SantaliTasarSericulture').then(m => ({ default: m.SantaliTasarSericulture })));
const SantaliOilPressKolhu = lazy(() => import('./components/SantaliOilPressKolhu').then(m => ({ default: m.SantaliOilPressKolhu })));
const SantaliFoodPreservationLore = lazy(() => import('./components/SantaliFoodPreservationLore').then(m => ({ default: m.SantaliFoodPreservationLore })));
const SantaliDongaBoatLore = lazy(() => import('./components/SantaliDongaBoatLore').then(m => ({ default: m.SantaliDongaBoatLore })));
const SantaliAherPyneWater = lazy(() => import('./components/SantaliAherPyneWater').then(m => ({ default: m.SantaliAherPyneWater })));
const SantaliForestFireEcology = lazy(() => import('./components/SantaliForestFireEcology').then(m => ({ default: m.SantaliForestFireEcology })));
const SantaliTypingSpeedTest = lazy(() => import('./components/SantaliTypingSpeedTest').then(m => ({ default: m.SantaliTypingSpeedTest })));
const SantaliPahadaTables = lazy(() => import('./components/SantaliPahadaTables').then(m => ({ default: m.SantaliPahadaTables })));
const SantaliStreakTracker = lazy(() => import('./components/SantaliStreakTracker').then(m => ({ default: m.SantaliStreakTracker })));
const SantaliWordPinboard = lazy(() => import('./components/SantaliWordPinboard').then(m => ({ default: m.SantaliWordPinboard })));
const SantaliExamPrepHub = lazy(() => import('./components/SantaliExamPrepHub').then(m => ({ default: m.SantaliExamPrepHub })));
const SantaliDictationLab = lazy(() => import('./components/SantaliDictationLab').then(m => ({ default: m.SantaliDictationLab })));
const SantaliWordMatchGame = lazy(() => import('./components/SantaliWordMatchGame').then(m => ({ default: m.SantaliWordMatchGame })));
const SantaliMedicalTranslator = lazy(() => import('./components/SantaliMedicalTranslator').then(m => ({ default: m.SantaliMedicalTranslator })));
const SantaliGramSabhaDrafter = lazy(() => import('./components/SantaliGramSabhaDrafter').then(m => ({ default: m.SantaliGramSabhaDrafter })));
const SantaliNewsTeleprompter = lazy(() => import('./components/SantaliNewsTeleprompter').then(m => ({ default: m.SantaliNewsTeleprompter })));
const SantaliDataBackupManager = lazy(() => import('./components/SantaliDataBackupManager').then(m => ({ default: m.SantaliDataBackupManager })));
const SantaliTalaMetronome = lazy(() => import('./components/SantaliTalaMetronome').then(m => ({ default: m.SantaliTalaMetronome })));
const SantaliInstrumentTuner = lazy(() => import('./components/SantaliInstrumentTuner').then(m => ({ default: m.SantaliInstrumentTuner })));
const SantaliLandTopography = lazy(() => import('./components/SantaliLandTopography').then(m => ({ default: m.SantaliLandTopography })));
const SantaliMicroJournal = lazy(() => import('./components/SantaliMicroJournal').then(m => ({ default: m.SantaliMicroJournal })));
const SantaliWitRiddlesArena = lazy(() => import('./components/SantaliWitRiddlesArena').then(m => ({ default: m.SantaliWitRiddlesArena })));
const SantaliDanceAkhdaGuide = lazy(() => import('./components/SantaliDanceAkhdaGuide').then(m => ({ default: m.SantaliDanceAkhdaGuide })));
const SantaliGrammarChecker = lazy(() => import('./components/SantaliGrammarChecker').then(m => ({ default: m.SantaliGrammarChecker })));
const SantaliCrosswordGame = lazy(() => import('./components/SantaliCrosswordGame').then(m => ({ default: m.SantaliCrosswordGame })));
const SantaliWildlifeFloraQuiz = lazy(() => import('./components/SantaliWildlifeFloraQuiz').then(m => ({ default: m.SantaliWildlifeFloraQuiz })));
const SantaliInvitationCertificateStudio = lazy(() => import('./components/SantaliInvitationCertificateStudio').then(m => ({ default: m.SantaliInvitationCertificateStudio })));
const SantaliSentenceScramble = lazy(() => import('./components/SantaliSentenceScramble').then(m => ({ default: m.SantaliSentenceScramble })));
const SantaliPoetryRhymeStudio = lazy(() => import('./components/SantaliPoetryRhymeStudio').then(m => ({ default: m.SantaliPoetryRhymeStudio })));
const SantaliPocketBookletMaker = lazy(() => import('./components/SantaliPocketBookletMaker').then(m => ({ default: m.SantaliPocketBookletMaker })));
const SantaliClanKinshipChecker = lazy(() => import('./components/SantaliClanKinshipChecker').then(m => ({ default: m.SantaliClanKinshipChecker })));
const SantaliCivicBankDialogue = lazy(() => import('./components/SantaliCivicBankDialogue').then(m => ({ default: m.SantaliCivicBankDialogue })));
const SantaliHaatFestivalPlanner = lazy(() => import('./components/SantaliHaatFestivalPlanner').then(m => ({ default: m.SantaliHaatFestivalPlanner })));
const SantaliWordSearchGame = lazy(() => import('./components/SantaliWordSearchGame').then(m => ({ default: m.SantaliWordSearchGame })));
const SantaliAudioMemoryGame = lazy(() => import('./components/SantaliAudioMemoryGame').then(m => ({ default: m.SantaliAudioMemoryGame })));
const SantaliVillageLayoutMap = lazy(() => import('./components/SantaliVillageLayoutMap').then(m => ({ default: m.SantaliVillageLayoutMap })));
const DailyCurrentAffairs2026 = lazy(() => import('./components/DailyCurrentAffairs2026').then(m => ({ default: m.DailyCurrentAffairs2026 })));
const SantaliNativeVoiceRecorder = lazy(() => import('./components/SantaliNativeVoiceRecorder').then(m => ({ default: m.SantaliNativeVoiceRecorder })));
const SantaliTwoPlayerQuizBattle = lazy(() => import('./components/SantaliTwoPlayerQuizBattle').then(m => ({ default: m.SantaliTwoPlayerQuizBattle })));
const SantaliSmartRevisionCoach = lazy(() => import('./components/SantaliSmartRevisionCoach').then(m => ({ default: m.SantaliSmartRevisionCoach })));
const SantaliDocumentBookReader = lazy(() => import('./components/SantaliDocumentBookReader').then(m => ({ default: m.SantaliDocumentBookReader })));
const SantaliCommunityBoard = lazy(() => import('./components/SantaliCommunityBoard').then(m => ({ default: m.SantaliCommunityBoard })));
const SantaliBeltAtlas = lazy(() => import('./components/SantaliBeltAtlas').then(m => ({ default: m.SantaliBeltAtlas })));
const SantaliRoleplaySimulator = lazy(() => import('./components/SantaliRoleplaySimulator').then(m => ({ default: m.SantaliRoleplaySimulator })));
const SantaliFamilyTreeBuilder = lazy(() => import('./components/SantaliFamilyTreeBuilder').then(m => ({ default: m.SantaliFamilyTreeBuilder })));
const SantaliTeacherWorksheetMaker = lazy(() => import('./components/SantaliTeacherWorksheetMaker').then(m => ({ default: m.SantaliTeacherWorksheetMaker })));
const SantaliChhatiarNameStudio = lazy(() => import('./components/SantaliChhatiarNameStudio').then(m => ({ default: m.SantaliChhatiarNameStudio })));
const SantaliAudioPlaylistPlayer = lazy(() => import('./components/SantaliAudioPlaylistPlayer').then(m => ({ default: m.SantaliAudioPlaylistPlayer })));
const SantaliCommunityHallOfFame = lazy(() => import('./components/SantaliCommunityHallOfFame').then(m => ({ default: m.SantaliCommunityHallOfFame })));
const SantaliOfflinePackManager = lazy(() => import('./components/SantaliOfflinePackManager').then(m => ({ default: m.SantaliOfflinePackManager })));
const SantaliSmartWriter = lazy(() => import('./components/SantaliSmartWriter').then(m => ({ default: m.SantaliSmartWriter })));
const SantaliEmergencyVoiceCards = lazy(() => import('./components/SantaliEmergencyVoiceCards').then(m => ({ default: m.SantaliEmergencyVoiceCards })));
const SantaliWeeklyBulletinMaker = lazy(() => import('./components/SantaliWeeklyBulletinMaker').then(m => ({ default: m.SantaliWeeklyBulletinMaker })));
const SantaliKidsStorybookMaker = lazy(() => import('./components/SantaliKidsStorybookMaker').then(m => ({ default: m.SantaliKidsStorybookMaker })));
const SantaliTenseSuffixDrill = lazy(() => import('./components/SantaliTenseSuffixDrill').then(m => ({ default: m.SantaliTenseSuffixDrill })));
const SantaliKrishiCropLedger = lazy(() => import('./components/SantaliKrishiCropLedger').then(m => ({ default: m.SantaliKrishiCropLedger })));
const SantaliQrWordCards = lazy(() => import('./components/SantaliQrWordCards').then(m => ({ default: m.SantaliQrWordCards })));
const SantaliPronounCaseLab = lazy(() => import('./components/SantaliPronounCaseLab').then(m => ({ default: m.SantaliPronounCaseLab })));
const SantaliBazaarPriceCalc = lazy(() => import('./components/SantaliBazaarPriceCalc').then(m => ({ default: m.SantaliBazaarPriceCalc })));
const SantaliSchoolPrayerAssembly = lazy(() => import('./components/SantaliSchoolPrayerAssembly').then(m => ({ default: m.SantaliSchoolPrayerAssembly })));
const SantaliPanchayatSchemeGuide = lazy(() => import('./components/SantaliPanchayatSchemeGuide').then(m => ({ default: m.SantaliPanchayatSchemeGuide })));
const SantaliBusRailHelpline = lazy(() => import('./components/SantaliBusRailHelpline').then(m => ({ default: m.SantaliBusRailHelpline })));
const SantaliAudioListeningTest = lazy(() => import('./components/SantaliAudioListeningTest').then(m => ({ default: m.SantaliAudioListeningTest })));
const SantaliSongLyricBuilder = lazy(() => import('./components/SantaliSongLyricBuilder').then(m => ({ default: m.SantaliSongLyricBuilder })));
const SantaliJoraKathaLab = lazy(() => import('./components/SantaliJoraKathaLab').then(m => ({ default: m.SantaliJoraKathaLab })));
const SantaliQuestionNegationLab = lazy(() => import('./components/SantaliQuestionNegationLab').then(m => ({ default: m.SantaliQuestionNegationLab })));
const SantaliSpellFixLab = lazy(() => import('./components/SantaliSpellFixLab').then(m => ({ default: m.SantaliSpellFixLab })));
const SantaliShgSavingsLedger = lazy(() => import('./components/SantaliShgSavingsLedger').then(m => ({ default: m.SantaliShgSavingsLedger })));
const SantaliMaternalChildHealth = lazy(() => import('./components/SantaliMaternalChildHealth').then(m => ({ default: m.SantaliMaternalChildHealth })));
const SantaliReportCardMaker = lazy(() => import('./components/SantaliReportCardMaker').then(m => ({ default: m.SantaliReportCardMaker })));
const SantaliLiteraryPioneers = lazy(() => import('./components/SantaliLiteraryPioneers').then(m => ({ default: m.SantaliLiteraryPioneers })));
const AdminMasterStudio = lazy(() => import('./components/AdminMasterStudio').then(m => ({ default: m.AdminMasterStudio })));
const MobileSimulator = lazy(() => import('./components/MobileSimulator').then(m => ({ default: m.MobileSimulator })));
const PresentationView = lazy(() => import('./components/PresentationView').then(m => ({ default: m.PresentationView })));
const AboutModal = lazy(() => import('./components/AboutModal').then(m => ({ default: m.AboutModal })));
const AdminLoginModal = lazy(() => import('./components/AdminLoginModal').then(m => ({ default: m.AdminLoginModal })));
const UserAuthModal = lazy(() => import('./components/UserAuthModal').then(m => ({ default: m.UserAuthModal })));
const FeedbackModal = lazy(() => import('./components/FeedbackModal').then(m => ({ default: m.FeedbackModal })));
const GlobalSearchModal = lazy(() => import('./components/GlobalSearchModal').then(m => ({ default: m.GlobalSearchModal })));
import { LiveOverridesGate } from './components/LiveOverridesGate';
import { GlobalTextReaderBar } from './components/GlobalTextReaderBar';
import { Footer } from './components/Footer';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { UserAuthProvider, useUserAuth } from './context/UserAuthContext';
import { TOP_10_VOICE_MODELS, getActiveVoiceProfile, setActiveVoiceProfile, speakWithFemaleVoice } from './utils/speech';
import { toOlChikiAuto } from './utils/olChikiTranslit';
import { openExternalSantaliKeyboard } from './utils/externalLinks';
import { Settings, Home, ShieldCheck, Megaphone, QrCode, X, Replace, Edit3, Volume2, User } from 'lucide-react';

function AppContent() {
  const [viewMode, setViewMode] = useState<GlobalViewMode>('desktop');
  const [activeTab, setActiveTabState] = useState<ActiveDesktopTab>('home');
  const [recentTabs, setRecentTabs] = useState<ActiveDesktopTab[]>(() => {
    try {
      const saved = localStorage.getItem('hor_katha_recent_tabs');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed.filter((t) => t !== 'keyboard') : [];
    } catch {
      return [];
    }
  });
  const [activeScript, setActiveScript] = useState<ScriptType>('roman');
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [userAuthModalOpen, setUserAuthModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true
  );
  const [translatorInitialText, setTranslatorInitialText] = useState('');
  const [adminInitialTab, setAdminInitialTab] = useState<AdminTab>('hero');
  const [activeVoiceId, setActiveVoiceId] = useState<string>(() => getActiveVoiceProfile().id);
  const [qrWordQuery, setQrWordQuery] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    const param = new URLSearchParams(window.location.search).get('qrword');
    return param && param.trim() ? param.trim() : null;
  });

  useEffect(() => {
    if (qrWordQuery) {
      setActiveTabState('dashboard');
    }
  }, [qrWordQuery]);

  useEffect(() => {
    const syncVoice = () => setActiveVoiceId(getActiveVoiceProfile().id);
    window.addEventListener('hor-katha-voice-changed', syncVoice);
    return () => window.removeEventListener('hor-katha-voice-changed', syncVoice);
  }, []);

  const { isAdmin, globalTickerText, globalTickerEnabled, words } = useAdmin();
  const { currentUser, isLoggedIn, updateMyPreferences } = useUserAuth();

  const qrMatchedWord = React.useMemo(() => {
    if (!qrWordQuery) return null;
    const q = qrWordQuery.toLowerCase();
    return (
      words.find(
        (w) =>
          w.wordRoman.toLowerCase() === q ||
          w.wordDevanagari.toLowerCase() === q
      ) ||
      words.find(
        (w) =>
          w.wordRoman.toLowerCase().includes(q) ||
          w.wordDevanagari.toLowerCase().includes(q) ||
          w.meaningHindi.toLowerCase().includes(q)
      ) ||
      null
    );
  }, [qrWordQuery, words]);

  const dismissQrSpotlight = () => {
    setQrWordQuery(null);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('qrword');
      window.history.replaceState({}, '', url.toString());
    }
  };

  // Sync preferred script when signed-in email user changes preferences
  useEffect(() => {
    if (currentUser?.preferences.preferredScript) {
      setActiveScript(currentUser.preferences.preferredScript);
    }
  }, [currentUser?.email, currentUser?.preferences.preferredScript]);

  const handleScriptChange = useCallback(
    (nextScript: ScriptType) => {
      setActiveScript(nextScript);
      if (isLoggedIn) {
        updateMyPreferences({ preferredScript: nextScript });
      }
    },
    [isLoggedIn, updateMyPreferences]
  );

  const setActiveTab = useCallback((tab: ActiveDesktopTab) => {
    if (tab === 'keyboard') {
      openExternalSantaliKeyboard();
      return;
    }
    setActiveTabState(tab);
    if (tab !== 'home' && tab !== 'settings' && tab !== 'about') {
      setRecentTabs(prev => {
        const next = [tab, ...prev.filter(t => t !== tab && t !== 'keyboard')].slice(0, 5);
        try {
          localStorage.setItem('hor_katha_recent_tabs', JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    }
  }, []);

  const getAdminTabForCurrentSection = (tab: ActiveDesktopTab): AdminTab | null => {
    switch (tab) {
      case 'home': return 'hero';
      case 'dashboard': return 'dictionary';
      case 'creation': return 'creation';
      case 'dances': return 'dances';
      case 'bonga_buru': return 'bonga_buru';
      case 'hul_heroes': return 'hul_heroes';
      case 'marriage_bapla':
      case 'marriage_rituals': return 'bapla';
      case 'attire_ornaments': return 'attire';
      case 'cuisine':
      case 'traditional_cuisine': return 'cuisine';
      case 'sports_sendra': return 'sports';
      case 'folk_songs': return 'songs';
      case 'pilgrimage':
      case 'sacred_pilgrimages': return 'pilgrimage';
      case 'life_rites': return 'rites';
      case 'governance': return 'governance';
      case 'herbal': return 'herbal';
      case 'calendar': return 'calendar';
      case 'clans': return 'clans';
      case 'phrasebook':
      case 'spoken_dialogues': return 'phrases';
      case 'kudum':
      case 'riddles_kudum': return 'riddles';
      // 22 Additional Cultural & Heritage Modules
      case 'sohrai_art': return 'sohrai_art';
      case 'proverbs_bhenta': return 'proverbs_bhenta';
      case 'agri_seasons': return 'agri_seasons';
      case 'traditional_measures': return 'traditional_measures';
      case 'architecture': return 'architecture';
      case 'historical_garhs': return 'historical_garhs';
      case 'puppetry_theater': return 'puppetry_theater';
      case 'astronomy_lore': return 'astronomy_lore';
      case 'sendra_lobir': return 'sendra_lobir';
      case 'dhokra_art': return 'dhokra_art';
      case 'water_harvesting': return 'water_harvesting';
      case 'handloom_weaving': return 'handloom_weaving';
      case 'livestock_khuntau': return 'livestock_khuntau';
      case 'woodcraft_carpentry': return 'woodcraft_carpentry';
      case 'bamboo_craft': return 'bamboo_craft';
      case 'phonetics_lab': return 'phonetics_lab';
      case 'baby_names': return 'baby_names';
      case 'ornaments_jewellery': return 'ornaments_jewellery';
      case 'blacksmithy_iron': return 'blacksmithy_iron';
      case 'seasons_weather': return 'seasons_weather';
      case 'idioms_menkatha': return 'idioms_menkatha';
      case 'herbal_drinks': return 'herbal_drinks';
      case 'sereng_karaoke': return 'songs';
      case 'village_tour': return 'governance';
      case 'wild_foods': return 'cuisine';
      case 'festival_cards':
      case 'greetings': return 'calendar';
      case 'folk_radio': return 'songs';
      case 'ethno_medicine': return 'herbal';
      case 'script_converter': return 'hero';
      case 'kids_soundboard': return 'hero';
      case 'wallpaper_studio': return 'sohrai_art';
      case 'clan_genealogy': return 'clans';
      case 'haat_barter': return 'traditional_measures';
      case 'bapla_chants': return 'bapla';
      case 'bird_lore': return 'herbal';
      case 'godna_body_art': return 'attire';
      case 'heirloom_seeds': return 'agri_seasons';
      case 'kinship_etiquette': return 'governance';
      case 'instruments_orchestra': return 'songs';
      case 'bone_setting_healing': return 'herbal';
      case 'lo_bir_court': return 'governance';
      case 'calligraphy_workbook': return 'hero';
      case 'handi_fermentation_lore': return 'herbal';
      case 'ipil_astronomy': return 'astronomy_lore';
      case 'nahel_dhenki_craft': return 'woodcraft_carpentry';
      case 'indigenous_sports_kati': return 'sports';
      case 'traditional_fishing_craft': return 'herbal';
      case 'natural_pigments_craft': return 'attire';
      case 'banam_tamak_luthier': return 'songs';
      case 'jaher_sacred_grove_ecology': return 'bonga_buru';
      case 'customary_oaths_justice': return 'governance';
      case 'sasandiri_megalithic_lore': return 'pilgrimage';
      case 'indigenous_math_geometry': return 'woodcraft_carpentry';
      case 'wild_honey_harvesting': return 'herbal';
      case 'animal_behavior_omens': return 'astronomy_lore';
      case 'indigenous_textile_dyes': return 'attire';
      case 'indigenous_midwifery_care': return 'herbal';
      case 'universal_text_reader': return 'hero';
      case 'karam_binti_epic_reader': return 'songs';
      case 'epigraphy_numismatics_lore': return 'pilgrimage';
      case 'illustrated_comics_reader': return 'hero';
      case 'santali_verb_conjugator': return 'phrases';
      case 'pera_hor_literature': return 'hero';
      case 'sagar_bullock_cart': return 'woodcraft_carpentry';
      case 'terracotta_pottery_lore': return 'attire';
      case 'babui_rope_mat_craft': return 'woodcraft_carpentry';
      case 'livestock_ethno_vet': return 'herbal';
      case 'muhurat_almanac_checker': return 'calendar';
      case 'spt_pesa_rights_guide': return 'governance';
      case 'santali_dialects_comparative': return 'phrases';
      case 'santali_anchoring_speeches': return 'phrases';
      case 'tasar_silk_sericulture': return 'attire';
      case 'mahua_oil_press_kolhu': return 'herbal';
      case 'sun_dried_forest_preservation': return 'cuisine';
      case 'donga_boat_river_lore': return 'woodcraft_carpentry';
      case 'aher_pyne_water_governance': return 'governance';
      case 'bir_sengel_fire_ecology': return 'herbal';
      case 'santali_typing_speed': return 'phrases';
      case 'santali_pahada_tables': return 'phrases';
      case 'learning_streak_tracker': return 'hero';
      case 'word_pinboard_notes': return 'dictionary';
      case 'santali_exam_prep_jpsc': return 'phrases';
      case 'santali_dictation_lab': return 'phrases';
      case 'santali_word_match_game': return 'dictionary';
      case 'santali_medical_translator': return 'herbal';
      case 'gram_sabha_form_drafter': return 'governance';
      case 'santali_news_bulletin_studio': return 'hero';
      case 'data_backup_manager': return 'hero';
      case 'santali_tala_metronome': return 'songs';
      case 'santali_instrument_tuner': return 'songs';
      case 'santali_land_topography': return 'agri_seasons';
      case 'santali_micro_journal': return 'phrases';
      case 'santali_wit_riddles_arena': return 'riddles';
      case 'dance_akhda_formations': return 'dances';
      case 'santali_grammar_checker': return 'phrases';
      case 'santali_crossword_puzzle': return 'dictionary';
      case 'wildlife_flora_quiz': return 'herbal';
      case 'invitation_certificate_maker': return 'calendar';
      case 'sentence_scramble_builder': return 'phrases';
      case 'poetry_sereng_studio': return 'songs';
      case 'pocket_study_booklet': return 'phrases';
      case 'clan_kinship_checker': return 'clans';
      case 'civic_bank_dialogue_kit': return 'phrases';
      case 'haat_festival_planner': return 'calendar';
      case 'santali_word_search_puzzle': return 'dictionary';
      case 'audio_memory_flip_game': return 'dictionary';
      case 'village_layout_landmark_map': return 'bonga_buru';
      case 'daily_current_affairs': return 'hero';
      case 'native_voice_recorder': return 'dictionary';
      case 'two_player_battle': return 'phrases';
      case 'santali_pronoun_case_lab': return 'phrases';
      case 'santali_bazaar_price_calc': return 'traditional_measures';
      case 'santali_school_prayer_assembly': return 'hero';
      case 'santali_panchayat_scheme_guide': return 'governance';
      case 'santali_bus_rail_helpline': return 'phrases';
      case 'santali_audio_listening_test': return 'phrases';
      case 'santali_song_lyric_builder': return 'songs';
      case 'santali_jora_katha_lab': return 'phrases';
      case 'santali_question_negation_lab': return 'phrases';
      case 'santali_spell_fix_lab': return 'phrases';
      case 'santali_shg_savings_ledger': return 'traditional_measures';
      case 'santali_maternal_child_health': return 'herbal';
      case 'santali_report_card_maker': return 'hero';
      case 'santali_literary_pioneers': return 'hero';
      // Complete coverage for all remaining platform & interactive tabs
      case 'learn':
      case 'letter_templates':
      case 'grammar':
      case 'roleplay_conversation':
      case 'teacher_worksheet_maker':
      case 'smart_essay_writer':
      case 'tense_suffix_drill': return 'phrases';
      case 'flashcards':
      case 'favorites_notebook':
      case 'smart_srs_coach':
      case 'qr_word_cards':
      case 'wordle':
      case 'translator':
      case 'daily_quiz': return 'dictionary';
      case 'calligraphy':
      case 'certification':
      case 'document_book_reader':
      case 'weekly_bulletin_maker':
      case 'speaker': return 'hero';
      case 'archery_simulator': return 'sports';
      case 'illustrated_stories':
      case 'audio_playlist_player':
      case 'kids_storybook_maker':
      case 'stories':
      case 'instruments':
      case 'kids_rhymes': return 'songs';
      case 'social_cards': return 'sohrai_art';
      case 'lunar_calendar': return 'calendar';
      case 'community_voice_events': return 'users_approvals';
      case 'santhal_belt_atlas': return 'pilgrimage';
      case 'family_tree_builder':
      case 'family_tree': return 'clans';
      case 'chhatiar_name_studio': return 'baby_names';
      case 'community_hall_of_fame': return 'hul_heroes';
      case 'offline_pack_manager': return 'backup';
      case 'emergency_voice_cards':
      case 'flora_worksheets': return 'herbal';
      case 'krishi_crop_ledger': return 'agri_seasons';
      case 'speech_coach': return 'phonetics_lab';
      case 'clock_numbers': return 'traditional_measures';
      default: return 'live_overrides';
    }
  };

  const handleSendToTranslator = (text: string) => {
    setTranslatorInitialText(text);
    setActiveTab('translator');
    if (viewMode === 'mobile_simulator' || viewMode === 'presentation') {
      setViewMode('desktop');
    }
  };

  const handleSelectWordForKeyboard = (word: string) => {
    if (word && typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(word).catch(() => {});
    }
    openExternalSantaliKeyboard();
  };

  // Global Ctrl+K / Cmd+K search shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div data-hor-app-root="true" className="min-h-screen bg-[#F1F5F9] text-slate-900 flex flex-col font-sans transition-colors duration-150 overflow-x-hidden">
      {/* Universal Top Header with Fitted Reader Controls & Top-Right Home Icon */}
      <Header
        activeTab={activeTab}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        activeScript={activeScript}
        onScriptChange={handleScriptChange}
        onOpenAbout={() => setAboutModalOpen(true)}
        onOpenAdmin={() => setAdminModalOpen(true)}
        onOpenUserAuth={() => setUserAuthModalOpen(true)}
        onOpenFeedback={() => setFeedbackModalOpen(true)}
        onOpenDailyQuiz={() => setActiveTab('daily_quiz')}
        onOpenSearch={() => setSearchModalOpen(true)}
        onGoHome={() => {
          setViewMode('desktop');
          setActiveTab('home');
        }}
        isHomeActive={viewMode === 'desktop' && activeTab === 'home'}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
      />

      {/* PWA Offline & Install Promotion Manager */}
      <PwaInstallPrompt />

      {/* Main Viewport Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* MODE 1: Desktop & Responsive Suite */}
        {viewMode === 'desktop' && (
          <div className="flex-1 flex w-full relative">
            {/* Responsive Slide-Over Sidebar Drawer for Mobile/Tablet */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 z-50 md:hidden bg-slate-900/45 backdrop-blur-xs flex print:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <div
                  className="bg-white h-full shadow-2xl overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Sidebar
                    activeTab={activeTab}
                    onTabChange={(tab) => {
                      setActiveTab(tab);
                      setSidebarOpen(false);
                    }}
                    recentTabs={recentTabs}
                    onOpenAbout={() => {
                      setAboutModalOpen(true);
                      setSidebarOpen(false);
                    }}
                    onOpenHelp={() => {
                      setAboutModalOpen(true);
                      setSidebarOpen(false);
                    }}
                    onOpenFeedback={() => {
                      setFeedbackModalOpen(true);
                      setSidebarOpen(false);
                    }}
                    onToggleSidebar={() => setSidebarOpen(false)}
                  />
                </div>
              </div>
            )}

            {/* Desktop Left Sidebar (Hideable / Toggleable) */}
            {sidebarOpen && (
              <div className="hidden md:block shrink-0">
                <Sidebar
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  recentTabs={recentTabs}
                  onOpenAbout={() => setAboutModalOpen(true)}
                  onOpenHelp={() => setAboutModalOpen(true)}
                  onOpenFeedback={() => setFeedbackModalOpen(true)}
                  onToggleSidebar={() => setSidebarOpen(false)}
                />
              </div>
            )}

            {/* Desktop Main Content Workspace */}
            <main
              data-workspace-main="true"
              className={`flex-1 min-w-0 p-3 sm:p-5 lg:p-6 pb-20 overflow-y-auto max-w-full transition-all duration-200 ${
                !sidebarOpen ? 'w-full' : ''
              }`}
            >
              {/* Global Admin Breaking Notice Ticker (Light Theme) */}
              {globalTickerEnabled && globalTickerText.trim() && (
                <div className="mb-4 px-4 py-2.5 bg-amber-50 border border-amber-300 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs text-amber-950 shadow-2xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="px-2 py-0.5 rounded-md bg-amber-700 text-white font-black text-[10px] uppercase tracking-wider shrink-0 inline-flex items-center gap-1">
                      <Megaphone className="w-3 h-3" />
                      ताज़ा सूचना
                    </span>
                    <p className="font-bold text-amber-950 leading-snug break-words">
                      {globalTickerText}
                    </p>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => {
                        setAdminInitialTab('users_approvals');
                        setActiveTab('admin_cms');
                      }}
                      className="text-[11px] font-bold text-amber-800 hover:underline shrink-0 cursor-pointer"
                    >
                      टिकर बदलें →
                    </button>
                  )}
                </div>
              )}

              {/* Admin Active Notification Strip */}
              {isAdmin && (
                <div
                  data-admin-ui="true"
                  className="mb-4 px-4 py-2.5 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs text-amber-900 shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      <strong>एडमिन लाइव मोड सक्रिय (Admin Mode Active):</strong> किसी भी कंटेंट पर क्लिक करके तुरंत Add / Edit / Update / Delete करें।
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {activeTab !== 'admin_cms' && (
                      <button
                        onClick={() => {
                          setAdminInitialTab('find_replace');
                          setActiveTab('admin_cms');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all"
                      >
                        <Replace className="w-3.5 h-3.5 text-amber-400" />
                        <span>खोजें व बदलें (Find & Replace All)</span>
                      </button>
                    )}
                    {getAdminTabForCurrentSection(activeTab) && activeTab !== 'admin_cms' && (
                      <button
                        onClick={() => {
                          const mapped = getAdminTabForCurrentSection(activeTab);
                          if (mapped) setAdminInitialTab(mapped);
                          setActiveTab('admin_cms');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all hover:scale-105"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>इस सेक्शन को CMS में संपादित / नया जोड़ें →</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setAdminInitialTab('live_overrides');
                        setActiveTab('admin_cms');
                      }}
                      className="font-bold underline text-amber-800 hover:text-amber-950 text-[11px] cursor-pointer"
                    >
                      मास्टर एडमिन स्टूडियो →
                    </button>
                  </div>
                </div>
              )}

              {/* User Email Self-Customize Strip (Strictly Self-Scope) */}
              {isLoggedIn && currentUser && !isAdmin && (
                <div className="mb-4 px-4 py-2.5 bg-gradient-to-r from-sky-50 via-white to-indigo-50/40 border border-sky-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs text-sky-950 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>
                      <strong>जोहार {currentUser.displayName} ({currentUser.email}):</strong> आपकी निजी स्व-कस्टमाइज़ेशन सेटिंग्स सक्रिय हैं (मुख्य वेबसाइट सामग्री केवल Admin द्वारा नियंत्रित है)।
                    </span>
                  </div>
                  <button
                    onClick={() => setUserAuthModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-[11px] cursor-pointer shrink-0"
                  >
                    मेरी सेटिंग्स / नोट्स खोलें →
                  </button>
                </div>
              )}

              {/* Navigation Back to Home with Real Home Icon */}
              {activeTab !== 'home' && (
                <div data-admin-ui="true" className="mb-4 flex items-center justify-between">
                  <button
                    onClick={() => setActiveTab('home')}
                    title="Return to Home Dashboard"
                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-800 hover:text-sky-700 bg-white hover:bg-sky-50/80 px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs transition-all hover:scale-102 group cursor-pointer"
                  >
                    <Home className="w-4 h-4 text-sky-600 group-hover:scale-110 transition-transform" />
                    <span>Home Dashboard</span>
                  </button>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-sky-500" />
                    <span>{activeTab} module</span>
                  </div>
                </div>
              )}

              {/* Universal Click-to-Edit & Custom Add/Edit/Delete Bar & Blocks for ALL Modules */}
              {activeTab !== 'admin_cms' && (
                <LiveOverridesGate
                  activeTab={activeTab}
                  hasMappedCMSTab={Boolean(getAdminTabForCurrentSection(activeTab))}
                  onOpenCMS={() => {
                    const mapped = getAdminTabForCurrentSection(activeTab);
                    if (mapped) setAdminInitialTab(mapped);
                    setActiveTab('admin_cms');
                  }}
                />
              )}

              {/* QR Word Card Scan Spotlight */}
              {qrWordQuery && (
                <div className="mb-4 p-4 bg-white border border-sky-200 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center shrink-0 text-sky-700">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-sky-700">
                        QR फ़्लैशकार्ड शब्द परिणाम
                      </div>
                      {qrMatchedWord ? (
                        <div className="mt-1 space-y-0.5">
                          <div className="flex flex-wrap items-baseline gap-2.5">
                            <span className="text-xl font-extrabold text-slate-900">{qrMatchedWord.wordDevanagari}</span>
                            <span className="text-lg font-bold text-amber-700">{toOlChikiAuto(qrMatchedWord.wordDevanagari)}</span>
                            <span className="text-xs font-semibold text-slate-500">({qrMatchedWord.wordRoman})</span>
                          </div>
                          <p className="text-xs text-slate-700 font-medium">
                            हिन्दी: {qrMatchedWord.meaningHindi} · English: {qrMatchedWord.meaningEnglish}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm font-bold text-slate-800 mt-1">
                          स्कैन किया गया शब्द: {qrWordQuery}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() =>
                        speakWithFemaleVoice(
                          qrMatchedWord
                            ? `${qrMatchedWord.wordDevanagari}. ${qrMatchedWord.meaningHindi}`
                            : qrWordQuery,
                          { autoDetectLanguage: true }
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>उच्चारण सुनें</span>
                    </button>
                    <button
                      onClick={dismissQrSpotlight}
                      title="बंद करें"
                      className="p-1.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Lazy Module Suspense Boundary for Instant & Smooth Loading */}
              <Suspense
                fallback={
                  <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 text-slate-600 shadow-xs min-h-[260px]">
                    <div className="w-8 h-8 border-3 border-sky-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-semibold tracking-wide">मॉड्यूल लोड हो रहा है...</span>
                  </div>
                }
              >
              {/* Tab: Home Dashboard */}
              {activeTab === 'home' && (
                <Dashboard
                  onNavigate={setActiveTab}
                  activeScript={activeScript}
                  onScriptChange={setActiveScript}
                  onOpenSearch={() => setSearchModalOpen(true)}
                  onOpenAdmin={() => setAdminModalOpen(true)}
                />
              )}

              {/* Tab: Dictionary */}
              {activeTab === 'dashboard' && (
                <DictionaryModule
                  onSelectWordForKeyboard={handleSelectWordForKeyboard}
                />
              )}

              {/* Tab: Learn Santali */}
              {activeTab === 'learn' && (
                <LearnModule />
              )}

              {/* Tab: Spoken Everyday Phrasebook */}
              {activeTab === 'phrasebook' && (
                <SantaliPhrasebook />
              )}

              {/* Tab: Vocabulary Memory Flashcards */}
              {activeTab === 'flashcards' && (
                <SantaliFlashcards />
              )}

              {/* Tab: Santali Devanagari Calligraphy & Posters */}
              {activeTab === 'calligraphy' && (
                <CalligraphyStudio />
              )}

              {/* Tab: Kudum Riddles & Wise Proverbs */}
              {activeTab === 'kudum' && (
                <KudumProverbs />
              )}

              {/* Tab: Santali Cultural Calendar & Festivals */}
              {activeTab === 'calendar' && (
                <CulturalCalendar />
              )}

              {/* Tab: Dharti ki Sristi / Sirjon Kahni */}
              {activeTab === 'creation' && (
                <SantaliCreationMyth />
              )}

              {/* Tab: Top 10 Santali Traditional Dances */}
              {activeTab === 'dances' && (
                <SantaliDancesTop10 />
              )}

              {/* Tab: Top 15 Puja-Paat & Bonga Buru */}
              {activeTab === 'bonga_buru' && (
                <SantaliBongaBuruTop15 />
              )}

              {/* Tab: Santhal Hul 1855 & Freedom Fighters */}
              {activeTab === 'hul_heroes' && (
                <SanthalHulHeroes />
              )}

              {/* Tab: Santali Marriage Traditions & 8 Bapla */}
              {activeTab === 'marriage_bapla' && (
                <SantaliMarriageBapla />
              )}

              {/* Tab: Traditional Attire & Ornaments */}
              {activeTab === 'attire_ornaments' && (
                <SantaliAttireOrnaments />
              )}

              {/* Tab: Authentic Cuisine & Recipes */}
              {activeTab === 'cuisine' && (
                <SantaliCuisineRecipes />
              )}

              {/* Tab: Traditional Sports & Sendra */}
              {activeTab === 'sports_sendra' && (
                <SantaliTraditionalSports />
              )}

              {/* Tab: Folk Songs & Seren Archive */}
              {activeTab === 'folk_songs' && (
                <SantaliFolkSongsArchive />
              )}

              {/* Tab: Sacred Heritage & Pilgrimage Sites */}
              {activeTab === 'pilgrimage' && (
                <SantaliPilgrimageSites />
              )}

              {/* Tab: Sacred Life Rites */}
              {activeTab === 'life_rites' && (
                <SantaliLifeRites />
              )}

              {/* Tab: Sohrai & Khovar Mural Art Studio */}
              {activeTab === 'sohrai_art' && (
                <SohraiMuralArt />
              )}

              {/* Tab: Santali Proverbs & Metaphors (Bhenta Katha) */}
              {activeTab === 'proverbs_bhenta' && (
                <SantaliProverbsBhenta />
              )}

              {/* Tab: Traditional Indigenous Agriculture & Seasons */}
              {activeTab === 'agri_seasons' && (
                <SantaliAgriSeasons />
              )}

              {/* Tab: Traditional Barter & Measurement Units */}
              {activeTab === 'traditional_measures' && (
                <SantaliTraditionalMeasures />
              )}

              {/* Tab: Traditional Eco-Architecture & Orak Layout */}
              {activeTab === 'architecture' && (
                <SantaliArchitecture />
              )}

              {/* Tab: Historical Migrations & 12 Ancient Garhs */}
              {activeTab === 'historical_garhs' && (
                <SantaliHistoricalGarhs />
              )}

              {/* Tab: Chadar Badani Traditional Puppetry & Akhra Theater */}
              {activeTab === 'puppetry_theater' && (
                <SantaliPuppetryTheater />
              )}

              {/* Tab: Santali Astronomy & Sky Lore (Ipil ar Bonga Dahar) */}
              {activeTab === 'astronomy_lore' && (
                <SantaliAstronomySkyLore />
              )}

              {/* Tab: Sendra & Lobir Baisi Forest Ethics & High Court */}
              {activeTab === 'sendra_lobir' && (
                <SantaliSendraLobir />
              )}

              {/* Tab: Dhokra Bell-Metal Casting & Kamar Heritage */}
              {activeTab === 'dhokra_art' && (
                <SantaliDhokraArt />
              )}

              {/* Tab: Water Harvesting, Dadi & Slope Farming */}
              {activeTab === 'water_harvesting' && (
                <SantaliWaterHarvesting />
              )}

              {/* Tab: Handloom Weaving & Natural Vegetable Dyeing */}
              {activeTab === 'handloom_weaving' && (
                <SantaliHandloomWeaving />
              )}

              {/* Tab: Cattle Lore, Khuntau Tradition & Ethno-Veterinary */}
              {activeTab === 'livestock_khuntau' && (
                <SantaliLivestockKhuntau />
              )}

              {/* Tab: Woodcraft, Dhenki, Nahel & Sacred Carvings */}
              {activeTab === 'woodcraft_carpentry' && (
                <SantaliWoodcraftCarpentry />
              )}

              {/* Tab: Bamboo Craft, Winnowing Fan & River Traps */}
              {activeTab === 'bamboo_craft' && (
                <SantaliBambooCraft />
              )}

              {/* Tab: 4 Checked Glottal Consonants Studio & Phonetics Lab */}
              {activeTab === 'phonetics_lab' && (
                <SantaliPhoneticsLab />
              )}

              {/* Tab: Traditional Santali Baby Names Directory */}
              {activeTab === 'baby_names' && (
                <SantaliBabyNamesDirectory />
              )}

              {/* Tab: Traditional Silver & Bronze Ornaments */}
              {activeTab === 'ornaments_jewellery' && (
                <SantaliOrnamentsJewellery />
              )}

              {/* Tab: Traditional Blacksmithy & Indigenous Iron Craft */}
              {activeTab === 'blacksmithy_iron' && (
                <SantaliBlacksmithyIronCraft />
              )}

              {/* Tab: 6 Seasons & Weather Lore */}
              {activeTab === 'seasons_weather' && (
                <SantaliSeasonsWeatherLore />
              )}

              {/* Tab: Deep Idioms & Menkatha Sayings */}
              {activeTab === 'idioms_menkatha' && (
                <SantaliIdiomsMenkatha />
              )}

              {/* Tab: Native Herbal Drinks & Sacred Tonics */}
              {activeTab === 'herbal_drinks' && (
                <SantaliTraditionalHerbalDrinks />
              )}

              {/* Tab: Traditional Archery & Word Target Game Simulator */}
              {activeTab === 'archery_simulator' && (
                <SantaliArcheryGameSimulator />
              )}

              {/* Tab: Traditional Cuisine Recipes */}
              {activeTab === 'traditional_cuisine' && (
                <SantaliTraditionalCuisine />
              )}

              {/* Tab: 7 Marriages & 3 Life Samskaras */}
              {activeTab === 'marriage_rituals' && (
                <SantaliMarriageLifeRituals />
              )}

              {/* Tab: Kudum Riddles Game */}
              {activeTab === 'riddles_kudum' && (
                <SantaliRiddlesKudumGame />
              )}

              {/* Tab: Sacred Pilgrimages & Historical Garhs */}
              {activeTab === 'sacred_pilgrimages' && (
                <SantaliSacredPilgrimages />
              )}

              {/* Tab: Spoken Dialogues & Situational Conversations */}
              {activeTab === 'spoken_dialogues' && (
                <SantaliSpokenDialogues />
              )}

              {/* Tab: Formal Letter & Bapla Invitation Templates */}
              {activeTab === 'letter_templates' && (
                <SantaliFormalLetterTemplates />
              )}

              {/* Tab: Illustrated Folk Tales Reader */}
              {activeTab === 'illustrated_stories' && (
                <SantaliIllustratedFolkTales />
              )}

              {/* Tab: Favorites Notebook */}
              {activeTab === 'favorites_notebook' && (
                <SantaliFavoritesNotebook />
              )}

              {/* Tab: Proficiency Exam & Certificate */}
              {activeTab === 'certification' && (
                <SantaliProficiencyCertificate />
              )}

              {/* Tab: Social Card & Poster Studio */}
              {activeTab === 'social_cards' && (
                <SantaliSocialCardStudio />
              )}

              {/* Tab: Lunar Calendar Clock & Festival Countdown */}
              {activeTab === 'lunar_calendar' && (
                <SantaliLunarCalendarClock />
              )}

              {/* Tab: Majhi Pargana Self-Governance */}
              {activeTab === 'governance' && (
                <MajhiParganaSystem />
              )}

              {/* Tab: Santali Grammar & Sentence Builder */}
              {activeTab === 'grammar' && (
                <SantaliGrammarBuilder />
              )}

              {/* Tab: Festive E-Cards & WhatsApp Greetings */}
              {(activeTab === 'greetings' || activeTab === 'festival_cards') && (
                <SantaliGreetingMaker />
              )}

              {/* Tab: Santali Folk Song Karaoke & Rhythm Studio */}
              {activeTab === 'sereng_karaoke' && (
                <SantaliSerengKaraoke />
              )}

              {/* Tab: Virtual Village Tour & Sacred Geography */}
              {activeTab === 'village_tour' && (
                <SantaliVillageTour />
              )}

              {/* Tab: Wild Foods, Leafy Greens & Indigenous Nutrition */}
              {activeTab === 'wild_foods' && (
                <SantaliWildFoodsNutrition />
              )}

              {/* Tab: Santali Folk Radio & Ambient Story Studio */}
              {activeTab === 'folk_radio' && (
                <SantaliFolkRadio />
              )}

              {/* Tab: Santali Ethno-Medicine & Emergency First Aid */}
              {activeTab === 'ethno_medicine' && (
                <SantaliEthnoMedicine />
              )}

              {/* Tab: Multi-Script Converter (Ol Chiki, Devanagari, Roman) */}
              {activeTab === 'script_converter' && (
                <SantaliMultiScriptConverter />
              )}

              {/* Tab: Kids Interactive Soundboard & Sound Quiz */}
              {activeTab === 'kids_soundboard' && (
                <SantaliKidsSoundboard />
              )}

              {/* Tab: 9:16 Mobile Wallpaper & Status Studio */}
              {activeTab === 'wallpaper_studio' && (
                <SantaliWallpaperStudio />
              )}

              {/* Tab: Clan & Family Heritage Archive */}
              {activeTab === 'clan_genealogy' && (
                <SantaliClanGenealogy />
              )}

              {/* Tab: Village Haat & Barter Simulator */}
              {activeTab === 'haat_barter' && (
                <SantaliHaatBarterSimulator />
              )}

              {/* Tab: Wedding Chants & Bapla Rituals Studio */}
              {activeTab === 'bapla_chants' && (
                <SantaliBaplaChantsStudio />
              )}

              {/* Tab: Bird Lore & Ethno-Ornithology */}
              {activeTab === 'bird_lore' && (
                <SantaliBirdLoreEthnoOrnithology />
              )}

              {/* Tab: Traditional Body Art, Sika & Godna */}
              {activeTab === 'godna_body_art' && (
                <SantaliGodnaBodyArt />
              )}

              {/* Tab: Indigenous Heirloom Seeds & Bandhi */}
              {activeTab === 'heirloom_seeds' && (
                <SantaliIndigenousSeedsHeirloom />
              )}

              {/* Tab: Kinship Greetings & Sacred Etiquette */}
              {activeTab === 'kinship_etiquette' && (
                <SantaliGreetingsEtiquetteSimulator />
              )}

              {/* Tab: Instruments Orchestra Sequencer */}
              {activeTab === 'instruments_orchestra' && (
                <SantaliInstrumentsOrchestra />
              )}

              {/* Tab: Indigenous Bone Setting & Herbal Trauma */}
              {activeTab === 'bone_setting_healing' && (
                <SantaliBoneSettingHealing />
              )}

              {/* Tab: Lo Bir Baisi Supreme Court */}
              {activeTab === 'lo_bir_court' && (
                <SantaliLoBirCourtSimulator />
              )}

              {/* Tab: Ol Chiki Penmanship & Calligraphy Workbook */}
              {activeTab === 'calligraphy_workbook' && (
                <SantaliOlChikiPenmanshipWorkbook />
              )}

              {/* Tab: Handi Fermentation Science & Sacred Lore */}
              {activeTab === 'handi_fermentation_lore' && (
                <SantaliHandiFermentationLore />
              )}

              {/* Tab: Ipil Constellations & Sky Lore */}
              {activeTab === 'ipil_astronomy' && (
                <SantaliIpilConstellationsAstronomy />
              )}

              {/* Tab: Nahel, Dhenki & Woodcraft Architecture */}
              {activeTab === 'nahel_dhenki_craft' && (
                <SantaliNahelDhenkiCraft />
              )}

              {/* Tab: Indigenous Sports & Kati Enech */}
              {activeTab === 'indigenous_sports_kati' && (
                <SantaliIndigenousSportsKati />
              )}

              {/* Tab: Traditional Fishing Traps & Craft */}
              {activeTab === 'traditional_fishing_craft' && (
                <SantaliTraditionalFishingCraft />
              )}

              {/* Tab: Natural Pigments & Earth Alchemy */}
              {activeTab === 'natural_pigments_craft' && (
                <SantaliNaturalPigmentsCraft />
              )}

              {/* Tab: Banam & Tamak Luthier Craft */}
              {activeTab === 'banam_tamak_luthier' && (
                <SantaliBanamTamakLuthier />
              )}

              {/* Tab: Jaher Sacred Grove Ecology */}
              {activeTab === 'jaher_sacred_grove_ecology' && (
                <SantaliJaherGroveEcology />
              )}

              {/* Tab: Customary Oaths & Restorative Justice */}
              {activeTab === 'customary_oaths_justice' && (
                <SantaliCustomaryOathsJustice />
              )}

              {/* Tab: Sasandiri & Megalithic Memorials */}
              {activeTab === 'sasandiri_megalithic_lore' && (
                <SantaliSasandiriMegalithicLore />
              )}

              {/* Tab: Indigenous Mathematics & Chala Geometry */}
              {activeTab === 'indigenous_math_geometry' && (
                <SantaliIndigenousMathGeometry />
              )}

              {/* Tab: Wild Honey Harvesting Lore */}
              {activeTab === 'wild_honey_harvesting' && (
                <SantaliWildHoneyHarvesting />
              )}

              {/* Tab: Animal Behavior & Bioacoustics */}
              {activeTab === 'animal_behavior_omens' && (
                <SantaliAnimalBehaviorOmens />
              )}

              {/* Tab: Textile Dyes & Block Print Studio */}
              {activeTab === 'indigenous_textile_dyes' && (
                <SantaliTextileDyesBlockPrint />
              )}

              {/* Tab: Indigenous Midwifery & Infant Care */}
              {activeTab === 'indigenous_midwifery_care' && (
                <SantaliMidwiferyCareLore />
              )}

              {/* Tab: Universal Text & Document Reader */}
              {activeTab === 'universal_text_reader' && (
                <SantaliUniversalTextReader />
              )}

              {/* Tab: Karam Binti Sacred Oral Epic */}
              {activeTab === 'karam_binti_epic_reader' && (
                <SantaliKaramBintiEpic />
              )}

              {/* Tab: Epigraphy, Garh Inscriptions & Numismatics */}
              {activeTab === 'epigraphy_numismatics_lore' && (
                <SantaliEpigraphyNumismatics />
              )}

              {/* Tab: Illustrated Comics Reader */}
              {activeTab === 'illustrated_comics_reader' && (
                <SantaliIllustratedComicsReader />
              )}

              {/* Tab: Verb & Tense Conjugator Lab */}
              {activeTab === 'santali_verb_conjugator' && (
                <SantaliVerbConjugator />
              )}

              {/* Tab: Classical Literature & Pera Hor */}
              {activeTab === 'pera_hor_literature' && (
                <SantaliLiteraryArchives />
              )}

              {/* Tab: Sagar Bullock Cart Engineering */}
              {activeTab === 'sagar_bullock_cart' && (
                <SantaliBullockCartCraft />
              )}

              {/* Tab: Terracotta Pottery & Kiln Lore */}
              {activeTab === 'terracotta_pottery_lore' && (
                <SantaliTerracottaPottery />
              )}

              {/* Tab: Babui Rope, Patia Mat & Ghonghu Cloak */}
              {activeTab === 'babui_rope_mat_craft' && (
                <SantaliFiberMatCraft />
              )}

              {/* Tab: Livestock Care & Ethno-Veterinary */}
              {activeTab === 'livestock_ethno_vet' && (
                <SantaliLivestockEthnoVet />
              )}

              {/* Tab: Santali Muhurat & Almanac Checker */}
              {activeTab === 'muhurat_almanac_checker' && (
                <SantaliMuhuratAlmanac />
              )}

              {/* Tab: SPT Act, PESA & Gram Sabha Rights */}
              {activeTab === 'spt_pesa_rights_guide' && (
                <SantaliSptPesaRights />
              )}

              {/* Tab: Regional Dialect Switcher */}
              {activeTab === 'santali_dialects_comparative' && (
                <SantaliRegionalDialects />
              )}

              {/* Tab: Anchoring & Public Speaking Kit */}
              {activeTab === 'santali_anchoring_speeches' && (
                <SantaliAnchoringSpeechKit />
              )}

              {/* Tab: Tasar Silk Sericulture */}
              {activeTab === 'tasar_silk_sericulture' && (
                <SantaliTasarSericulture />
              )}

              {/* Tab: Traditional Oil Press Kolhu */}
              {activeTab === 'mahua_oil_press_kolhu' && (
                <SantaliOilPressKolhu />
              )}

              {/* Tab: Hendwa & Sun-Dried Preservation */}
              {activeTab === 'sun_dried_forest_preservation' && (
                <SantaliFoodPreservationLore />
              )}

              {/* Tab: Donga Boat & River Lore */}
              {activeTab === 'donga_boat_river_lore' && (
                <SantaliDongaBoatLore />
              )}

              {/* Tab: Aher-Pyne Water Governance */}
              {activeTab === 'aher_pyne_water_governance' && (
                <SantaliAherPyneWater />
              )}

              {/* Tab: Forest Firebreak Ecology */}
              {activeTab === 'bir_sengel_fire_ecology' && (
                <SantaliForestFireEcology />
              )}

              {/* Tab: Typing Speed Test */}
              {activeTab === 'santali_typing_speed' && (
                <SantaliTypingSpeedTest />
              )}

              {/* Tab: Santali Pahada Tables */}
              {activeTab === 'santali_pahada_tables' && (
                <SantaliPahadaTables />
              )}

              {/* Tab: Learning Streak Tracker */}
              {activeTab === 'learning_streak_tracker' && (
                <SantaliStreakTracker />
              )}

              {/* Tab: Word Pinboard Notes */}
              {activeTab === 'word_pinboard_notes' && (
                <SantaliWordPinboard />
              )}

              {activeTab === 'santali_exam_prep_jpsc' && (
                <SantaliExamPrepHub />
              )}

              {activeTab === 'santali_dictation_lab' && (
                <SantaliDictationLab />
              )}

              {activeTab === 'santali_word_match_game' && (
                <SantaliWordMatchGame />
              )}

              {activeTab === 'santali_medical_translator' && (
                <SantaliMedicalTranslator />
              )}

              {activeTab === 'gram_sabha_form_drafter' && (
                <SantaliGramSabhaDrafter />
              )}

              {activeTab === 'santali_news_bulletin_studio' && (
                <SantaliNewsTeleprompter />
              )}

              {activeTab === 'data_backup_manager' && (
                <SantaliDataBackupManager />
              )}

              {activeTab === 'santali_tala_metronome' && (
                <SantaliTalaMetronome />
              )}

              {activeTab === 'santali_instrument_tuner' && (
                <SantaliInstrumentTuner />
              )}

              {activeTab === 'santali_land_topography' && (
                <SantaliLandTopography />
              )}

              {activeTab === 'santali_micro_journal' && (
                <SantaliMicroJournal />
              )}

              {activeTab === 'santali_wit_riddles_arena' && (
                <SantaliWitRiddlesArena />
              )}

              {activeTab === 'dance_akhda_formations' && (
                <SantaliDanceAkhdaGuide />
              )}

              {activeTab === 'santali_grammar_checker' && (
                <SantaliGrammarChecker />
              )}

              {activeTab === 'santali_crossword_puzzle' && (
                <SantaliCrosswordGame />
              )}

              {activeTab === 'wildlife_flora_quiz' && (
                <SantaliWildlifeFloraQuiz />
              )}

              {activeTab === 'invitation_certificate_maker' && (
                <SantaliInvitationCertificateStudio />
              )}

              {activeTab === 'sentence_scramble_builder' && (
                <SantaliSentenceScramble />
              )}

              {activeTab === 'poetry_sereng_studio' && (
                <SantaliPoetryRhymeStudio />
              )}

              {activeTab === 'pocket_study_booklet' && (
                <SantaliPocketBookletMaker />
              )}

              {activeTab === 'clan_kinship_checker' && (
                <SantaliClanKinshipChecker />
              )}

              {activeTab === 'civic_bank_dialogue_kit' && (
                <SantaliCivicBankDialogue />
              )}

              {activeTab === 'haat_festival_planner' && (
                <SantaliHaatFestivalPlanner />
              )}

              {activeTab === 'santali_word_search_puzzle' && (
                <SantaliWordSearchGame />
              )}

              {activeTab === 'audio_memory_flip_game' && (
                <SantaliAudioMemoryGame />
              )}

              {activeTab === 'village_layout_landmark_map' && (
                <SantaliVillageLayoutMap />
              )}

              {activeTab === 'daily_current_affairs' && (
                <DailyCurrentAffairs2026 />
              )}

              {activeTab === 'native_voice_recorder' && (
                <SantaliNativeVoiceRecorder />
              )}

              {activeTab === 'two_player_battle' && (
                <SantaliTwoPlayerQuizBattle />
              )}

              {activeTab === 'smart_srs_coach' && (
                <SantaliSmartRevisionCoach />
              )}

              {activeTab === 'document_book_reader' && (
                <SantaliDocumentBookReader />
              )}

              {activeTab === 'community_voice_events' && (
                <SantaliCommunityBoard onOpenUserAuth={() => setUserAuthModalOpen(true)} />
              )}

              {activeTab === 'santhal_belt_atlas' && (
                <SantaliBeltAtlas />
              )}

              {activeTab === 'roleplay_conversation' && (
                <SantaliRoleplaySimulator />
              )}

              {activeTab === 'family_tree_builder' && (
                <SantaliFamilyTreeBuilder />
              )}

              {activeTab === 'teacher_worksheet_maker' && (
                <SantaliTeacherWorksheetMaker />
              )}

              {activeTab === 'chhatiar_name_studio' && (
                <SantaliChhatiarNameStudio />
              )}

              {activeTab === 'audio_playlist_player' && (
                <SantaliAudioPlaylistPlayer />
              )}

              {activeTab === 'community_hall_of_fame' && (
                <SantaliCommunityHallOfFame />
              )}

              {activeTab === 'offline_pack_manager' && (
                <SantaliOfflinePackManager />
              )}

              {activeTab === 'smart_essay_writer' && (
                <SantaliSmartWriter />
              )}

              {activeTab === 'emergency_voice_cards' && (
                <SantaliEmergencyVoiceCards />
              )}

              {activeTab === 'weekly_bulletin_maker' && (
                <SantaliWeeklyBulletinMaker />
              )}

              {activeTab === 'kids_storybook_maker' && (
                <SantaliKidsStorybookMaker />
              )}

              {activeTab === 'tense_suffix_drill' && (
                <SantaliTenseSuffixDrill />
              )}

              {activeTab === 'krishi_crop_ledger' && (
                <SantaliKrishiCropLedger />
              )}

              {activeTab === 'qr_word_cards' && (
                <SantaliQrWordCards />
              )}

              {activeTab === 'santali_pronoun_case_lab' && (
                <SantaliPronounCaseLab />
              )}

              {activeTab === 'santali_bazaar_price_calc' && (
                <SantaliBazaarPriceCalc />
              )}

              {activeTab === 'santali_school_prayer_assembly' && (
                <SantaliSchoolPrayerAssembly />
              )}

              {activeTab === 'santali_panchayat_scheme_guide' && (
                <SantaliPanchayatSchemeGuide />
              )}

              {activeTab === 'santali_bus_rail_helpline' && (
                <SantaliBusRailHelpline />
              )}

              {activeTab === 'santali_audio_listening_test' && (
                <SantaliAudioListeningTest />
              )}

              {activeTab === 'santali_song_lyric_builder' && (
                <SantaliSongLyricBuilder />
              )}

              {activeTab === 'santali_jora_katha_lab' && (
                <SantaliJoraKathaLab />
              )}

              {activeTab === 'santali_question_negation_lab' && (
                <SantaliQuestionNegationLab />
              )}

              {activeTab === 'santali_spell_fix_lab' && (
                <SantaliSpellFixLab />
              )}

              {activeTab === 'santali_shg_savings_ledger' && (
                <SantaliShgSavingsLedger />
              )}

              {activeTab === 'santali_maternal_child_health' && (
                <SantaliMaternalChildHealth />
              )}

              {activeTab === 'santali_report_card_maker' && (
                <SantaliReportCardMaker />
              )}

              {activeTab === 'santali_literary_pioneers' && (
                <SantaliLiteraryPioneers />
              )}

              {/* Tab: Traditional Herbal Medicine & Ethnobotany */}
              {activeTab === 'herbal' && (
                <SantaliHerbalRemedies />
              )}

              {/* Tab: Santali Wordle Game */}
              {activeTab === 'wordle' && (
                <SantaliWordleGame />
              )}

              {/* Tab: Folk Stories & History Audio */}
              {activeTab === 'stories' && (
                <FolkStoriesPlayer />
              )}

              {/* Tab: Pronunciation Speech Coach */}
              {activeTab === 'speech_coach' && (
                <PronunciationCoach />
              )}

              {/* Tab: Universal Voice Speaker & Reader */}
              {activeTab === 'speaker' && (
                <TextSpeakerReader />
              )}

              {/* Tab: Traditional Instruments & Rhythm Pad */}
              {activeTab === 'instruments' && (
                <SantaliInstrumentsPad />
              )}

              {/* Tab: Kinship & Family Tree */}
              {activeTab === 'family_tree' && (
                <SantaliFamilyTree />
              )}

              {/* Tab: Kids Rhymes & Jukebox */}
              {activeTab === 'kids_rhymes' && (
                <SantaliKidsJukebox />
              )}

              {/* Tab: Speaking Clock & Numbers */}
              {activeTab === 'clock_numbers' && (
                <SantaliClockNumbers />
              )}

              {/* Tab: 12 Sacred Clans & Totems */}
              {activeTab === 'clans' && (
                <SantaliClansDirectory />
              )}

              {/* Tab: Sacred Flora & Printable Worksheets */}
              {activeTab === 'flora_worksheets' && (
                <AdivasiFloraWorksheet />
              )}

              {/* Tab: Admin Master CMS & Content Editor */}
              {activeTab === 'admin_cms' && (
                <AdminMasterStudio onClose={() => setActiveTab('home')} initialTab={adminInitialTab} />
              )}

              {/* Tab: Translator */}
              {activeTab === 'translator' && (
                <TranslatorModule
                  initialText={translatorInitialText}
                />
              )}

              {/* Tab: Daily Santali Vocabulary Quiz */}
              {activeTab === 'daily_quiz' && (
                <DailyVocabQuiz
                  onNavigateHome={() => setActiveTab('home')}
                  onExploreInDictionary={() => setActiveTab('dashboard')}
                />
              )}

              {/* Tab: Settings */}
              {activeTab === 'settings' && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs max-w-2xl space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Settings className="w-5 h-5 text-sky-600" />
                      <span>Hor Katha Suite Preferences</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Configure default script rendering, audio phonetics engine, and admin credentials.
                    </p>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <label className="font-bold text-slate-800 block">Default Input Script</label>
                      <select
                        value={activeScript}
                        onChange={(e) => setActiveScript(e.target.value as ScriptType)}
                        className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 w-full max-w-xs"
                      >
                        <option value="santali">Santali (Roman Santal)</option>
                        <option value="devanagari">Hindi / Santali (देवनागरी)</option>
                        <option value="english">English (Latin)</option>
                      </select>
                    </div>

                    {/* Top 10 Male & Female Voice Model Selector */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <span className="font-bold text-slate-800 block flex items-center gap-1.5">
                            <Volume2 className="w-4 h-4 text-sky-600" />
                            <span>शीर्ष १० आवाज़ मॉडल (Top 10 Voice Models — 5 Female + 5 Male)</span>
                          </span>
                          <span className="text-slate-500 text-[11px]">
                            पूरे ऐप के स्पीकर, सेक्शन रीडर और परीक्षा उच्चारण के लिए पसंदीदा आवाज़ चुनें
                          </span>
                        </div>
                        <button
                          onClick={() => speakWithFemaleVoice('जोहार! संताली भाषा और संस्कृति मंच होड़ काथा में आपका स्वागत है।', { autoDetectLanguage: true })}
                          className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-[11px] font-bold shrink-0"
                        >
                          आवाज़ जांचें
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {TOP_10_VOICE_MODELS.map((model) => {
                          const selected = activeVoiceId === model.id;
                          return (
                            <button
                              key={model.id}
                              onClick={() => {
                                setActiveVoiceProfile(model.id);
                                setActiveVoiceId(model.id);
                                speakWithFemaleVoice(`${model.name}. जोहार!`, { autoDetectLanguage: true });
                              }}
                              className={`text-left p-2.5 rounded-xl border transition ${
                                selected
                                  ? 'bg-sky-50 border-sky-500 ring-1 ring-sky-300'
                                  : 'bg-white border-slate-200 hover:border-sky-300'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-bold text-slate-900 text-xs">{model.labelHi}</span>
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                    model.gender === 'female'
                                      ? 'bg-pink-100 text-pink-800'
                                      : 'bg-indigo-100 text-indigo-800'
                                  }`}
                                >
                                  {model.gender === 'female' ? 'Female' : 'Male'}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500 mt-0.5">{model.role}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-800 block">Admin Control Panel</span>
                        <span className="text-slate-500 text-[11px]">
                          {isAdmin ? 'Currently authenticated as Administrator' : 'Access Add/Edit/Delete permissions'}
                        </span>
                      </div>
                      <button
                        onClick={() => setAdminModalOpen(true)}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg text-xs"
                      >
                        {isAdmin ? 'Manage Admin' : 'Admin Login'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              </Suspense>
            </main>
          </div>
        )}

        {/* MODE 2: Mobile App Simulator */}
        {viewMode === 'mobile_simulator' && (
          <main data-workspace-main="true" className="flex-1 w-full p-3 sm:p-5 lg:p-6">
            <LiveOverridesGate
              activeTab="mobile_simulator"
              hasMappedCMSTab={true}
              onOpenCMS={() => {
                setAdminInitialTab('live_overrides');
                setActiveTab('admin_cms');
                setViewMode('desktop');
              }}
            />
            <Suspense fallback={<div className="p-8 text-center text-xs font-semibold text-slate-500">मोबाइल सिमुलेटर लोड हो रहा है...</div>}>
              <MobileSimulator />
            </Suspense>
          </main>
        )}

        {/* MODE 3: Full Presentation Sheet */}
        {viewMode === 'presentation' && (
          <main data-workspace-main="true" className="flex-1 w-full p-3 sm:p-5 lg:p-6 overflow-y-auto">
            <LiveOverridesGate
              activeTab="presentation"
              hasMappedCMSTab={true}
              onOpenCMS={() => {
                setAdminInitialTab('live_overrides');
                setActiveTab('admin_cms');
                setViewMode('desktop');
              }}
            />
            <Suspense fallback={<div className="p-8 text-center text-xs font-semibold text-slate-500">प्रस्तुति दृश्य लोड हो रहा है...</div>}>
              <PresentationView
                onSelectDesktopModule={(tab) => {
                  setActiveTab(tab);
                  setViewMode('desktop');
                }}
                onSelectMobileScreen={(screen) => {
                  setViewMode('mobile_simulator');
                }}
              />
            </Suspense>
          </main>
        )}
      </div>

      {/* Modern Best-in-Class Footer with Exact Extracted Text & Compliance */}
      <Footer
        onOpenAbout={() => setAboutModalOpen(true)}
        onOpenFeedback={() => setFeedbackModalOpen(true)}
        onNavigateTab={(tab) => {
          setActiveTab(tab as any);
          if (viewMode !== 'desktop') setViewMode('desktop');
        }}
        onViewModeChange={(mode) => {
          setViewMode(mode);
        }}
      />

      {/* About BOSC Tech & Edu Modal (conditionally mounted for fast startup) */}
      {aboutModalOpen && (
        <Suspense fallback={null}>
          <AboutModal
            isOpen={aboutModalOpen}
            onClose={() => setAboutModalOpen(false)}
          />
        </Suspense>
      )}

      {/* Admin Login & Full Control Modal */}
      {adminModalOpen && (
        <Suspense fallback={null}>
          <AdminLoginModal
            isOpen={adminModalOpen}
            onClose={() => setAdminModalOpen(false)}
            onOpenCMS={(tab) => {
              if (tab) setAdminInitialTab(tab as AdminTab);
              setActiveTab('admin_cms');
              if (viewMode !== 'desktop') setViewMode('desktop');
            }}
            onOpenUserAuth={() => setUserAuthModalOpen(true)}
          />
        </Suspense>
      )}

      {/* User Email Login & Self-Customization Modal (Strictly User Scope Only) */}
      {userAuthModalOpen && (
        <Suspense fallback={null}>
          <UserAuthModal
            isOpen={userAuthModalOpen}
            onClose={() => setUserAuthModalOpen(false)}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              if (viewMode !== 'desktop') setViewMode('desktop');
            }}
          />
        </Suspense>
      )}

      {/* Community Feedback Modal with Warm Welcome Message */}
      {feedbackModalOpen && (
        <Suspense fallback={null}>
          <FeedbackModal
            isOpen={feedbackModalOpen}
            onClose={() => setFeedbackModalOpen(false)}
          />
        </Suspense>
      )}

      {/* Global Spotlight Search Modal with Ctrl+K shortcut & keyword highlighting */}
      {searchModalOpen && (
        <Suspense fallback={null}>
          <GlobalSearchModal
            isOpen={searchModalOpen}
            onClose={() => setSearchModalOpen(false)}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              if (viewMode !== 'desktop') setViewMode('desktop');
            }}
            onSendToTranslator={handleSendToTranslator}
            onOpenAdmin={() => setAdminModalOpen(true)}
          />
        </Suspense>
      )}

      {/* Global Live Text Reader Bar & Automatic Word-Label Enhancer */}
      <GlobalTextReaderBar activeTab={activeTab} />
    </div>
  );
}

export default function App() {
  return (
    <AdminProvider>
      <UserAuthProvider>
        <AppContent />
      </UserAuthProvider>
    </AdminProvider>
  );
}
