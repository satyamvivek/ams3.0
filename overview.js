$(document).ready(function() {
  console.log("document ready");
  load_data();

  function load_data() {
    console.log("Loading");
  
    $.ajax({
      url: "http://localhost:3000/Allassets",
      method: "POST",
      data: { action: 'fetch' },
      dataType: "JSON",
      success: function(data) {
        var html = '';

        for (let i = 0; i < data.length; i++) {
          html += `
            <tr>
              <td>${data[i].asset_id}</td>
              <td>${data[i].asset_type}</td>
              <td>${data[i].asset_name}</td>
              <td>${data[i].dept_name}</td>
              <td>${data[i].emp_name}</td>
              <td>${data[i].emp_no}</td>
              <td>${data[i].location_name}</td>
              <td><button class="btn-info edit-btn">Edit</button></td>
            </tr>
          `;
        }

        console.log('data length', data.length);

        $(".table-body").html(html);

        //$(".table-body")[0].style.display = 'none';

        getPagination('.table-body');
      }
    });
  }

  $(document).on("click", ".edit-btn", function() {
    //var asset_id = $(this).closest('tr'); //.find('.table-body').text();
    //console.log($(this));

    //find the closest tr for the clicked edit btn
    let trElement = $(this).closest('tr');
    //console.log(trElement);
  
    //find all the td elements in the trElement
    let tdArray = trElement[0].getElementsByTagName('td');

    //select 1st td for asset_id and 2nd td element for asset type
    let asset_id = tdArray[0].innerText;
    let asset_type = tdArray[1].innerText;
    let asset_name = tdArray[2].innerText;
    let dept_name = tdArray[3].innerText;
    let emp_name = tdArray[4].innerText;
    let emp_no = tdArray[5].innerText;
    let location_name = tdArray[6].innerText;

    console.log('asset_id on click: ' + asset_id + ' '+ asset_type);


    call_edit_registration_popup($(this), asset_id, asset_type, asset_name, dept_name, emp_name, emp_no, location_name);

    // Make an AJAX request to fetch the edit form content
    // $.ajax({
    //   url: "http://localhost:9090/edit",
    //   method: "POST",
    //   data: { asset_id: asset_id,
    //           asset_type: asset_type,
    //   },
    //   success: function(response) {
    //     console.log(response);
    //     $('#edit-popup').html(response.data.asset_id);
    //     $('#edit-popup').show();
    //   },
    //   error: function() {
    //     alert('Error occurred while loading the edit form.');
    //   }
    // });
  });
});

function call_edit_registration_popup(e, asset_id, asset_type, asset_name, dept_name, emp_name, emp_no, location_name){
  let thisBtn = $(e);
  console.log(thisBtn[0]);
  
  let editBtn = thisBtn[0]; //document.getElementsByClassName('edit-btn');
  // select the modal-background
  let modalBackgroundEdit = document.getElementById('modal-background-edit-asset');
  // select the close-btn 
  let closeBtnEdit = document.getElementById('close-btn-edit-asset');

  // shows the modal when the user clicks open-btn
  modalBackgroundEdit.style.display = 'block';

  //set values to the fields in edit registration form
  $('#asset-id-edit-asset').val(asset_id);
  $('#asset-type-edit-asset').val(asset_type);
  $('#asset-name-edit-asset').val(asset_name);
  $('#department-name-edit-asset').val(dept_name);
  $('#employee-name-edit-asset').val(emp_name);
  $('#employee-id-edit-asset').val(emp_no);
  $('#asset-location-edit-asset').val(location_name);
  // hides the modal when the user clicks close-btn
  closeBtnEdit.addEventListener('click', function () {
      modalBackgroundEdit.style.display = 'none';
  });

  // hides the modal when the user clicks outside the modal
  window.addEventListener('click', function (event) {
      // check if the event happened on the modal-background
      if (event.target === modalBackgroundEdit) {
          // hides the modal
          modalBackgroundEdit.style.display = 'none';
      }
  });
}



//Overview Table pagination function   
function getPagination(table) {
console.log('table', table)

var tableBodyElement = $(table)//document.getElementsByClassName(table)
console.log('tableBodyElement', tableBodyElement)

var lastPage = 1;
console.log("getPaging function called!!!!")

$('#maxRows').on('change', function(evt) {
    
    //$('.paginationprev').html('');						// reset pagination

   lastPage = 1;
    $('.pagination')
      .find('li')
      .slice(1, -1)
      .remove();
    var trnum = 0; // reset tr counter
    var maxRows = parseInt($(this).val()); // get Max Rows from select option
    console.log(`${maxRows} is selected from dropdown!!!`);

    if (maxRows == 5000) {
      $('.pagination').hide();
      console.log('pagination hide!!!')
    } else {
      $('.pagination').show();
      console.log('pagination show!!!')
    }

    var totalRows = tableBodyElement.find('tr').length; // numbers of rows
    console.log('totalRows: ', totalRows);

    $(tableBodyElement).find('tr').each(function() {
      // each TR in  table and not the header
      trnum++; // Start Counter
      //console.log(trnum);

      if (trnum > maxRows) {
        // if tr number gt maxRows

        $(this).hide(); // fade it out
      }
      if (trnum <= maxRows) {
        $(this).show();
      } // else fade in Important in case if it ..
    }); //  was fade out to fade it in
    if (totalRows > maxRows) {
      // if tr total rows gt max rows option
      var pagenum = Math.ceil(totalRows / maxRows); // ceil total(rows/maxrows) to get ..
      //	numbers of pages
      for (var i = 1; i <= pagenum; ) {
        // for each page append pagination li
        $('.pagination #prev')
          .before(
            '<li data-page="' +
              i +
              '">\
                <span>' +
              i++ +
              '<span class="sr-only">(current)</span></span>\
              </li>'
          )
          .show();
      } // end for i
    } // end if row count > max rows
    $('.pagination [data-page="1"]').addClass('active'); // add active class to the first li
    $('.pagination li').on('click', function(evt) {
      // on click each page
      evt.stopImmediatePropagation();
      evt.preventDefault();
      var pageNum = $(this).attr('data-page'); // get it's number

      var maxRows = parseInt($('#maxRows').val()); // get Max Rows from select option

      if (pageNum == 'prev') {
        if (lastPage == 1) {
          return;
        }
        pageNum = --lastPage;
      }
      if (pageNum == 'next') {
        if (lastPage == $('.pagination li').length - 2) {
          return;
        }
        pageNum = ++lastPage;
      }

      lastPage = pageNum;
      var trIndex = 0; // reset tr counter
      $('.pagination li').removeClass('active'); // remove active class from all li
      $('.pagination [data-page="' + lastPage + '"]').addClass('active'); // add active class to the clicked
      // $(this).addClass('active');					// add active class to the clicked
      limitPagging();

      $(tableBodyElement).find('tr').each(function() {
        // each tr in table not the header
        trIndex++; // tr index counter
        // if tr index gt maxRows*pageNum or lt maxRows*pageNum-maxRows fade if out
        if (
          trIndex > maxRows * pageNum ||
          trIndex <= maxRows * pageNum - maxRows
        ) {
          $(this).hide();
        } else {
          $(this).show();
        } //else fade in
      }); // end of for each tr in table
    }); // end of on click pagination list
  limitPagging();
  })
  .val(50)
  .change();

// end of on select change

// END OF PAGINATION
}

function limitPagging(){

if($('.pagination li').length > 7 ){
    if( $('.pagination li.active').attr('data-page') <= 3 ){
    $('.pagination li:gt(5)').hide();
    $('.pagination li:lt(5)').show();
    $('.pagination [data-page="next"]').show();
  }if ($('.pagination li.active').attr('data-page') > 3){
    $('.pagination li:gt(0)').hide();
    $('.pagination [data-page="next"]').show();
    for( let i = ( parseInt($('.pagination li.active').attr('data-page'))  -2 )  ; i <= ( parseInt($('.pagination li.active').attr('data-page'))  + 2 ) ; i++ ){
      $('.pagination [data-page="'+i+'"]').show();
    }
  }
}
}

// $(function() {
//   // Just to append id number for each row
//   $('table tr:eq(0)').prepend('<th> ID </th>');

//   var id = 0;

//   $('table tr:gt(0)').each(function() {
//     id++;
//     $(this).prepend('<td>' + id + '</td>');
//   });
// });

$(document).on('click', '.adv_open-btn', function() {
$.ajax({
  url: "",
  method: "POST",
  data: { action: 'fetch' },
  dataType: "JSON",
  success: function(response) {
    if (response.code == "NO_DATA_FOUND") {
      $(".no-data-message").show(); // Show the message
      $(".table-body").empty(); // Clear the table body
    } else {
      $(".no-data-message").hide(); // Hide the message

      var html = '';
      for (let i = 0; i < response.data.length; i++) {
        html += `
          <tr>
            <td>${response.data[i].asset_id}</td>
            <td>${response.data[i].asset_type}</td>
            <td>${response.data[i].asset_name}</td>
            <td>${response.data[i].dept_name}</td>
            <td>${response.data[i].emp_name}</td>
            <td>${response.data[i].emp_no}</td>
            <td>${response.data[i].location_name}</td>
            <td><button class="btn-info edit-btn">Edit</button></td>
          </tr>
        `;
      }

      $(".table-body").html(html);

      getPagination('.table-body');

      // Clear form data
      $('#myForm')[0].reset();

      // Hide pop-up
      $(  ).hide();
    }
  }
});
});






//single asset Reg form
fetch('http://localhost:3000/fetchdname')
.then(res => res.json())
.then(data => {

    const { message} = data
    const dept_name_list = message.dept_name.map((dept) => {
      return dept.dept_name;
    });
    console.log(dept_name_list);
    var selectElement = document.getElementById('dname');

    dept_name_list.forEach(element => {
      $('#dname')[0].appendChild(new Option(element, element, false, false))
    });
    //$('#dname').val(message.dept_name);

    
})
.catch(err => console.error(err))
// for tag_uuid branch wise automation
function updateField() {
  var branch = document.getElementById("dname").value;
  var field = document.getElementById("tag_uuid");
  
  if (branch.trim() === '') {
    alert("department field is mandatory.");
    return;
  }
  
  field.value = "SA/" + branch.toUpperCase() +"/xy"+ "/1009";
  field.disabled = false;
  field.addEventListener('input', function() {
    var parts = field.value.split('/');
    parts[1] = 'CSE';
    field.value = parts.join('/');
  });
}



// for tag_uuid branch wise automation
function updateField() {
  var branch = document.getElementById("dname").value;
  var field = document.getElementById("tag_uuid");

  if (branch.trim() === '') {
    alert("department field is mandatory.");
    return;
  }

  field.value = "SA/" + branch.toUpperCase() +"/xy"+ "/1009";
  field.disabled = false;
  field.addEventListener('input', function() {
    var parts = field.value.split('/');
    parts[1] = 'CSE';
    field.value = parts.join('/');
  });
}



function fetchData(){
  var dn=document.getElementById('dname').value
  //console.log('dn: '+dn);
  fetch('http://localhost:3000/ddata?dn='+dn)
  .then(res => res.json())
  .then(data=>{
    console.log(data.message);

      if(data.message){
        $('#did').val(data.message.dept_id);
      }
      else{
        document.getElementById('did').value="";
      
      }
    })
    .catch(error=> console.error(error));
  }


}

// $(document).ready(function(){

 let aid = document.getElementById('asset-id');

let aname = document.getElementById('asset-name');

let atype = document.getElementById('asset-type');

let assetpi = document.getElementById('asset-price');

let di = document.getElementById('did');

let empno = document.getElementById('emp_no');

let taguid = document.getElementById('tag_uuid');


document.getElementById('submitAssetForm').addEventListener('click', (function(e){
  e.preventDefault();
  let assetdv = aid.value;
  let assetnv = aname.value;
  let assettv = atype.value;
  let assetpv = assetpi.value;
  let deptidv = di.value;
  let empidv = empno.value;
  let taguidv= taguid.value;

  // Validate input fields
  if (!assetdv || !assetnv || !assettv || !assetpv || !deptidv || !empidv || !taguidv) {
    alert('Please fill in all required fields.');
    return;
  }

    // Validate tag UUID format
  // var tagUuidRegex = /^SA\/[a-z]{3}\/[a-z]\d\/\d{4}$/;
  // if (!tagUuidRegex.test(taguidv)) {
  //   alert("Invalid tag UUID format");
  //   return;
  // }

    // Validate empId format
  var empIdRegex = /^\d{6}$/;
if (!empidv.match(empIdRegex)) {
alert('Employee ID must be a 6-digit number.');
return;
}

// Validate asset ID based on asset class

var assetIdRegex = /^\d{12}$/;
if (!assetdv.match(assetIdRegex)) {
alert('Asset ID must be a 12-digit number.');
return;
}


// var assetClassValue = assetClass.value; 

// var assetIdRegex = new RegExp('^' + assetClassValue + '\\d{10}$');

// if (!assetdv.match(assetIdRegex)) {
//   alert('Invalid asset ID for the specified asset class.');
//   return;
// }


// Set the URL and request method
  var url = 'http://localhost:3000/assetreg'; // Replace with your server-side script URL
  var method = 'POST'; // Replace with the desired request method
// console.log(assetdv )
  // Send the form data using AJAX
  $.ajax({
    url: url,
    type: method,
    data: {assetd:assetdv,
      assetn: assetnv,
      assett: assettv,
      assetp:assetpv,
      deptid:deptidv,
      empid:empidv,
      taguid:taguidv},
      
    success: function(response) {
     
      //Handle the successful response

      if(response.code == "Insertion has been done to tags and assets"){
        alert(response.response);
        console.log(response.response);
        resetForm();
      }
      else if(response.code == "Insertion has been done to tags"){
        alert(response.response);
        console.log(response.response);
        resetForm();
      }
      else if(response.code == "Insertion has been done to assets"){  
        alert(response.response);
        console.log(response.response);
        resetForm();
      }
      else{
        alert(response.response);
        console.log(response.response);
      }
    
      
      

    },
    error: function(xhr, status, error) {
      // Handle the error response
      console.log(error);
    }
  });
})
);



$(document).ready(function () {
  $('#uploadBtns').on('click', function () {
    var fileInput = $('#uploadFile')[0];
    var file = fileInput.files[0];

    if (file) {
      var formData = new FormData();
      formData.append('uploadFile', file);

      $.ajax({
        url: 'http://localhost:3000/assetupload',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
          $('#mess').text(response);
          console.log(response);
          alert(response);
        },
        error: function (error) {
          $('#mess').text('Error uploading file.');
        }
      });
    }
  });
});