var Browser = require('zombie'),
    assert = require('chai').assert;

var browser;

function getBrowserReferer(browser) {
    return browser.resources[0].request.headers._headers.filter(function (item) {
        return item[0] === 'referer';
    })[0][1];
}

suite('Cross-Page Tests', function () {
    setup(function () {
        browser = new Browser();
    });
    test('requesting a group rate quote from the hood river tour page ' +
        'should populate the referrer field',
        function (done) {
            var referrer = 'http://localhost:3000/tours/hood-river';
            browser.visit(referrer, function () {
                browser.clickLink('.requestGroupRate', function () {
                    var refererBrowser = getBrowserReferer(browser);
                    assert(refererBrowser === referrer);
                    done();
                });
            });
        });
    test('requesting a group rate from the oregon coast tour page should ' +
        'populate the referrer field',
        function (done) {
            var referrer = 'http://localhost:3000/tours/oregon-coast';
            browser.visit(referrer, function () {
                browser.clickLink('.requestGroupRate', function () {
                    var refererBrowser = getBrowserReferer(browser);
                    assert(refererBrowser === referrer);
                    done();
                });
            });
        });
    test('visiting the "request group rate" page dirctly should result ' +
        'in an empty referrer field',
        function (done) {
            browser.visit('http://localhost:3000/tours/request-group-rate',
                function () {
                    assert(browser.field('referrer').value === '');
                    done();
                });
        });
});
