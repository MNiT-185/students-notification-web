let userAvatar = null
let userInfo = {}
let originAvatarSrc = null
let originUser = {}
let facultyInfo = {}
let facultyPostInfo = {}
let newFeedsInfo = {}
let newFeeds = null
let idPost = null
let detailPostInfo = {}
let contentComment = null
let facultyUpdateInfo = {}
let idPostFacultyUpdated = null
let postDelInfo = {}
let updatedPost = {}
var socket = io();


function callUpdateUserAvatar(){
  $.ajax({
    url:"/user/update-avatar",
    type : "put",
    catch: false,
    contentType : false,
    processData : false,
    data: userAvatar,
    success: async function(result) {
      $(".user-modal-alert-success").find("span").text(result.message)
      $(".user-modal-alert-success").css("display","block")
      $("#imageUser").attr("src",result.imageSrc)
      $(".avatarUserSmall").attr("src",result.imageSrc)
      $(".avatarPostCmt").attr("src",result.imageSrc)
      $(".img-responsive").attr("src",result.imageSrc)
      $("#avatarPostNewFeed").attr("src",result.imageSrc)
      let listCmt = result.listComment
      let listPost = result.listPost
      if(listPost.length != 0){
        listPost.forEach(e => {
          $(`#${e._id}`).find("img").attr("src",result.imageSrc)
        });
      }
      if(listCmt.length != 0){
        listCmt.forEach(e => {
          $(`#${e._id}`).find("img").attr("src",result.imageSrc)
        });
      }
      originAvatarSrc = result.imageSrc
    },
    error : function(error) {
      $(".user-modal-alert-error").find("span").text(error.responseText)
      $(".user-modal-alert-error").css("display","block")
    },
  })
}

function callUpdateUserInfo(){
  $.ajax({
    url:"/user/update-info",
    type : "put",
    data: userInfo,
    success: function(result) {
     
      $(".user-modal-alert-success").find("span").text(result.message)
      $(".user-modal-alert-success").css("display","block")
      originUser = Object.assign(originUser,userInfo)
      $("#navbar-username").text(originUser.username)
    },
    error : function(error) {
      $(".user-modal-alert-error").find("span").text(error.responseText)
      $(".user-modal-alert-error").css("display","block")
      
    },
  })
}

function callUpdateFacultyInfo(){
  $.ajax({
    url:"/faculty/update-info",
    type : "put",
    data: facultyInfo,
    success: function(result) {
      $(".user-alert-success").find("span").text(result.message)
      $(".user-alert-success").css("display","block")
    },
    error : function(error) {
      $(".user-alert-error").find("span").text(error.responseText)
      $(".user-alert-error").css("display","block")
    },
  })
}

function callAddPostOfFaculty(){
  $.ajax({
    url:"/faculty/addPost",
    type : "post",
    data: facultyPostInfo,
    success: function(result) {
      $(".user-modal-alert-success").find("span").text(result.message)
      //Socket
      socket.emit('addPost', result);
      //CSS
      $(".user-modal-alert-success").css("display","block")
      $('#input-title-post-category').val("")
      $('#input-content-post-category').val("")
      $('#categoryPostSelect:checked').prop( "checked", false );
    },
    error : function(error) {
      $(".user-modal-alert-error").find("span").text(error.responseText)
      $(".user-modal-alert-error").css("display","block")
    },
  })
}


//Socket

socket.on('addPost', function(msg) {
  let post = msg.data
  let item = `<div  class="alert alert-default text-center mx-auto my-3 user-modal-alert-addPost">${post.sender.name} có thông báo mới:<a href="/user/detailPost/${post._id}">${post.title}</a></div>`
  $(".notification-real-time-addPost").append(item)
  $(".user-modal-alert-addPost").css("display","block")
  setTimeout(function(){$(".notification-real-time-addPost").find('.user-modal-alert-addPost').remove() }, 5000);
});

socket.on('addComment', function(msg) {
  $.ajax({
    url:"/getIdUserCurr",
    type : "get",
    success: function(result) {
      let idPost = "#postCmt" + msg.idPost
      
      if(result==msg.cmt.sender.id){
        let item = msg.item
        $(idPost).prepend(item);
      }else{
        let item = msg.itemGuess
        $(idPost).prepend(item);
      }
    }
  })
});

window.onload = function(){
  var el = document.getElementById("wrapper");
  var toggleButton = document.getElementById("menu-toggle");
  
  toggleButton.onclick = function () {
      el.classList.toggle("toggled");
  };   
}

//Main.js
$(document).ready(function() {
 
  $("#input-change-avatar").bind("change",function(){
    let fileData = $(this).prop("files")[0];
    let match = ["image/png","image/jpg","image/jpeg"]
    let limit = 1048576 //byte = 1MB
    
    if($.inArray(fileData.type,match) === -1){
      alertify.notify("Kiểu file không hợp lệ, chỉ chấp nhập jpg và png","error",7)
      $(this).val(null);
      return false
    }
    if(fileData.size > limit){
      alertify.notify("Ảnh upload tối đa cho phép là 1MB","error",7)
      $(this).val(null);
      return false
    }
    if(typeof(FileReader) != undefined){
      let image_review = $("#image-edit-profile");
      image_review.empty()

      let fileReader = new FileReader()
      fileReader.onload = function(element){
        $("<img>",{
          "src" : element.target.result,
          "id" : "imageUser",
          "class" : "avatar form-control",
          "alt" : "avatar"
        }).appendTo(image_review)
      }
      image_review.show()
      fileReader.readAsDataURL(fileData)

      let formData = new FormData()
      formData.append("avatar",fileData)

      userAvatar = formData

    }else{
      alertify.notify("Trình duyệt của bạn không hỗ trợ FileReader","error",7)
    }
    
  })

  $("#input-change-name").bind("change",function(){
    userInfo.username = $(this).val()
  })

  $("#input-change-gender").bind("click",function(){
    userInfo.gender = $(this).val() 
  })

  $("#input-change-faculty").bind("change",function(){
    userInfo.faculty = $(this).val() 
  })

  $("#input-change-class").bind("change",function(){
    userInfo.class = $(this).val() 
  })

  $('#oldPassword').bind("change",function(){
    facultyInfo.password = $(this).val() 
  })
  $('#newPassword').bind("change",function(){
    facultyInfo.newPassword = $(this).val() 
  })
  $('#confirmNewPassword').bind("change",function(){
    facultyInfo.confirmPassword = $(this).val() 
  })

  originAvatarSrc = $("#imageUser").attr("src")
  originUser = {
    username :  $("#input-change-name").val(),
    gender : $("#input-change-gender").val(),
    faculty : $("#input-change-faculty").val(),
    class : $("#input-change-class").val()
  }
  //console.log(originUser)

  $("#input-btn-update-user").bind("click",function(){
    if($.isEmptyObject(userInfo) && !userAvatar){
      alertify.notify("Bạn chưa thây đổi thông tin trước khi cập nhật","error",2)
      return false;
    }
    if(userAvatar){
      callUpdateUserAvatar();
    }
    if(!$.isEmptyObject(userInfo)){
      callUpdateUserInfo();;
    }
  })

  $("#btn-close-modal-update-user").bind("click",function(){
    $(".user-modal-alert-success").css("display","none")
    $(".user-modal-alert-error").css("display","none")
  })

  $('.btn-delete-falcuty').click(e=>{
    let btn = e.target
    let name =btn.dataset.name
    $('#deleteFalcuty').val(name)
  })


  $('.btn-delete-category').click(e=>{
    let btn = e.target
    let name =btn.dataset.name
    $('#deleteCategory').val(name)
    
  })

  $('.btn-update-category').click(e=>{
    let btn = e.target
    let name =btn.dataset.name
    $('#nameCategory').val(name)
  })

  $(document).on('click','#btn-update-facultymodal',function(e){
    let btn = e.target
    let {id} = btn.dataset
    let data ={
      id :id
    }
    $.ajax({
      url:"/admin/falcuty/getInfoPost",
      type : "post",
      data: data,
      success: function(result) {
        $('#input-name-faculty').val(result.data.username)
        $('#input-email-faculty').val(result.data.local.email)
        $('#input-password-faculty').val(result.data.local.password)
        let arrCategory = result.data.local.category
        arrCategory.forEach(e => {
          let idCategory = '#' + e.categoryId
          $(idCategory).prop('checked', true);
        });
      },
      error : function(error) {
        console.log(error)
      },
    })
  })


  $("#btnChangePassword").bind("click",function(){
    $(".user-modal-alert-success").css("display","none")
    $(".user-modal-alert-error").css("display","none")
  })


  $('#input-btn-update-password-faculty').bind("click",function(){
    $(".user-alert-success").css("display","none")
    $(".user-alert-error").css("display","none")
    if($.isEmptyObject(facultyInfo)){
      alertify.notify("Bạn chưa điền thông tin trước khi cập nhật","error",7)
      return false;
    }
    if(!facultyInfo.password || !facultyInfo.newPassword || !facultyInfo.confirmPassword){
      $(".user-alert-error").find("span").text("Chưa điền đủ thông tin")
      $(".user-alert-error").css("display","block")
      return false;
    }
    if(facultyInfo.newPassword.length <6){
      $(".user-alert-error").find("span").text("Mật khẩu mới chưa hợp lệ.(Phải có ít nhất 6 ký tự")
      $(".user-alert-error").css("display","block")
      return false;
    }
    if(facultyInfo.newPassword!==facultyInfo.confirmPassword){
      $(".user-alert-error").find("span").text("Mật khẩu xác nhận không trùng khớp với mật khẩu mới.")
      $(".user-alert-error").css("display","block")
      return false;
    }
    callUpdateFacultyInfo()
    delete facultyInfo.password
    delete facultyInfo.newPassword
    delete facultyInfo.confirmPassword
    $('#oldPassword').val("")
    $('#newPassword').val("")
    $('#confirmNewPassword').val("")
  })

  $("#input-content-post-category").bind("change",function(){
    facultyPostInfo.content = $(this).val()
  })


  $("#input-title-post-category").bind("change",function(){
    facultyPostInfo.title = $(this).val() 
  })

  $('#btn-submit-add-post-faculty').bind("click",function(){
    facultyPostInfo.category = $("#categoryPostSelect").val() 
    if($.isEmptyObject(facultyPostInfo)){
      alertify.notify("Bạn chưa điền thông tin","error",7)
      return false;
    }
    if(!facultyPostInfo.content || !facultyPostInfo.title || !facultyPostInfo.category){
      alertify.notify("Bạn chưa điền đủ thông tin","error",7)
      return false;
    }
    
    callAddPostOfFaculty()

  })

  $('#input-content-newfeeds').bind('change',function(){
    newFeedsInfo.content = $(this).val() 
  })

  $('#input-file-newfeeds').bind('change',function(){
    let fileData = $(this).prop("files")[0];
    newFeedsInfo.file = fileData
  })

  $('#input-url').bind('change',function(){
    newFeedsInfo.video = $(this).val() 
  })

  $('#btn-show-url').bind('click',function(){
    if ( $('#input-url').css('display') == 'none')
    {
      $('#input-url').css("display","block")
    }else{
      $('#input-url').css("display","none")
    }
  })

  $("form#data").bind("submit",function(e) {
    e.preventDefault()
    let match = ["image/png","image/jpg","image/jpeg"]
    let limit = 10485760 //byte = 10MB
    let fileData = newFeedsInfo.file
    if(fileData){
      if($.inArray(fileData.type,match) === -1){
        alertify.notify("Kiểu file không hợp lệ,hình ảnh chỉ chấp nhận file JPG , PNG còn video chỉ chấp nhập file MP4","error",7)
        return false
      }
      if(fileData.size > limit){
        alertify.notify("File upload tối đa cho phép là 10MB","error",7)
        return false
      }
    }

    let form = new FormData()
    
    if(newFeedsInfo.file && newFeedsInfo.video){
      alertify.notify("Chỉ được thêm ảnh hoặc video","error",7)
      return false
    }
    if(!newFeedsInfo.content && !newFeedsInfo.file && !newFeedsInfo.video){
      alertify.notify("Vui lòng nhập thông tin","error",7)
      return false
    }
    
    if(newFeedsInfo.content && newFeedsInfo.video){
      form.append('content',newFeedsInfo.content)
      form.append('video',newFeedsInfo.video)
    }else 
    if(newFeedsInfo.content && newFeedsInfo.file){
      form.append('content',newFeedsInfo.content)
      form.append('attachment',newFeedsInfo.file)
    }else
    if(newFeedsInfo.video){
      form.append('video',newFeedsInfo.video)
    }else
    if(newFeedsInfo.file){
      form.append('attachment',newFeedsInfo.file)
    }else
    if(newFeedsInfo.content){
      form.append('content',newFeedsInfo.content)
    }
    
    $.ajax({  
      url: "/user/postNewFeeds",
      type: 'POST',
      processData: false,
      contentType: false,
      data: form,
      success: function(result) {
        let newFeedsItem = null
        let idPost = 'post' + result.data._id
        if(result.data.image && result.data.content){
            newFeedsItem = `
            <div class="container-fluid postsUser card" id="${idPost}">
            <div class="row pt-3 pb-3">
            <div class="d-flex">
                <div class="m-2"  id="${result.data._id}">
                    <img id="avatarPostNewFeeds" class="avatarPostNewFeeds" src="/images/${result.data.sender.avatar}" alt="avatar"> 
                </div>
                <div class="d-flex flex-column m-2">
                    <a href="/user/detail/${result.data.sender._id}" id="authorname">${result.data.sender.username}</a>
                    <span id="timePosting">${result.data.createdAt}</span>
                </div>
                    <div class="dropdown">
                        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false"></button>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
                          <li><button data-id="${result.data._id}" class="dropdown-item" type="button" id="btn-del-post">Xóa</button></li>
                          <li><button data-id="${result.data._id}" data-content="${result.data.content}" data-image="${result.data.image}" data-video="${result.data.video}" id="btn-open-modal-edit-post" class="dropdown-item" data-bs-toggle="modal" data-bs-target="#updatePostModal" type="button">Sửa</button></li>
                        </ul>
                    </div>      
            </div>
            <div>
              ${result.data.content}
            </div>
            <div id="img_inside_post">
                <img class="img_inside_post" src="/imgNewFeeds/${result.data.image}" alt="">
            </div>
            <div id="__cmt_session" class="d-flex justify-content-center mt-1 mb-2">
                <h5><b>Comment </b></h5>
            </div>
            <hr>
            <!--Comment-->
            <div class="row">
                <div class="col-md-1">
                    <img id="avatarPostCmt" class="avatarPostCmt" src="/images/${result.data.sender.avatar}" alt="avatar">
                </div>
                <div class="col-md-11">
                    <textarea name="input-content-comments" id="input-content-comments" cols="30" rows="3"></textarea>
                    <div class="text-end">
                        <button id="input-btn-comment" value="${result.idUser}AND${result.data._id}" class="btn btn-primary input-btn-comment">Comment</button>
                    </div>
                </div>
            </div>
            <!--List Comment-->
            <div class="row">
                <div class="col-md-12">
                    <h5>Danh sách comment</h5>
                    <div id="postCmt${result.data._id}" class="listComment">
                    </div>
                </div>
            </div>
        </div>  
    </div>                       
          `
        }
        if(result.data.video && result.data.content){
          let url = result.data.video.replace("watch?v=", "embed/")
          newFeedsItem = `
          <div class="container-fluid postsUser card" id="${idPost}">
          <div class="row pt-3 pb-3">
          <div class="d-flex">
              <div class="m-2"  id="${result.data._id}">
                  <img id="avatarPostNewFeeds" class="avatarPostNewFeeds" src="/images/${result.data.sender.avatar}" alt="avatar"> 
              </div>
              <div class="d-flex flex-column m-2">
                  <a href="/user/detail/${result.data.sender._id}" id="authorname">${result.data.sender.username}</a>
                  <span id="timePosting">${result.data.createdAt}</span>
              </div>
                  <div class="dropdown">
                      <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false"></button>
                      <ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
                        <li><button data-id="${result.data._id}" class="dropdown-item" type="button" id="btn-del-post">Xóa</button></li>
                        <li><button data-id="${result.data._id}" data-content="${result.data.content}" data-image="${result.data.image}" data-video="${result.data.video}" id="btn-open-modal-edit-post" class="dropdown-item" data-bs-toggle="modal" data-bs-target="#updatePostModal" type="button">Sửa</button></li>
                      </ul>
                  </div>      
          </div>
          <div>
            ${result.data.content}
          </div>
          <div class="video_inside_post" class="row">
            <iframe src="${url}"></iframe>
          </div>                                   
          <div id="__cmt_session" class="d-flex justify-content-center mt-1 mb-2">
              <h5><b>Comment </b></h5>
          </div>
          <hr>
          <!--Comment-->
          <div class="row">
              <div class="col-md-1">
                  <img id="avatarPostCmt" class="avatarPostCmt" src="/images/${result.data.sender.avatar}" alt="avatar">
              </div>
              <div class="col-md-11">
                  <textarea name="input-content-comments" id="input-content-comments" cols="30" rows="3"></textarea>
                  <div class="text-end">
                      <button id="input-btn-comment" value="${result.idUser}AND${result.data._id}" class="btn btn-primary input-btn-comment">Comment</button>
                  </div>
              </div>
          </div>
          <!--List Comment-->
          <div class="row">
              <div class="col-md-12">
                  <h5>Danh sách comment</h5>
                  <div id="listComment">
                  </div>
              </div>
          </div>
      </div>  
  </div> 
        `
        }
        if( result.data.content && !result.data.video && !result.data.image){
        newFeedsItem = `
        <div class="container-fluid postsUser card" id="${idPost}">
        <div class="row pt-3 pb-3">
        <div class="d-flex">
            <div class="m-2"  id="${result.data._id}">
                <img id="avatarPostNewFeeds" class="avatarPostNewFeeds" src="/images/${result.data.sender.avatar}" alt="avatar"> 
            </div>
            <div class="d-flex flex-column m-2">
                <a href="/user/detail/${result.data.sender._id}" id="authorname">${result.data.sender.username}</a>
                <span id="timePosting">${result.data.createdAt}</span>
            </div>
                <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false"></button>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
                      <li><button data-id="${result.data._id}" class="dropdown-item" type="button" id="btn-del-post">Xóa</button></li>
                      <li><button data-id="${result.data._id}" data-content="${result.data.content}" data-image="${result.data.image}" data-video="${result.data.video}" id="btn-open-modal-edit-post" class="dropdown-item" data-bs-toggle="modal" data-bs-target="#updatePostModal" type="button">Sửa</button></li>
                    </ul>
                </div>      
        </div>
        <div>
          ${result.data.content}
        </div>
        <div id="__cmt_session" class="d-flex justify-content-center mt-1 mb-2">
            <h5><b>Comment </b></h5>
        </div>
        <hr>
        <!--Comment-->
        <div class="row">
            <div class="col-md-1">
                <img id="avatarPostCmt" class="avatarPostCmt" src="/images/${result.data.sender.avatar}" alt="avatar">
            </div>
            <div class="col-md-11">
                <textarea name="input-content-comments" id="input-content-comments" cols="30" rows="3"></textarea>
                <div class="text-end">
                    <button id="input-btn-comment" value="${result.idUser}AND${result.data._id}" class="btn btn-primary input-btn-comment">Comment</button>
                </div>
            </div>
        </div>
        <!--List Comment-->
        <div class="row">
            <div class="col-md-12">
                <h5>Danh sách comment</h5>
                <div id="postCmt${result.data._id}" class="listComment">
                </div>
            </div>
        </div>
    </div>  
</div> 
        `
        }
        if( !result.data.content && result.data.video && !result.data.image){
        let url = result.data.video.replace("watch?v=", "embed/")
        newFeedsItem = `
        <div class="container-fluid postsUser card" id="${idPost}">
        <div class="row pt-3 pb-3">
        <div class="d-flex">
            <div class="m-2"  id="${result.data._id}">
                <img id="avatarPostNewFeeds" class="avatarPostNewFeeds" src="/images/${result.data.sender.avatar}" alt="avatar"> 
            </div>
            <div class="d-flex flex-column m-2">
                <a href="/user/detail/${result.data.sender._id}" id="authorname">${result.data.sender.username}</a>
                <span id="timePosting">${result.data.createdAt}</span>
            </div>
                <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false"></button>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
                      <li><button data-id="${result.data._id}" class="dropdown-item" type="button" id="btn-del-post">Xóa</button></li>
                      <li><button data-id="${result.data._id}" data-content="${result.data.content}" data-image="${result.data.image}" data-video="${result.data.video}" id="btn-open-modal-edit-post" class="dropdown-item" data-bs-toggle="modal" data-bs-target="#updatePostModal" type="button">Sửa</button></li>
                    </ul>
                </div>      
        </div>
        <div class="video_inside_post" class="row">
            <iframe src="${url}"></iframe>
        </div> 
        <div id="__cmt_session" class="d-flex justify-content-center mt-1 mb-2">
            <h5><b>Comment </b></h5>
        </div>
        <hr>
        <!--Comment-->
        <div class="row">
            <div class="col-md-1">
                <img id="avatarPostCmt" class="avatarPostCmt" src="/images/${result.data.sender.avatar}" alt="avatar">
            </div>
            <div class="col-md-11">
                <textarea name="input-content-comments" id="input-content-comments" cols="30" rows="3"></textarea>
                <div class="text-end">
                    <button id="input-btn-comment" value="${result.idUser}AND${result.data._id}" class="btn btn-primary input-btn-comment">Comment</button>
                </div>
            </div>
        </div>
        <!--List Comment-->
        <div class="row">
            <div class="col-md-12">
                <h5>Danh sách comment</h5>
                <div id="postCmt${result.data._id}" class="listComment">
                </div>
            </div>
        </div>
    </div>  
</div> 
        `
        }
        if( !result.data.content && !result.data.video && result.data.image){
        newFeedsItem = `
        <div class="container-fluid postsUser card" id="${idPost}">
        <div class="row pt-3 pb-3">
        <div class="d-flex">
            <div class="m-2"  id="${result.data._id}">
                <img id="avatarPostNewFeeds" class="avatarPostNewFeeds" src="/images/${result.data.sender.avatar}" alt="avatar"> 
            </div>
            <div class="d-flex flex-column m-2">
                <a href="/user/detail/${result.data.sender._id}" id="authorname">${result.data.sender.username}</a>
                <span id="timePosting">${result.data.createdAt}</span>
            </div>
                <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false"></button>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
                      <li><button data-id="${result.data._id}" class="dropdown-item" type="button" id="btn-del-post">Xóa</button></li>
                      <li><button data-id="${result.data._id}" data-content="${result.data.content}" data-image="${result.data.image}" data-video="${result.data.video}" id="btn-open-modal-edit-post" class="dropdown-item" data-bs-toggle="modal" data-bs-target="#updatePostModal" type="button">Sửa</button></li>
                    </ul>
                </div>      
        </div>
        <div id="img_inside_post">
            <img class="img_inside_post" src="/imgNewFeeds/${result.data.image}" alt="">
        </div>
        <div id="__cmt_session" class="d-flex justify-content-center mt-1 mb-2">
            <h5><b>Comment </b></h5>
        </div>
        <hr>
        <!--Comment-->
        <div class="row">
            <div class="col-md-1">
                <img id="avatarPostCmt" class="avatarPostCmt" src="/images/${result.data.sender.avatar}" alt="avatar">
            </div>
            <div class="col-md-11">
                <textarea name="input-content-comments" id="input-content-comments" cols="30" rows="3"></textarea>
                <div class="text-end">
                    <button id="input-btn-comment" value="${result.idUser}AND${result.data._id}" class="btn btn-primary input-btn-comment">Comment</button>
                </div>
            </div>
        </div>
        <!--List Comment-->
        <div class="row">
            <div class="col-md-12">
                <h5>Danh sách comment</h5>
                <div id="postCmt${result.data._id}" class="listComment">
                </div>
            </div>
        </div>
    </div>  
</div> 
        `
        }
      $("#listPost").prepend(newFeedsItem)
      newFeedsInfo.content = null
      newFeedsInfo.file = null
      newFeedsInfo.video = null
      $("#input-content-newfeeds").val("")
      $("#input-file-newfeeds").val("")
      $("#input-url").val("")
      },
      error : function(error) {
        console.log('Lỗi')
      },
    });
  });

  $(document).on('click','#btn-del-post',function(e){
    let btn = e.target
    let id = btn.dataset.id
    let data = {
      id : id
    }
    $.ajax({
      url:"/user/delPost",
      type : "DELETE",
      data: data,
      success: function(result) {
        let idPost = 'post'+result.idPost
        $(`#${idPost}`).remove();
      },
      error : function(error) {
        console.log('Lỗi')
      },
    })
  })

  $(document).on('change','#input-content-comments',function(){
      contentComment = $(this).val()
  })

  $(document).on('click','#btn-submit-delete-comment',function(e){
    e.preventDefault()
    let btn = e.target
    let id = btn.dataset.id
    let data = {
      id : id
    }
    $.ajax({
      url:"/user/delCmt",
      type : "DELETE",
      data: data,
      success: function(result) {
        let idCmt = '#'+ result.data._id
        $(idCmt).remove()
      },
      error : function(error) {
        console.log('Lỗi')
      },
    })
  })

  $(document).on('click','#input-btn-comment',function(){
    let keyOfPost = $(this).val()
    let id = keyOfPost.split("AND")
    let idUserComment = id[0]
    let idPostComment = id[1]
    let contentCmt = contentComment
    let data = {
      idPost : idPostComment,
      idUser : idUserComment,
      content : contentCmt
    }
    $.ajax({
      url:"/user/postComment",
      type : "POST",
      data: data,
      success: function(result) {
        let item = `
        <div class="commentItem" id="${result.data._id}">
        <div class="d-flex justify-content-start">
            <div class="col-2 col-sm-2"><img id="avatarComment" class="avatarComment" src="/images/${result.data.sender.avatar}" alt="avatar"></div>
            <div class="col-9 col-sm-8">
                <label name="" id=""><h6>${result.data.sender.username}</h6></label>
                <label class="text-muted" name="" id=""><small>${result.data.createdAt}</small></label>
                <br>
                <label name="" id="">${result.data.text}</label>
            </div>
                <div class="col-1 col-sm-2">
                    <a data-id="${result.data._id}" id="btn-submit-delete-comment" href="">Xóa</a> 
                </div>
        </div>
    </div>
    <br>
        `

        let itemGuess = `
        <div class="commentItem" id="${result.data._id}">
        <div class="d-flex justify-content-start">
            <div class="col-2 col-sm-2"><img id="avatarComment" class="avatarComment" src="/images/${result.data.sender.avatar}" alt="avatar"></div>
            <div class="col-9 col-sm-8">
                <label name="" id=""><h6>${result.data.sender.username}</h6></label>
                <label class="text-muted" name="" id=""><small>${result.data.createdAt}</small></label>
                <br>
                <label name="" id="">${result.data.text}</label>
            </div>
        </div>
    </div>
      <br>
      `
        let data = {
          idPost : result.data.post,
          cmt : result.data,
          item : item,
          itemGuess : itemGuess
        }
        //console.log(data)
        socket.emit('addComment', data);
        $('#input-content-comments').val("")
        contentComment = null
      },
      error : function(error) {
        console.log(error)
      },
    })
  })

  $(document).on('click','#open-modal-delete-post',function(e){
    let btn = e.target
    let id =btn.dataset.id
    postDelInfo.idPostDelete = id
    let title =btn.dataset.title
    $('#deletePostFaculty').val(title)
  })



  

  $(document).on('click','#btn-confirm-delete-post-faculty',function(e){
    $.ajax({
      url:"/faculty/deletePost",
      type : "delete",
      data: postDelInfo,
      success: function(result) {
        //console.log(result)
        let idCard = "#" + result.data._id
        $(idCard).remove()
        $(".user-modal-alert-success").find("span").text(result.message)
        $(".user-modal-alert-success").css("display","block")
        $("#confirm-delete-post-dialog").modal('toggle'); 
      },
      error : function(error) {
        $(".user-modal-alert-error").find("span").text(error.responseText)
        $(".user-modal-alert-error").css("display","block")
      },
    })
  })

  $(document).on('click','#open-modal-update-post',function(e){
    let btn = e.target
    let {id,category,title,content} =btn.dataset
    idPostFacultyUpdated = id
    $('#input-title-post-category-updated').val(title)
    $('#input-content-post-category-updated').val(content)
  })

  
  $(document).on('click','#btn-submit-update-post-faculty',function(e){
    let title = $('#input-title-post-category-update').val()
    let content = $('#input-content-post-category-update').val()
    let category = $('#categoryPostSelectUpdated :selected').val()
    if(!category){
      $(".user-modal-alert-error-update").find("span").text('Chuyên mục bị bỏ trống')
      $(".user-modal-alert-error-update").css("display","block")
      return ;
    }
    let id = idPostFacultyUpdated
    let data ={
      id : id,
      title : title,
      content : content,
      category : category
    }
    $.ajax({
      url:"/faculty/updatePost",
      type : "put",
      data: data,
      success: function(result) {
        location.reload();
      },
      error : function(error) {
        $(".user-modal-alert-error-update").find("span").text(error.responseText)
        $(".user-modal-alert-error-update").css("display","block")
      },
    })
    
    idPostFacultyUpdated = null
  })

  $(document).on('click','#btn-open-modal-edit-post',function(e){
    let btn = e.target
    let {id,content,image,video} = btn.dataset
    $('#btn-confirm-editPost').attr('data-id',id)
    if(content){
      $('#textarea-content').val(content)
    }
    if(video){
      $('#input-edit-url-post').val(video)
    }
    if(image){
      $('#imagePostUpdate').attr('src','/imgNewFeeds/'+image)
    }
  })

  $(document).on('change','#textarea-content',function(){
    updatedPost.content = $(this).val()
  })

  $(document).on('change','#input-edit-url-post',function(){
    updatedPost.video = $(this).val()
  })

  $(document).on('change','#edit-image-post',function(){
    let fileData = $(this).prop("files")[0];
    let match = ["image/png","image/jpg","image/jpeg"]
    let limit = 1048576 //byte = 1MB
    
    if($.inArray(fileData.type,match) === -1){
      alertify.notify("Kiểu file không hợp lệ, chỉ chấp nhập jpg và png","error",7)
      $(this).val(null);
      return false
    }
    if(fileData.size > limit){
      alertify.notify("Ảnh upload tối đa cho phép là 1MB","error",7)
      $(this).val(null);
      return false
    }
    if(typeof(FileReader) != undefined){
      let image_review = $("#image-edit-post");
      image_review.empty()

      let fileReader = new FileReader()
      fileReader.onload = function(element){
        $("<img>",{
          "src" : element.target.result,
          "id" : "imagePostUpdate",
          "class" : "avatar form-control",
          "alt" : "imgPost"
        }).appendTo(image_review)
      }
      image_review.show()
      fileReader.readAsDataURL(fileData)
      updatedPost.image = fileData
    }else{
      alertify.notify("Trình duyệt của bạn không hỗ trợ FileReader","error",7)
    }
  })

  $(document).on('click','#btn-confirm-editPost',function(e){
    let btn = e.target
    let formPost = new FormData()
    let idPost = btn.dataset.id
    
    formPost.append('idPost',idPost)
    let {content,video,image} = updatedPost
    if(content != $('#textarea-content').val()){
      content = $('#textarea-content').val()
    }
    if(video != $('#input-edit-url-post').val()){
      video = $('#input-edit-url-post').val()
    }
    if(content){
      formPost.append('content',content)
    }
    if(video){
      formPost.append('video',video)
    }
    if(image){
      let match = ["image/png","image/jpg","image/jpeg"]
      let limit = 10485760 //byte = 10MB
      let fileData = image
      if(fileData){
        if($.inArray(fileData.type,match) === -1){
          alertify.notify("Kiểu file không hợp lệ,hình ảnh chỉ chấp nhận file JPG , PNG còn video chỉ chấp nhập file MP4","error",7)
          return false
        }
        if(fileData.size > limit){
          alertify.notify("File upload tối đa cho phép là 10MB","error",7)
          return false
        }
      }
      formPost.append('attachment',fileData)
    }
    if(!content && !video && !image){
      alertify.notify("Vui lòng nhập thông tin cập nhật","error",7)
      return false
    }
    if(video && image){
      alertify.notify("Chỉ được thêm ảnh hoặc video không được thêm cả 2","error",7)
      return false
    }
    
    $.ajax({  
      url: "/user/updatePostUser",
      type: 'PUT',
      processData: false,
      contentType: false,
      data: formPost,
      success: function(result){
        //console.log(result)
        updatedPost.content = null
        updatedPost.video = null  
        updatedPost.image = null
        let {content,video,image} = result.data
        let idPost = result.data._id
        if(image && content){
          let idContentPost = '#contentPost' + idPost
          let idVideoPost = '#urlPost' + idPost
          let idImgPost = '#imgPost' + idPost
          $(idContentPost).find("p").remove()
          $(idImgPost).find("img").remove()
          $(idVideoPost).find("iframe").remove()
          let imgPost = `
            <img class="img_inside_post" src="/imgNewFeeds/${image}" alt="">
          `
          $(idImgPost).prepend(imgPost)
          let contentPost = `
            <p>${content}</p>
          `
          $(idContentPost).prepend(contentPost)
          $('#btn-open-modal-edit-post').attr('data-id',idPost)
          $('#btn-open-modal-edit-post').attr('data-content',content)
          $('#btn-open-modal-edit-post').attr('data-video',video)
          $('#btn-open-modal-edit-post').attr('data-image',image)
        }
        else if(video&&content){
          let idContentPost = '#contentPost' + idPost
          let idVideoPost = '#urlPost' + idPost
          let idImgPost = '#imgPost' + idPost
          let urlVideo = video.replace("watch?v=", "embed/")
          $(idContentPost).find("p").remove()
          $(idImgPost).find("img").remove()
          $(idVideoPost).find("iframe").remove()
          let videoPost = `
            <iframe src="${urlVideo}"></iframe>
          `
          $(idVideoPost).prepend(videoPost)
          let contentPost = `
            <p>${content}</p>
          `
          $(idContentPost).prepend(contentPost)
          $('#btn-open-modal-edit-post').attr('data-id',idPost)
          $('#btn-open-modal-edit-post').attr('data-content',content)
          $('#btn-open-modal-edit-post').attr('data-video',video)
          $('#btn-open-modal-edit-post').attr('data-image',image)
        }
        else if(video){
          let idContentPost = '#contentPost' + idPost
          let idVideoPost = '#urlPost' + idPost
          let idImgPost = '#imgPost' + idPost
          let urlVideo = video.replace("watch?v=", "embed/")
          $(idContentPost).find("p").remove()
          $(idImgPost).find("img").remove()
          $(idVideoPost).find("iframe").remove()
          let videoPost = `
            <iframe src="${urlVideo}"></iframe>
          `
          $(idVideoPost).prepend(videoPost)
          $('#btn-open-modal-edit-post').attr('data-id',idPost)
          $('#btn-open-modal-edit-post').attr('data-content',content)
          $('#btn-open-modal-edit-post').attr('data-video',video)
          $('#btn-open-modal-edit-post').attr('data-image',image)
        }
        else if(content){
          let idContentPost = '#contentPost' + idPost
          let idVideoPost = '#urlPost' + idPost
          let idImgPost = '#imgPost' + idPost
          $(idVideoPost).find("iframe").remove()
          $(idImgPost).find("img").remove()
          $(idContentPost).find("p").remove()
          let contentPost = `
            <p>${content}</p>
          `
          $(idContentPost).prepend(contentPost)
          $('#btn-open-modal-edit-post').attr('data-id',idPost)
          $('#btn-open-modal-edit-post').attr('data-content',content)
          $('#btn-open-modal-edit-post').attr('data-video',video)
          $('#btn-open-modal-edit-post').attr('data-image',image)
        }else if(image){
          let idContentPost = '#contentPost' + idPost
          let idVideoPost = '#urlPost' + idPost
          let idImgPost = '#imgPost' + idPost
          $(idVideoPost).find("iframe").remove()
          $(idImgPost).find("img").remove()
          $(idContentPost).find("p").remove()
          let imgPost = `
            <img class="img_inside_post" src="/imgNewFeeds/${image}" alt="">
          `
          $(idImgPost).prepend(imgPost)
          $('#btn-open-modal-edit-post').attr('data-id',idPost)
          $('#btn-open-modal-edit-post').attr('data-content',content)
          $('#btn-open-modal-edit-post').attr('data-video',video)
          $('#btn-open-modal-edit-post').attr('data-image',image)
        }
      },
      error : function(error) {
        console.log('Lỗi')
      },
  })
  });

  $(document).on('click','#btn-change-post-faculty',function(){
      let selectedFaculty = $('#selectedFaculty').val()
      if(selectedFaculty == 'all'){
        $.ajax({
          url:'/user/postFaculty/all/1',
          type : "get",
          success: function(data) {
            window.location.href = '/user/postFaculty/all/1'; 
          }
        })
        return false
      }
      let url = '/user/postFaculty/' + selectedFaculty + '/1'
      $.ajax({
        url:url,
        type : "get",
        success: function(data) {
          window.location.href = url;
          $('#selectedFaculty').val(selectedFaculty)   
        }
      })
  })
})

