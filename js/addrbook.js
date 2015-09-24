$(document).ready(function () {



    $.fn.initpage = $.ajax({
        type: 'GET',
        url: 'addrbook.php?initpage=true',
        data: {load_page: 'value'},
        initpage: 'initpage',
        dataType: 'json',
        success: function (data) {
            var k = 0;
            var contact_row_template = '<tr contact_id="contact_tempid">' +
                    '<td class="editformfield">fname</td>' +
                    '<td class="editformfield">lname</td>' +
                    '<td class="editformfield">number__</td>' +
                    '<td class="editformfield">street__</td>' +
                    '<td class="editformfield">suburb__</td>' +
                    '<td class="editformfield" state_id="tempid">state__</td>' +
                    '<td><button type="button" class="btn btn-info btn-lg btn-block" ' +
                    'data-toggle="modal" data-target="#editModal" onclick="$.contactEditFormFields(this)" >Edit</button>' +
                    '<button class="btn-block">Delete</button></td></tr>';

            var state_option = "<option state_id='tempid'>state_name</option>"

            var rows = data[0];
            var states = data[1];

            var stateidmap = "";

            ////init state options is used for mapping of state id to state name
            ////this loop creates 
            $.each(states, function () {
                stateidmap += this.id + "__" + this.state_name + ",";
                var option = state_option.replace("state_name", this.state_name);
                option = option.replace("tempid", this.id);
                $("#edformstate").append(option);
            });

            $("#states_div").append(stateidmap);
            ///init contacts table
            $.each(rows, function () {
                var nr = contact_row_template;
                nr = nr.replace('contact_tempid', this.id);//record contact id from contacs table
                nr = nr.replace('fname', this.first_name);
                nr = nr.replace('lname', this.last_name);
                nr = nr.replace('number__', this.number);
                nr = nr.replace('street__', this.street);
                nr = nr.replace('suburb__', this.suburb);

                nr = nr.replace("tempid", this.state);//record state id from states table


                var state = $.mapStateID2StateName(this.state);
                nr = nr.replace('state__', state);

                $("#contacts_table > tbody:last").append(nr);
            });

        }
    });


    $.mapStateID2StateName = function (id) {
        var stateidmap = $("#states_div").text();
        var sti = stateidmap.indexOf(id + "__");
        if (sti < 0) {
            return NULL;
        }
        var ss = stateidmap.substring(sti);
        var state = ss.split(",")[0].split("__")[1];
        return state;
    }

    /*
     * 
     * @param {type} e
     * @returns {void}
     */
    $.contactEditFormFields = function initFields(e) {
        var fields = [];
        var formfields = [];
        $.contactrow = e.parentElement.parentElement;

        var cc = $.contactrow.childNodes;

        $.state_number = (cc[5]).getAttribute("state_id");
        $.each(cc, function () {               // Visits every single <td> element
            var el = $(this)[0];
            var uu = el.textContent.trim();
            if (el.className === "editformfield") {
                fields.push(uu);
                formfields.push(el);
            }        // Prints out the text within the <td>
        });

        $.addressbookformfieldvalues = fields;
        $.addressbookrowfields = formfields;
        $.update_contact = true;

    };
    /*
     * 
     */
    $('#editModal').on('show.bs.modal', function (e) {
        var ffs = $('.modaleditformfields');//modal form fields

        var k = 0;
        $.each(ffs, function () {
            var uu = $(this)[0];
            var txt = $.addressbookformfieldvalues[k++];
            uu.value = txt;
        });
    });
    /*
     * TODO: Modal form submit process
     * TODO: sends ajax post and receives contact after update and refreshes 
     */
    $('#editmodalformsubmit').on('click', function () {

        //TODO send ajax to save the changes if any
        var ffs = $('.modaleditformfields');//get modal form fields
        var k = 0;


        for (k = 0; k < ffs.length; k++) {
            var uu = ffs[k];
            var tff = $.addressbookrowfields[k];
            tff.innerHTML = uu.value;

        }
        //find selected state option
        var state_option = $("#edformstate").find(":selected");

        var reqdata = {
            id: $.contactrow.getAttribute('contact_id'),
            first_name: ffs[0].value,
            last_name: ffs[1].value,
            number: ffs[2].value,
            street: ffs[3].value,
            suburb: ffs[4].value,
            state: state_option.attr('state_id'),
            update_contact: 'update'
        };

        jQuery.fn.extend({
            upd_contact: $.ajax({
                type: 'POST',
                url: "addrbook.php",
                dataType: 'json',
                data: reqdata,
                cache: false,
                success: function (data) {
                    console.log('Inside post success = ' + data);
                    $.initpage();
                },
                error: function (xhr, textStatus, errorThrown) {
                    console.log('post Error ' + textStatus);
                }
            })
        });
        $.upd_contact();
        //console.log('updated first name = ' + ffs[0].value);
        //console.log('updated last  name = ' + ffs[1].value);
        //return;
    });


});