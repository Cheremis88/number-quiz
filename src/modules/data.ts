import { IEvents } from "./events";
import { TResult, TTask } from "./types";

interface IQuizData {
  index: number;
  length: number;
  task: string;
  tasks: TTask[];
  result: TResult;
  checkError(state: boolean): string;
  addAnswer(answer: string): void;
  resetResult(): void;
}

export class QuizData implements IQuizData {

  protected _tasks: TTask[];
  protected _index: number = 0;
  protected _error: string;
  protected _result: TResult = {
    correctAnswers: [],
    userAnswers: [],
    difference: [],
    color: []
  };
  
  constructor(protected _events: IEvents) {}

  get index() {
    return this._index;
  }

  get length() {
    return this._tasks.length;
  }

  get task() {
    return this._tasks[this._index].question;
  }

  get result() {
    return this._result;
  }

  set tasks(data: TTask[]) {
    this._tasks = data;
    this._result.correctAnswers = this._tasks.map(task => task.answer);
    this._events.emit('next-stage');
  }

  checkError(state: boolean) {
    this._error = state ? 'Только цифры, без\u00A0нуля в начале' : '';
    return this._error; 
  }

  addAnswer(answer: string): void {
    this._result.userAnswers.push(Number(answer));
    this.addDifference();
  }

  resetResult() {
    let obj = {
      userAnswers: [],
      difference: [],
      color: []
    };
    Object.assign(this._result, obj);
    this._index = 0;
    this._events.emit('next-stage');
  }

  protected addDifference(): void {
    let taskAnswer = this._result.correctAnswers[this._index];
    let userAnswer = this._result.userAnswers[this._index];
    let diff = Math.round(Math.abs((taskAnswer - userAnswer)) / taskAnswer * 100);
    this._result.difference.push(diff);
    this.addColor(diff);
    this._index++;
    this.checkFinish();
  }

  protected addColor(diff: number) {
    if (diff <= 10) {
      this._result.color.push('green');
    } else if (diff <= 25) {
      this._result.color.push('yellow');
    } else if (diff <=40) {
      this._result.color.push('orange');
    } else {
      this._result.color.push('red');
    }
  }

  protected checkFinish(): void {
    if (this.index < this.length) {
      this._events.emit('next-stage');
    } else {
      this._events.emit('show-result', this._result);
    }
  }
}