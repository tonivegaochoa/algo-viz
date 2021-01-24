const graph = document.querySelector('#graph');
const rows = 31;
const cols = 62;

let nodes = [];
let visited = [];

for(let i = 0; i < rows; i++) {
    let row = [];
    let rowVisited = [];
    for(let j = 0; j < cols; j++) {
        const node = document.createElement('div');
        node.classList.add('node');
        node.setAttribute('i', i);
        node.setAttribute('j', j);
        node.setAttribute('draggable', true);
        graph.appendChild(node);

        node.addEventListener('dragover', dragover_handler);
        node.addEventListener('drop', drop_handler);

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
endIcon.addEventListener('dragstart', dragstart_handler)

function dragstart_handler(ev) {
    ev.dataTransfer.setData("application/my-app", ev.target.id);
    ev.dataTransfer.effectAllowed = "move";
}

function dragover_handler(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
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
}