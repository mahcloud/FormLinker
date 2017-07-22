"use strict";

var Translator = {
  defaultLanguageKey: null,
  defaultLanguageLibrary: null,

  language: null,

  languages: {},

  changeLanguage: function changeLanguage(language) {
    if (this.languages.hasOwnProperty(language)) {
      this.language = language;
    } else {
      this.language = this.defaultLanguageKey;
    }
  },
  findTranslation: function findTranslation(translation, id) {
    var idPieces = id.split(".");

    for (var i = 0; i < idPieces.length; i++) {
      var piece = idPieces[i];
      if (this.isNil(translation[piece])) {
        return null;
      } else {
        translation = translation[piece];
      }
    }

    return translation;
  },
  isNil: function isNil(value) {
    return value === null || typeof value === "undefined";
  },
  registerDefaultLanguage: function registerDefaultLanguage(key, library) {
    this.defaultLanguageKey = key;
    this.defaultLanguageLibrary = library;
    if (this.language === null) {
      this.language = this.defaultLanguageKey;
    }
    this.registerLanguage(key, library);
  },
  registerLanguage: function registerLanguage(key, library) {
    var languages = this.languages;
    languages[key] = library;
    this.languages = languages;
  },
  translate: function translate(id) {
    var values = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var library = this.getLibrary();
    if (typeof library === "undefined") {
      return id;
    }

    var translation = this.findTranslation(library, id);

    // defaults
    if (this.isNil(translation) && this.language !== this.defaultLanguageKey) {
      translation = this.findTranslation(this.getLibrary(this.defaultLanguageKey), id);
    }
    if (this.isNil(translation)) {
      translation = id;
    }

    // interpolate
    for (var key in values) {
      translation = translation.split("${" + key + "}").join(values[key]);
    }

    return translation;
  },
  getLibrary: function getLibrary() {
    var language = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.language;

    return this.languages[language];
  }
};

module.exports = Translator;