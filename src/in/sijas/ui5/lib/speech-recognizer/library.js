/*
 * ${copyright}
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
   * @version ${version}
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
    version: '${version}'
  });
});