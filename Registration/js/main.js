(function ($) {
    "use strict";

    /*==================================================================
    [ Focus Contact2 ]*/
    $('.input100').each(function(){
        $(this).on('blur', function(){
            if($(this).val() != "") {
                $(this).addClass('has-val');
            }
            else {
                $(this).removeClass('has-val');
            }
        })
    })


    /*==================================================================
    [ Validate after type ]*/
    $('.validate-input .input100').each(function(){
        $(this).on('blur', function(){
            if(validate(this) == false){
                showValidate(this);
            }
            else {
                $(this).parent().addClass('true-validate');
            }
        })
    })

    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit',function(){
        var check = true;

        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }

        return check;
    });


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
           $(this).parent().removeClass('true-validate');
        });
    });

    function validate (input){
        if($(input).attr('name') == 'email')
        {
            var x=/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/;
            if($(input).val().trim().match(x) == null )
            {
                return false;
            }
        }
        else if($(input).attr('name') == 'SID')
        {
            var x=/^\d{8}$/;
            if($(input).val().trim().match(x) == null )
            {
                return false;
            }
        }
        else if($(input).attr('name') == 'Mobile')
        {
            var x=/^\d{10}$/;
            if($(input).val().trim().match(x) == null )
            {
                return false;
            }
        }
        else if($(input).attr('name') == 'CGPA')
        {
            var x=/^\d{1}$/;
            var y=/^[1][0]$/;
            if($(input).val().trim().match(x) == null )
            {
                return false;
            }

        }
        else if($(input).attr('name') == 'repeat-pass')
        {
            var x= document.getElementsByName('pass')[0].value;
            if($(input).val().trim().match(x) == null )
            {
                return false;
            }
        }
        else if($(input).attr('name')  == 'Year')
        {
          if($(input).val().trim().match(" ") )
            return false;
        }
        else if($(input).attr('name')  == 'Branch')
        {
          if($(input).val().trim().match(" ") )
            return false;
        }
        else if($(input).attr('name')  == 'UG_PG')
        {
          if($(input).val().trim().match(" ") )
            return false;
        }
        else if($(input).attr('name')  == 'Backlog')
        {
          if($(input).val().trim().match(" ") )
            return false;
        }
        else if($(input).attr('name')  == 'D_A')
        {
          if($(input).val().trim().match(" ") )
            return false;
        }
        else
        {
           if($(input).val() == ''){
                return false;
            }
        }
    }


    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }



})(jQuery);
