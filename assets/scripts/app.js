let p=console.log;

const RENDER_ACTIVE_ONLY = true;
const UNIQUE_ID_FORMAT = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
const SHOW_ALL_TASKS = "Show all tasks";
const SHOW_ACTIVE_TASKS_ONLY = "Show active tasks only";
const HEADLINE_ALL_TASKS = "All Tasks list";
const HEADLINE_ACTIVE_ONLY_TASKS = "Active Tasks";
const NO_DATE_MESSAGE = "No expiration date"
const DATE_ERROR_MESSAGE = "Cannot set date that passed"
const REQUIRED_FIELD_ERROR="Please fill in the required fields";

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
    <h2>${HEADLINE_ALL_TASKS}</h2>
    <button>Show active tasks only</button>
    </header>
    <ul></ul>`;

    const container = document.getElementById(this.hookid);
    container.append(this.section);
    const onlyActiveBtn = container.querySelector('button');
    onlyActiveBtn.addEventListener('click',()=>this.toogleBetweenActiveTasksToNonActive()); 
  }

  setButtonToShowAllTasks(){
    this.section.querySelector('button').innerText = SHOW_ALL_TASKS;
  }

  setButtonToShowOnlyActiveTasks(){
    this.section.querySelector('button').innerText = SHOW_ACTIVE_TASKS_ONLY;
  }

  changeHeadlineDescription(){
    const element = this.section.querySelector('h2');

    if(this.showActiveOnly)
      element.innerText=HEADLINE_ACTIVE_ONLY_TASKS;
    else
    element.innerText= HEADLINE_ALL_TASKS;
  }

  toogleBetweenActiveTasksToNonActive(){
    this.showActiveOnly = !this.showActiveOnly;
    if(this.showActiveOnly)
      this.setButtonToShowAllTasks();
    else
      this.setButtonToShowOnlyActiveTasks();
    this.changeHeadlineDescription();
    this.renderAllList();
  }

  pushToDo(todo){
    this.listOfTodo.push(todo);
    this.render();
  }

  setStyleForFinishedTasks(taskElements){
    const headline = taskElements[0];
    const paragraph = taskElements[1];
    headline.style['text-decoration'] = 'line-through';
    headline.style['text-decoration-color'] = 'red';
    headline.style['text-decoration-style'] = 'wavy';
    paragraph.style['text-decoration'] = 'line-through';
    paragraph.style['text-decoration-color'] = 'red';
    paragraph.style['text-decoration-style'] = 'wavy';
  }

  markAsFinished(task){
    const found = this.locateTaskById(task)
    let taskElements = document.getElementById(found.item["uid"]).children;
    this.setStyleForFinishedTasks(taskElements)

    
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
      itemProperties['taskDate']=NO_DATE_MESSAGE;
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
          <p>${this.item["taskInfo"]}</p>
          <h5>${this.item["taskDate"]}<button>Finish</button></h5>
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
}


compareYears(userDate,currentDate){
  return userDate[2] < currentDate[2];
}

compareYearsAndMonth(userDate,currentDate){
  return userDate[2] == currentDate[2] && userDate[1] < currentDate[1];
}

compareYearsMonthAndDays(userDate,currentDate){
  return userDate[2] == currentDate[2] && userDate[1] == currentDate[1] && userDate[0] < currentDate[0];
}


checkIfDateDidntPassed(){
  let userDate,currentDate;
  userDate = this.inputElements['taskDate'].value

  if(userDate=='') //user didn't put any date
    return false;

  userDate = userDate.split("-").reverse();
  currentDate = (new Date()).toLocaleDateString('en-GB').split('/');

  return (this.compareYears(userDate,currentDate) || 
         this.compareYearsAndMonth(userDate,currentDate) ||
         this.compareYearsMonthAndDays(userDate,currentDate));
}

verifyFieldsBeforePushing(){
  if(this.inputElements['taskName'].value ==='')
    return alert(REQUIRED_FIELD_ERROR);
  if (this.checkIfDateDidntPassed())
    return alert(DATE_ERROR_MESSAGE);
  App.pushNewElement(this.inputElements);
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
  submitBtn.addEventListener('click',()=>this.verifyFieldsBeforePushing());
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