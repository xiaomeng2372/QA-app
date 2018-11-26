var root = "http://comp426.cs.unc.edu:3002/api/";

$(document).ready(()=>{
$('#submit').on('click',()=>{
   let user = $('#user').val();
   let pw = $('#pw').val();
$.ajax(root+'login',{
type:'GET',
xhrFields: {withCredentials: true},
data:{
  username:user,
  password:pw
},
success:(r)=>{
  if(r.status){
    alert('Login Success!')
    $('#msg').html("Success!");
     showMe();
  }else{
    $('#msg').html("It seems that your password is wrong. Please try again");
  }
},
error: () => {
    alert('XMLHttpRequest failed. Please check your network');
    //$('#msg').append('<button'+'id=button_'+allQuestions[i]+'>'submit'</button>');
}


});

});


});
function logIn(){
  $.ajax(root+'login',{
  type:'GET',
  xhrFields: {withCredentials: true},
  data:{
    username:user,
    password:pw
  },

});
}
var showMe = function (){
  let main = $('body');
  main.empty();
  main.append('<h1>Questions and Answers</h1>');

  let questionList = $('<div></div>')
  main.append(questionList);
  $.ajax(root+'questions',{
     type: 'GET',
     dataType:'json',
     xhrFields: {withCredentials: true},
     success:(response)=>{
       let allQuestions = response.data;
       for(var i = 0;i < allQuestions.length;i++){
         let question_div = createDiv(allQuestions[i]);
         questionList.append(question_div);
         let buttonDiv = $('<div class="buttonDiv"></div>');
         question_div.append(buttonDiv);
         // questionID
         let questionId = allQuestions[i].id;
         //logIn();
         $.ajax(root+'answers/'+allQuestions[i].id,{
         type: 'GET',
         dataType:'json',
         xhrFields: {withCredentials: true},
         success:(r)=> {
           // Add answered for those have been answered
           if(r.data!=null){
           let answer = r.data;
           question_div.append('<div class="answer" id="aid_' + answer.answer_id + '">' +
           answer.answer_text + '</div>');
           buttonDiv.append('<button class="delete" onclick = deleteH(event,'+questionId+')'+'>Delete</button>')
           buttonDiv.append('<button class="edit" onclick = editAns(event,'+questionId+')'+'>Edit</button>')
           question_div.addClass('answered');

         }else{
           // add form for those who have not been answered
           //alert(allQuestions[i])
           let answerClass = $('<div class="answer" id="' + questionId + '">'+'</div>')
           question_div.append(answerClass);
           let input = '<input class="input" placeholder="Enter your answer...">'
           answerClass.append(input);
           let submitButton ='<button class="submit" onclick = submit(event,'+questionId+')'+'>Submit</button>'

           answerClass.append(submitButton);
         }
         }
         })


       }
     }
  })
}
/*
Delete an answer, making the question unanswered.
Appear: form and submit button.
Ajax: Delete it.
*/
function submit(e,id){
  let parent = $(e.currentTarget.parentElement);
  let myAnswer = parent.find('.input').val();
  //let id = parent.attr("id");
  let grandParent = $(e.currentTarget.parentElement.parentElement);
  let buttonDiv = grandParent.find('.buttonDiv')
  // answers/:questionId?answer=answerText
  //logIn();
  if(myAnswer!=null){
  $.ajax(root+'answers/'+id+'?answer='+myAnswer,{
  type:'PUT',
  xhrFields: {withCredentials: true},
  success:(r)=>{
    //alert('hahahahha');
    if(r.status){
      // if success, Add buttons and put id
      //parent.find(.)
      //alert(r.answerId)
      buttonDiv.append('<button class="delete" onclick = deleteH(event,'+id+')'+'>Delete</button>')
      buttonDiv.append('<button class="edit" onclick = editAns(event,'+id+')'+'>Edit</button>')
      parent.empty();
      parent.html(myAnswer);
      parent.attr("id","aid_"+r.answerId);
      grandParent.addClass('answered');

    }else{
      //$('#msg').html("It seems that your password is wrong. Please try again");
      alert("????");
    }
  },

  });
}
}
function deleteH(event,questionId){
  //alert('delete!')
  //1. Delete all the buttons in the button login_div
  // 2. Add a form and a submit button
  // 3. For the div, Add ID = questionID.
  //let parent = $(e.currentTarget.parentElement)
  //alert(questionId);
  let parent = $(event.currentTarget.parentElement);
  let grandParent = $(event.currentTarget.parentElement.parentElement);
  let answer = grandParent.find(".answer");

  $.ajax(root+"answers/"+questionId,{
  type:"DELETE",
  xhrFields: {withCredentials: true},
  success:(r)=>{
    //alert("DELETE");
    //alert('hahahahha');
    if(r.status){
      // if success, Add buttons and put id
      //parent.find(.)
      //alert(r.answerId)
     //alert("!!!");
     answer.empty();
     parent.empty();
     let input = '<input class="input" placeholder="Enter your answer...">'
     answer.append(input);
     let submitButton ='<button class="submit" onclick = submit(event,'+questionId+')'+'>Submit</button>'
     answer.append(submitButton);
    }else{
      //$('#msg').html("It seems that your password is wrong. Please try again");
      alert("????");
    }
  },

  });

}


function createDiv(question){
       let qdiv = $('<div class="question" id="qid_' + question.id + '"></div>');
     	qdiv.append('<div class="qtitle">' + question.title + '</div>');
     	qdiv.append('<div class="count">' +"AnswerCount: "+ question.answerCount + '</div>');
     	return qdiv;
     }
