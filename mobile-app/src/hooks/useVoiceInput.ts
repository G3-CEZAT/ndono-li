import { useCallback, useEffect, useRef, useState } from "react";
import {
  AudioModule,
  RecordingPresets,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
} from "expo-audio";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";

export type VoiceInputStatus = "idle" | "requesting-permission" | "recording" | "paused" | "denied";

const DEBUG_FILE_NAME = "test.m4a";

// Copie de debug utile pour vérifier hors app que l'enregistrement a bien fonctionné.
// Le fichier vit dans le stockage sandboxé de l'app (impossible d'écrire directement
// sur le disque du PC depuis le téléphone) ; utiliser shareDebugRecording() pour l'exporter.
function saveDebugCopy(sourceUri: string) {
  try {
    const source = new File(sourceUri);
    const destination = new File(Paths.document, DEBUG_FILE_NAME);
    if (destination.exists) destination.delete();
    source.copy(destination);
    console.log(`[voice-debug] Enregistrement copié dans ${destination.uri}`);
  } catch (err) {
    console.warn("[voice-debug] Échec de la copie de test.m4a", err);
  }
}

// Encapsule la mécanique d'enregistrement micro : start/pause/resume/stop/cancel,
// ainsi que la prévisualisation audio pendant la pause (réécoute avant envoi).
//
// pause()/record() (natif MediaRecorder/AVAudioRecorder) suspendent et reprennent la
// MÊME prise sans la réinitialiser : il ne faut surtout pas rappeler prepareToRecordAsync()
// avant de reprendre, sous peine de repartir sur un nouvel enregistrement vide.
// Le fichier n'est finalisé (en-tête audio valide, lecture fiable) qu'au vrai stop().
//
// L'envoi au backend (transcription + réponse RAG) est géré par useChat, via voiceService.
export function useVoiceInput() {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const previewPlayer = useAudioPlayer();
  const previewStatus = useAudioPlayerStatus(previewPlayer);

  const [status, setStatus] = useState<VoiceInputStatus>("idle");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  const startTimer = () => {
    timerRef.current = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
  };

  useEffect(() => clearTimer, []);

  const startRecording = useCallback(async () => {
    setStatus("requesting-permission");
    const permission = await AudioModule.requestRecordingPermissionsAsync();
    if (!permission.granted) {
      setStatus("denied");
      return false;
    }
    await recorder.prepareToRecordAsync();
    recorder.record();
    setStatus("recording");
    setElapsedSeconds(0);
    startTimer();
    return true;
  }, [recorder]);

  // Pause réelle (pas une finalisation) : la prise en cours est suspendue, pas fermée.
  const pauseRecording = useCallback(() => {
    if (status !== "recording") return;
    clearTimer();
    recorder.pause();
    setStatus("paused");
  }, [recorder, status]);

  // Reprend la MÊME prise là où elle s'est arrêtée. Ne jamais rappeler
  // prepareToRecordAsync() ici : ça réinitialiserait l'enregistrement à zéro.
  const resumeRecording = useCallback(() => {
    if (status !== "paused") return;
    if (previewStatus.playing) previewPlayer.pause();
    recorder.record();
    startTimer();
    setStatus("recording");
  }, [recorder, status, previewPlayer, previewStatus.playing]);

  // Écoute best-effort de la prise en pause : le fichier n'étant pas encore finalisé,
  // certains lecteurs peuvent avoir du mal à le décoder correctement selon l'appareil.
  const togglePreviewPlayback = useCallback(() => {
    if (status !== "paused" || !recorder.uri) return;
    if (previewStatus.playing) {
      previewPlayer.pause();
      return;
    }
    previewPlayer.replace(recorder.uri);
    previewPlayer.play();
  }, [status, recorder.uri, previewPlayer, previewStatus.playing]);

  const stopRecording = useCallback(async (): Promise<string | null> => {
    if (status !== "recording" && status !== "paused") return null;
    clearTimer();
    if (previewStatus.playing) previewPlayer.pause();
    await recorder.stop();
    if (recorder.uri) saveDebugCopy(recorder.uri);
    setStatus("idle");
    return recorder.uri ?? null;
  }, [recorder, status, previewPlayer, previewStatus.playing]);

  const cancelRecording = useCallback(async () => {
    if (status !== "recording" && status !== "paused") return;
    clearTimer();
    if (previewStatus.playing) previewPlayer.pause();
    await recorder.stop();
    setStatus("idle");
    setElapsedSeconds(0);
  }, [recorder, status, previewPlayer, previewStatus.playing]);

  // Exporte test.m4a hors du bac à sable de l'app (email, Drive, etc.) pour vérification sur PC.
  const shareDebugRecording = useCallback(async () => {
    const debugFile = new File(Paths.document, DEBUG_FILE_NAME);
    if (!debugFile.exists) return;
    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) return;
    await Sharing.shareAsync(debugFile.uri, { mimeType: "audio/m4a" });
  }, []);

  return {
    status,
    isRecording: status === "recording",
    isPaused: status === "paused",
    isPreviewPlaying: previewStatus.playing,
    elapsedSeconds,
    startRecording,
    pauseRecording,
    resumeRecording,
    togglePreviewPlayback,
    stopRecording,
    cancelRecording,
    shareDebugRecording,
  };
}
