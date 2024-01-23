
var input = document.querySelector("#phone");
var iti = window.intlTelInput(input, {
    initialCountry: "auto",
    separateDialCode: true,
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
});
// Update the flag when the selected country changes
iti.promise.then(function () {
    var flagElement = document.querySelector("#flag");
    flagElement.className = "iti__flag iti__" + iti.getSelectedCountryData().iso2;
});
