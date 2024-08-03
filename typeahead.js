(function ($) {
    $.fn.typeahead = function (data, onClick) {
        var typeahead = {
            selectedIndex: -1,
            init: function (input, options) {
                this.input = input;
                this.data = data;
                this.options = options || {};
                this.minChars = options.minChars || 2;
                this.highlight = options.highlight !== undefined ? options.highlight : true;
                this.handle = options.handle || function(){};
                if (!this.input) return;

                this.id = input.attr('id') ? input.attr('id') : Math.random().toString(36).substr(2, 9);
                this.input.addClass("typeahead");
                this.input.wrap("<div class='typeahead-wrapper'></div>");
                this.resultHolder = $("<div class='typeahead-content'></div>");
                this.resultHolder.attr('anchor', this.id);
                this.resultHolder.css("display", "flex");
                this.resultHolder.insertAfter(this.input);
                this.resultHolder.hide();
                this.input.on("input", this.handleInput.bind(this));
                this.input.on("keydown", this.handleKeydown.bind(this));
                $(document).on('mousedown', this.handleDocumentClick.bind(this));
            },
            handleInput: function () {
                this.clearResults();
                var value = this.input.val();
                if (value.length < this.minChars) {
                    this.resultHolder.hide();
                    return;
                }

                var strongMatch = new RegExp("^" + value, "i");
                var weakMatch = new RegExp(value, "i");
                var results = this.data
                    .filter(item => weakMatch.test(item.name))
                    .sort((a, b) => {
                        if (strongMatch.test(a.name) && !strongMatch.test(b.name))
                            return -1;
                        if (!strongMatch.test(a.name) && strongMatch.test(b.name))
                            return 1;
                        return a.name < b.name ? -1 : 1;
                    });
                for (var item of results) {
                    var listItem = $("<a></a>");
                    var matchedText = weakMatch.exec(item.name)[0];
                    if(this.highlight) {
                        listItem.html(
                            item.name.replace(
                                matchedText,
                                "<match>" + matchedText + "</match>"
                            )
                        );
                    }
                    else {
                        listItem.html(item.name);
                    }
                    listItem.data("item", item);
                    this.input.next().append(listItem);
                    listItem.on("click", this.handleClick.bind(this));
                }
                if(results.length > 0)
                    this.resultHolder.show();
                else
                    this.resultHolder.hide();
            },
            handleClick: function (event) {
                this.input.val($(event.target).data("item").name);
                this.handle($(event.target).data("item"), event);
                this.resultHolder.hide();
            },
            getResults: function () {
                return this.resultHolder.children();
            },
            clearResults: function () {
                this.selectedIndex = -1;
                this.resultHolder.empty();
            },
            handleKeydown: function (event) {
                var keyCode = event.keyCode;
                var results = this.getResults();
                if (keyCode === 40 && this.selectedIndex < results.length - 1) {
                    this.selectedIndex++;
                } else if (keyCode === 38 && this.selectedIndex >= 0) {
                    this.selectedIndex--;
                } else if (keyCode === 13 && this.onClick && results[this.selectedIndex]) {
                    this.handle($(results[this.selectedIndex]).data("item"), event);
                }
                for (var i = 0; i < results.length; i++) {
                    var result = $(results[i]);
                    var selectedClass = "selected";
                    if (i === this.selectedIndex) {
                        result.addClass(selectedClass);
                    } else if (result.hasClass(selectedClass)) {
                        result.removeClass(selectedClass);
                    }
                }
            },
            handleDocumentClick: function(event){
                if ($(event.target).closest('.typeahead-wrapper').length === 0) {
                    this.resultHolder.hide();
                }
            },
        };
        typeahead.init(this, onClick);
        return this;
    };
})(jQuery);