# Current Translations // Translators

***

* **English** // *Mattheous*
* **Spanish (Spain)** // *Mattheous*
* **Portugese (Portugal)** // *Tweeno*
* **French (France)** // *Dragon1320*
* **Chinese** // *Tweek Tweak*
* **Polish** // *Phinbella Flynn*
* **Romanian** // *FoxReed*
* **German** // *Kamui, MrCartmanez90*
* **Irish** // *Dragon1320*

# Why should I translate?

***
If you want to see your mother tongue on our site instead of English, want to spite other versions of your language, *(I'm looking at your PT-PT and PT-BR)*, or just want to be a kool kid, then please feel free. It shouldn't take too long to do.

**All you have to do is ping Mattheous on the Feinwaru Discord and say "yo i wanna translate x".**

# How to Translate

***
When translating, you will be given a JSON which contains all of the text that is on the website. Yes, there is a lot. Most of it is just singular words, but some phrases may need to be changed to fit your language.

So how do I do this then,

## 1. Receive the JSON
This JSON will contain a field that contains the version of the translation file.

## 2. Copy the JSON into a text-editor or IDE
We recommend Visual Studio Code, Nodepad++ or Atom.

## 3. Replace with your language
Now all you have to do is replace the translations to the right of the colon. In other words, the ones that aren't in all caps with underscores.

Example;

```json
{
  "HOME": "Home",
  "DASHBOARD": "Dashboard",
  "COMMANDS": "Commands",
}
```

When translated into Spanish, This turns into:

```json
{
  "HOME": "Casa",
  "DASHBOARD": "Tablero",
  "COMMANDS": "Comandos",
}
```

# Noted Idioms and Translation Difficulties

***

### 1. Markdown
You may find some translations that contain `**` or `*` around text. This is for bolding and italicising text. Feel free to put these around whatever text you feel is appropriate for your language.

### 2. PROFILES_DESC
As you can see, we reference Donald Trump and Kim Jon Un. We would like it if you took two of your political figures or people in your culture that you think would be appropriate to make fun of.

Example: In Romanian, This has been changed to : `Klaus Iohannis şi Liviu Dragnea`

### 3. MARKETPLACE_DESC
We use the term `AWESOM-O's packing!`. We don't literally mean he is in a factory packing things, we mean AWESOM-O has a lot of features. So use whatever idiom or phrase you would use in your language to say he has a lot of things.

### 4. Anything with `${js_variables}` or `<html>`
Please ignore these and translate the text around them, these are just for variables that are inserted into the language to make it flow better as not every language is the same.

eg. For **PLAN_QUOTA**, translate what's in bold:

**You are currently using** *<span class='feinwaru-text'>${quota.current}</span>* **of** *<span class='feinwaru-text'>${quota.total}</span>* **total servers included in your plan**