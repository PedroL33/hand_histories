//Solution from https://javascript.plainenglish.io/implementing-debouncing-in-react-f3316ef344f5
export function debounce(func: Function, delayMs: number=1000): Function {
  let timerHandler: any = -1;
  return function async (this: any): void {
    let context: any = this;
    let args = arguments;
    let later = function() {
      timerHandler = -1;
      func.apply(context, args);
    }
    if (timerHandler != -1) {
      clearTimeout(timerHandler);
      timerHandler = -1;
    }
    timerHandler = setTimeout(later, delayMs);
  };
};