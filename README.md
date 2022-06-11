# Discord Translate
A bot that uses the Google Translate API to translate both user-provided strings (through commands) and contents of other messages (through context menus) to any language that Google Translate supports.

## Features
### /translatestring
This is a slash command that can be run in chat, allowing the user to translate any string they desire to any language Google Translate supports.

__Params__
- input: The string to be translated
- translateto: Language to be translated to
- *translatefrom (Optional): Language to be translated from. This is typically auto-detected by Translate, but can be filled in case A) the incorrect language is detected at first or B) the language to translate from might be ambiguous*

__Example__
![ts](https://i.imgur.com/I7hCFLJ.gif)

### translatemessage
This is a command that can be run from a context menu, allowing the user to translate the contents of a previously-sent message to any language Google Translate supports.

__Params__
- Language to translate message to
- *(Optional): Language to be translated from. This is typically auto-detected by Translate, but can be filled in case A) the incorrect language is detected at first or B) the language to translate from might be ambiguous*
- *The contents of the message to be translated are auto-filled, but can be changed if desired*

__Example__
![tm](https://i.imgur.com/aUSkr9h.gif)

## Other Notes
- Languages can be inputted via the full name (i.e. German, English, French) or by their two-character initial which Googles uses (i.e. de, en, fr)

## Libs used
- discord.js
- fs
- @vitalets/google-translate-api (a fork of the deprecated google-translate-api npm package by matheuss)

## Future changes?
- [ ] Use DeepL instead; way more accurate