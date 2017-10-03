var sultan = (function() {
    var stories = [];
    var variables = {};
    var variableNames = [];
    var advisors = [];

    var load = function() {
        jQuery.ajax({
            url: "events.txt",
            complete: loaded
        });
    };
    
    var effects = function(s) {
        s = s.split(" ");
        var fx = [];
        for (var i = 0; i < s.length; i += 3) {
            if (s[i + 1] == "+") {
                fx.push({ variable: s[i], delta: parseInt(s[i + 2])});
            } else {
                fx.push({ variable: s[i], delta: 0 - parseInt(s[i + 2])});
            }
        }
        return fx;
    };
    
    var loaded = function(response) {
        var lines = response.responseText.split("\n");
        var story = null;
        var option = null;
        lines.forEach(function(l) {
            l = l.trim();
            if (l.length == 0) { return; }
            var op = l.split(" ", 1)[0];
            var data = l.substring(op.length + 1);
            switch (op) {
                case "variable":
                    var varName = data.split(" ")[0];
                    var varMin = parseInt(data.split(" ")[1]);
                    var varMax = parseInt(data.split(" ")[2]);
                    variables[varName] = Math.floor(Math.random() * (varMax - varMin + 1)) + varMin;
                    variableNames.push(varName);
                    break;
                case "story":
                    if (story != null) {
                        if (option != null) {
                            story.options.push(option);
                            option = null;
                        }
                        stories.push(story);
                    }
                    story = { title: data, options: [] };
                    break;
                case "intro":
                    story.intro = data;
                    break;
                case "threshold":
                    story.thresholdVariable = data.split(" ")[0];
                    story.thresholdAmount = parseInt(data.split(" ")[1]);
                    break;
                case "option":
                    if (option != null) {
                        story.options.push(option);
                    }
                    option = { text: data, arguments: [] };
                    break;
                case "above":
                    option.above = data;
                    break;
                case "aboveEffect":
                    option.aboveEffect = effects(data);
                    break;
                case "below":
                    option.below = data;
                    break;
                case "belowEffect":
                    option.belowEffect = effects(data);
                    break;
                case "argument":
                    option.arguments.push(data);
                    break;
                default:
                    console.log("Unknown line: " + op);
            }
        });
        if (story != null) {
            if (option != null) {
                story.options.push(option);
            }
            stories.push(story);
        }
        
        // Generate advisors.
        advisors = ["Alice", "Bob"].map(function(name) {
            var firstLoyalty = Math.random() > 0.5;
            var firstVariable = variableNames[Math.floor(Math.random() * variableNames.length)];
            var remainingVariables = variableNames.filter(function(v) { return v != firstVariable });
            var secondVariable = remainingVariables[Math.floor(Math.random() * remainingVariables.length)];
            return {
                name: name,
                priorities: [
                    {
                        type: firstLoyalty ? "loyalty" : "truth",
                        variable: firstVariable
                    },
                    {
                        type: firstLoyalty ? "truth" : "loyalty",
                        variable: secondVariable
                    }
                ],
                revealedAdvice: {}
            };
        });
        
        console.log(JSON.stringify(advisors));
        console.log(JSON.stringify(variables));
    };
    
    var isAbove = function(story) {
        return variables[story.thresholdVariable] > story.thresholdAmount;
    };
    
    var chooseOption = function(story, optionIndex) {
    
    };
    
    var optionQuality = function(priority, story, optionIndex) {
        var effects = story.options[optionIndex][isAbove(story) ? "aboveEffect" : "belowEffect"];
        if (priority.type == "loyalty") {
            var relevantEffects = effects.filter(function(e) {
                return e.variable == priority.variable;
            });
            return relevantEffects.length == 0 ? 0 : relevantEffects[0].delta;
        } else {
            return effects.reduce(function(acc, e) { return acc + e.delta; }, 0);
        }
    };
    
    var getAdvice = function(advisor, story) {
        for (var i = 0; i < advisor.priorities.length; i++) {
            var priority = advisor.priorities[i];
            var bestAdvice = -1;
            var bestAdviceQuality = -100000;
            var worstAdviceQuality = 100000;
            for (var j = 0; j < story.options.length; j++) {
                var quality = optionQuality(priority, story, j);
                if (quality > bestAdviceQuality || bestAdvice == -1) {
                    bestAdvice = j;
                    bestAdviceQuality = quality;
                }
                worstAdviceQuality = Math.min(worstAdviceQuality, quality);
            }
            if (bestAdvice != -1 && bestAdviceQuality > worstAdviceQuality) {
                var option = story.options[bestAdvice];
                return option.arguments[Math.floor(Math.random() * option.arguments.length)];
            }
        }
        return "I don't know.";
    };
    
    return {
        load: load,
        chooseOption: chooseOption,
        getAdvice: getAdvice
    }
})();
