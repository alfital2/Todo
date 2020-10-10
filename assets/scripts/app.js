let p=console.log;

const RENDER_ACTIVE_ONLY = true;
const UNIQUE_ID_FORMAT = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

class TodoList{

  hookid;
  listOfTodo=[];
  showActiveOnly = false;
  section;

  constructor(hook){
    this.hookid = hook;
    this.section = document.createElement('section');
    this.section.id = 'active-tasks';
    this.section.innerHTML=`
    <header>
    <h2>All todo list</h2>
    <button>Show active tasks only</button>
    </header>
    <ul></ul>`;

    const container = document.getElementById(this.hookid);
    container.append(this.section);
    const onlyActiveBtn = container.querySelector('button');
    onlyActiveBtn.addEventListener('click',()=>this.toogleBetweenActiveTasksToNonActive()); 
  }

  setButtonToShowAllTasks(){
    this.section.querySelector('button').innerText = "Show all tasks";
  }

  setButtonToShowOnlyActiveTasks(){
    this.section.querySelector('button').innerText = "Show active tasks only";
  }

  toogleBetweenActiveTasksToNonActive(){
    this.showActiveOnly = !this.showActiveOnly;

    if(this.showActiveOnly)
      this.setButtonToShowAllTasks();
    else
      this.setButtonToShowOnlyActiveTasks();
    this.renderAllList();
  }

  pushToDo(todo){
    this.listOfTodo.push(todo);
    this.render();
  }

  markAsFinished(task){
    const found = this.locateTaskById(task)
    let getTaskHeadlines = document.getElementById(found.item["uid"]).children;
    getTaskHeadlines[0].style['text-decoration'] = 'line-through';
    getTaskHeadlines[1].style['text-decoration'] = 'line-through';
    task.active=false;
    this.renderAllList();
  }

  locateTaskById(task){
    return this.listOfTodo.find(todo =>todo.item.uid ===task.uid);
  }

  toggleElementVisibility(element,mode){
    document.getElementById(element.item["uid"]).style['display']=mode;
  }

  renderAllList(){
    this.listOfTodo.map((todo) => {
      if (this.showActiveOnly)
      {
        if (!todo.item.active)
        {
          this.toggleElementVisibility(todo,'none');
        }
      }else{
        this.toggleElementVisibility(todo,'block');
      }
    });
  }

  render(){
    this.listOfTodo[this.listOfTodo.length-1].render();
  }
}


class TodoItem{

  hookid;

  constructor(hook,task){
    this.hookid=hook;
    this.item = this.extractDateFromTaskObject(task);
    this.verifyIfDateIsSet();
    const uidForTask = this.createUniqueIdForTask();
    this.item = this.setIdForTask(uidForTask);
    this.item = this.setTaskAsActive();
  }
  
  verifyIfDateIsSet(){
    if(this.item['taskDate']==''){
    const itemProperties={...this.item};
      itemProperties['taskDate']="No expiration date";
      this.item = itemProperties;
    }
  }

  setTaskAsActive(){
    const itemProperties={...this.item};
    itemProperties['active'] = true;
    return itemProperties;
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
    let uniqueId = UNIQUE_ID_FORMAT.replace(/[xy]/g, (c) =>{
      let remainder = (dt + Math.random()*16)%16 | 0;
      dt = Math.floor(dt/16);
        return (c=='x' ? remainder :(remainder&0x3|0x8)).toString(16);
    });
    return uniqueId;
  }

  render(){
    const unorderedListOftasks = document.querySelector('ul');
    const newEl = document.createElement('li');
    newEl.id = this.item["uid"];
    newEl.className="card";
    newEl.innerHTML=`
          <h2>${this.item["taskName"]}</h2>
          <p>${this.item["taskInfo"]}.</p>
          <h3>${this.item["taskDate"]}</h3>
          <button>Finish</button>
  `;
  unorderedListOftasks.append(newEl);
  const finishBtn = newEl.querySelector('button');
  finishBtn.addEventListener('click',()=>App.finishTodo(this.item));
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
  form.id="inputData";
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
    this.todoList = new TodoList('wrapper');
  }

  static pushNewElement(task){
    const newItem = new TodoItem('active-tasks',task);
    this.todoList.pushToDo(newItem);
  }

  static finishTodo(task){
    this.todoList.markAsFinished(task);

  }
}


App.init(); 