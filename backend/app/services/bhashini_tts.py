"""
Bhashini Indian Language TTS & Voice Integration Service.
Supports Hindi (hi), Marathi (mr), and English (en).
Connects to Digital India Bhashini API with seamless Web Speech API / synthesis fallback.
"""

import os
import json
import logging
from typing import Dict, Any, Optional
import httpx

logger = logging.getLogger("kabadiwala.bhashini")

BHASHINI_API_KEY = os.getenv("BHASHINI_API_KEY", "")
BHASHINI_USER_ID = os.getenv("BHASHINI_USER_ID", "")
BHASHINI_PIPELINE_URL = os.getenv("BHASHINI_PIPELINE_URL", "https://dhruva-api.bhashini.gov.in/services/inference/pipeline")


async def synthesize_speech_bhashini(text: str, language: str = "hi", gender: str = "female") -> Dict[str, Any]:
    """
    Synthesizes speech using Bhashini's Indic TTS endpoint.
    If API key is not configured or network call fails, returns structured fallback
    with native browser Web Speech API parameters.
    """
    lang_code = language.strip().lower()
    if lang_code not in ["hi", "mr", "en"]:
        lang_code = "hi"

    # If Bhashini API key is configured, call the inference pipeline
    if BHASHINI_API_KEY and BHASHINI_USER_ID:
        try:
            headers = {
                "Authorization": BHASHINI_API_KEY,
                "userID": BHASHINI_USER_ID,
                "Content-Type": "application/json"
            }
            payload = {
                "pipelineTasks": [
                    {
                        "taskType": "tts",
                        "config": {
                            "language": {
                                "sourceLanguage": lang_code
                            },
                            "gender": gender,
                            "samplingRate": 22050
                        }
                    }
                ],
                "inputData": {
                    "input": [
                        {
                            "source": text
                        }
                    ]
                }
            }

            async with httpx.AsyncClient(timeout=6.0) as client:
                res = await client.post(BHASHINI_PIPELINE_URL, json=payload, headers=headers)
                if res.status_code == 200:
                    data = res.json()
                    pipeline_res = data.get("pipelineResponse", [])
                    if pipeline_res and len(pipeline_res) > 0:
                        audio_list = pipeline_res[0].get("audio", [])
                        if audio_list and len(audio_list) > 0:
                            audio_b64 = audio_list[0].get("audioContent")
                            if audio_b64:
                                return {
                                    "success": True,
                                    "engine": "BHASHINI_INDIC_TTS",
                                    "language": lang_code,
                                    "text": text,
                                    "audio_base64": audio_b64,
                                    "audio_format": "wav"
                                }
        except Exception as e:
            logger.warning(f"Bhashini API request failed, switching to native fallback: {e}")

    # Seamless client-side speech synthesis fallback
    return {
        "success": True,
        "engine": "WEB_SPEECH_SYNTHESIS_FALLBACK",
        "language": lang_code,
        "lang_tag": "hi-IN" if lang_code == "hi" else ("mr-IN" if lang_code == "mr" else "en-IN"),
        "text": text,
        "audio_base64": None,
        "instructions": "Use window.speechSynthesis in browser for native offline Indic voice readout."
    }
