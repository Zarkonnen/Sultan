var sultan = (function() {
    var stories = [];

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
            fx.push({ variable: s[i], operator: s[i + 1], amount: parseInt(s[i + 2]) });
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
        console.log(JSON.stringify(stories));
    };
    
    return {
        load: load
    }
})();
