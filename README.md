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
The only property that is mandatory is 'name'. As long as it is present, you're able to have any other properties in your json element and use it in the custom callback.

#Options

- **minChars [default: 1]** = Minimum number of characters needed before the search is executed.
- **highlight [default: true]** = Highlights the characters matching the search query


## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

No licenses. Please feel free to copy, upgrade and learn from my work.
