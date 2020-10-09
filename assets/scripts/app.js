class InputTask{


inputElements;

constructor(){
  this.creatFields();
  this.initializeElements();
  this.render();

}


creatFields(){
  const elements = {
    taskName:"",
    taskInfo:"",
    taskDate:"",
    submit:""
  }

  elements['taskName'] = document.createElement("INPUT");
  elements['taskInfo'] = document.createElement("INPUT");
  elements['taskDate']= document.createElement("INPUT");
  elements['submit']=  document.createElement("INPUT");

  this.inputElements= elements;
}

initializeElements(){
  this.inputElements['taskName'].setAttribute("type", "text");
  this.inputElements['taskName'].placeholder="task name";
  this.inputElements['taskInfo'].setAttribute("type", "text");
  this.inputElements['taskInfo'].placeholder="task info(optional)";
  this.inputElements['taskDate'].setAttribute("type", "date");
  this.inputElements['submit'].setAttribute("type", "submit");
}

render(){
  const formTEST = document.createElement('form');
  formTEST.setAttribute("action","./");
  const app = document.getElementById('App');
  app.append(formTEST)
  for (const field in this.inputElements){
    formTEST.append(this.inputElements[field]);
  } 


}

}





class App {

  static init(){
    new InputTask();
  }
}


App.init(); 