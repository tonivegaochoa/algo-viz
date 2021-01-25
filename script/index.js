const graph = document.querySelector('#graph');
const select = document.querySelector('#algorithm-select');
const visualizeBtn = document.querySelector('#visualize');
const buttonSpan = document.querySelector('#button-span');
const clearBoardBtn = document.querySelector('#clearBoard');
const clearWallsBtn = document.querySelector('#clearWalls');
const clearPathBtn = document.querySelector('#clearPath');
const rows = 31;
const cols = 62;

let nodes = [];
let visited = [];
let prev = [];
let isDrawing = false;
let found = false;
let delayD = 0;

for(let i = 0; i < rows; i++) {
    let row = [];
    let rowVisited = [];
    let rowPrev = [];
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
        rowPrev.push(null);
    }
    nodes.push(row);
    visited.push(rowVisited);
    prev.push(rowPrev);
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
clearPathBtn.addEventListener('click', clearPath);
select.addEventListener('change', function() {
    buttonSpan.textContent = this.value
});

visualizeBtn.addEventListener('click', function() {
    if(select.value === 'BFS') {
        bfs()
    } else if(select.value === 'DFS') {
        clearPath();
        setTimeout(() => {
            dfs(start, null);
            setTimeout(() => {
                let i = Number(end.getAttribute('i'));
                let j = Number(end.getAttribute('j'));
                let curr = prev[i][j];
                let path = [end];

                delay = 100;
                while(curr !== null) {
                    path.push(curr);
                    i = Number(curr.getAttribute('i'));
                    j = Number(curr.getAttribute('j'));
                    curr = prev[i][j];
                }

                path = path.reverse();
                path.forEach(node => {
                    node.classList.add('path');
                    node.style.cssText = `background-color: rgb(0, 217, 255); animation-name: path; animation-delay: ${delay}ms;`;
                    delay += 50;
                });
            }, delayD+500);
        },100);
    }
});

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

    if(this === start || this === end) return;

    const isWall = !(this.getAttribute('wall') === 'false');

    if(isWall) {
        this.style.cssText = '';
        this.setAttribute('wall', false);
    } else {
        this.style.cssText = 'animation-name: wall; animation-duration: 100ms; border: none;';
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
            this.style.cssText = 'animation-name: wall; animation-duration: 100ms; border: none;';
            this.setAttribute('wall', true);
        }
    }
}

function mouseup_handler() {
    isDrawing = false;
}

function clearPath() {
    delayD = 0;
    found = false;
    nodes.forEach(rows => rows.forEach(node => {
        if(node.getAttribute('wall') == 'false') {
            node.style.cssText = '';
        }
    }));
    resetVisitedAndPrev();
}

function clearWalls() {
    nodes.forEach(rows => rows.forEach(node => {
        node.style.cssText = '';
        node.setAttribute('wall', false);
    }));
}

function clearBoard() {
    clearWalls();
    start = nodes[15][20];
    nodes[15][20].appendChild(startIcon);
    end = nodes[15][40];
    nodes[15][40].appendChild(endIcon);
}

function resetVisitedAndPrev() {
    for(let i = 0; i < rows; i++) {
        for(let j = 0; j < cols; j++) {
            prev[i][j] = null;
            visited[i][j] = false;
        }
    }
}

function dfs(node, prevNode) {
    let i = Number(node.getAttribute('i'));
    let j = Number(node.getAttribute('j'));

    if(visited[i][j] === 1) return;

    prev[i][j] = prevNode;

    if(node === end) {
        found = true;
        return;
    }

    node.style.cssText = `animation-name: search; animation-delay: ${delayD}ms;`;
    delayD += 15;

    visited[i][j] = 1;

    //visit top [i-1][j]
    if(!found && i-1 >= 0 && window.getComputedStyle(nodes[i-1][j]).backgroundColor != 'rgb(12, 53, 70)') {
        dfs(nodes[i-1][j], node);
    }
    //visit right [i][j+1]
    if(!found && j+1 < cols && window.getComputedStyle(nodes[i][j+1]).backgroundColor != 'rgb(12, 53, 70)') {
        dfs(nodes[i][j+1], node);
    }
    //visit bottom [i+1][j]
    if(!found && i+1 < rows && window.getComputedStyle(nodes[i+1][j]).backgroundColor != 'rgb(12, 53, 70)') {
        dfs(nodes[i+1][j], node);
    }
    //visit left [i][j-1]
    if(!found && j-1 >= 0 && window.getComputedStyle(nodes[i][j-1]).backgroundColor != 'rgb(12, 53, 70)') {
        dfs(nodes[i][j-1], node);
    }
}

function bfs() {
    let Q = [start];
    let delay = 0;
    let ptr = 0;

    clearPath();

    setTimeout(() => {
    while(ptr !== Q.length) {
        let curr = Q[ptr++];
        let i = Number(curr.getAttribute('i'));
        let j = Number(curr.getAttribute('j'));

        if(curr === end) {
            break;
        }

        curr.style.cssText = `animation-name: search; animation-delay: ${delay}ms;`;
        delay += 5;

        visited[i][j] = true;

        //visit top [i-1][j]
        if(i-1 >= 0 && window.getComputedStyle(nodes[i-1][j]).backgroundColor != 'rgb(12, 53, 70)' && !visited[i-1][j]) {
            Q.push(nodes[i-1][j]);
            prev[i-1][j] = curr;
            visited[i-1][j] = true;
        }
        //visit right [i][j+1]
        if(j+1 < cols && window.getComputedStyle(nodes[i][j+1]).backgroundColor != 'rgb(12, 53, 70)' && !visited[i][j+1]) {
            Q.push(nodes[i][j+1]);
            prev[i][j+1] = curr;
            visited[i][j+1] = true;
        }
        //visit bottom [i+1][j]
        if(i+1 < rows && window.getComputedStyle(nodes[i+1][j]).backgroundColor != 'rgb(12, 53, 70)' && !visited[i+1][j]) {
            Q.push(nodes[i+1][j]);
            prev[i+1][j] = curr;
            visited[i+1][j] = true;
        }
        //visit left [i][j-1]
        if(j-1 >= 0 && window.getComputedStyle(nodes[i][j-1]).backgroundColor != 'rgb(12, 53, 70)' && !visited[i][j-1]) {
            Q.push(nodes[i][j-1]);
            prev[i][j-1] = curr;
            visited[i][j-1] = true;
        }
    }

    setTimeout(() => {
        let i = Number(end.getAttribute('i'));
        let j = Number(end.getAttribute('j'));
        let curr = prev[i][j];
        let path = [end];

        delay = 100;
        while(curr !== null) {
            path.push(curr);
            i = Number(curr.getAttribute('i'));
            j = Number(curr.getAttribute('j'));
            curr = prev[i][j];
        }

        path = path.reverse();
        path.forEach(node => {
            node.classList.add('path');
            node.style.cssText = `background-color: rgb(0, 217, 255); animation-name: path; animation-delay: ${delay}ms;`;
            delay += 50;
        });
    }, delay+500);
    }, 100);
}