import './index.css';
import { QuizData } from "./modules/data";
import { EventEmitter } from "./modules/events";
import { tasks } from "./modules/source";
import { TResult } from './modules/types';
import { Form, Result, ResultCard } from "./modules/view";


const events = new EventEmitter();
const quizState = new QuizData(events);
const taskForm = new Form(document.querySelector('.form'), events);
const resultView = new Result(document.querySelector('.result'), () => events.emit('new-stage'));
const resultTemplate = document.querySelector('#card') as HTMLTemplateElement;

events.on('next-stage', () => {
  taskForm.reset();
  taskForm.stage = [quizState.index, quizState.length];
  taskForm.question = quizState.task;
});

events.on('input-answer', (input: HTMLInputElement) => {
  taskForm.valid = input.validity.valid;
  taskForm.error = quizState.checkError(input.validity.patternMismatch);
});

events.on('accept-answer', (input: HTMLInputElement) => {
  quizState.addAnswer(input.value);
});

events.on('show-result', (result: TResult) => {
  taskForm.form.hidden = true;
  resultView.container.hidden = false;
  let elements = [];
  for (let i = 0; i < quizState.length; i++) {
    let clone = resultTemplate.content.firstElementChild.cloneNode(true) as HTMLElement;
    let cardData = Object.values(result).map(item => item[i]);
    let card = new ResultCard(clone, i, cardData);
    elements.push(card.render());
  }
  resultView.list = elements;
});

events.on('new-stage', () => {
  taskForm.form.hidden = false;
  resultView.container.hidden = true;
  quizState.resetResult();
});

quizState.tasks = tasks;