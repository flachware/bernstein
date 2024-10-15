import { CustomElement } from './custom-element.js'
import { f0, f1, f2, f3, bernstein } from '../helpers/bernstein.js'

export class App extends CustomElement {
  connectedCallback() {
    this.offsetX = (this.offsetWidth - 500) / 2
    this.offsetY = (this.offsetHeight - 500) / 2
    this.x0 = 0
    this.y0 = 500
    this.x1 = 276
    this.y1 = 500
    this.x2 = 500
    this.y2 = 276
    this.x3 = 500
    this.y3 = 0
    this.width = this.x3 - this.x0
    this.height = this.y0 - this.y3

    this.update()
  }

  update() {
    super.doRender()
  }

  plot(f, b, axis) {
    let size = axis == 'y' ? this.width : this.height
    let coords = ""

    for (let i = 0; i <= size; i++) {
      let j = i / size

      coords += ` ${j * size},${f(j, b)}`
    }

    return coords
  }

  render() {
    if (this.offsetX) {
      return `
        <svg>
          <g transform="translate(${this.offsetX}, ${this.offsetY})">
            <g opacity="0.14">
              <line x1="0" y1="0" x2="500" y2="0" stroke="#fff" stroke-width="2" stroke-linecap="round" />
              <line x1="0" y1="0" x2="0" y2="500" stroke="#fff" stroke-width="2" stroke-linecap="round" />
            </g>
            <g class="x-plots" transform="translate(0, ${this.y0}) rotate(-90, 0, 0)">
              <polyline points="${this.plot(f0, this.x0, 'x')}" fill="none" stroke="#ff0000" stroke-width="2" stroke-linecap="round" />
              <polyline points="${this.plot(f1, this.x1, 'x')}" fill="none" stroke="#ff00ff" stroke-width="2" stroke-linecap="round" />
              <polyline points="${this.plot(f2, this.x2, 'x')}" fill="none" stroke="#0000ff" stroke-width="2" stroke-linecap="round" />
              <polyline points="${this.plot(f3, this.x3, 'x')}" fill="none" stroke="#00ffff" stroke-width="2" stroke-linecap="round" />
            </g>
            <g class="y-plots" transform="translate(${this.x0}, 0)">
              <polyline points="${this.plot(f0, this.y0, 'y')}" fill="none" stroke="#ff0000" stroke-width="2" stroke-linecap="round" />
              <polyline points="${this.plot(f1, this.y1, 'y')}" fill="none" stroke="#ff00ff" stroke-width="2" stroke-linecap="round" />
              <polyline points="${this.plot(f2, this.y2, 'y')}" fill="none" stroke="#0000ff" stroke-width="2" stroke-linecap="round" />
              <polyline points="${this.plot(f3, this.y3, 'y')}" fill="none" stroke="#00ffff" stroke-width="2" stroke-linecap="round" />
            </g>
            <path d="M ${this.x0},${this.y0} C${this.x1},${this.y1} ${this.x2},${this.y2} ${this.x3},${this.y3}" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" />
            <circle cx="${this.x0}" cy="${this.y0}" fill="#ff0000" r="6" />
            <circle cx="${this.x1}" cy="${this.y1}" fill="#ff00ff" r="6" />
            <circle cx="${this.x2}" cy="${this.y2}" fill="#0000ff" r="6" />
            <circle cx="${this.x3}" cy="${this.y3}" fill="#00ffff" r="6" />
          </g>
        </svg>`

    }
  }
}

customElements.define('b-app', App)