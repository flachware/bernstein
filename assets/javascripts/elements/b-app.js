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

    this.x0 = false
    this.x1 = false
    this.x2 = false
    this.x3 = false
    this.y0 = true
    this.y1 = true
    this.y2 = true
    this.y3 = true
    this.canvas = 500
    this.offset = {}
    this.width
    this.height
    this.circle = {}
    this.dragging = false
    this.shift = false
    this.horizontal
    this.click = {}
    this.selected

    this.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('p'))
        this.handleMousedown(e)
    })

    this.addEventListener('mouseup', (e) => {
      this.handleMouseup(e)
    })

    this.addEventListener('click', (e) => {
      if (e.target.classList.contains('control'))
        this[e.target.id] = !this[e.target.id]
    })

    document.addEventListener('keydown', (e) => {
      if (e.key == 'Shift')
        this.shift = true
    })

    document.addEventListener('keyup', (e) => {
      if (e.key == 'Shift') {
        this.shift = false
        this.horizontal = undefined
      }
    })

    new ResizeObserver(this.update).observe(this)
  }

  handleMousedown = (e) => {
    this.click.x = e.clientX
    this.click.y = e.clientY
    this.selected = e.target.id.slice(-1)
    this.circle.x = e.clientX - this.offset.x - this.points[`x${this.selected}`]
    this.circle.y = this.canvas - (e.clientY - this.offset.y) - this.points[`y${this.selected}`]
    this.dragging = true
    this.addEventListener('mousemove', this.update)
  }

  handleMouseup = (e) => {
    this.dragging = false
    this.selected = null
    this.click.x = undefined
    this.horizontal = undefined
    this.removeEventListener('mousemove', this.update)
  }

  update = (e) => {
    this.offset.x = (this.offsetWidth - this.canvas) / 2
    this.offset.y = (this.offsetHeight - this.canvas) / 2
    this.width = this.points.x3 - this.points.x0
    this.height = this.points.y0 - this.points.y3

    if (this.dragging) {
      if (this.shift == true && typeof this.horizontal == 'undefined') {
        let dX = Math.abs(e.clientX - this.click.x)
        let dY = Math.abs(e.clientY - this.click.y)

        if (dX > 10 && dX > dY ) {
          this.horizontal = true

        } else if (dY > 10 && dY > dX ) {
          this.horizontal = false
        }
      }

      if (this.horizontal == true) {
        this.points[`x${this.selected}`] = e.clientX - this.offset.x - this.circle.x
        this.points[`y${this.selected}`] = this.canvas - (this.click.y - this.offset.y) - this.circle.y

      } else if (this.horizontal == false) {
        this.points[`x${this.selected}`] = this.click.x - this.offset.x - this.circle.x
        this.points[`y${this.selected}`] = this.canvas - (e.clientY - this.offset.y) - this.circle.y

      } else {
        this.points[`x${this.selected}`] = e.clientX - this.offset.x - this.circle.x
        this.points[`y${this.selected}`] = this.canvas - (e.clientY - this.offset.y) - this.circle.y
      }
    }

    super.doRender()
  }

  plotx(f, b) {
    let coords = ""

    if (this.height > 0) {
      for (let i = 0; i <= this.height; i++) {
        let j = i / this.height
        let y = j * this.height
        let x = f(j, b)

        coords += ` ${y},${x}`
      }

    } else if (this.height < 0) {
      for (let i = 0; i >= this.height; i--) {
        let j = i / this.height
        let y = j * this.height
        let x = f(j, b)

        coords += ` ${y},${x}`
      }

    } else {
      for (let i = 0; i <= this.canvas; i++) {
        let j = i / this.canvas
        let y = 0
        let x = f(j, b)

        coords += ` ${y},${x}`
      }
    }

    return coords
  }

  ploty(f, b) {
    let coords = ""

    if (this.width < 0) {
      for (let i = 0; i >= this.width; i--) {
        let j = i / this.width
        let x = this.points.x0 + j * this.width
        let y = f(j, b)

        coords += ` ${x},${y}`
      }

    } else if (this.width > 0) {
      for (let i = 0; i <= this.width; i++) {
        let j = i / this.width
        let x = this.points.x0 + j * this.width
        let y = f(j, b)

        coords += ` ${x},${y}`
      }

    } else {
      for (let i = 0; i <= this.canvas; i++) {
        let j = i / this.canvas
        let x = this.points.x0
        let y = f(j, b)

        coords += ` ${x},${y}`
      }
    }

    return coords
  }

  render() {
    if (this.points) {
      return `
        <svg>
          <defs>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse" x="50%" y="50%" patternTransform="translate(49, 49)">
              <rect width="100%" height="100%" fill="none" stroke="#fff" stroke-width="4" />
            </pattern>
          </defs>
          <g opacity="0.10">
            <rect width="100%" height="100%" fill="url(#grid)" />
          </g>
          <line x1="${this.offset.x}" y1="0" x2="${this.offset.x}" y2="100%" stroke="#333" stroke-width="2"/>
          <line x1="0" y1="${this.offset.y}" x2="100%" y2="${this.offset.y}" stroke="#333" stroke-width="2"/>
          <g transform="translate(${this.offset.x}, ${this.offset.y})">
            <!--<g class="x-plots" transform="scale(-1,1) rotate(90 0 0)">-->
            <g class="x-plots" transform="translate(0, ${this.points.y0}) rotate(-90, 0, 0)">
              <polyline class="plot" id="plot-x0" points="${this.plotx(f0, this.points.x0)}" fill="none" stroke="#ff0000" stroke-width="2" stroke-linecap="round" />
              <polyline class="plot" id="plot-x1" points="${this.plotx(f1, this.points.x1)}" fill="none" stroke="#ff8080" stroke-width="2" stroke-linecap="round" />
              <polyline class="plot" id="plot-x2" points="${this.plotx(f2, this.points.x2)}" fill="none" stroke="#8000ff" stroke-width="2" stroke-linecap="round" />
              <polyline class="plot" id="plot-x3" points="${this.plotx(f3, this.points.x3)}" fill="none" stroke="#0080ff" stroke-width="2" stroke-linecap="round" />
            </g>
            <g class="y-plots">
              <polyline class="plot" id="plot-y0" points="${this.ploty(f0, this.points.y0)}" fill="none" stroke="#ff0000" stroke-width="2" stroke-linecap="round" />
              <polyline class="plot" id="plot-y1" points="${this.ploty(f1, this.points.y1)}" fill="none" stroke="#ff8080" stroke-width="2" stroke-linecap="round" />
              <polyline class="plot" id="plot-y2" points="${this.ploty(f2, this.points.y2)}" fill="none" stroke="#8000ff" stroke-width="2" stroke-linecap="round" />
              <polyline class="plot" id="plot-y3" points="${this.ploty(f3, this.points.y3)}" fill="none" stroke="#0080ff" stroke-width="2" stroke-linecap="round" />
            </g>
            <path d="M ${this.points.x0},${this.points.y0} C${this.points.x1},${this.points.y1} ${this.points.x2},${this.points.y2} ${this.points.x3},${this.points.y3}" fill="none" stroke="#ddd" stroke-width="2" stroke-linecap="round" />
            <circle class="p" id="p0" cx="${this.points.x0}" cy="${this.points.y0}" fill="#ff0000" r="8" />
            <circle class="p" id="p1" cx="${this.points.x1}" cy="${this.points.y1}" fill="#ff8080" r="8" />
            <circle class="p" id="p2" cx="${this.points.x2}" cy="${this.points.y2}" fill="#8000ff" r="8" />
            <circle class="p" id="p3" cx="${this.points.x3}" cy="${this.points.y3}" fill="#0080ff" r="8" />
          </g>
        </svg>
        <div class="controls">
          <div class="control" id="x0"><div class="color" style="--color: #ff0000"></div>(1 – t)³ · x₀</div>
          <div class="control" id="x1"><div class="color" style="--color: #ff8080"></div>3t · (1 – t)² · x₁</div>
          <div class="control" id="x2"><div class="color" style="--color: #8000ff"></div>3t² · (1 – t) · x₂</div>
          <div class="control" id="x3"><div class="color" style="--color: #0080ff"></div>t³ · x₃</div>
          <div class="control" id="y0"><div class="color" style="--color: #ff0000"></div>(1 – t)³ · y₀</div>
          <div class="control" id="y1"><div class="color" style="--color: #ff8080"></div>3t · (1 – t)² · y₁</div>
          <div class="control" id="y2"><div class="color" style="--color: #8000ff"></div>3t² · (1 – t) · y₂</div>
          <div class="control" id="y3"><div class="color" style="--color: #0080ff"></div>t³ · y₃</div>
        </div>`
    }
  }
}

App.propTypes = {
  x0: Boolean,
  x1: Boolean,
  x2: Boolean,
  x3: Boolean,
  y0: Boolean,
  y1: Boolean,
  y2: Boolean,
  y3: Boolean,
  dragging: Boolean
}

customElements.define('b-app', App)
