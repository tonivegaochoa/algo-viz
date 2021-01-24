const graph = document.querySelector('#graph');
const visualizeBtn = document.querySelector('#visualize');
const clearBoardBtn = document.querySelector('#clearBoard');
const clearWallsBtn = document.querySelector('#clearWalls');
const rows = 31;
const cols = 62;
const wallColor = 'rgb(12, 53, 70)';

let nodes = [];
let visited = [];
let isDrawing = false;

for(let i = 0; i < rows; i++) {
    let row = [];
    let rowVisited = [];
    for(let j = 0; j < cols; j++) {
        const node = document.createElement('div');
        node.classList.add('node');
        node.setAttribute('i', i);
        node.setAttribute('j', j);
        node.setAttribute('wall', false);
        graph.appendChild(node);

        node.addEventListener('dragover', dragover_handler);
        node.addEventListener('dragenter', dragenter_handler);
        node.addEventListener('dragleave', dragleave_handler);
        node.addEventListener('drop', drop_handler);
        node.addEventListener('mousedown', mousedown_handler);
        node.addEventListener('mouseenter', mouseenter_handler);
        node.addEventListener('mouseup', mouseup_handler);

        row.push(node);
        rowVisited.push(false);
    }
    nodes.push(row);
    visited.push(rowVisited);
}

let start = nodes[15][20];
const startIcon = document.querySelector('#start');
nodes[15][20].appendChild(startIcon);

let end = nodes[15][40];
const endIcon = document.querySelector('#end');
nodes[15][40].appendChild(endIcon);

startIcon.addEventListener('dragstart', dragstart_handler);
endIcon.addEventListener('dragstart', dragstart_handler);
clearBoardBtn.addEventListener('click', clearBoard);
clearWallsBtn.addEventListener('click', clearWalls);

function dragstart_handler(ev) {
    ev.dataTransfer.setData("application/my-app", ev.target.id);
    ev.dataTransfer.effectAllowed = "move";
}

function dragover_handler(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
}

function dragenter_handler(ev) {
    ev.preventDefault();
    this.style.cssText = '';
}

function dragleave_handler(ev) {
    ev.preventDefault();
    if(this.getAttribute('wall') === 'true') {
        this.style.cssText = 'animation-name: wall; animation-duration: 100ms; border: none; wall: true';
    }
}

function drop_handler(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("application/my-app");
    ev.target.appendChild(document.getElementById(data));
    if(data === 'start') {
        start = this;
    } else {
        end = this;
    }
    isDrawing = false;
}

function mousedown_handler() {
    isDrawing = true;
    startIcon.disabled = true;

    if(this === start || this === end) return;

    const isWall = !(this.getAttribute('wall') === 'false');

    if(isWall) {
        this.style.cssText = '';
        this.setAttribute('wall', false);
    } else {
        this.style.cssText = 'animation-name: wall; animation-duration: 100ms; border: none; wall: true'
        this.setAttribute('wall', true);
    }
}

function mouseenter_handler() {
    if(isDrawing) {
        if(this === start || this === end) return;

        const isWall = !(this.getAttribute('wall') === 'false');

        if(isWall) {
            this.style.cssText = '';
            this.setAttribute('wall', false);
        } else {
            this.style.cssText = 'animation-name: wall; animation-duration: 100ms; border: none; wall: true'
            this.setAttribute('wall', true);
        }
    }
}

function mouseup_handler() {
    isDrawing = false;
}

function clearWalls() {
    nodes.forEach(rows => rows.forEach(node => node.style.cssText = ''));
}

function clearBoard() {
    clearWalls();
    start = nodes[15][20];
    nodes[15][20].appendChild(startIcon);
    end = nodes[15][40];
    nodes[15][40].appendChild(endIcon);
}