/*jshint regexp: false */
/*global $:true, window: true */

(function() {

	var main_text = $("div[role=main]").text();

	var conditions = {
		"initial": function() { return $.trim(main_text) === "" },
		"step2": function() { return $.trim(main_text) === "This is just a placeholder." },
		"step3": function() { return $("div[role=main] p").length < 1 },
		"step4": function() { return window.location.href !== "http://localhost:9009/about" && $(".navbar").children().length < 1 },
		"step5": function() { return window.location.href === "http://localhost:9009/about" && $(".navbar").children().length < 1 },
		"step6": function() { return window.location.href === "http://localhost:9009/about" && $(".navbar").children().length > 1 },
		"step7": function() { return window.location.href !== "http://localhost:9009/about" && $("div[role=main] img").length < 1 },
		"step8": function() { return true }
	};

	var messages = {
			"initial": "Thanks for trying out Punch! This <b>quick hands-on tutorial</b> will help you to get familiar with the basics of Punch (It won't take more than 15 mintues).\b[Let's Start!](#show_help)",

			"step1": "One of the basic principles of Punch, is to keep the contents seperated from its presentation. You have to place all presentational elements (layouts and static assets) in the `templates` directory. All the information you want to communicate to the visitors should go in `contents`.\bIf you go inside the `templates` directory, you will find a file named `_layout.mustache`. This is the main layout of your site. You can create different layouts for different sections of your site. For example, if you want to have a `/blog` section, just create a directory named `blog` and place a `_layout.mustache` inside it. Then, all pages under blog will be rendered using that layout.\bFor now, we shall use the main layout to render all pages of the site.\bOpen the `_layout.mustache` and place the tag `{{{intro}}}` inside the `&lt;div role=\"main\"&gt;&lt;/div&gt;`.\bReload this page when you're done.",

			"step2": "Did you notice that the `intro` tag you just placed, got replaced with some placeholder text? How did that happen?\b When Punch serves a request for a page, it looks for the best matching content and layout for that page. In this case, we are actually requesting for the `/index.html` page. So Punch choose the contents in `contents/index.json` and the default layout to render the page.\bIf you look in `contents/index.json`, you will find a property named `intro` defined there. It's the value that got rendered on the page. Let's see what happens when we change this value.\bOpen `contents/index.json` and change the value of `intro`.\b Then, reload this page.",

			"step3": "Nice! You should now see the value you just defined, rendered on the page. [JSON](http://json.org) is a good way to define short, structured content. But what about long, formatted content we often want to insert into our pages? It would be cumbersome if we had to write HTML tags inside JSON values. Punch offers a smarter alternative for such cases - [Markdown](http://daringfireball.net/projects/markdown/).\bSpecial contents used in a page, such as Markdown, should be stored in a directory named by the page name preceded with an underscore (ie. `_index`). So let's create a directory named `_index` in `contents`. Then, inside `_index`, create a new file to write our intro again using Markdown formatting. Make sure you break it into mulitiple paragraphs, emphasize points and add links.\bWhen you are done, save the file as `intro.markdown`.\b Reload this page again to see the changes.",

			"step4": "You're picking it so fast! Now, shall we add another page to the site?\bLet's add a About page to the site. Follow the same steps you took to create the contents for the Index page. Hint: You can start by creating a directory named `_about`.\bIf you did it correctly, visiting [http://localhost:9009/about](http://localhost:9009/about) should show the contents you created for the About page.",

			"step5": "Great job! Since there are already two pages in the site, it's better to add a navbar.\bOpen the `shared.json` file in `contents` and modify the `navbar` property to look like this:\b<pre>\"navbar\": [\n    { \"label\": \"Home\", \"href\": \"/\" },\n    { \"label\": \"About\", \"href\": \"/about\" }\n]</pre>\bReload the page, when you're done.",

			"step6": "You should see the navbar rendered on the page. Markup for the navbar was pre-defined in `templates/_header.mustache`, that's why it showed up automagically. `_header.mustache` is a partial layout that can be shared across multiple layouts.\bAlso note, when you define a property in `shared.json`, it's made available to all pages of the site.\bNow let's go back to [homepage](/) and try to make it little prominent.",

			"step7": "Rather than using the main layout, we'll use a layout specifically for the homepage.\bCopy the contents in `templates/_layout.mustache` into a new file. Save it as `index.mustache`.\b If there's a layout by the name of a requested page, Punch will use that layout to render the page.\bThere are many interestng things you can try on homepage, but for now let's just insert a banner image. Copy a suitable image into `templates` directory. Then, modify the markup of `index.mustache` to show the image:\b<pre>&lt;div role=\"main\"&gt;\n  &lt;img src=\"banner.jpg\"&gt;\n  {{{intro}}}\n&lt;/div&gt;</pre>Reload the page, when you're done.",

			"step8": "Woah! Look you just created a nice little site with Punch :)\bThere are some more great features in Punch that worth exploring. You will figure most of them by yourself, when you deep dive into your project. Remember, [Punch Guide](https://github.com/laktek/punch/wiki) is your friend.\bNow you can remove this block. Go to `templates/_footer.mustache` and remove the tag {{{first-run}}}.\bHappy Hacking!",

			"skip": "To remove this block, go to `templates/_footer.mustache` and remove the tag `{{{first-run}}}`.\bBTW, [Punch Guide](https://github.com/laktek/punch/wiki) might come in handy, when you want to refer how to get certain things done.\bHappy Hacking!"
	};

	var setupHelpBox = function() {
		var help_box = $("<div>").attr("id", "punch-help-box");
		var help_message = $("<div>").attr("class", "message");
		var sticky_links = $("<span>").append("<a href=\"https://github.com/laktek/punch/issues/new\">Got stuck? We can help you</a> | <a href=\"#no_help\">End the guided tutorial</a>");

		$(help_box).append(help_message).append(sticky_links);
		$("div[role=main]").append(help_box);
	};

	var setMessage = function(msg, replace) {
		var msg_lines = messages[msg].split("\b");
		var help_box = $("#punch-help-box .message");
		var formatted_msg = $("<div>");

		var add_markup = function(text) {
			return text.replace(/`([^`]*)`/g, "<code>$1</code>").replace(/\[([^\]]*)\]\(([\S]*)\)/g, "<a href=\"$2\">$1</a>");
		};

		for(var i = 0; i < msg_lines.length; i++) {
			formatted_msg.append($("<p>").html(add_markup(msg_lines[i])));
		}

		if (replace) {
			help_box.html(formatted_msg);
		} else {
			help_box.append(formatted_msg);
		}
	};

	var checkConditions = function(){
		$.each(conditions, function(key, value) {
			if(value()) {
				setMessage(key);
				return false;
			}
		});
	};

	$("div[role=main]").delegate("a", "click", function() {
		var link = $(this).attr("href");

		if(link === "#show_help") {
			setMessage("step1", true);
			return false;
		} else if(link === "#no_help") {
			setMessage("skip", true);
			return false;
		} else {
			$(this).attr("target", "_blank");
		}
	});

	setupHelpBox();
	checkConditions();

})();