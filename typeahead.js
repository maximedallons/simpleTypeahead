(function ($) {
    const defaultOptions = {
        property: 'name',
        minChars: 2,
        highlight: true,
        handle: () => {},
        success: () => {},
        fail: (response) => console.error("Failed to fetch data: " + response.status + " " + response.statusText),
        loading: () => {},
        initialized: () => {},
        dataError: (property) => console.error(`All data elements must have a '${property}' attribute`),
    };

    async function fetchData(data, handler) {
        handler.loading();
        const response = await fetch(data);
        if (!response.ok) {
            handler.fail(response);
            return;
        }
        handler.success(response);
        return await response.json();
    }

    function matchInput(value, data, prop) {
        let strongMatch = new RegExp("^" + value, "i");
        let weakMatch = new RegExp(value, "i");
        return data
            .filter(item => weakMatch.test(item[prop]))
            .sort((a, b) => {
                if (strongMatch.test(a[prop]) && !strongMatch.test(b[prop]))
                    return -1;
                if (!strongMatch.test(a[prop]) && strongMatch.test(b[prop]))
                    return 1;
                return a[prop] < b[prop] ? -1 : 1;
            });
    }

    $.fn.typeahead = function (data, options) {
        const typeahead = {
            async init(input, options) {
                this.input = input;
                this.options = { ...defaultOptions, ...options };

                //String == URL
                if (typeof data === "string") {
                    this.data = await fetchData(data, this.options);
                } else {
                    this.data = data;
                }

                if (!this.data || !this.data.every(item => item[this.options.property])) {
                    this.options.dataError(this.options.property);
                    return;
                }

                this.input.addClass("typeahead");
                this.input.wrap("<div class='typeahead-wrapper'></div>");
                this.resultHolder = $("<div class='typeahead-content'></div>");
                this.resultHolder.css("display", "flex");
                this.resultHolder.insertAfter(this.input);
                this.resultHolder.hide();

                this.input.on("input", this.handleInput.bind(this));
                $(document).on('mousedown', this.handleDocumentClick.bind(this));
                this.options.initialized();
            },
            handleInput: function () {
                this.clearResults();
                let value = this.input.val();
                if (value.length < this.options.minChars) {
                    this.resultHolder.hide();
                    return;
                }

                let results = matchInput(value, this.data, this.options.property);
                for (let item of results) {
                    let listItem = $("<a></a>");
                    let matchedText = new RegExp(value, "i").exec(item[this.options.property])[0];
                    if (this.options.highlight) {
                        listItem.html(
                            item[this.options.property].replace(
                                matchedText,
                                "<match>" + matchedText + "</match>"
                            )
                        );
                    } else {
                        listItem.html(item[this.options.property]);
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
                this.input.val($(event.target).data("item")[this.options.property]);
                this.options.handle($(event.target).data("item"), event);
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