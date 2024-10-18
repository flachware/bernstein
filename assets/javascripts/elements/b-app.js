import { CustomElement } from './custom-element.js'
import { f0, f1, f2, f3, bernstein } from '../helpers/bernstein.js'

export class App extends CustomElement {
  connectedCallback() {
    this.points = {
      x0: 0,
      y0: 500,
      x1: 276,
      y1: 500,
      x2: 500,
      y2: 276,
      x3: 500,
      y3: 0
    }

    this.canvas = 500
    this.width
    this.height
    this.offsetX = (this.offsetWidth - this.canvas) / 2
    this.offsetY = (this.offsetHeight - this.canvas) / 2

    this.dragging = false
    this.selected
    this.offset = {}

    this.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('p')) {
        this.selected = e.target.id.slice(-1)
        this.handleMousedown()
      }
    })

    this.addEventListener('mouseup', (e) => {
      this.handleMouseup(e)
    })

    this.update()
  }

  handleMousedown = () => {
    this.dragging = true
    this.addEventListener('mousemove', this.update)
  }

  handleMouseup = (e) => {
    this.dragging = false
    this.selected = null
    this.removeEventListener('mousemove', this.udpate)
  }

  update = (e) => {
    this.width = this.points.x3 - this.points.x0
    this.height = this.points.y0 - this.points.y3

    if (this.dragging) {
      this.points[`x${this.selected}`] = e.clientX - this.offsetX
      this.points[`y${this.selected}`] = this.canvas - (e.clientY - this.offsetY)
    }

    super.doRender()
  }

  plotx(f, b) {
    let coords = ""

    for (let i = 0; i <= this.canvas; i++) {
      let j = i / this.canvas
      //let y = bernstein(this.y0, this.y1, this.y2, this.y3, j)
      let y = j * this.canvas

      coords += ` ${y},${f(j, b)}`
    }

    return coords
  }

  ploty(f, b) {
    let coords = ""

    for (let i = 0; i <= this.canvas; i++) {
      let j = i / this.canvas
      //let x = bernstein(this.x0, this.x1, this.x2, this.x3, j)
      let x = j * this.canvas

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
            <!--<g class="x-plots" transform="scale(-1,1) rotate(90 0 0)">-->
            <g class="x-plots" transform="translate(0, 500) rotate(-90 0 0) ">
              <polyline points="${this.plotx(f0, this.points.x0)}" fill="none" stroke="#ff0000" stroke-width="2" stroke-linecap="round" />
              <polyline points="${this.plotx(f1, this.points.x1)}" fill="none" stroke="#ff00ff" stroke-width="2" stroke-linecap="round" />
              <polyline points="${this.plotx(f2, this.points.x2)}" fill="none" stroke="#0000ff" stroke-width="2" stroke-linecap="round" />
              <polyline points="${this.plotx(f3, this.points.x3)}" fill="none" stroke="#00ffff" stroke-width="2" stroke-linecap="round" />
            </g>
            <g class="y-plots">
              <polyline points="${this.ploty(f0, this.points.y0)}" fill="none" stroke="#ff0000" stroke-width="2" stroke-linecap="round" />
              <polyline points="${this.ploty(f1, this.points.y1)}" fill="none" stroke="#ff00ff" stroke-width="2" stroke-linecap="round" />
              <polyline points="${this.ploty(f2, this.points.y2)}" fill="none" stroke="#0000ff" stroke-width="2" stroke-linecap="round" />
              <polyline points="${this.ploty(f3, this.points.y3)}" fill="none" stroke="#00ffff" stroke-width="2" stroke-linecap="round" />
            </g>
            <path d="M ${this.points.x0},${this.points.y0} C${this.points.x1},${this.points.y1} ${this.points.x2},${this.points.y2} ${this.points.x3},${this.points.y3}" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" />
            <circle class="p" id="p0" cx="${this.points.x0}" cy="${this.points.y0}" fill="#ff0000" r="6" />
            <circle class="p" id="p1" cx="${this.points.x1}" cy="${this.points.y1}" fill="#ff00ff" r="6" />
            <circle class="p" id="p2" cx="${this.points.x2}" cy="${this.points.y2}" fill="#0000ff" r="6" />
            <circle class="p" id="p3" cx="${this.points.x3}" cy="${this.points.y3}" fill="#00ffff" r="6" />
          </g>
        </svg>`
    }
  }
}

App.propTypes = {
  dragging: Boolean
}

customElements.define('b-app', App)