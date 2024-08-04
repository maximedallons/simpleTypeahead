(function ($) {
    $.fn.typeahead = function (data, options) {
        const typeahead = {
            async init(input, options) {
                this.input = input;
                if (!this.input) return;

                if (typeof data === "string") {
                    const response = await fetch(data);
                    if (!response.ok) {
                        console.error('Network response was not ok', await response.text());
                        return;
                    }
                    this.data = await response.json();
                } else {
                    this.data =  data;
                }

                this.options = options || {};
                this.minChars = this.options.minChars || 2;
                this.highlight = this.options.highlight !== undefined ? this.options.highlight : true;
                this.handle = this.options.handle || function () {};

                this.input.addClass("typeahead");
                this.input.wrap("<div class='typeahead-wrapper'></div>");
                this.resultHolder = $("<div class='typeahead-content'></div>");
                this.resultHolder.css("display", "flex");
                this.resultHolder.insertAfter(this.input);
                this.resultHolder.hide();

                this.input.on("input", this.handleInput.bind(this));
                $(document).on('mousedown', this.handleDocumentClick.bind(this));
            },
            handleInput: function () {
                this.clearResults();
                let value = this.input.val();
                if (value.length < this.minChars) {
                    this.resultHolder.hide();
                    return;
                }

                let strongMatch = new RegExp("^" + value, "i");
                let weakMatch = new RegExp(value, "i");
                let results = this.data
                    .filter(item => weakMatch.test(item.name))
                    .sort((a, b) => {
                        if (strongMatch.test(a.name) && !strongMatch.test(b.name))
                            return -1;
                        if (!strongMatch.test(a.name) && strongMatch.test(b.name))
                            return 1;
                        return a.name < b.name ? -1 : 1;
                    });
                for (let item of results) {
                    let listItem = $("<a></a>");
                    let matchedText = weakMatch.exec(item.name)[0];
                    if (this.highlight) {
                        listItem.html(
                            item.name.replace(
                                matchedText,
                                "<match>" + matchedText + "</match>"
                            )
                        );
                    } else {
                        listItem.html(item.name);
                    }
                    listItem.data("item", item);
                    this.input.next().append(listItem);
                    listItem.on("click", this.handleClick.bind(this));
                }
                if (results.length > 0)
                    this.resultHolder.show();
                else
                    this.resultHolder.hide();
            },
            handleClick: function (event) {
                this.input.val($(event.target).data("item").name);
                this.handle($(event.target).data("item"), event);
                this.resultHolder.hide();
            },
            clearResults: function () {
                this.resultHolder.empty();
            },
            handleDocumentClick: function (event) {
                if ($(event.target).closest('.typeahead-wrapper').length === 0) {
                    this.resultHolder.hide();
                }
            },
        };
        typeahead.init(this, options).then(r => r);
        return this;
    };
})(jQuery);