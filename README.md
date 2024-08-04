# SimpleTypeahead

SimpleTypeahead is a javascript library aimed at simplifying the selection of one element through an input with a dropdown.

## Installation

Please download the latest release and add it to your own project.

## Usage

Please note that in order for this library to work, you will need JQuery [https://jquery.com].
The version used for the creation of this library is 3.7.1.

#Initialisation

```javascript
var data = [
        {name: 'Afghanistan', code: 'AF'},
        {name: 'Åland Islands', code: 'AX'},
        {name: 'Albania', code: 'AL'},
        ...
];

$("#input").typeahead(data, {
    minChars: 1, //Default: 2
    highlight: false, //Default: true
    handle: function(item) { //Additional callback function [Optional]
        console.log(`Name: ${item.name}, Code: ${item.code}`);
    },
});
```
It also works with a url returning a json object.
```javascript
$("#input").typeahead("https://maximedallons.github.io/assets/countries.json", {
    ...
});
```
The only property that is mandatory is 'name'. As long as it is present, you're able to have any other properties in your json element and use it in the custom callback.

#Options
Note that all these options, as the name suggests, are optional. There is no need to implement them for the typeahead to work properly.

- **handle [default: null]** = Custom callback function that will be executed when an element is selected. The selected element will be passed as an argument, giving the ability to get any property from the json object.
- **property [default: 'name']** = Property to be displayed in the dropdown. If the property is not present in the json object, the library will default to 'name'.
- **minChars [default: 1]** = Minimum number of characters needed before the search is executed.
- **highlight [default: true]** = Highlights the characters matching the search query
- **success(response) [default: null]** = Custom callback function that will be executed when the data is successfully retrieved from the url.
- **fail(response) [default: logs the error]** = Custom callback function that will be executed when the data is not successfully retrieved from the url.
- **loading [default: null]** = Custom callback function that will be executed when the data is being retrieved from the url.
- **initialized [default: null]** = Custom callback function that will be executed when the data is correct and the dropdown ready to be displayed.
- **dataError [default: null]** = Custom callback function that will be executed when the data is not in the correct format. Usually when one or more elements are missing their defined property (default: name).


## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

No licenses. Please feel free to copy, upgrade and learn from my work.
