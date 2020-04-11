const testData = {
	"SAT" : {
		dates : [
			{ value : "August 25", available : true },
			{ value : "October 6", available : true },
			{ value : "November 3", available : true },
			{ value : "December 1", available : true },
			{ value : "March 9", available : true },
			{ value : "May 4", available : true },
			{ value : "June 1", available : true },
		],
		startingScore : {
			value : [
				850, 900, 950, 1000, 1050, 1100, 1150, 1200, 1250, 1300, 1350, 1400, 1450, 1500, 1550
			],
			note : null
		}
	},
	"ACT" : {
		dates : [
			{ value : "September 8", available : true },
			{ value : "October 27", available : true },
			{ value : "December 8", available : true },
			{ value : "February 9", available : true },
			{ value : "April 13", available : true },
			{ value : "June 8", available : true },
		],
		startingScore : {
			value : [
				18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34
			],
			note : null
		},
	},
	"SSAT" : {
		dates : [
			{ value : "October 13", available : true },
			{ value : "November 10", available : true },
			{ value : "December 8", available : true },
			{ value : "January 5", available : true },
			{ value : "February 2", available : true },
			{ value : "March 2", available : false },
			{ value : "April 27", available : false },
			{ value : "June 8", available : true },
		],
		startingScore : {
			value : [ '80-89%', '70-79%', '60-69%', '50-59%' ],
			note : 'Note: Students who have scored under the 50th percentile may be strongly encouraged to complete ' +
				   'several months of academic tutoring at Illini Tutoring before beginning a test prep package.',
		},
	}
};
const hoursToChoose = [ 12, 18, 24, 30 ];

const testNames = Object.keys(testData);
const dateAvailabilityAttr = 'data-date-availability';
const testNameAttr = 'data-test-name';
const testDateButtonAttrPostfix = '-date-buttons';
const testStartingScoreAttrPostfix = '-starting-score';

(function insertTestButtons() {
	let testNodes = '<div>';
	for (let testName of testNames) {
		testNodes += `
				<a class="wsite-button">
					<span id="${testName.toLowerCase()}" 
							class="wsite-button-inner" 
							onclick="onTestSelected(event)">
						${testName.toUpperCase()}
					</span>
				</a>`;

	}
	testNodes += '</div>';
	document.getElementById("question-one-which-test").insertAdjacentHTML('beforeend', testNodes);
})();
(function insertTestDateButtons() {
	for (const test of testNames) {
		const testTagPrefix = convertTextToTag(test);
		let testDates = `<div class="width-bracket" id="${testTagPrefix + testDateButtonAttrPostfix}" hidden>`;
		for (let testDate of testData[test].dates) {
			const date = testDate.value;
			const dateTag = convertTextToTag(date);
			testDates += `<a class="wsite-button">
							<span id="${dateTag}" 
								${dateAvailabilityAttr}="${testDate.available}" 
								${testNameAttr}="${test}"
								class="wsite-button-inner"
								onclick="onDateSelected(event)">${date}
							</span>
						  </a>`;
		}
		testDates += '</div>';
		document.getElementById('question-two-which-date').insertAdjacentHTML('beforeend', testDates);
	}
})();
(function insertHoursToChoose() {
	let hoursNode = '<div class="exam-calc">';
	for (const hour of hoursToChoose) {
		hoursNode += `<a class="wsite-button">
						<span id="${hour}" class="wsite-button-inner">${hour}</span>
					  </a>`
	}
	hoursNode += '</div>';
	document.getElementById('hours').insertAdjacentHTML('beforeend', hoursNode);
})();
(function insertTestStartingScore() {
	for (const test of testNames) {
		const testTagPrefix = convertTextToTag(test);
		let startingScoresNode =
			`<div class="exam-calc width-bracket" id="${testTagPrefix + testStartingScoreAttrPostfix}" hidden>`;

		const testStartingScoreNote = testData[test].startingScore.note;
		if (testStartingScoreNote !== null) {
			startingScoresNode += `<div class="p width-bracket" id="${testTagPrefix}-note">
									${testStartingScoreNote}
								   </div>`;
		}

		for (const startingScore of testData[test].startingScore.value) {
			startingScoresNode += `<a class="wsite-button">
									<span class="wsite-button-inner">${startingScore}</span>
								   </a>`;
		}
		startingScoresNode += '</div>';

		document.getElementById("starting-score").insertAdjacentHTML('beforeend', startingScoresNode);
	}
})();

function onTestSelected(event: Event) {
	hideWhichTest();
	const testName = (event.target as HTMLButtonElement).textContent.trim();
	showTestDates(testName);
	// @ts-ignore
	document.getElementById("test-submit").value = testName;
	document.getElementById("test-choice").innerHTML = testName;
}

function onDateSelected(event: Event) {
	const dateNode = event.target as HTMLButtonElement;
	const date = dateNode.textContent.trim();
	hideWhichDateGeneric();
	if (dateNode.getAttribute(dateAvailabilityAttr) === 'false') {
		const testName = dateNode.getAttribute(testNameAttr);
		const noOfferDateText = `Illini Tutoring does not offer test prep for the ${date} ${testName}.`;
		document.getElementById("not-offer-test-date").style.display = "block";
		document.getElementById("not-offer-test-date").innerText = noOfferDateText;
	} else {
		showChoiceCalculation();
		// @ts-ignore
		document.getElementById("date-submit").value = date;
		document.getElementById("date-choice").innerHTML = date;
	}
}

function onCalculateHoursManuallyChosen() {
	showHowManyHours();
	hideChoiceCalculation();
}

function onCalculateHoursAutomaticallyChosen() {
	if (document.getElementById("test-choice").innerHTML == "SAT") {
		showStartingScoreSat();
	} else if (document.getElementById("test-choice").innerHTML == "ACT") {
		showStartingScoreAct();
	} else if (document.getElementById("test-choice").innerHTML == "SSAT") {
		showStartingScoreSsat();
		document.getElementById("points-to-add-choice").innerHTML = "N/A";
	}
	showExtraTable();
	hideChoiceCalculation();
}

function convertTextToTag(value: string) {
	return value.toLowerCase().replace(' ', '-')
}

	document.addEventListener("click", function(event: Event) {
		// @ts-ignore
		if (event.target.tagName === "BUTTON" || event.target.tagName === "SPAN") {
			const button = event.target as HTMLButtonElement;
			let hourschoice;
			// @ts-ignore
			if (button.parentNode.parentNode.parentNode.id == "starting-score"
				// @ts-ignore
				|| button.parentNode.parentNode.parentNode.parentNode.id == "starting-score") {
				hideStartingScore();
				document.getElementById("starting-score-choice").innerHTML =
					button.textContent;
				if (document.getElementById("test-choice").innerHTML == "SAT") {
					showPointsToAddSat();
				} else if (document.getElementById("test-choice").innerHTML == "ACT") {
					showPointsToAddAct();
				} else if (document.getElementById("test-choice").innerHTML == "SSAT") {
					hourschoice = determineHours(null);
					// @ts-ignore
					document.getElementById("hours-submit").value = hourschoice;
					document.getElementById("hours-choice").innerHTML = hourschoice;
					showResult(hourschoice);
				}
				// @ts-ignore
			} else if (button.parentNode.parentNode.parentNode.id == "points-to-add") {
				hidePointsToAdd();
				const pointsToAdd = button.textContent;
				hourschoice = determineHours(pointsToAdd);
				if (hourschoice == "0") {
					document.getElementById("starting-score-choice").innerHTML = "";
					document.getElementById("sat-act-unavailable").style.display = "block";
				} else {
					document.getElementById("points-to-add-choice").innerHTML =
						button.textContent;
					// @ts-ignore
					document.getElementById("hours-submit").value = hourschoice;
					document.getElementById("hours-choice").innerHTML = hourschoice;
					showResult(hourschoice);
				}
			} else if (button.textContent === "Proceed") {
				document.getElementById("sat-act-unavailable").style.display = "none";
				if (document.getElementById("test-choice").innerHTML == "SAT") {
					showStartingScoreSat();
				} else if (document.getElementById("test-choice").innerHTML == "ACT") {
					showStartingScoreAct();
				}
			} else if (
				// @ts-ignore
				button.parentNode.parentNode.parentNode.id === "hours"
			) {
				// @ts-ignore
				document.getElementById("hours-submit").value = button.textContent;
				document.getElementById("hours-choice").innerHTML = button.textContent;
				hourschoice = button.textContent;
				hideHowManyHours();
				showResult(hourschoice);
			} else if (button.textContent === "Reset") {
				hideHowManyHours();
				hideWhichDateGeneric();
				hideChoiceCalculation();
				hideStartingScore();
				hidePointsToAdd();
				hideExtraTable();
				hideResult();
				showWhichTest();
				document.getElementById("for-immediately").style.display = "inline";
				clearTable();
			} else if (
				button.textContent === "Submit" &&
				document.getElementById("test-choice").innerHTML !== "" &&
				document.getElementById("date-choice").innerHTML !== "" &&
				document.getElementById("hours-choice").innerHTML !== ""
			) {
				hideResetButton();
			}
		}
	});

function hideWhichTest() {
	document.getElementById("question-one-which-test").style.display = "none";
}
function hideWhichDateGeneric() {
	document.getElementById("question-two-which-date").style.display = "none";
	for (const testName of testNames) {
		document.getElementById(testName.toLowerCase() + testDateButtonAttrPostfix).style.display = "none";
	}
}
function hideChoiceCalculation() {
	document.getElementById("hours-calculation-choice").style.display = "none";
}
function hideStartingScore() {
	document.getElementById("starting-score").style.display = "none";
	for (const testName of testNames) {
		document.getElementById(testName.toLowerCase() + testStartingScoreAttrPostfix).style.display = "none";
	}
}
function hidePointsToAdd() {
	document.getElementById("points-to-add").style.display = "none";
	document.getElementById("sat-points").style.display = "none";
	document.getElementById("act-points").style.display = "none";
}
function hideExtraTable() {
	document.getElementById("starting-score-text").style.display = "none";
	document.getElementById("points-to-add-text").style.display = "none";
	document.getElementById("starting-score-choice").style.display = "none";
	document.getElementById("points-to-add-choice").style.display = "none";
}
function hideHowManyHours() {
	document.getElementById("hours").style.display = "none";
}
function hideResetButton() {
	const parent = document.getElementById("reset-parent");
	const child = document.getElementById("reset-child");
	parent.removeChild(child);
}
function showWhichTest() {
	document.getElementById("question-one-which-test").style.display = "block";
}
function showTestDates(testName: string) {
	document.getElementById("question-two-which-date").style.display = "block";
	document.getElementById(testName.toLowerCase() + testDateButtonAttrPostfix).style.display = "inline";
}
function showChoiceCalculation() {
	document.getElementById("hours-calculation-choice").style.display = "block";
}
function showStartingScoreSat() {
	document.getElementById("starting-score").style.display = "block";
	document.getElementById("sat" + testStartingScoreAttrPostfix).style.display = "block";
}
function showStartingScoreAct() {
	document.getElementById("starting-score").style.display = "block";
	document.getElementById("act" + testStartingScoreAttrPostfix).style.display = "block";
}
function showStartingScoreSsat() {
	document.getElementById("starting-score").style.display = "block";
	document.getElementById("ssat" + testStartingScoreAttrPostfix).style.display = "block";
}
function showPointsToAddSat() {
	document.getElementById("points-to-add").style.display = "block";
	document.getElementById("sat-points").style.display = "block";
}
function showPointsToAddAct() {
	document.getElementById("points-to-add").style.display = "block";
	document.getElementById("act-points").style.display = "block";
}
function showExtraTable() {
	document.getElementById("starting-score-text").style.display = "table-cell";
	document.getElementById("points-to-add-text").style.display = "table-cell";
	document.getElementById("starting-score-choice").style.display = "table-cell";
	document.getElementById("points-to-add-choice").style.display = "table-cell";
}
function showHowManyHours() {
	document.getElementById("hours").style.display = "block";
}
function showResult(hourschoice) {
	let deadline;
	let startDate;
	const testchoice = document.getElementById("test-choice").innerHTML;
	const datechoice = document.getElementById("date-choice").innerHTML;

	if (testchoice == "SAT") {
		if (datechoice == "August 25") {
			if (hourschoice == "12") {
				deadline = "July 15, '18";
				startDate = "immediately";
			} else {
				deadline = "Closed";
				startDate = "Closed";
			}
		} else if (datechoice == "October 6") {
			if (hourschoice == "12" || hourschoice == "18") {
				deadline = "July 27, '18";
				startDate = "August 26, '18";
			} else if (hourschoice == "24" || hourschoice == "30") {
				deadline = "July 15, '18";
				startDate = "July 27, '18";
			}
		} else if (datechoice == "November 3") {
			if (hourschoice == "12" || hourschoice == "18") {
				deadline = "August 15, '18";
				startDate = "September 23, '18";
			} else if (hourschoice == "24" || hourschoice == "30") {
				deadline = "July 27, '18";
				startDate = "August 12, '18";
			}
		} else if (datechoice == "December 1") {
			if (hourschoice == "12" || hourschoice == "18") {
				deadline = "September 15, '18";
				startDate = "October 14, '18";
			} else if (hourschoice == "24" || hourschoice == "30") {
				deadline = "August 15, '18";
				startDate = "September 2, '18";
			}
		} else if (datechoice == "March 9") {
			if (hourschoice == "12" || hourschoice == "18") {
				deadline = "December 15, '18";
				startDate = "January 27, '19";
			} else if (hourschoice == "24" || hourschoice == "30") {
				deadline = "November 15, '18";
				startDate = "December 2, '18";
			}
		} else if (datechoice == "May 4") {
			if (hourschoice == "12" || hourschoice == "18") {
				deadline = "February 15, '19";
				startDate = "March 24, '19";
			} else if (hourschoice == "24" || hourschoice == "30") {
				deadline = "January 15, '19";
				startDate = "February 3, '19";
			}
		} else if (datechoice == "June 1") {
			if (hourschoice == "12" || hourschoice == "18") {
				deadline = "March 15, '19";
				startDate = "April 21, '19";
			} else if (hourschoice == "24" || hourschoice == "30") {
				deadline = "February 15, '19";
				startDate = "March 3, '19";
			}
		}
	} else if (testchoice == "ACT") {
		if (datechoice == "September 8") {
			if (hourschoice == "12" || hourschoice == "18") {
				deadline = "July 27, '18";
				startDate = "immediately";
			} else if (hourschoice == "24" || hourschoice == "30") {
				deadline = "Closed";
				startDate = "Closed";
			}
		} else if (datechoice == "October 27") {
			if (hourschoice == "12" || hourschoice == "18") {
				deadline = "August 15, '18";
				startDate = "September 16, '18";
			} else if (hourschoice == "24" || hourschoice == "30") {
				deadline = "July 27, '18";
				startDate = "August 5, '18";
			}
		} else if (datechoice == "December 8") {
			if (hourschoice == "12" || hourschoice == "18") {
				deadline = "September 15, '18";
				startDate = "October 21, '18";
			} else if (hourschoice == "24" || hourschoice == "30") {
				deadline = "August 15, '18";
				startDate = "September 9, '18";
			}
		} else if (datechoice == "February 9") {
			if (hourschoice == "12" || hourschoice == "18") {
				deadline = "November 15, '18";
				startDate = "December 9, '18";
			} else if (hourschoice == "24" || hourschoice == "30") {
				deadline = "September 15, '18";
				startDate = "October 21, '18";
			}
		} else if (datechoice == "April 13") {
			if (hourschoice == "12" || hourschoice == "18") {
				deadline = "January 15, '19";
				startDate = "February 24, '19";
			} else if (hourschoice == "24" || hourschoice == "30") {
				deadline = "December 15, '18";
				startDate = "January 13, '19";
			}
		} else if (datechoice == "June 8") {
			if (hourschoice == "12" || hourschoice == "18") {
				deadline = "March 15, '19";
				startDate = "April 28, '19";
			} else if (hourschoice == "24" || hourschoice == "30") {
				deadline = "February 15, '19";
				startDate = "March 10, '19";
			}
		}
	} else if (testchoice == "SSAT") {
		if (datechoice == "October 13") {
			if (hourschoice == "12" || hourschoice == "18") {
				deadline = "August 15, '18";
				startDate = "September 2, '18";
			} else if (hourschoice == "24" || hourschoice == "30") {
				deadline = "July 15, '18";
				startDate = "July 27, '18";
			}
		} else if (datechoice == "November 10") {
			if (hourschoice == "12" || hourschoice == "18") {
				deadline = "September 15, '18";
				startDate = "September 30, '18";
			} else if (hourschoice == "24" || hourschoice == "30") {
				deadline = "July 27, '18";
				startDate = "August 19, '18";
			}
		} else if (datechoice == "December 8") {
			if (hourschoice == "12" || hourschoice == "18") {
				deadline = "September 15, '18";
				startDate = "October 21, '18";
			} else if (hourschoice == "24" || hourschoice == "30") {
				deadline = "August 15, '18";
				startDate = "September 9, '18";
			}
		} else if (datechoice == "January 5") {
			if (hourschoice == "12" || hourschoice == "18") {
				deadline = "October 15, '18";
				startDate = "November 4, '18";
			} else if (hourschoice == "24" || hourschoice == "30") {
				deadline = "August 15, '18";
				startDate = "September 23, '18";
			}
		} else if (datechoice == "February 2") {
			if (hourschoice == "12" || hourschoice == "18") {
				deadline = "November 15, '18";
				startDate = "December 2, '18";
			} else if (hourschoice == "24" || hourschoice == "30") {
				deadline = "September 15, '18";
				startDate = "October 14, '18";
			}
		} else if (datechoice == "March 2") {
			deadline = "not offer March";
			startDate = "not offer March";
		} else if (datechoice == "April 27") {
			deadline = "not offer April";
			startDate = "not offer April";
		} else if (datechoice == "June 8") {
			if (hourschoice == "12" || hourschoice == "18") {
				deadline = "March 15, '19";
				startDate = "April 28, '19";
			} else if (hourschoice == "24" || hourschoice == "30") {
				deadline = "February 15, '19";
				startDate = "March 10, '19";
			}
		}
	}
	document.getElementById("sat-act-unavailable").style.display = "none";
	if (deadline === "Closed") {
		document.getElementById("closed").style.display = "block";
	} else {
		document.getElementById("cycle").style.display = "block";
		document.getElementById("testchoice").innerHTML = testchoice;
		document.getElementById("datechoice").innerHTML = datechoice;
		document.getElementById("start-date").innerHTML = startDate;
		document.getElementById("deadline").innerHTML = deadline;
		if (startDate === "immediately") {
			document.getElementById("for-immediately").style.display = "none";
		}
	}
}
function hideResult() {
	document.getElementById("cycle").style.display = "none";
	document.getElementById("closed").style.display = "none";
	document.getElementById("not-offer-test-date").style.display = "none";
}
function determineHours(pointsToAdd) {
	const startingScore = document.getElementById("starting-score-choice")
		.innerHTML;
	let hours;
	if (document.getElementById("test-choice").innerHTML == "SAT") {
		if (pointsToAdd == "50") {
			hours = 12;
		} else if (
			pointsToAdd == "100" &&
			(startingScore == "850" ||
				startingScore == "900" ||
				startingScore == "950" ||
				startingScore == "1000" ||
				startingScore == "1050" ||
				startingScore == "1100" ||
				startingScore == "1150" ||
				startingScore == "1200" ||
				startingScore == "1250" ||
				startingScore == "1300" ||
				startingScore == "1350" ||
				startingScore == "1400")
		) {
			hours = 12;
		} else if (
			pointsToAdd == "100" &&
			(startingScore == "1450" || startingScore == "1500")
		) {
			hours = 18;
		} else if (
			pointsToAdd == "150" &&
			(startingScore == "850" ||
				startingScore == "900" ||
				startingScore == "950" ||
				startingScore == "1000" ||
				startingScore == "1050" ||
				startingScore == "1100" ||
				startingScore == "1150" ||
				startingScore == "1200" ||
				startingScore == "1250")
		) {
			hours = 12;
		} else if (
			pointsToAdd == "150" &&
			(startingScore == "1300" ||
				startingScore == "1350" ||
				startingScore == "1400" ||
				startingScore == "1450")
		) {
			hours = 18;
		} else if (
			pointsToAdd == "200" &&
			(startingScore == "850" ||
				startingScore == "900" ||
				startingScore == "950" ||
				startingScore == "1000" ||
				startingScore == "1050" ||
				startingScore == "1100" ||
				startingScore == "1150" ||
				startingScore == "1200" ||
				startingScore == "1250")
		) {
			hours = 18;
		} else if (
			pointsToAdd == "200" &&
			(startingScore == "1300" ||
				startingScore == "1350" ||
				startingScore == "1400")
		) {
			hours = 24;
		} else if (
			pointsToAdd == "250" &&
			(startingScore == "850" ||
				startingScore == "900" ||
				startingScore == "950" ||
				startingScore == "1000" ||
				startingScore == "1050" ||
				startingScore == "1100")
		) {
			hours = 18;
		} else if (
			pointsToAdd == "250" &&
			(startingScore == "1150" ||
				startingScore == "1200" ||
				startingScore == "1250")
		) {
			hours = 24;
		} else if (
			pointsToAdd == "250" &&
			(startingScore == "1300" || startingScore == "1350")
		) {
			hours = 30;
		} else if (
			pointsToAdd == "300" &&
			(startingScore == "850" ||
				startingScore == "900" ||
				startingScore == "950" ||
				startingScore == "1000" ||
				startingScore == "1050" ||
				startingScore == "1100")
		) {
			hours = 24;
		} else if (
			pointsToAdd == "300" &&
			(startingScore == "1150" ||
				startingScore == "1200" ||
				startingScore == "1250" ||
				startingScore == "1300")
		) {
			hours = 30;
		} else if (
			pointsToAdd == "350" &&
			(startingScore == "850" || startingScore == "900")
		) {
			hours = 24;
		} else if (
			pointsToAdd == "350" &&
			(startingScore == "950" ||
				startingScore == "1000" ||
				startingScore == "1050" ||
				startingScore == "1100" ||
				startingScore == "1150" ||
				startingScore == "1200" ||
				startingScore == "1250")
		) {
			hours = 30;
		} else if (
			pointsToAdd == "400" &&
			(startingScore == "850" ||
				startingScore == "900" ||
				startingScore == "950" ||
				startingScore == "1000" ||
				startingScore == "1050" ||
				startingScore == "1100" ||
				startingScore == "1150" ||
				startingScore == "1200")
		) {
			hours = 30;
		} else if (
			pointsToAdd == "450" &&
			(startingScore == "850" ||
				startingScore == "900" ||
				startingScore == "950" ||
				startingScore == "1000" ||
				startingScore == "1050" ||
				startingScore == "1100" ||
				startingScore == "1150")
		) {
			hours = 30;
		} else if (
			pointsToAdd == "500+" &&
			(startingScore == "850" ||
				startingScore == "900" ||
				startingScore == "950" ||
				startingScore == "1000" ||
				startingScore == "1050" ||
				startingScore == "1100")
		) {
			hours = 30;
		} else {
			hours = 0;
		}
	} else if (document.getElementById("test-choice").innerHTML == "ACT") {
		if (pointsToAdd == "2") {
			hours = "12";
		} else if (
			pointsToAdd == "3" &&
			(startingScore == "18" ||
				startingScore == "19" ||
				startingScore == "20" ||
				startingScore == "21" ||
				startingScore == "22" ||
				startingScore == "23" ||
				startingScore == "24" ||
				startingScore == "25" ||
				startingScore == "26" ||
				startingScore == "27" ||
				startingScore == "28" ||
				startingScore == "29")
		) {
			hours = "12";
		} else if (
			pointsToAdd == "3" &&
			(startingScore == "30" ||
				startingScore == "31" ||
				startingScore == "32" ||
				startingScore == "33")
		) {
			hours = "18";
		} else if (
			pointsToAdd == "4" &&
			(startingScore == "18" ||
				startingScore == "19" ||
				startingScore == "20" ||
				startingScore == "21" ||
				startingScore == "22" ||
				startingScore == "23" ||
				startingScore == "24" ||
				startingScore == "25" ||
				startingScore == "26" ||
				startingScore == "27" ||
				startingScore == "28")
		) {
			hours = "12";
		} else if (
			pointsToAdd == "4" &&
			(startingScore == "29" ||
				startingScore == "30" ||
				startingScore == "31" ||
				startingScore == "32")
		) {
			hours = "18";
		} else if (
			pointsToAdd == "5" &&
			(startingScore == "18" ||
				startingScore == "19" ||
				startingScore == "20" ||
				startingScore == "21" ||
				startingScore == "22" ||
				startingScore == "23" ||
				startingScore == "24" ||
				startingScore == "25" ||
				startingScore == "26" ||
				startingScore == "27" ||
				startingScore == "28")
		) {
			hours = "18";
		} else if (
			pointsToAdd == "5" &&
			(startingScore == "29" || startingScore == "30" || startingScore == "31")
		) {
			hours = "24";
		} else if (
			pointsToAdd == "6" &&
			(startingScore == "18" ||
				startingScore == "19" ||
				startingScore == "20" ||
				startingScore == "21" ||
				startingScore == "22" ||
				startingScore == "23" ||
				startingScore == "24" ||
				startingScore == "25")
		) {
			hours = "18";
		} else if (
			pointsToAdd == "6" &&
			(startingScore == "26" || startingScore == "27" || startingScore == "28")
		) {
			hours = "24";
		} else if (
			pointsToAdd == "6" &&
			(startingScore == "29" || startingScore == "30")
		) {
			hours = "30";
		} else if (
			pointsToAdd == "7" &&
			(startingScore == "18" ||
				startingScore == "19" ||
				startingScore == "20" ||
				startingScore == "21" ||
				startingScore == "22" ||
				startingScore == "23" ||
				startingScore == "24" ||
				startingScore == "25")
		) {
			hours = "24";
		} else if (
			pointsToAdd == "7" &&
			(startingScore == "26" ||
				startingScore == "27" ||
				startingScore == "28" ||
				startingScore == "29")
		) {
			hours = "30";
		} else if (
			pointsToAdd == "8" &&
			(startingScore == "18" ||
				startingScore == "19" ||
				startingScore == "20" ||
				startingScore == "21" ||
				startingScore == "22")
		) {
			hours = "24";
		} else if (
			pointsToAdd == "8" &&
			(startingScore == "23" ||
				startingScore == "24" ||
				startingScore == "25" ||
				startingScore == "26" ||
				startingScore == "27" ||
				startingScore == "28")
		) {
			hours = "30";
		} else if (
			pointsToAdd == "9" &&
			(startingScore == "18" || startingScore == "19")
		) {
			hours = "24";
		} else if (
			pointsToAdd == "9" &&
			(startingScore == "20" ||
				startingScore == "21" ||
				startingScore == "22" ||
				startingScore == "23" ||
				startingScore == "24" ||
				startingScore == "25" ||
				startingScore == "26" ||
				startingScore == "27")
		) {
			hours = "30";
		} else if (
			pointsToAdd == "10+" &&
			(startingScore == "18" ||
				startingScore == "19" ||
				startingScore == "20" ||
				startingScore == "21" ||
				startingScore == "22" ||
				startingScore == "23" ||
				startingScore == "24" ||
				startingScore == "25" ||
				startingScore == "26")
		) {
			hours = "30";
		} else {
			hours = "0";
		}
	} else if (document.getElementById("test-choice").innerHTML == "SSAT") {
		if (
			document.getElementById("starting-score-choice").innerHTML == "80-89%"
		) {
			hours = "12";
		} else if (
			document.getElementById("starting-score-choice").innerHTML == "70-79%"
		) {
			hours = "18";
		} else if (
			document.getElementById("starting-score-choice").innerHTML == "60-69%"
		) {
			hours = "24";
		} else if (
			document.getElementById("starting-score-choice").innerHTML == "50-59%"
		) {
			hours = "30";
		}
	}
	return hours;
}

function clearTable() {
	document.getElementById("test-choice").innerHTML = "";
	document.getElementById("hours-choice").innerHTML = "";
	document.getElementById("date-choice").innerHTML = "";
	document.getElementById("starting-score-choice").innerHTML = "";
	document.getElementById("points-to-add-choice").innerHTML = "";
	// @ts-ignore
	document.getElementById("test-submit").value = "";
	// @ts-ignore
	document.getElementById("hours-submit").value = "";
	// @ts-ignore
	document.getElementById("date-submit").value = "";
}
