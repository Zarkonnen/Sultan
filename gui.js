var gui = (function() {
    var show = function(content) {
        jQuery("#content").html(content);
    };
    
    var getAdvice = function(storyIndex, advisorIndex) {
        var advice = sultan.getAdvice(sultan.advisors[advisorIndex], sultan.currentStories[storyIndex]);
        console.log(advice);
        sultan.advisors[advisorIndex].revealedAdvice[sultan.currentStories[storyIndex].id] = advice;
        showStory(storyIndex);
    };
    
    var chooseOption = function(storyIndex, optionIndex) {
        showResult(sultan.currentStories[storyIndex], sultan.chooseOption(sultan.currentStories[storyIndex], optionIndex));
    };

    var showStoryList = function() {
        var c = '<h1>SULTAN</h1>';
        c += '<div class="intro">Available actions today: ' + sultan.getAvailableActions() + '</div>';
        for (var i = 0; i < sultan.currentStories.length; i++) {
            var story = sultan.currentStories[i];
            c += '<div class="button" onClick="gui.showStory(' + i + ')">' + story.intro + '</div>';
        }
        c += '<div class="button" onClick="gui.showHistory()">Past Decisions</div>';
        show(c);
    };
    
    var showStory = function(storyIndex) {
        var story = sultan.currentStories[storyIndex];
        var c = '<h1>' + story.title.toUpperCase() + '</h1>';
        c += '<div class="intro">Available actions today: ' + sultan.getAvailableActions() + '</div>';
        c += '<div class="intro">' + story.intro + '</div>';
        c += '<div class="button" onClick="gui.showStoryList()">Back</div>';
        for (var i = 0; i < sultan.advisors.length; i++) {
            var advisor = sultan.advisors[i];
            if (advisor.revealedAdvice[story.id]) {
                c += '<div class="advice">' + advisor.name + ': ' + advisor.revealedAdvice[story.id] + '</div>';
            } else {
                if (sultan.getAvailableActions() > 0) {
                    c += '<div class="button" onClick="gui.getAdvice(' + storyIndex + ', ' + i + ')">Ask ' + advisor.name + '</div>';
                } else {
                    c += '<div class="disabled">Ask ' + advisor.name + '</div>';
                }
            }
        }
        for (var i = 0; i < story.options.length; i++) {
            c += '<div class="button" onClick="gui.chooseOption(' + storyIndex + ', ' + i + ')">' + story.options[i].text + '</div>';
        }
        show(c);
    };
    
    var showResult = function(story, resultText) {
        var c = '<h1>' + story.title.toUpperCase() + '</h1>';
        c += '<div>' + resultText + '</div>';
        c += '<div class="button" onClick="gui.showStoryList()">The next day...</div>';
        show(c);
    };
    
    var showHistory = function() {
        var c = '<h1>PAST DECISIONS</h1>';
        c += '<div class="button" onClick="gui.showStoryList()">Back</div>';
        for (var i = 0; i < sultan.pastStories.length; i++) {
            var story = sultan.pastStories[i].story;
            var optionIndex = sultan.pastStories[i].optionIndex
            c += '<h2>' + story.title.toUpperCase() + '</h2>';
            c += '<div>' + story.intro + '</div>';
            for (var j = 0; j < sultan.advisors.length; j++) {
                var advisor = sultan.advisors[j];
                if (advisor.revealedAdvice[story.id]) {
                    c += '<div class="advice">' + advisor.name + ': ' + advisor.revealedAdvice[story.id] + '</div>';
                }
            }
            for (var j = 0; j < story.options.length; j++) {
                var option = story.options[j];
                if (j == optionIndex) {
                    c += '<div class="chosenOption">' + option.text + '</div>';
                } else {
                    c += '<div class="notChosenOption">' + option.text + '</div>';
                }
            }
            c += '<div class="outcome">' + story.outcome + '</div>';
        }
        show(c);
    };
    
    return {
        showStoryList: showStoryList,
        showStory: showStory,
        chooseOption: chooseOption,
        getAdvice: getAdvice,
        showResult: showResult,
        showHistory: showHistory
    };
})();
