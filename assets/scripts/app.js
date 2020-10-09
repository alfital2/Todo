let p=console.log;
class TodoList{

}

class TodoItem{

constructor(hook,task){
  this.hookid=hook;
  this.item = this.extractDateFromTaskObject(task);
  this.verifyIfDateIsSet();
  const uidForTask = this.createUniqueIdForTask();
  this.item = this.setIdForTask(uidForTask);
  this.render();
  }
  
  verifyIfDateIsSet(){
    if(this.item['taskDate']==''){
    const itemProperties={...this.item};
      itemProperties['taskDate']="No expiration date";
      this.item = itemProperties;
    }
  }

  setIdForTask(id){
    const itemProperties={...this.item};
    itemProperties['uid'] = id;
    return itemProperties;
  }
  
  extractDateFromTaskObject(task){

    const itemProperties={...task};
    Object.keys(itemProperties).map(function(key, value) {
      itemProperties[key] = itemProperties[key].value;
    });
    return itemProperties;
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

  render(){
    const unorderedListOftasks = document.querySelector('ul');
    const newEl = document.createElement('li');
    newEl.className="card";
    newEl.innerHTML=`

          <h2>${this.item["taskName"]}</h2>
          <p>${this.item["taskInfo"]}.</p>
          <h3>${this.item["taskDate"]}</h3>
          <h4>${this.item["uid"]}</h4>
          <button>Finish</button

  `;
  unorderedListOftasks.append(newEl);
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

  this.inputElements= elements;
}

initializeElements(){
  this.inputElements['taskName'].setAttribute("type", "text");
  this.inputElements['taskName'].placeholder="task name";
  this.inputElements['taskInfo'].setAttribute("type", "text");
  this.inputElements['taskInfo'].placeholder="task info(optional)";
  this.inputElements['taskDate'].setAttribute("type", "date");


  ////////this is for tasting - delete this!
  this.inputElements['taskInfo'].value = "asfdsdfgsadfgsdf";
  this.inputElements['taskName'].value = "asdasd";
    ////////this is for tasting - delete this!


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


    ///TODO DELETE
    const TEST_DELETE = document.createElement('ul');
    app.append(TEST_DELETE);
    ///TODO DELETE

    new InputTask('wrapper');
  }

  static pushNewElement(task){

    const newItem = new TodoItem('ul',task);

  }
}


App.init(); 