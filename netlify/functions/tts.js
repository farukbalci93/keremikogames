exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { text, langCode, voiceName } = JSON.parse(event.body);
  const apiKey = process.env.GOOGLE_TTS_KEY;

  const response = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { text },
        voice: {
          languageCode: langCode || 'en-US',
          name: voiceName || 'en-US-Neural2-F',
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: 0.85,
          pitch: 2.0
        }
      })
    }
  );

  const data = await response.json();

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ audioContent: data.audioContent })
  };
};
