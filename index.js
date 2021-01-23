const graph = document.querySelector('#graph');
const wall = document.querySelector('#wall');
const dfsBtn = document.querySelector('#dfs');
const bfsBtn = document.querySelector('#bfs');
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

dfsBtn.addEventListener('click', function() {
    dfs(start);
});

bfsBtn.addEventListener('click', function() {
    bfs(start);
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
        node.addEventListener('click', function() {
            console.log(this);
        });
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

function bfs(node) {
    let Q = [node];
    let prev = [];
    let delay = 0;

    for(let i = 0; i < n*n; i++) {
        prev.push(null);
    }

    while(Q.length > 0) {
        let curr = Q.shift();
        let i = Number(curr.getAttribute('i'));
        let j = Number(curr.getAttribute('j'));

        if(curr === end) {
            break;
        }

        if(curr !== start) {
            curr.style.cssText = `animation-name: search; animation-delay: ${delay}ms;`;
            delay += 25;
        }

        visited[i][j] = 1;

        //visit top [i-1][j]
        if(i-1 >= 0 && nodes[i-1][j].style.backgroundColor != 'black' && visited[i-1][j] === 0) {
            Q.push(nodes[i-1][j]);
            prev[(i-1)*n + j] = curr;
            visited[i-1][j] = 1;
        }
        //visit right [i][j+1]
        if(j+1 < n && nodes[i][j+1].style.backgroundColor != 'black' && visited[i][j+1] === 0) {
            Q.push(nodes[i][j+1]);
            prev[i*n + j+1] = curr;
            visited[i][j+1] = 1;
        }
        //visit bottom [i+1][j]
        if(i+1 < n && nodes[i+1][j].style.backgroundColor != 'black' && visited[i+1][j] === 0) {
            Q.push(nodes[i+1][j]);
            prev[(i+1)*n + j] = curr;
            visited[i+1][j] = 1;
        }
        //visit left [i][j-1]
        if(j-1 >= 0 && nodes[i][j-1].style.backgroundColor != 'black' && visited[i][j-1] === 0) {
            Q.push(nodes[i][j-1]);
            prev[i*n + j-1] = curr;
            visited[i][j+1] = 1;
        }
    }

    setTimeout(() => {
        let i = Number(end.getAttribute('i'));
        let j = Number(end.getAttribute('j'));
        let curr = prev[i*n + j];
        let path = [end];

        delay = 50;
        while(curr !== null) {
            path.push(curr);
            i = Number(curr.getAttribute('i'));
            j = Number(curr.getAttribute('j'));
            curr = prev[i*n + j];
        }

        path = path.reverse();
        path.forEach(node => {
            node.classList.add('path');
            node.style.cssText = `background-color: rgb(0, 217, 255); animation-name: path; animation-delay: ${delay}ms;`;
            delay += 50;
        });
    }, delay);
}



