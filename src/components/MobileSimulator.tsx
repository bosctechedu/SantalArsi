import React, { useState, lazy, Suspense } from 'react';
import { MobileScreen, ScriptType } from '../types';
import { CulturalTree } from './CulturalTree';
import { SANTALI_KEYBOARD_URL, openExternalSantaliKeyboard } from '../utils/externalLinks';
const DictionaryModule = lazy(() => import('./DictionaryModule').then(m => ({ default: m.DictionaryModule })));
const LearnModule = lazy(() => import('./LearnModule').then(m => ({ default: m.LearnModule })));
const TranslatorModule = lazy(() => import('./TranslatorModule').then(m => ({ default: m.TranslatorModule })));
const DailyVocabQuiz = lazy(() => import('./DailyVocabQuiz').then(m => ({ default: m.DailyVocabQuiz })));
const SantaliPhrasebook = lazy(() => import('./SantaliPhrasebook').then(m => ({ default: m.SantaliPhrasebook })));
const SantaliFlashcards = lazy(() => import('./SantaliFlashcards').then(m => ({ default: m.SantaliFlashcards })));
const CalligraphyStudio = lazy(() => import('./CalligraphyStudio').then(m => ({ default: m.CalligraphyStudio })));
const KudumProverbs = lazy(() => import('./KudumProverbs').then(m => ({ default: m.KudumProverbs })));
const CulturalCalendar = lazy(() => import('./CulturalCalendar').then(m => ({ default: m.CulturalCalendar })));
const SantaliWordleGame = lazy(() => import('./SantaliWordleGame').then(m => ({ default: m.SantaliWordleGame })));
const FolkStoriesPlayer = lazy(() => import('./FolkStoriesPlayer').then(m => ({ default: m.FolkStoriesPlayer })));
const PronunciationCoach = lazy(() => import('./PronunciationCoach').then(m => ({ default: m.PronunciationCoach })));
const TextSpeakerReader = lazy(() => import('./TextSpeakerReader').then(m => ({ default: m.TextSpeakerReader })));
const SantaliInstrumentsPad = lazy(() => import('./SantaliInstrumentsPad').then(m => ({ default: m.SantaliInstrumentsPad })));
const SantaliFamilyTree = lazy(() => import('./SantaliFamilyTree').then(m => ({ default: m.SantaliFamilyTree })));
const SantaliKidsJukebox = lazy(() => import('./SantaliKidsJukebox').then(m => ({ default: m.SantaliKidsJukebox })));
const SantaliClockNumbers = lazy(() => import('./SantaliClockNumbers').then(m => ({ default: m.SantaliClockNumbers })));
const SantaliClansDirectory = lazy(() => import('./SantaliClansDirectory').then(m => ({ default: m.SantaliClansDirectory })));
const AdivasiFloraWorksheet = lazy(() => import('./AdivasiFloraWorksheet').then(m => ({ default: m.AdivasiFloraWorksheet })));
const MajhiParganaSystem = lazy(() => import('./MajhiParganaSystem').then(m => ({ default: m.MajhiParganaSystem })));
const SantaliGrammarBuilder = lazy(() => import('./SantaliGrammarBuilder').then(m => ({ default: m.SantaliGrammarBuilder })));
const SantaliGreetingMaker = lazy(() => import('./SantaliGreetingMaker').then(m => ({ default: m.SantaliGreetingMaker })));
const SantaliHerbalRemedies = lazy(() => import('./SantaliHerbalRemedies').then(m => ({ default: m.SantaliHerbalRemedies })));
const SantaliCreationMyth = lazy(() => import('./SantaliCreationMyth').then(m => ({ default: m.SantaliCreationMyth })));
const SantaliDancesTop10 = lazy(() => import('./SantaliDancesTop10').then(m => ({ default: m.SantaliDancesTop10 })));
const SantaliBongaBuruTop15 = lazy(() => import('./SantaliBongaBuruTop15').then(m => ({ default: m.SantaliBongaBuruTop15 })));
const SantaliAttireOrnaments = lazy(() => import('./SantaliAttireOrnaments').then(m => ({ default: m.SantaliAttireOrnaments })));
const SantaliMarriageBapla = lazy(() => import('./SantaliMarriageBapla').then(m => ({ default: m.SantaliMarriageBapla })));
const SanthalHulHeroes = lazy(() => import('./SanthalHulHeroes').then(m => ({ default: m.SanthalHulHeroes })));
const SantaliCuisineRecipes = lazy(() => import('./SantaliCuisineRecipes').then(m => ({ default: m.SantaliCuisineRecipes })));
const SantaliTraditionalSports = lazy(() => import('./SantaliTraditionalSports').then(m => ({ default: m.SantaliTraditionalSports })));
const SantaliFolkSongsArchive = lazy(() => import('./SantaliFolkSongsArchive').then(m => ({ default: m.SantaliFolkSongsArchive })));
const SantaliPilgrimageSites = lazy(() => import('./SantaliPilgrimageSites').then(m => ({ default: m.SantaliPilgrimageSites })));
const SantaliLifeRites = lazy(() => import('./SantaliLifeRites').then(m => ({ default: m.SantaliLifeRites })));
const SohraiMuralArt = lazy(() => import('./SohraiMuralArt').then(m => ({ default: m.SohraiMuralArt })));
const SantaliProverbsBhenta = lazy(() => import('./SantaliProverbsBhenta').then(m => ({ default: m.SantaliProverbsBhenta })));
const SantaliAgriSeasons = lazy(() => import('./SantaliAgriSeasons').then(m => ({ default: m.SantaliAgriSeasons })));
const SantaliTraditionalMeasures = lazy(() => import('./SantaliTraditionalMeasures').then(m => ({ default: m.SantaliTraditionalMeasures })));
const SantaliArchitecture = lazy(() => import('./SantaliArchitecture').then(m => ({ default: m.SantaliArchitecture })));
const SantaliHistoricalGarhs = lazy(() => import('./SantaliHistoricalGarhs').then(m => ({ default: m.SantaliHistoricalGarhs })));
const SantaliPuppetryTheater = lazy(() => import('./SantaliPuppetryTheater').then(m => ({ default: m.SantaliPuppetryTheater })));
const SantaliAstronomySkyLore = lazy(() => import('./SantaliAstronomySkyLore').then(m => ({ default: m.SantaliAstronomySkyLore })));
const SantaliSendraLobir = lazy(() => import('./SantaliSendraLobir').then(m => ({ default: m.SantaliSendraLobir })));
const SantaliDhokraArt = lazy(() => import('./SantaliDhokraArt').then(m => ({ default: m.SantaliDhokraArt })));
const SantaliWaterHarvesting = lazy(() => import('./SantaliWaterHarvesting').then(m => ({ default: m.SantaliWaterHarvesting })));
const SantaliHandloomWeaving = lazy(() => import('./SantaliHandloomWeaving').then(m => ({ default: m.SantaliHandloomWeaving })));
const SantaliLivestockKhuntau = lazy(() => import('./SantaliLivestockKhuntau').then(m => ({ default: m.SantaliLivestockKhuntau })));
const SantaliWoodcraftCarpentry = lazy(() => import('./SantaliWoodcraftCarpentry').then(m => ({ default: m.SantaliWoodcraftCarpentry })));
const SantaliBambooCraft = lazy(() => import('./SantaliBambooCraft').then(m => ({ default: m.SantaliBambooCraft })));
const SantaliPhoneticsLab = lazy(() => import('./SantaliPhoneticsLab').then(m => ({ default: m.SantaliPhoneticsLab })));
const SantaliBabyNamesDirectory = lazy(() => import('./SantaliBabyNamesDirectory').then(m => ({ default: m.SantaliBabyNamesDirectory })));
const SantaliOrnamentsJewellery = lazy(() => import('./SantaliOrnamentsJewellery').then(m => ({ default: m.SantaliOrnamentsJewellery })));
const SantaliBlacksmithyIronCraft = lazy(() => import('./SantaliBlacksmithyIronCraft').then(m => ({ default: m.SantaliBlacksmithyIronCraft })));
const SantaliSeasonsWeatherLore = lazy(() => import('./SantaliSeasonsWeatherLore').then(m => ({ default: m.SantaliSeasonsWeatherLore })));
const SantaliIdiomsMenkatha = lazy(() => import('./SantaliIdiomsMenkatha').then(m => ({ default: m.SantaliIdiomsMenkatha })));
const SantaliTraditionalHerbalDrinks = lazy(() => import('./SantaliTraditionalHerbalDrinks').then(m => ({ default: m.SantaliTraditionalHerbalDrinks })));
const SantaliArcheryGameSimulator = lazy(() => import('./SantaliArcheryGameSimulator').then(m => ({ default: m.SantaliArcheryGameSimulator })));
const SantaliTraditionalCuisine = lazy(() => import('./SantaliTraditionalCuisine').then(m => ({ default: m.SantaliTraditionalCuisine })));
const SantaliMarriageLifeRituals = lazy(() => import('./SantaliMarriageLifeRituals').then(m => ({ default: m.SantaliMarriageLifeRituals })));
const SantaliRiddlesKudumGame = lazy(() => import('./SantaliRiddlesKudumGame').then(m => ({ default: m.SantaliRiddlesKudumGame })));
const SantaliSacredPilgrimages = lazy(() => import('./SantaliSacredPilgrimages').then(m => ({ default: m.SantaliSacredPilgrimages })));
const SantaliSpokenDialogues = lazy(() => import('./SantaliSpokenDialogues').then(m => ({ default: m.SantaliSpokenDialogues })));
const SantaliFormalLetterTemplates = lazy(() => import('./SantaliFormalLetterTemplates').then(m => ({ default: m.SantaliFormalLetterTemplates })));
const SantaliIllustratedFolkTales = lazy(() => import('./SantaliIllustratedFolkTales').then(m => ({ default: m.SantaliIllustratedFolkTales })));
const SantaliFavoritesNotebook = lazy(() => import('./SantaliFavoritesNotebook').then(m => ({ default: m.SantaliFavoritesNotebook })));
const SantaliProficiencyCertificate = lazy(() => import('./SantaliProficiencyCertificate').then(m => ({ default: m.SantaliProficiencyCertificate })));
const SantaliSocialCardStudio = lazy(() => import('./SantaliSocialCardStudio').then(m => ({ default: m.SantaliSocialCardStudio })));
const SantaliLunarCalendarClock = lazy(() => import('./SantaliLunarCalendarClock').then(m => ({ default: m.SantaliLunarCalendarClock })));
const SantaliSerengKaraoke = lazy(() => import('./SantaliSerengKaraoke').then(m => ({ default: m.SantaliSerengKaraoke })));
const SantaliVillageTour = lazy(() => import('./SantaliVillageTour').then(m => ({ default: m.SantaliVillageTour })));
const SantaliWildFoodsNutrition = lazy(() => import('./SantaliWildFoodsNutrition').then(m => ({ default: m.SantaliWildFoodsNutrition })));
const SantaliFolkRadio = lazy(() => import('./SantaliFolkRadio').then(m => ({ default: m.SantaliFolkRadio })));
const SantaliEthnoMedicine = lazy(() => import('./SantaliEthnoMedicine').then(m => ({ default: m.SantaliEthnoMedicine })));
const SantaliMultiScriptConverter = lazy(() => import('./SantaliMultiScriptConverter').then(m => ({ default: m.SantaliMultiScriptConverter })));
const SantaliKidsSoundboard = lazy(() => import('./SantaliKidsSoundboard').then(m => ({ default: m.SantaliKidsSoundboard })));
const SantaliWallpaperStudio = lazy(() => import('./SantaliWallpaperStudio').then(m => ({ default: m.SantaliWallpaperStudio })));
const SantaliClanGenealogy = lazy(() => import('./SantaliClanGenealogy').then(m => ({ default: m.SantaliClanGenealogy })));
const SantaliHaatBarterSimulator = lazy(() => import('./SantaliHaatBarterSimulator').then(m => ({ default: m.SantaliHaatBarterSimulator })));
const SantaliBaplaChantsStudio = lazy(() => import('./SantaliBaplaChantsStudio').then(m => ({ default: m.SantaliBaplaChantsStudio })));
const SantaliBirdLoreEthnoOrnithology = lazy(() => import('./SantaliBirdLoreEthnoOrnithology').then(m => ({ default: m.SantaliBirdLoreEthnoOrnithology })));
const SantaliGodnaBodyArt = lazy(() => import('./SantaliGodnaBodyArt').then(m => ({ default: m.SantaliGodnaBodyArt })));
const SantaliIndigenousSeedsHeirloom = lazy(() => import('./SantaliIndigenousSeedsHeirloom').then(m => ({ default: m.SantaliIndigenousSeedsHeirloom })));
const SantaliGreetingsEtiquetteSimulator = lazy(() => import('./SantaliGreetingsEtiquetteSimulator').then(m => ({ default: m.SantaliGreetingsEtiquetteSimulator })));
const SantaliInstrumentsOrchestra = lazy(() => import('./SantaliInstrumentsOrchestra').then(m => ({ default: m.SantaliInstrumentsOrchestra })));
const SantaliBoneSettingHealing = lazy(() => import('./SantaliBoneSettingHealing').then(m => ({ default: m.SantaliBoneSettingHealing })));
const SantaliLoBirCourtSimulator = lazy(() => import('./SantaliLoBirCourtSimulator').then(m => ({ default: m.SantaliLoBirCourtSimulator })));
const SantaliOlChikiPenmanshipWorkbook = lazy(() => import('./SantaliOlChikiPenmanshipWorkbook').then(m => ({ default: m.SantaliOlChikiPenmanshipWorkbook })));
const SantaliHandiFermentationLore = lazy(() => import('./SantaliHandiFermentationLore').then(m => ({ default: m.SantaliHandiFermentationLore })));
const SantaliIpilConstellationsAstronomy = lazy(() => import('./SantaliIpilConstellationsAstronomy').then(m => ({ default: m.SantaliIpilConstellationsAstronomy })));
const SantaliNahelDhenkiCraft = lazy(() => import('./SantaliNahelDhenkiCraft').then(m => ({ default: m.SantaliNahelDhenkiCraft })));
const SantaliIndigenousSportsKati = lazy(() => import('./SantaliIndigenousSportsKati').then(m => ({ default: m.SantaliIndigenousSportsKati })));
const SantaliTraditionalFishingCraft = lazy(() => import('./SantaliTraditionalFishingCraft').then(m => ({ default: m.SantaliTraditionalFishingCraft })));
const SantaliNaturalPigmentsCraft = lazy(() => import('./SantaliNaturalPigmentsCraft').then(m => ({ default: m.SantaliNaturalPigmentsCraft })));
const SantaliBanamTamakLuthier = lazy(() => import('./SantaliBanamTamakLuthier').then(m => ({ default: m.SantaliBanamTamakLuthier })));
const SantaliJaherGroveEcology = lazy(() => import('./SantaliJaherGroveEcology').then(m => ({ default: m.SantaliJaherGroveEcology })));
const SantaliCustomaryOathsJustice = lazy(() => import('./SantaliCustomaryOathsJustice').then(m => ({ default: m.SantaliCustomaryOathsJustice })));
const SantaliSasandiriMegalithicLore = lazy(() => import('./SantaliSasandiriMegalithicLore').then(m => ({ default: m.SantaliSasandiriMegalithicLore })));
const SantaliIndigenousMathGeometry = lazy(() => import('./SantaliIndigenousMathGeometry').then(m => ({ default: m.SantaliIndigenousMathGeometry })));
const SantaliWildHoneyHarvesting = lazy(() => import('./SantaliWildHoneyHarvesting').then(m => ({ default: m.SantaliWildHoneyHarvesting })));
const SantaliAnimalBehaviorOmens = lazy(() => import('./SantaliAnimalBehaviorOmens').then(m => ({ default: m.SantaliAnimalBehaviorOmens })));
const SantaliTextileDyesBlockPrint = lazy(() => import('./SantaliTextileDyesBlockPrint').then(m => ({ default: m.SantaliTextileDyesBlockPrint })));
const SantaliMidwiferyCareLore = lazy(() => import('./SantaliMidwiferyCareLore').then(m => ({ default: m.SantaliMidwiferyCareLore })));
const SantaliUniversalTextReader = lazy(() => import('./SantaliUniversalTextReader').then(m => ({ default: m.SantaliUniversalTextReader })));
const SantaliKaramBintiEpic = lazy(() => import('./SantaliKaramBintiEpic').then(m => ({ default: m.SantaliKaramBintiEpic })));
const SantaliEpigraphyNumismatics = lazy(() => import('./SantaliEpigraphyNumismatics').then(m => ({ default: m.SantaliEpigraphyNumismatics })));
const SantaliIllustratedComicsReader = lazy(() => import('./SantaliIllustratedComicsReader').then(m => ({ default: m.SantaliIllustratedComicsReader })));
const SantaliVerbConjugator = lazy(() => import('./SantaliVerbConjugator').then(m => ({ default: m.SantaliVerbConjugator })));
const SantaliLiteraryArchives = lazy(() => import('./SantaliLiteraryArchives').then(m => ({ default: m.SantaliLiteraryArchives })));
const SantaliBullockCartCraft = lazy(() => import('./SantaliBullockCartCraft').then(m => ({ default: m.SantaliBullockCartCraft })));
const SantaliTerracottaPottery = lazy(() => import('./SantaliTerracottaPottery').then(m => ({ default: m.SantaliTerracottaPottery })));
const SantaliFiberMatCraft = lazy(() => import('./SantaliFiberMatCraft').then(m => ({ default: m.SantaliFiberMatCraft })));
const SantaliLivestockEthnoVet = lazy(() => import('./SantaliLivestockEthnoVet').then(m => ({ default: m.SantaliLivestockEthnoVet })));
const SantaliMuhuratAlmanac = lazy(() => import('./SantaliMuhuratAlmanac').then(m => ({ default: m.SantaliMuhuratAlmanac })));
const SantaliSptPesaRights = lazy(() => import('./SantaliSptPesaRights').then(m => ({ default: m.SantaliSptPesaRights })));
const SantaliRegionalDialects = lazy(() => import('./SantaliRegionalDialects').then(m => ({ default: m.SantaliRegionalDialects })));
const SantaliAnchoringSpeechKit = lazy(() => import('./SantaliAnchoringSpeechKit').then(m => ({ default: m.SantaliAnchoringSpeechKit })));
const SantaliTasarSericulture = lazy(() => import('./SantaliTasarSericulture').then(m => ({ default: m.SantaliTasarSericulture })));
const SantaliOilPressKolhu = lazy(() => import('./SantaliOilPressKolhu').then(m => ({ default: m.SantaliOilPressKolhu })));
const SantaliFoodPreservationLore = lazy(() => import('./SantaliFoodPreservationLore').then(m => ({ default: m.SantaliFoodPreservationLore })));
const SantaliDongaBoatLore = lazy(() => import('./SantaliDongaBoatLore').then(m => ({ default: m.SantaliDongaBoatLore })));
const SantaliAherPyneWater = lazy(() => import('./SantaliAherPyneWater').then(m => ({ default: m.SantaliAherPyneWater })));
const SantaliForestFireEcology = lazy(() => import('./SantaliForestFireEcology').then(m => ({ default: m.SantaliForestFireEcology })));
const SantaliTypingSpeedTest = lazy(() => import('./SantaliTypingSpeedTest').then(m => ({ default: m.SantaliTypingSpeedTest })));
const SantaliPahadaTables = lazy(() => import('./SantaliPahadaTables').then(m => ({ default: m.SantaliPahadaTables })));
const SantaliStreakTracker = lazy(() => import('./SantaliStreakTracker').then(m => ({ default: m.SantaliStreakTracker })));
const SantaliWordPinboard = lazy(() => import('./SantaliWordPinboard').then(m => ({ default: m.SantaliWordPinboard })));
const SantaliExamPrepHub = lazy(() => import('./SantaliExamPrepHub').then(m => ({ default: m.SantaliExamPrepHub })));
const SantaliDictationLab = lazy(() => import('./SantaliDictationLab').then(m => ({ default: m.SantaliDictationLab })));
const SantaliWordMatchGame = lazy(() => import('./SantaliWordMatchGame').then(m => ({ default: m.SantaliWordMatchGame })));
const SantaliMedicalTranslator = lazy(() => import('./SantaliMedicalTranslator').then(m => ({ default: m.SantaliMedicalTranslator })));
const SantaliGramSabhaDrafter = lazy(() => import('./SantaliGramSabhaDrafter').then(m => ({ default: m.SantaliGramSabhaDrafter })));
const SantaliNewsTeleprompter = lazy(() => import('./SantaliNewsTeleprompter').then(m => ({ default: m.SantaliNewsTeleprompter })));
const SantaliDataBackupManager = lazy(() => import('./SantaliDataBackupManager').then(m => ({ default: m.SantaliDataBackupManager })));
const SantaliTalaMetronome = lazy(() => import('./SantaliTalaMetronome').then(m => ({ default: m.SantaliTalaMetronome })));
const SantaliInstrumentTuner = lazy(() => import('./SantaliInstrumentTuner').then(m => ({ default: m.SantaliInstrumentTuner })));
const SantaliLandTopography = lazy(() => import('./SantaliLandTopography').then(m => ({ default: m.SantaliLandTopography })));
const SantaliMicroJournal = lazy(() => import('./SantaliMicroJournal').then(m => ({ default: m.SantaliMicroJournal })));
const SantaliWitRiddlesArena = lazy(() => import('./SantaliWitRiddlesArena').then(m => ({ default: m.SantaliWitRiddlesArena })));
const SantaliDanceAkhdaGuide = lazy(() => import('./SantaliDanceAkhdaGuide').then(m => ({ default: m.SantaliDanceAkhdaGuide })));
const SantaliGrammarChecker = lazy(() => import('./SantaliGrammarChecker').then(m => ({ default: m.SantaliGrammarChecker })));
const SantaliCrosswordGame = lazy(() => import('./SantaliCrosswordGame').then(m => ({ default: m.SantaliCrosswordGame })));
const SantaliWildlifeFloraQuiz = lazy(() => import('./SantaliWildlifeFloraQuiz').then(m => ({ default: m.SantaliWildlifeFloraQuiz })));
const SantaliInvitationCertificateStudio = lazy(() => import('./SantaliInvitationCertificateStudio').then(m => ({ default: m.SantaliInvitationCertificateStudio })));
const SantaliSentenceScramble = lazy(() => import('./SantaliSentenceScramble').then(m => ({ default: m.SantaliSentenceScramble })));
const SantaliPoetryRhymeStudio = lazy(() => import('./SantaliPoetryRhymeStudio').then(m => ({ default: m.SantaliPoetryRhymeStudio })));
const SantaliPocketBookletMaker = lazy(() => import('./SantaliPocketBookletMaker').then(m => ({ default: m.SantaliPocketBookletMaker })));
const SantaliClanKinshipChecker = lazy(() => import('./SantaliClanKinshipChecker').then(m => ({ default: m.SantaliClanKinshipChecker })));
const SantaliCivicBankDialogue = lazy(() => import('./SantaliCivicBankDialogue').then(m => ({ default: m.SantaliCivicBankDialogue })));
const SantaliHaatFestivalPlanner = lazy(() => import('./SantaliHaatFestivalPlanner').then(m => ({ default: m.SantaliHaatFestivalPlanner })));
const SantaliWordSearchGame = lazy(() => import('./SantaliWordSearchGame').then(m => ({ default: m.SantaliWordSearchGame })));
const SantaliAudioMemoryGame = lazy(() => import('./SantaliAudioMemoryGame').then(m => ({ default: m.SantaliAudioMemoryGame })));
const SantaliVillageLayoutMap = lazy(() => import('./SantaliVillageLayoutMap').then(m => ({ default: m.SantaliVillageLayoutMap })));
const DailyCurrentAffairs2026 = lazy(() => import('./DailyCurrentAffairs2026').then(m => ({ default: m.DailyCurrentAffairs2026 })));
const SantaliNativeVoiceRecorder = lazy(() => import('./SantaliNativeVoiceRecorder').then(m => ({ default: m.SantaliNativeVoiceRecorder })));
const SantaliTwoPlayerQuizBattle = lazy(() => import('./SantaliTwoPlayerQuizBattle').then(m => ({ default: m.SantaliTwoPlayerQuizBattle })));
const SantaliRoleplaySimulator = lazy(() => import('./SantaliRoleplaySimulator').then(m => ({ default: m.SantaliRoleplaySimulator })));
const SantaliFamilyTreeBuilder = lazy(() => import('./SantaliFamilyTreeBuilder').then(m => ({ default: m.SantaliFamilyTreeBuilder })));
const SantaliTeacherWorksheetMaker = lazy(() => import('./SantaliTeacherWorksheetMaker').then(m => ({ default: m.SantaliTeacherWorksheetMaker })));
const SantaliChhatiarNameStudio = lazy(() => import('./SantaliChhatiarNameStudio').then(m => ({ default: m.SantaliChhatiarNameStudio })));
const SantaliAudioPlaylistPlayer = lazy(() => import('./SantaliAudioPlaylistPlayer').then(m => ({ default: m.SantaliAudioPlaylistPlayer })));
const SantaliCommunityHallOfFame = lazy(() => import('./SantaliCommunityHallOfFame').then(m => ({ default: m.SantaliCommunityHallOfFame })));
const SantaliOfflinePackManager = lazy(() => import('./SantaliOfflinePackManager').then(m => ({ default: m.SantaliOfflinePackManager })));
const SantaliSmartWriter = lazy(() => import('./SantaliSmartWriter').then(m => ({ default: m.SantaliSmartWriter })));
const SantaliEmergencyVoiceCards = lazy(() => import('./SantaliEmergencyVoiceCards').then(m => ({ default: m.SantaliEmergencyVoiceCards })));
const SantaliWeeklyBulletinMaker = lazy(() => import('./SantaliWeeklyBulletinMaker').then(m => ({ default: m.SantaliWeeklyBulletinMaker })));
const SantaliKidsStorybookMaker = lazy(() => import('./SantaliKidsStorybookMaker').then(m => ({ default: m.SantaliKidsStorybookMaker })));
const SantaliTenseSuffixDrill = lazy(() => import('./SantaliTenseSuffixDrill').then(m => ({ default: m.SantaliTenseSuffixDrill })));
const SantaliKrishiCropLedger = lazy(() => import('./SantaliKrishiCropLedger').then(m => ({ default: m.SantaliKrishiCropLedger })));
const SantaliQrWordCards = lazy(() => import('./SantaliQrWordCards').then(m => ({ default: m.SantaliQrWordCards })));
const SantaliPronounCaseLab = lazy(() => import('./SantaliPronounCaseLab').then(m => ({ default: m.SantaliPronounCaseLab })));
const SantaliBazaarPriceCalc = lazy(() => import('./SantaliBazaarPriceCalc').then(m => ({ default: m.SantaliBazaarPriceCalc })));
const SantaliSchoolPrayerAssembly = lazy(() => import('./SantaliSchoolPrayerAssembly').then(m => ({ default: m.SantaliSchoolPrayerAssembly })));
const SantaliPanchayatSchemeGuide = lazy(() => import('./SantaliPanchayatSchemeGuide').then(m => ({ default: m.SantaliPanchayatSchemeGuide })));
const SantaliBusRailHelpline = lazy(() => import('./SantaliBusRailHelpline').then(m => ({ default: m.SantaliBusRailHelpline })));
const SantaliAudioListeningTest = lazy(() => import('./SantaliAudioListeningTest').then(m => ({ default: m.SantaliAudioListeningTest })));
const SantaliSongLyricBuilder = lazy(() => import('./SantaliSongLyricBuilder').then(m => ({ default: m.SantaliSongLyricBuilder })));
const SantaliJoraKathaLab = lazy(() => import('./SantaliJoraKathaLab').then(m => ({ default: m.SantaliJoraKathaLab })));
const SantaliQuestionNegationLab = lazy(() => import('./SantaliQuestionNegationLab').then(m => ({ default: m.SantaliQuestionNegationLab })));
const SantaliSpellFixLab = lazy(() => import('./SantaliSpellFixLab').then(m => ({ default: m.SantaliSpellFixLab })));
const SantaliShgSavingsLedger = lazy(() => import('./SantaliShgSavingsLedger').then(m => ({ default: m.SantaliShgSavingsLedger })));
const SantaliMaternalChildHealth = lazy(() => import('./SantaliMaternalChildHealth').then(m => ({ default: m.SantaliMaternalChildHealth })));
const SantaliReportCardMaker = lazy(() => import('./SantaliReportCardMaker').then(m => ({ default: m.SantaliReportCardMaker })));
const SantaliLiteraryPioneers = lazy(() => import('./SantaliLiteraryPioneers').then(m => ({ default: m.SantaliLiteraryPioneers })));
import { useAdmin } from '../context/AdminContext';
import {
  Home,
  GraduationCap,
  Flame,
  Check,
  Keyboard as KeyboardIcon,
  BookOpen,
  Languages,
  ArrowRight,
  Wifi,
  Battery,
  Signal,
  Globe,
  Calendar
} from 'lucide-react';

export const MobileSimulator: React.FC = () => {
  const { heroConfig } = useAdmin();
  const [currentScreen, setCurrentScreen] = useState<MobileScreen>('home');
  const [selectedScript, setSelectedScript] = useState<ScriptType>('roman');

  const screens: { id: MobileScreen; label: string }[] = [
    { id: 'splash', label: '1. Splash Screen' },
    { id: 'language', label: '2. Language Selection' },
    { id: 'home', label: '3. Home Dashboard' },
    { id: 'keyboard', label: '4. Santali Keyboard ↗' },
    { id: 'dictionary', label: '5. Dictionary' },
    { id: 'calendar', label: '6. Cultural Festivals (पर्व)' },
    { id: 'learn', label: '7. Learn Santali Devanagari' },
    { id: 'phrasebook', label: '8. Spoken Phrasebook' },
    { id: 'flashcards', label: '9. Flashcards' },
    { id: 'calligraphy', label: '11. Calligraphy & Posters' },
    { id: 'kudum', label: '12. Kudum & Riddles' },
    { id: 'calendar', label: '13. Cultural Calendar' },
    { id: 'wordle', label: '14. Wordle Game' },
    { id: 'stories', label: '15. Folk Stories Audio' },
    { id: 'speech_coach', label: '16. Pronunciation Coach' },
    { id: 'speaker', label: '17. Voice Speaker & Reader' },
    { id: 'instruments', label: '18. Instruments Pad' },
    { id: 'family_tree', label: '19. Kinship & Family Tree' },
    { id: 'kids_rhymes', label: '20. Kids Rhymes Jukebox' },
    { id: 'clock_numbers', label: '21. Speaking Clock & Numbers' },
    { id: 'clans', label: '22. 12 Sacred Clans' },
    { id: 'sohrai_art', label: '24. Sohrai Mural Art' },
    { id: 'proverbs_bhenta', label: '25. Proverbs (भेंता काथा)' },
    { id: 'agri_seasons', label: '26. Traditional Agriculture' },
    { id: 'traditional_measures', label: '27. Traditional Measures' },
    { id: 'architecture', label: '28. Traditional Architecture' },
    { id: 'historical_garhs', label: '29. 12 Historical Garhs' },
    { id: 'puppetry_theater', label: '30. Chadar Badani Puppetry' },
    { id: 'astronomy_lore', label: '31. Astronomy & Sky Lore' },
    { id: 'baby_names', label: '32. Baby Names Directory' },
    { id: 'ornaments_jewellery', label: '33. Ornaments & Jewellery' },
    { id: 'blacksmithy_iron', label: '34. Iron Blacksmithy Craft' },
    { id: 'seasons_weather', label: '35. 6 Seasons & Weather Lore' },
    { id: 'idioms_menkatha', label: '36. Santali Idioms (Menkatha)' },
    { id: 'herbal_drinks', label: '37. Herbal Drinks & Tonics' },
    { id: 'archery_simulator', label: '38. Ak-Sar Archery Simulator' },
    { id: 'traditional_cuisine', label: '39. Traditional Cuisine & Recipes' },
    { id: 'marriage_rituals', label: '40. 7 Marriages & Life Rites' },
    { id: 'riddles_kudum', label: '41. Kudum Folk Riddles Game' },
    { id: 'sacred_pilgrimages', label: '42. Sacred Pilgrimages & Garhs' },
    { id: 'spoken_dialogues', label: '43. Spoken Dialogues (हाट-बाजार)' },
    { id: 'letter_templates', label: '44. Formal Letter Templates' },
    { id: 'illustrated_stories', label: '45. Illustrated Folk Tales' },
    { id: 'favorites_notebook', label: '46. इञाक् साकाम (Favorites Notebook)' },
    { id: 'translator', label: '47. Translator' },
    { id: 'daily_quiz', label: '48. Daily Vocab Quiz' },
    { id: 'social_cards', label: '49. Social Media Cards & Posters' },
    { id: 'lunar_calendar', label: '50. Lunar Calendar & Clock' },
    { id: 'sereng_karaoke', label: '51. Folk Song Karaoke & Rhythm' },
    { id: 'village_tour', label: '52. Virtual Village Tour & Sacred Map' },
    { id: 'wild_foods', label: '53. Wild Foods & Nutrition' },
    { id: 'festival_cards', label: '54. Festival Greetings & WhatsApp' },
    { id: 'folk_radio', label: '55. Santali Folk Radio & Ambient' },
    { id: 'ethno_medicine', label: '56. Ethno-Medicine & First Aid' },
    { id: 'script_converter', label: '57. Multi-Script Transliteration' },
    { id: 'kids_soundboard', label: '58. Kids Soundboard & Quiz' },
    { id: 'wallpaper_studio', label: '59. 9:16 Mobile Wallpaper Studio' },
    { id: 'clan_genealogy', label: '60. Clan & Family Heritage' },
    { id: 'haat_barter', label: '61. Village Haat & Barter' },
    { id: 'bapla_chants', label: '62. Wedding Chants & Bapla' },
    { id: 'bird_lore', label: '63. Bird Lore & Ethno-Ornithology' },
    { id: 'godna_body_art', label: '64. Sika & Godna Body Art' },
    { id: 'heirloom_seeds', label: '65. Indigenous Heirloom Seeds' },
    { id: 'kinship_etiquette', label: '66. Kinship Greetings & Etiquette' },
    { id: 'instruments_orchestra', label: '67. Instruments Orchestra' },
    { id: 'bone_setting_healing', label: '68. Bone Setting & Trauma Care' },
    { id: 'lo_bir_court', label: '69. Lo Bir Baisi Customary Court' },
    { id: 'calligraphy_workbook', label: '70. Ol Chiki Penmanship Workbook' },
    { id: 'handi_fermentation_lore', label: '71. Handi & Ranu Fermentation' },
    { id: 'ipil_astronomy', label: '72. Ipil Sky Lore & Starmap' },
    { id: 'nahel_dhenki_craft', label: '73. Nahel & Dhenki Woodcraft' },
    { id: 'indigenous_sports_kati', label: '74. Kati Enech & Traditional Sports' },
    { id: 'traditional_fishing_craft', label: '75. Fishing Traps & Haku Ran' },
    { id: 'natural_pigments_craft', label: '76. Natural Earth Pigments & Murals' },
    { id: 'banam_tamak_luthier', label: '77. Banam & Tamak Luthier' },
    { id: 'jaher_sacred_grove_ecology', label: '78. Jaher Sacred Grove Ecology' },
    { id: 'customary_oaths_justice', label: '79. Customary Oaths & Justice' },
    { id: 'sasandiri_megalithic_lore', label: '80. Sasandiri Megaliths' },
    { id: 'indigenous_math_geometry', label: '81. Indigenous Math & Geometry' },
    { id: 'wild_honey_harvesting', label: '82. Wild Honey & Bee Lore' },
    { id: 'animal_behavior_omens', label: '83. Animal Omens & Bioacoustics' },
    { id: 'indigenous_textile_dyes', label: '84. Textile Dyes & Block Print' },
    { id: 'indigenous_midwifery_care', label: '85. Midwifery & Infant Care' },
    { id: 'universal_text_reader', label: '86. Universal Text & Audio Reader' },
    { id: 'karam_binti_epic_reader', label: '87. Karam Binti Oral Epic' },
    { id: 'epigraphy_numismatics_lore', label: '88. Garh Epigraphy & Ancient Coins' },
    { id: 'illustrated_comics_reader', label: '89. Illustrated Visual Comics' },
    { id: 'santali_verb_conjugator', label: '90. Verb & Tense Conjugator' },
    { id: 'pera_hor_literature', label: '91. Pera Hor & Literary Classics' },
    { id: 'sagar_bullock_cart', label: '92. Sagar Bullock Cart Craft' },
    { id: 'terracotta_pottery_lore', label: '93. Terracotta Pottery & Kiln' },
    { id: 'babui_rope_mat_craft', label: '94. Babui Rope, Patia & Ghonghu' },
    { id: 'livestock_ethno_vet', label: '95. Livestock & Ethno-Veterinary' },
    { id: 'muhurat_almanac_checker', label: '96. Muhurat & Almanac Checker' },
    { id: 'spt_pesa_rights_guide', label: '97. SPT, PESA & Gram Sabha Rights' },
    { id: 'santali_dialects_comparative', label: '98. Regional Dialect Switcher' },
    { id: 'santali_anchoring_speeches', label: '99. Anchoring & Speech Kit' },
    { id: 'tasar_silk_sericulture', label: '100. Tasar Silk Sericulture' },
    { id: 'mahua_oil_press_kolhu', label: '101. Kolhu Cold-Press Oil Science' },
    { id: 'sun_dried_forest_preservation', label: '102. Hendwa & Sun-Dried Foods' },
    { id: 'donga_boat_river_lore', label: '103. Donga Canoe & River Craft' },
    { id: 'aher_pyne_water_governance', label: '104. Aher-Pyne Water Governance' },
    { id: 'bir_sengel_fire_ecology', label: '105. Forest Firebreak Ecology' },
    { id: 'santali_typing_speed', label: '106. Typing Speed & WPM Test' },
    { id: 'santali_pahada_tables', label: '107. Santali Pahada Tables (1-10)' },
    { id: 'learning_streak_tracker', label: '108. Daily Streak & Goals' },
    { id: 'word_pinboard_notes', label: '109. Sticky Word Pinboard' },
    { id: 'santali_exam_prep_jpsc', label: '110. India + Jharkhand Exams 2026' },
    { id: 'santali_dictation_lab', label: '111. Dictation & Listening Lab' },
    { id: 'santali_word_match_game', label: '112. Word Match Game' },
    { id: 'santali_medical_translator', label: '113. Medical & Clinic Guide' },
    { id: 'gram_sabha_form_drafter', label: '114. Gram Sabha Form Drafter' },
    { id: 'santali_news_bulletin_studio', label: '115. News Teleprompter Studio' },
    { id: 'data_backup_manager', label: '116. Data Backup & Restore' },
    { id: 'santali_tala_metronome', label: '117. Tala & Rhythm Metronome' },
    { id: 'santali_instrument_tuner', label: '118. Instrument Pitch Tuner' },
    { id: 'santali_land_topography', label: '119. Land & Soil Topography' },
    { id: 'santali_micro_journal', label: '120. Daily Micro-Journal' },
    { id: 'santali_wit_riddles_arena', label: '121. Riddles & Folk Wit Arena' },
    { id: 'dance_akhda_formations', label: '122. Dance Steps & Akhda Guide' },
    { id: 'santali_grammar_checker', label: '123. Grammar & Suffix Checker' },
    { id: 'santali_crossword_puzzle', label: '124. Santali Crossword Grid' },
    { id: 'wildlife_flora_quiz', label: '125. Wildlife & Flora Quiz' },
    { id: 'invitation_certificate_maker', label: '126. Invite & Certificate Studio' },
    { id: 'sentence_scramble_builder', label: '127. Sentence Scramble Builder' },
    { id: 'poetry_sereng_studio', label: '128. Poetry & Sereng Studio' },
    { id: 'pocket_study_booklet', label: '129. Pocket Study Booklet' },
    { id: 'clan_kinship_checker', label: '130. Clan & Kinship Checker' },
    { id: 'civic_bank_dialogue_kit', label: '131. Civic & Bank Dialogues' },
    { id: 'haat_festival_planner', label: '132. Haat & Festival Planner' },
    { id: 'santali_word_search_puzzle', label: '133. Santali Word Search' },
    { id: 'audio_memory_flip_game', label: '134. Audio Memory Flip Game' },
    { id: 'village_layout_landmark_map', label: '135. Village Sacred Map' },
    { id: 'daily_current_affairs', label: '136. Current Affairs 2026' },
    { id: 'native_voice_recorder', label: '137. Native Voice Recorder' },
    { id: 'two_player_battle', label: '138. 2-Player Quiz Battle' },
    { id: 'smart_essay_writer', label: '139. Smart Essay Writer' },
    { id: 'emergency_voice_cards', label: '140. Emergency Voice SOS' },
    { id: 'weekly_bulletin_maker', label: '141. Weekly Bulletin Maker' },
    { id: 'kids_storybook_maker', label: '142. Kids Storybook Maker' },
    { id: 'tense_suffix_drill', label: '143. Tense & Suffix Drill' },
    { id: 'krishi_crop_ledger', label: '144. Krishi Crop Ledger' },
    { id: 'qr_word_cards', label: '145. QR Word Flashcards' },
    { id: 'santali_pronoun_case_lab', label: '146. Pronoun & Case Lab' },
    { id: 'santali_bazaar_price_calc', label: '147. Haat Voice Bill Calc' },
    { id: 'santali_school_prayer_assembly', label: '148. School Prayer Assembly' },
    { id: 'santali_panchayat_scheme_guide', label: '149. Govt Schemes & Docs' },
    { id: 'santali_bus_rail_helpline', label: '150. Bus-Rail Travel Cards' },
    { id: 'santali_audio_listening_test', label: '151. Audio Listening Test' },
    { id: 'santali_song_lyric_builder', label: '152. Folk Lyric Studio' },
    { id: 'santali_jora_katha_lab', label: '153. Jora Katha & Antonyms' },
    { id: 'santali_question_negation_lab', label: '154. Question & Negation Lab' },
    { id: 'santali_spell_fix_lab', label: '155. Spelling & Checked Stops' },
    { id: 'santali_shg_savings_ledger', label: '156. SHG Sakhi Mandal Ledger' },
    { id: 'santali_maternal_child_health', label: '157. Mother & Child Health' },
    { id: 'santali_report_card_maker', label: '158. School Report Card Maker' },
    { id: 'santali_literary_pioneers', label: '159. Literary Pioneers & Authors' },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-6 px-4">
      {/* Screen selector pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-4 mb-2 text-xs">
        {screens.map((screen) => (
          <button
            key={screen.id}
            onClick={() => {
              if (screen.id === 'keyboard') {
                openExternalSantaliKeyboard();
                return;
              }
              setCurrentScreen(screen.id);
            }}
            className={`px-3 py-1.5 rounded-xl border whitespace-nowrap transition-all font-medium ${
              currentScreen === screen.id
                ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {screen.label}
          </button>
        ))}
      </div>

      {/* Realistic Android Phone Device Frame */}
      <div
        data-device-bezel="true"
        className="relative w-full max-w-[360px] bg-slate-900 rounded-[44px] p-3 shadow-2xl border-4 border-slate-700/60 ring-1 ring-slate-900/50"
      >
        {/* Phone Speaker & Camera Notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-950 rounded-full flex items-center justify-center gap-2 z-30">
          <div className="w-10 h-1 bg-slate-800 rounded-full" />
          <div className="w-2.5 h-2.5 bg-slate-900 rounded-full border border-slate-700" />
        </div>

        {/* Screen Display Container */}
        <div className="relative w-full h-[650px] bg-[#F8FAFC] rounded-[36px] overflow-hidden flex flex-col justify-between border border-slate-200/50 text-slate-900 font-sans select-none">
          {/* Status Bar */}
          <div className="pt-2 px-6 pb-1 flex items-center justify-between text-[11px] font-semibold text-slate-700 z-20">
            <span>10:24</span>
            <div className="flex items-center gap-1.5 text-slate-600">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Dynamic Screen Contents */}
          <div className="flex-1 overflow-y-auto px-4 py-2">
            <Suspense
              fallback={
                <div className="h-full flex flex-col items-center justify-center gap-2 text-slate-500">
                  <div className="w-7 h-7 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
                  <p className="text-[11px] font-semibold">लोड हो रहा है...</p>
                </div>
              }
            >
            {/* Screen 1: Splash Screen */}
            {currentScreen === 'splash' && (
              <div className="h-full flex flex-col justify-between py-6 text-center">
                <div className="pt-8 space-y-3 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xs overflow-hidden">
                    <img
                      src="/assets/aistudio/bosc-main-logo_39d98de6.png"
                      alt="BOSC"
                      className="w-full h-full object-contain drop-shadow-md"
                    />
                  </div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                    Santal आ़रसी
                  </h1>
                  <p className="text-xs text-slate-500 font-medium">
                    v3.7.4 Pro Ultra
                  </p>
                  <p className="text-xs font-semibold text-amber-800">
                    BOSC Tech &amp; Edu
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="w-full flex items-center justify-center">
                    <CulturalTree variant="banner" className="w-48 h-32" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-serif italic text-slate-700">
                      "{heroConfig.quoteEnglish || 'Our Language, Our Identity, Our Pride'}"
                    </p>
                    <p className="text-[11px] font-medium text-amber-800 italic mt-0.5">
                      "{heroConfig.quoteSantali || 'Abo Ror, Abo Uprum, Abo Gorob'}"
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentScreen('language')}
                    className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Screen 2: Language Selection */}
            {currentScreen === 'language' && (
              <div className="h-full flex flex-col justify-between py-4">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Choose Your Language &amp; Script
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Select your preferred language and script for a better experience.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { id: 'santali' as ScriptType, title: 'Santali Devanagari & Roman', sub: '(संताली देवनागरी एवं रोमन)' },
                      { id: 'hindi' as ScriptType, title: 'Hindi (हिन्दी)', sub: '(Devanagari script)' },
                      { id: 'english' as ScriptType, title: 'English', sub: '(Latin alphabet)' },
                    ].map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedScript(item.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          selectedScript === item.id
                            ? 'bg-sky-50 border-sky-500 shadow-2xs'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <div>
                          <p className="text-sm font-bold text-slate-900">{item.title}</p>
                          <p className="text-[11px] text-slate-500">{item.sub}</p>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            selectedScript === item.id
                              ? 'bg-sky-600 border-sky-600 text-white'
                              : 'border-slate-300'
                          }`}
                        >
                          {selectedScript === item.id && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setCurrentScreen('home')}
                  className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Screen 3: Home Dashboard (Mobile) */}
            {currentScreen === 'home' && (
              <div className="space-y-4 py-2">
                {/* Mobile Top Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src="/assets/aistudio/bosc-main-logo_39d98de6.png"
                      alt="BOSC"
                      className="w-6 h-6 object-contain drop-shadow-xs"
                    />
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">Santal आ़रसी</h3>
                      <p className="text-[10px] text-slate-500">BOSC Tech &amp; Edu</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                    v3.7.4
                  </span>
                </div>

                {/* Johar Hero Card */}
                <div className="p-4 bg-gradient-to-r from-amber-50 to-amber-100/80 rounded-2xl border border-amber-200/80 space-y-2">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-amber-800">
                    Welcome
                  </span>
                  <h2 className="text-base font-bold text-amber-950 leading-tight">
                    Johar! Welcome to <br />Santal आ़रसी
                  </h2>
                  <p className="text-[11px] text-amber-900/80">
                    Santali Language &amp; Learning Platform
                  </p>
                  <button
                    onClick={() => setCurrentScreen('dictionary')}
                    className="mt-1 px-3 py-1.5 bg-amber-900 text-white text-xs font-semibold rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <span>Explore Features</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* 4 Feature Buttons Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  <a
                    href={SANTALI_KEYBOARD_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 bg-sky-500 text-white rounded-2xl text-left shadow-xs hover:bg-sky-600 transition-colors flex flex-col justify-between h-28 cursor-pointer"
                  >
                    <KeyboardIcon className="w-6 h-6" />
                    <div>
                      <p className="text-xs font-bold leading-tight">Santali Keyboard ↗</p>
                      <p className="text-[10px] text-sky-100 mt-0.5">Roman Santali &amp; Diacritics</p>
                    </div>
                  </a>

                  <button
                    onClick={() => setCurrentScreen('dictionary')}
                    className="p-3.5 bg-amber-500 text-white rounded-2xl text-left shadow-xs hover:bg-amber-600 transition-colors flex flex-col justify-between h-28"
                  >
                    <BookOpen className="w-6 h-6" />
                    <div>
                      <p className="text-xs font-bold leading-tight">Dictionary</p>
                      <p className="text-[10px] text-amber-100 mt-0.5">50,000+ Words</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setCurrentScreen('calendar')}
                    className="p-3.5 bg-amber-600 text-white rounded-2xl text-left shadow-xs hover:bg-amber-700 transition-colors flex flex-col justify-between h-28"
                  >
                    <Calendar className="w-6 h-6" />
                    <div>
                      <p className="text-xs font-bold leading-tight">Festivals (पर्व)</p>
                      <p className="text-[10px] text-amber-100 mt-0.5">सोहराय, बाहा, करम पर्व</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setCurrentScreen('learn')}
                    className="p-3.5 bg-emerald-500 text-white rounded-2xl text-left shadow-xs hover:bg-emerald-600 transition-colors flex flex-col justify-between h-28"
                  >
                    <GraduationCap className="w-6 h-6" />
                    <div>
                      <p className="text-xs font-bold leading-tight">Learn Santali</p>
                      <p className="text-[10px] text-emerald-100 mt-0.5">Alphabet &amp; Quiz</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setCurrentScreen('daily_quiz')}
                    className="p-3.5 bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 text-white rounded-2xl text-left shadow-xs hover:from-amber-600 hover:to-rose-700 transition-colors flex flex-col justify-between h-28 sm:col-span-2"
                  >
                    <Flame className="w-6 h-6" />
                    <div>
                      <p className="text-xs font-bold leading-tight">Daily Vocab Quiz</p>
                      <p className="text-[10px] text-amber-100 mt-0.5">5 Words Daily · Track Your Streak</p>
                    </div>
                  </button>
                </div>

                {/* Bottom Translator & Google Translator Row */}
                <div className="space-y-2">
                  <button
                    onClick={() => setCurrentScreen('translator')}
                    className="w-full p-3.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl flex items-center justify-between shadow-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <Languages className="w-5 h-5" />
                      <div className="text-left">
                        <p className="text-xs font-bold">Suite Translator</p>
                        <p className="text-[10px] text-rose-100">Santali · Hindi · English</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href="https://translate.google.com/?sl=auto&tl=hi&op=translate"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-2xl flex items-center justify-center gap-2 font-bold text-xs transition-colors shadow-2xs"
                  >
                    <Globe className="w-4 h-4 text-blue-600" />
                    <span>Launch Google Translator (Online)</span>
                  </a>
                </div>
              </div>
            )}

            {/* Screen 5: Dictionary (Mobile) */}
            {currentScreen === 'dictionary' && (
              <div className="h-full flex flex-col justify-between">
                <DictionaryModule compact />
              </div>
            )}

            {/* Screen 7: Learn Santali (Mobile) */}
            {currentScreen === 'learn' && (
              <div className="h-full flex flex-col justify-between">
                <LearnModule compact />
              </div>
            )}

            {/* Screen 9: Spoken Phrasebook (Mobile) */}
            {currentScreen === 'phrasebook' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliPhrasebook compact />
              </div>
            )}

            {/* Screen 10: Flashcards (Mobile) */}
            {currentScreen === 'flashcards' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliFlashcards compact />
              </div>
            )}

            {/* Screen 11: Calligraphy Studio */}
            {currentScreen === 'calligraphy' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <CalligraphyStudio />
              </div>
            )}

            {/* Screen 12: Kudum & Riddles */}
            {currentScreen === 'kudum' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <KudumProverbs />
              </div>
            )}

            {/* Screen 13: Cultural Calendar */}
            {currentScreen === 'calendar' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <CulturalCalendar />
              </div>
            )}

            {/* Screen 14: Santali Wordle Game */}
            {currentScreen === 'wordle' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliWordleGame />
              </div>
            )}

            {/* Screen 15: Folk Stories Audio */}
            {currentScreen === 'stories' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <FolkStoriesPlayer />
              </div>
            )}

            {/* Screen 16: Pronunciation Coach */}
            {currentScreen === 'speech_coach' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <PronunciationCoach />
              </div>
            )}

            {/* Screen 17: Universal Voice Speaker & Reader */}
            {currentScreen === 'speaker' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <TextSpeakerReader compact />
              </div>
            )}

            {/* Screen 18: Instruments Pad */}
            {currentScreen === 'instruments' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliInstrumentsPad />
              </div>
            )}

            {/* Screen 19: Kinship & Family Tree */}
            {currentScreen === 'family_tree' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliFamilyTree />
              </div>
            )}

            {/* Screen 20: Kids Rhymes Jukebox */}
            {currentScreen === 'kids_rhymes' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliKidsJukebox />
              </div>
            )}

            {/* Screen 21: Speaking Clock & Numbers */}
            {currentScreen === 'clock_numbers' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliClockNumbers />
              </div>
            )}

            {/* Screen 22: 12 Sacred Clans */}
            {currentScreen === 'clans' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliClansDirectory />
              </div>
            )}

            {/* Screen 23: Flora & Worksheets */}
            {currentScreen === 'flora_worksheets' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <AdivasiFloraWorksheet />
              </div>
            )}

            {/* Screen: Majhi Pargana System */}
            {currentScreen === 'governance' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <MajhiParganaSystem />
              </div>
            )}

            {/* Screen: Dharti ki Sristi / Sirjon Kahni */}
            {currentScreen === 'creation' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliCreationMyth />
              </div>
            )}

            {/* Screen: Top 10 Traditional Dances */}
            {currentScreen === 'dances' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliDancesTop10 />
              </div>
            )}

            {/* Screen: Top 15 Puja-Paat & Bonga Buru */}
            {currentScreen === 'bonga_buru' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliBongaBuruTop15 />
              </div>
            )}

            {/* Screen: Santhal Hul 1855 Freedom Heroes */}
            {currentScreen === 'hul_heroes' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SanthalHulHeroes />
              </div>
            )}

            {/* Screen: Santali Marriage Traditions */}
            {currentScreen === 'marriage_bapla' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliMarriageBapla />
              </div>
            )}

            {/* Screen: Traditional Attire & Ornaments */}
            {currentScreen === 'attire_ornaments' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliAttireOrnaments />
              </div>
            )}

            {/* Screen: Authentic Cuisine & Recipes */}
            {currentScreen === 'cuisine' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliCuisineRecipes />
              </div>
            )}

            {/* Screen: Traditional Sports & Sendra */}
            {currentScreen === 'sports_sendra' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliTraditionalSports />
              </div>
            )}

            {/* Screen: Folk Songs & Seren Archive */}
            {currentScreen === 'folk_songs' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliFolkSongsArchive />
              </div>
            )}

            {/* Screen: Sacred Pilgrimage Sites */}
            {currentScreen === 'pilgrimage' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliPilgrimageSites />
              </div>
            )}

            {/* Screen: Sacred Life Rites */}
            {currentScreen === 'life_rites' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliLifeRites />
              </div>
            )}

            {/* Screen: Proficiency Exam & Certificate */}
            {currentScreen === 'certification' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliProficiencyCertificate />
              </div>
            )}

            {/* Screen: Sohrai Mural Art Studio */}
            {currentScreen === 'sohrai_art' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SohraiMuralArt />
              </div>
            )}

            {/* Screen: Proverbs Bhenta Katha */}
            {currentScreen === 'proverbs_bhenta' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliProverbsBhenta />
              </div>
            )}

            {/* Screen: Traditional Agriculture & Seasons */}
            {currentScreen === 'agri_seasons' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliAgriSeasons />
              </div>
            )}

            {/* Screen: Traditional Measures */}
            {currentScreen === 'traditional_measures' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliTraditionalMeasures />
              </div>
            )}

            {/* Screen: Traditional Architecture */}
            {currentScreen === 'architecture' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliArchitecture />
              </div>
            )}

            {/* Screen: Historical Garhs & Migrations */}
            {currentScreen === 'historical_garhs' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliHistoricalGarhs />
              </div>
            )}

            {/* Screen: Chadar Badani Puppetry */}
            {currentScreen === 'puppetry_theater' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliPuppetryTheater />
              </div>
            )}

            {/* Screen: Astronomy & Sky Lore */}
            {currentScreen === 'astronomy_lore' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliAstronomySkyLore />
              </div>
            )}

            {/* Screen: Sendra & Lobir Baisi Forest Ethics & High Court */}
            {currentScreen === 'sendra_lobir' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliSendraLobir />
              </div>
            )}

            {/* Screen: Dhokra Bell-Metal Casting & Kamar Metallurgy */}
            {currentScreen === 'dhokra_art' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliDhokraArt />
              </div>
            )}

            {/* Screen: Water Harvesting, Dadi & Slope Farming */}
            {currentScreen === 'water_harvesting' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliWaterHarvesting />
              </div>
            )}

            {/* Screen: Handloom Weaving & Natural Vegetable Dyeing */}
            {currentScreen === 'handloom_weaving' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliHandloomWeaving />
              </div>
            )}

            {/* Screen: Livestock, Khuntau Ritual & Ethno-Veterinary */}
            {currentScreen === 'livestock_khuntau' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliLivestockKhuntau />
              </div>
            )}

            {/* Screen: Woodcraft, Dhenki, Nahel & Sacred Pillars */}
            {currentScreen === 'woodcraft_carpentry' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliWoodcraftCarpentry />
              </div>
            )}

            {/* Screen: Bamboo Craft, Winnowing Fan & Fish Traps */}
            {currentScreen === 'bamboo_craft' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliBambooCraft />
              </div>
            )}

            {/* Screen: 4 Checked Glottal Consonants Studio & Phonetics Lab */}
            {currentScreen === 'phonetics_lab' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliPhoneticsLab />
              </div>
            )}

            {/* Screen: Baby Names Directory */}
            {currentScreen === 'baby_names' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliBabyNamesDirectory />
              </div>
            )}

            {/* Screen: Ornaments & Jewellery */}
            {currentScreen === 'ornaments_jewellery' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliOrnamentsJewellery />
              </div>
            )}

            {/* Screen: Blacksmithy & Iron Craft */}
            {currentScreen === 'blacksmithy_iron' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliBlacksmithyIronCraft />
              </div>
            )}

            {/* Screen: 6 Seasons & Weather Lore */}
            {currentScreen === 'seasons_weather' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliSeasonsWeatherLore />
              </div>
            )}

            {/* Screen: Idioms & Menkatha */}
            {currentScreen === 'idioms_menkatha' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliIdiomsMenkatha />
              </div>
            )}

            {/* Screen: Traditional Herbal Drinks */}
            {currentScreen === 'herbal_drinks' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliTraditionalHerbalDrinks />
              </div>
            )}

            {/* Screen: Archery Simulator */}
            {currentScreen === 'archery_simulator' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliArcheryGameSimulator />
              </div>
            )}

            {/* Screen: Traditional Cuisine */}
            {currentScreen === 'traditional_cuisine' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliTraditionalCuisine />
              </div>
            )}

            {/* Screen: Marriage & Life Rituals */}
            {currentScreen === 'marriage_rituals' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliMarriageLifeRituals />
              </div>
            )}

            {/* Screen: Kudum Riddles Game */}
            {currentScreen === 'riddles_kudum' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliRiddlesKudumGame />
              </div>
            )}

            {/* Screen: Sacred Pilgrimages */}
            {currentScreen === 'sacred_pilgrimages' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliSacredPilgrimages />
              </div>
            )}

            {/* Screen: Spoken Dialogues */}
            {currentScreen === 'spoken_dialogues' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliSpokenDialogues />
              </div>
            )}

            {/* Screen: Letter & Invitation Templates */}
            {currentScreen === 'letter_templates' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliFormalLetterTemplates />
              </div>
            )}

            {/* Screen: Illustrated Folk Tales */}
            {currentScreen === 'illustrated_stories' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliIllustratedFolkTales />
              </div>
            )}

            {/* Screen: Favorites & Notebook */}
            {currentScreen === 'favorites_notebook' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliFavoritesNotebook />
              </div>
            )}

            {/* Screen: Santali Grammar Builder */}
            {currentScreen === 'grammar' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliGrammarBuilder />
              </div>
            )}

            {/* Screen: Festive Greetings & E-Card Maker */}
            {currentScreen === 'greetings' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliGreetingMaker />
              </div>
            )}

            {/* Screen: Traditional Herbal Remedies */}
            {currentScreen === 'herbal' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliHerbalRemedies />
              </div>
            )}

            {/* Screen 24: Translator (Mobile) */}
            {currentScreen === 'translator' && (
              <div className="h-full flex flex-col justify-between">
                <TranslatorModule compact />
              </div>
            )}

            {/* Screen 12: Daily Vocab Quiz (Mobile) */}
            {currentScreen === 'daily_quiz' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <DailyVocabQuiz compact onNavigateHome={() => setCurrentScreen('home')} />
              </div>
            )}

            {/* Screen 49: Social Media Cards & Posters */}
            {currentScreen === 'social_cards' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliSocialCardStudio />
              </div>
            )}

            {/* Screen 50: Lunar Calendar & Clock */}
            {currentScreen === 'lunar_calendar' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliLunarCalendarClock />
              </div>
            )}

            {/* Screen 51: Folk Song Karaoke & Rhythm Studio */}
            {currentScreen === 'sereng_karaoke' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliSerengKaraoke />
              </div>
            )}

            {/* Screen 52: Virtual Village Tour & Sacred Map */}
            {currentScreen === 'village_tour' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliVillageTour />
              </div>
            )}

            {/* Screen 53: Wild Foods & Nutrition */}
            {currentScreen === 'wild_foods' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliWildFoodsNutrition />
              </div>
            )}

            {/* Screen 54: Festival Greetings & WhatsApp Maker */}
            {currentScreen === 'festival_cards' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliGreetingMaker />
              </div>
            )}

            {/* Screen 55: Santali Folk Radio & Ambient Studio */}
            {currentScreen === 'folk_radio' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliFolkRadio />
              </div>
            )}

            {/* Screen 56: Ethno-Medicine & Emergency First Aid */}
            {currentScreen === 'ethno_medicine' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliEthnoMedicine />
              </div>
            )}

            {/* Screen 57: Multi-Script Transliteration Converter */}
            {currentScreen === 'script_converter' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliMultiScriptConverter />
              </div>
            )}

            {/* Screen 58: Kids Interactive Soundboard & Sound Quiz */}
            {currentScreen === 'kids_soundboard' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliKidsSoundboard />
              </div>
            )}

            {/* Screen 59: 9:16 Mobile Wallpaper & Status Studio */}
            {currentScreen === 'wallpaper_studio' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliWallpaperStudio />
              </div>
            )}

            {/* Screen 60: Clan & Family Heritage Archive */}
            {currentScreen === 'clan_genealogy' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliClanGenealogy />
              </div>
            )}

            {/* Screen 61: Village Haat & Barter Simulator */}
            {currentScreen === 'haat_barter' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliHaatBarterSimulator />
              </div>
            )}

            {/* Screen 62: Wedding Chants & Bapla Rituals Studio */}
            {currentScreen === 'bapla_chants' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliBaplaChantsStudio />
              </div>
            )}

            {/* Screen 63: Bird Lore & Ethno-Ornithology */}
            {currentScreen === 'bird_lore' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliBirdLoreEthnoOrnithology />
              </div>
            )}

            {/* Screen 64: Sika & Godna Body Art Studio */}
            {currentScreen === 'godna_body_art' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliGodnaBodyArt />
              </div>
            )}

            {/* Screen 65: Indigenous Heirloom Seeds & Bandhi */}
            {currentScreen === 'heirloom_seeds' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliIndigenousSeedsHeirloom />
              </div>
            )}

            {/* Screen 66: Kinship Greetings & Sacred Etiquette */}
            {currentScreen === 'kinship_etiquette' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliGreetingsEtiquetteSimulator />
              </div>
            )}

            {/* Screen 67: Instruments Orchestra & Loop Sequencer */}
            {currentScreen === 'instruments_orchestra' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliInstrumentsOrchestra />
              </div>
            )}

            {/* Screen 68: Indigenous Bone Setting & Herbal Trauma */}
            {currentScreen === 'bone_setting_healing' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliBoneSettingHealing />
              </div>
            )}

            {/* Screen 69: Lo Bir Baisi Supreme Customary Court */}
            {currentScreen === 'lo_bir_court' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliLoBirCourtSimulator />
              </div>
            )}

            {/* Screen 70: Ol Chiki Penmanship & Calligraphy Workbook */}
            {currentScreen === 'calligraphy_workbook' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliOlChikiPenmanshipWorkbook />
              </div>
            )}

            {/* Screen 71: Handi & Ranu Fermentation */}
            {currentScreen === 'handi_fermentation_lore' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliHandiFermentationLore />
              </div>
            )}

            {/* Screen 72: Ipil Sky Lore & Starmap */}
            {currentScreen === 'ipil_astronomy' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliIpilConstellationsAstronomy />
              </div>
            )}

            {/* Screen 73: Nahel & Dhenki Woodcraft */}
            {currentScreen === 'nahel_dhenki_craft' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliNahelDhenkiCraft />
              </div>
            )}

            {/* Screen 74: Kati Enech & Traditional Sports */}
            {currentScreen === 'indigenous_sports_kati' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliIndigenousSportsKati />
              </div>
            )}

            {/* Screen 75: Fishing Traps & Haku Ran */}
            {currentScreen === 'traditional_fishing_craft' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliTraditionalFishingCraft />
              </div>
            )}

            {/* Screen 76: Natural Earth Pigments & Murals */}
            {currentScreen === 'natural_pigments_craft' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliNaturalPigmentsCraft />
              </div>
            )}

            {/* Screen 77: Banam & Tamak Luthier */}
            {currentScreen === 'banam_tamak_luthier' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliBanamTamakLuthier />
              </div>
            )}

            {/* Screen 78: Jaher Sacred Grove Ecology */}
            {currentScreen === 'jaher_sacred_grove_ecology' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliJaherGroveEcology />
              </div>
            )}

            {/* Screen 79: Customary Oaths & Justice */}
            {currentScreen === 'customary_oaths_justice' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliCustomaryOathsJustice />
              </div>
            )}

            {/* Screen 80: Sasandiri Megaliths */}
            {currentScreen === 'sasandiri_megalithic_lore' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliSasandiriMegalithicLore />
              </div>
            )}

            {/* Screen 81: Indigenous Math & Geometry */}
            {currentScreen === 'indigenous_math_geometry' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliIndigenousMathGeometry />
              </div>
            )}

            {/* Screen 82: Wild Honey & Bee Lore */}
            {currentScreen === 'wild_honey_harvesting' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliWildHoneyHarvesting />
              </div>
            )}

            {/* Screen 83: Animal Omens & Bioacoustics */}
            {currentScreen === 'animal_behavior_omens' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliAnimalBehaviorOmens />
              </div>
            )}

            {/* Screen 84: Textile Dyes & Block Print */}
            {currentScreen === 'indigenous_textile_dyes' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliTextileDyesBlockPrint />
              </div>
            )}

            {/* Screen 85: Midwifery & Infant Care */}
            {currentScreen === 'indigenous_midwifery_care' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliMidwiferyCareLore />
              </div>
            )}

            {/* Screen 86: Universal Text & Audio Reader */}
            {currentScreen === 'universal_text_reader' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliUniversalTextReader />
              </div>
            )}

            {/* Screen 87: Karam Binti Oral Epic */}
            {currentScreen === 'karam_binti_epic_reader' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliKaramBintiEpic />
              </div>
            )}

            {/* Screen 88: Garh Epigraphy & Ancient Coins */}
            {currentScreen === 'epigraphy_numismatics_lore' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliEpigraphyNumismatics />
              </div>
            )}

            {/* Screen 89: Illustrated Visual Comics */}
            {currentScreen === 'illustrated_comics_reader' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliIllustratedComicsReader />
              </div>
            )}

            {/* Screen 90: Verb & Tense Conjugator */}
            {currentScreen === 'santali_verb_conjugator' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliVerbConjugator />
              </div>
            )}

            {/* Screen 91: Pera Hor & Literary Classics */}
            {currentScreen === 'pera_hor_literature' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliLiteraryArchives />
              </div>
            )}

            {/* Screen 92: Sagar Bullock Cart Engineering */}
            {currentScreen === 'sagar_bullock_cart' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliBullockCartCraft />
              </div>
            )}

            {/* Screen 93: Terracotta Pottery & Kiln */}
            {currentScreen === 'terracotta_pottery_lore' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliTerracottaPottery />
              </div>
            )}

            {/* Screen 94: Babui Rope, Patia & Ghonghu */}
            {currentScreen === 'babui_rope_mat_craft' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliFiberMatCraft />
              </div>
            )}

            {/* Screen 95: Livestock Care & Ethno-Veterinary */}
            {currentScreen === 'livestock_ethno_vet' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliLivestockEthnoVet />
              </div>
            )}

            {/* Screen 96: Muhurat & Almanac Checker */}
            {currentScreen === 'muhurat_almanac_checker' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliMuhuratAlmanac />
              </div>
            )}

            {/* Screen 97: SPT Act, PESA & Gram Sabha Rights */}
            {currentScreen === 'spt_pesa_rights_guide' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliSptPesaRights />
              </div>
            )}

            {/* Screen 98: Regional Dialect Switcher */}
            {currentScreen === 'santali_dialects_comparative' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliRegionalDialects />
              </div>
            )}

            {/* Screen 99: Anchoring & Public Speaking Kit */}
            {currentScreen === 'santali_anchoring_speeches' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliAnchoringSpeechKit />
              </div>
            )}

            {/* Screen 100: Tasar Silk Sericulture */}
            {currentScreen === 'tasar_silk_sericulture' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliTasarSericulture />
              </div>
            )}

            {/* Screen 101: Traditional Oil Press Kolhu */}
            {currentScreen === 'mahua_oil_press_kolhu' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliOilPressKolhu />
              </div>
            )}

            {/* Screen 102: Hendwa & Sun-Dried Preservation */}
            {currentScreen === 'sun_dried_forest_preservation' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliFoodPreservationLore />
              </div>
            )}

            {/* Screen 103: Donga Boat & River Lore */}
            {currentScreen === 'donga_boat_river_lore' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliDongaBoatLore />
              </div>
            )}

            {/* Screen 104: Aher-Pyne Water Governance */}
            {currentScreen === 'aher_pyne_water_governance' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliAherPyneWater />
              </div>
            )}

            {/* Screen 105: Forest Firebreak Ecology */}
            {currentScreen === 'bir_sengel_fire_ecology' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliForestFireEcology />
              </div>
            )}

            {/* Screen 106: Typing Speed & WPM Test */}
            {currentScreen === 'santali_typing_speed' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliTypingSpeedTest />
              </div>
            )}

            {/* Screen 107: Santali Pahada Tables */}
            {currentScreen === 'santali_pahada_tables' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliPahadaTables />
              </div>
            )}

            {/* Screen 108: Daily Streak & Goals Tracker */}
            {currentScreen === 'learning_streak_tracker' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliStreakTracker />
              </div>
            )}

            {/* Screen 109: Word Pinboard Sticky Notes */}
            {currentScreen === 'word_pinboard_notes' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliWordPinboard />
              </div>
            )}

            {/* Screen 110: Exam Prep Hub */}
            {currentScreen === 'santali_exam_prep_jpsc' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliExamPrepHub />
              </div>
            )}

            {/* Screen 111: Dictation Lab */}
            {currentScreen === 'santali_dictation_lab' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliDictationLab />
              </div>
            )}

            {/* Screen 112: Word Match Game */}
            {currentScreen === 'santali_word_match_game' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliWordMatchGame />
              </div>
            )}

            {/* Screen 113: Medical Translator */}
            {currentScreen === 'santali_medical_translator' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliMedicalTranslator />
              </div>
            )}

            {/* Screen 114: Gram Sabha Form Drafter */}
            {currentScreen === 'gram_sabha_form_drafter' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliGramSabhaDrafter />
              </div>
            )}

            {/* Screen 115: News Teleprompter Studio */}
            {currentScreen === 'santali_news_bulletin_studio' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliNewsTeleprompter />
              </div>
            )}

            {/* Screen 116: Data Backup & Restore */}
            {currentScreen === 'data_backup_manager' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliDataBackupManager />
              </div>
            )}

            {/* Screen 117: Tala & Rhythm Metronome */}
            {currentScreen === 'santali_tala_metronome' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliTalaMetronome />
              </div>
            )}

            {/* Screen 118: Instrument Pitch Tuner */}
            {currentScreen === 'santali_instrument_tuner' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliInstrumentTuner />
              </div>
            )}

            {/* Screen 119: Land & Soil Topography */}
            {currentScreen === 'santali_land_topography' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliLandTopography />
              </div>
            )}

            {/* Screen 120: Daily Micro-Journal */}
            {currentScreen === 'santali_micro_journal' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliMicroJournal />
              </div>
            )}

            {/* Screen 121: Riddles & Folk Wit Arena */}
            {currentScreen === 'santali_wit_riddles_arena' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliWitRiddlesArena />
              </div>
            )}

            {/* Screen 122: Dance Steps & Akhda Formation Guide */}
            {currentScreen === 'dance_akhda_formations' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliDanceAkhdaGuide />
              </div>
            )}

            {/* Screen 123: Grammar & Suffix Checker */}
            {currentScreen === 'santali_grammar_checker' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliGrammarChecker />
              </div>
            )}

            {/* Screen 124: Santali Crossword Grid */}
            {currentScreen === 'santali_crossword_puzzle' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliCrosswordGame />
              </div>
            )}

            {/* Screen 125: Wildlife & Flora Quiz */}
            {currentScreen === 'wildlife_flora_quiz' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliWildlifeFloraQuiz />
              </div>
            )}

            {/* Screen 126: Invitation & Certificate Studio */}
            {currentScreen === 'invitation_certificate_maker' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliInvitationCertificateStudio />
              </div>
            )}

            {/* Screen 127: Sentence Scramble Builder */}
            {currentScreen === 'sentence_scramble_builder' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliSentenceScramble />
              </div>
            )}

            {/* Screen 128: Poetry & Sereng Studio */}
            {currentScreen === 'poetry_sereng_studio' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliPoetryRhymeStudio />
              </div>
            )}

            {/* Screen 129: Pocket Study Booklet Maker */}
            {currentScreen === 'pocket_study_booklet' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliPocketBookletMaker />
              </div>
            )}

            {/* Screen 130: Clan & Kinship Checker */}
            {currentScreen === 'clan_kinship_checker' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliClanKinshipChecker />
              </div>
            )}

            {/* Screen 131: Civic & Bank Dialogue Kit */}
            {currentScreen === 'civic_bank_dialogue_kit' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliCivicBankDialogue />
              </div>
            )}

            {/* Screen 132: Haat & Festival Market Planner */}
            {currentScreen === 'haat_festival_planner' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliHaatFestivalPlanner />
              </div>
            )}

            {/* Screen 133: Santali Word Search Grid */}
            {currentScreen === 'santali_word_search_puzzle' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliWordSearchGame />
              </div>
            )}

            {/* Screen 134: Audio Memory Flip Game */}
            {currentScreen === 'audio_memory_flip_game' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliAudioMemoryGame />
              </div>
            )}

            {/* Screen 135: Village Layout & Sacred Landmark Map */}
            {currentScreen === 'village_layout_landmark_map' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliVillageLayoutMap />
              </div>
            )}

            {/* Screen 136: Daily Current Affairs 2026 */}
            {currentScreen === 'daily_current_affairs' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <DailyCurrentAffairs2026 />
              </div>
            )}

            {/* Screen 137: Native Voice Recorder */}
            {currentScreen === 'native_voice_recorder' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliNativeVoiceRecorder />
              </div>
            )}

            {/* Screen 138: 2-Player Quiz Battle */}
            {currentScreen === 'two_player_battle' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliTwoPlayerQuizBattle />
              </div>
            )}

            {currentScreen === 'roleplay_conversation' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliRoleplaySimulator />
              </div>
            )}

            {currentScreen === 'family_tree_builder' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliFamilyTreeBuilder />
              </div>
            )}

            {currentScreen === 'teacher_worksheet_maker' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliTeacherWorksheetMaker />
              </div>
            )}

            {currentScreen === 'chhatiar_name_studio' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliChhatiarNameStudio />
              </div>
            )}

            {currentScreen === 'audio_playlist_player' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliAudioPlaylistPlayer />
              </div>
            )}

            {currentScreen === 'community_hall_of_fame' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliCommunityHallOfFame />
              </div>
            )}

            {currentScreen === 'offline_pack_manager' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliOfflinePackManager />
              </div>
            )}

            {currentScreen === 'smart_essay_writer' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliSmartWriter />
              </div>
            )}

            {currentScreen === 'emergency_voice_cards' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliEmergencyVoiceCards />
              </div>
            )}

            {currentScreen === 'weekly_bulletin_maker' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliWeeklyBulletinMaker />
              </div>
            )}

            {currentScreen === 'kids_storybook_maker' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliKidsStorybookMaker />
              </div>
            )}

            {currentScreen === 'tense_suffix_drill' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliTenseSuffixDrill />
              </div>
            )}

            {currentScreen === 'krishi_crop_ledger' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliKrishiCropLedger />
              </div>
            )}

            {currentScreen === 'qr_word_cards' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliQrWordCards />
              </div>
            )}

            {currentScreen === 'santali_pronoun_case_lab' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliPronounCaseLab />
              </div>
            )}

            {currentScreen === 'santali_bazaar_price_calc' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliBazaarPriceCalc />
              </div>
            )}

            {currentScreen === 'santali_school_prayer_assembly' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliSchoolPrayerAssembly />
              </div>
            )}

            {currentScreen === 'santali_panchayat_scheme_guide' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliPanchayatSchemeGuide />
              </div>
            )}

            {currentScreen === 'santali_bus_rail_helpline' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliBusRailHelpline />
              </div>
            )}

            {currentScreen === 'santali_audio_listening_test' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliAudioListeningTest />
              </div>
            )}

            {currentScreen === 'santali_song_lyric_builder' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliSongLyricBuilder />
              </div>
            )}

            {currentScreen === 'santali_jora_katha_lab' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliJoraKathaLab />
              </div>
            )}

            {currentScreen === 'santali_question_negation_lab' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliQuestionNegationLab />
              </div>
            )}

            {currentScreen === 'santali_spell_fix_lab' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliSpellFixLab />
              </div>
            )}

            {currentScreen === 'santali_shg_savings_ledger' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliShgSavingsLedger />
              </div>
            )}

            {currentScreen === 'santali_maternal_child_health' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliMaternalChildHealth />
              </div>
            )}

            {currentScreen === 'santali_report_card_maker' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliReportCardMaker />
              </div>
            )}

            {currentScreen === 'santali_literary_pioneers' && (
              <div className="h-full flex flex-col justify-between overflow-y-auto p-2">
                <SantaliLiteraryPioneers />
              </div>
            )}
            </Suspense>
          </div>

          {/* Bottom Navigation Bar */}
          <div className="bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-between text-[10px] font-semibold text-slate-500 shrink-0">
            <button
              onClick={() => setCurrentScreen('home')}
              className={`flex flex-col items-center gap-0.5 ${
                currentScreen === 'home' ? 'text-sky-600' : 'hover:text-slate-900'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setCurrentScreen('daily_quiz')}
              className={`flex flex-col items-center gap-0.5 ${
                currentScreen === 'daily_quiz' ? 'text-amber-600 font-bold' : 'hover:text-slate-900'
              }`}
            >
              <Flame className="w-4 h-4 text-orange-500" />
              <span>Daily Quiz</span>
            </button>

            <button
              onClick={() => setCurrentScreen('learn')}
              className={`flex flex-col items-center gap-0.5 ${
                currentScreen === 'learn' ? 'text-sky-600' : 'hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Learn</span>
            </button>

            <a
              href={SANTALI_KEYBOARD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-0.5 hover:text-slate-900"
            >
              <KeyboardIcon className="w-4 h-4" />
              <span>Keyboard</span>
            </a>

            <button
              onClick={() => setCurrentScreen('dictionary')}
              className={`flex flex-col items-center gap-0.5 ${
                currentScreen === 'dictionary' ? 'text-sky-600' : 'hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Dictionary</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
