$(document).ready(function () {
    var addrbook = {};
    /*
     * template for each contact row
     */
    $.contact_row_template = '<tr contact_id="contact_tempid">' +
            '<td class="editformfield">fname</td>' +
            '<td class="editformfield">lname</td>' +
            '<td class="editformfield">number__</td>' +
            '<td class="editformfield">street__</td>' +
            '<td class="editformfield">suburb__</td>' +
            '<td class="editformfield" state_id="tempid">state__</td>' +
            '<td><button type="button" class="btn btn-info btn-lg btn-block" ' +
            'data-toggle="modal" data-target="#editModal" onclick="$.contactEditFormFields(this)" >Edit</button>' +
            '<button class="btn-block" onclick="$.del_contact(this)">Delete</button></td></tr>';

    
    /**Creates the table of contacts:
     * sends a get all contacts and all states requests to the backend &
     * creates the table of contacts based on the received contacts
     */

    $.ajax({
        type: 'GET',
        url: 'addrbook.php?initpage=true',
        data: {load_page: 'value'},
        initpage: 'initpage',
        dataType: 'json',
        success: function (data) {
            var k = 0;

            var state_option = "<option state_id='tempid'>state_name</option>"

            var rows = data[0];
            var states = data[1];

            var stateidmap = "";

            ////init state options is used for mapping of state id to state name
            ////this loop creates something like: 1__NSW,2__VIC,3__QLD,4__WA,5__NT
            ////each number represents the id of its associated state in DB
            $.each(states, function () {
                stateidmap += this.id + "__" + this.state_name + ",";
                var option = state_option.replace("state_name", this.state_name);
                option = option.replace("tempid", this.id);
                $("#edformstate").append(option);
            });

            $("#states_div").append(stateidmap);
            ///init contacts table
            $.each(rows, function () {
                var nr = $.contact_row_template;
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
            if (rows.length>1){//TODO find a proper fix delete the dummy row for now
                $("#contacts_table")[0].deleteRow(0);
            }
            TBL.paginate(5);
        }
    });


    /*
     * Creates mapping dtring for state name to corresponding id
     * @param {type} id
     * @returns {RegExp.mapStateID2StateName.state}
     */
    $.mapStateID2StateName = function (id) {
        var stateidmap = $("#states_div").text();
        var sti = stateidmap.indexOf(id + "__");
        if (sti < 0) {
            return NULL;
        }
        var ss = stateidmap.substring(sti);
        var state = ss.split(",")[0].split("__")[1];
        return state;
    };
    /**
     * 
     * @param {type} nm:state_name
     * @returns state id for the given state name
     */
    addrbook.mapStateName2StateID = function (nm) {
        var stateidmap = $("#states_div").text();
        var sti = stateidmap.indexOf("__"+nm);
        if (sti < 0) {
            return NULL;
        }
        var ss = stateidmap.substring(0,sti);
        
        var states = ss.split(",");
        var state = states[states.length-1];
        return state;
    };

    /*
     * This method is called for both add new content and edit existing content
     * This method stores selected row fields value and row form fields in two
     * variables addressbookformfieldvalues and correspon
     * @param {type} e
     * @returns {void}
     */
    $.contactEditFormFields = function initFields(e) {
        if (e.textContent === "Add New Contact") {
            $.clear_modal_form_fields();
            $.update_contact = false;
            return;
        }
        $.update_contact = true;
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
        $.fill_modal_form_fields(fields);
        $.addressbookformfieldvalues = fields;
        $.addressbookrowfields = formfields;

    };
    /*
     * 
     * @param {type} fields
     * @returns void
     */
    $.fill_modal_form_fields = function (fields) {
        var ffs = $('.modaleditformfields');//modal form fields

        var k = 0;
        $.each(ffs, function () {
            var uu = $(this)[0];
            var txt = fields[k++];
            uu.value = txt;
        });
    }
    /**
     * clears modal form before being shown
     * @returns {undefined}
     */
    $.clear_modal_form_fields = function () {
        var ffs = $('.modaleditformfields');//modal form fields
        
        var k = 0;
        $.each(ffs, function () {
            var uu = $(this)[0];
            uu.value = "";
        });
    };
    /*
     * updates selected row (saved when a row edit button 
     * is clicked) using the form fields (in ffs)
     * @returns {undefined}
     */
    $.upd_selectedrow = function (ffs) {
        var nodes = $.contactrow.childNodes;

        for (var k = 0; k < ffs.length; k++) {
            var ch = nodes[k];
            var gch = ch.childNodes[0];
            gch.textContent = ffs[k].value.trim();

        }
    };
    /**
     * Adds a new contact 
     * @param {type} ffs
     * @param {type} id
     * @returns void
     */
    $.add_new_contact = function (ffs, id) {
        var nr = $.contact_row_template;
        nr = nr.replace('contact_tempid', id);//record contact id from contacs table
        nr = nr.replace('fname', ffs[0].value);
        nr = nr.replace('lname', ffs[1].value);
        nr = nr.replace('number__', ffs[2].value);
        nr = nr.replace('street__', ffs[3].value);
        nr = nr.replace('suburb__', ffs[4].value);

        var state_id = addrbook.mapStateName2StateID(ffs[5].value);//
        nr = nr.replace("tempid", state_id);//record state id from states table

        nr = nr.replace('state__', ffs[5].value);//insert state name in the row
        $("#contacts_table > tbody:last").append(nr);//add contact row to the bottom of the row
        TBL.Contact_Update();
        // nr.insertBefore('table > tbody > tr:first')
        //$("#contacts_table > tbody:first").append(nr);
    };
    /*
     * submits the modal form to the backend
     * sends update request if edit button pressed
     * sends add contact request if add button pressed
     *
     */
    $('#editmodalform').on('click', '#editmodalformsubmit', function (e) {
        
        e.preventDefault();
        //TODO send ajax to save the changes if any
        var ffs = $("#editmodalform").serializeArray();
        var fields = $(".modaleditformfields");
        //find selected state option
        var state_option = $("#edformstate").find(":selected");
        
        //validate form inputs 
        var invalid=false;
        $.each(fields, function(){
            var uu = $(this)[0];
            var attr = $(this).attr('required');
           if(uu.value.length <1 && attr==='required'){
               alert("please enter a valid "+uu.attributes['name'].value);
               invalid=true;
               return false;
               
           } 
        });
       
       if(invalid){
            return;
        }
        
        if ($.update_contact) {
            $.update_contact_post_req(e, ffs, state_option);
            return;
        } else {
            $.add_contact_post_req(e, ffs, state_option);
            return;
        }

        //console.log('updated first name = ' + ffs[0].value);
        //console.log('updated last  name = ' + ffs[1].value);

    });

    $.update_contact_post_req = function (e, ffs, state_option) {
        var reqdata = {
            id: $.contactrow.getAttribute('contact_id'),
            first_name: ffs[0].value.trim(),
            last_name: ffs[1].value.trim(),
            number: ffs[2].value.trim(),
            street: ffs[3].value.trim(),
            suburb: ffs[4].value.trim(),
            state: state_option.attr('state_id'),
            update_contact: 'update'
        };


        $.ajax({
            type: 'POST',
            url: "addrbook.php",
            dataType: 'json',
            data: reqdata,
            cache: false,
            success: function (data) {
                console.log('Inside post update success = ' + data);
                $("#editModal").hide();
                $.upd_selectedrow(ffs);
                //$.initpage();

            },
            error: function (xhr, textStatus, errorThrown) {
                console.log('post Error ' + textStatus);
            }
        });
    };

    $.add_contact_post_req = function (e, ffs, state_option) {        
        var reqdata = {
            first_name: ffs[0].value.trim(),
            last_name: ffs[1].value.trim(),
            number: ffs[2].value.trim(),
            street: ffs[3].value.trim(),
            suburb: ffs[4].value.trim(),
            state: state_option.attr('state_id'),
            add_new_ontact: 'add'
        };
        $('body').show()
        
        $.ajax({
            type: 'POST',
            url: "addrbook.php",
            dataType: 'json',
            data: reqdata,
            cache: false,
            success: function (data) {
                console.log('Inside post add success = ' + data);
                $("#editModal").hide();
                if (data['success']) {
                    $.add_new_contact(ffs, data);
                }
                //$.initpage();

            },
            error: function (xhr, textStatus, errorThrown) {
                console.log('post Error ' + textStatus);
            }
        });

    }

    /*
     * deletes the selected contact
     */
    $.del_contact = function (delbutton) {
        var row = delbutton.parentElement.parentElement;
        var rid = row.getAttribute('contact_id');
        var reqdata = {id: rid, del_contact: 'del_contact'};
        $.ajax({
            type: 'POST',
            url: "addrbook.php",
            dataType: 'json',
            data: reqdata,
            cache: false,
            success: function (data) {
                console.log('Inside post delete success = ' + data);
                row.remove();
                TBL.Contact_Update();
                return true;

            },
            error: function (xhr, textStatus, errorThrown) {
                console.log('post Error ' + textStatus);
                return false;
            }
        });
    };
    
    var TBL = {};
    
    TBL.pagination_li_template = '<li id="contact_page_number"><a href="#">page_number</a></li>';    
    TBL.paginate = function(PG_LEN){
        var tbl = $("#contacts_table");
        var rows = tbl.find('tbody > tr');
        var num_pages = Math.ceil(rows.length/PG_LEN)-1;
        var current = 0;
        
        var pgnav = $("#paginate_ul");
        var prev_nav = $("#prev_pg_nav");
        var next_nav = $("#next_pg_nav");
        var cur_page = $("#current_contact_page")
        
        prev_nav.addClass('disabled').click(function (){
            pagination('<');
        });
        next_nav.click(function(){
            pagination('>');
        });
        
        //======= Show Initial rows
        
        rows.hide().slice(0, PG_LEN).show();
        
        pagination = function (direction) {
            var reveal = function (current) {
                prev_nav.addClass('disabled');
                next_nav.addClass('disabled');
                rows
                        .hide()
                        .slice(current*PG_LEN, current*PG_LEN + PG_LEN)
                        .show();
                cur_page.text(current+1);                
            };
            if (direction =="<"){//previous
                next_nav.addClass('active');
                if(current>1){
                    current -=1;
                }else if (current ==1){
                    prev_nav.addClass('disabled');
                    current=0;
                }
            }else {//next page
                prev_nav.addClass('active');
                if (current < num_pages-1){
                    current +=1;                    
                }else if(current ==num_pages-1){
                    current = num_pages;
                    next_nav.addClass('disabled');
                }
            }
            reveal(current);
        };
        
        TBL.Contact_Update = function(){
            next_nav.addClass('disabled');
            prev_nav.addClass('active');
            rows = tbl.find('tbody > tr');
            num_pages  = Math.ceil(rows.length/PG_LEN)-1;
            current = num_pages-1;
            pagination('>');                        
        };
        
    };
    
    


});