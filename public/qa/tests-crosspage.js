var Browser = require('zombie');
var assert = require('chai').assert;

var browser;
suite('Cross-Page Tests',function(){
    setup(function(){
        browser = new Browser();
    });
    test('requesting a group rate quote from the hood river tour page'+'should populate the referrer field',function(done){
        var referrer = 'http:/localchost:3300/tours/hood-river';
        browser.visit(referrer,function(){
            browser.clickLink('.requestGroupRate',function(){
                assert(browser.field('referrer').value ===referrer);
                done();
            });
        });
    });
    test('requesting a group rate quote from the hood river tour page'+'should populate the referrer field',function(done){
        var referrer = 'http:/localchost:3300/tours/oregon-coast';
        browser.visit(referrer,function(){
            browser.clickLink('.requestGroupRate',function(){
                assert(browser.field('referrer').value ===referrer);
                done();
            });
        });
    });
    test('visiting the" request  group rate" page directly should result in a empty referrer field ',function(done){
        var referrer = 'http:/localchost:3300/tours/request-group-rate';
        browser.visit(referrer,function(){
            browser.clickLink('.requestGroupRate',function(){
                assert(browser.field('referrer').value ==='');
                done();
            });
        });
    });
    //  mocha -u tdd -R spec qa/tests-crosspage.js 2>/dev/null
  

});
