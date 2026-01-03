const rootStyles = window.getComputedStyle(document.documentElement);
const primaryColor = rootStyles.getPropertyValue("--color-brand--secondary").trim(); // Use .trim() to remove potential leading/trailing spaces

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const control1 = document.getElementById("control1");
const control2 = document.getElementById("control2");
const container = document.getElementById("canvasContainer");

let isDragging = false;
let activeControl = null;

// Set canvas size
function resizeCanvas() {
  const rect = container.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  draw();
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Get normalized coordinates (0-1 range, inverted Y)
function getNormalizedCoords(element) {
  const x = parseFloat(element.style.left) / 100;
  const y = 1 - parseFloat(element.style.top) / 100; // Invert Y axis
  return { x, y };
}

// Get pixel coordinates for drawing (accounts for canvas position)
function getPixelCoords(element) {
  const rect = container.getBoundingClientRect();
  const canvasRect = canvas.getBoundingClientRect();
  const x = (parseFloat(element.style.left) / 100) * canvasRect.width;
  const y = (parseFloat(element.style.top) / 100) * canvasRect.height;
  return { x, y };
}

// Draw the bezier curve
function draw() {
  const width = canvas.width;
  const height = canvas.height;
  const padding = 40;

  ctx.clearRect(0, 0, width, height);

  // Draw grid
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 1;
  for (let i = 0; i <= 10; i++) {
    const x = padding + (width - padding * 2) * (i / 10);
    const y = padding + (height - padding * 2) * (i / 10);

    ctx.beginPath();
    ctx.moveTo(x, padding);
    ctx.lineTo(x, height - padding);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }

  // Get control point positions
  const c1 = getNormalizedCoords(control1);
  const c2 = getNormalizedCoords(control2);
  const c1Pixel = getPixelCoords(control1);
  const c2Pixel = getPixelCoords(control2);

  // Draw control lines - starting from vertical middle
  ctx.strokeStyle = "#667eea44";
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);

  const midY = height / 2;
  ctx.beginPath();
  ctx.moveTo(padding, midY);
  ctx.lineTo(c1Pixel.x, c1Pixel.y);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(width - padding, midY);
  ctx.lineTo(c2Pixel.x, c2Pixel.y);
  ctx.stroke();

  ctx.setLineDash([]);

  // Draw bezier curve
  ctx.strokeStyle = "#667eea";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(padding, midY);
  ctx.bezierCurveTo(
    padding + (width - padding * 2) * c1.x,
    midY - (height - padding * 2) * (c1.y - 0.5),
    padding + (width - padding * 2) * c2.x,
    midY - (height - padding * 2) * (c2.y - 0.5),
    width - padding,
    midY
  );
  ctx.stroke();

  // Draw start and end points
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(padding, midY, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(width - padding, midY, 6, 0, Math.PI * 2);
  ctx.fill();

  updateOutput();
}

// Update output display
function updateOutput() {
  const c1 = getNormalizedCoords(control1);
  const c2 = getNormalizedCoords(control2);

  const value = `cubic-bezier(${c1.x.toFixed(2)}, ${c1.y.toFixed(2)}, ${c2.x.toFixed(
    2
  )}, ${c2.y.toFixed(2)})`;
  document.getElementById("outputValue").textContent = value;
}

// Handle dragging
function startDrag(e, control) {
  isDragging = true;
  activeControl = control;
  control.classList.add("active");
  e.preventDefault();
}

function drag(e) {
  if (!isDragging || !activeControl) return;

  const rect = container.getBoundingClientRect();
  let x, y;

  if (e.type.startsWith("touch")) {
    x = e.touches[0].clientX - rect.left;
    y = e.touches[0].clientY - rect.top;
  } else {
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;
  }

  const percentX = Math.max(0, Math.min(100, (x / rect.width) * 100));
  const percentY = Math.max(0, Math.min(100, (y / rect.height) * 100));

  activeControl.style.left = percentX + "%";
  activeControl.style.top = percentY + "%";

  draw();
}

function endDrag() {
  if (activeControl) {
    activeControl.classList.remove("active");
  }
  isDragging = false;
  activeControl = null;
}

// Event listeners
control1.addEventListener("mousedown", (e) => startDrag(e, control1));
control2.addEventListener("mousedown", (e) => startDrag(e, control2));
control1.addEventListener("touchstart", (e) => startDrag(e, control1));
control2.addEventListener("touchstart", (e) => startDrag(e, control2));

document.addEventListener("mousemove", drag);
document.addEventListener("touchmove", drag);
document.addEventListener("mouseup", endDrag);
document.addEventListener("touchend", endDrag);

// Copy to clipboard
const btn = document.querySelector(".bezier-curve-vizualizer__output-copy");

function copyToClipboard() {
  const value = document.getElementById("outputValue").textContent;
  navigator.clipboard.writeText(value).then(() => {
    btn.textContent = "Copied!";
    btn.classList.add("copied");
    setTimeout(() => {
      btn.textContent = "Copy to Clipboard";
      btn.classList.remove("copied");
    }, 2000);
  });
}

btn.addEventListener("click", copyToClipboard);

// Initial draw
draw();
