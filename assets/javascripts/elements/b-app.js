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
    this.res = 500

    this.update()
  }

  update() {
    super.doRender()
  }

  plotx(f, b) {
    let coords = ""

    for (let i = 0; i <= this.res; i++) {
      let j = i / this.res
      let y = bernstein(this.y0, this.y1, this.y2, this.y3, j)
      //let y = j * this.res

      coords += ` ${y},${f(j, b)}`
    }

    return coords
  }

  ploty(f, b) {
    let coords = ""

    for (let i = 0; i <= this.res; i++) {
      let j = i / this.res
      let x = bernstein(this.x0, this.x1, this.x2, this.x3, j)
      //let x = j * this.res

      coords += ` ${x},${f(j, b)}`
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
            <g class="x-plots" transform="scale(-1,1) rotate(90 0 0)">
            <!--<g class="x-plots" transform="translate(0 ${this.height}) rotate(-90 0 0)">-->
              <polyline points="${this.plotx(f0, this.x0)}" fill="none" stroke="#ff0000" stroke-width="2" stroke-linecap="round" />
              <polyline points="${this.plotx(f1, this.x1)}" fill="none" stroke="#ff00ff" stroke-width="2" stroke-linecap="round" />
              <polyline points="${this.plotx(f2, this.x2)}" fill="none" stroke="#0000ff" stroke-width="2" stroke-linecap="round" />
              <polyline points="${this.plotx(f3, this.x3)}" fill="none" stroke="#00ffff" stroke-width="2" stroke-linecap="round" />
            </g>
            <g class="y-plots">
              <polyline points="${this.ploty(f0, this.y0)}" fill="none" stroke="#ff0000" stroke-width="2" stroke-linecap="round" />
              <polyline points="${this.ploty(f1, this.y1)}" fill="none" stroke="#ff00ff" stroke-width="2" stroke-linecap="round" />
              <polyline points="${this.ploty(f2, this.y2)}" fill="none" stroke="#0000ff" stroke-width="2" stroke-linecap="round" />
              <polyline points="${this.ploty(f3, this.y3)}" fill="none" stroke="#00ffff" stroke-width="2" stroke-linecap="round" />
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