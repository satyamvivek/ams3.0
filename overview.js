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
                <td><a href="#" class="btn-info edit-btn">Edit</a></td>
              </tr>
            `;
          }
  
          $(".table-body").html(html);
        }
      });
    }
  
    $(document).on("click", ".edit-btn", function() {
      var asset_id = $(this).closest('tr').find('.table-body').text();
  
      // Make an AJAX request to fetch the edit form content
      $.ajax({
        url: "http://localhost:3000/edit",
        method: "POST",
        data: { asset_id: asset_id },
        success: function(response) {
          $('#edit-popup').html(response);
          $('#edit-popup').show();
        },
        error: function() {
        
          alert('Error occurred while loading the edit form.');
        }
      });
    });
  });



//single asset Reg form
fetch('http://localhost:3000/fetchdname')
.then(res => res.json())
.then(data => {
     dept_nm=data;
     console.log(dept_nm)
    const { message,answer} = data
    const dept_name_list = message.dept_name.map((dept) => {
      return dept.dept_name;
    });
    const asset_type_list = answer.asset_type.map((asset) => {
      return asset.asset_type;
    });
    console.log(dept_name_list);
    console.log(asset_type_list);
    var selectElement = document.getElementById('dname');

    dept_name_list.forEach(element => {
      $('#dname')[0].appendChild(new Option(element, element, false, false))
    });

    asset_type_list.forEach(element => {
      $('#asset-type')[0].appendChild(new Option(element, element, false, false))
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
  function total(){
    fetchData();
    updateField();
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

      // Validate tag UUID format
    var tagUuidRegex = /^SA\/[A-Z]{3}\/[A-Z]\d\/\d{4}$/;
    if (!tagUuidRegex.test(taguidv)) {
      alert("Invalid tag UUID format");
      return;
    }
   

    // Set the URL and request method
    var url = 'http://localhost:3000/assetreg'; // Replace with your server-side script URL
    var method = 'POST'; // Replace with the desired request method
console.log(assetdv )
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
        },
        error: function (error) {
          $('#mess').text('Error uploading file.');
        }
      });
    }
  });
});