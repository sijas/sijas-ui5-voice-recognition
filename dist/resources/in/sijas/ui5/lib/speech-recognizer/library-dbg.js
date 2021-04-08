/*
 * openui5-speech-recogniser
 * (c) Copyright 2020-2021 Mohammed Sijas
 * Licensed under the MIT license. See LICENSE file in the project root for full license information.
 */

sap.ui.define([
  'sap/ui/core/library'
], function() {
  'use strict';

  /**
   * OpenUI5 library: in.sijas.ui5.lib.speech-recognizer
   *
   * @namespace
   * @name openui5.model.json.crud
   * @author Mauricio Lauffer
   * @version 1.0.3
   * @public
   */
  return sap.ui.getCore().initLibrary({
    name: 'in.sijas.ui5.lib.speech-recognizer',
    dependencies: [
      'sap.ui.core',
      "sap.m"
    ],
    controls: [
      'in.sijas.ui5.lib.speech-recognizer.SpeechRecognizer'
    ],
    noLibraryCSS: true,
    version: '1.0.3'
  });
});