const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const lineWidth = document.getElementById('lineWidth');
const backgroundUpload = document.getElementById('backgroundUpload');

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let isEraser = false;

// Undo/Redo stacks
const undoStack = [];
const redoStack = [];

// Save current canvas state to the undo stack
function saveState() {
  undoStack.push(canvas.toDataURL());
  if (undoStack.length > 10) undoStack.shift(); // Limit undo history to 10 steps
}

// Start drawing
canvas.addEventListener('mousedown', (e) => {
  saveState();
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
});

// Draw or erase on the canvas
canvas.addEventListener('mousemove', (e) => {
  if (!isDrawing) return;

  if (isEraser) {
    ctx.strokeStyle = '#FFFFFF'; // Eraser color
  } else {
    ctx.strokeStyle = colorPicker.value;
  }
  ctx.lineWidth = lineWidth.value;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  [lastX, lastY] = [e.offsetX, e.offsetY];
});

// Stop drawing
canvas.addEventListener('mouseup', () => (isDrawing = false));
canvas.addEventListener('mouseout', () => (isDrawing = false));

// Toggle between drawing and erasing
function toggleEraser() {
  isEraser = !isEraser;
  if (isEraser) {
    alert('Eraser is enabled');
  } else {
    alert('Drawing mode is enabled');
  }
}

// Clear the canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  saveState();
}

// Save the drawing as an image
function saveImage() {
  const link = document.createElement('a');
  link.download = 'drawing.png';
  link.href = canvas.toDataURL();
  link.click();
}

// Upload and set a background image
backgroundUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Undo functionality
function undo() {
  if (undoStack.length > 0) {
    redoStack.push(canvas.toDataURL());
    const prevState = undoStack.pop();
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = prevState;
  }
}

// Redo functionality
function redo() {
  if (redoStack.length > 0) {
    undoStack.push(canvas.toDataURL());
    const nextState = redoStack.pop();
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = nextState;
  }
}
