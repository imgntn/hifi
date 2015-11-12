(function() {

    function Test(){
        return
    }

    Test.prototype = {
           someMethod:function(){
            print('I WAS CALLED')
           }
    }
     return new Test();
})