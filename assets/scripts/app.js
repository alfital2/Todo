
class TodoList{

}

class TodoItem{

  constructor(task){
    console.log(this.createUniqueIdForTask());
  }

  createUniqueIdForTask(){
    let dt = new Date().getTime();
    let uniqueId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) =>{
        let remainder = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? remainder :(remainder&0x3|0x8)).toString(16);
    });
    return uniqueId;
}


}


class InputTask{

inputElements;
hookid;

constructor(hookid){
  this.hookid =hookid;
  this.creatFields();
  this.initializeElements();
  this.render();

}

creatFields(){
  const elements = {
    taskName:"",
    taskInfo:"",
    taskDate:""
  }

  elements['taskName'] = document.createElement("INPUT");
  elements['taskInfo'] = document.createElement("INPUT");
  elements['taskDate']= document.createElement("INPUT");
  //elements['submit']=  document.createElement("INPUT");

  this.inputElements= elements;
}

initializeElements(){
  this.inputElements['taskName'].setAttribute("type", "text");
  this.inputElements['taskName'].placeholder="task name";
  this.inputElements['taskInfo'].setAttribute("type", "text");
  this.inputElements['taskInfo'].placeholder="task info(optional)";
  this.inputElements['taskDate'].setAttribute("type", "date");
  // this.inputElements['submit'].setAttribute("type", "submit");
  // this.inputElements['submit'].addEventListener('click',()=>App.pushNewElement(this.inputElements));
}

render(){
  const form = document.createElement('section');
  form.setAttribute("onclick",()=>alert('added'));
  const container = document.getElementById(this.hookid);
  for (const field in this.inputElements)
    form.append(this.inputElements[field]);
  const submitBtn = document.createElement("INPUT");
  submitBtn.setAttribute("type", "submit");
  submitBtn.addEventListener('click',()=>App.pushNewElement(this.inputElements));
  form.append(submitBtn);
  container.append(form)
  
  }

}


class App {

  static init(){
    const app = document.getElementById("App");
    const wrapper = document.createElement('div');
    wrapper.id ="wrapper";
    app.append(wrapper);

    new InputTask('wrapper');
  }

  static pushNewElement(task){
    const newItem = new TodoItem(task);
    for (const field in task){
    console.log(task[field].value);
    }
  }
}


App.init(); 