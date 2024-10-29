export const f0 = function(t, b0) {
  return Math.pow((1 - t), 3) * b0
}

export const f1 = function(t, b1) {
  return Math.pow((1 - t), 2) * 3 * t * b1
}

export const f2 = function(t, b2) {
  return Math.pow(t, 2) * 3 * (1 - t) * b2
}

export const f3 = function(t, b3) {
  return Math.pow(t, 3) * b3
}

export const bernstein = function(a, b, c, d, t) {
  return a * Math.pow((1 - t), 3) + 3 * b * Math.pow((1 - t), 2) * t + 3 * c * (1 - t) * Math.pow(t, 2) + d * Math.pow(t, 3)
}
