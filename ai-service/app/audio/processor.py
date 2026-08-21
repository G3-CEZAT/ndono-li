import io
import logging
from typing import Dict, Any, Optional
import google.generativeai as genai
from app.config import settings

logger = logging.getLogger(__name__)

if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

def transcribe_audio_bytes(
    audio_bytes: bytes,
    mime_type: str = "audio/mpeg"
) -> Dict[str, Any]:
    """
    Transcrit un enregistrement audio (vocal de pèlerin ou sermon d'érudit)
    en utilisant les capacités multimodales natives de Gemini 1.5 Flash.
    Gère le Wolof, le Français et les termes religieux en Arabe.
    """
    if not settings.GEMINI_API_KEY:
        return {
            "transcription": "[Mode Simulation - Clé Gemini requise] Transcription simulée de l'enregistrement audio.",
            "detected_language": "fr",
            "summary": "Résumé de l'audio"
        }

    try:
        model = genai.GenerativeModel(settings.GEMINI_MODEL)
        
        prompt = """Tu es un expert linguiste et transcripteur spécialisé dans les contextes religieux islamiques et spirituels (Sénégal/Afrique de l'Ouest).
Tâche :
1. Transcris fidèlement et intégralement cet audio.
2. Respecte scrupuleusement les termes religieux en Wolof (ex: ndigël, sant yalla, diine, serigne), en Arabe (ex: salat, djanaza, zakat, wird) ou en Français.
3. Détecte la langue principale ('wo' pour wolof, 'fr' pour français).
4. Fournis un bref résumé en une phrase.

Réponds STRICTEMENT sous ce format :
LANG: <fr ou wo>
SUMMARY: <bref résumé>
TRANSCRIPTION:
<texte intégral transcrit>"""

        audio_part = {
            "mime_type": mime_type,
            "data": audio_bytes
        }

        response = model.generate_content([prompt, audio_part])
        text = response.text.strip()

        detected_lang = "fr"
        summary = ""
        transcription_lines = []
        is_transcription_part = False

        for line in text.splitlines():
            if line.startswith("LANG:"):
                detected_lang = line.replace("LANG:", "").strip().lower()
            elif line.startswith("SUMMARY:"):
                summary = line.replace("SUMMARY:", "").strip()
            elif line.startswith("TRANSCRIPTION:"):
                is_transcription_part = True
            elif is_transcription_part:
                transcription_lines.append(line)

        transcription = "\n".join(transcription_lines).strip()
        if not transcription:
            transcription = text

        return {
            "transcription": transcription,
            "detected_language": detected_lang,
            "summary": summary
        }
    except Exception as e:
        logger.error(f"Erreur lors de la transcription audio: {e}")
        raise RuntimeError(f"Échec de traitement de l'audio: {str(e)}")
