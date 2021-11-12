export class Buttons {
  constructor(buttons) {
    this.buttons = buttons;
  }

  setVisible(buttonId) {
    Array.from(this.buttons.children).forEach((button) => {
      button.style.display = 'none';
    });

    document.getElementById(buttonId).style.display = 'block';
  };

  hideAll() {
    Array.from(this.buttons.children).forEach((button) => {
      button.style.display = 'none';
    });
  };

  isStartButtonNone() {
    return document.getElementById('start').style.display === 'none';
  };
}