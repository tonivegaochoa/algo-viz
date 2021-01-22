const graph = document.querySelector('#graph');
const wall = document.querySelector('#wall');
const startBtn = document.querySelector('#start');
let nodes = [];
let visited = [];
let n = 20;
let start = null;
let end = null;
let isDrawing = false;
let found = false;

wall.addEventListener('click', function() {
    nodes.forEach(row => row.forEach(node => {
        node.addEventListener('mousedown', function() {
            isDrawing = true;
        });
        node.addEventListener('mousemove', function() {
            if(isDrawing) {
                this.style.backgroundColor = 'black';
            }
        });
        node.addEventListener('mouseup', function() {
            isDrawing = false;
        });
    }));
});

startBtn.addEventListener('click', function() {
    dfs(start);
});

for(let i = 0; i < n; i++) {
    let row = [];
    let rowV = [];
    for(let j = 0; j < n; j++) {
        const node = document.createElement('div');
        node.classList.add('node');
        node.setAttribute('i', i);
        node.setAttribute('j', j);
        graph.appendChild(node);
        node.addEventListener('click', select);
        row.push(node);
        rowV.push(0);
    }
    nodes.push(row);
    visited.push(rowV);
}

function select(e) {
    if(!start) {
        start = this;
        start.style.backgroundColor = 'green';
    } else if(!end) {
        end = this;
        end.style.backgroundColor = 'yellow';
    }
}

function dfs(node) {
    let i = Number(node.getAttribute('i'));
    let j = Number(node.getAttribute('j'));

    if(visited[i][j] === 1) return;
    if(node === end) {
        found = true;
        return;
    }

    if(node !== start) {
        node.style.backgroundColor = 'blue';
    }

    console.log()

    visited[i][j] = 1;

    //visit top [i-1][j]
    if(!found && i-1 >= 0 && nodes[i-1][j].style.backgroundColor != 'black') {
        dfs(nodes[i-1][j]);
    }
    //visit right [i][j+1]
    if(!found && j+1 < n && nodes[i][j+1].style.backgroundColor != 'black') {
        dfs(nodes[i][j+1]);
    }
    //visit bottom [i+1][j]
    if(!found && i+1 < n && nodes[i+1][j].style.backgroundColor != 'black') {
        dfs(nodes[i+1][j]);
    }
    //visit left [i][j-1]
    if(!found && j-1 >= 0 && nodes[i][j-1].style.backgroundColor != 'black') {
        dfs(nodes[i][j-1]);
    }
}



