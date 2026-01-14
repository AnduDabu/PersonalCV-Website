import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, MousePointer2 } from 'lucide-react';

const ROWS = 20;
const COLS = 40;

const PathfindingVisualizer = () => {
    const [grid, setGrid] = useState([]);
    const [mouseIsPressed, setMouseIsPressed] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [algorithm, setAlgorithm] = useState('dijkstra'); // 'dijkstra' or 'astar'
    const [key, setKey] = useState(0);

    const lastTouchedNode = useRef(null);

    // Default positions
    const START_NODE_ROW = 10;
    const START_NODE_COL = 5;
    const FINISH_NODE_ROW = 10;
    const FINISH_NODE_COL = 35;

    useEffect(() => {
        const initialGrid = getInitialGrid();
        setGrid(initialGrid);
    }, []);

    const getInitialGrid = () => {
        const grid = [];
        for (let row = 0; row < ROWS; row++) {
            const currentRow = [];
            for (let col = 0; col < COLS; col++) {
                currentRow.push(createNode(col, row));
            }
            grid.push(currentRow);
        }
        return grid;
    };

    const createNode = (col, row) => {
        return {
            col,
            row,
            isStart: row === START_NODE_ROW && col === START_NODE_COL,
            isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
            distance: Infinity,
            totalDistance: Infinity, // For A* (f = g + h)
            isVisited: false,
            isWall: false,
            previousNode: null,
            isPath: false,
        };
    };

    const handleMouseDown = (row, col) => {
        if (isRunning) return;
        const newGrid = getNewGridWithWallToggled(grid, row, col);
        setGrid(newGrid);
        setMouseIsPressed(true);
    };

    const handleMouseEnter = (row, col) => {
        if (!mouseIsPressed || isRunning) return;
        const newGrid = getNewGridWithWallToggled(grid, row, col);
        setGrid(newGrid);
    };

    const handleMouseUp = () => {
        setMouseIsPressed(false);
    };

    const getNewGridWithWallToggled = (grid, row, col) => {
        const newGrid = grid.slice();
        const node = newGrid[row][col];
        if (node.isStart || node.isFinish) return newGrid;
        const newNode = {
            ...node,
            isWall: !node.isWall,
        };
        newGrid[row][col] = newNode;
        return newGrid;
    };

    const scrollContainerRef = useRef(null);
    const lastScrollPos = useRef(null);

    const handleTouchStart = (e) => {
        if (isRunning) return;
        if (e.touches.length === 2) {
            lastScrollPos.current = { x: (e.touches[0].clientX + e.touches[1].clientX) / 2, y: (e.touches[0].clientY + e.touches[1].clientY) / 2 };
        } else if (e.touches.length === 1) {
            const touch = e.touches[0];
            const element = document.elementFromPoint(touch.clientX, touch.clientY);
            if (element && element.id.startsWith('node-')) {
                const [_, rowStr, colStr] = element.id.split('-');
                handleMouseDown(parseInt(rowStr), parseInt(colStr));
                lastTouchedNode.current = { row: parseInt(rowStr), col: parseInt(colStr) };
            }
        }
    };

    // Touch Support
    const handleTouchMove = (e) => {
        if (isRunning) return;

        // 2-Finger Drag -> Scroll Container
        if (e.touches.length === 2 && scrollContainerRef.current) {
            if (e.cancelable) e.preventDefault();

            const currentX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
            const currentY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

            if (lastScrollPos.current) {
                const deltaX = lastScrollPos.current.x - currentX;
                const deltaY = lastScrollPos.current.y - currentY;

                scrollContainerRef.current.scrollLeft += deltaX;
                scrollContainerRef.current.scrollTop += deltaY;
            }

            lastScrollPos.current = { x: currentX, y: currentY };
            return;
        }

        // 1-Finger -> Draw Wall
        if (e.touches.length === 1) {
            if (e.cancelable) e.preventDefault();
            const touch = e.touches[0];
            const element = document.elementFromPoint(touch.clientX, touch.clientY);

            if (element && element.id.startsWith('node-')) {
                const [_, rowStr, colStr] = element.id.split('-');
                const row = parseInt(rowStr);
                const col = parseInt(colStr);

                if (lastTouchedNode.current?.row === row && lastTouchedNode.current?.col === col) return;

                lastTouchedNode.current = { row, col };
                const newGrid = getNewGridWithWallToggled(grid, row, col);
                setGrid(newGrid);
            }
        }
    };

    const handleTouchEnd = () => {
        lastTouchedNode.current = null;
        lastScrollPos.current = null;
    };

    const clearPathVisualsOnly = () => {
        const newGrid = grid.slice();
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const node = newGrid[row][col];
                const newNode = {
                    ...node,
                    distance: Infinity,
                    totalDistance: Infinity,
                    isVisited: false,
                    isPath: false,
                    previousNode: null,
                };
                newGrid[row][col] = newNode;
                const element = document.getElementById(`node-${row}-${col}`);
                if (element) {
                    element.classList.remove('animate-visited', 'animate-path', 'bg-primary/50', 'bg-yellow-400', 'animate-pulse');
                }
            }
        }
        setGrid(newGrid);
        setIsRunning(false);
    };

    // Algorithms
    const runPathfinding = () => {
        clearPathVisualsOnly();
        setIsRunning(true);

        const gridCopy = grid.map(row => row.map(node => ({ ...node })));
        const startNode = gridCopy[START_NODE_ROW][START_NODE_COL];
        const finishNode = gridCopy[FINISH_NODE_ROW][FINISH_NODE_COL];
        let visitedNodesInOrder;

        if (algorithm === 'dijkstra') {
            visitedNodesInOrder = dijkstra(gridCopy, startNode, finishNode);
        } else {
            visitedNodesInOrder = aStar(gridCopy, startNode, finishNode);
        }

        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        animatePathfinding(visitedNodesInOrder, nodesInShortestPathOrder);
    };

    const dijkstra = (grid, startNode, finishNode) => {
        const visitedNodesInOrder = [];
        startNode.distance = 0;
        const unvisitedNodes = getAllNodes(grid);
        while (!!unvisitedNodes.length) {
            sortNodesByDistance(unvisitedNodes);
            const closestNode = unvisitedNodes.shift();
            if (closestNode.isWall) continue;
            if (closestNode.distance === Infinity) return visitedNodesInOrder;
            closestNode.isVisited = true;
            visitedNodesInOrder.push(closestNode);
            if (closestNode === finishNode) return visitedNodesInOrder;
            updateUnvisitedNeighbors(closestNode, grid);
        }
    };

    const aStar = (grid, startNode, finishNode) => {
        const visitedNodesInOrder = [];
        startNode.distance = 0;
        startNode.totalDistance = 0;
        let openSet = [startNode];

        while (openSet.length > 0) {
            openSet.sort((a, b) => a.totalDistance - b.totalDistance);
            const closestNode = openSet.shift();

            if (closestNode.isWall) continue;

            closestNode.isVisited = true;
            visitedNodesInOrder.push(closestNode);

            if (closestNode === finishNode) return visitedNodesInOrder;

            updateUnvisitedNeighborsAStar(closestNode, grid, finishNode, openSet);
        }
        return visitedNodesInOrder;
    };

    const sortNodesByDistance = (unvisitedNodes) => {
        unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
    };

    const updateUnvisitedNeighbors = (node, grid) => {
        const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
        for (const neighbor of unvisitedNeighbors) {
            neighbor.distance = node.distance + 1;
            neighbor.previousNode = node;
        }
    };

    const manhattanDistance = (nodeA, nodeB) => {
        return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
    };

    const updateUnvisitedNeighborsAStar = (node, grid, finishNode, openSet) => {
        const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
        for (const neighbor of unvisitedNeighbors) {
            const tentativeDistance = node.distance + 1;
            if (!openSet.includes(neighbor) || tentativeDistance < neighbor.distance) {
                neighbor.distance = tentativeDistance;
                neighbor.totalDistance = neighbor.distance + manhattanDistance(neighbor, finishNode);
                neighbor.previousNode = node;
                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor);
                }
            }
        }
    };

    const getUnvisitedNeighbors = (node, grid) => {
        const neighbors = [];
        const { col, row } = node;
        if (row > 0) neighbors.push(grid[row - 1][col]);
        if (row < ROWS - 1) neighbors.push(grid[row + 1][col]);
        if (col > 0) neighbors.push(grid[row][col - 1]);
        if (col < COLS - 1) neighbors.push(grid[row][col + 1]);
        return neighbors.filter(neighbor => !neighbor.isVisited);
    };

    const getAllNodes = (grid) => {
        const nodes = [];
        for (const row of grid) {
            for (const node of row) {
                nodes.push(node);
            }
        }
        return nodes;
    };

    const getNodesInShortestPathOrder = (finishNode) => {
        const nodesInShortestPathOrder = [];
        let currentNode = finishNode;
        while (currentNode !== null) {
            nodesInShortestPathOrder.unshift(currentNode);
            currentNode = currentNode.previousNode;
        }
        return nodesInShortestPathOrder;
    };

    const animatePathfinding = (visitedNodesInOrder, nodesInShortestPathOrder) => {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    animateShortestPath(nodesInShortestPathOrder);
                }, 10 * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                // Mutate the ORIGINAL grid state (silently) for efficient checking later
                const realNode = grid[node.row][node.col];
                if (realNode) realNode.isVisited = true;

                if (!node.isStart && !node.isFinish) {
                    const el = document.getElementById(`node-${node.row}-${node.col}`);
                    if (el) {
                        el.classList.add('bg-primary/50', 'animate-visited');
                        el.classList.remove('bg-white', 'dark:bg-background');
                    }
                }
            }, 10 * i);
        }
    };

    const animateShortestPath = (nodesInShortestPathOrder) => {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                const realNode = grid[node.row][node.col];
                if (realNode) realNode.isPath = true;

                if (!node.isStart && !node.isFinish) {
                    const el = document.getElementById(`node-${node.row}-${node.col}`);
                    if (el) {
                        el.classList.remove('bg-primary/50', 'animate-visited');
                        el.classList.add('bg-yellow-400', 'animate-pulse');
                    }
                }

                if (i === nodesInShortestPathOrder.length - 1) {
                    const finalGrid = grid.map(row => row.map(n => ({ ...n })));
                    setGrid(finalGrid);
                    setIsRunning(false);
                }
            }, 30 * i);
        }
    };

    const clearPath = () => {
        clearPathVisualsOnly();
    };

    const clearBoard = () => {
        const initialGrid = getInitialGrid();
        setGrid(initialGrid);
        setIsRunning(false);
        setKey(prev => prev + 1);
    };

    return (
        <div className="bg-white/50 dark:bg-surface/30 border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-sm dark:shadow-none transition-colors duration-300">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-900 dark:text-white transition-colors duration-300">
                <MousePointer2 className="w-6 h-6 text-primary" /> Pathfinding Algorithm
            </h2>

            <div className="flex flex-wrap gap-4 mb-6">
                <button
                    onClick={runPathfinding}
                    disabled={isRunning}
                    className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Play className="w-4 h-4 fill-current" /> Visualize {algorithm === 'astar' ? 'A*' : 'Dijkstra'}
                </button>
                <button
                    onClick={clearBoard}
                    disabled={isRunning}
                    className="flex items-center gap-2 px-6 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-surface dark:hover:bg-surface/80 border border-gray-200 dark:border-white/10 rounded-lg font-medium transition-all text-gray-700 dark:text-gray-200"
                >
                    <RotateCcw className="w-4 h-4" /> Reset
                </button>

                <div className="flex items-center gap-2 bg-gray-100 dark:bg-surface/50 rounded-lg border border-gray-200 dark:border-white/10 p-1 transition-colors duration-300">
                    <button
                        onClick={() => {
                            setAlgorithm('dijkstra');
                            clearPath();
                        }}
                        disabled={isRunning}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${algorithm === 'dijkstra' ? 'bg-white dark:bg-primary text-primary dark:text-white shadow' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                    >
                        Dijkstra
                    </button>
                    <button
                        onClick={() => {
                            setAlgorithm('astar');
                            clearPath();
                        }}
                        disabled={isRunning}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${algorithm === 'astar' ? 'bg-white dark:bg-primary text-primary dark:text-white shadow' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                    >
                        A*
                    </button>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 ml-auto transition-colors duration-300">
                    <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-500 rounded-sm"></div> Start</div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-500 rounded-sm"></div> End</div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-700 dark:bg-gray-800 border border-gray-300 dark:border-white/20 rounded-sm"></div> Wall</div>
                </div>
            </div>

            <div key={key} className="overflow-x-auto pb-4" ref={scrollContainerRef}>
                <div className="inline-block min-w-full">
                    <div
                        className="grid gap-[1px] bg-gray-200 dark:bg-white/5 p-1 rounded-lg w-fit mx-auto transition-colors duration-300 touch-none"
                        style={{ gridTemplateColumns: `repeat(${COLS}, min-content)` }}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        {grid.map((row, rowIdx) => {
                            return row.map((node, nodeIdx) => {
                                const { row, col, isFinish, isStart, isWall, isPath, isVisited } = node;
                                return (
                                    <div
                                        key={`node-${row}-${col}`}
                                        id={`node-${row}-${col}`}
                                        className={`w-4 h-4 md:w-6 md:h-6 border border-gray-100 dark:border-white/5 rounded-[2px] transition-colors duration-300 
                                            ${isFinish ? 'bg-red-500 scale-110 shadow-lg shadow-red-500/50 z-10' :
                                                isStart ? 'bg-green-500 scale-110 shadow-lg shadow-green-500/50 z-10' :
                                                    isWall ? 'bg-gray-600 dark:bg-gray-700 animate-pop' :
                                                        isPath ? 'bg-yellow-400 animate-path' :
                                                            isVisited ? 'bg-primary/50 animate-visited' :
                                                                'bg-white dark:bg-background hover:bg-gray-100 dark:hover:bg-white/5'}`}
                                        onMouseDown={() => handleMouseDown(row, col)}
                                        onMouseEnter={() => handleMouseEnter(row, col)}
                                        onMouseUp={() => handleMouseUp()}
                                        onTouchStart={(e) => {
                                            if (e.cancelable) e.preventDefault();
                                            handleMouseDown(row, col);
                                            lastTouchedNode.current = { row, col };
                                        }}
                                    ></div>
                                );
                            });
                        })}
                    </div>
                </div>
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
                {/* Desktop Instructions */}
                <div className="bg-gray-100 dark:bg-surface/50 p-4 rounded-xl border border-gray-200 dark:border-white/5">
                    <h3 className="font-bold text-primary mb-3 flex items-center gap-2">
                        <MousePointer2 className="w-4 h-4" /> Desktop Controls
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <li className="flex items-start gap-2">
                            <span className="font-bold text-gray-900 dark:text-gray-200">Draw Walls:</span>
                            <span>Click & Drag on empty cells.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-bold text-gray-900 dark:text-gray-200">Move:</span>
                            <span>Drag Start (Green) or Finish (Red) nodes.</span>
                        </li>
                    </ul>
                </div>

                {/* Mobile Instructions */}
                <div className="bg-gray-100 dark:bg-surface/50 p-4 rounded-xl border border-gray-200 dark:border-white/5">
                    <h3 className="font-bold text-primary mb-3 flex items-center gap-2">
                        <span className="text-lg">👆</span> Mobile Controls
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <li className="flex items-start gap-2">
                            <span className="font-bold text-gray-900 dark:text-gray-200">1-Finger Drag:</span>
                            <span>Draw Walls.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-bold text-gray-900 dark:text-gray-200">2-Finger Drag:</span>
                            <span>Pan/Scroll the grid view.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PathfindingVisualizer;
