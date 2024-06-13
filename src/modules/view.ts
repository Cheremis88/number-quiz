import { IEvents } from "./events";

interface IForm {
  stage: number[];
  question: string;
  valid: boolean;
  error: string;
  reset(): void;
}

export class Form implements IForm {
  protected _stage: HTMLElement;
  protected _question: HTMLElement;
  protected _input: HTMLInputElement;
  protected _error: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(public form: HTMLFormElement, protected _events: IEvents) {
    this._stage = this.form.querySelector('.form__stage');
    this._question = this.form.querySelector('.form__question');
    this._input = this.form.querySelector('.form__input');
    this._button = this.form.querySelector('.form__button');
    this._error = this.form.querySelector('.form__error');

    this._input.addEventListener('input', () => {
      this._events.emit('input-answer', this._input);
    });
    
    this._button.addEventListener('click', evt => {
      evt.preventDefault();
      this._events.emit('accept-answer', this._input);
    });
  }

  set stage(stage: number[]) {
    this._stage.textContent = `Вопрос ${stage[0] + 1} из ${stage[1]}`;
  }

  set question(text: string) {
    this._question.textContent = text;
  }

  set error(text: string) {
    this._error.textContent = text;
  }

  set valid(state: boolean) {
    this._button.disabled = !state;
  }

  reset() {
    this.form.reset();
    this._input.focus();
    this._button.disabled = true;
  }
}

interface IResult {
  list: HTMLElement[];
}

export class Result implements IResult {
  protected _list: HTMLElement;
  protected _button: HTMLButtonElement;
  
  constructor(public container: HTMLElement, onClick: () => void) {
    this._list = container.querySelector('.result__list');
    this._button = container.querySelector('.result__button');
    this._button.addEventListener('click', onClick);
  }

  set list(items: HTMLElement[]) {
    this._list.replaceChildren(...items);
  }
}

interface IResultCard {
  render(): HTMLElement;
}

export class ResultCard implements IResultCard {
  constructor(public container: HTMLElement, index: number, result: (string | number)[]) {
    container.querySelector('.result__count').textContent = String(index + 1);
    container.querySelectorAll('.result__number').forEach((item: HTMLElement, index) => {
      if (item.classList.contains('result__number_color')) {
        item.textContent = result[index] + '%';
        item.style.color = result[3] as string;
      } else {
        item.textContent = String(result[index]);
      }
    });
  }

  render() {
    return this.container;
  }
}