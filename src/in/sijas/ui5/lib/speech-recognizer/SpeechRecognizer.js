sap.ui.define([
		"sap/ui/base/Object",
		"sap/m/BusyDialog",
		"sap/base/Log",
		"sap/ui/model/json/JSONModel"
	],
	function (BaseObject, BusyDialog, Log, JSONModel) {
		return BaseObject.extend("SpeechRecognizer", {
			TIMEOUT_MILLISECONDS: 5000,
			registeredCommand: {},
			registeredButtons: [],
			oComponent: null,
			busyDialog: new BusyDialog({
				text: "Listening to Sound",
				title: "Detecting Voice"
			}),
			constructor: function (oComponent, bTurnOnAssistant) {
				if (oComponent instanceof sap.ui.core.UIComponent) {
					this.oComponent = oComponent;
					this.bTurnOnAssistant = bTurnOnAssistant;
					this.oComponent.setModel(new JSONModel({
						bTurnOnAssistant: bTurnOnAssistant
					}), "assistant");
					if ("webkitSpeechRecognition" in window) {
						this.Commander = new window.webkitSpeechRecognition();
						this.Commander.continuous = true;
						this.Commander.interimResults = true;
						this.Commander.lang = "en-IN";
						var finalTranscripts = "";
						this.Commander.onstart = function () {
							finalTranscripts = "";
						}.bind(this);
						this.Commander.onend = function () {
							finalTranscripts = "";
						}.bind(this);

						this.Commander.onresult = function (event) {
							var interimTranscripts = "";
							for (var i = event.resultIndex; i < event.results.length; i++) {
								var transcript = event.results[i][0].transcript;
								transcript.replace("\n", "<br>");
								if (event.results[i].isFinal) {
									finalTranscripts += transcript;
								} else {
									interimTranscripts += transcript;
								}
								if (finalTranscripts.toUpperCase().search("HELLO ASSISTANT") >= 0 || interimTranscripts.toUpperCase().search("HELLO ASSISTANT") >=
									0) {
									finalTranscripts = "";
									interimTranscripts = "";
									this.callListener();
								}
							}
						}.bind(this);
					}
					if (bTurnOnAssistant) {
						this.Commander.start();
					}
				} else {
					Log.error("Speech Recognizer: Component Instance not found in SpeechRecognizer Constructor");
				}
			},
			setBusyDialogTexts: function (title, text) {
				this.busyDialog.setTitle(title);
				this.busyDialog.setText(text);
			},
			whenSpeechRecognized: function () {
				return new Promise(function (fnSuccess) {
					if ("webkitSpeechRecognition" in window) {
						var speechRecognizer = new window.webkitSpeechRecognition();
						speechRecognizer.continuous = false;
						speechRecognizer.interimResults = true;
						speechRecognizer.lang = "en-IN";
						var finalTranscripts = "";
						speechRecognizer.onstart = function () {
							if (this.Commander && this.bTurnOnAssistant) {
								this.Commander.stop();
							}
							this.busyDialog.setText("Listening to Sound");
							this.busyDialog.open();
						}.bind(this);
						speechRecognizer.onend = function () {
							if (this.Commander && this.bTurnOnAssistant) {
								this.Commander.start();
							}
							this.busyDialog.close();
							this.busyDialog.setText(finalTranscripts);
							fnSuccess(finalTranscripts);
						}.bind(this);
						speechRecognizer.onresult = function (event) {
							var interimTranscripts = "";
							for (var i = event.resultIndex; i < event.results.length; i++) {
								var transcript = event.results[i][0].transcript;
								transcript.replace("\n", "<br>");
								if (event.results[i].isFinal) {
									finalTranscripts += transcript;
								} else {
									interimTranscripts += transcript;
								}
								this.busyDialog.setText(interimTranscripts);
							}
						}.bind(this);
						speechRecognizer.start();
					}
				}.bind(this));
			},
			registerCallButton: function (oButton) {
				this.addListener(oButton, false, null);
				oButton.attachPress(this.callListener.bind(this));
			},
			registerCommandWithParam: function (sCommand, fnCallback) {
				var sUpperCommand = sCommand.toUpperCase();
				this.registeredCommand[sUpperCommand] = {
					withArgs: true,
					fnCallback: fnCallback
				};
			},
			registerCommandWithOutParam: function (sCommand, fnCallback) {
				var sUpperCommand = sCommand.toUpperCase();
				this.registeredCommand[sUpperCommand] = {
					withArgs: false,
					fnCallback: fnCallback
				};
			},
			callCommands: function (sVoiceAsText) {
				var aCommands = Object.keys(this.registeredCommand);
				aCommands.forEach(function (sCommand) {
					if (sVoiceAsText.toUpperCase().search(sCommand) === 0) {
						var oCommand = this.registeredCommand[sCommand],
							iCommandPosition = sCommand.length,
							sParamString = sVoiceAsText.substring(iCommandPosition + 1, sVoiceAsText.length);
						if (oCommand.withArgs) {
							oCommand.fnCallback(sParamString);
						} else {
							oCommand.fnCallback();
						}
					}
				}.bind(this));
			},
			addListener: function (oButton, bWithArg, fnCallback) {
				var oListener = {
					oButton: oButton,
					bWithArg: bWithArg,
					fnCallback: fnCallback
				};
				this.registeredButtons.push(oListener);
			},
			callListener: function (oEvt) {
				var oSource = oEvt && oEvt.getSource(),
					fnCallBack = this.callCommands.bind(this);
				this.registeredButtons.forEach(function (oListener) {
					if (oListener === oSource && oListener.fnCallback) {
						fnCallBack = oListener.fnCallback;
					}
				});
				this.whenSpeechRecognized().then(fnCallBack);
			}
		});
	});