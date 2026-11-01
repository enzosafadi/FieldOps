# Voice-assisted technician reporting

## Workflow

1. Open Repairs and select the repair/client and issue to document.
2. Choose English (Canada) or French (Canada), then Start dictation. Grant microphone access if prompted.
3. Speak notes, then Stop dictation. Edit the preview and verify technical vocabulary, names, measurements and facts.
4. Select the destination field and Insert reviewed text. Existing field content is preserved and the new text is appended. Oversized text is rejected without truncation.
5. Complete the required work and client-impact fields, then explicitly save the technician update. The existing versioned issue journal and backup behavior apply.

## Compatibility and data

Uses browser SpeechRecognition/webkitSpeechRecognition over HTTPS or localhost, not an Azure subscription. API presence is not a guarantee that a browser's recognition provider or selected language is available. Permission and service errors show a typing fallback. Speech may require an internet connection and may be processed by the browser vendor's remote provider. FieldOps does not record or retain audio. Use fictional data in this portfolio demo.

Dictation is stopped when navigating to another workspace, changing the selected record, hiding the page, or leaving it. Unsaved previews and form edits are not persisted across navigation. Only finalized recognition results enter the preview; audio not yet transcribed may be lost on interruption. This release supports live microphone dictation, not uploading an existing audio recording, translation, or generative report writing.

## Acceptance and measurement

Automated controller tests cover review-before-insertion, deduplication, append behavior, overflow, permission denial, cleanup, retry and unsupported-browser fallback. The original release browser attempt failed because the browser download failed. A November 1 follow-up inspected the controls and verified manually entered preview insertion plus explicit report save; the HTTP preview blocks live dictation. Actual microphone accuracy, accents, noisy workspaces and English/French provider availability require a manual device trial.

Pilot KPI: compare active report composition plus review time against typed reporting while checking completeness, factual corrections and technician acceptance. No timer or measured savings is claimed in this release.

